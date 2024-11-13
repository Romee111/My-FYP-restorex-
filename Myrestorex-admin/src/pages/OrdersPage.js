// src/pages/OrdersPage.js
const OrdersPage = () => {
    const orders = [
      { id: 101, customer: 'Alice Johnson', total: '$150.00', status: 'Shipped' },
      { id: 102, customer: 'Bob Smith', total: '$200.00', status: 'Processing' },
      { id: 103, customer: 'Charlie Brown', total: '$120.00', status: 'Delivered' },
      { id: 104, customer: 'David Lee', total: '$300.00', status: 'Pending' },
    ];
  
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
            <tbody className="text-gray-700 text-sm font-light">
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{order.id}</td>
                  <td className="py-3 px-6 text-left">{order.customer}</td>
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
  