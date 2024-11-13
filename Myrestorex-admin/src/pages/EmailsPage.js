// src/pages/EmailsPage.js
import { useEffect, useState } from 'react';

const EmailsPage = () => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch pending requests on component mount
  useEffect(() => {
    console.log("EmailsPage mounted"); // Debug log

    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/restorex/request/pendingRequests', {
          method: 'GET', // Assuming GET based on the Postman test
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Data received:", data); // Log data to inspect

        if (data.message === 'Success') {
          setRequests(data.requests || []);
        } else {
          console.error("Failed to fetch requests:", data.message);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  // Handle approve/reject actions
  const handleResponse = async (requestId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/restorex/request/respondToRequest/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: action,
          response: action === 'approved' ? 'Your seller account has been approved. You can now proceed with adding your products.' : 'Your seller account request has been rejected.',
        }),
      });

      const data = await response.json();
      console.log("Response to request update:", data); // Log update response

      if (data.message === 'Request status updated and notification sent') {
        setMessage(`Request ${action} successfully.`);
        setRequests(requests.filter((req) => req._id !== requestId)); // Update state to remove the handled request
      } else {
        console.error("Failed to update request:", data.message);
      }
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Pending Requests</h2>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <div className="space-y-4">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request._id} className="bg-white p-4 rounded shadow-md">
              <h3 className="font-semibold">Request Type: {request.requestType}</h3>
              <p className="text-gray-700">Details: {request.requestDetails}</p>
              <div className="mt-4">
                <h4 className="font-semibold">Seller Information</h4>
                <p>Business Name: {request.sellerId.sellerInfo.businessName}</p>
                <p>Business Address: {request.sellerId.sellerInfo.businessAddress}</p>
                <p>Tax ID: {request.sellerId.sellerInfo.taxIdNumber}</p>
                <p>Account Holder: {request.sellerId.sellerInfo.accountHolderName}</p>
                <p>Email: {request.sellerId.email}</p>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleResponse(request._id, 'approved')}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleResponse(request._id, 'rejected')}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No pending requests found.</p>
        )}
      </div>
    </div>
  );
};

export default EmailsPage;
