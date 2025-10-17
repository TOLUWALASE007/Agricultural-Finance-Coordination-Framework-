import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails, contactPerson } from '../../../utils/quickActions';

const ProducerNetwork: React.FC = () => {
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

  const producers = [
    {
      id: 'PROD-001',
      name: 'Ibrahim Musa',
      location: 'Kaduna State',
      farmSize: '5 hectares',
      crops: ['Rice', 'Maize'],
      status: 'Active',
      joinDate: '2023-01-15',
      totalOrders: 12,
      totalValue: 2500000,
      lastOrder: '2024-01-15',
      phone: '+234-803-456-7890',
      email: 'ibrahim@farm.com',
      creditLimit: 500000,
      creditUsed: 150000
    },
    {
      id: 'PROD-002',
      name: 'Fatima Ahmed',
      location: 'Kano State',
      farmSize: '3 hectares',
      crops: ['Wheat', 'Sorghum'],
      status: 'Active',
      joinDate: '2023-02-20',
      totalOrders: 8,
      totalValue: 1800000,
      lastOrder: '2024-01-12',
      phone: '+234-805-678-9012',
      email: 'fatima@farm.com',
      creditLimit: 300000,
      creditUsed: 200000
    },
    {
      id: 'PROD-003',
      name: 'John Okafor',
      location: 'Enugu State',
      farmSize: '7 hectares',
      crops: ['Cassava', 'Yam'],
      status: 'Pending',
      joinDate: '2024-01-10',
      totalOrders: 0,
      totalValue: 0,
      lastOrder: 'N/A',
      phone: '+234-807-890-1234',
      email: 'john@farm.com',
      creditLimit: 700000,
      creditUsed: 0
    }
  ];

  const producerStats = [
    { label: 'Total Producers', value: '3,456', change: '+67', trend: 'up' },
    { label: 'Active Customers', value: '2,890', change: '+45', trend: 'up' },
    { label: 'Total Orders', value: '12,456', change: '+234', trend: 'up' },
    { label: 'Credit Outstanding', value: '₦45.2M', change: '+5.2M', trend: 'up' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Producer Network</h1>
            <p className="text-gray-400 font-serif mt-2">Manage your producer customer network and relationships</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Producer Network Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Producer')}
            >
              ➕ Add Producer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {producerStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Producer Directory</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Inactive</option>
              </select>
              <select className="input-field w-auto">
                <option>All Crops</option>
                <option>Rice</option>
                <option>Maize</option>
                <option>Wheat</option>
                <option>Cassava</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Producers', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Producer ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Name</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Location</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Farm Size</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Orders</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Credit Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {producers.map((producer) => (
                  <tr key={producer.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{producer.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{producer.name}</p>
                        <p className="text-sm text-gray-400 font-serif">Joined: {producer.joinDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{producer.location}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">{producer.farmSize}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {producer.crops.map((crop, index) => (
                            <span key={index} className="px-1 py-0.5 bg-primary-600 text-white text-xs rounded">
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">{producer.totalOrders}</p>
                        <p className="text-sm text-gray-400 font-serif">₦{(producer.totalValue / 1000000).toFixed(1)}M</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">₦{(producer.creditUsed / 1000).toFixed(0)}K / ₦{(producer.creditLimit / 1000).toFixed(0)}K</p>
                        <div className="w-full bg-primary-600 rounded-full h-2 mt-1">
                          <div 
                            className="bg-accent-500 h-2 rounded-full"
                            style={{ width: `${(producer.creditUsed / producer.creditLimit) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Producer Profile', producer.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => contactPerson(producer.name, producer.phone, producer.email)}
                        >
                          Contact
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Credit Management')}
                        >
                          Credit
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
              onClick={() => addNewRecord('Producer Registration')}
            >
              🌾 Add Producer
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Credit Assessment')}
            >
              💰 Credit Assessment
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Training Program')}
            >
              🎓 Training
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Producer Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ProducerNetwork;
