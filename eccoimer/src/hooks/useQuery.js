import { useState, useEffect } from "react";
import axios from "axios";

const useQuery = () => {
  const [Query, setQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to retrieve the token from local storage (or another secure storage)
  const getAuthToken = () => {
    return localStorage.getItem("authToken");  // Adjust as per your app's token storage system
  };

  const addQuery = async () => {
    setLoading(true);
    setError(null);
    
    const token = getAuthToken();

    if (!token) {
      setError("No authentication token found.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/restorex/queries/submitQuery',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Attach the token as a Bearer token
          },
        }
      );
      console.log(response.data);
      setQuery(response.data);
      return response.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return { Query, loading, error, addQuery };
};

export default useQuery;
