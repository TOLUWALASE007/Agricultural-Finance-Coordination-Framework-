import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../utils/quickActions';
import { getResearcherStatusSnapshot, ResearcherStatus } from '../../utils/localDatabase';

const ResearcherPortal: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/researcher' },
    { id: 'scheme-application', name: 'Schemes Application', icon: '📝', href: '/portal/researcher/scheme-application' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/researcher/settings' }
  ];

  const [status, setStatus] = useState<ResearcherStatus>('unverified');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [recordLoaded, setRecordLoaded] = useState(false);
 
  useEffect(() => {
    const snapshot = getResearcherStatusSnapshot();
    if (snapshot) {
      setStatus(snapshot.status);
      setRejectionReason(snapshot.rejectionReason);
    }
    setRecordLoaded(true);
  }, []);
 
  const isVerified = status === 'verified';

  const stats = [
    { title: 'Research Projects', value: '12', change: '+3', icon: '🧪' },
    { title: 'Publications', value: '8', change: '+2', icon: '📚' },
    { title: 'Active Collaborations', value: '5', change: '+1', icon: '🤝' },
    { title: 'Data Collections', value: '24', change: '+6', icon: '📋' }
  ];

  const recentActivities = [
    { type: 'Scheme Application', description: 'Applied to Research Funding Scheme', time: '2 days ago', status: 'pending' },
    { type: 'Publication', description: 'Published research paper on agricultural finance', time: '1 week ago', status: 'completed' },
    { type: 'Data Collection', description: 'Completed field data collection', time: '2 weeks ago', status: 'completed' },
    { type: 'Conference', description: 'Presented at Agricultural Finance Conference', time: '3 weeks ago', status: 'completed' }
  ];

  if (!recordLoaded) {
    return (
      <PortalLayout role="Researcher/Student" roleIcon="🎓" sidebarItems={sidebarItems}>
        <div className="card">
          <h1 className="text-lg font-semibold font-sans text-gray-100">Loading Dashboard</h1>
          <p className="text-sm text-gray-300 font-serif mt-2">Fetching your Researcher/Student details...</p>
        </div>
      </PortalLayout>
    );
  }
 
  if (!isVerified) {
    return (
      <PortalLayout role="Researcher/Student" roleIcon="🎓" sidebarItems={sidebarItems}>
        <div className="space-y-4">
          <div className="card">
            <h1 className="text-xl font-bold font-sans text-gray-100 mb-2">Awaiting Verification</h1>
            <p className="text-sm text-gray-300 font-serif">
              Your Researcher/Student account is pending approval from the Coordinating Agency. You can update and resubmit your details from the Settings page while you wait.
            </p>
            <Link
              to="/portal/researcher/settings"
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
    <PortalLayout role="Researcher/Student" roleIcon="🎓" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Welcome to Researcher/Student Portal</h1>
          <p className="text-gray-200 font-serif">
            Manage your research projects, apply to funding schemes, track publications, and collaborate with agricultural finance stakeholders.
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

          {/* Research Areas */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Research Areas</h3>
            <div className="space-y-3">
              {[
                { category: 'Agricultural Finance', count: '5 projects', percentage: '42%', color: 'bg-green-500' },
                { category: 'Rural Development', count: '4 projects', percentage: '33%', color: 'bg-blue-500' },
                { category: 'Value Chain', count: '3 projects', percentage: '25%', color: 'bg-purple-500' }
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

        {/* Academic Overview */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Academic Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">📚</div>
              <p className="text-2xl font-bold font-sans text-gray-100">8</p>
              <p className="text-sm text-gray-400 font-serif">Publications</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🧪</div>
              <p className="text-2xl font-bold font-sans text-gray-100">12</p>
              <p className="text-sm text-gray-400 font-serif">Research Projects</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🤝</div>
              <p className="text-2xl font-bold font-sans text-gray-100">5</p>
              <p className="text-sm text-gray-400 font-serif">Collaborations</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">💰</div>
              <p className="text-2xl font-bold font-sans text-gray-100">₦3.2M</p>
              <p className="text-sm text-gray-400 font-serif">Funding Received</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/portal/researcher/scheme-application"
              className="btn-primary text-center"
            >
              📝 Apply to Schemes
            </Link>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Research Performance Report', 'PDF')}
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

export default ResearcherPortal;
