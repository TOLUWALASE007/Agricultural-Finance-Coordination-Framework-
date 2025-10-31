import React, { useMemo, useState, useEffect } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, exportData } from '../../../utils/quickActions';

const Schemes: React.FC = () => {
  // Track screen size for responsive pagination
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/fund-provider' },
    { id: 'funds', name: 'Fund Management', icon: '💼', href: '/portal/fund-provider/funds' },
    { id: 'applications', name: 'Schemes', icon: '📋', href: '/portal/fund-provider/applications' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/fund-provider/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/fund-provider/settings' }
  ];

  const applicationStats = [
    { title: 'Total Applications', value: '1,847', change: '+89', icon: '📋' },
    { title: 'Pending Review', value: '234', change: '-12', icon: '⏳' },
    { title: 'Approved', value: '1,456', change: '+67', icon: '✅' },
    { title: 'Total Amount', value: '₦12.3B', change: '+₦1.2B', icon: '💼' }
  ];

  const recentApplications = [
    { id: 'APP-2024-001', applicant: 'John Doe Farms', amount: '₦2.5M', purpose: 'Maize Farming', pfis: 'First Bank', status: 'Approved', date: '2024-01-15', producer: 'Producer/Farmer', anchor: 'Dangote Farms Ltd', insurance: 'Covered' },
    { id: 'APP-2024-002', applicant: 'Sarah Agricultural Coop', amount: '₦5.2M', purpose: 'Rice Production', pfis: 'Zenith Bank', status: 'Under Review', date: '2024-01-14', producer: 'Cooperative Group', anchor: 'Olam Nigeria', insurance: 'Pending' },
    { id: 'APP-2024-003', applicant: 'Kano Youth Farmers', amount: '₦1.8M', purpose: 'Vegetable Farming', pfis: 'Access Bank', status: 'Approved', date: '2024-01-13', producer: 'Producer/Farmer', anchor: 'Fresh Direct', insurance: 'Covered' },
    { id: 'APP-2024-004', applicant: 'Women Farmers Association', amount: '₦3.7M', purpose: 'Cassava Processing', pfis: 'GTBank', status: 'Pending', date: '2024-01-12', producer: 'Cooperative Group', anchor: 'Flour Mills Nigeria', insurance: 'Under Review' }
  ];

  const applicationByRegion = [
    { region: 'North Central', applications: '456', amount: '₦3.2B', approval: '89%' },
    { region: 'South West', applications: '389', amount: '₦2.8B', approval: '92%' },
    { region: 'North West', applications: '567', amount: '₦4.1B', approval: '87%' },
    { region: 'South East', applications: '234', amount: '₦1.5B', approval: '94%' },
    { region: 'North East', applications: '201', amount: '₦0.7B', approval: '85%' }
  ];

  const applicationByStakeholder = [
    { stakeholder: 'Producer/Farmer', applications: '1,247', amount: '₦8.9B', percentage: '67%' },
    { stakeholder: 'Cooperative Group', applications: '345', amount: '₦2.1B', percentage: '19%' },
    { stakeholder: 'Anchor Companies', applications: '156', amount: '₦1.2B', percentage: '9%' },
    { stakeholder: 'Lead Firms', applications: '99', amount: '₦0.1B', percentage: '5%' }
  ];

  // Pagination + search state (3 per page)
  const [recentSearch, setRecentSearch] = useState('');
  const [recentPage, setRecentPage] = useState(1);
  const recentPageSize = 3;
  const filteredRecent = useMemo(() => {
    const q = recentSearch.trim().toLowerCase();
    if (!q) return recentApplications;
    return recentApplications.filter(a =>
      a.id.toLowerCase().includes(q) ||
      a.applicant.toLowerCase().includes(q) ||
      a.purpose.toLowerCase().includes(q) ||
      a.pfis.toLowerCase().includes(q) ||
      a.status.toLowerCase().includes(q) ||
      a.date.toLowerCase().includes(q)
    );
  }, [recentSearch, recentApplications]);
  const totalRecentPages = Math.max(1, Math.ceil(filteredRecent.length / recentPageSize));
  const currentRecentPage = Math.min(recentPage, totalRecentPages);
  const paginatedRecent = filteredRecent.slice((currentRecentPage - 1) * recentPageSize, (currentRecentPage - 1) * recentPageSize + recentPageSize);

  const [regionSearch, setRegionSearch] = useState('');
  const [regionPage, setRegionPage] = useState(1);
  const regionPageSize = isMobile ? 3 : 6;
  const filteredRegions = useMemo(() => {
    const q = regionSearch.trim().toLowerCase();
    if (!q) return applicationByRegion;
    return applicationByRegion.filter(r =>
      r.region.toLowerCase().includes(q) ||
      r.applications.toLowerCase().includes(q) ||
      r.amount.toLowerCase().includes(q) ||
      r.approval.toLowerCase().includes(q)
    );
  }, [regionSearch, applicationByRegion]);
  const totalRegionPages = Math.max(1, Math.ceil(filteredRegions.length / regionPageSize));
  const currentRegionPage = Math.min(regionPage, totalRegionPages);
  const paginatedRegions = filteredRegions.slice((currentRegionPage - 1) * regionPageSize, (currentRegionPage - 1) * regionPageSize + regionPageSize);

  const [stakeholderSearch, setStakeholderSearch] = useState('');
  const [stakeholderPage, setStakeholderPage] = useState(1);
  const stakeholderPageSize = isMobile ? 3 : 6;
  const filteredStakeholders = useMemo(() => {
    const q = stakeholderSearch.trim().toLowerCase();
    if (!q) return applicationByStakeholder;
    return applicationByStakeholder.filter(s =>
      s.stakeholder.toLowerCase().includes(q) ||
      s.applications.toLowerCase().includes(q) ||
      s.amount.toLowerCase().includes(q) ||
      s.percentage.toLowerCase().includes(q)
    );
  }, [stakeholderSearch, applicationByStakeholder]);
  const totalStakeholderPages = Math.max(1, Math.ceil(filteredStakeholders.length / stakeholderPageSize));
  const currentStakeholderPage = Math.min(stakeholderPage, totalStakeholderPages);
  const paginatedStakeholders = filteredStakeholders.slice((currentStakeholderPage - 1) * stakeholderPageSize, (currentStakeholderPage - 1) * stakeholderPageSize + stakeholderPageSize);

  return (
    <PortalLayout role="Fund Provider" roleIcon="₦" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-6 text-white w-full min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold font-sans mb-2">Schemes Overview</h1>
          <p className="text-gray-200 font-serif text-sm sm:text-base">
            Monitor loan applications across all partners and track the flow of agricultural financing to end beneficiaries.
          </p>
        </div>

        {/* Application Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {applicationStats.map((stat, index) => (
            <div key={index} className="card w-full min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 font-serif">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold font-sans text-gray-100 truncate">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-accent-400 font-serif">{stat.change}</p>
                </div>
                <div className="text-2xl sm:text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Applications */}
        <div className="card w-full min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <h3 className="text-base sm:text-lg font-semibold font-sans text-gray-100">Recent Applications</h3>
            <div className="relative w-full sm:w-auto">
              <input
                value={recentSearch}
                onChange={(e) => { setRecentPage(1); setRecentSearch(e.target.value); }}
                placeholder="Search applications..."
                className="w-full sm:w-64 px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                🔍
              </button>
            </div>
          </div>
          {/* Table view for md+ */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-600">
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Application ID</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Applicant</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Purpose</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">PFI</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Status</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecent.map((app, index) => (
                  <tr key={index} className="border-b border-primary-700">
                    <td className="py-3 px-4 font-medium font-sans text-accent-400">{app.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium font-sans text-gray-100">{app.applicant}</p>
                        <p className="text-xs text-gray-400 font-serif">{app.producer}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold font-sans text-gray-100">{app.amount}</td>
                    <td className="py-3 px-4 text-gray-300 font-serif">{app.purpose}</td>
                    <td className="py-3 px-4 text-gray-300 font-serif">{app.pfis}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === 'Approved' ? 'bg-green-500 text-white' :
                        app.status === 'Under Review' ? 'bg-blue-500 text-white' :
                        'bg-yellow-500 text-white'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300 font-serif">{app.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Card list for small screens */}
          <div className="md:hidden space-y-3">
            {paginatedRecent.map((app, index) => (
              <div key={index} className="p-3 bg-primary-700 rounded-lg">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium font-sans text-gray-100">{app.applicant}</p>
                    <p className="text-xs text-accent-400 font-mono">{app.id}</p>
                    <p className="text-xs text-gray-400 font-serif">{app.producer}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    app.status === 'Approved' ? 'bg-green-500 text-white' :
                    app.status === 'Under Review' ? 'bg-blue-500 text-white' :
                    'bg-yellow-500 text-white'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="text-gray-400">Amount</div>
                  <div className="text-right text-gray-100 font-semibold">{app.amount}</div>
                  <div className="text-gray-400">Purpose</div>
                  <div className="text-right text-gray-100">{app.purpose}</div>
                  <div className="text-gray-400">PFI</div>
                  <div className="text-right text-gray-100">{app.pfis}</div>
                  <div className="text-gray-400">Date</div>
                  <div className="text-right text-gray-100">{app.date}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center mt-4 gap-3">
            <button
              onClick={() => setRecentPage(p => Math.max(1, p - 1))}
              className="px-3 py-2 sm:px-4 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md border border-primary-600"
              aria-label="Previous applications page"
            >
              ←
            </button>
            <div className="text-sm sm:text-base text-gray-300 font-sans">
              Page <span className="font-semibold">{currentRecentPage}</span> of <span className="font-semibold">{totalRecentPages}</span>
            </div>
            <button
              onClick={() => setRecentPage(p => Math.min(totalRecentPages, p + 1))}
              className="px-3 py-2 sm:px-4 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md border border-primary-600"
              aria-label="Next applications page"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Applications by Region */}
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <h3 className="text-base sm:text-lg font-semibold font-sans text-gray-100">Regions</h3>
              <div className="relative w-full sm:w-auto">
                <input
                  value={regionSearch}
                  onChange={(e) => { setRegionPage(1); setRegionSearch(e.target.value); }}
                  placeholder="Search regions..."
                  className="w-full sm:w-64 px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  🔍
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {paginatedRegions.map((region, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-primary-700 rounded-lg gap-2">
                  <div className="min-w-0">
                    <p className="font-medium font-sans text-gray-100">{region.region}</p>
                    <p className="text-sm text-gray-300 font-serif">{region.applications} applications</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-semibold font-sans text-accent-400">{region.amount}</p>
                    <p className="text-xs text-gray-400 font-serif">{region.approval} approval</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center mt-4 gap-3">
              <button
                onClick={() => setRegionPage(p => Math.max(1, p - 1))}
                className="px-3 py-2 sm:px-4 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md border border-primary-600"
                aria-label="Previous regions page"
              >
                ←
              </button>
              <div className="text-sm sm:text-base text-gray-300 font-sans">
                Page <span className="font-semibold">{currentRegionPage}</span> of <span className="font-semibold">{totalRegionPages}</span>
              </div>
              <button
                onClick={() => setRegionPage(p => Math.min(totalRegionPages, p + 1))}
                className="px-3 py-2 sm:px-4 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md border border-primary-600"
                aria-label="Next regions page"
              >
                →
              </button>
            </div>
          </div>

          {/* Applications by Stakeholder Type */}
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <h3 className="text-base sm:text-lg font-semibold font-sans text-gray-100">Stakeholders</h3>
              <div className="relative w-full sm:w-auto">
                <input
                  value={stakeholderSearch}
                  onChange={(e) => { setStakeholderPage(1); setStakeholderSearch(e.target.value); }}
                  placeholder="Search stakeholders..."
                  className="w-full sm:w-72 px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  🔍
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {paginatedStakeholders.map((stakeholder, index) => (
                <div key={index} className="p-3 bg-primary-700 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                    <p className="font-medium font-sans text-gray-100">{stakeholder.stakeholder}</p>
                    <span className="text-sm text-accent-400 font-sans">{stakeholder.percentage}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-2 text-sm">
                    <span className="text-gray-300 font-serif">{stakeholder.applications} applications</span>
                    <span className="text-gray-300 font-serif">{stakeholder.amount}</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-primary-600 rounded-full h-2">
                      <div 
                        className="bg-accent-500 h-2 rounded-full" 
                        style={{ width: stakeholder.percentage }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center mt-4 gap-3">
              <button
                onClick={() => setStakeholderPage(p => Math.max(1, p - 1))}
                className="px-3 py-2 sm:px-4 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md border border-primary-600"
                aria-label="Previous stakeholders page"
              >
                ←
              </button>
              <div className="text-sm sm:text-base text-gray-300 font-sans">
                Page <span className="font-semibold">{currentStakeholderPage}</span> of <span className="font-semibold">{totalStakeholderPages}</span>
              </div>
              <button
                onClick={() => setStakeholderPage(p => Math.min(totalStakeholderPages, p + 1))}
                className="px-3 py-2 sm:px-4 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md border border-primary-600"
                aria-label="Next stakeholders page"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Application Flow Analysis */}
        <div className="card w-full min-w-0">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Application Flow Analysis</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-xl sm:text-2xl mb-2">📝</div>
              <p className="text-xl sm:text-2xl font-bold font-sans text-gray-100">1,847</p>
              <p className="text-sm text-gray-400 font-serif">Applications Received</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-xl sm:text-2xl mb-2">🔍</div>
              <p className="text-xl sm:text-2xl font-bold font-sans text-gray-100">234</p>
              <p className="text-sm text-gray-400 font-serif">Under Review</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-xl sm:text-2xl mb-2">✅</div>
              <p className="text-xl sm:text-2xl font-bold font-sans text-gray-100">1,456</p>
              <p className="text-sm text-gray-400 font-serif">Approved</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-xl sm:text-2xl mb-2">₦</div>
              <p className="text-xl sm:text-2xl font-bold font-sans text-gray-100">1,234</p>
              <p className="text-sm text-gray-400 font-serif">Disbursed</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-xl sm:text-2xl mb-2">❌</div>
              <p className="text-xl sm:text-2xl font-bold font-sans text-gray-100">157</p>
              <p className="text-sm text-gray-400 font-serif">Rejected</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card w-full min-w-0">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary w-full justify-center"
              onClick={() => generateReport('Schemes Analysis', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-secondary w-full justify-center"
              onClick={() => processAction('Application Review')}
            >
              🔍 Review Applications
            </button>
            <button 
              className="btn-secondary w-full justify-center"
              onClick={() => exportData('Application Analytics', 'Excel')}
            >
              📈 Analytics Dashboard
            </button>
            <button 
              className="btn-secondary w-full justify-center"
              onClick={() => processAction('Create Scheme')}
            >
              📝 Create Scheme
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

export default Schemes;


