import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../utils/quickActions';
import { getInsuranceCompanyStatusSnapshot, InsuranceCompanyStatus } from '../../utils/localDatabase';

const InsurancePortal: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/insurance' },
    { id: 'scheme-application', name: 'Schemes Application', icon: '📝', href: '/portal/insurance/scheme-application' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/insurance/settings' }
  ];

  const [status, setStatus] = useState<InsuranceCompanyStatus>('unverified');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [recordLoaded, setRecordLoaded] = useState(false);
 
  useEffect(() => {
    const snapshot = getInsuranceCompanyStatusSnapshot();
    if (snapshot) {
      setStatus(snapshot.status);
      setRejectionReason(snapshot.rejectionReason);
    }
    setRecordLoaded(true);
  }, []);
 
  const isVerified = status === 'verified';

  const stats = [
    { title: 'Active Policies', value: '8,247', change: '+156', icon: '🛡️' },
    { title: 'Claims Processed', value: '₦2.1B', change: '+₦180M', icon: '💰' },
    { title: 'Risk Score', value: '6.8/10', change: '-0.2', icon: '📈' },
    { title: 'Premium Income', value: '₦485M', change: '+12%', icon: '💵' }
  ];

  const recentActivities = [
    { type: 'Claim Approved', description: '₦5M claim approved for flood damage in Kano', time: '1 hour ago', status: 'completed' },
    { type: 'Policy Issued', description: 'New crop insurance policy for 45 producers', time: '3 hours ago', status: 'completed' },
    { type: 'Risk Assessment', description: 'Weather risk evaluation for North Central', time: '5 hours ago', status: 'completed' },
    { type: 'Claim Submitted', description: 'New drought damage claim from Jigawa', time: '1 day ago', status: 'pending' }
  ];

  if (!recordLoaded) {
    return (
      <PortalLayout role="Insurance Company" roleIcon="🛡️" sidebarItems={sidebarItems}>
        <div className="card">
          <h1 className="text-lg font-semibold font-sans text-gray-100">Loading Dashboard</h1>
          <p className="text-sm text-gray-300 font-serif mt-2">Fetching your Insurance Company details...</p>
        </div>
      </PortalLayout>
    );
  }
 
  if (!isVerified) {
    return (
      <PortalLayout role="Insurance Company" roleIcon="🛡️" sidebarItems={sidebarItems}>
        <div className="space-y-4">
          <div className="card">
            <h1 className="text-xl font-bold font-sans text-gray-100 mb-2">Awaiting Verification</h1>
            <p className="text-sm text-gray-300 font-serif">
              Your Insurance Company account is pending approval from the Coordinating Agency. You can update and resubmit your details from the Settings page while you wait.
            </p>
            <Link
              to="/portal/insurance/settings"
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
    <PortalLayout role="Insurance Company" roleIcon="🛡️" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Welcome to Insurance Portal</h1>
          <p className="text-gray-200 font-serif">
            Manage agricultural insurance policies, process claims, assess risks, and provide financial protection for Nigeria's farming community.
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

          {/* Claims by Type */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Claims by Type</h3>
            <div className="space-y-3">
              {[
                { type: 'Flood Damage', count: '245', amount: '₦850M', color: 'bg-blue-500' },
                { type: 'Drought', count: '189', amount: '₦620M', color: 'bg-yellow-500' },
                { type: 'Pest Attack', count: '156', amount: '₦480M', color: 'bg-red-500' },
                { type: 'Disease', count: '98', amount: '₦320M', color: 'bg-purple-500' }
              ].map((claim, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${claim.color}`}></div>
                    <div>
                      <p className="font-medium font-sans text-gray-100">{claim.type}</p>
                      <p className="text-sm text-gray-300 font-serif">{claim.count} claims</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold font-sans text-accent-400">{claim.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weather Risk Monitoring */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Weather Risk Monitoring</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🌧️</div>
              <p className="text-lg font-bold font-sans text-gray-100">High</p>
              <p className="text-sm text-gray-400 font-serif">Flood Risk</p>
              <p className="text-xs text-red-400 font-serif">Kano, Kaduna</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">☀️</div>
              <p className="text-lg font-bold font-sans text-gray-100">Medium</p>
              <p className="text-sm text-gray-400 font-serif">Drought Risk</p>
              <p className="text-xs text-yellow-400 font-serif">Sokoto, Kebbi</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🌪️</div>
              <p className="text-lg font-bold font-sans text-gray-100">Low</p>
              <p className="text-sm text-gray-400 font-serif">Storm Risk</p>
              <p className="text-xs text-green-400 font-serif">All Regions</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🌡️</div>
              <p className="text-lg font-bold font-sans text-gray-100">Normal</p>
              <p className="text-sm text-gray-400 font-serif">Temperature</p>
              <p className="text-xs text-blue-400 font-serif">28°C Average</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/portal/insurance/scheme-application"
              className="btn-primary text-center"
            >
              📝 Apply to Schemes
            </Link>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Insurance Reports', 'PDF')}
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

export default InsurancePortal;
