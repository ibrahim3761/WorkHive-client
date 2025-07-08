import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";


const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  console.log(user.displayName,);
  

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
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
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">My Payment History</h2>

      {payments.length === 0 ? (
        <p className="text-gray-500 text-center">No payments made yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th>#</th>
                <th>Coins</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Transaction ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, idx) => (
                <tr key={payment._id}>
                  <td>{idx + 1}</td>
                  <td>{payment.coins}</td>
                  <td>${payment.amountPaid}</td>
                  <td>{payment.type || "N/A"}</td>
                  <td className="text-xs break-all">{payment.transactionId}</td>
                  <td>{new Date(payment.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
