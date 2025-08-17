import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAuth from "../../../../Hooks/useAuth";
import { Link } from "react-router";
import { FaCoins, FaUser, FaCalendarAlt, FaUsers } from "react-icons/fa";

const TaskList = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [sortOrder, setSortOrder] = useState("asc"); // default: ascending

  const { data: tasks = [], isLoading } = useQuery({
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

  // sort tasks
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.payable_amount - b.payable_amount;
    } else {
      return b.payable_amount - a.payable_amount;
    }
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <title>Work Hive || Task List</title>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Available Tasks
        </h2>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-gray-700 font-medium">
            Sort by Price:
          </label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Tasks Available
            </h3>
            <p className="text-gray-600">
              There are currently no tasks available. Please check back later.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {task.task_title}
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaUser className="text-blue-500" />
                    <span>
                      Buyer:{" "}
                      <span className="font-medium">{task.buyer_name}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCoins className="text-yellow-500" />
                    <span>
                      Pay:{" "}
                      <span className="font-medium">
                        {task.payable_amount} coins
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCalendarAlt className="text-blue-500" />
                    <span>
                      Deadline:{" "}
                      <span className="font-medium">
                        {new Date(task.completion_date).toLocaleDateString()}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <FaUsers className="text-blue-500" />
                    <span>
                      Slots:{" "}
                      <span className="font-medium">
                        {task.required_workers}
                      </span>
                    </span>
                  </div>
                </div>

                <Link
                  to={`/dashboard/task/${task._id}`}
                  className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
