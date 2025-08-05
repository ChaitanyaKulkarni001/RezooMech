import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

import {
  Clock,
  BrainCircuit,
  MessageSquareMore,
  UserCheck,
  Briefcase,
  Mic,
  BarChartBig
} from "lucide-react";

export default function Features() {
   const { theme } = useContext(ThemeContext);
  const features = [
    {
      title: 'One-minute Interview',
      description: 'Answer challenging questions in just one minute and improve your ability to think on your feet.',
      icon: <Clock className="w-12 h-12 text-blue-600" />,
    },
    {
      title: 'Situation-based Interview',
      description: 'Prepare for situational interview questions where you demonstrate problem-solving skills.',
      icon: <BrainCircuit className="w-12 h-12 text-green-600" />,
    },
    {
      title: 'Follow-up Questions',
      description: 'Practice answering follow-up questions and sharpen your responses with real-time AI feedback.',
      icon: <MessageSquareMore className="w-12 h-12 text-yellow-600" />,
    },
    {
      title: 'Mock Interview',
      description: 'Simulate a full-length interview with AI-generated questions, and receive feedback on your responses.',
      icon: <UserCheck className="w-12 h-12 text-purple-600" />,
    },
    {
      title: 'Role-based Interview',
      description: 'Get questions tailored to specific job roles and industries to improve your preparation.',
      icon: <Briefcase className="w-12 h-12 text-red-600" />,
    },
    {
      title: 'Practice',
      description: 'Record your interview practice sessions and analyze your performance for improvement.',
      icon: <Mic className="w-12 h-12 text-indigo-600" />,
    },
    {
      title: 'Interview Feedback & Analysis',
      description: 'After completing the interview, get detailed feedback and suggestions on your performance.',
      icon: <BarChartBig className="w-12 h-12 text-pink-600" />,
    },
  ];

  return (
    <section className={` ${theme === 'dim'? 'bg-white text-black' :'bg-black text-white'} py-20 text-gray-900" id="what-we-offer`}>
      <div className="container mx-auto text-center px-6">
        <h2 className={`text-4xl font-extrabold ${theme=='dim'?'text-black':'text-white'} mb-6`}>What We Offer</h2>
        <p className="text-lg  max-w-3xl mx-auto mb-12">
          Explore our range of services designed to help you succeed. From expert guidance to innovative solutions, we have something for everyone.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group transition-all duration-300 transform hover:scale-110"
            >
              {/* Glowing gradient background appears on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 blur-xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
              {/* Card content remains unchanged */}
              <div className="relative bg-white shadow-md rounded-2xl p-8 h-full">
                <div className="flex justify-center mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
