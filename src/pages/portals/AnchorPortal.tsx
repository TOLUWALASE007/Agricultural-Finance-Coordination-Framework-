import React from 'react';
import PortalLayout from '../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, contactPerson } from '../../utils/quickActions';

const AnchorPortal: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/anchor' },
    { id: 'producers', name: 'Producer Network', icon: '🌾', href: '/portal/anchor/producers' },
    { id: 'contracts', name: 'Supply Contracts', icon: '📋', href: '/portal/anchor/contracts' },
    { id: 'loans', name: 'Producer Loans', icon: '💰', href: '/portal/anchor/loans' },
    { id: 'quality', name: 'Quality Control', icon: '✅', href: '/portal/anchor/quality' },
    { id: 'logistics', name: 'Logistics', icon: '🚚', href: '/portal/anchor/logistics' },
    { id: 'market', name: 'Market Analysis', icon: '📈', href: '/portal/anchor/market' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/anchor/reports' }
  ];

  const stats = [
    { title: 'Producer Network', value: '1,247', change: '+23', icon: '🌾' },
    { title: 'Active Contracts', value: '89', change: '+5', icon: '📋' },
    { title: 'Supply Volume', value: '2,450 Tons', change: '+12%', icon: '📦' },
    { title: 'Quality Score', value: '9.2/10', change: '+0.2', icon: '✅' }
  ];

  const recentActivities = [
    { type: 'Contract Signed', description: 'New supply contract with 45 producers for maize', time: '2 hours ago', status: 'completed' },
    { type: 'Quality Check', description: 'Quality assessment completed for rice batch', time: '4 hours ago', status: 'completed' },
    { type: 'Producer Onboarded', description: '12 new producers added to network', time: '1 day ago', status: 'completed' },
    { type: 'Loan Facilitated', description: '₦15M loan facilitated for producer group', time: '2 days ago', status: 'pending' }
  ];

  return (
    <PortalLayout role="Anchor" roleIcon="⚓" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Welcome to Anchor Portal</h1>
          <p className="text-gray-200 font-serif">
            Manage your producer network, coordinate supply contracts, facilitate loans, and ensure quality standards across your agricultural value chain.
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

          {/* Producer Network */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Producer Network</h3>
            <div className="space-y-3">
              {[
                { region: 'North Central', producers: '456', volume: '1,200 Tons', performance: '95%' },
                { region: 'South West', producers: '389', volume: '980 Tons', performance: '92%' },
                { region: 'North West', producers: '234', volume: '670 Tons', performance: '88%' },
                { region: 'South East', producers: '168', volume: '420 Tons', performance: '91%' }
              ].map((region, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                  <div>
                    <p className="font-medium font-sans text-gray-100">{region.region}</p>
                    <p className="text-sm text-gray-300 font-serif">{region.producers} producers</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold font-sans text-accent-400">{region.volume}</p>
                    <p className="text-xs text-gray-400 font-serif">{region.performance} performance</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Supply Contracts Overview */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Supply Contracts Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🌽</div>
              <p className="text-2xl font-bold font-sans text-gray-100">1,450</p>
              <p className="text-sm text-gray-400 font-serif">Maize (Tons)</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🌾</div>
              <p className="text-2xl font-bold font-sans text-gray-100">680</p>
              <p className="text-sm text-gray-400 font-serif">Rice (Tons)</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🌾</div>
              <p className="text-2xl font-bold font-sans text-gray-100">320</p>
              <p className="text-sm text-gray-400 font-serif">Wheat (Tons)</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🥜</div>
              <p className="text-2xl font-bold font-sans text-gray-100">180</p>
              <p className="text-sm text-gray-400 font-serif">Groundnut (Tons)</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Supply Contract')}
            >
              📋 Create Contract
            </button>
            <button 
              className="btn-secondary"
              onClick={() => addNewRecord('Producer Registration')}
            >
              🌾 Add Producer
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Loan Facilitation')}
            >
              💰 Facilitate Loan
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Quality Assessment Report', 'PDF')}
            >
              📊 Quality Report
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

export default AnchorPortal;
