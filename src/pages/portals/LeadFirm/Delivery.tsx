import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const Delivery: React.FC = () => {
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

  const deliveries = [
    {
      id: 'DEL-001',
      orderId: 'ORD-001',
      customer: 'Ibrahim Musa',
      products: ['Premium Rice Seeds', 'NPK Fertilizer'],
      totalWeight: '125 kg',
      deliveryAddress: 'Kaduna State, Nigeria',
      scheduledDate: '2024-01-20',
      actualDate: '2024-01-20',
      status: 'Delivered',
      driver: 'Ahmed Usman',
      vehicle: 'Truck-001',
      deliveryFee: 15000
    },
    {
      id: 'DEL-002',
      orderId: 'ORD-002',
      customer: 'Fatima Ahmed',
      products: ['Herbicide Roundup'],
      totalWeight: '25 kg',
      deliveryAddress: 'Kano State, Nigeria',
      scheduledDate: '2024-01-18',
      actualDate: 'TBD',
      status: 'In Transit',
      driver: 'Musa Ibrahim',
      vehicle: 'Van-002',
      deliveryFee: 12000
    }
  ];

  const deliveryStats = [
    { label: 'Total Deliveries', value: '1,247', change: '+89', trend: 'up' },
    { label: 'On Time', value: '89%', change: '+3%', trend: 'up' },
    { label: 'In Transit', value: '156', change: '+12', trend: 'up' },
    { label: 'Delivered Today', value: '45', change: '+8', trend: 'up' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Delivery Management</h1>
            <p className="text-gray-400 font-serif mt-2">Track and manage product deliveries</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Delivery Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Delivery')}
            >
              ➕ Schedule Delivery
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {deliveryStats.map((stat, index) => (
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
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Delivery Tracking</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Delivery ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Products</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Weight</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Driver</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((delivery) => (
                  <tr key={delivery.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{delivery.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{delivery.customer}</p>
                        <p className="text-sm text-gray-400 font-serif">{delivery.deliveryAddress}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {delivery.products.map((product, index) => (
                          <span key={index} className="px-2 py-1 bg-primary-600 text-white text-xs rounded">
                            {product}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{delivery.totalWeight}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        delivery.status === 'Delivered' ? 'bg-green-500 text-white' :
                        delivery.status === 'In Transit' ? 'bg-blue-500 text-white' :
                        delivery.status === 'Scheduled' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {delivery.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">{delivery.driver}</p>
                        <p className="text-sm text-gray-400 font-serif">{delivery.vehicle}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Delivery Details', delivery.id)}
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
                          onClick={() => processAction('Track Delivery')}
                        >
                          Track
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
              onClick={() => addNewRecord('Delivery Scheduling')}
            >
              🚚 Schedule Delivery
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Route Optimization')}
            >
              🗺️ Optimize Routes
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Driver Management')}
            >
              👨‍💼 Manage Drivers
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Delivery Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Delivery;
