import React from 'react';
import { Link } from 'react-router-dom';
const ProductCard = ({ id, image, title, price, description, stock }) => {
  return (
    <Link to={`/product/${id}`}>
      <div className="cursor-pointer border rounded-lg overflow-hidden shadow-md p-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
        <img src={image} alt={title} className="object-cover h-48 w-full rounded-t-md mb-4" />
        <div className="flex flex-col justify-between flex-grow">
          <h3 className="font-semibold text-lg mb-2 truncate">{title}</h3>
          <h6 className="text-xs mb-2 truncate">{description}</h6>
          <div className='flex justify-between'>
            <p className="text-red-600 font-bold">${price}</p>
            <p className="text-blue-600  font-bold">Quantity: <span className='text-black'>{stock}</span></p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
