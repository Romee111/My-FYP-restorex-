// src/components/RequestModal.js
import { useState } from 'react';

const RequestModal = ({ onClose }) => {
  const [requestDetails, setRequestDetails] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage

      const response = await fetch('http://localhost:3000/restorex/request/createRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add token to Authorization header
        },
        body: JSON.stringify({
          sellerId: "SELLER_ID_HERE", // Replace with dynamic seller ID if available
          requestType: "update",
          requestDetails,
          status: "pending",
          response: ""
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('Request submitted successfully.');
        onClose(); // Close modal after submission
      } else {
        console.error('Failed to submit request:', data.message);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4" style={{color:"#001F3F"}} >Create Request</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-2 border rounded mb-4 text-black"
            rows="4"
            placeholder="Enter request details..."
            value={requestDetails}
            onChange={(e) => setRequestDetails(e.target.value)}
          ></textarea>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              style={{backgroundColor:"#001f3f", Color:"white"}}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{backgroundColor:"#001f3f", Color:"white"}}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;
