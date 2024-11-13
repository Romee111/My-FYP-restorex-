import { XIcon } from '@heroicons/react/outline';
import { useState } from 'react';

const AddCategoryModal = ({ onClose, onSave }) => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    slug: "",
    Image: "",
  });

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/restorex/categories/addCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        const result = await response.json();
        onSave(result.newCategory);
        onClose();
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Add New Category</h3>
          <button onClick={onClose}>
            <XIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={categoryData.name}
              onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Slug</label>
            <input
              type="text"
              value={categoryData.slug}
              onChange={(e) => setCategoryData({ ...categoryData, slug: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Image URL</label>
            <input
              type="text"
              value={categoryData.Image}
              onChange={(e) => setCategoryData({ ...categoryData, Image: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
