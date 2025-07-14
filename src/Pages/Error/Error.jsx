import React from "react";
import { Link } from "react-router"; // make sure it's react-router-dom
import { AlertTriangle } from "lucide-react"; // Lucide equivalent of FaExclamationTriangle

const Error = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center px-4">
      <title>Work Hive || Error</title>
      <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Oops! Page Not Found</h1>
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default Error;
