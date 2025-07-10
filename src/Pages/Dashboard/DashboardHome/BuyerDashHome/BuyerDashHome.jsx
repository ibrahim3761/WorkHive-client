import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAuth from "../../../../Hooks/useAuth";
import Swal from "sweetalert2";

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
      Swal.fire("Approved!", "Submission has been approved.", "success");
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
      Swal.fire("Rejected!", "Submission has been rejected.", "info");
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
    <div className="p-6 space-y-8">
      {/* Buyer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-6 rounded-xl shadow text-center">
          <h3 className="text-xl font-bold text-blue-800">Total Tasks</h3>
          <p className="text-3xl font-semibold">{stats.totalTasks}</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-xl shadow text-center">
          <h3 className="text-xl font-bold text-yellow-800">Pending Tasks</h3>
          <p className="text-3xl font-semibold">{stats.pendingSlots}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-xl shadow text-center">
          <h3 className="text-xl font-bold text-green-800">Total Paid</h3>
          <p className="text-3xl font-semibold">${stats.totalPayment}</p>
        </div>
      </div>

      {/* Task Review Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">
          Task to Review
        </h2>

        {submissions.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No pending submissions.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full bg-white rounded-xl shadow">
              <thead className="bg-blue-100 text-blue-900">
                <tr>
                  <th>#</th>
                  <th>Worker</th>
                  <th>Task Title</th>
                  <th>Payable</th>
                  <th>Submission</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, idx) => (
                  <tr key={submission._id}>
                    <td>{idx + 1}</td>
                    <td>{submission.worker_name}</td>
                    <td>{submission.task_title}</td>
                    <td>${submission.payable_amount}</td>
                    <td>
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="btn btn-sm btn-outline"
                      >
                        View
                      </button>
                    </td>
                    <td className="flex gap-2">
                      <button
                        onClick={() => approveMutation.mutate(submission)}
                        className="btn btn-xs bg-green-500 text-white"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectMutation.mutate(submission)}
                        className="btn btn-xs bg-red-500 text-white"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
            <button
              onClick={() => setSelectedSubmission(null)}
              className="absolute top-2 right-2 text-xl font-bold"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4 text-blue-800">
              Submission Details
            </h3>
            <p className="text-gray-700">
              {selectedSubmission.submission_details}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerDashHome;
