import React from 'react';
import useArrivals from '../hooks/useArrivals';

function ArrivalsCard() {
   
  const { arrivals, loading } = useArrivals();

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
   <> 
      <h2 className='text-2xl font-bold mb-6    ' style={{marginLeft:'50px'}}>New Arrivals</h2>
   <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        
        {arrivals?.map((arrival) => (
          <div
            key={arrival._id}
            className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105"
          >
            <img
              src={arrival.images[1]}
              alt={arrival.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{arrival.title}</h3>
              <p className="text-gray-600 mt-2">{arrival.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-gray-900 font-bold">${arrival.price}</span>
                <a
                  href={`/products/${arrival._id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  View
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
   </>
    
  );
}

export default ArrivalsCard;
