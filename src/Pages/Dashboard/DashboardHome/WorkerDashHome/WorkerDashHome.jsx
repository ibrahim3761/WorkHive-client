import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

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

  const approvedSubmissions = submissions.filter(
    (s) => s.status === "approved"
  );

  return (
    <div className="p-6 space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-6 rounded-xl shadow text-center">
          <h3 className="text-xl font-bold text-blue-800">Total Submissions</h3>
          <p className="text-3xl font-semibold">{totalSubmissions}</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-xl shadow text-center">
          <h3 className="text-xl font-bold text-yellow-800">
            Pending Submissions
          </h3>
          <p className="text-3xl font-semibold">{pendingCount}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-xl shadow text-center">
          <h3 className="text-xl font-bold text-green-800">Total Earnings</h3>
          <p className="text-2xl font-semibold text-gray-800">
            {totalApprovedCoins} Coins
          </p>
          <p className="text-lg text-green-700 font-medium">
            = ${totalEarningsInDollars}
          </p>
        </div>
      </div>

      {/* Approved Submissions */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">
          Approved Submissions
        </h2>
        {approvedSubmissions.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No approved submissions yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full bg-white rounded-xl shadow">
              <thead className="bg-blue-100 text-blue-900">
                <tr>
                  <th>#</th>
                  <th>Task Title</th>
                  <th>Pay</th>
                  <th>Buyer</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {approvedSubmissions.map((sub, idx) => (
                  <tr key={sub._id}>
                    <td>{idx + 1}</td>
                    <td>{sub.task_title}</td>
                    <td>${sub.payable_amount}</td>
                    <td>{sub.buyer_name}</td>
                    <td>
                      <span className="badge bg-green-500 text-white">
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
