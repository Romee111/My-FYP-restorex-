// src/components/AuthForm.js
import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
const AuthForm = ({ type, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const decodedToken = jwtDecode(data.token);
        console.log(decodedToken);
        if (decodedToken.role === 'seller') {
          localStorage.setItem('token', data.token); // Store token in localStorage
          onLogin(); // Call the login function to update the app's state
        } else {
          setError('Access denied. Only sellers can log in.');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid login credentials');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded w-80">
        <h2 className="text-2xl font-bold mb-6">{type === 'login' ? 'Seller Login' : 'Sign Up'}</h2>
        
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-500 text-white p-2 rounded"  style={{backgroundColor:"#001f3f", Color:"white"}}>
          {type === 'login' ? 'Login' : 'Sign Up'}
         
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
