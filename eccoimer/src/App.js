import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductGrid from './components/ProductGrid';
import CategoryMenu from './components/CategoryMenu';
import Footer from './components/Footer';
import ListProducts from './components/ListProducts';
import ProductDetail from './components/ProductDetail';
import OrderPage from './components/Order';
import SignUp from './components/Signup';
import LoginModal from './components/SignIn';
import CheckoutPage from './components/Checkout';
import Categories from './components/Categories';
import SellerSignupPage from './components/SellerSignupPage';
function App() {
  // Set initial login state based on localStorage
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(!!localStorage.getItem('user'));

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <ProductGrid />
                <CategoryMenu />
              </>
            }
          />
          <Route path="/search/:query" element={<ListProducts />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/category/:categoryName" element={<Categories />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path='/sellersignup' element={<SellerSignupPage />} />
        </Routes>
        {!isUserLoggedIn && <LoginModal setIsUserLoggedIn={setIsUserLoggedIn} />} {/* Show modal if not logged in */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
