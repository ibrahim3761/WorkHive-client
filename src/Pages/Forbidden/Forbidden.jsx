import React from 'react';
import { Link } from 'react-router';
import { Lock } from 'lucide-react';

const Forbidden = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-sm">
                <div className="flex justify-center mb-4">
                    <Lock className="w-16 h-16 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold text-red-600 mb-2">403 Forbidden</h1>
                <p className="text-gray-600 mb-6">
                    You do not have permission to access this page.
                </p>
                <Link
                    to="/"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default Forbidden;
