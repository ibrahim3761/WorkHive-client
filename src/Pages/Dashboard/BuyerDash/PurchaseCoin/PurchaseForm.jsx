import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { useQueryClient } from "@tanstack/react-query";

const packages = [
  { coins: 10, price: 1 },
  { coins: 150, price: 10 },
  { coins: 500, price: 20 },
  { coins: 1000, price: 35 },
];

const PurchaseForm = () => {
  const [selected, setSelected] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [cardError, setCardError] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient(); // ✅ add query client

  // create payment intent
  const createIntent = async (pkg) => {
    const res = await axiosSecure.post("/create-payment-intent", {
      amount: pkg.price * 100,
    });
    setClientSecret(res.data.clientSecret);
    setSelected(pkg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) return;
    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setCardError(error.message);
      return Swal.fire({
        icon: "error",
        title: "Card Error",
        text: error.message,
      });
    }

    Swal.fire({
      icon: "success",
      title: "Card Verified",
      text: "Your card has been verified successfully!",
      timer: 2000,
      showConfirmButton: false,
    });

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: user.displayName,
          email: user.email,
        },
      },
    });

    if (result.error) {
      setCardError(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      setCardError("");

      const paymentData = {
        email: user.email,
        coinsPurchased: selected.coins,
        amountPaid: selected.price,
        transactionId: result.paymentIntent.id,
        paymentMethod: result.paymentIntent.payment_method_types,
        type:"Coin Purchase",
        date: new Date(),
      };

      const res = await axiosSecure.post("/payments", paymentData);
      if (res.data.success) {
        // ✅ Invalidate userInfo to refetch coins instantly
        queryClient.invalidateQueries({ queryKey: ["userInfo", user.email] });

        Swal.fire({
          icon: "success",
          title: "Payment Successful",
          html: `
            <p>${selected.coins} coins added to your account.</p>
            <code>${result.paymentIntent.id}</code>
          `,
          toast: true,
          position: "top-end",
          timer: 4000,
          showConfirmButton: false,
        });

        setSelected(null);
        setClientSecret("");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-center mb-8 text-blue-800">
        Select a Coin Package
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {packages.map((pkg, index) => (
          <div
            key={index}
            onClick={() => createIntent(pkg)}
            className={`p-6 rounded-xl border cursor-pointer text-center transition ${
              selected?.coins === pkg.coins
                ? "bg-blue-50 border-blue-600"
                : "bg-white hover:shadow-md"
            }`}
          >
            <h3 className="text-xl font-bold text-yellow-500">
              {pkg.coins} Coins
            </h3>
            <p className="text-gray-600 mb-2">Only ${pkg.price}</p>
            <button className="btn btn-sm bg-blue-600 text-white">
              Buy Now
            </button>
          </div>
        ))}
      </div>

      {selected && clientSecret && (
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg border"
        >
          <h3 className="text-xl font-semibold text-center mb-4">
            Pay ${selected.price} for {selected.coins} coins
          </h3>

          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#32325d",
                },
                invalid: {
                  color: "#fa755a",
                },
              },
            }}
          />

          {cardError && (
            <p className="text-red-500 text-sm mt-2">{cardError}</p>
          )}

          <button type="submit" className="btn btn-primary mt-6 w-full">
            Confirm Payment
          </button>
        </form>
      )}
    </div>
  );
};

export default PurchaseForm;
