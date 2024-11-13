import React, { useState } from 'react';

const CheckoutPage = () => {
  const [selectedMethod, setSelectedMethod] = useState('Credit/Debit Card');

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-w-xl">
        <h2 className="text-2xl font-semibold mb-6">Order Payment</h2>
        <p className="text-gray-700 mb-4">Amount: <span className="font-bold">USD 0</span></p>

        <h3 className="text-xl font-semibold mb-4">Select Payment Method</h3>
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <button
            onClick={() => handleSelectMethod('Credit/Debit Card')}
            className={`py-3 px-6 w-full md:w-auto rounded-lg shadow-md ${
              selectedMethod === 'Credit/Debit Card'
                ? 'bg-blue-800 text-white'
                : 'bg-blue-50 text-blue-800'
            }`}
          >
            Credit/Debit Card
          </button>
          <button
            onClick={() => handleSelectMethod('Raast ID')}
            className={`py-3 px-6 w-full md:w-auto rounded-lg shadow-md ${
              selectedMethod === 'Raast ID'
                ? 'bg-blue-800 text-white'
                : 'bg-blue-50 text-blue-800'
            }`}
          >
            Raast ID
          </button>
          <button
            onClick={() => handleSelectMethod('Cash on Delivery (COD)')}
            className={`py-3 px-6 w-full md:w-auto rounded-lg shadow-md ${
              selectedMethod === 'Cash on Delivery (COD)'
                ? 'bg-blue-800 text-white'
                : 'bg-blue-50 text-blue-800'
            }`}
          >
            Cash on Delivery (COD)
          </button>
        </div>

        {/* Conditional Rendering of Payment Method Inputs */}
        <div className="mt-6">
          {selectedMethod === 'Credit/Debit Card' && (
            <div>
              <h4 className="text-lg font-semibold mb-2">Enter Card Details</h4>
              <form>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Expiration Date"
                    className="w-1/2 p-2 border rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-1/2 p-2 border rounded-md"
                  />
                </div>
                <button className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg w-full">
                  Make Payment
                </button>
              </form>
            </div>
          )}

          {selectedMethod === 'Raast ID' && (
            <div>
              <h4 className="text-lg font-semibold mb-2">Enter Raast ID</h4>
              <form>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Raast ID"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <button className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg w-full">
                  Make Payment
                </button>
              </form>
            </div>
          )}

          {selectedMethod === 'Cash on Delivery (COD)' && (
            <div>
              <h4 className="text-lg font-semibold mb-2">Cash on Delivery</h4>
              <p>Payment will be collected at delivery.</p>
              <button className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg w-full">
                Confirm Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
