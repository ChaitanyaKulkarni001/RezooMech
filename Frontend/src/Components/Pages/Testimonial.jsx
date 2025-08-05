import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { ThemeContext } from "../ThemeContext"; // Import ThemeContext

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function Testimonial() {
  const { theme } = useContext(ThemeContext); // Get theme from context

  const testimonials = [
    {
      name: "Courtney Henry",
      company: "Microsoft Corp",
      feedback:
        "NexHire helped me land my first job! The mock interviews and resume reviews were super helpful. The AI-powered insights were spot-on!",
      avatar: "theme/images/users/user-5.png",
      rating: 4,
    },
    {
      name: "Ronald Richards",
      company: "Meta Limited",
      feedback:
        "NexHire helped me land my first job! The mock interviews and resume reviews were super helpful. The AI-powered insights were spot-on!",
      avatar: "theme/images/users/user-2.png",
      rating: 4,
    },
    {
      name: "Bessie Cooper",
      company: "Apple Inc Ltd",
      feedback:
        "NexHire helped me land my first job! The mock interviews and resume reviews were super helpful. The AI-powered insights were spot-on!",
      avatar: "theme/images/users/user-6.png",
      rating: 4,
    },
  ];

  return (
    <div>
      <section
        className={`reviews ${
          theme === "dim" ? "bg-white text-black" : "bg-black text-white"
        } py-16`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${theme === "dim" ? "text-black" : "text-white"}`}>
              Our customers have nice things to say about us
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg">
              Hear from our happy customers about their experience.
            </p>
          </div>

          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="reviews-carousel"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`review text-center p-6 rounded-lg shadow-lg ${
                    theme === "dim" ? "bg-white text-black" : "bg-gray-900 text-black"
                  }`}
                >
                  <div className="review-author-avatar mx-auto w-24 h-24 rounded-full overflow-hidden mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{testimonial.name}</h4>
                  <p className="text-sm opacity-80 mb-4">{testimonial.company}</p>
                  <p className="opacity-90">{testimonial.feedback}</p>
                  <div className="review-rating mt-6 flex justify-center space-x-1">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <img
                          key={i}
                          src={
                            i < testimonial.rating
                              ? "theme/images/icons/star.svg"
                              : "theme/images/icons/star-white.svg"
                          }
                          alt="star"
                          className="w-5 h-5"
                        />
                      ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
}
