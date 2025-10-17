import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const MarketPrices: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/producer' },
    { id: 'loans', name: 'Loan Applications', icon: '💰', href: '/portal/producer/loans' },
    { id: 'anchors', name: 'Anchor Partners', icon: '🤝', href: '/portal/producer/anchors' },
    { id: 'inputs', name: 'Input Suppliers', icon: '🌱', href: '/portal/producer/inputs' },
    { id: 'insurance', name: 'Crop Insurance', icon: '🛡️', href: '/portal/producer/insurance' },
    { id: 'extension', name: 'Extension Services', icon: '🌾', href: '/portal/producer/extension' },
    { id: 'prices', name: 'Market Prices', icon: '📈', href: '/portal/producer/prices' },
    { id: 'cooperative', name: 'Cooperative', icon: '👥', href: '/portal/producer/cooperative' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/producer/settings' }
  ];

  const marketPrices = [
    {
      id: 'PRC-001',
      crop: 'Rice',
      variety: 'Faro 44',
      currentPrice: 450,
      previousPrice: 420,
      change: '+30',
      changePercent: 7.1,
      market: 'Kaduna Central Market',
      date: '2024-01-20',
      trend: 'up',
      quality: 'Grade A'
    },
    {
      id: 'PRC-002',
      crop: 'Maize',
      variety: 'Yellow Maize',
      currentPrice: 280,
      previousPrice: 300,
      change: '-20',
      changePercent: -6.7,
      market: 'Kano Grain Market',
      date: '2024-01-20',
      trend: 'down',
      quality: 'Grade A'
    },
    {
      id: 'PRC-003',
      crop: 'Cassava',
      variety: 'TMS 30572',
      currentPrice: 180,
      previousPrice: 175,
      change: '+5',
      changePercent: 2.9,
      market: 'Enugu Market',
      date: '2024-01-20',
      trend: 'up',
      quality: 'Grade A'
    },
    {
      id: 'PRC-004',
      crop: 'Wheat',
      variety: 'Durum Wheat',
      currentPrice: 320,
      previousPrice: 315,
      change: '+5',
      changePercent: 1.6,
      market: 'Sokoto Market',
      date: '2024-01-20',
      trend: 'up',
      quality: 'Grade A'
    }
  ];

  const priceStats = [
    { label: 'Crops Tracked', value: '12', change: '+2', trend: 'up' },
    { label: 'Average Price', value: '₦307', change: '+₦15', trend: 'up' },
    { label: 'Price Alerts', value: '3', change: '+1', trend: 'up' },
    { label: 'Market Coverage', value: '8', change: '+1', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="Producer/Farmer" 
      roleIcon="🌾" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Market Prices</h1>
            <p className="text-gray-400 font-serif mt-2">Track current market prices for your crops</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Market Prices Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Price Alert')}
            >
              ➕ Set Price Alert
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {priceStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Current Market Prices</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Crops</option>
                <option>Rice</option>
                <option>Maize</option>
                <option>Cassava</option>
                <option>Wheat</option>
              </select>
              <select className="input-field w-auto">
                <option>All Markets</option>
                <option>Kaduna Central Market</option>
                <option>Kano Grain Market</option>
                <option>Enugu Market</option>
                <option>Sokoto Market</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Prices', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Crop</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Variety</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Current Price</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Previous Price</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Change</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Market</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Date</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {marketPrices.map((price) => (
                  <tr key={price.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{price.crop}</p>
                        <p className="text-sm text-gray-400 font-serif">{price.quality}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{price.variety}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">₦{price.currentPrice}/kg</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">₦{price.previousPrice}/kg</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${
                          price.trend === 'up' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {price.change}
                        </span>
                        <span className={`text-xs px-1 py-0.5 rounded ${
                          price.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {price.changePercent > 0 ? '+' : ''}{price.changePercent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{price.market}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{price.date}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Price Details', price.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Set Price Alert')}
                        >
                          Alert
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Market Analysis')}
                        >
                          Analyze
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
              onClick={() => addNewRecord('Price Alert')}
            >
              📈 Set Alert
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Market Analysis')}
            >
              📊 Analysis
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Price Forecast')}
            >
              🔮 Forecast
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Price Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default MarketPrices;
