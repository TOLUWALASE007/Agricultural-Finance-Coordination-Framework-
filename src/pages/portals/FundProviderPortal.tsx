import React from 'react';
import PortalLayout from '../../components/PortalLayout';

const FundProviderPortal: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/fund-provider' },
    { id: 'funds', name: 'Fund Management', icon: '₦', href: '/portal/fund-provider/funds' },
    { id: 'applications', name: 'Loan Applications', icon: '📋', href: '/portal/fund-provider/applications' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/fund-provider/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/fund-provider/settings' }
  ];

  const stats = [
    { title: 'Total Funds Deployed', value: '₦2.4B', change: '+12.5%', icon: '₦' },
    { title: 'Loan Applications', value: '1,847', change: '+8.2%', icon: '📋' }
  ];

  const recentActivities = [
    { type: 'Fund Disbursement', description: '₦50M disbursed for Q4 2024', time: '2 hours ago', status: 'completed' },
    { type: 'Loan Application', description: '₦25M loan application from Anchor Co.', time: '3 days ago', status: 'under-review' }
  ];

  return (
    <PortalLayout role="Fund Provider" roleIcon="₦" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Welcome to Fund Provider Portal</h1>
          <p className="text-gray-200 font-serif">
            Manage agricultural financing, monitor PFI partnerships, and track fund deployment across Nigeria's agricultural sector.
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

        <div className="grid grid-cols-1 gap-6">
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
          {/* Removed PFI Partners performance card */}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="btn-primary">
              📊 Generate Monthly Report
            </button>
            <button className="btn-secondary">
              ₦ Deploy New Funds
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default FundProviderPortal;
