import { useEffect, useState } from "react";
import axios from "axios";

const useReview = () => {
  const [addReview, setAddReview] = useState([]);
  const [eachProductReview, setEachProductReview] = useState([]);
  const [loading, setLoading] = useState(false);

  const addReviewHandler = async (data, token) => {
    setLoading(true);
    try {
      // Add the Bearer token in the Authorization header
      const response = await axios.post(
        "http://localhost:3000/restorex/review/addReview",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include Bearer token in headers
          },
        }
      );
      console.log(response.data);
      setAddReview(data); // Store the review data in state
      return response.data; // Return response data
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // Set loading state to false after the request is completed
    }
  };

  const getReviewofProduct = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/restorex/review/getReviewsForProduct/${id}`
      );
      console.log(response.data);
      setEachProductReview(response.data); // Set the fetched reviews to state
      return response.data;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Assuming you want to fetch reviews on component mount, you can pass an ID to fetch them
    const productId = 1; // Replace with actual product ID
    getReviewofProduct(productId);
  }, []);

  return {
    addReview,
    addReviewHandler,
    getReviewofProduct,
    eachProductReview,
    loading,
  };
};

export default useReview;
