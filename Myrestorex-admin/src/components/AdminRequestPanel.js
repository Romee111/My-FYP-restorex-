// src/components/AdminRequestPanel.js
import { useEffect, useState } from 'react';

const AdminRequestPanel = () => {
  console.log("AdminRequestPanel mounted"); // Debug log

  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log("AdminRequestPanel useEffect triggered"); // Log for useEffect

    const fetchRequests = async () => {
      console.log("fetchRequests called"); // Log for API call
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/restorex/request/pendingRequests', {
          method: 'GET', // Update to GET as required
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Data received:", data); // Inspect data

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

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Pending Requests</h2>
      <p>This is the AdminRequestPanel.</p> {/* Fallback content */}
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <div className="space-y-4">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request._id} className="bg-white p-4 rounded shadow-md">
              <h3 className="font-semibold">Request Type: {request.requestType}</h3>
              <p className="text-gray-700">Details: {request.requestDetails}</p>
              {/* Additional fields */}
            </div>
          ))
        ) : (
          <p>No pending requests found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminRequestPanel;
