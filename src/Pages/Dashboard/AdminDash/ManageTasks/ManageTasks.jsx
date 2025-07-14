import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../Hooks/useAxiosSecure';
import { Trash2 } from 'lucide-react';

const ManageTasks = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['allTasks'],
    queryFn: async () => {
      const res = await axiosSecure.get('/tasks/all');
      return res.data;
    }
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async ({ id, email, refundAmount }) => {
      return await axiosSecure.delete(`/task/admin/${id}`, {
        data: { email, refundAmount },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allTasks']);
      Swal.fire('Deleted!', 'Task has been removed and refund processed.', 'success');
    }
  });

  const handleDelete = (task) => {
    const refundAmount = task.required_workers * task.payable_amount;
    const email = task.created_by;

    Swal.fire({
      title: 'Are you sure?',
      text: `This will delete the task and refund ${refundAmount} coins.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTaskMutation.mutate({ id: task._id, email, refundAmount });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <title>Work Hive || Manage Tasks</title>
      <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
        Manage All Tasks
      </h2>

      {tasks.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-xl">🚫 No tasks available.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="table w-full">
            <thead className="bg-blue-100 text-blue-900 text-left">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Buyer</th>
                <th className="text-center">Workers</th>
                <th className="text-center">Pay/Worker(Coins)</th>
                <th className="text-center">Deadline</th>
                <th className="text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.map((task, idx) => (
                <tr key={task._id} className="hover:bg-blue-50 align-middle">
                  <td>{idx + 1}</td>
                  <td className="font-medium">{task.task_title}</td>
                  <td>{task.created_by}</td>
                  <td className="text-center">{task.required_workers}</td>
                  <td className="text-center">{task.payable_amount}</td>
                  <td className="text-center">
                    {new Date(task.completion_date).toLocaleDateString()}
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDelete(task)}
                      className="btn btn-sm bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-1 mx-auto"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageTasks;
