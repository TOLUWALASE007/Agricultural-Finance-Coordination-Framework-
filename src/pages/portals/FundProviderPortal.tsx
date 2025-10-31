import React, { useMemo, useState } from 'react';
import PortalLayout from '../../components/PortalLayout';

const FundProviderPortal: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/fund-provider' },
    { id: 'funds', name: 'Fund Management', icon: '💼', href: '/portal/fund-provider/funds' },
    { id: 'applications', name: 'Schemes', icon: '📋', href: '/portal/fund-provider/applications' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/fund-provider/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/fund-provider/settings' }
  ];

  const stats = [
    { title: 'Total Funds Deployed', value: '₦2.4B', change: '+12.5%', icon: '💼' },
    { title: 'Applicants', value: '1,847', change: '+8.2%', icon: '👥' },
    { title: 'Performing Schemes', value: '1,456', change: '+4.3%', icon: '✅' },
    { title: 'Bad Schemes', value: '157', change: '+0.9%', icon: '❌' }
  ];

  const recentActivities = useMemo(() => ([
    { type: 'Fund Disbursement', description: '₦50M disbursed for Q4 2024', time: '2 hours ago', status: 'completed' },
    { type: 'Scheme', description: '₦25M scheme request from Anchor Co.', time: '3 days ago', status: 'under-review' },
    { type: 'Fund Disbursement', description: '₦120M released for Climate Smart Agriculture', time: '5 hours ago', status: 'completed' },
    { type: 'Scheme', description: '₦8M scheme application from Women Farmers Assoc.', time: '8 hours ago', status: 'pending' },
    { type: 'Report', description: 'Monthly performance report generated (October)', time: '1 day ago', status: 'completed' },
    { type: 'Review', description: 'Scheduled performance review meeting (next Friday)', time: '1 day ago', status: 'scheduled' },
    { type: 'Payout', description: '₦12M payout processed for approved scheme tranche', time: '2 days ago', status: 'completed' },
    { type: 'Scheme', description: '₦3.5M scheme request from Youth Agri Group', time: '2 days ago', status: 'under-review' },
    { type: 'Fund Disbursement', description: '₦200M allocated to Tech Innovation Fund', time: '2 days ago', status: 'completed' },
    { type: 'Alert', description: 'Utilization threshold reached on Youth Agriculture Fund', time: '3 days ago', status: 'attention' },
    { type: 'Scheme', description: '₦1.2M scheme adjustment request received', time: '3 days ago', status: 'pending' },
    { type: 'Report', description: 'Quarterly impact assessment initiated', time: '4 days ago', status: 'in-progress' },
    { type: 'Fund Disbursement', description: '₦75M disbursed to Agro Processing Initiative', time: '4 days ago', status: 'completed' },
    { type: 'Scheme', description: '₦9.8M scheme request from Cassava Growers Union', time: '5 days ago', status: 'under-review' },
    { type: 'Compliance', description: 'Random audit scheduled for 3 schemes', time: '5 days ago', status: 'scheduled' },
    { type: 'Payout', description: '₦6.4M tranche released to Women Farmer Fund', time: '6 days ago', status: 'completed' },
    { type: 'Alert', description: 'Bad scheme risk flagged for 2 projects', time: '6 days ago', status: 'attention' },
    { type: 'Report', description: 'Weekly summary dispatched to stakeholders', time: '7 days ago', status: 'completed' },
    { type: 'Scheme', description: '₦4.2M scheme request from Rice Cooperative', time: '7 days ago', status: 'pending' },
    { type: 'Fund Disbursement', description: '₦30M disbursed to Agri-Tech Pilot Program', time: '1 week ago', status: 'completed' }
  ]), []);

  // Recent activities search and pagination
  const [activitySearch, setActivitySearch] = useState('');
  const [activityPage, setActivityPage] = useState(1);
  const activityPageSize = 3;

  const filteredActivities = useMemo(() => {
    const q = activitySearch.trim().toLowerCase();
    if (!q) return recentActivities;
    return recentActivities.filter(a =>
      a.type.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.time.toLowerCase().includes(q)
    );
  }, [activitySearch, recentActivities]);

  const totalActivityPages = Math.max(1, Math.ceil(filteredActivities.length / activityPageSize));
  const currentActivityPage = Math.min(activityPage, totalActivityPages);
  const startIndex = (currentActivityPage - 1) * activityPageSize;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + activityPageSize);

  return (
    <PortalLayout role="Fund Provider" roleIcon="₦" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Welcome to Fund Provider Portal</h1>
          <p className="text-gray-200 font-serif">
            Manage agricultural financing and track fund deployment across Nigeria's agricultural sector.
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <h3 className="text-lg font-semibold font-sans text-gray-100">Active Schemes</h3>
              <div className="relative w-full sm:w-auto">
                <input
                  value={activitySearch}
                  onChange={(e) => { setActivityPage(1); setActivitySearch(e.target.value); }}
                  placeholder="Search schemes..."
                  className="w-full sm:w-64 px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  🔍
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {paginatedActivities.map((activity, index) => (
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
              {paginatedActivities.length === 0 && (
                <div className="text-sm text-gray-400 font-serif">No activities found.</div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center mt-4 gap-3">
              <button
                onClick={() => setActivityPage(p => Math.max(1, p - 1))}
                className="px-3 py-2 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md border border-primary-600"
                aria-label="Previous page"
              >
                ←
              </button>
              <div className="text-sm text-gray-300 font-sans">
                Page <span className="font-semibold">{currentActivityPage}</span> of <span className="font-semibold">{totalActivityPages}</span>
              </div>
              <button
                onClick={() => setActivityPage(p => Math.min(totalActivityPages, p + 1))}
                className="px-3 py-2 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md border border-primary-600"
                aria-label="Next page"
              >
                →
              </button>
            </div>
          </div>
          {/* Removed PFI Partners performance card */}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="btn-primary">
              📊 Generate Reports
            </button>
            <button className="btn-secondary">
              ₦ Deploy New Schemes
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

export default FundProviderPortal;
