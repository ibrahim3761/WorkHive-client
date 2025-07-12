import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAuth from "../../../../Hooks/useAuth";
import {
  FiArrowLeft,
  FiCalendar,
  FiCircle,
  FiUser,
  FiFileText,
} from "react-icons/fi";

const TaskDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submissionDetail, setSubmissionDetail] = useState("");

  const { data: task, isLoading } = useQuery({
    queryKey: ["singleTask", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/tasks/details/${id}`);
      return res.data;
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!submissionDetail.trim()) {
      return Swal.fire("Warning", "Submission detail is required", "warning");
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to submit this task now?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, submit it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "red",
    });

    if (!confirm.isConfirmed) return;

    const submission = {
      task_id: task._id,
      task_title: task.task_title,
      payable_amount: task.payable_amount,
      worker_email: user.email,
      worker_name: user.displayName,
      buyer_name: task.buyer_name,
      buyer_email: task.created_by,
      submission_details: submissionDetail,
      current_date: new Date(),
      status: "pending",
    };

    const res = await axiosSecure.post("/submissions", submission);

    if (res.data.insertedId) {
      Swal.fire(
        "Submitted!",
        "Your task was submitted successfully.",
        "success"
      );
      navigate("/dashboard/tasklist");
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
    <div className="max-w-7xl mx-auto md:p-4">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex mb-2 items-center gap-2 text-sm font-medium text-blue-600 border border-blue-600 px-4 py-2 rounded-md transition duration-200 hover:bg-blue-50 hover:text-blue-800"
      >
        <FiArrowLeft /> Back to Tasks
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Task Image */}
        {task.task_image_url && (
          <img
            src={task.task_image_url}
            alt="Task"
            className="w-full h-72 object-cover"
          />
        )}

        <div className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {task.task_title}
          </h2>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <FiUser className="text-blue-500" />
              <span>
                Buyer: <span className="font-medium">{task.buyer_name}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FiCalendar className="text-blue-500" />
              <span>
                Deadline:{" "}
                <span className="font-medium">
                  {new Date(task.completion_date).toLocaleDateString()}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FiCircle className="text-yellow-500" />
              <span>
                Pay:{" "}
                <span className="font-medium">{task.payable_amount} coins</span>
              </span>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <FiFileText className="text-blue-500" /> Task Details
              </h3>
              <p className="text-gray-600">{task.task_detail}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <FiFileText className="text-blue-500" /> Submission Instructions
              </h3>
              <p className="text-gray-600">{task.submission_info}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="submission"
                className="block text-lg font-medium text-gray-800 mb-2"
              >
                Your Submission
              </label>
              <textarea
                id="submission"
                placeholder="Enter your submission details here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows="6"
                value={submissionDetail}
                onChange={(e) => setSubmissionDetail(e.target.value)}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Submit Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
