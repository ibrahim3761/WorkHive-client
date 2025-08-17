import React from "react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AboutUS = () => {
  return (
    <div className="w-full mt-10">
      {/* Hero Section */}
      <motion.div
        className="w-full py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About WorkHive</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-blue-100">
            WorkHive is a global micro-tasking platform that connects buyers and
            workers, making task outsourcing easy, secure, and rewarding.
          </p>
        </div>
      </motion.div>

      {/* Our Mission */}
      <motion.div
        className="w-full py-16 bg-gradient-to-br from-blue-50 to-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
            Our Mission
          </h2>
          <p className="text-gray-700 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
            At WorkHive, our mission is to empower individuals around the world
            by creating opportunities for earning, learning, and growing through
            microtasks. We help buyers scale their operations effortlessly while
            giving workers the chance to earn flexibly from anywhere.
          </p>
        </div>
      </motion.div>

      {/* Core Values */}
      <motion.div
        className="w-full py-16 bg-gradient-to-br from-gray-50 to-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-10">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤝",
                title: "Collaboration",
                text: "We believe in the power of teamwork and a thriving community of buyers and workers.",
              },
              {
                icon: "⚡",
                title: "Efficiency",
                text: "Our platform makes task outsourcing and earning faster, easier, and more reliable.",
              },
              {
                icon: "🌍",
                title: "Inclusivity",
                text: "WorkHive welcomes people from all over the world to work, learn, and grow together.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-lg border border-white"
                whileHover={{ y: -10, scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-5xl mb-5">{item.icon}</div>
                <h4 className="text-2xl font-bold text-gray-800 mb-3">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-lg">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Closing Section */}
      <motion.div
        className="w-full py-20 bg-gradient-to-br from-indigo-900 to-blue-900 text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join the Hive Today
          </h2>
          <p className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Whether you’re looking to outsource tasks or earn money online,
            WorkHive is your trusted partner for growth, efficiency, and
            success.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUS;
