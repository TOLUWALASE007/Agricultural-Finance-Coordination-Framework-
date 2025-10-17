import React from 'react';
import PortalLayout from '../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../utils/quickActions';

const PMTPortal: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/pmt' },
    { id: 'projects', name: 'Projects', icon: '📋', href: '/portal/pmt/projects' },
    { id: 'stakeholders', name: 'Stakeholders', icon: '👥', href: '/portal/pmt/stakeholders' },
    { id: 'monitoring', name: 'Monitoring', icon: '📈', href: '/portal/pmt/monitoring' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/pmt/reports' },
    { id: 'tasks', name: 'Tasks', icon: '✅', href: '/portal/pmt/tasks' },
    { id: 'resources', name: 'Resources', icon: '💰', href: '/portal/pmt/resources' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/pmt/settings' }
  ];

  const stats = [
    { title: 'Active Projects', value: '15', change: '+3', icon: '📋' },
    { title: 'Stakeholders', value: '2,847', change: '+89', icon: '👥' },
    { title: 'Budget Managed', value: '₦25.6B', change: '+₦3.2B', icon: '💰' },
    { title: 'Completion Rate', value: '87%', change: '+5%', icon: '📈' }
  ];

  const recentActivities = [
    { type: 'Project Launch', description: 'New agricultural finance project launched', time: '2 hours ago', status: 'completed' },
    { type: 'Stakeholder Meeting', description: 'Quarterly review meeting with all stakeholders', time: '1 day ago', status: 'completed' },
    { type: 'Budget Approval', description: 'Q4 budget approved for ₦8.5B', time: '2 days ago', status: 'completed' },
    { type: 'Monitoring Visit', description: 'Field monitoring in Kano State', time: '3 days ago', status: 'pending' }
  ];

  return (
    <PortalLayout role="Project Management Team (PMT)" roleIcon="👥" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Welcome to PMT Portal</h1>
          <p className="text-gray-200 font-serif">
            Manage agricultural finance projects, coordinate stakeholder activities, monitor progress, and ensure effective implementation of AFCF initiatives.
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

          {/* Project Status */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Project Status</h3>
            <div className="space-y-3">
              {[
                { project: 'Climate Finance Initiative', progress: '78%', budget: '₦5.2B', status: 'On Track' },
                { project: 'Digital Payment Platform', progress: '65%', budget: '₦3.8B', status: 'On Track' },
                { project: 'Women Farmer Support', progress: '45%', budget: '₦2.1B', status: 'Delayed' },
                { project: 'Insurance Penetration', progress: '92%', budget: '₦1.8B', status: 'Completed' }
              ].map((project, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                  <div>
                    <p className="font-medium font-sans text-gray-100">{project.project}</p>
                    <p className="text-sm text-gray-300 font-serif">{project.budget} budget</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold font-sans text-accent-400">{project.progress}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Completed' ? 'bg-green-500 text-white' :
                      project.status === 'On Track' ? 'bg-blue-500 text-white' :
                      'bg-yellow-500 text-white'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stakeholder Management */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Stakeholder Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🏦</div>
              <p className="text-2xl font-bold font-sans text-gray-100">24</p>
              <p className="text-sm text-gray-400 font-serif">PFI Banks</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🛡️</div>
              <p className="text-2xl font-bold font-sans text-gray-100">8</p>
              <p className="text-sm text-gray-400 font-serif">Insurance</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">⚓</div>
              <p className="text-2xl font-bold font-sans text-gray-100">156</p>
              <p className="text-sm text-gray-400 font-serif">Anchors</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🌾</div>
              <p className="text-2xl font-bold font-sans text-gray-100">2,647</p>
              <p className="text-sm text-gray-400 font-serif">Producers</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🌱</div>
              <p className="text-2xl font-bold font-sans text-gray-100">89</p>
              <p className="text-sm text-gray-400 font-serif">Lead Firms</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Project Launch')}
            >
              📋 Launch Project
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Stakeholder Meeting')}
            >
              👥 Stakeholder Meeting
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Project Management Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Progress Monitoring')}
            >
              📈 Monitor Progress
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default PMTPortal;
