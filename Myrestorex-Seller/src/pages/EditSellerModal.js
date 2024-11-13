import { useState } from 'react';
import { TrashIcon, PlusIcon, PencilIcon, XIcon } from '@heroicons/react/outline';
const EditSellerModal = ({ seller, onSubmit, onClose }) => {
  // Initialize state with sellerInfo fields
  const [sellerInfo, setSellerInfo] = useState({
    businessName: seller.sellerInfo.businessName || '',
    businessAddress: seller.sellerInfo.businessAddress || '',
    businessType: seller.sellerInfo.businessType || '',
    taxIdNumber: seller.sellerInfo.taxIdNumber || '',
    bankAccountNumber: seller.sellerInfo.bankAccountNumber || '',
    bankName: seller.sellerInfo.bankName || '',
    accountHolderName: seller.sellerInfo.accountHolderName || '',
    branchCode: seller.sellerInfo.branchCode || ''
  });

  // Handle input changes for each field in sellerInfo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSellerInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Submit only the sellerInfo object
  const handleSave = () => {
    onSubmit(seller._id, sellerInfo); // Pass the seller ID and updated sellerInfo to the parent
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Edit Seller Info</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Business Name</label>
            <input
              type="text"
              name="businessName"
              value={sellerInfo.businessName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Business Address</label>
            <input
              type="text"
              name="businessAddress"
              value={sellerInfo.businessAddress}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Business Type</label>
            <input
              type="text"
              name="businessType"
              value={sellerInfo.businessType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Tax ID Number</label>
            <input
              type="text"
              name="taxIdNumber"
              value={sellerInfo.taxIdNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Bank Account Number</label>
            <input
              type="text"
              name="bankAccountNumber"
              value={sellerInfo.bankAccountNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Bank Name</label>
            <input
              type="text"
              name="bankName"
              value={sellerInfo.bankName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Account Holder Name</label>
            <input
              type="text"
              name="accountHolderName"
              value={sellerInfo.accountHolderName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Branch Code</label>
            <input
              type="text"
              name="branchCode"
              value={sellerInfo.branchCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSellerModal;
