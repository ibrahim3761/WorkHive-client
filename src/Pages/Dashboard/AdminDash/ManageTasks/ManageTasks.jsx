import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../Hooks/useAxiosSecure';

const ManageTasks = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Get all tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['allTasks'],
    queryFn: async () => {
      const res = await axiosSecure.get('/tasks/all');
      return res.data;
    }
  });

  // Delete Task
  const deleteTaskMutation = useMutation({
    mutationFn: async ({ id, email, refundAmount }) => {
      return await axiosSecure.delete(`/task/admin/${id}`, {
        data: {
          email,
          refundAmount,
        },
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
      text: `This task will be permanently deleted and refund ${refundAmount} coins to the buyer.`,
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
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Manage Tasks</h2>
      <div className="overflow-x-auto">
        <table className="table w-full bg-white rounded-xl shadow">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Buyer</th>
              <th>Workers</th>
              <th>Pay/Worker</th>
              <th>Deadline</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, idx) => (
              <tr key={task._id}>
                <td>{idx + 1}</td>
                <td>{task.task_title}</td>
                <td>{task.created_by}</td>
                <td>{task.required_workers}</td>
                <td>${task.payable_amount}</td>
                <td>{new Date(task.completion_date).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-xs bg-red-500 text-white"
                    onClick={() => handleDelete(task)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTasks;
