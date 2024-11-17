import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useDetailProduct } from '../hooks/useDetailProduct';
// Default import
// Import AddToCartModal component
import useReview from '../hooks/useReview'; // Import useReview hook
import { useNavigate } from 'react-router-dom';
import LoginModal from './SignIn'; // Import the LoginModal component

const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const { productDetail: product, loading, error, getDetailProduct } = useDetailProduct();
  const { addReviewHandler, getReviewofProduct, eachProductReview, loading: reviewLoading } = useReview();
  const [selectedInstallment, setSelectedInstallment] = useState('');
  const [showInstallmentOptions, setShowInstallmentOptions] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false); // State to manage cart modal visibility
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedColor, setSelectedColor] = useState(product?.color); // Default to first color if available
  const [selectedSize, setSelectedSize] = useState(product?.size); // Default to first size if available
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Track if user is logged in
  const [showLoginModal, setShowLoginModal] = useState(false); // State to show Login Modal
  const navigate = useNavigate();

  // Check if the user is logged in (you can use localStorage or context to store login status)
  useEffect(() => {
    const user = localStorage.getItem('user'); // Replace with actual check for user authentication
    setIsUserLoggedIn(!!user); // Set state based on user presence
  }, []);

  // Fetch product details
  useEffect(() => {
    if (id) {
      getDetailProduct(id); // Fetch product details based on the ID
    }
  }, [id]);

  // Fetch reviews for the product on mount
  useEffect(() => {
    if (id) {
      getReviewofProduct(id); // Get reviews for this specific product
    }
  }, [id]);

  // Handle Add to Cart logic (open modal or trigger login modal if user is not logged in)
  const handleAddToCart = (product) => {
    if (isUserLoggedIn) {
      navigate('/order', { state: product }); // Open cart modal if the user is logged in
    } else {
      setShowLoginModal(true); // Show the login modal if the user is not logged in
    }
  };

  // Handle Buy Now action (you might want to redirect to checkout here)
  const handleBuyNow = () => {
    if (isUserLoggedIn) {
      navigate('/order');
    } else {
      setShowLoginModal(true); // Trigger login modal if user is not logged in
    }
  };

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (rating && review) {
      const token = 'user-token'; // Replace with actual token
      const reviewData = {
        productId: product._id,
        rating,
        review,
      };
      const response = await addReviewHandler(reviewData, token);
      if (response) {
        setRating(0);
        setReview('');
      }
    } else {
      alert('Please provide a rating and review.');
    }
  };

  const shouldShowInstallmentOptions = product?.price >= 30000;

  if (loading || reviewLoading) return <p>Loading product details...</p>;
  if (error || !product) return <p>{error || "Product not found"}</p>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-center gap-8 items-start">
        {/* Product Image */}
        <div className="flex justify-center md:w-1/2">
          <img
            src={product.images[1]}
            alt={product.title}
            className="w-full h-auto max-w-sm shadow-lg rounded-md object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">{product.title}</h1>
          <p className="text-gray-500 mb-6">{product.description}</p>
          <p className="mb-2"><strong>Rating:</strong> {product.ratingAvg} ({product.ratingCount} reviews)</p>

          {/* Price and Installment Options */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-red-500 mb-4">${product?.priceAfterDiscount?.toFixed(2)}</h2>
            <p className="line-through text-gray-500">${product?.price?.toFixed(2)}</p>

            {shouldShowInstallmentOptions && (
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none transition"
                onClick={handleInstallmentOptionClick}
              >
                Installment Options
              </button>
            )}

            {showInstallmentOptions && shouldShowInstallmentOptions && (
              <div className="mt-4">
                <div className="flex items-center space-x-4 mb-2">
                  <input
                    type="radio"
                    id="installment-3m"
                    name="installment"
                    value="3m"
                    checked={selectedInstallment === "3m"}
                    onChange={(e) => setSelectedInstallment(e.target.value)}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="installment-3m" className="text-gray-700">3 Months Installment</label>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="radio"
                    id="installment-6m"
                    name="installment"
                    value="6m"
                    checked={selectedInstallment === "6m"}
                    onChange={(e) => setSelectedInstallment(e.target.value)}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="installment-6m" className="text-gray-700">6 Months Installment</label>
                </div>
              </div>
            )}
          </div>

          {/* Add to Cart and Buy Now Buttons */}
          <div className="flex space-x-4 mb-6">
            <button
              className=" py-3 px-6 rounded-lg  bgColor-[#001F3F] "
              onClick={() => { handleAddToCart(product) }}
              style={{ backgroundColor: '#001f3f', color: 'white' }}
            >
              Buy Now
              {/* Add to Cart */}
            </button>
            {/* <button
              className=" text-white py-3 px-6 rounded-lg  "
              onClick={handleBuyNow}
              style={{ backgroundColor: '#001f3f', color: 'white' }}
            >
              Buy Now
            </button> */}
          </div>
        </div>
      </div>

      {/* Show Login Modal if user is not logged in */}
      {showLoginModal && !isUserLoggedIn && (
        <LoginModal setIsUserLoggedIn={setIsUserLoggedIn} />
      )}

      {/* Show AddToCartModal */}
      {showCartModal && (
        <AddToCartModal
          product={product}
          showModal={showCartModal}
          setShowModal={setShowCartModal}
        />
      )}
    </div>
  );
};

export default ProductDetail;
