import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../utils/quickActions';
import { getCooperativeGroupStatusSnapshot, CooperativeGroupStatus } from '../../utils/localDatabase';

const CooperativePortal: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/cooperative' },
    { id: 'scheme-application', name: 'Schemes Application', icon: '📝', href: '/portal/cooperative/scheme-application' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/cooperative/settings' }
  ];

  const [status, setStatus] = useState<CooperativeGroupStatus>('unverified');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [recordLoaded, setRecordLoaded] = useState(false);
 
  useEffect(() => {
    const snapshot = getCooperativeGroupStatusSnapshot();
    if (snapshot) {
      setStatus(snapshot.status);
      setRejectionReason(snapshot.rejectionReason);
    }
    setRecordLoaded(true);
  }, []);
 
  const isVerified = status === 'verified';

  const stats = [
    { title: 'Active Members', value: '247', change: '+12', icon: '👥' },
    { title: 'Group Savings', value: '₦12.4M', change: '+₦1.2M', icon: '🏦' },
    { title: 'Active Loans', value: '₦8.7M', change: '+₦2.1M', icon: '💼' },
    { title: 'Training Sessions', value: '18', change: '+3', icon: '🎓' }
  ];

  const recentActivities = [
    { type: 'Loan Disbursement', description: '₦5M group loan disbursed to 45 members', time: '2 hours ago', status: 'completed' },
    { type: 'Member Registration', description: '12 new members joined the cooperative', time: '1 day ago', status: 'completed' },
    { type: 'Training Session', description: 'Agricultural best practices training conducted', time: '2 days ago', status: 'completed' },
    { type: 'Market Sale', description: 'Group maize sale to anchor partner', time: '3 days ago', status: 'pending' }
  ];

  if (!recordLoaded) {
    return (
      <PortalLayout role="Cooperative Group" roleIcon="🤝" sidebarItems={sidebarItems}>
        <div className="card">
          <h1 className="text-lg font-semibold font-sans text-gray-100">Loading Dashboard</h1>
          <p className="text-sm text-gray-300 font-serif mt-2">Fetching your Cooperative Group details...</p>
        </div>
      </PortalLayout>
    );
  }
 
  if (!isVerified) {
    return (
      <PortalLayout role="Cooperative Group" roleIcon="🤝" sidebarItems={sidebarItems}>
        <div className="space-y-4">
          <div className="card">
            <h1 className="text-xl font-bold font-sans text-gray-100 mb-2">Awaiting Verification</h1>
            <p className="text-sm text-gray-300 font-serif">
              Your Cooperative Group account is pending approval from the Coordinating Agency. You can update and resubmit your details from the Settings page while you wait.
            </p>
            <Link
              to="/portal/cooperative/settings"
              className="inline-flex items-center mt-4 px-4 py-2 rounded-md bg-accent-500 hover:bg-accent-600 text-white font-medium"
            >
              Go to Settings
            </Link>
          </div>
          {rejectionReason && (
            <div className="card">
              <h2 className="text-lg font-semibold font-sans text-gray-100 mb-2">Most Recent Feedback</h2>
              <p className="text-sm text-red-400 font-serif">{rejectionReason}</p>
            </div>
          )}
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout role="Cooperative Group" roleIcon="🤝" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Welcome to Cooperative Portal</h1>
          <p className="text-gray-200 font-serif">
            Manage cooperative members, facilitate group loans and savings, provide training, and connect members to markets and extension services.
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

          {/* Member Categories */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Member Categories</h3>
            <div className="space-y-3">
              {[
                { category: 'Smallholder Farmers', count: '156', percentage: '63%', color: 'bg-green-500' },
                { category: 'Medium Farmers', count: '67', percentage: '27%', color: 'bg-blue-500' },
                { category: 'Youth Farmers', count: '18', percentage: '7%', color: 'bg-purple-500' },
                { category: 'Women Farmers', count: '6', percentage: '3%', color: 'bg-pink-500' }
              ].map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <div>
                      <p className="font-medium font-sans text-gray-100">{category.category}</p>
                      <p className="text-sm text-gray-300 font-serif">{category.count} members</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-600 text-gray-100">
                    {category.percentage}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Financial Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">💼</div>
              <p className="text-2xl font-bold font-sans text-gray-100">₦8.7M</p>
              <p className="text-sm text-gray-400 font-serif">Active Loans</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🏦</div>
              <p className="text-2xl font-bold font-sans text-gray-100">₦12.4M</p>
              <p className="text-sm text-gray-400 font-serif">Total Savings</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-2xl font-bold font-sans text-gray-100">₦3.2M</p>
              <p className="text-sm text-gray-400 font-serif">Monthly Revenue</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">💎</div>
              <p className="text-2xl font-bold font-sans text-gray-100">₦24.3M</p>
              <p className="text-sm text-gray-400 font-serif">Total Assets</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/portal/cooperative/scheme-application"
              className="btn-primary text-center"
            >
              📝 Apply to Schemes
            </Link>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Cooperative Performance Report', 'PDF')}
            >
              📊 Generate Reports
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

export default CooperativePortal;
