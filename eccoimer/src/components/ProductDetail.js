import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useDetailProduct } from '../hooks/useDetailProduct';
import AddCart from './AddCart'; // Assuming AddCart is a modal for adding products to the cart
import useReview from '../hooks/useReview'; // Import useReview hook
import { useNavigate } from 'react-router-dom';
const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const { productDetail: product, loading, error, getDetailProduct } = useDetailProduct();
  const { addReviewHandler, getReviewofProduct, eachProductReview, loading: reviewLoading } = useReview();
  const [selectedInstallment, setSelectedInstallment] = useState('');
  const [showInstallmentOptions, setShowInstallmentOptions] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedColor, setSelectedColor] = useState(product?.color); // Default to first color if available
  const [selectedSize, setSelectedSize] = useState(product?.size); // Default to first size if available
  const navigate=useNavigate();
  // Fetch product details
  useEffect(() => {
    if (id) {
      getDetailProduct(id); // Fetch product details based on the ID
    }
  }, []);

  // Fetch reviews for the product on mount
  useEffect(() => {
    if (id) {
      getReviewofProduct(id); // Get reviews for this specific product
    }
  }, []);

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
   navigate('/order');
    // Redirect to checkout page or handle logic for direct purchase
  };

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (rating && review) {
      // Assuming token is available, replace with actual token retrieval logic
      const token = 'user-token'; // Replace with the actual token
      const reviewData = {
        productId: product._id, // Assuming _id is the product ID
        rating,
        review,
      };
      const response = await addReviewHandler(reviewData, token); // Call the addReviewHandler function
      if (response) {
        // Clear review fields after successful submission
        setRating(0);
        setReview('');
      }
    } else {
      alert('Please provide a rating and review.');
    }
  };

  // Determine if installment options should be shown based on the product price
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
            <h2 className="text-3xl font-bold text-red-500 mb-4">${product.priceAfterDiscount.toFixed(2)}</h2>
            <p className="line-through text-gray-500">${product.price.toFixed(2)}</p>
            
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

          {/* Color Selection */}
          {product.color && product.color.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Select Color</h3>
              <div className="flex space-x-4">
                {product.color.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full ${selectedColor === color ? 'border-4 border-blue-500' : ''}`}
                    style={{ backgroundColor: color.toLowerCase() }}
                  ></button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.size && product.size.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Select Size</h3>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
              >
                {product.size.map((size, index) => (
                  <option key={index} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

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
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`text-yellow-500 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="review" className="block text-gray-700">Review:</label>
              <textarea
                id="review"
                className="border border-gray-300 rounded-md p-2 w-full mt-1"
                rows="3"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review here"
              />
            </div>
            <button
              className="bg-blue-600 text-white py-2 px-6 rounded-md"
              onClick={handleReviewSubmit}
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {/* <div className="mt-10">
        <h3 className="text-2xl font-semibold">Reviews ({eachProductReview.length})</h3>
        <div className="mt-4 space-y-6">
          {eachProductReview?.map((review, index) => (
            <div key={index} className="border-b pb-4">
              <div className="flex items-center mb-2">
                <p className="font-semibold text-lg">{review.userName}</p>
                <div className="flex ml-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-yellow-500 ${star <= review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
       */}
       <div className="mt-10">
  <h3 className="text-2xl font-semibold">Reviews ({eachProductReview?.length || 0})</h3>
  <div className="mt-4 space-y-6">
    {(Array.isArray(eachProductReview) && eachProductReview.length > 0) ? (
      eachProductReview.map((review, index) => (
        <div key={index} className="border-b pb-4">
          <div className="flex items-center mb-2">
            <p className="font-semibold text-lg">{review.userName}</p>
            <div className="flex ml-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-yellow-500 ${star <= review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <p>{review.comment}</p>
        </div>
      ))
    ) : (
      <p>No reviews yet</p>
    )}
  </div>
</div>

    </div>
  );
};

export default ProductDetail;
