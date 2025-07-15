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
        navigation={{clickable: true}}
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
                The premier platform for microtasking that connects businesses with a global workforce
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <h3 className="text-yellow-300 font-semibold mb-2">For Workers</h3>
                  <p className="text-sm text-blue-100">
                    Earn money by completing simple tasks in your spare time
                  </p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <h3 className="text-yellow-300 font-semibold mb-2">For Businesses</h3>
                  <p className="text-sm text-blue-100">
                    Get your microtasks completed quickly by our global community
                  </p>
                </div>
              </div>
              <div className="mt-8 text-blue-100 text-sm">
                <p>Join over 500,000 users worldwide who are already benefiting from our platform</p>
              </div>
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
                How <span className="text-blue-800">WorkHive</span> Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/30 p-4 rounded-lg">
                  <div className="text-blue-800 font-bold text-2xl mb-2">1</div>
                  <h3 className="font-semibold mb-2">Browse Tasks</h3>
                  <p className="text-sm">
                    Find tasks that match your skills and availability
                  </p>
                </div>
                <div className="bg-white/30 p-4 rounded-lg">
                  <div className="text-blue-800 font-bold text-2xl mb-2">2</div>
                  <h3 className="font-semibold mb-2">Complete Work</h3>
                  <p className="text-sm">
                    Follow instructions and submit your completed work
                  </p>
                </div>
                <div className="bg-white/30 p-4 rounded-lg">
                  <div className="text-blue-800 font-bold text-2xl mb-2">3</div>
                  <h3 className="font-semibold mb-2">Get Paid</h3>
                  <p className="text-sm">
                    Receive payment instantly upon approval
                  </p>
                </div>
              </div>
              <div className="mt-8 text-blue-800/80 text-sm">
                <p>Tasks range from data entry to content moderation and more</p>
              </div>
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
                Why Choose <span className="text-yellow-400">WorkHive</span>
              </h2>
              <ul className="text-left max-w-md mx-auto space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✓</span>
                  <span>Flexible work hours that fit your schedule</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✓</span>
                  <span>No experience required for most tasks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✓</span>
                  <span>Instant payments with multiple withdrawal options</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✓</span>
                  <span>24/7 customer support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✓</span>
                  <span>Secure and verified platform</span>
                </li>
              </ul>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm max-w-md mx-auto">
                <h3 className="text-yellow-300 font-semibold mb-2">New Feature</h3>
                <p className="text-sm text-blue-100">
                  Our new skill matching algorithm helps you find the most suitable tasks based on your profile
                </p>
              </div>
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