import { useState, useEffect } from "react";
import axios from "axios";

 function useArrivals() {
    const [arrivals, setArrivals] = useState([]);
    const [loading, setLoading] = useState(true);   
    const getArrivals = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/v1/products/newArrivals');
          const data = response.data.newArrivals;
          setArrivals(data); // Set the fetched arrivals to state
        } catch (err) {
          console.log('Error fetching arrivals:', err);
        } finally {
          setLoading(false); // Stop loading after fetching data
    } 
  };

  useEffect(() => {
    getArrivals();
  }, []);

  return { arrivals, loading };
}

export default useArrivals;


