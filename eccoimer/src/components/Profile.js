// ProfileModal.js
import React from 'react';
import { Link } from 'react-router-dom';

const Profile = ({ user, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-black">
      <div className="bg-white w-[80%] md:w-[400px] p-6 rounded-lg shadow-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-4">Your Profile</h3>
        <p><strong>Name:</strong> {user?.name || "Guest"}</p>
        <p><strong>Email:</strong> {user?.email || "Not logged in"}</p>

        <div className="mt-4 space-y-2">
          <Link to="/profile" className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            View Profile
          </Link>
          <Link to="/orders" className="block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
            My Orders
          </Link>
          <button className="block w-full text-center bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
