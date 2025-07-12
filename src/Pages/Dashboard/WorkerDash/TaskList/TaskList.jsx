import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAuth from "../../../../Hooks/useAuth";
import { Link } from "react-router";

const TaskList = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: tasks = [],
    isLoading,
  } = useQuery({
    queryKey: ["availableTasks", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/available-tasks?email=${user.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

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
              <Link
                to={`/dashboard/task/${task._id}`}
                className="btn btn-sm bg-blue-600 text-white mt-3"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
