import React from "react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const featureCardVariants = {
  hover: { y: -10, scale: 1.03, transition: { duration: 0.3 } }
};

const ExtraSections = () => {
  return (
    <div className="w-full">

      {/* Section 1: How It Works - Full width with colored background */}
      <motion.div 
        className="w-full py-5 bg-gradient-to-br from-blue-50 to-purple-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="inline-block mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4 relative">
              How It Works
            </h2>
          </div>
          <p className="text-gray-700 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
            Join as a worker to complete micro tasks or become a buyer and post your tasks. 
            <span className="font-semibold text-blue-600"> WorkHive makes task matching easy, fast, and rewarding!</span>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
            {[
              { icon: "👥", title: "1. Sign Up", text: "Create your account in minutes", color: "from-blue-100 to-blue-50" },
              { icon: "📝", title: "2. Post or Browse", text: "Buyers post tasks, workers browse opportunities", color: "from-purple-100 to-purple-50" },
              { icon: "💰", title: "3. Earn & Grow", text: "Complete tasks and withdraw earnings", color: "from-green-100 to-green-50" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className={`bg-gradient-to-br ${item.color} p-8 rounded-2xl shadow-lg border border-white`}
                variants={featureCardVariants}
                whileHover="hover"
              >
                <div className="text-5xl mb-5">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Section 2: Why Choose WorkHive - Full width with alternating background */}
      <motion.div 
        className="w-full py-10 bg-gradient-to-br from-gray-50 to-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="inline-block mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4 relative">
              Why Choose WorkHive
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-28 h-1.5 rounded-full"></span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
            {[
              { 
                icon: "🚀", 
                title: "Fast Earnings", 
                text: "Complete tasks and get rewarded instantly in coins.",
                bg: "bg-gradient-to-br from-yellow-50 to-amber-50"
              },
              { 
                icon: "🛡️", 
                title: "Secure Payments", 
                text: "Integrated with Stripe to ensure safe transactions.",
                bg: "bg-gradient-to-br from-green-50 to-teal-50"
              },
              { 
                icon: "🌍", 
                title: "Global Reach", 
                text: "Access tasks and workers from anywhere in the world.",
                bg: "bg-gradient-to-br from-blue-50 to-indigo-50"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className={`${item.bg} p-8 rounded-2xl shadow-lg border border-white`}
                variants={featureCardVariants}
                whileHover="hover"
              >
                <div className="text-5xl mb-5">{item.icon}</div>
                <h4 className="text-2xl font-bold text-gray-800 mb-3">{item.title}</h4>
                <p className="text-gray-600 text-lg">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Section 3: Partner With Us - Full width with CTA */}
      <motion.div 
        className="w-full py-20 bg-gradient-to-br from-blue-900 to-indigo-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative inline-block">
              Partner With Us
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1.5 rounded-full"></span>
            </h2>
            <p className="text-blue-100 text-lg md:text-xl mb-10 leading-relaxed">
              Are you an agency, company, or digital entrepreneur? Partner with WorkHive to reach thousands of micro-workers and scale your operations efficiently.
            </p>
            <motion.button 
              className=" px-10 py-4 bg-gradient-to-r from-white to-blue-100 text-blue-900 rounded-full font-bold text-lg md:text-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Our Partnership Team
            </motion.button>
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default ExtraSections;