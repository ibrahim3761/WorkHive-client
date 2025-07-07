import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hooks/useAxios";

const BestWorker = () => {
  const axiosInstance = useAxios();

  const { data: workers = [], isLoading, isError } = useQuery({
    queryKey: ["bestWorkers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/best-workers");
      return res.data; // backend already filters + sorts
    },
  });

  if (isLoading) {
    return (
      <div className="text-center text-blue-900 my-12">
        Loading best workers...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 my-12">
        Failed to load workers.
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 my-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-8">
        Best Workers
      </h2>

      {workers.length === 0 ? (
        <p className="text-center text-gray-500">No workers found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {workers.map(worker => (
            <div
              key={worker._id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition"
            >
              <img
                src={worker.photo || "https://i.ibb.co/khTb8Xm/user-placeholder.png"}
                alt={worker.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400 mb-4"
              />
              <h3 className="text-lg font-semibold text-blue-900 mb-1 text-center">
                {worker.name}
              </h3>
              <p className="text-yellow-500 font-semibold">
                Coins: {worker.coins || 0}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BestWorker;
