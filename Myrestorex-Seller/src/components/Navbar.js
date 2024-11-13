// src/components/Navbar.js
import { useState } from 'react';
import { LogoutIcon, ChatIcon, MenuIcon, PlusIcon } from '@heroicons/react/outline';
import RequestModal from './RequestModal';

const Navbar = ({ onLogout, toggleSidebar }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <header className="flex justify-between items-center p-6 bg-[#001f3f] text-white">
      {/* Mobile menu toggle button */}
      <button onClick={toggleSidebar} className="md:hidden">
        <MenuIcon className="h-6 w-6" />
      </button>

      <h1 className="text-lg font-bold hidden md:block"></h1>
      
      <div className="flex items-center space-x-4">
        {/* Request icon */}
        <PlusIcon className="h-7 w-7 cursor-pointer hover:text-gray-400" onClick={openModal} />

        {/* Message icon */}
        <ChatIcon className="h-7 w-7 cursor-pointer hover:text-gray-400" />

        {/* Logout button */}
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 text-sm bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          <LogoutIcon className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Request Modal */}
      {isModalOpen && <RequestModal onClose={closeModal} />}
    </header>
  );
};

export default Navbar;
