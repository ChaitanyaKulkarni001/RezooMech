import React from 'react';

export default function CallToAction() {
  return (
    <>
      <style jsx>{`
        @keyframes smoothGradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .cta-animated-bg {
          background: linear-gradient(300deg, #BFEAF5, #8ED1FC, #8A2BE2);
          background-size: 200% 200%;
          animation: smoothGradient 8s ease infinite;
        }
      `}</style>
      <section className="cta-animated-bg text-gray-700 py-16 px-6 text-center border border-gray-200 shadow-sm">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-5 leading-tight">
            Land Your Dream Job with AI-Powered Prep!
          </h2>
          <p className="text-lg mb-8 max-w-xl mx-auto opacity-90">
            Master interviews with expert-curated questions, mock sessions, resume reviews, and more.
          </p>
          <button
            className="bg-[#011638] text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:scale-105 transition-transform duration-300"
            onClick={() => window.location.href = "/signup"}
          >
            Get Started for Free
          </button>
        </div>
      </section>
    </>
  );
}
