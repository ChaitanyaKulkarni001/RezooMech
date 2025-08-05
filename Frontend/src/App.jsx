  import './App.css'
  import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
  import About from './Components/About'
  import AI_Interview from './Components/AI/AI_Interview'
  import Index from './Components/Index'
  import Login from './Components/Logins/Login'
  import SignUp from './Components/Logins/SignUp'
  import ProtectedRoute from '../components/ProtectedRoute'
  import NotFound from './Components/NotFound'
  import Form from './Components/Logins/Form'
  import Dashboard from './Components/Dashboard/Dashboard'
  import Layout from './Components/Layout/Layout'
  import Follow_up_interview from './Components/AI/follow_up_interview';
  import Specific_role_interview from './Components/AI/Specific_role_interview';
  import OneMinuteQuestion from './Components/AI/Oneminutequestion';
  import SituationalQuestions from './Components/AI/SituationalQuestions';
  import MockInterview from './Components/AI/MockInterview';
  import StartMockInterview from './Components/AI/StartMockInterview';
  import MockInterviewFeedback from './Components/AI/MockInterviewFeedback';
  import DashboardLayout from './Components/Dashboard/DashboardLayout';
  import Quiz from './Components/QuizSection/Quiz';
  import VideoCall from './Components/VideoCall/VideoCall';
  import Contact from './Components/Pages/Contact';
  import ResumeChecker from './Components/Resume/ResumeChecker';
  import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
  import Trial from './Components/Trial';
  import CodeQuiz from './Components/QuizSection/CodeQuiz';
  import GroupDisccusion from './Components/GroupDisccusion/GroupDisccusion';
  import History from './Components/History/History';
  import Debate from './Components/VideoCall/Debate';
  import DebateConventos from "./DebateConventos"
  import Report from './Components/Report/Report';
  import CreateQuiz from './Components/Admin/CreateQuiz';
  import Complaints from './Components/Admin/Complaints';
import Review from './Components/Review/Review';
import AdminRatings from './Components/Admin/AdminRatings';
import ResumeTemplate from './Components/ResumeCreation/ResumeTemplate';
import ResumeTemplate2 from './Components/ResumeCreation/ResumeTemplate2';
import ResumeTemplate3 from './Components/ResumeCreation/ResumeTemplate3';
import ResumeTemplate4 from './Components/ResumeCreation/ResumeTemplate4';
import ResumeBuilder from './Components/ResumeCreation/ResumeBuilder';
// Example data you might pass to the ResumeTemplate
const resumeData = {
  name: 'Chaitanya Kulkarni',
  city: 'Pandharpur',
  country: 'India',
  email: 'kulkarnichaitanya001@gmail.com',
  phone: '9359386557',
 
  skills: ['Tools customization', 'JIRA', 'Scrum'],
  experiences: [
    {
      title: 'Software Engineer',
      location: 'Pune, India',
      date: 'January 2025 - Current',
      details: [
        'Investigated new technologies and tools ...',
        'Conducted code reviews ...',
        'Designed user interfaces ...',
      ],
    },
    {
      title: 'Intern Developer',
      location: 'Mumbai, India',
      date: 'June 2024 - December 2024',
      details: [
        'Worked on front-end React applications ...',
        'Collaborated with design team ...',
      ],
    },
  ],
  educations: [
    {
      degree: 'Bachelor of Technology in Computer Science',
      details: 'Graduated from XYZ University with honors.',
    },
    {
      degree: 'Master of Science in Software Engineering',
      details: 'Completed a specialized program at ABC Institute.',
    },
  ],
  languages:{

    l1: {
      name: 'English',
      level: 'Elementary (A2)',
    },

    l2: {
      name: 'Marathi',
      level: 'Elementary (A2)',
    },
  },
  volunteer: {
    title: 'Volunteer',
    organization: 'Some NGO',
    date: 'February 2024 - February 2025',
    details: [
      'Helped organize community events ...',
      'Coordinated with volunteers ...',
    ],
  },
  additionalInfo: {
    LinkedIn: 'linkedin.com/in/chaitanya',
    GitHub: 'github.com/chaitanya',
    Portfolio: 'chaitanya.dev',
  },
  professionalSummary:
  'Dynamic Software Engineer with a proven track record ...',
};

  function Logout() {

    localStorage.clear()
    return <Navigate to='/' />
  }
  function RegisterAndLogout() {
    localStorage.clear()
    return <Login />
  }

  function App() {


    return (

      <Router>
        
        <Routes>
          <Route element={<Layout />}>

            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/trial" element={<Form />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/try" element={<Trial />} />
            <Route path="*" element={<NotFound />} />
            

            <Route path="/about" element={
              // <ProtectedRoute>
                <About />
              // </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
           
<Route path="/admin/quiz" element={
              <ProtectedRoute>
                <CreateQuiz />
              </ProtectedRoute>
            } />
<Route path="/admin/complaints" element={
              <ProtectedRoute>
                <Complaints />
              </ProtectedRoute>
            } />
<Route path="/admin/adminrating" element={
              <ProtectedRoute>
                <AdminRatings />
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              {/* <Route path="practice-interview" element={<AI_Interview />} />
              <Route path="follow-up-interview" element={<Follow_up_interview />} />
              <Route path="specific-role-interview" element={<Specific_role_interview />} /> */}
              {/* <Route path="one-minute-question" element={<OneMinuteQuestion />} /> */}
              {/* <Route path="situation-based-questions" element={<SituationalQuestions />} /> */}
              {/* <Route path="mock-interview" element={<MockInterview />} /> */}
              {/* <Route path="mock-interview/start" element={<StartMockInterview />} /> */}
              {/* <Route path="quiz" element={<Quiz />} /> */}
              <Route path="talkmate" element={<VideoCall />} />  {/* Video Call */}
              <Route path="resume-check" element={<ResumeChecker />} />  {/* Resume Check */}
              <Route path="coding-quiz" element={<CodeQuiz />} />  {/* Resume Check */}
              <Route path="group-discussion" element={<GroupDisccusion />} />  {/* Resume Check */}
              {/* History */}
              <Route path="history" element={<History />} />  
              <Route path="review" element={<Review />} />  
              {/* Debate */}
              {/* <Route path="debate" element={<Debate />}  />   
              <Route path="debate/start" element={<DebateConventos />}  />    */}
              <Route path="complain" element={<Report />}  />   
              <Route path="resume-builder" element={<ResumeBuilder />}  />   
              {/* <Route path="trial" element={<ResumeTemplate data={resumeData} />}  />   
              <Route path="trial2" element={<ResumeTemplate2 data={resumeData} />}  />   
              <Route path="trial3" element={<ResumeTemplate3 data={resumeData} />}  />   
              <Route path="trial4" element={<ResumeTemplate4 data={resumeData} />}  />    */}

            </Route>
          </Route>

        </Routes>
        
      </Router>


    )
  }

  export default App
