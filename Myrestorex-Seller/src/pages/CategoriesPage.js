import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/outline';
import AddCategoryModal from './AddCategoryModal'; // Modal component for adding categories
import EditCategoryModal from './EditCategoryModal'; // Modal component for editing categories
import { useNavigate } from 'react-router-dom';
const AddCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/restorex/categories/getALLCategories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.getAllCategories && Array.isArray(data.getAllCategories)) {
        setCategories(data.getAllCategories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategorySubmit = async (newCategory) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/restorex/categories/addCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCategory),
      });
  
      if (response.ok) {
        // Instead of appending directly, call fetchCategories to refresh the state
        await fetchCategories();
        setShowAddModal(false);
      } else {
        console.error("Failed to add category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };
  

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/restorex/categories/deleteCategory/${categoryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCategories((prevCategories) => prevCategories.filter(category => category?._id !== categoryId));
      } else {
        console.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };
  const handleRowClick = (categoryId) => {
    navigate(`/category/${categoryId}/subcategories`);
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Categories</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Category
        </button>
      </div>
      <div className="overflow-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">No.</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <tr key={category?._id}  className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{index + 1}</td>
                  <td onClick={() => handleRowClick(category._id)} className="py-3 px-6 text-left cursor-pointer">{category?.name}</td>
                  <td className="py-3 px-6 text-center">
                    <button onClick={() => handleEditCategory(category)} className="text-blue-500 hover:text-blue-700 mr-2">
                      <PencilIcon className="h-5 w-5 inline" />
                    </button>
                    <button onClick={() => handleDeleteCategory(category?._id)} className="text-red-500 hover:text-red-700">
                      <TrashIcon className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-3 px-6 text-center">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <AddCategoryModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddCategorySubmit}
        />
      )}

      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <EditCategoryModal
          category={selectedCategory}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedCategory) => {
            setCategories((prev) =>
              prev.map((category) =>
                category?._id === updatedCategory?._id ? updatedCategory : category
              )
            );
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
};

export default AddCategoryPage;
