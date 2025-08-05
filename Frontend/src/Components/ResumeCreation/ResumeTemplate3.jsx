import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import html2pdf from 'html2pdf.js';

const SectionHeader = ({ title }) => (
  <div className="bg-gray-400 text-gray-800 font-semibold text-sm uppercase px-3 py-2">
    {title}
  </div>
);

const ResumeTemplate3 = ({ data = {} }) => {
  // Create a local editable copy of the incoming data.
  const [editableData, setEditableData] = useState(data);
  // Control whether fields are inline-editable.
  const [editMode, setEditMode] = useState(false);

  // When incoming data changes, update local state.
  useEffect(() => {
    setEditableData(data);
  }, [data]);

  // Destructure key fields from editableData.
  const {
    name = 'No Name Provided',
    city = '',
    country = '',
    email = '',
    phone = '',
    professionalSummary = '',
    skills = [],
    experiences = [],
    educations = [],
    languages = [],
    projects = [],
    volunteer = {},
    additionalInfo = {},
  } = editableData;

  const nameParts = name.split(' ');
  const firstName = nameParts[0]?.toUpperCase() || 'N/A';
  const lastName = nameParts[1]?.toUpperCase() || '';

  // Refs and print/download functions.
  const resumeRef = useRef(null);
  const handlePrint = useReactToPrint({ content: () => resumeRef.current });
  const handleDownloadPdf = () => {
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

  // Update a field in a section (for simple objects like contact).
  const updateContactField = (field, value) => {
    setEditableData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));
  };

  // Update the professional summary.
  const updateSummary = (value) => {
    setEditableData((prev) => ({ ...prev, professionalSummary: value }));
  };

  // Toggle between Edit Mode and View Mode.
  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  return (
    <div className="relative max-w-5xl mx-auto my-10">
      {/* Top Controls */}
      <div className="flex justify-between items-center max-w-5xl mx-auto mb-4 px-4">
        <button
          onClick={handleDownloadPdf}
          className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 shadow"
        >
          Download Resume
        </button>
        <button
          onClick={toggleEditMode}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 shadow"
        >
          {editMode ? "View Mode" : "Edit Mode"}
        </button>
      </div>

      {/* Resume Layout */}
      <div
        ref={resumeRef}
        className="flex shadow-lg border border-gray-300 rounded overflow-hidden"
      >
        {/* Left Sidebar */}
        <div className="w-1/3 bg-blue-900 text-white p-6 flex flex-col justify-between">
          <div>
            {/* Editable Name */}
            <h1
              className="text-4xl text-white font-extrabold leading-none"
              contentEditable={editMode}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                // Update first name; preserve last name.
                const newFirstName = e.target.innerText;
                updateContactField("fullName", `${newFirstName} ${lastName}`);
              }}
            >
              {firstName}
            </h1>
            <h2
              className="text-3xl text-white font-extrabold"
              contentEditable={editMode}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                // Update last name; preserve first name.
                const newLastName = e.target.innerText;
                updateContactField("fullName", `${firstName} ${newLastName}`);
              }}
            >
              {lastName}
            </h2>

            {/* Editable Contact Info */}
            <div className="mt-6 text-sm space-y-1">
              <p
                contentEditable={editMode}
                suppressContentEditableWarning={true}
                onBlur={(e) => updateContactField("city", e.target.innerText)}
              >
                {city}
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
        </div>

        {/* Right Main Content */}
        <div className="w-2/3 bg-gray-100 text-gray-800">
          {/* PROFESSIONAL SUMMARY */}
          {professionalSummary && (
            <div className="mb-4">
              <SectionHeader title="Professional Summary" />
              <div
                className="p-4 text-sm"
                contentEditable={editMode}
                suppressContentEditableWarning={true}
                onBlur={(e) => updateSummary(e.target.innerText)}
              >
                {professionalSummary}
              </div>
            </div>
          )}

          {/* SKILLS */}
          {skills.length > 0 && (
            <div className="mb-4">
              <SectionHeader title="Skills" />
              <div className="p-4">
                <ul className="flex flex-wrap gap-3 text-sm">
                  {skills.map((skill, i) => (
                    <li
                      key={i}
                      className="bg-gray-200 px-2 py-1 rounded text-gray-700"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* EXPERIENCE */}
          {experiences.length > 0 && (
            <div className="mb-4">
              <SectionHeader title="Experience" />
              <div className="p-4 space-y-4 text-sm">
                {experiences.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center font-semibold text-base">
                      <span>{exp.title}</span>
                      <span className="text-gray-500 text-sm">{exp.date}</span>
                    </div>
                    {exp.location && (
                      <p className="text-gray-600">{exp.location}</p>
                    )}
                    {exp.details && (
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {exp.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {educations.length > 0 && (
            <div className="mb-4">
              <SectionHeader title="Education" />
              <div className="p-4 space-y-4 text-sm">
                {educations.map((edu, i) => (
                  <div key={i}>
                    <p className="font-semibold">{edu.degree}</p>
                    <p className="text-gray-600">{edu.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {projects.length > 0 && (
            <div className="mb-4">
              <SectionHeader title="Projects" />
              <div className="p-4 space-y-4 text-sm">
                {projects.map((proj, i) => (
                  <div key={i}>
                    <p className="font-semibold">{proj.title}</p>
                    {proj.description && (
                      <p className="text-gray-600">{proj.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LANGUAGES */}
          {languages.length > 0 && (
            <div className="mb-4">
              <SectionHeader title="Languages" />
              <div className="p-4 space-y-2 text-sm">
                {languages.map((lang, i) => (
                  <div key={i}>
                    <p className="font-semibold">{lang.name}</p>
                    <p className="text-gray-600">{lang.level}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VOLUNTEER */}
          {volunteer.title && (
            <div className="mb-4">
              <SectionHeader title="Volunteer" />
              <div className="p-4 text-sm">
                <div className="flex justify-between items-center font-semibold">
                  <span>{volunteer.title}</span>
                  {volunteer.date && (
                    <span className="text-gray-500 text-sm">{volunteer.date}</span>
                  )}
                </div>
                {volunteer.organization && (
                  <p className="text-gray-600">{volunteer.organization}</p>
                )}
                {volunteer.details && (
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {volunteer.details.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* ADDITIONAL INFO */}
          {Object.keys(additionalInfo).length > 0 && (
            <div className="mb-4">
              <SectionHeader title="Additional Info" />
              <div className="p-4 text-sm">
                <ul className="space-y-1">
                  {Object.entries(additionalInfo).map(([key, value]) => (
                    <li key={key}>
                      <span className="font-semibold">{key}: </span>
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplate3;
