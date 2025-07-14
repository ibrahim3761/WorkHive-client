import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { FaCoins, FaUser, FaCheckCircle, FaHourglassHalf, FaFileAlt } from "react-icons/fa";

const WorkerDashHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["workerSubmissions", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/submissions?email=${user.email}`);
      return res.data;
    },
  });

   if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  const totalSubmissions = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const totalApprovedCoins = submissions
    .filter((s) => s.status === "approved")
    .reduce((sum, s) => sum + s.payable_amount, 0);

  const totalEarningsInDollars = (totalApprovedCoins / 20).toFixed(2);
  const approvedSubmissions = submissions.filter((s) => s.status === "approved");

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
      <title>Work Hive || Worker Dashboard</title>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Submissions Card */}
        <div className="bg-white border border-blue-100 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-full">
              <FaFileAlt className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-600">Total Submissions</h3>
              <p className="text-2xl font-bold text-gray-800">{totalSubmissions}</p>
            </div>
          </div>
        </div>

        {/* Pending Submissions Card */}
        <div className="bg-white border border-yellow-100 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-50 rounded-full">
              <FaHourglassHalf className="text-yellow-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-600">Pending Submissions</h3>
              <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
            </div>
          </div>
        </div>

        {/* Total Earnings Card */}
        <div className="bg-white border border-green-100 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-full">
              <FaCoins className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-600">Total Earnings</h3>
              <p className="text-2xl font-bold text-gray-800 flex items-center gap-1">
                <FaCoins className="text-yellow-500" /> {totalApprovedCoins}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                ≈ ${totalEarningsInDollars} USD
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Approved Submissions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FaCheckCircle className="text-green-500" /> Approved Submissions
          </h2>
        </div>

        {approvedSubmissions.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FaFileAlt className="inline-block text-4xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-600">No approved submissions yet</h3>
            <p className="text-gray-500">Your approved tasks will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FaCoins className="inline mr-1" /> Earned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FaUser className="inline mr-1" /> Buyer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {approvedSubmissions.map((sub, idx) => (
                  <tr key={sub._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sub.task_title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaCoins className="text-yellow-500" /> {sub.payable_amount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.buyer_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Approved
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDashHome;