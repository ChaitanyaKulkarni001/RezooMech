import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import html2pdf from "html2pdf.js";

const Section = ({ title, children }) => (
  <div className="mt-8">
    <h3 className="bg-purple-200 text-purple-900 text-xl font-medium px-3 py-2 rounded-t">
      {title}
    </h3>
    <div className="p-4 bg-purple-50 text-gray-800 rounded-b">
      {children}
    </div>
  </div>
);

const ResumeTemplate2 = ({ data = {} }) => {
  // Create a local state copy so the template is editable.
  const [editableData, setEditableData] = useState(data);
  // Toggle between view and edit mode.
  const [editable, setEditable] = useState(false);

  const resumeRef = useRef();
  const handlePrint = useReactToPrint({ content: () => resumeRef.current });
  const handleDownloadPdf = () => {
    if (resumeRef.current) {
      const opt = {
        margin: 0.5,
        filename: `${editableData.contact?.fullName?.replace(/\s+/g, '_') || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };
      html2pdf().set(opt).from(resumeRef.current).save();
    }
  };

  // Extract key sections from the editableData
  const contact = editableData.contact || {};
  const name = contact.fullName || "No Name Provided";
  const email = contact.email || "";
  const phone = contact.phone || "";
  const city = contact.city || "";
  const country = contact.country || "";
  const professionalSummary = editableData.summary || editableData.professionalSummary || "";
  
  // Skills handling: if string then split; if array, use as is.
  let skills = [];
  if (typeof editableData.skills === "string") {
    skills = editableData.skills.split(/[\s,]+/).filter(Boolean);
  } else if (Array.isArray(editableData.skills)) {
    skills = editableData.skills;
  }

  // Work Experience: assume it's an array.
  let experiences = [];
  if (Array.isArray(editableData.workExperience) && editableData.workExperience.length > 0) {
    experiences = editableData.workExperience.map((exp) => ({
      title: exp.jobTitle || "",
      date: `${exp.startMonth || ""} ${exp.startYear || ""} - ${exp.currentlyWorking ? "Present" : `${exp.endMonth || ""} ${exp.endYear || ""}`}`.trim(),
      location: [exp.city, exp.country].filter(Boolean).join(", "),
      details: exp.description ? [exp.description] : [],
    }));
  }

  // Education: assume it's an array.
  let educations = [];
  if (Array.isArray(editableData.education) && editableData.education.length > 0) {
    educations = editableData.education.map((edu) => ({
      degree: edu.degree || "",
      details: `${edu.schoolName || ""}, ${edu.fieldOfStudy || ""}${edu.location ? `, ${edu.location}` : ""}. Graduated: ${edu.graduationMonth || ""} ${edu.graduationYear || ""}. ${edu.description || ""}`,
    }));
  }

  // Projects: assume it's an array.
  const projects = Array.isArray(editableData.projects) ? editableData.projects : [];
  // Language, Volunteer, Additional Info remain as before.
  const language = editableData.language || {};
  const volunteer = (editableData.volunteer && Object.keys(editableData.volunteer).length > 0) ? editableData.volunteer : {};
  const additionalInfo = (editableData.additionalInfo && Object.keys(editableData.additionalInfo).length > 0) ? editableData.additionalInfo : {};

  const nameParts = name.split(' ');

  // Update editableData when a field is edited.
  const updateField = (section, field, value) => {
    setEditableData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Toggle edit mode.
  const toggleEdit = () => {
    setEditable((prev) => !prev);
  };

  return (
    <>
      <div className="flex justify-between items-center max-w-4xl mx-auto mt-8 px-4">
        <button
          onClick={handleDownloadPdf}
          className="bg-purple-700 text-white px-6 py-3 rounded-full shadow-md hover:bg-purple-800 transition duration-200"
        >
          Download Resume
        </button>
        <button
          onClick={toggleEdit}
          className="bg-gray-700 text-white px-6 py-3 rounded-full shadow-md hover:bg-gray-800 transition duration-200"
        >
          {editable ? "View Mode" : "Edit Mode"}
        </button>
      </div>

      <div className="max-w-4xl mx-auto my-10 p-8 bg-gray-50 border border-gray-300 rounded-lg shadow-lg font-sans">
        <div ref={resumeRef} className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center border-b-4 border-purple-300 pb-6 mb-6">
            <div>
              <h1 
                className="text-5xl font-extrabold text-purple-700"
                contentEditable={editable}
                suppressContentEditableWarning={true}
                onBlur={(e) => updateField("contact", "fullName", e.target.innerText)}
              >
                {nameParts[0]}
              </h1>
              <h2 
                className="text-3xl font-semibold text-purple-600"
                contentEditable={editable}
                suppressContentEditableWarning={true}
                onBlur={(e) => {
                  const newLastName = e.target.innerText;
                  updateField("contact", "fullName", `${nameParts[0]} ${newLastName}`);
                }}
              >
                {nameParts[1] || ''}
              </h2>
            </div>
            <div className="text-right text-base text-gray-600">
              <p
                contentEditable={editable}
                suppressContentEditableWarning={true}
                onBlur={(e) => updateField("contact", "city", e.target.innerText)}
              >
                {city}
                {city && country ? ', ' : ''}
                {country}
              </p>
              <p
                contentEditable={editable}
                suppressContentEditableWarning={true}
                onBlur={(e) => updateField("contact", "phone", e.target.innerText)}
              >
                {phone}
              </p>
              <p
                contentEditable={editable}
                suppressContentEditableWarning={true}
                onBlur={(e) => updateField("contact", "email", e.target.innerText)}
              >
                {email}
              </p>
            </div>
          </div>

          {/* Professional Summary */}
          {professionalSummary && (
            <Section title="PROFESSIONAL SUMMARY">
              <p 
                className="text-sm leading-relaxed"
                contentEditable={editable}
                suppressContentEditableWarning={true}
                onBlur={(e) => setEditableData((prev) => ({ ...prev, summary: e.target.innerText }))}
              >
                {professionalSummary}
              </p>
            </Section>
          )}

          {/* Experience Section */}
          {experiences.length > 0 && (
            <Section title="EXPERIENCE">
              {experiences.map((exp, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-lg">{exp.title}</p>
                    <span className="text-sm text-gray-500">{exp.date}</span>
                  </div>
                  <p className="text-md text-gray-600">{exp.location}</p>
                  <ul className="list-disc list-inside mt-3 space-y-1 text-sm">
                    {exp.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Section>
          )}

          {/* Projects Section */}
          {projects.length > 0 && (
            <Section title="PROJECTS">
              {projects.map((proj, index) => (
                <div key={index} className="mb-6">
                  <p className="font-bold text-lg">{proj.title}</p>
                  <p className="text-md text-gray-600">{proj.description}</p>
                </div>
              ))}
            </Section>
          )}

          {/* Education Section */}
          {educations.length > 0 && (
            <Section title="EDUCATION">
              {educations.map((edu, index) => (
                <div key={index} className="mb-6">
                  <p className="font-bold text-lg">{edu.degree}</p>
                  <p className="text-md text-gray-600">{edu.details}</p>
                </div>
              ))}
            </Section>
          )}

          {/* Skills Section */}
          {skills.length > 0 && (
            <Section title="SKILLS">
              <ul className="flex flex-wrap gap-3 text-sm">
                {skills.map((skill, index) => (
                  <li key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    {skill}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Language Section */}
          {language.name && (
            <Section title="LANGUAGE">
              <p className="font-bold">{language.name}</p>
              <p className="text-sm text-gray-600">{language.level}</p>
            </Section>
          )}

          {/* Volunteer Section */}
          {volunteer.title && (
            <Section title="VOLUNTEER">
              <div className="flex justify-between items-center">
                <p className="font-bold">{volunteer.title}</p>
                <span className="text-sm text-gray-500">{volunteer.date}</span>
              </div>
              <p className="text-sm text-gray-600">{volunteer.organization}</p>
              <ul className="list-disc list-inside mt-3 space-y-1 text-sm">
                {(volunteer.details || []).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* Additional Info Section */}
          {Object.keys(additionalInfo).length > 0 && (
            <Section title="ADDITIONAL INFO">
              <ul className="list-none space-y-1 text-sm">
                {Object.entries(additionalInfo).map(([key, value]) => (
                  <li key={key}>
                    <span className="font-bold">{key}: </span>
                    {value}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      </div>
    </>
  );
};

export default ResumeTemplate2;
