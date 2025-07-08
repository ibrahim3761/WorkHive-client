import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import PurchaseForm from './PurchaseForm';

const stripePromise = loadStripe(import.meta.env.VITE_payment_key)
const PuchaseCoin = () => {
    return (
        <Elements stripe={stripePromise}>
            <PurchaseForm></PurchaseForm>
        </Elements>
    );
};

export default PuchaseCoin;