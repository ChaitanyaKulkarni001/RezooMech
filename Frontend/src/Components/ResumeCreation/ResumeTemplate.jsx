import React, { useRef, useState, useEffect } from 'react';
import html2pdf from "html2pdf.js";

// Helper component for a labeled section
const Section = ({ title, children }) => (
  <div className="mt-6">
    <h3 className="bg-gray-300 text-gray-700 text-lg font-semibold p-2">{title}</h3>
    <div className="p-2">{children}</div>
  </div>
);

const ResumeTemplate = ({ data = {} }) => {
  // Create a local editable copy of the incoming data.
  const [editableData, setEditableData] = useState(data);
  // Toggle edit mode.
  const [editMode, setEditMode] = useState(false);

  // Update editableData if the incoming data changes.
  useEffect(() => {
    setEditableData(data);
  }, [data]);

  // Extract contact details.
  const contact = editableData.contact || {};
  const name = contact.fullName || "No Name Provided";
  const email = contact.email || "";
  const phone = contact.phone || "";
  const city = contact.city || "";
  const country = contact.country || "";

  // Professional Summary.
  const professionalSummary = editableData.summary || editableData.professionalSummary || "";

  // Skills: convert string to array if needed.
  let skills = [];
  if (typeof editableData.skills === "string") {
    skills = editableData.skills.split(/[\s,]+/).filter(Boolean);
  } else if (Array.isArray(editableData.skills)) {
    skills = editableData.skills;
  }

  // Work Experience: map if array.
  let experiences = [];
  if (Array.isArray(editableData.workExperience) && editableData.workExperience.length > 0) {
    experiences = editableData.workExperience.map((exp) => ({
      title: exp.jobTitle || "",
      date: `${exp.startMonth || ""} ${exp.startYear || ""} - ${exp.currentlyWorking ? "Present" : `${exp.endMonth || ""} ${exp.endYear || ""}`}`.trim(),
      location: [exp.city, exp.country].filter(Boolean).join(", "),
      details: exp.description ? [exp.description] : [],
    }));
  }

  // Education: map if array.
  let educations = [];
  if (Array.isArray(editableData.education) && editableData.education.length > 0) {
    educations = editableData.education.map((edu) => ({
      degree: edu.degree || "",
      details: `${edu.schoolName || ""}, ${edu.fieldOfStudy || ""}${edu.location ? `, ${edu.location}` : ""}. Graduated: ${edu.graduationMonth || ""} ${edu.graduationYear || ""}. ${edu.description || ""}`,
    }));
  }

  // Projects.
  const projects = Array.isArray(editableData.projects) ? editableData.projects : [];

  // Languages, volunteer, additionalInfo.
  const languages = Array.isArray(editableData.languages) ? editableData.languages : [];
  const volunteer = (editableData.volunteer && Object.keys(editableData.volunteer).length > 0) ? editableData.volunteer : {};
  const additionalInfo = (editableData.additionalInfo && Object.keys(editableData.additionalInfo).length > 0) ? editableData.additionalInfo : {};

  // Split name for header display.
  const nameParts = name.split(' ');

  // Ref for PDF download.
  const resumeRef = useRef(null);
  const downloadResume = () => {
    if (resumeRef.current) {
      const opt = {
        margin: 0.5,
        filename: `${name.replace(/\s+/g, '_') || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };
      html2pdf().set(opt).from(resumeRef.current).save();
    }
  };

  // Toggle edit mode.
  const toggleEditMode = () => {
    setEditMode(prev => !prev);
  };

  // Update contact fields.
  const updateContactField = (field, value) => {
    setEditableData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      }
    }));
  };

  // Update professional summary.
  const updateSummary = (value) => {
    setEditableData(prev => ({
      ...prev,
      summary: value,
    }));
  };

  return (
    <div>
      {/* Top Controls */}
      <div className="max-w-3xl mx-auto mt-8 text-right">
        <button 
          onClick={downloadResume} 
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Download Resume
        </button>
        <button 
          onClick={toggleEditMode}
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editMode ? "View Mode" : "Edit Mode"}
        </button>
      </div>

      {/* Resume Content */}
      <div 
        ref={resumeRef} 
        className="max-w-3xl mx-auto my-8 p-6 bg-gray-100 rounded-lg shadow text-gray-800 font-raleway"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-gray-300 pb-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 border-2 border-orange-500 flex items-center justify-center text-orange-500 text-3xl font-bold">
              {name[0] || 'N'}
            </div>
            <h1 
              className="text-3xl font-bold text-orange-600"
              contentEditable={editMode}
              suppressContentEditableWarning={true}
              onBlur={(e) => updateContactField("fullName", e.target.innerText)}
            >
              {nameParts[0]?.toUpperCase()} <br />
              {nameParts[1] && nameParts[1].toUpperCase()}
            </h1>
          </div>
          <div className="text-right text-sm">
            <p 
              contentEditable={editMode}
              suppressContentEditableWarning={true}
              onBlur={(e) => updateContactField("city", e.target.innerText)}
            >
              {city}{city && country ? ', ' : ''}{country}
            </p>
            <p 
              contentEditable={editMode}
              suppressContentEditableWarning={true}
              onBlur={(e) => updateContactField("phone", e.target.innerText)}
            >
              {phone}
            </p>
            <p 
              contentEditable={editMode}
              suppressContentEditableWarning={true}
              onBlur={(e) => updateContactField("email", e.target.innerText)}
            >
              {email}
            </p>
          </div>
        </div>

        {/* Projects Section */}
        {projects.length > 0 && (
          <Section title="PROJECTS">
            {projects.map((project, index) => (
              <div key={index} className="mb-4">
                <p className="font-semibold flex justify-between">
                  {project.title}
                  <span className="text-sm text-gray-500">
                    {project.startMonth} {project.startYear} - {project.currentlyOngoing ? "Present" : `${project.endMonth} ${project.endYear}`}
                  </span>
                </p>
                {project.role && (
                  <p className="text-sm flex text-gray-600 ml-5">Role: {project.role}</p>
                )}
                {project.description && (
                  <p className="text-sm text-gray-600 ml-5">{project.description}</p>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Experience Section */}
        {experiences.length > 0 && (
          <Section title="EXPERIENCE">
            {experiences.map((exp, index) => (
              <div key={index} className="mb-4">
                <p className="font-semibold flex justify-between">
                  {exp.title}
                  <span className="text-sm text-gray-500">{exp.date}</span>
                </p>
                {exp.location && (
                  <p className="text-sm flex text-gray-600">{exp.location}</p>
                )}
                {exp.details && exp.details.length > 0 && (
                  <ul className="list-disc ml-5 mt-2 flex space-y-1 text-sm">
                    {exp.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Education Section */}
        {educations.length > 0 && (
          <Section title="EDUCATION">
            {educations.map((edu, index) => (
              <div key={index} className="mb-4 ml-5">
                <p className="font-semibold">{edu.degree}</p>
                <p className="text-sm">{edu.details}</p>
              </div>
            ))}
          </Section>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <Section title="SKILLS">
            <ul className="flex ml-3 flex-wrap gap-5 text-sm">
              {skills.map((skill, index) => (
                <li key={index} className="list-disc">{skill}</li>
              ))}
            </ul>
          </Section>
        )}

        {/* Languages Section */}
        {languages.length > 0 && (
          <Section title="LANGUAGES">
            {languages.map((lang, index) => (
              <div key={index}>
                <p className="font-semibold">{lang.name || 'N/A'}</p>
                <p className="text-sm">{lang.level || ''}</p>
              </div>
            ))}
          </Section>
        )}

        {/* Professional Summary */}
        {professionalSummary && (
          <Section title="PROFESSIONAL SUMMARY">
            <p 
              className="ml-4 text-sm text-justify"
              contentEditable={editMode}
              suppressContentEditableWarning={true}
              onBlur={(e) => updateSummary(e.target.innerText)}
            >
              {professionalSummary}
            </p>
          </Section>
        )}

        {/* Volunteer Section */}
        {volunteer && Object.keys(volunteer).length > 0 && (
          <Section title="VOLUNTEER">
            {volunteer.title && (
              <p className="font-semibold flex justify-between">
                {volunteer.title}
                {volunteer.date && (
                  <span className="text-sm text-gray-500">{volunteer.date}</span>
                )}
              </p>
            )}
            {volunteer.organization && (
              <p className="text-sm text-gray-600">{volunteer.organization}</p>
            )}
            {volunteer.details && volunteer.details.length > 0 && (
              <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
                {volunteer.details.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </Section>
        )}

        {/* Additional Info Section */}
        {additionalInfo && Object.keys(additionalInfo).length > 0 && (
          <Section title="ADDITIONAL INFO">
            <ul className="flex flex-col ml-4 space-y-2 text-sm">
              {Object.entries(additionalInfo).map(([key, value]) => (
                <li key={key}>
                  <span className="font-semibold">{key}: </span>
                  {value}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </div>
  );
};

export default ResumeTemplate;
