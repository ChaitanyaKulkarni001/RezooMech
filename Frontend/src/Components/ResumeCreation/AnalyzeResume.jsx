import React, { useState } from 'react';
import ResumeTemplate from './ResumeTemplate';
import ResumeTemplate2 from './ResumeTemplate2';
import ResumeTemplate3 from './ResumeTemplate3';
import ResumeTemplate4 from './ResumeTemplate4';

// Replace these imports with your actual image paths.
import template1Img from "../../assets/Resume.png"
import template2Img from "../../assets/Resume2.png"
import template3Img from "../../assets/Resume3.png"
import template4Img from "../../assets/Resume4.png"

const AnalyzeResume = ({ resumeData }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Render the selected resume template with resumeData.
  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 1:
        return <ResumeTemplate data={resumeData} />;
      case 2:
        return <ResumeTemplate2 data={resumeData} />;
      case 3:
        return <ResumeTemplate3 data={resumeData} />;
      case 4:
        return <ResumeTemplate4 data={resumeData} />;
      default:
        return null;
    }
  };

  // If a template is selected, show it along with a "Back" button.
  if (selectedTemplate) {
    return (
      <div>
        <button 
          onClick={() => setSelectedTemplate(null)}
          style={{ margin: '20px', padding: '10px 20px', cursor: 'pointer' }}
        >
          Back to Template Selection
        </button>
        {renderTemplate()}
      </div>
    );
  }

  // Render the "choose your resume" grid.
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h2>Choose Your Resume Template</h2>
      <div 
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          marginTop: '30px'
        }}
      >
        <div 
          onClick={() => setSelectedTemplate(1)} 
          style={{ cursor: 'pointer' }}
        >
          <img 
            src={template1Img} 
            alt="Resume Template 1" 
            style={{ width: '200px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          />
          <p>Template 1</p>
        </div>
        <div 
          onClick={() => setSelectedTemplate(2)} 
          style={{ cursor: 'pointer' }}
        >
          <img 
            src={template2Img} 
            alt="Resume Template 2" 
            style={{ width: '200px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          />
          <p>Template 2</p>
        </div>
        <div 
          onClick={() => setSelectedTemplate(3)} 
          style={{ cursor: 'pointer' }}
        >
          <img 
            src={template3Img} 
            alt="Resume Template 3" 
            style={{ width: '200px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          />
          <p>Template 3</p>
        </div>
        <div 
          onClick={() => setSelectedTemplate(4)} 
          style={{ cursor: 'pointer' }}
        >
          <img 
            src={template4Img} 
            alt="Resume Template 4" 
            style={{ width: '200px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          />
          <p>Template 4</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyzeResume;
