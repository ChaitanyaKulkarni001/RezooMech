import React, { useRef, useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';

const ResumeTemplate4 = ({ data = {} }) => {
  // Create a local editable copy of the data.
  const [editableData, setEditableData] = useState(data);
  const [editMode, setEditMode] = useState(false);

  // Update local state if incoming data changes.
  useEffect(() => {
    setEditableData(data);
  }, [data]);

  // Destructure editableData fields.
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

  // Split name into first and last.
  const [firstName, lastName] = name.split(' ');

  // Ref for PDF download.
  const resumeRef = useRef(null);
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

  // Update contact fields inline.
  const updateContactField = (field, value) => {
    setEditableData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));
  };

  // Update professional summary.
  const updateProfessionalSummary = (value) => {
    setEditableData((prev) => ({
      ...prev,
      professionalSummary: value,
    }));
  };

  // Toggle edit mode.
  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  return (
    <div className="max-w-5xl mx-auto my-8">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-4 px-4">
        <button
          onClick={handleDownloadPdf}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 shadow"
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

      {/* Resume Container */}
      <div ref={resumeRef} className="w-full shadow-md border border-gray-200">
        {/* Top Bar */}
        <div className="bg-red-800 text-white flex justify-between items-center p-6">
          <div>
            {/* Editable First Name */}
            <h1
              className="text-3xl text-white font-bold tracking-wide"
              contentEditable={editMode}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                const newFirstName = e.target.innerText;
                updateContactField("fullName", `${newFirstName} ${lastName || ''}`);
              }}
            >
              {firstName?.toUpperCase() || ''}
            </h1>
            {/* Editable Last Name */}
            {lastName && (
              <h2
                className="text-2xl text-white font-semibold"
                contentEditable={editMode}
                suppressContentEditableWarning={true}
                onBlur={(e) => {
                  const newLastName = e.target.innerText;
                  updateContactField("fullName", `${firstName} ${newLastName}`);
                }}
              >
                {lastName.toUpperCase()}
              </h2>
            )}
          </div>
          <div className="text-right text-sm space-y-1">
            {/* Editable Contact Info */}
            <p
              contentEditable={editMode}
              suppressContentEditableWarning={true}
              onBlur={(e) => updateContactField("city", e.target.innerText)}
            >
              {city}
              {city && country ? ', ' : ''}
              {country}
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

        {/* Main Content: Two Columns */}
        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-1/4 bg-white p-6 text-red-800 font-semibold space-y-6 text-sm">
            {professionalSummary && <p>PROFESSIONAL SUMMARY</p>}
            {skills.length > 0 && <p>SKILLS</p>}
            {experiences.length > 0 && <p>EXPERIENCE</p>}
            {educations.length > 0 && <p>EDUCATION</p>}
            {projects.length > 0 && <p>PROJECTS</p>}
            {languages.length > 0 && <p>LANGUAGES</p>}
            {volunteer.title && <p>VOLUNTEER</p>}
            {Object.keys(additionalInfo).length > 0 && <p>ADDITIONAL INFO</p>}
          </div>

          {/* Right Content Area */}
          <div className="w-3/4 bg-gray-50 p-6 text-gray-800 text-sm space-y-8">
            {/* PROFESSIONAL SUMMARY */}
            {professionalSummary && (
              <div>
                <h3 className="font-bold mb-2 text-lg text-red-800">
                  Professional Summary
                </h3>
                <div
                  className="p-4 text-sm"
                  contentEditable={editMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateProfessionalSummary(e.target.innerText)}
                >
                  {professionalSummary}
                </div>
              </div>
            )}

            {/* SKILLS */}
            {skills.length > 0 && (
              <div>
                <h3 className="font-bold mb-2 text-lg text-red-800">Skills</h3>
                <ul className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <li
                      key={idx}
                      className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* EXPERIENCE */}
            {experiences.length > 0 && (
              <div>
                <h3 className="font-bold mb-2 text-lg text-red-800">
                  Experience
                </h3>
                {experiences.map((exp, idx) => (
                  <div key={idx} className="mb-4">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">{exp.title}</p>
                      <span className="text-xs text-gray-500">{exp.date}</span>
                    </div>
                    {exp.location && (
                      <p className="text-gray-600">{exp.location}</p>
                    )}
                    {exp.details && exp.details.length > 0 && (
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {exp.details.map((detail, i) => (
                          <li key={i}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* EDUCATION */}
            {educations.length > 0 && (
              <div>
                <h3 className="font-bold mb-2 text-lg text-red-800">
                  Education
                </h3>
                {educations.map((edu, idx) => (
                  <div key={idx} className="mb-4">
                    <p className="font-semibold">{edu.degree}</p>
                    <p className="text-gray-600">{edu.details}</p>
                  </div>
                ))}
              </div>
            )}

            {/* PROJECTS */}
            {projects.length > 0 && (
              <div>
                <h3 className="font-bold mb-2 text-lg text-red-800">Projects</h3>
                {projects.map((proj, idx) => (
                  <div key={idx} className="mb-4">
                    <p className="font-semibold">{proj.title}</p>
                    {proj.description && (
                      <p className="text-gray-600">{proj.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* LANGUAGES */}
            {languages.length > 0 && (
              <div>
                <h3 className="font-bold mb-2 text-lg text-red-800">
                  Languages
                </h3>
                {languages.map((lang, idx) => (
                  <div key={idx} className="mb-2">
                    <p className="font-semibold">{lang.name}</p>
                    <p className="text-gray-600">{lang.level}</p>
                  </div>
                ))}
              </div>
            )}

            {/* VOLUNTEER */}
            {volunteer.title && (
              <div>
                <h3 className="font-bold mb-2 text-lg text-red-800">
                  Volunteer
                </h3>
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{volunteer.title}</p>
                  {volunteer.date && (
                    <span className="text-xs text-gray-500">
                      {volunteer.date}
                    </span>
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
            )}

            {/* ADDITIONAL INFO */}
            {Object.keys(additionalInfo).length > 0 && (
              <div>
                <h3 className="font-bold mb-2 text-lg text-red-800">
                  Additional Info
                </h3>
                <ul className="space-y-1">
                  {Object.entries(additionalInfo).map(([key, value]) => (
                    <li key={key}>
                      <span className="font-semibold">{key}: </span>
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplate4;
