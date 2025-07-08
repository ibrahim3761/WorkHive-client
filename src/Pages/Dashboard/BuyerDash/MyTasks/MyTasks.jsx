import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAuth from "../../../../Hooks/useAuth";

const MyTasks = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [editingTask, setEditingTask] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    refetch,
    isLoading,
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
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    const refundAmount =
      task.status === "open" ? task.required_workers * task.payable_amount : 0;

    await axiosSecure.delete(`/tasks/${task._id}`, {
      data: { email: user.email, refundAmount },
    });
    await refetch(); // your current task list refetch
    queryClient.invalidateQueries({ queryKey: ["userInfo", user.email] });

    Swal.fire("Deleted!", "The task has been removed.", "success");
    refetch();
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

  if (isLoading) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">My Tasks</h2>
      <div className="overflow-x-auto">
        <table className="table w-full border">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Workers</th>
              <th>Pay/Worker</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, idx) => (
              <tr key={task._id}>
                <td>{idx + 1}</td>
                <td>{task.task_title}</td>
                <td>{task.required_workers}</td>
                <td>{task.payable_amount}</td>
                <td>{new Date(task.completion_date).toLocaleDateString()}</td>
                <td>{task.status}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="btn btn-sm bg-yellow-400 text-blue-900"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(task)}
                    className="btn btn-sm bg-red-500 text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            onSubmit={handleUpdate}
            className="bg-white rounded-xl p-6 max-w-lg w-full shadow-lg"
          >
            <h3 className="text-xl font-bold mb-4">Update Task</h3>
            <div className="mb-4">
              <label className="label">Title</label>
              <input
                name="task_title"
                defaultValue={editingTask.task_title}
                className="input input-bordered w-full"
              />
            </div>
            <div className="mb-4">
              <label className="label">Details</label>
              <textarea
                name="task_detail"
                defaultValue={editingTask.task_detail}
                className="textarea textarea-bordered w-full"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="label">Submission Info</label>
              <input
                name="submission_info"
                defaultValue={editingTask.submission_info}
                className="input input-bordered w-full"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn bg-blue-600 text-white">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
