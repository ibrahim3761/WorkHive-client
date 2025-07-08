import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAuth from "../../../../Hooks/useAuth";

const MySubmissions = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["mySubmissions", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/submissions?email=${user.email}`);
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center py-6">Loading...</p>;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">My Submissions</h2>
      {submissions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <p className="text-gray-600">No submissions found.</p>
        </div>
      ) : (
        <table className="table w-full bg-white shadow-md rounded-xl">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th>#</th>
              <th>Task Title</th>
              <th>Buyer</th>
              <th>Submitted On</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, idx) => (
              <tr key={submission._id}>
                <td>{idx + 1}</td>
                <td className="font-medium text-blue-800">
                  {submission.task_title}
                </td>
                <td className="text-sm text-gray-700">
                  {submission.buyer_name}
                  <br />
                  <span className="text-xs text-gray-500">
                    {submission.buyer_email}
                  </span>
                </td>
                <td>
                  {new Date(submission.submission_date).toLocaleDateString()}
                </td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      submission.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : submission.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {submission.status}
                  </span>
                </td>
                <td className="font-medium text-blue-800">
                  ${submission.payable_amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MySubmissions;
