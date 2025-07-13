import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAuth from "../../../../Hooks/useAuth";
import {
  FiEdit,
  FiTrash2,
  FiX,
  FiSave,
  FiCalendar,
  FiUsers,
  FiDollarSign,
} from "react-icons/fi";

const MyTasks = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [editingTask, setEditingTask] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myTasks", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/tasks?email=${user.email}`);
      return res.data;
    },
  });

  const handleDelete = async (task) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the task and may refund coins.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    const refundAmount =
      task.status === "open" ? task.required_workers * task.payable_amount : 0;

    await axiosSecure.delete(`/tasks/${task._id}`, {
      data: { email: user.email, refundAmount },
    });
    await refetch();
    queryClient.invalidateQueries({ queryKey: ["userInfo", user.email] });

    Swal.fire("Deleted!", "The task has been removed.", "success");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedTask = {
      task_title: form.task_title.value,
      task_detail: form.task_detail.value,
      submission_info: form.submission_info.value,
    };

    await axiosSecure.patch(`/tasks/${editingTask._id}`, updatedTask);
    setEditingTask(null);
    Swal.fire("Updated!", "Task has been updated successfully.", "success");
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          My Tasks
        </h2>
        <div className="text-sm text-gray-500">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"} found
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="inline-block w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-600">
            No tasks created yet
          </h3>
          <p className="text-gray-500">Your created tasks will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FiUsers className="inline mr-1" /> Workers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FiDollarSign className="inline mr-1" /> Pay/Worker
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FiCalendar className="inline mr-1" /> Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task, idx) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {task.task_title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.required_workers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.payable_amount} coins
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(task.completion_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.status === "open"
                            ? "bg-green-100 text-green-800"
                            : task.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <FiEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(task)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleUpdate}
            className="bg-white rounded-xl shadow-lg w-full max-w-md"
          >
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Update Task
              </h3>
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  name="task_title"
                  defaultValue={editingTask.task_title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details
                </label>
                <textarea
                  name="task_detail"
                  defaultValue={editingTask.task_detail}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Submission Info
                </label>
                <input
                  name="submission_info"
                  defaultValue={editingTask.submission_info}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-1"
              >
                <FiSave /> Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
