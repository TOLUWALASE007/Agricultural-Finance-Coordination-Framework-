import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../utils/quickActions';
import { getProducerStatusSnapshot, ProducerStatus } from '../../utils/localDatabase';

const ProducerPortal: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/producer' },
    { id: 'scheme-application', name: 'Schemes Application', icon: '📝', href: '/portal/producer/scheme-application' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/producer/settings' }
  ];

  const [status, setStatus] = useState<ProducerStatus>('unverified');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [recordLoaded, setRecordLoaded] = useState(false);
 
  useEffect(() => {
    const snapshot = getProducerStatusSnapshot();
    if (snapshot) {
      setStatus(snapshot.status);
      setRejectionReason(snapshot.rejectionReason);
    }
    setRecordLoaded(true);
  }, []);
 
  const isVerified = status === 'verified';

  const stats = [
    { title: 'Total Production', value: '2,450 tons', change: '+320 tons', icon: '🌾' },
    { title: 'Active Schemes', value: '3', change: '+1', icon: '📋' },
    { title: 'Farm Size', value: '45 hectares', change: '+5 hectares', icon: '🏞️' },
    { title: 'Revenue', value: '₦8.2M', change: '+₦1.5M', icon: '💰' }
  ];

  const recentActivities = [
    { type: 'Scheme Application', description: 'Applied to Agricultural Development Fund Scheme', time: '1 day ago', status: 'pending' },
    { type: 'Harvest', description: 'Completed maize harvest - 320 tons', time: '3 days ago', status: 'completed' },
    { type: 'Training', description: 'Attended best practices training session', time: '1 week ago', status: 'completed' },
    { type: 'Market Sale', description: 'Sold produce to anchor partner', time: '2 weeks ago', status: 'completed' }
  ];

  if (!recordLoaded) {
    return (
      <PortalLayout role="Producer/Farmer" roleIcon="🌾" sidebarItems={sidebarItems}>
        <div className="card">
          <h1 className="text-lg font-semibold font-sans text-gray-100">Loading Dashboard</h1>
          <p className="text-sm text-gray-300 font-serif mt-2">Fetching your Producer/Farmer details...</p>
        </div>
      </PortalLayout>
    );
  }
 
  if (!isVerified) {
    return (
      <PortalLayout role="Producer/Farmer" roleIcon="🌾" sidebarItems={sidebarItems}>
        <div className="space-y-4">
          <div className="card">
            <h1 className="text-xl font-bold font-sans text-gray-100 mb-2">Awaiting Verification</h1>
            <p className="text-sm text-gray-300 font-serif">
              Your Producer/Farmer account is pending approval from the Coordinating Agency. You can update and resubmit your details from the Settings page while you wait.
            </p>
            <Link
              to="/portal/producer/settings"
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
    <PortalLayout role="Producer/Farmer" roleIcon="🌾" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Welcome to Producer/Farmer Portal</h1>
          <p className="text-gray-200 font-serif">
            Manage your farm operations, apply to agricultural schemes, track production, and connect with markets and extension services.
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

          {/* Production Overview */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Production Overview</h3>
            <div className="space-y-3">
              {[
                { category: 'Crops', count: '2,450 tons', percentage: '75%', color: 'bg-green-500' },
                { category: 'Livestock', count: '320 units', percentage: '20%', color: 'bg-blue-500' },
                { category: 'Mixed', count: '180 units', percentage: '5%', color: 'bg-purple-500' }
              ].map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <div>
                      <p className="font-medium font-sans text-gray-100">{category.category}</p>
                      <p className="text-sm text-gray-300 font-serif">{category.count}</p>
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
              <div className="text-2xl mb-2">💰</div>
              <p className="text-2xl font-bold font-sans text-gray-100">₦8.2M</p>
              <p className="text-sm text-gray-400 font-serif">Total Revenue</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-2xl font-bold font-sans text-gray-100">₦2.1M</p>
              <p className="text-sm text-gray-400 font-serif">Monthly Income</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">💼</div>
              <p className="text-2xl font-bold font-sans text-gray-100">₦1.5M</p>
              <p className="text-sm text-gray-400 font-serif">Active Loans</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-2xl font-bold font-sans text-gray-100">₦5.6M</p>
              <p className="text-sm text-gray-400 font-serif">Net Worth</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/portal/producer/scheme-application"
              className="btn-primary text-center"
            >
              📝 Apply to Schemes
            </Link>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Producer Performance Report', 'PDF')}
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

export default ProducerPortal;
