import React from 'react';
import PortalLayout from '../../components/PortalLayout';

const ProducerPortal: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/producer' },
    { id: 'loans', name: 'Loan Applications', icon: '₦', href: '/portal/producer/loans' },
    { id: 'anchor', name: 'Anchor Partners', icon: '⚓', href: '/portal/producer/anchors' },
    { id: 'insurance', name: 'Crop Insurance', icon: '🛡️', href: '/portal/producer/insurance' },
    { id: 'inputs', name: 'Input Suppliers', icon: '🌱', href: '/portal/producer/inputs' },
    { id: 'extension', name: 'Extension Services', icon: '🌾', href: '/portal/producer/extension' },
    { id: 'market', name: 'Market Prices', icon: '📈', href: '/portal/producer/prices' },
    { id: 'cooperative', name: 'Cooperative', icon: '🤝', href: '/portal/producer/cooperative' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/producer/settings' }
  ];

  const stats = [
    { title: 'Active Loans', value: '₦2.4M', change: '+₦800K', icon: '₦' },
    { title: 'Crop Insurance', value: '₦150K', change: 'Covered', icon: '🛡️' },
    { title: 'Yield This Season', value: '45 Tons', change: '+12%', icon: '🌾' },
    { title: 'Market Price', value: '₦28K/Ton', change: '+5%', icon: '📈' }
  ];

  const recentActivities = [
    { type: 'Loan Disbursement', description: '₦800K received for maize farming season', time: '1 day ago', status: 'completed' },
    { type: 'Input Purchase', description: 'Fertilizers and seeds purchased from Lead Firm', time: '2 days ago', status: 'completed' },
    { type: 'Insurance Claim', description: 'Crop damage claim submitted for review', time: '3 days ago', status: 'pending' },
    { type: 'Extension Visit', description: 'Technical support received from Extension Officer', time: '5 days ago', status: 'completed' }
  ];

  return (
    <PortalLayout role="Producer/Farmer" roleIcon="🌾" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Welcome to Producer Portal</h1>
          <p className="text-gray-200 font-serif">
            Manage your agricultural loans, track crop insurance, connect with anchor partners, and access farming resources.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-serif">{stat.title}</p>
                  <p className="text-2xl font-bold font-sans text-gray-100">{stat.value}</p>
                  <p className="text-sm text-accent-400 font-serif">{stat.change}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-primary-700 rounded-lg">
                  <div className="w-2 h-2 bg-accent-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium font-sans text-gray-100">{activity.type}</p>
                    <p className="text-sm text-gray-300 font-serif">{activity.description}</p>
                    <p className="text-xs text-gray-400 font-serif">{activity.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'completed' ? 'bg-green-500 text-white' :
                    activity.status === 'pending' ? 'bg-yellow-500 text-white' :
                    'bg-blue-500 text-white'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Anchor Partners */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Anchor Partners</h3>
            <div className="space-y-3">
              {[
                { name: 'Dangote Farms Ltd', contract: 'Maize Supply', volume: '20 Tons', price: '₦28K/Ton' },
                { name: 'Olam Nigeria', contract: 'Rice Supply', volume: '15 Tons', price: '₦32K/Ton' },
                { name: 'Flour Mills Nigeria', contract: 'Wheat Supply', volume: '10 Tons', price: '₦25K/Ton' }
              ].map((anchor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                  <div>
                    <p className="font-medium font-sans text-gray-100">{anchor.name}</p>
                    <p className="text-sm text-gray-300 font-serif">{anchor.contract}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold font-sans text-accent-400">{anchor.volume}</p>
                    <p className="text-xs text-gray-400 font-serif">{anchor.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="btn-primary">
              ₦ Apply for Loan
            </button>
            <button className="btn-secondary">
              🛡️ Claim Insurance
            </button>
            <button className="btn-secondary">
              🌱 Order Inputs
            </button>
            <button className="btn-secondary">
              📊 View Market Prices
            </button>
          </div>
        </div>

        {/* Weather & Market Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Weather Forecast</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Today</span>
                <span className="text-accent-400 font-sans">☀️ 28°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Tomorrow</span>
                <span className="text-accent-400 font-sans">⛅ 26°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Next 3 days</span>
                <span className="text-accent-400 font-sans">🌧️ 24°C</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Market Prices</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Maize</span>
                <span className="text-accent-400 font-sans">₦28,000/Ton</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Rice</span>
                <span className="text-accent-400 font-sans">₦32,000/Ton</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Wheat</span>
                <span className="text-accent-400 font-sans">₦25,000/Ton</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ProducerPortal;
