import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAuth from "../../../../Hooks/useAuth";
import Swal from "sweetalert2";

const TaskList = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionDetail, setSubmissionDetail] = useState("");

  const {
    data: tasks = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["availableTasks", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/available-tasks?email=${user.email}`);
      return res.data;
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submissionDetail.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Submission detail is required",
      });
    }

    const submission = {
      task_id: selectedTask._id,
      task_title: selectedTask.task_title,
      payable_amount: selectedTask.payable_amount,
      worker_email: user.email,
      worker_name: user.displayName,
      buyer_name: selectedTask.buyer_name,
      buyer_email: selectedTask.buyer_email,
      submission_details: submissionDetail,
      current_date: new Date(),
      status: "pending",
    };

    const res = await axiosSecure.post("/submissions", submission);

    if (res.data.insertedId) {
      Swal.fire({
        icon: "success",
        title: "Submission Successful",
      });
      setSelectedTask(null);
      setSubmissionDetail("");
      await refetch();
    }
  };

  if (isLoading) return <p className="text-center p-6">Loading tasks...</p>;

  return (
    <div className="p-4">
      {tasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">
            🚫 No Tasks Available Right Now
          </h3>
          <p className="text-gray-500 mt-2">Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white shadow rounded p-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-blue-800">
                  {task.task_title}
                </h3>
                <p className="text-sm text-gray-600">
                  Buyer: {task.buyer_name}
                </p>
                <p className="text-sm">Pay: ${task.payable_amount}</p>
                <p className="text-sm">
                  Deadline:{" "}
                  {new Date(task.completion_date).toLocaleDateString()}
                </p>
                <p className="text-sm">Slots Left: {task.required_workers}</p>
              </div>
              <button
                onClick={() => setSelectedTask(task)}
                className="btn btn-sm bg-blue-600 text-white mt-3"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost"
              onClick={() => setSelectedTask(null)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-blue-800 mb-2">
              {selectedTask.task_title}
            </h2>
            <p className="text-sm mb-1">Buyer: {selectedTask.buyer_name}</p>
            <p className="text-sm mb-1">
              Deadline:{" "}
              {new Date(selectedTask.completion_date).toLocaleDateString()}
            </p>
            <p className="text-sm mb-1">
              Pay per submission: ${selectedTask.payable_amount}
            </p>
            <p className="text-sm mb-3">Details: {selectedTask.task_detail}</p>
            <p className="text-sm mb-3">
              Submission Details: {selectedTask.submission_info}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <textarea
                placeholder="Enter your submission details here..."
                className="textarea textarea-bordered w-full"
                value={submissionDetail}
                onChange={(e) => setSubmissionDetail(e.target.value)}
                required
              ></textarea>
              <button
                type="submit"
                className="btn bg-blue-600 text-white w-full"
              >
                Submit Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
