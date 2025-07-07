import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const testimonials = [
  {
    name: "Sakib Uddin",
    quote: "WorkHive helped me earn while studying — simple and efficient!",
    image: "https://i.pravatar.cc/150?img=3",
  },
  {
    name: "Tania Akter",
    quote: "I’ve posted tasks and got results within hours. Great platform!",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Riaz Uddin",
    quote: "I love how easy it is to complete tasks on WorkHive.",
    image: "https://i.pravatar.cc/150?img=6",
  },
  {
    name: "Naimul Hasan",
    quote: "I earned my first $10 within 2 days. Incredible experience!",
    image: "https://i.pravatar.cc/150?img=8",
  },
  {
    name: "Jannat Jahan",
    quote: "Smooth, fast, and fun to work — I love WorkHive!",
    image: "https://i.pravatar.cc/150?img=9",
  },
];

const Testimonial = () => {
  return (
    <div className="w-full py-16 bg-blue-50">
      <h2 className="text-3xl font-bold text-center mb-10 text-blue-900">
        What Our Users Say
      </h2>

      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        loop={true}
        speed={1000}
        grabCursor={true}
        slidesPerView={1}
        spaceBetween={20}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="max-w-6xl mx-auto px-4"
      >
        {testimonials.map((testimonial, i) => (
          <SwiperSlide key={i}>
            <div className="bg-white shadow-lg p-6 rounded-xl text-center h-full hover:shadow-xl transition-all duration-300">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-20 h-20 mx-auto rounded-full mb-4 border-4 border-yellow-300 object-cover"
              />
              <p className="text-gray-700 italic mb-2">"{testimonial.quote}"</p>
              <h4 className="text-blue-800 font-semibold">{testimonial.name}</h4>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Testimonial;
