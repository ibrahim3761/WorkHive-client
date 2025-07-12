import React, { useState, useEffect } from "react";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaCoins, FaMoneyBillWave, FaWallet, FaExchangeAlt } from "react-icons/fa";

const WithdrawRequest = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [userCoins, setUserCoins] = useState(0);
  const [withdrawCoins, setWithdrawCoins] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Bkash");
  const [accountNumber, setAccountNumber] = useState("");

  const withdrawAmount = (withdrawCoins / 20).toFixed(2); // 20 coins = 1$

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/users/${user.email}`).then((res) => {
        setUserCoins(res.data.coins || 0);
      });
    }
  }, [user, axiosSecure]);

  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (withdrawCoins > userCoins) {
      return Swal.fire("Error", "Insufficient coins", "error");
    }
    if (withdrawCoins < 200) {
      return Swal.fire(
        "Error",
        "You need at least 200 coins to request withdrawal.",
        "error"
      );
    }

    const request = {
      worker_email: user.email,
      worker_name: user.displayName,
      withdrawal_coin: parseInt(withdrawCoins),
      withdrawal_amount: parseFloat(withdrawAmount),
      payment_system: paymentMethod,
      account_number: accountNumber,
    };

    const res = await axiosSecure.post("/withdrawals", request);

    if (res.data.insertedId) {
      Swal.fire("Success", "Withdrawal request submitted", "success");
      setWithdrawCoins(0);
      setAccountNumber("");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
          <FaExchangeAlt className="text-yellow-600 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Withdraw Coins</h2>
        <p className="text-gray-600 mt-2">Convert your coins to cash</p>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaCoins className="text-yellow-500 text-xl" />
            <span className="font-medium text-gray-700">Available Coins:</span>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-800">{userCoins} coins</p>
            <p className="text-sm text-gray-600">≈ ${(userCoins / 20).toFixed(2)} USD</p>
          </div>
        </div>
      </div>

      {userCoins < 200 ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
          <div className="flex items-start gap-2">
            <div className="text-red-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-red-700">Minimum withdrawal not met</p>
              <p className="text-sm text-red-600">
                You need at least 200 coins to withdraw. You currently have {userCoins} coins.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleWithdraw} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaCoins className="inline mr-1 text-yellow-500" /> Coins to Withdraw
            </label>
            <div className="relative">
              <input
                type="number"
                min={200}
                max={userCoins}
                value={withdrawCoins}
                onChange={(e) => setWithdrawCoins(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter coins amount"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCoins className="text-yellow-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Minimum: 200 coins (${(200/20).toFixed(2)})
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaMoneyBillWave className="inline mr-1 text-green-500" /> Equivalent Amount ($)
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                value={withdrawAmount}
                disabled
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaWallet className="inline mr-1 text-blue-500" /> Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="Bkash">Bkash</option>
              <option value="Rocket">Rocket</option>
              <option value="Nagad">Nagad</option>
              <option value="Upay">Upay</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <svg className="inline mr-1 w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Account Number
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter your account number"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <FaExchangeAlt /> Request Withdrawal
          </button>
        </form>
      )}
    </div>
  );
};

export default WithdrawRequest;