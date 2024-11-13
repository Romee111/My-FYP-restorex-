// src/components/Sidebar.js
import { Link } from 'react-router-dom';
import { HomeIcon, UserIcon, ShoppingCartIcon, ShoppingBagIcon, CubeIcon } from '@heroicons/react/outline';

const Sidebar = ({ isOpen, toggleSidebar }) => (
  <aside
    className={`fixed inset-y-0 left-0 w-64 bg-[#001f3f] text-white transform ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } md:translate-x-0 transition-transform duration-300 ease-in-out z-30`}
  >
    <h2 className="text-xl font-bold p-6 border-b border-gray-700 flex justify-between items-center">
      Sellers-Portal
      <button onClick={toggleSidebar} className="md:hidden">
        ✕
      </button>
    </h2>
    <nav className="flex-1">
      <ul className="space-y-1">
        <li>
          <Link
            to="/dashboard"
            className="flex items-center p-4 hover:bg-[#004080] transition-colors duration-200"
          >
            <HomeIcon className="h-6 w-6 mr-3" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            to="/users"
            className="flex items-center p-4 hover:bg-[#004080] transition-colors duration-200"
          >
            <UserIcon className="h-6 w-6 mr-3" />
            <span>Customers</span>
          </Link>
        </li>
      
        <li>
          <Link
            to="/orders"
            className="flex items-center p-4 hover:bg-[#004080] transition-colors duration-200"
          >
            <ShoppingCartIcon className="h-6 w-6 mr-3" />
            <span>Orders</span>
          </Link>
        </li>
        <li>
          <Link
            to="/products"
            className="flex items-center p-4 hover:bg-[#004080] transition-colors duration-200"
          >
            <CubeIcon className="h-6 w-6 mr-3" />
            <span>Products</span>
          </Link>
        </li>
      
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
