import React from 'react'; 
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useState } from 'react';

const CheckoutForm = () => {

  const [paymentError, setPaymentError] = useState();
  const [paymentFinished, setPaymentFinished] = useState();

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    if(error){
      setPaymentError(error.message);
      setPaymentFinished(null);
    } else {
      setPaymentError(null);
      setPaymentFinished(paymentMethod);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
      {
        paymentError && <p style={{color:'red'}}>{paymentError}</p>
      }
      {
        paymentFinished && <p style={{color:'green'}}>Payment Successful</p>
      }
    </form>
  );
};

export default CheckoutForm;