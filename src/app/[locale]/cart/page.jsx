
'use client';
import CartView from '@/app/components/CartView';
import CheckoutView from '@/app/components/CheckoutView';
import { useState } from 'react';
 

export default function CartCheckoutPage() {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };
 const [cartItems, setCartItems] = useState([]);
  return (
    <div className="lg:max-w-7xl mx-auto p-4 min-h-screen">
      <div className="mb-6 mt-6">
        <h1 className="text-2xl font-semibold">
          {step === 1 ? 'Your Cart' : 'Checkout'}
        </h1>
         
      </div>

      {step === 1 && <CartView cartItems={cartItems} setCartItems={setCartItems} handleNext={handleNext}/>}
      {step === 2 && <CheckoutView cartItems={cartItems}/>}

      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button onClick={handleBack} className="bg-gray-300 px-4 py-2 rounded">
            Back
          </button>
        )}
        {/* {step < 2 && (
          <button onClick={handleNext} className="bg-[#67bee4] text-white px-4 py-2 rounded">
            Proceed to Checkout
          </button>
        )} */}
      </div>
    </div>
  );
}
