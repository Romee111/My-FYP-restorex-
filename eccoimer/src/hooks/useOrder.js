import { useState } from "react";
import axios from "axios";


const useOrder=()=>{
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createOrders = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.post('http://localhost:3000/restorex/orders/createOrder');
          console.log(response.data.orderItem);
          setOrder(response.data);
          return response.data;
        } catch (err) {
          console.error(err);
          setError(err.response?.data?.message || 'Something went wrong');
        } finally {
          setLoading(false);
        }
      };

     const getOrders = async () => {
       setLoading(true);
       setError(null);
       try {
         const response = await axios.get('http://localhost:3000/restorex/orders/getAllOrders');
         console.log(response.data.getAllOrders);
         setOrder(response.data);
         return response.data;
       } catch (err) {
         console.error(err);
         setError(err.response?.data?.message || 'Something went wrong');
       } finally {
         setLoading(false);
       }
     } 

     const deleteOrder = async (id) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.delete(`http://localhost:3000/restorex/orders/deleteOrder/${id}`);
        console.log(response.data);
        return response.data;
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }   
    const updateOrder = async (id, data) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.put(`http://localhost:3000/restorex/orders/updateOrder/${id}`, data);
        console.log(response.data);
        return response.data;
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    return {order, loading, error, createOrders, getOrders, deleteOrder, updateOrder};
}

export default useOrder