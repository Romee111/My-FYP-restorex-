// src/components/Dashboard.js
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  } from 'recharts';
  
  const dataLine = [
    { name: 'Jan', Sales: 4000 },
    { name: 'Feb', Sales: 3000 },
    { name: 'Mar', Sales: 2000 },
    { name: 'Apr', Sales: 2780 },
    { name: 'May', Sales: 1890 },
    { name: 'Jun', Sales: 2390 },
    { name: 'Jul', Sales: 3490 },
  ];
  
  const dataBarOrders = [
    { name: 'Jan', Orders: 4000 },
    { name: 'Feb', Orders: 3000 },
    { name: 'Mar', Orders: 2000 },
    { name: 'Apr', Orders: 2780 },
    { name: 'May', Orders: 1890 },
    { name: 'Jun', Orders: 2390 },
    { name: 'Jul', Orders: 3490 },
  ];
  
  const dataPie = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ];
  
  const dataTrafficSources = [
    { name: 'Google', Traffic: 4000 },
    { name: 'Facebook', Traffic: 3000 },
    { name: 'Direct', Traffic: 2000 },
    { name: 'Referral', Traffic: 2780 },
  ];
  
  const dataInventoryLevels = [
    { name: 'Electronics', Stock: 100 },
    { name: 'Fashion', Stock: 80 },
    { name: 'Home', Stock: 60 },
    { name: 'Books', Stock: 40 },
  ];
  
  const dataTopSellingProducts = [
    { name: 'Product A', Sales: 2500 },
    { name: 'Product B', Sales: 1500 },
    { name: 'Product C', Sales: 7500 },
    { name: 'Product D', Sales: 3000 },
  ];
  
  const dataRefundReturnRates = [
    { name: 'Electronics', Returns: 60, Refunds: 20 },
    { name: 'Fashion', Returns: 40, Refunds: 15 },
    { name: 'Home', Returns: 30, Refunds: 10 },
    { name: 'Books', Returns: 10, Refunds: 5 },
  ];
  
  const dataPromotionPerformance = [
    { name: 'Summer Sale', Revenue: 5000 },
    { name: 'Black Friday', Revenue: 7000 },
    { name: 'Holiday Deals', Revenue: 6000 },
  ];
  
  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const Dashboard = () => (
    <div className="grid md:grid-cols-3 gap-4 p-6">
      {/* Sales Overview Line Chart */}
      <div className="bg-white shadow-md p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Sales Overview</h3>
        <LineChart width={300} height={200} data={dataLine}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Sales" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </div>
  
      {/* Orders Overview Bar Chart */}
      <div className="bg-white shadow-md p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Orders Overview</h3>
        <BarChart width={300} height={200} data={dataBarOrders}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Orders" fill="#82ca9d" />
        </BarChart>
      </div>
  
      {/* Revenue Breakdown Pie Chart */}
      <div className="bg-white shadow-md p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Revenue Breakdown
        </h3>
        <PieChart width={200} height={200}>
          <Pie
            data={dataPie}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {dataPie.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
      <div className="bg-white shadow-md p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Customer Demographics</h3>
        <PieChart width={200} height={200}>
          <Pie
            data={dataPie}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {dataPie.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
  
      {/* Traffic Sources Bar Chart */}
      <div className="bg-white shadow-md p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Traffic Sources</h3>
        <BarChart width={300} height={200} data={dataTrafficSources}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Traffic" fill="#8884d8" />
        </BarChart>
      </div>
  
      {/* Inventory Levels Bar Chart */}
      <div className="bg-white shadow-md p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Inventory Levels</h3>
        <BarChart width={300} height={200} data={dataInventoryLevels}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Stock" fill="#8884d8" />
        </BarChart>
      </div>
  
      {/* Top-Selling Products Bar Chart */}
      <div className="bg-white shadow-md p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Top-Selling Products</h3>
        <BarChart width={300} height={200} data={dataTopSellingProducts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Sales" fill="#82ca9d" />
        </BarChart>
      </div>
  
      {/* Refund and Return Rates Stacked Bar Chart */}
      <div className="bg-white shadow-md p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Refund and Return Rates</h3>
        <BarChart width={300} height={200} data={dataRefundReturnRates}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Returns" stackId="a" fill="#82ca9d" />
          <Bar dataKey="Refunds" stackId="a" fill="#8884d8" />
        </BarChart>
      </div>
  
      {/* Promotion Performance Bar Chart */}
      <div className="bg-white shadow-md p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Promotion Performance</h3>
        <BarChart width={300} height={200} data={dataPromotionPerformance}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Revenue" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
  
  export default Dashboard;
  