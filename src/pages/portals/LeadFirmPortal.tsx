import React from 'react';
import PortalLayout from '../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../utils/quickActions';

const LeadFirmPortal: React.FC = () => {
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

  const stats = [
    { title: 'Product Lines', value: '45', change: '+3', icon: '🌱' },
    { title: 'Active Orders', value: '1,247', change: '+89', icon: '📦' },
    { title: 'Producer Network', value: '3,456', change: '+67', icon: '🌾' },
    { title: 'Credit Sales', value: '₦485M', change: '+12%', icon: '💰' }
  ];

  const recentActivities = [
    { type: 'Order Fulfilled', description: 'Fertilizer order delivered to 45 producers', time: '1 hour ago', status: 'completed' },
    { type: 'Product Launch', description: 'New hybrid maize seeds added to catalog', time: '3 hours ago', status: 'completed' },
    { type: 'Credit Approval', description: '₦2M credit approved for producer group', time: '5 hours ago', status: 'completed' },
    { type: 'Quality Check', description: 'Seed quality assessment completed', time: '1 day ago', status: 'pending' }
  ];

  return (
    <PortalLayout role="Lead Firm" roleIcon="🌱" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Welcome to Lead Firm Portal</h1>
          <p className="text-gray-200 font-serif">
            Manage agricultural input supply, coordinate with producers, process credit sales, and ensure quality delivery of seeds, fertilizers, and farming equipment.
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

          {/* Top Products */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Top Products</h3>
            <div className="space-y-3">
              {[
                { name: 'NPK Fertilizer 15-15-15', sales: '2,450 bags', revenue: '₦125M', rating: '4.8' },
                { name: 'Hybrid Maize Seeds', sales: '1,890 bags', revenue: '₦89M', rating: '4.9' },
                { name: 'Herbicide Roundup', sales: '1,560 bottles', revenue: '₦67M', rating: '4.7' },
                { name: 'Rice Seeds (FARO 44)', sales: '1,234 bags', revenue: '₦56M', rating: '4.6' }
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                  <div>
                    <p className="font-medium font-sans text-gray-100">{product.name}</p>
                    <p className="text-sm text-gray-300 font-serif">{product.sales}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold font-sans text-accent-400">{product.revenue}</p>
                    <p className="text-xs text-gray-400 font-serif">⭐ {product.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Categories */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Product Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🌱</div>
              <p className="text-2xl font-bold font-sans text-gray-100">18</p>
              <p className="text-sm text-gray-400 font-serif">Seeds</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🧪</div>
              <p className="text-2xl font-bold font-sans text-gray-100">12</p>
              <p className="text-sm text-gray-400 font-serif">Fertilizers</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🔬</div>
              <p className="text-2xl font-bold font-sans text-gray-100">8</p>
              <p className="text-sm text-gray-400 font-serif">Pesticides</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🔧</div>
              <p className="text-2xl font-bold font-sans text-gray-100">7</p>
              <p className="text-sm text-gray-400 font-serif">Equipment</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Product Addition')}
            >
              🌱 Add Product
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Order Processing')}
            >
              📦 Process Order
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Credit Sales')}
            >
              💰 Credit Sales
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Sales Performance Report', 'PDF')}
            >
              📊 Sales Report
            </button>
          </div>
        </div>
        <div className="mt-2 text-center text-xs text-gray-400 font-serif opacity-80">
          Powered by Mc. George
        </div>
      </div>
    </PortalLayout>
  );
};

export default LeadFirmPortal;
