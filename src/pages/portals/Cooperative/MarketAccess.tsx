import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails, contactPerson } from '../../../utils/quickActions';

const CooperativeMarketAccess: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/cooperative' },
    { id: 'members', name: 'Members', icon: '👥', href: '/portal/cooperative/members' },
    { id: 'loans', name: 'Group Loans', icon: '💰', href: '/portal/cooperative/loans' },
    { id: 'savings', name: 'Savings', icon: '🏦', href: '/portal/cooperative/savings' },
    { id: 'training', name: 'Training & Extension', icon: '🎓', href: '/portal/cooperative/training' },
    { id: 'extension', name: 'Extension Services', icon: '🌾', href: '/portal/cooperative/extension' },
    { id: 'market', name: 'Market Access', icon: '🏪', href: '/portal/cooperative/market' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/cooperative/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/cooperative/settings' }
  ];

  const marketOpportunities = [
    {
      id: 'MKT-001',
      buyer: 'Dangote Farms Ltd',
      product: 'Rice',
      quantity: '50 Tons',
      price: '₦32,000/Ton',
      quality: 'Grade A',
      deliveryDate: '2024-02-15',
      status: 'Available',
      contact: '08012345678',
      location: 'Kano'
    },
    {
      id: 'MKT-002',
      buyer: 'Olam Nigeria',
      product: 'Maize',
      quantity: '30 Tons',
      price: '₦28,000/Ton',
      quality: 'Grade A',
      deliveryDate: '2024-02-20',
      status: 'Negotiating',
      contact: '08023456789',
      location: 'Lagos'
    },
    {
      id: 'MKT-003',
      buyer: 'Flour Mills Nigeria',
      product: 'Wheat',
      quantity: '25 Tons',
      price: '₦25,000/Ton',
      quality: 'Grade A',
      deliveryDate: '2024-02-25',
      status: 'Available',
      contact: '08034567890',
      location: 'Abuja'
    }
  ];

  const marketStats = [
    { label: 'Active Opportunities', value: '8', change: '+2', trend: 'up' },
    { label: 'Total Sales', value: '₦2.4M', change: '+₦500K', trend: 'up' },
    { label: 'Buyer Partners', value: '12', change: '+3', trend: 'up' },
    { label: 'Success Rate', value: '85%', change: '+5%', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="Cooperative Group" 
      roleIcon="👥" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Market Access</h1>
            <p className="text-gray-400 font-serif mt-2">Connect with buyers and access better markets for cooperative produce</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Market Access Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Market Opportunity')}
            >
              ➕ New Opportunity
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {marketStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Market Opportunities</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Products</option>
                <option>Rice</option>
                <option>Maize</option>
                <option>Wheat</option>
                <option>Cassava</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Available</option>
                <option>Negotiating</option>
                <option>Confirmed</option>
                <option>Completed</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Opportunities', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Buyer</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Product</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Quantity</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Price</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Quality</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Delivery Date</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {marketOpportunities.map((opportunity) => (
                  <tr key={opportunity.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{opportunity.buyer}</p>
                        <p className="text-sm text-gray-400 font-serif">📍 {opportunity.location}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{opportunity.product}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{opportunity.quantity}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{opportunity.price}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{opportunity.quality}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{opportunity.deliveryDate}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        opportunity.status === 'Available' ? 'bg-green-500 text-white' :
                        opportunity.status === 'Negotiating' ? 'bg-yellow-500 text-white' :
                        opportunity.status === 'Confirmed' ? 'bg-blue-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {opportunity.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Opportunity Details', opportunity.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => contactPerson(opportunity.buyer, 'Buyer', opportunity.contact)}
                        >
                          Contact
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Negotiate Deal')}
                        >
                          Negotiate
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
              onClick={() => addNewRecord('Market Opportunity')}
            >
              🏪 New Opportunity
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Find Buyers')}
            >
              🔍 Find Buyers
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Price Negotiation')}
            >
              💰 Negotiate
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Market Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default CooperativeMarketAccess;
