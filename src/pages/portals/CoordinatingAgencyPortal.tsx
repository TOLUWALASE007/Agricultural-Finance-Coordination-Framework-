import React from 'react';
import PortalLayout from '../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../utils/quickActions';

const CoordinatingAgencyPortal: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/coordinating-agency' },
    { id: 'programs', name: 'Programs', icon: '🏛️', href: '/portal/coordinating-agency/programs' },
    { id: 'stakeholders', name: 'Stakeholders', icon: '🤝', href: '/portal/coordinating-agency/stakeholders' },
    { id: 'monitoring', name: 'Monitoring', icon: '📈', href: '/portal/coordinating-agency/monitoring' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/coordinating-agency/reports' },
    { id: 'policies', name: 'Policies', icon: '📋', href: '/portal/coordinating-agency/policies' },
    { id: 'compliance', name: 'Compliance', icon: '✅', href: '/portal/coordinating-agency/compliance' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/coordinating-agency/settings' }
  ];

  const stats = [
    { title: 'Active Programs', value: '12', change: '+2', icon: '🏛️' },
    { title: 'Stakeholders', value: '2,847', change: '+45', icon: '🤝' },
    { title: 'Funds Managed', value: '₦15.2B', change: '+₦2.1B', icon: '💰' },
    { title: 'Compliance Rate', value: '94.5%', change: '+2.1%', icon: '✅' }
  ];

  const recentActivities = [
    { type: 'Program Launch', description: 'New agricultural finance program launched', time: '2 hours ago', status: 'completed' },
    { type: 'Stakeholder Meeting', description: 'Quarterly coordination meeting with PFIs', time: '1 day ago', status: 'completed' },
    { type: 'Compliance Review', description: 'Monthly compliance review completed', time: '2 days ago', status: 'completed' },
    { type: 'Policy Update', description: 'Agricultural finance policy updated', time: '3 days ago', status: 'pending' }
  ];

  return (
    <PortalLayout role="Coordinating Agency" roleIcon="🏛️" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Welcome to Coordinating Agency Portal</h1>
          <p className="text-gray-200 font-serif">
            Oversee agricultural finance programs, coordinate stakeholder activities, monitor compliance, and ensure effective implementation of national agricultural policies.
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

          {/* Stakeholder Overview */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Stakeholder Overview</h3>
            <div className="space-y-3">
              {[
                { type: 'Fund Providers', count: '15', status: 'Active', color: 'bg-green-500' },
                { type: 'PFI Banks', count: '24', status: 'Active', color: 'bg-blue-500' },
                { type: 'Insurance Companies', count: '8', status: 'Active', color: 'bg-purple-500' },
                { type: 'Anchor Companies', count: '156', status: 'Active', color: 'bg-yellow-500' },
                { type: 'Producers', count: '2,647', status: 'Active', color: 'bg-orange-500' }
              ].map((stakeholder, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${stakeholder.color}`}></div>
                    <div>
                      <p className="font-medium font-sans text-gray-100">{stakeholder.type}</p>
                      <p className="text-sm text-gray-300 font-serif">{stakeholder.count} registered</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                    {stakeholder.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Program Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Program Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-2xl font-bold font-sans text-gray-100">87%</p>
              <p className="text-sm text-gray-400 font-serif">Target Achievement</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-2xl font-bold font-sans text-gray-100">+15%</p>
              <p className="text-sm text-gray-400 font-serif">Growth Rate</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">⭐</div>
              <p className="text-2xl font-bold font-sans text-gray-100">4.2/5</p>
              <p className="text-sm text-gray-400 font-serif">Satisfaction Score</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Program Launch')}
            >
              🏛️ Launch Program
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Program Progress Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Stakeholder Meeting')}
            >
              🤝 Stakeholder Meeting
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Compliance Check')}
            >
              ✅ Compliance Check
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default CoordinatingAgencyPortal;
