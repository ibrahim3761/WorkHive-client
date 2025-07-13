import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAuth from "../../../../Hooks/useAuth";
import Swal from "sweetalert2";
import {
  FaTasks,
  FaUserClock,
  FaMoneyBillWave,
  FaEye,
  FaCheck,
  FaTimes,
  FaUser,
  FaFileAlt,
  FaCoins,
} from "react-icons/fa";

const BuyerDashHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["buyerStats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const [taskRes, paymentRes] = await Promise.all([
        axiosSecure.get(`/tasks?email=${user.email}`),
        axiosSecure.get(`/payments?email=${user.email}`),
      ]);

      const tasks = taskRes.data;
      const payments = paymentRes.data;

      const totalTasks = tasks.length;
      const pendingSlots = tasks.reduce(
        (sum, task) => sum + task.required_workers,
        0
      );
      const totalPayment = payments.reduce(
        (sum, pay) => sum + pay.amountPaid,
        0
      );

      return { totalTasks, pendingSlots, totalPayment };
    },
  });

  const { data: submissions = [], isLoading: subLoading } = useQuery({
    queryKey: ["pendingSubmissions", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/submissions/pending?buyer=${user.email}`
      );
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (submission) => {
      return await axiosSecure.patch(`/submissions/approve/${submission._id}`, {
        coins: submission.payable_amount,
        worker_email: submission.worker_email,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingSubmissions"]);
      queryClient.invalidateQueries(["buyerStats"]);
      Swal.fire({
        title: "Approved!",
        text: "Submission has been approved.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (submission) => {
      return await axiosSecure.patch(`/submissions/reject/${submission._id}`, {
        task_id: submission.task_id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingSubmissions"]);
      queryClient.invalidateQueries(["buyerStats"]);
      Swal.fire({
        title: "Rejected!",
        text: "Submission has been rejected.",
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
      });
    },
  });

  if (statsLoading || subLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Buyer Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.displayName || "Buyer"}
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Tasks Card */}
        <div className="bg-white border border-blue-100 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-full">
              <FaTasks className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-600">Total Tasks</h3>
              <p className="text-2xl font-bold text-gray-800">
                {stats.totalTasks || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div className="bg-white border border-yellow-100 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-50 rounded-full">
              <FaUserClock className="text-yellow-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-600">
                Pending Tasks
              </h3>
              <p className="text-2xl font-bold text-gray-800">
                {stats.pendingSlots || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Total Paid Card */}
        <div className="bg-white border border-green-100 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-full">
              <FaMoneyBillWave className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-600">Total Paid</h3>
              <p className="text-2xl font-bold text-gray-800">
                ${stats.totalPayment?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Task Review Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FaFileAlt className="text-blue-500" /> Tasks to Review
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Review and approve pending submissions from workers
          </p>
        </div>

        {submissions.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FaUserClock className="inline-block text-4xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-600">
              No pending submissions
            </h3>
            <p className="text-gray-500">
              Submissions awaiting your review will appear here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FaUser className="inline mr-1" /> Worker
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FaFileAlt className="inline mr-1" /> Task Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FaCoins className="inline mr-1" /> Payable
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FaEye className="inline mr-1" /> Submission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission, idx) => (
                  <tr
                    key={submission._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <FaUser className="text-blue-600" />
                        </div>
                        <div>
                          <div>{submission.worker_name}</div>
                          <div className="text-xs text-gray-500">
                            {submission.worker_email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {submission.task_title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaCoins className="text-yellow-500" />{" "}
                        {submission.payable_amount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                      >
                        <FaEye /> View Details
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveMutation.mutate(submission)}
                          disabled={approveMutation.isLoading}
                          className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded-md flex items-center gap-1 text-sm transition-colors disabled:opacity-50"
                        >
                          {approveMutation.isLoading ? (
                            <svg
                              className="animate-spin h-4 w-4 text-green-800"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : (
                            <FaCheck />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => rejectMutation.mutate(submission)}
                          disabled={rejectMutation.isLoading}
                          className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-md flex items-center gap-1 text-sm transition-colors disabled:opacity-50"
                        >
                          {rejectMutation.isLoading ? (
                            <svg
                              className="animate-spin h-4 w-4 text-red-800"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : (
                            <FaTimes />
                          )}
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold text-gray-800">
                Submission Details: {selectedSubmission.task_title}
              </h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Submitted by
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaUser className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedSubmission.worker_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedSubmission.worker_email}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Task Details
                  </h4>
                  <p className="text-sm text-gray-900">
                    {selectedSubmission.task_title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <FaCoins className="text-yellow-500" />{" "}
                    {selectedSubmission.payable_amount} coins
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Submission Details
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-900 whitespace-pre-line">
                    {selectedSubmission.submission_details}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    rejectMutation.mutate(selectedSubmission);
                    setSelectedSubmission(null);
                  }}
                  disabled={rejectMutation.isLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                >
                  {rejectMutation.isLoading ? (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <FaTimes />
                  )}
                  Reject Submission
                </button>
                <button
                  onClick={() => {
                    approveMutation.mutate(selectedSubmission);
                    setSelectedSubmission(null);
                  }}
                  disabled={approveMutation.isLoading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                >
                  {approveMutation.isLoading ? (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <FaCheck />
                  )}
                  Approve Submission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerDashHome;
