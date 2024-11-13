// src/App.js
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import SellersPage from './pages/SellersPage';
import CategoriesPage from './pages/CategoriesPage';
import SubcategoriesPage from './pages/SubCategoriesPage';
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="flex">
        {isAuthenticated && (
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        )}
        <div className={isAuthenticated ? "flex-1 2xl:ml-64 md:ml-0" : "flex-1"}>
          {isAuthenticated && <Navbar onLogout={handleLogout} toggleSidebar={toggleSidebar} />}
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <AuthForm type="login" onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? <DashboardPage /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/users"
              element={isAuthenticated ? <UsersPage /> : <Navigate to="/" replace />}
            />
            <Route path="/sellers" element={isAuthenticated ? <SellersPage /> : <Navigate to="/" replace />} />
            <Route
              path="/orders"
              element={isAuthenticated ? <OrdersPage /> : <Navigate to="/" replace />}
            />
            <Route
              path="/products"
              element={isAuthenticated ? <ProductsPage /> : <Navigate to="/" replace />}
            />
            <Route
              path="/categories"
              element={isAuthenticated ? <CategoriesPage /> : <Navigate to="/" replace />}
            />
             {/* <Route path="/category/:categoryId/subcategories" element={<SubcategoriesPage />} /> */}
             <Route
              path="/category/:categoryId/subcategories"
              element={isAuthenticated ? <SubcategoriesPage /> : <Navigate to="/" replace />}
            />
          </Routes>
        </div>
      </div>
      {/* Overlay for sidebar on mobile */}
      {isSidebarOpen && isAuthenticated && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </Router>
  );
};

export default App;
