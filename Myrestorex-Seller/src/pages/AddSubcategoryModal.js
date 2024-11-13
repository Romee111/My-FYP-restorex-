// src/components/AddSubcategoryModal.js
import { useState } from 'react';
import { XIcon } from '@heroicons/react/outline';

const AddSubcategoryModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting new subcategory:", { name }); // Debugging line
    onSubmit({ name }); // Only pass `name` in the payload
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Add New Subcategory</h3>
          <button onClick={onClose}>
            <XIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Subcategory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubcategoryModal;
