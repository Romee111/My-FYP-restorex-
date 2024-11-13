// src/pages/SubcategoriesPage.js
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/outline';
import EditSubcategoryModal from './EditSubCategoryModal';
import AddSubcategoryModal from './AddSubcategoryModal';
function SubcategoriesPage() {
  const { categoryId } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const fetchSubcategories = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `http://localhost:3000/restorex/categories/${categoryId}/subcategories/getALLSubCategories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (data && data.getAllSubCategories) {
        const filteredSubcategories = data.getAllSubCategories.filter(
          (subcategory) => subcategory.category === categoryId
        );
        setSubcategories(filteredSubcategories);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, [categoryId]);

  const openEditModal = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSubcategory(null);
  };
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleUpdateSubcategory = async (updatedData) => {
    const token = localStorage.getItem('token');
    const updatedSubcategory = { name: updatedData.name };

    try {
      const response = await fetch(
        `http://localhost:3000/restorex/subcategories/updateSubCategory/${selectedSubcategory._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedSubcategory),
        }
      );

      if (response.ok) {
        // Fetch the updated list of subcategories
        await fetchSubcategories();
        closeEditModal(); // Close the modal after updating the list
      } else {
        const errorData = await response.json();
        console.error("Failed to update subcategory:", errorData.message);
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
    }
  };

  const handleDelete = async (subcategoryId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `http://localhost:3000/restorex/subcategories/deleteSubCategory/${subcategoryId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSubcategories((prevSubcategories) =>
          prevSubcategories.filter((subcategory) => subcategory?._id !== subcategoryId)
        );
        console.log("Subcategory deleted successfully");
      } else {
        console.error("Failed to delete subcategory");
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };
  const handleAddSubcategory = async (newSubcategory) => {
    const token = localStorage.getItem('token');
    const payload = { ...newSubcategory, category: categoryId }; // Ensure the category ID is included
    console.log("Payload for adding subcategory:", payload);
    try {
      const response = await fetch(`http://localhost:3000/restorex/subcategories/addSubCategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Subcategory added successfully");
        await fetchSubcategories();
        closeAddModal();
      } else {
        const errorData = await response.json();
        console.error("Failed to add subcategory:", errorData.message);
      }
    } catch (error) {
      console.error("Error adding subcategory:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Subcategories</h2>
        <button
          onClick={openAddModal}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Subcategory
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
            {subcategories.map((subcategory, index) => (
              <tr key={subcategory?._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{index + 1}</td>
                <td className="py-3 px-6 text-left">{subcategory.name}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => openEditModal(subcategory)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <PencilIcon className="h-5 w-5 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(subcategory._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && selectedSubcategory && (
        <EditSubcategoryModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSubmit={handleUpdateSubcategory}
          subcategory={selectedSubcategory}
        />
      )}
      {isAddModalOpen && (
        <AddSubcategoryModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onSubmit={handleAddSubcategory}
        />
      )}
    </div>
  );
}

export default SubcategoriesPage;
