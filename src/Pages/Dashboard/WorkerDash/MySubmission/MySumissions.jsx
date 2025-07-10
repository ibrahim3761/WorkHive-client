import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAuth from "../../../../Hooks/useAuth";

const MySubmissions = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["mySubmissions", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/submissions?email=${user.email}`);
      return res.data;
    },
  });

  const totalPages = Math.ceil(submissions.length / itemsPerPage);
  const paginatedSubmissions = submissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">My Submissions</h2>
      {submissions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <p className="text-gray-600">No submissions found.</p>
        </div>
      ) : (
        <>
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
              {paginatedSubmissions.map((submission, idx) => (
                <tr key={submission._id}>
                  <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
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
                    ${(submission.payable_amount / 10).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-sm btn-outline"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`btn btn-sm ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "btn-outline"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-sm btn-outline"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MySubmissions;
