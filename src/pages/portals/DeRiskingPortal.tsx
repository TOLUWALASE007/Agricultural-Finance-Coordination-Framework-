import React from 'react';
import PortalLayout from '../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../utils/quickActions';

const DeRiskingPortal: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/de-risking' },
    { id: 'funds', name: 'De-risking Funds', icon: '💰', href: '/portal/de-risking/funds' },
    { id: 'risk', name: 'Risk Assessment', icon: '📈', href: '/portal/de-risking/risk' },
    { id: 'guarantees', name: 'Guarantees', icon: '🛡️', href: '/portal/de-risking/guarantees' },
    { id: 'partners', name: 'Partners', icon: '🤝', href: '/portal/de-risking/partners' },
    { id: 'monitoring', name: 'Monitoring', icon: '📱', href: '/portal/de-risking/monitoring' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/de-risking/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/de-risking/settings' }
  ];

  const stats = [
    { title: 'De-risking Funds', value: '₦8.2B', change: '+₦1.2B', icon: '💰' },
    { title: 'Active Guarantees', value: '1,247', change: '+89', icon: '🛡️' },
    { title: 'Risk Coverage', value: '₦15.6B', change: '+₦2.1B', icon: '📈' },
    { title: 'Partner Institutions', value: '24', change: '+2', icon: '🤝' }
  ];

  const recentActivities = [
    { type: 'Guarantee Issued', description: '₦50M guarantee issued to First Bank', time: '1 hour ago', status: 'completed' },
    { type: 'Risk Assessment', description: 'Risk evaluation for North Central region', time: '3 hours ago', status: 'completed' },
    { type: 'Fund Deployment', description: '₦200M de-risking fund deployed', time: '1 day ago', status: 'completed' },
    { type: 'Partner Agreement', description: 'New partnership with Zenith Bank', time: '2 days ago', status: 'pending' }
  ];

  return (
    <PortalLayout role="De-risking Institution" roleIcon="🛡️" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Welcome to De-risking Portal</h1>
          <p className="text-gray-200 font-serif">
            Manage de-risking funds, provide guarantees, assess risks, and support financial institutions in agricultural lending through risk mitigation.
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

          {/* Risk Coverage by Sector */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Risk Coverage by Sector</h3>
            <div className="space-y-3">
              {[
                { sector: 'Crop Production', coverage: '₦6.2B', percentage: '40%', color: 'bg-green-500' },
                { sector: 'Livestock', coverage: '₦4.8B', percentage: '31%', color: 'bg-blue-500' },
                { sector: 'Agri-processing', coverage: '₦3.1B', percentage: '20%', color: 'bg-purple-500' },
                { sector: 'Fisheries', coverage: '₦1.5B', percentage: '9%', color: 'bg-orange-500' }
              ].map((sector, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${sector.color}`}></div>
                    <div>
                      <p className="font-medium font-sans text-gray-100">{sector.sector}</p>
                      <p className="text-sm text-gray-300 font-serif">{sector.percentage} coverage</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold font-sans text-accent-400">{sector.coverage}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Guarantee Portfolio */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Guarantee Portfolio</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">✅</div>
              <p className="text-2xl font-bold font-sans text-gray-100">1,047</p>
              <p className="text-sm text-gray-400 font-serif">Active Guarantees</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">💰</div>
              <p className="text-2xl font-bold font-sans text-gray-100">₦15.6B</p>
              <p className="text-sm text-gray-400 font-serif">Total Coverage</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-2xl font-bold font-sans text-gray-100">2.1%</p>
              <p className="text-sm text-gray-400 font-serif">Default Rate</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🏆</div>
              <p className="text-2xl font-bold font-sans text-gray-100">97.9%</p>
              <p className="text-sm text-gray-400 font-serif">Success Rate</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Guarantee Issuance')}
            >
              🛡️ Issue Guarantee
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Risk Assessment')}
            >
              📈 Risk Assessment
            </button>
            <button 
              className="btn-secondary"
              onClick={() => addNewRecord('Partner Registration')}
            >
              🤝 Add Partner
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('De-risking Performance Report', 'PDF')}
            >
              📊 Generate Report
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default DeRiskingPortal;
