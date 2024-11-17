import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ProductGrid from "./components/ProductGrid";
import CategoryMenu from "./components/CategoryMenu";
import Footer from "./components/Footer";
import ListProducts from "./components/ListProducts";
import ProductDetail from "./components/ProductDetail";
import OrderPage from "./components/Order";
import SignUp from "./components/Signup";
import LoginModal from "./components/SignIn";
import CheckoutPage from "./components/Checkout";
import Categories from "./components/Categories";
import SellerSignupPage from "./components/SellerSignupPage";
import QueryModal from "./components/QueryModal";
import useQuery from "./hooks/useQuery";
import ArrivalsCard from "./components/ArrivalsCard";

import LandingSlider from "./components/landingslider";

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(!!localStorage.getItem("user"));
  const { Query, loading, error, addQuery } = useQuery();
  const [showQueryModal, setShowQueryModal] = useState(false);

  // Checking if the user is logged in or not
  useEffect(() => {
    const checkLoginStatus = () => {
      setIsUserLoggedIn(!!localStorage.getItem("user"));
    };
    checkLoginStatus();
  }, []);

  // Function to trigger the query modal
  const openQueryModal = async () => {
    await addQuery();
    setShowQueryModal(true);
  };

  // Function to close the query modal
  const closeQueryModal = () => {
    setShowQueryModal(false);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user from local storage
    setIsUserLoggedIn(false); // Update login state
  };

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
                <LandingSlider />
                <ArrivalsCard />
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
          <Route path="/loginModal" element={<LoginModal setIsUserLoggedIn={setIsUserLoggedIn} />} />
          <Route path="/sellersignup" element={<SellerSignupPage />} />
          {/* <Route path="/profile" element={<Profile onLogout={handleLogout} />} /> Profile route */}
        </Routes>

        {/* Conditionally render LoginModal if the user is not logged in */}
        {/* {!isUserLoggedIn && <LoginModal setIsUserLoggedIn={setIsUserLoggedIn} />} */}

        {/* Query button at the bottom right of the page */}
        <button
          onClick={openQueryModal}
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            padding: "10px 20px",
            backgroundColor: "#001f3f",
            color: "white",
            zIndex: "9999",
            border: "none",
            borderRadius: "70%",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Chat
        </button>

        {/* Show QueryModal when showQueryModal is true */}
        {showQueryModal && <QueryModal queries={Query ? [Query] : []} closeModal={closeQueryModal} addQuery={addQuery} />}

        <Footer />
      </div>
    </Router>
  );
}

export default App;
