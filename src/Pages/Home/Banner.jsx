import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const Banner = () => {
  return (
    <div className="w-full min-h-[80vh] px-2 md:px-8 py-6 md:py-10 overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet custom-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active custom-bullet-active",
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        className="w-full h-full rounded-2xl overflow-hidden shadow-2xl relative"
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white text-center px-2 sm:px-6">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-10 w-24 h-24 bg-yellow-400 rounded-full animate-pulse" />
              <div className="absolute top-40 right-10 w-20 h-20 bg-white rounded-full animate-bounce" />
              <div className="absolute bottom-24 left-16 w-24 h-24 bg-yellow-300 rounded-full animate-pulse delay-1000" />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Welcome to <span className="text-yellow-400">WorkHive</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl mb-6 text-blue-100">
                Where micro tasks turn into meaningful earnings
              </p>
              <button className="group bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold text-sm sm:text-base px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                Get Started
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-400 text-blue-900 text-center px-2 sm:px-6">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 right-10 w-32 h-32 bg-blue-600 rounded-full animate-spin-slow" />
              <div className="absolute bottom-20 left-10 w-28 h-28 bg-blue-700 rounded-full animate-pulse" />
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full animate-bounce delay-500" />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Earn <span className="text-blue-800">Coins</span> Doing Simple Tasks
              </h2>
              <p className="text-base sm:text-lg md:text-xl mb-6 text-blue-800">
                Work anywhere, anytime — just a few clicks away
              </p>
              <button className="group bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                Explore Tasks
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide>
          <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white text-center px-2 sm:px-6">
            <div className="absolute inset-0 opacity-15">
              <div className="absolute top-24 left-8 w-20 h-20 bg-yellow-400 rounded-full animate-pulse" />
              <div className="absolute bottom-24 right-8 w-24 h-24 bg-yellow-300 rounded-full animate-bounce" />
              <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-white rounded-full animate-pulse delay-700" />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Post Tasks, Reach Workers <span className="text-yellow-400">Instantly</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl mb-6 text-blue-100">
                Post your micro jobs and find workers worldwide
              </p>
              <button className="group bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold text-sm sm:text-base px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                Post a Task
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .custom-bullet {
          width: 10px !important;
          height: 10px !important;
          background: rgba(255, 255, 255, 0.5) !important;
          border-radius: 9999px !important;
          transition: all 0.3s ease !important;
        }

        .custom-bullet-active {
          background: rgba(255, 255, 255, 1) !important;
          transform: scale(1.2) !important;
        }

        .swiper-pagination {
          bottom: 16px !important;
        }
      `}</style>
    </div>
  );
};

export default Banner;
