import { useState } from "react";
import axios from "axios";

export function useLogin() {
  const [user, setUser] = useState(null); // State to store logged-in user data
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [error, setError] = useState(null); // State to store error messages

  const login = async (email, password) => {
    try {
      setLoading(true); // Set loading to true before API call
      setError(null); // Reset error state before new login attempt

      const response = await axios.post("http://localhost:3000/api/v1/auth/signin", {
        email,
        password,
      });

      const data = response.data;
      localStorage.setItem("user", JSON.stringify(data)); // Save user data in local storage
      setUser(data); // Set the user data in state
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again."); // Set error message
      console.error(err); // Log the error for debugging
      throw new Error(err);
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };

  const logout = () => {
    setUser(null); // Clear the user state
    localStorage.removeItem("user"); // Remove user data from local storage
  };

  return { user, loading, error, login, logout }; // Return states and functions for login and logout
}

export default useLogin;
