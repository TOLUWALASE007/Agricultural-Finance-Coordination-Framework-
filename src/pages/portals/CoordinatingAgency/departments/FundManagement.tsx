import React, { useState, useMemo } from 'react';
import PortalLayout from '../../../../components/PortalLayout';

const FundManagement: React.FC = () => {
  const sidebarItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: '🏠', 
      href: '/portal/coordinating-agency',
      hasDropdown: true,
      dropdownItems: [
        { id: 'activities', name: 'Activities', icon: '⚡', href: '/portal/coordinating-agency/activities' },
        { id: 'fund-schemes', name: 'Fund Schemes', icon: '💼', href: '/portal/coordinating-agency/fund-schemes' },
        { id: 'reportings', name: 'Reports', icon: '📑', href: '/portal/coordinating-agency/reportings' },
        { id: 'trainings', name: 'Trainings', icon: '📚', href: '/portal/coordinating-agency/trainings' }
      ]
    },
    { 
      id: 'stakeholders', 
      name: 'Stakeholders', 
      icon: '🤝', 
      href: '/portal/coordinating-agency/stakeholders',
      hasDropdown: true,
      dropdownItems: [
        { id: 'fund-management', name: 'Fund Management Department', icon: '💼', href: '/portal/coordinating-agency/stakeholders/fund-management' },
        { id: 'credit-risk', name: 'Agricultural Credit Risk Management Department', icon: '📊', href: '/portal/coordinating-agency/stakeholders/credit-risk' },
        { id: 'insurance', name: 'Agricultural Insurance Management Department', icon: '🛡️', href: '/portal/coordinating-agency/stakeholders/insurance' },
        { id: 'finance', name: 'Finance and Accounting Department', icon: '🪙', href: '/portal/coordinating-agency/stakeholders/finance' },
        { id: 'legal', name: 'Legal Department', icon: '⚖️', href: '/portal/coordinating-agency/stakeholders/legal' },
        { id: 'it', name: 'IT Department', icon: '💻', href: '/portal/coordinating-agency/stakeholders/it' },
        { id: 'training', name: 'Training Department', icon: '📚', href: '/portal/coordinating-agency/stakeholders/training' },
        { 
          id: 'monitoring-dept', 
          name: 'Monitoring Department', 
          icon: '📈', 
          href: '/portal/coordinating-agency/stakeholders/monitoring',
          hasDropdown: true,
          dropdownItems: [
            { id: 'central-monitoring', name: 'Central Monitoring Department', icon: '🏛️', href: '/portal/coordinating-agency/monitoring/central' },
            { id: 'state-monitoring', name: 'State Monitoring Department', icon: '🗺️', href: '/portal/coordinating-agency/monitoring/state' },
            { id: 'local-monitoring', name: 'Local Monitoring Department', icon: '🏘️', href: '/portal/coordinating-agency/monitoring/local' },
            { id: 'ward-monitoring', name: 'Ward Monitoring Department', icon: '🏡', href: '/portal/coordinating-agency/monitoring/ward' }
          ]
        }
      ]
    },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/coordinating-agency/settings' }
  ];

  const stats = [
    { title: 'Total Funds Managed', value: '₦45.8B', change: '+₦3.2B', icon: '💼' },
    { title: 'Active Schemes', value: '47', change: '+5', icon: '📋' },
    { title: 'Funds Deployed', value: '₦38.2B', change: '+₦2.8B', icon: '💸' },
    { title: 'Recovery Rate', value: '87.5%', change: '+2.3%', icon: '📈' }
  ];

  // Fund Allocation Data
  const [fundAllocations] = useState([
    { id: 'FA-001', scheme: 'Rice Value Chain Development', amount: '₦5.2B', deployed: '₦4.8B', recovered: '₦3.9B', status: 'Active', state: 'Kano', date: '2024-01-15' },
    { id: 'FA-002', scheme: 'Cassava Processing Initiative', amount: '₦3.8B', deployed: '₦3.5B', recovered: '₦3.1B', status: 'Active', state: 'Lagos', date: '2024-02-10' },
    { id: 'FA-003', scheme: 'Maize Production Expansion', amount: '₦4.5B', deployed: '₦4.2B', recovered: '₦3.7B', status: 'Active', state: 'Kaduna', date: '2024-01-22' },
    { id: 'FA-004', scheme: 'Poultry Farming Support', amount: '₦2.9B', deployed: '₦2.7B', recovered: '₦2.4B', status: 'Active', state: 'Ogun', date: '2024-03-05' },
    { id: 'FA-005', scheme: 'Fish Farming Development', amount: '₦3.2B', deployed: '₦3.0B', recovered: '₦2.6B', status: 'Active', state: 'Delta', date: '2024-02-18' },
    { id: 'FA-006', scheme: 'Cocoa Rehabilitation Program', amount: '₦4.1B', deployed: '₦3.8B', recovered: '₦3.3B', status: 'Active', state: 'Ondo', date: '2024-01-30' },
    { id: 'FA-007', scheme: 'Yam Production Enhancement', amount: '₦2.5B', deployed: '₦2.3B', recovered: '₦2.0B', status: 'Completed', state: 'Benue', date: '2023-11-12' },
    { id: 'FA-008', scheme: 'Palm Oil Processing', amount: '₦3.6B', deployed: '₦3.4B', recovered: '₦2.9B', status: 'Active', state: 'Akwa Ibom', date: '2024-02-25' },
    { id: 'FA-009', scheme: 'Soybean Value Chain', amount: '₦2.8B', deployed: '₦2.6B', recovered: '₦2.2B', status: 'Active', state: 'Niger', date: '2024-03-10' },
    { id: 'FA-010', scheme: 'Tomato Processing Initiative', amount: '₦3.3B', deployed: '₦3.1B', recovered: '₦2.7B', status: 'Active', state: 'Katsina', date: '2024-01-20' }
  ]);

  // Disbursement Schedule
  const [disbursements] = useState([
    { id: 'DB-001', scheme: 'Rice Value Chain Development', tranche: 'Tranche 3', amount: '₦850M', dueDate: '2025-02-15', status: 'Pending' },
    { id: 'DB-002', scheme: 'Cassava Processing Initiative', tranche: 'Tranche 2', amount: '₦620M', dueDate: '2025-02-20', status: 'Approved' },
    { id: 'DB-003', scheme: 'Maize Production Expansion', tranche: 'Tranche 4', amount: '₦720M', dueDate: '2025-02-18', status: 'Pending' },
    { id: 'DB-004', scheme: 'Poultry Farming Support', tranche: 'Tranche 2', amount: '₦480M', dueDate: '2025-02-25', status: 'Processing' },
    { id: 'DB-005', scheme: 'Fish Farming Development', tranche: 'Tranche 3', amount: '₦550M', dueDate: '2025-02-22', status: 'Approved' },
    { id: 'DB-006', scheme: 'Cocoa Rehabilitation Program', tranche: 'Tranche 3', amount: '₦680M', dueDate: '2025-02-28', status: 'Pending' }
  ]);

  // Search and pagination states
  const [allocationSearch, setAllocationSearch] = useState('');
  const [allocationPage, setAllocationPage] = useState(1);
  const [disbursementSearch, setDisbursementSearch] = useState('');
  const [disbursementPage, setDisbursementPage] = useState(1);

  const allocationPageSize = 5;
  const disbursementPageSize = 4;

  // Filtered and paginated allocations
  const filteredAllocations = useMemo(() => {
    return fundAllocations.filter(item =>
      item.scheme.toLowerCase().includes(allocationSearch.toLowerCase()) ||
      item.state.toLowerCase().includes(allocationSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(allocationSearch.toLowerCase())
    );
  }, [allocationSearch, fundAllocations]);

  const paginatedAllocations = useMemo(() => {
    const start = (allocationPage - 1) * allocationPageSize;
    return filteredAllocations.slice(start, start + allocationPageSize);
  }, [filteredAllocations, allocationPage]);

  const allocationTotalPages = Math.ceil(filteredAllocations.length / allocationPageSize);

  // Filtered and paginated disbursements
  const filteredDisbursements = useMemo(() => {
    return disbursements.filter(item =>
      item.scheme.toLowerCase().includes(disbursementSearch.toLowerCase()) ||
      item.tranche.toLowerCase().includes(disbursementSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(disbursementSearch.toLowerCase())
    );
  }, [disbursementSearch, disbursements]);

  const paginatedDisbursements = useMemo(() => {
    const start = (disbursementPage - 1) * disbursementPageSize;
    return filteredDisbursements.slice(start, start + disbursementPageSize);
  }, [filteredDisbursements, disbursementPage]);

  const disbursementTotalPages = Math.ceil(filteredDisbursements.length / disbursementPageSize);

  return (
    <PortalLayout
      role="Coordinating Agency"
      roleIcon="🏛️"
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-sans text-gray-100 mb-2">
            💼 Fund Management Department
          </h1>
          <p className="text-sm sm:text-base text-gray-400 font-serif">
            Oversees fund allocation, disbursement, and recovery across all agricultural finance schemes
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl sm:text-3xl">{stat.icon}</span>
                <span className="text-xs sm:text-sm text-green-400 font-sans">{stat.change}</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold font-sans text-gray-100 mb-1">{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-400 font-serif">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Fund Allocations Card */}
        <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <h3 className="text-lg font-semibold font-sans text-gray-100">Fund Allocations & Recovery</h3>
            <div className="relative w-full sm:w-auto">
              <input
                value={allocationSearch}
                onChange={(e) => { setAllocationPage(1); setAllocationSearch(e.target.value); }}
                placeholder="Search allocations..."
                className="w-full sm:w-64 px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                🔍
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-2 text-xs sm:text-sm font-semibold text-gray-300 font-sans">Scheme ID</th>
                  <th className="text-left py-3 px-2 text-xs sm:text-sm font-semibold text-gray-300 font-sans">Scheme Name</th>
                  <th className="text-left py-3 px-2 text-xs sm:text-sm font-semibold text-gray-300 font-sans">Allocated</th>
                  <th className="text-left py-3 px-2 text-xs sm:text-sm font-semibold text-gray-300 font-sans">Deployed</th>
                  <th className="text-left py-3 px-2 text-xs sm:text-sm font-semibold text-gray-300 font-sans">Recovered</th>
                  <th className="text-left py-3 px-2 text-xs sm:text-sm font-semibold text-gray-300 font-sans">State</th>
                  <th className="text-left py-3 px-2 text-xs sm:text-sm font-semibold text-gray-300 font-sans">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAllocations.map((item) => (
                  <tr key={item.id} className="border-b border-primary-700 hover:bg-primary-700">
                    <td className="py-3 px-2 text-xs sm:text-sm text-gray-300 font-sans">{item.id}</td>
                    <td className="py-3 px-2 text-xs sm:text-sm text-gray-100 font-sans">{item.scheme}</td>
                    <td className="py-3 px-2 text-xs sm:text-sm text-gray-300 font-sans">{item.amount}</td>
                    <td className="py-3 px-2 text-xs sm:text-sm text-gray-300 font-sans">{item.deployed}</td>
                    <td className="py-3 px-2 text-xs sm:text-sm text-green-400 font-sans">{item.recovered}</td>
                    <td className="py-3 px-2 text-xs sm:text-sm text-gray-300 font-sans">{item.state}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {allocationTotalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-4">
              <button 
                onClick={() => setAllocationPage(Math.max(allocationPage - 1, 1))} 
                disabled={allocationPage === 1}
                className="btn-secondary text-sm p-2 disabled:opacity-50"
              >
                ←
              </button>
              <span className="text-sm text-gray-300 font-sans">
                Page {allocationPage} of {allocationTotalPages}
              </span>
              <button 
                onClick={() => setAllocationPage(Math.min(allocationPage + 1, allocationTotalPages))} 
                disabled={allocationPage === allocationTotalPages}
                className="btn-secondary text-sm p-2 disabled:opacity-50"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Disbursement Schedule Card */}
        <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <h3 className="text-lg font-semibold font-sans text-gray-100">Upcoming Disbursements</h3>
            <div className="relative w-full sm:w-auto">
              <input
                value={disbursementSearch}
                onChange={(e) => { setDisbursementPage(1); setDisbursementSearch(e.target.value); }}
                placeholder="Search disbursements..."
                className="w-full sm:w-64 px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                🔍
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {paginatedDisbursements.map((item) => (
              <div key={item.id} className="bg-primary-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-100 font-sans mb-1">{item.scheme}</p>
                  <p className="text-xs text-gray-400 font-serif">{item.tranche} • Due: {item.dueDate}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-accent-400 font-sans">{item.amount}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'Approved' ? 'bg-green-500 text-white' :
                    item.status === 'Processing' ? 'bg-yellow-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {disbursementTotalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-4">
              <button 
                onClick={() => setDisbursementPage(Math.max(disbursementPage - 1, 1))} 
                disabled={disbursementPage === 1}
                className="btn-secondary text-sm p-2 disabled:opacity-50"
              >
                ←
              </button>
              <span className="text-sm text-gray-300 font-sans">
                Page {disbursementPage} of {disbursementTotalPages}
              </span>
              <button 
                onClick={() => setDisbursementPage(Math.min(disbursementPage + 1, disbursementTotalPages))} 
                disabled={disbursementPage === disbursementTotalPages}
                className="btn-secondary text-sm p-2 disabled:opacity-50"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button className="btn-primary text-sm">
              🪙 Allocate New Funds
            </button>
            <button className="btn-secondary text-sm">
              📊 Generate Fund Report
            </button>
            <button className="btn-secondary text-sm">
              📈 View Recovery Analytics
            </button>
            <button className="btn-secondary text-sm">
              📋 Export Fund Data
            </button>
          </div>
        </div>

        {/* Powered by */}
        <div className="mt-6 text-center text-xs text-gray-400 font-serif opacity-80">
          Powered by Mc. George
        </div>
      </div>
    </PortalLayout>
  );
};

export default FundManagement;

