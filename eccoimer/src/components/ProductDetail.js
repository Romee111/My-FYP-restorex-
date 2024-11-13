import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDetailProduct } from '../hooks/useDetailProduct';
// import ProductStats from './ProductStats';
import AddCart from './AddCart'; // Assuming AddCart is a modal for adding products to the cart

const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const { productDetail: product, loading, error, getDetailProduct } = useDetailProduct();
  const [selectedInstallment, setSelectedInstallment] = useState('');
  const [showInstallmentOptions, setShowInstallmentOptions] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [userReviews, setUserReviews] = useState([]); // Assuming reviews come from the API
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');

  // Fetch product details
  useEffect(() => {
    if (id) {
      getDetailProduct(id); // Fetch product details based on the ID
    }
  }, [id]);

  // Handle installment option toggle
  const handleInstallmentOptionClick = () => {
    setShowInstallmentOptions(!showInstallmentOptions);
  };

  // Handle Add to Cart logic (open modal or add directly)
  const handleAddToCart = () => {
    setShowCartModal(true); // Show the modal when "Add to Cart" is clicked
  };

  // Handle Buy Now action (you might want to redirect to checkout here)
  const handleBuyNow = () => {
    window.location.href = product.payment_URL;
    // Redirect to checkout page or handle logic for direct purchase
  };

  // Handle review submission
  const handleReviewSubmit = () => {
    // Logic to submit review
  };

  if (loading) return <p>Loading product details...</p>;
  if (error || !product) return <p>{error || "Product not found"}</p>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-center gap-8 items-start">
        {/* Product Image */}
        <div className="flex justify-center md:w-1/2">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-auto max-w-sm shadow-lg rounded-md object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">{product.title}</h1>
          <p className="text-gray-500 mb-6">{product.description}</p>
          <p className="mb-2"><strong>Rating:</strong> {product.rating}</p>
          <p className="mb-2"><strong>discription:</strong> {product.description}</p>

          {/* Price and Installment Options */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-red-500 mb-4">${product.price.toFixed(2)}</h2>

            {product.price > 3000 && (
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none transition"
                onClick={handleInstallmentOptionClick}
              >
                Installment Options
              </button>
            )}

            {showInstallmentOptions && (
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
              onClick={handleAddToCart}
              style={{backgroundColor: '#001f3f', color: 'white'}}
            >
              Add to Cart
            </button>
            <button
              className=" text-white py-3 px-6 rounded-lg  "
              onClick={handleBuyNow}
              style={{backgroundColor: '#001f3f', color: 'white'}}
            >
              Buy Now
            </button>
          </div>

          {/* Submit a Review */}
          <div className="mt-8">
            <h4 className="text-xl font-semibold mb-4">Submit a Review</h4>
            <div className="mb-4">
              <label htmlFor="rating" className="block text-gray-700">Rating:</label>
              <input
                type="number"
                id="rating"
                className="border border-gray-300 rounded-md p-2 w-full mt-1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="Enter a rating (1-5)"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="review" className="block text-gray-700">Review:</label>
              <textarea
                id="review"
                className="border border-gray-300 rounded-md p-2 w-full mt-1"
                rows="3"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review"
              />
            </div>
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none transition"
              onClick={handleReviewSubmit}
              style={{backgroundColor: '#001f3f', color: 'white'}}
            >
              Submit Review
            </button>
          </div>

          {/* Reviews Section */}
          <div className="mt-10">
            <h4 className="text-xl font-semibold mb-4">Reviews</h4>
            {userReviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
            ) : (
              userReviews.map((review) => (
                <div key={review._id} className="mb-4 border-b border-gray-200 pb-4">
                  <p><strong>{review.user_id}</strong></p>
                  <p>Rating: {review.rating}</p>
                  <p>{review.review}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add to Cart Modal */}
      <AddCart show={showCartModal} handleClose={() => setShowCartModal(false)} product={product} />
    </div>
  );
};

export default ProductDetail;
