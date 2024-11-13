import { useState } from 'react';
import axios from 'axios';

// export const useRegister = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const register = async (data) => {
//     setLoading(true);
//     setError(null);
//     try {
//       data.image = "1.png"; // Default image for now
//       const response = await axios.post(`http://localhost:2900/userauth/register`, data);
//       console.log(response.data);

//       localStorage.setItem('user', JSON.stringify(response.data));

//       return response.data;
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { register, loading, error };
// };

// import { useState } from 'react';
// import axios from 'axios';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (data) => {
    setLoading(true);
    setError(null);
  
    // Prepare the user data
    const userData = {
      name: data.name, // Combine first and last name into 'name'
      email: data.email,
      password: data.password,
      role: data.role || 'user', // Default to 'user' if no role is provided
      isActive: true, // Set to true, assuming active status on registration
      addresses: [
        {
          city: data.city,
          street: data.address1, // Use address1 as street
          phone: data.phone,
        }
      ],
      // Only include sellerInfo if the role is 'seller'
      ...(data.role === 'seller' && {
        sellerInfo: {
          businessName: data.businessName,
          businessAddress: data.businessAddress,
          businessType: data.businessType,
          taxIdNumber: data.taxIdNumber,
          bankAccountNumber: data.bankAccountNumber,
          bankName: data.bankName,
          accountHolderName: data.accountHolderName,
          branchCode: data.branchCode,
          documents: {
            idCardNumber: data.idCardNumber,
            idImage1: data.idImage1,
            idImage2: data.idImage2,
          },
        },
      }),
    };
  
    try {
      // Make API call to the addUser endpoint
      const response = await axios.post(
        'http://localhost:3000/api/v1/users/addUser',
        userData,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwibmFtZSI6IkFkbWluIFVzZXIiLCJpZCI6IjY3MmIyMmRmMGY5MTI3MTlmN2MzZGVmMCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczMTA1NzIwOH0.hXJivzcPMXta5aboc5eBwd94RumVDd3kYmJKAUOIVwk`
          }
        }
      );
  
      console.log(response.data);
  
      // Store the response data in localStorage for the user session
      localStorage.setItem('user', JSON.stringify(response.data));
  
      return response.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  

  return { register, loading, error };
};

