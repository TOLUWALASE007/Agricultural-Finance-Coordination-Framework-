import React from 'react';
import PortalLayout from '../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../utils/quickActions';

const PFIPortal: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/pfi' },
    { id: 'loans', name: 'Loan Processing', icon: '💰', href: '/portal/pfi/loans' },
    { id: 'applications', name: 'Applications', icon: '📋', href: '/portal/pfi/applications' },
    { id: 'producers', name: 'Producer Network', icon: '🌾', href: '/portal/pfi/producers' },
    { id: 'anchors', name: 'Anchor Partners', icon: '⚓', href: '/portal/pfi/anchors' },
    { id: 'insurance', name: 'Insurance Claims', icon: '🛡️', href: '/portal/pfi/insurance' },
    { id: 'risk', name: 'Risk Assessment', icon: '📈', href: '/portal/pfi/risk' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/pfi/reports' }
  ];

  const stats = [
    { title: 'Active Loans', value: '₦485M', change: '+15.2%', icon: '💰' },
    { title: 'Pending Applications', value: '127', change: '+8', icon: '📋' },
    { title: 'Producer Network', value: '2,847', change: '+45', icon: '🌾' },
    { title: 'Risk Score', value: '7.2/10', change: '+0.3', icon: '📈' }
  ];

  const recentActivities = [
    { type: 'Loan Approved', description: '₦5M loan approved for John Doe (Maize Farming)', time: '1 hour ago', status: 'completed' },
    { type: 'Application Received', description: 'New loan application from Sarah Farms', time: '2 hours ago', status: 'pending' },
    { type: 'Risk Assessment', description: 'Risk evaluation completed for Anchor Co.', time: '3 hours ago', status: 'completed' },
    { type: 'Insurance Claim', description: '₦2M claim processed for flood damage', time: '1 day ago', status: 'completed' }
  ];

  return (
    <PortalLayout role="Participating Bank (PFI)" roleIcon="🏦" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Welcome to PFI Portal</h1>
          <p className="text-gray-200 font-serif">
            Process agricultural loans, manage producer relationships, assess risks, and coordinate with anchor partners and insurance providers.
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

          {/* Loan Pipeline */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Loan Pipeline</h3>
            <div className="space-y-3">
              {[
                { stage: 'Application Review', count: '45', amount: '₦125M', color: 'bg-yellow-500' },
                { stage: 'Risk Assessment', count: '32', amount: '₦89M', color: 'bg-blue-500' },
                { stage: 'Final Approval', count: '18', amount: '₦52M', color: 'bg-green-500' },
                { stage: 'Disbursement', count: '12', amount: '₦28M', color: 'bg-purple-500' }
              ].map((stage, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                    <div>
                      <p className="font-medium font-sans text-gray-100">{stage.stage}</p>
                      <p className="text-sm text-gray-300 font-serif">{stage.count} applications</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold font-sans text-accent-400">{stage.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Producer Network Overview */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Producer Network Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🌾</div>
              <p className="text-2xl font-bold font-sans text-gray-100">2,847</p>
              <p className="text-sm text-gray-400 font-serif">Active Producers</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">⚓</div>
              <p className="text-2xl font-bold font-sans text-gray-100">156</p>
              <p className="text-sm text-gray-400 font-serif">Anchor Partners</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🤝</div>
              <p className="text-2xl font-bold font-sans text-gray-100">89</p>
              <p className="text-sm text-gray-400 font-serif">Cooperatives</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => processAction('Loan Application Processing')}
            >
              📋 Process Applications
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Risk Assessment')}
            >
              📊 Risk Assessment
            </button>
            <button 
              className="btn-secondary"
              onClick={() => addNewRecord('Producer Registration')}
            >
              🌾 Add Producer
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('PFI Performance Report', 'PDF')}
            >
              📈 Generate Report
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default PFIPortal;
