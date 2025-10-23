import React from 'react';
import PortalLayout from '../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../utils/quickActions';

const ExtensionPortal: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/extension' },
    { id: 'farmers', name: 'Farmers', icon: '🌾', href: '/portal/extension/farmers' },
    { id: 'training', name: 'Training Programs', icon: '🎓', href: '/portal/extension/training' },
    { id: 'advisory', name: 'Advisory Services', icon: '💡', href: '/portal/extension/advisory' },
    { id: 'technology', name: 'Technology Transfer', icon: '🔬', href: '/portal/extension/tech' },
    { id: 'monitoring', name: 'Field Monitoring', icon: '📱', href: '/portal/extension/monitoring' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/extension/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/extension/settings' }
  ];

  const stats = [
    { title: 'Farmers Served', value: '3,247', change: '+89', icon: '🌾' },
    { title: 'Training Sessions', value: '45', change: '+8', icon: '🎓' },
    { title: 'Advisory Visits', value: '1,456', change: '+67', icon: '💡' },
    { title: 'Technology Adoptions', value: '234', change: '+23', icon: '🔬' }
  ];

  const recentActivities = [
    { type: 'Training Conducted', description: 'Climate-smart agriculture training for 45 farmers', time: '1 hour ago', status: 'completed' },
    { type: 'Field Visit', description: 'Advisory visit to maize farms in Kaduna', time: '3 hours ago', status: 'completed' },
    { type: 'Technology Demo', description: 'New irrigation system demonstration', time: '1 day ago', status: 'completed' },
    { type: 'Assessment', description: 'Crop yield assessment in Kano State', time: '2 days ago', status: 'pending' }
  ];

  return (
    <PortalLayout role="Extension Organization" roleIcon="🌾" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Welcome to Extension Portal</h1>
          <p className="text-gray-200 font-serif">
            Provide agricultural extension services, conduct training programs, offer advisory services, and facilitate technology transfer to farmers.
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

          {/* Training Programs */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Active Training Programs</h3>
            <div className="space-y-3">
              {[
                { program: 'Climate-Smart Agriculture', participants: '245', completion: '87%', status: 'Active' },
                { program: 'Post-Harvest Management', participants: '189', completion: '92%', status: 'Active' },
                { program: 'Digital Farming Tools', participants: '156', completion: '78%', status: 'Active' },
                { program: 'Sustainable Practices', participants: '134', completion: '95%', status: 'Completed' }
              ].map((program, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                  <div>
                    <p className="font-medium font-sans text-gray-100">{program.program}</p>
                    <p className="text-sm text-gray-300 font-serif">{program.participants} participants</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold font-sans text-accent-400">{program.completion}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      program.status === 'Active' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                    }`}>
                      {program.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technology Transfer */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Technology Transfer</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">💧</div>
              <p className="text-2xl font-bold font-sans text-gray-100">89</p>
              <p className="text-sm text-gray-400 font-serif">Irrigation Systems</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">📱</div>
              <p className="text-2xl font-bold font-sans text-gray-100">156</p>
              <p className="text-sm text-gray-400 font-serif">Mobile Apps</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🌱</div>
              <p className="text-2xl font-bold font-sans text-gray-100">234</p>
              <p className="text-sm text-gray-400 font-serif">Improved Seeds</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🔬</div>
              <p className="text-2xl font-bold font-sans text-gray-100">67</p>
              <p className="text-sm text-gray-400 font-serif">Soil Testing</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => processAction('Training Scheduling')}
            >
              🎓 Schedule Training
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Advisory Visit')}
            >
              💡 Advisory Visit
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Technology Demonstration')}
            >
              🔬 Technology Demo
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Extension Services Report', 'PDF')}
            >
              📊 Generate Report
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

export default ExtensionPortal;
