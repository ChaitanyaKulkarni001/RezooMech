import { useState, useEffect } from "react";
import ContactForm from "./ContactForms";
import WorkExperienceForm from "./WorkExperienceForm";
import EducationForm from "./EducationForm";
import SkillsForm from "./SkillsForm";
import SummaryForm from "./SummaryForm";
import AnalyzeResume from "./AnalyzeResume";
import ProjectForm from "./ProjectForm";
// import SummaryForm from "./SummaryForm";
// import ResumePreview from "./ResumePreview";
const ResumeForm = () => {
  const [step, setStep] = useState(0); // Track form step
  const [resumeData, setResumeData] = useState({
    contact: {},
    workExperience: {},
    projects: {},
    education: {},
    skills: {},
    summary: {},
  });

  const updateResumeData = (section, data) => {
    setResumeData((prevData) => {
      const updatedData = { ...prevData, [section]: data };
      
      console.log("Updated Resume Data: ", updatedData); // Logs after state update
      return updatedData;
    });
  
    setStep((prevStep) => prevStep + 1); // Move to next step
  };
  
  // Log resumeData when it changes
  useEffect(() => {
    console.log("Final Resume Data: ", resumeData);
  }, [resumeData]);
  const handleNextStep = () => {
    console.log("Navigating to next step...");
    // setStep((prevStep) => prevStep + 1)
};
const handleBackStep = () => {
  setStep((prevStep) => prevStep - 1);
}
  return (
    <div>
      {step === 0 && <ContactForm onSave={(data) => updateResumeData("contact", data)} />}
      {step === 1 &&  <WorkExperienceForm onBack={handleBackStep} onNext={handleNextStep} onSave={(data) =>updateResumeData("workExperience", data)} />  }
      {step === 2 && <EducationForm onBack={handleBackStep} onNext={handleNextStep} onSave={(data) => updateResumeData("education", data)} />}
      {step === 3 && <ProjectForm onBack={handleBackStep} onNext={handleNextStep} onSave={(data) => updateResumeData("projects", data)} />}
      {step === 4 && <SkillsForm onBack={handleBackStep} onNext={handleNextStep} onSave={(data) => updateResumeData("skills", data)} />}
      {step === 5 && <SummaryForm resumeData={resumeData} onBack={handleBackStep} onNext={handleNextStep} onSave={(data) => updateResumeData("summary", data)} />}
      


      {step===6 && <AnalyzeResume resumeData={resumeData} />}
      {/* {step > 3 && (
        <div>
          <h2>Summary</h2>
          <pre>{JSON.stringify(resumeData, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
};

export default ResumeForm;
