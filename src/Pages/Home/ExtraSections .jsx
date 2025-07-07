import React from "react";

const ExtraSections = () => {
  return (
    <div className="px-4 md:px-8 py-10 space-y-20">

      {/* Section 1: How It Works */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">How It Works</h2>
        <p className="text-gray-700">
          Join as a worker to complete micro tasks or become a buyer and post your tasks. 
          WorkHive makes task matching easy, fast, and rewarding!
        </p>
      </div>

      {/* Section 2: Why Choose WorkHive */}
      <div className="text-center bg-yellow-100 py-10 rounded-xl shadow-inner">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Why Choose WorkHive</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6  ">
          <div>
            <h4 className="text-xl font-semibold mb-2">🚀 Fast Earnings</h4>
            <p className="text-gray-700">Complete tasks and get rewarded instantly in coins.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">🛡️ Secure Payments</h4>
            <p className="text-gray-700">Integrated with Stripe to ensure safe and fast transactions.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">🌍 Global Reach</h4>
            <p className="text-gray-700">Access tasks and workers from anywhere in the world.</p>
          </div>
        </div>
      </div>

      {/* Section 3: Partner With Us */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Partner With Us</h2>
        <p className="text-gray-700 ">
          Are you an agency, company, or digital entrepreneur? Partner with WorkHive to reach thousands of micro-workers and scale your operations efficiently.
        </p>
        <button className="mt-6 btn bg-blue-600 text-white px-6 rounded-full">
          Contact Us
        </button>
      </div>

    </div>
  );
};

export default ExtraSections;
