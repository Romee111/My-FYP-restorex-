// src/components/EditSubcategoryModal.js
import { useState } from 'react';

const EditSubcategoryModal = ({ isOpen, onClose, onSubmit, subcategory }) => {
  const [name, setName] = useState(subcategory?.name || '');

  const handleSave = () => {
    onSubmit({ name });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Edit Subcategory</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="mb-4">
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
          <button onClick={onClose} className="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSubcategoryModal;
