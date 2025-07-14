import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
  FaUsers,
  FaCoins,
  FaMoneyBillWave,
  FaUserTie,
  FaCheckCircle,
} from "react-icons/fa";

const AdminDashHome = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Get dashboard stats
  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-stats");
      return res.data;
    },
  });

  // Get all pending withdrawals
  const { data: withdrawals = [], isLoading: withdrawLoading } = useQuery({
    queryKey: ["pendingWithdrawals"],
    queryFn: async () => {
      const res = await axiosSecure.get("/withdrawals/pending");
      return res.data;
    },
  });

  // Handle payment success
  const paymentMutation = useMutation({
    mutationFn: async (withdrawal) => {
      return await axiosSecure.patch(`/withdrawals/approve/${withdrawal._id}`, {
        email: withdrawal.worker_email,
        coins: withdrawal.withdrawal_coin,
      });
    },
    onSuccess: () => {
      Swal.fire("Success", "Withdrawal approved and coins deducted!", "success");
      queryClient.invalidateQueries(["pendingWithdrawals"]);
    },
  });

  const handleApprove = (withdrawal) => {
    Swal.fire({
      title: "Approve Withdrawal?",
      text: `Approve ${withdrawal.withdrawal_coin} coins ($${withdrawal.withdrawal_amount}) for ${withdrawal.worker_name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#aaa",
    }).then((result) => {
      if (result.isConfirmed) {
        paymentMutation.mutate(withdrawal);
      }
    });
  };

  if (statsLoading || withdrawLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">
      <title>Work Hive || Admin</title>
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-100 p-6 rounded-xl text-center shadow-md space-y-2">
          <FaUsers className="text-4xl text-blue-600 mx-auto" />
          <h3 className="text-lg font-semibold text-blue-800">Total Workers</h3>
          <p className="text-2xl font-bold">{stats.workerCount}</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-xl text-center shadow-md space-y-2">
          <FaUserTie className="text-4xl text-yellow-600 mx-auto" />
          <h3 className="text-lg font-semibold text-yellow-800">Total Buyers</h3>
          <p className="text-2xl font-bold">{stats.buyerCount}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-xl text-center shadow-md space-y-2">
          <FaCoins className="text-4xl text-green-600 mx-auto" />
          <h3 className="text-lg font-semibold text-green-800">Total Coins</h3>
          <p className="text-2xl font-bold">{stats.totalCoins}</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-xl text-center shadow-md space-y-2">
          <FaMoneyBillWave className="text-4xl text-purple-600 mx-auto" />
          <h3 className="text-lg font-semibold text-purple-800">Total Payments</h3>
          <p className="text-2xl font-bold">${stats.totalPayments}</p>
        </div>
      </div>

      {/* Withdraw Requests Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-blue-900">
          Pending Withdrawals
        </h2>

        {withdrawals.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No pending withdrawal requests.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full bg-white rounded-lg shadow">
              <thead className="bg-blue-100 text-blue-900">
                <tr>
                  <th>#</th>
                  <th>Worker</th>
                  <th>Email</th>
                  <th>Coin</th>
                  <th>Amount ($)</th>
                  <th>Payment</th>
                  <th>Account</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w, idx) => (
                  <tr
                    key={w._id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td>{idx + 1}</td>
                    <td>{w.worker_name}</td>
                    <td>{w.worker_email}</td>
                    <td>{w.withdrawal_coin}</td>
                    <td>${w.withdrawal_amount}</td>
                    <td>{w.payment_system}</td>
                    <td>{w.account_number}</td>
                    <td>
                      <span className="badge badge-warning capitalize">
                        {w.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm bg-green-600 text-white hover:bg-green-700"
                        onClick={() => handleApprove(w)}
                      >
                        <FaCheckCircle className="inline-block mr-1" />
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashHome;
