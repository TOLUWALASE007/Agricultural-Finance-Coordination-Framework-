import React from 'react';
import PortalLayout from '../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../utils/quickActions';

const ResearcherPortal: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/researcher' },
    { id: 'research', name: 'Research Projects', icon: '🔬', href: '/portal/researcher/projects' },
    { id: 'data', name: 'Data Collection', icon: '📊', href: '/portal/researcher/data' },
    { id: 'publications', name: 'Publications', icon: '📚', href: '/portal/researcher/publications' },
    { id: 'collaborations', name: 'Collaborations', icon: '🤝', href: '/portal/researcher/collaborations' },
    { id: 'funding', name: 'Funding', icon: '💰', href: '/portal/researcher/funding' },
    { id: 'conferences', name: 'Conferences', icon: '🎓', href: '/portal/researcher/conferences' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/researcher/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/researcher/settings' }
  ];

  const stats = [
    { title: 'Active Projects', value: '8', change: '+2', icon: '🔬' },
    { title: 'Publications', value: '23', change: '+5', icon: '📚' },
    { title: 'Data Points', value: '15.6K', change: '+2.3K', icon: '📊' },
    { title: 'Collaborations', value: '12', change: '+3', icon: '🤝' }
  ];

  const recentActivities = [
    { type: 'Data Collection', description: 'Field data collection in Kano State completed', time: '2 hours ago', status: 'completed' },
    { type: 'Publication', description: 'Research paper published in Agricultural Journal', time: '1 day ago', status: 'completed' },
    { type: 'Conference', description: 'Presented findings at AFCF Research Conference', time: '3 days ago', status: 'completed' },
    { type: 'Funding', description: 'Grant application submitted for climate research', time: '5 days ago', status: 'pending' }
  ];

  return (
    <PortalLayout role="Researcher/Student" roleIcon="🎓" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-violet-600 to-violet-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Welcome to Researcher Portal</h1>
          <p className="text-gray-200 font-serif">
            Conduct agricultural finance research, collect field data, publish findings, and collaborate with stakeholders to advance agricultural development.
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

          {/* Research Projects */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Active Research Projects</h3>
            <div className="space-y-3">
              {[
                { project: 'Climate Finance Impact', progress: '78%', funding: '₦2.5M', status: 'Active' },
                { project: 'Digital Payment Adoption', progress: '65%', funding: '₦1.8M', status: 'Active' },
                { project: 'Women Farmer Access', progress: '45%', funding: '₦3.2M', status: 'Active' },
                { project: 'Insurance Penetration', progress: '92%', funding: '₦1.5M', status: 'Completed' }
              ].map((project, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                  <div>
                    <p className="font-medium font-sans text-gray-100">{project.project}</p>
                    <p className="text-sm text-gray-300 font-serif">{project.funding} funding</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold font-sans text-accent-400">{project.progress}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Active' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Research Areas */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Research Areas</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">💰</div>
              <p className="text-2xl font-bold font-sans text-gray-100">4</p>
              <p className="text-sm text-gray-400 font-serif">Finance Studies</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🌍</div>
              <p className="text-2xl font-bold font-sans text-gray-100">3</p>
              <p className="text-sm text-gray-400 font-serif">Climate Research</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">📱</div>
              <p className="text-2xl font-bold font-sans text-gray-100">2</p>
              <p className="text-sm text-gray-400 font-serif">Digital Studies</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">👥</div>
              <p className="text-2xl font-bold font-sans text-gray-100">3</p>
              <p className="text-sm text-gray-400 font-serif">Social Impact</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Research Project')}
            >
              🔬 Start Research
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Data Analysis')}
            >
              📊 Data Analysis
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Paper Publication')}
            >
              📚 Publish Paper
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Collaborator Search')}
            >
              🤝 Find Collaborators
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ResearcherPortal;
