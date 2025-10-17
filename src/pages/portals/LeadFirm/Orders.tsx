import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const Orders: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/lead-firm' },
    { id: 'products', name: 'Product Catalog', icon: '🌱', href: '/portal/lead-firm/products' },
    { id: 'orders', name: 'Orders', icon: '📦', href: '/portal/lead-firm/orders' },
    { id: 'producers', name: 'Producer Network', icon: '🌾', href: '/portal/lead-firm/producers' },
    { id: 'credit', name: 'Credit Sales', icon: '💰', href: '/portal/lead-firm/credit' },
    { id: 'delivery', name: 'Delivery', icon: '🚚', href: '/portal/lead-firm/delivery' },
    { id: 'quality', name: 'Quality Control', icon: '✅', href: '/portal/lead-firm/quality' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/lead-firm/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/lead-firm/settings' }
  ];

  const orders = [
    {
      id: 'ORD-001',
      customer: 'Ibrahim Musa',
      customerType: 'Producer',
      products: ['Premium Rice Seeds', 'NPK Fertilizer'],
      totalAmount: 125000,
      status: 'Processing',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-20',
      paymentStatus: 'Pending',
      location: 'Kaduna State'
    },
    {
      id: 'ORD-002',
      customer: 'Fatima Ahmed',
      customerType: 'Producer',
      products: ['Herbicide Roundup', 'Seeds'],
      totalAmount: 85000,
      status: 'Shipped',
      orderDate: '2024-01-12',
      deliveryDate: '2024-01-18',
      paymentStatus: 'Paid',
      location: 'Kano State'
    },
    {
      id: 'ORD-003',
      customer: 'John Okafor',
      customerType: 'Producer',
      products: ['Fertilizer', 'Equipment'],
      totalAmount: 200000,
      status: 'Delivered',
      orderDate: '2024-01-10',
      deliveryDate: '2024-01-15',
      paymentStatus: 'Paid',
      location: 'Enugu State'
    }
  ];

  const orderStats = [
    { label: 'Total Orders', value: '1,247', change: '+89', trend: 'up' },
    { label: 'Processing', value: '156', change: '+12', trend: 'up' },
    { label: 'Shipped', value: '89', change: '+8', trend: 'up' },
    { label: 'Delivered', value: '1,002', change: '+69', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="Lead Firm" 
      roleIcon="🏭" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Orders</h1>
            <p className="text-gray-400 font-serif mt-2">Manage customer orders and fulfillment</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Orders Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Order')}
            >
              ➕ New Order
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {orderStats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-serif">{stat.label}</p>
                  <p className="text-2xl font-bold font-sans text-gray-100">{stat.value}</p>
                </div>
                <div className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold font-sans text-gray-100">Order Management</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
              <select className="input-field w-auto">
                <option>All Payment</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Orders', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Order ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Products</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Total Amount</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Payment</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{order.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{order.customer}</p>
                        <p className="text-sm text-gray-400 font-serif">{order.customerType} - {order.location}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {order.products.map((product, index) => (
                          <span key={index} className="px-2 py-1 bg-primary-600 text-white text-xs rounded">
                            {product}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">₦{order.totalAmount.toLocaleString()}</p>
                        <p className="text-sm text-gray-400 font-serif">Order: {order.orderDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Processing' ? 'bg-yellow-500 text-white' :
                        order.status === 'Shipped' ? 'bg-blue-500 text-white' :
                        order.status === 'Delivered' ? 'bg-green-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === 'Paid' ? 'bg-green-500 text-white' :
                        order.paymentStatus === 'Pending' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Order Details', order.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Update Status')}
                        >
                          Update
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Process Payment')}
                        >
                          Payment
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Order Processing')}
            >
              📦 Process Order
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Inventory Check')}
            >
              📊 Check Inventory
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Delivery Scheduling')}
            >
              🚚 Schedule Delivery
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Order Analytics', 'Excel')}
            >
              📈 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Orders;
