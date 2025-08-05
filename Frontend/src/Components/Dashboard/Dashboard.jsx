import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Repeat, Briefcase, Clock, Lightbulb, Users, Brain } from "lucide-react";
// import PractiseInterview from "../../assets/PracriseInterview.jpg"; // Ensure correct file name and extension
import MockInterview from "../../assets/MockInt.jpg";
import SituBasedInterview from "../../assets/SituBased.jpg";
import RapidFire from "../../assets/RapidFire.jpg";
import FollowUp from "../../assets/FollowupInt2.jpg";
import Practise from "../../assets/PractiseInterview.jpg";
import AptiQuiz from "../../assets/Aptiquiz.jpg";
import LangQuiz from "../../assets/Langquiz.jpg";
import ResumeAnalyze from "../../assets/Resume.jpg";
import RoleInt from "../../assets/Roleinterview.jpg";
import GdINt from "../../assets/AiGd.jpg";
import GdLive from "../../assets/LiveGd.jpg";

import { ThemeContext } from "../ThemeContext";

// Sections with features; each feature marked "isImage" will show its image naturally.
const sections = [
  
  //   title: "Interview Section",
  //   features: [
  //     {
  //       path: "/dashboard/practice-interview",
  //       title: "Practice Interview",
  //       icon: Practise,
  //       isImage: true,
  //     },
  //     {
  //       path: "/dashboard/follow-up-interview",
  //       title: "Follow-Up Interview",
  //       icon: FollowUp,
  //       isImage: true,
  //     },
  //     {
  //       path: "/dashboard/specific-role-interview",
  //       title: "Role Based Interview",
  //       icon: RoleInt,
  //       isImage: true,
  //     },
  //     {
  //       path: "/dashboard/situation-based-questions",
  //       title: "Situation-Based Interview",
  //       icon: SituBasedInterview,
  //       isImage: true,
  //     },
  //     {
  //       path: "/dashboard/one-minute-question",
  //       title: "Rapid Fire",
  //       icon: RapidFire,
  //       isImage: true,
  //     },
  //   ],
  // },
  // {
  //   title: "Quiz Section",
  //   features: [
  //     { path: "/dashboard/quiz", title: "Aptitude Quiz", icon: AptiQuiz, isImage: true },
  //     { path: "/dashboard/coding-quiz", title: "Lang-Based Quiz", icon: LangQuiz, isImage: true },
  //   ],
  // },
  
  {
    title: "Resume Section",
    features: [
      { path: "/dashboard/resume-check", title: "Analyze Resume", icon: ResumeAnalyze, isImage: true },
    ],
  },
  // {
  //   title: "Group Discussion Section",
  //   features: [
  //     { path: "/dashboard/group-discussion", title: "AI powered Group Discussion", icon: GdINt, isImage: true },
  //     { path: "/dashboard/talkmate", title: "Live Group Discussion", icon: GdLive, isImage: true },
  //   ],
  // },
  {
    title: "Build AI Resume",
    features: [
      { path: "/dashboard/resume-builder", title: "Resume Builder", icon: MockInterview, isImage: true },
    ],
  },
];

const Dashboard = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className={`p-8 min-h-screen transition-all duration-300 ${
        theme === "dim" ? "bg-white text-black" : "bg-gray-900 text-white"
      }`}
    >
      {/* Dashboard Title */}
      <h1
        className={`text-5xl font-extrabold mb-8 text-left ${
          theme === "dim" ? "text-[#011638]" : "text-orange-500"
        }`}
      >
        Dashboard
      </h1>

      {sections.map((section, index) => (
        <div key={index} className="mb-12">
          {/* Section Heading */}
          <h2
            className={`text-3xl font-bold mb-6 text-left ${
              theme === "dim" ? "text-[#011638]" : "text-blue-400"
            }`}
          >
            {section.title}
          </h2>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {section.features.map((feature) => (
              <Link
                key={feature.path}
                to={feature.path}
                className={`border rounded-xl overflow-hidden w-[90%] shadow-lg transition-all duration-300 transform hover:scale-105 ${
                  theme === "dim"
                    ? "bg-white border-[#011638] text-black"
                    : "bg-gray-800 border-orange-500 text-white"
                }`}
              >
                {feature.isImage ? (
                  // Instead of forcing the image to fill the container, show it naturally.
                  <div className="w-full h-48 flex items-center justify-center hover:animate-pulse">
                    <img
                      src={feature.icon}
                      alt={feature.title}
                      className="max-h-full max-w-full object-contain transition-transform duration-300 ease-in-out hover:scale-105"
                    />
                  </div>
                ) : (
                  // For non-image icons, center them inside a fixed-height container.
                  <div className="w-full h-48 flex items-center justify-center">
                    {feature.icon}
                  </div>
                )}
                {/* Heading centered below the image */}
                <p className="text-xl font-semibold text-center py-4">
                  {feature.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
