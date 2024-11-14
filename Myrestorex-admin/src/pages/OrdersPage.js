import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersPage = () => {
    // State to store fetched orders
    const [orders, setOrders] = useState([]);

    // Fetch orders from the API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
              debugger
                const response = await axios.get('http://localhost:3000/restorex/orders/getOrders');
                debugger
                setOrders(response?.data);
                console.log(response.data.orders);
                 // Assuming 'orders' is the array in the response
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Orders</h2>
            <div className="overflow-auto rounded-lg shadow-md">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <tr>
                            <th className="py-3 px-6 text-left">Order ID</th>
                            <th className="py-3 px-6 text-left">Customer</th>
                            <th className="py-3 px-6 text-left">Total</th>
                            <th className="py-3 px-6 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm ">
                        {orders.map((order) => (
                            
                            <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{order.id}</td>
                                <td className="py-3 px-6 text-left ">{order.name}</td>
                                <td className="py-3 px-6 text-left">{order.total}</td>
                                <td className="py-3 px-6 text-left">{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersPage;
