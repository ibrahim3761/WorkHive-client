import React, { useState, useEffect } from "react";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

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
    <div className="max-w-xl mx-auto px-4 py-10 bg-white shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Withdraw Coins</h2>
      <p className="mb-4">
        <strong>Current Coins:</strong> {userCoins} = ${" "}
        {(userCoins / 20).toFixed(2)}
      </p>

      {userCoins < 200 ? (
        <div className="text-center text-red-600 font-semibold">
          Minimum 200 coins required to withdraw. You currently have {userCoins}{" "}
          coins.
        </div>
      ) : (
        <form onSubmit={handleWithdraw} className="space-y-4">
          <div>
            <label className="label">Coin to Withdraw</label>
            <input
              type="number"
              min={1}
              max={userCoins}
              value={withdrawCoins}
              onChange={(e) => setWithdrawCoins(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label">Withdraw Amount ($)</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={withdrawAmount}
              disabled
            />
          </div>

          <div>
            <label className="label">Payment System</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="select select-bordered w-full"
            >
              <option>Bkash</option>
              <option>Rocket</option>
              <option>Nagad</option>
              <option>Upay</option>
            </select>
          </div>

          <div>
            <label className="label">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="btn bg-yellow-400 text-blue-900 w-full"
          >
            Submit Withdrawal
          </button>
        </form>
      )}
    </div>
  );
};

export default WithdrawRequest;
