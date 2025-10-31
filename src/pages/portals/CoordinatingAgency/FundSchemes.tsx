import React, { useState, useMemo } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport } from '../../../utils/quickActions';

const FundSchemes: React.FC = () => {
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
      id: 'state-monitoring', 
      name: 'State Monitoring Team', 
      icon: '🗺️', 
      href: '/portal/coordinating-agency/monitoring/state'
    },
    { 
      id: 'representative-body', 
      name: 'Representative Body', 
      icon: '🏛️', 
      href: '/portal/coordinating-agency/representative',
      hasDropdown: true,
      dropdownItems: [
        { id: 'rep-insurance', name: 'Insurance Companies', icon: '🛡️', href: '/portal/coordinating-agency/representative/insurance-companies' },
        { id: 'rep-extension', name: 'Extension Organizations', icon: '🌿', href: '/portal/coordinating-agency/representative/extension-organizations' },
        { id: 'rep-ngos', name: 'NGOs', icon: '🤝', href: '/portal/coordinating-agency/representative/ngos' }
      ]
    },
    { 
      id: 'applicants', 
      name: 'Applicants', 
      icon: '📝', 
      href: '/portal/coordinating-agency/applicants',
      hasDropdown: true,
      dropdownItems: [
        { id: 'fund-provider', name: 'Fund Provider', icon: '💼', href: '/portal/coordinating-agency/applicants/fund-provider' },
        { id: 'pfis', name: 'PFIs', icon: '🏦', href: '/portal/coordinating-agency/applicants/pfis' },
        { id: 'insurance-companies', name: 'Insurance Companies', icon: '🛡️', href: '/portal/coordinating-agency/applicants/insurance-companies' },
        { 
          id: 'fund-beneficiaries', 
          name: 'Fund Beneficiaries', 
          icon: '👥', 
          href: '/portal/coordinating-agency/fund-beneficiaries',
          hasDropdown: true,
          dropdownItems: [
            { id: 'lead-firms', name: 'Lead Firms', icon: '🏢', href: '/portal/coordinating-agency/fund-beneficiaries/lead-firms' },
            { id: 'anchors', name: 'Anchors', icon: '⚓', href: '/portal/coordinating-agency/fund-beneficiaries/anchors' },
            { id: 'cooperative-groups', name: 'Cooperative Groups', icon: '🤝', href: '/portal/coordinating-agency/fund-beneficiaries/cooperative-groups' },
            { id: 'producers-farmers', name: 'Producers/Farmers', icon: '🌾', href: '/portal/coordinating-agency/fund-beneficiaries/producers-farmers' }
          ]
        }
      ]
    },
    { 
      id: 'stakeholders', 
      name: 'Department', 
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
        { id: 'training', name: 'Training Department', icon: '📚', href: '/portal/coordinating-agency/stakeholders/training' }
      ]
    },
    { id: 'publications', name: 'Publications', icon: '📚', href: '/portal/coordinating-agency/publications' },
    { id: 'blog', name: 'Blog', icon: '📰', href: '/portal/coordinating-agency/blog' },
    { id: 'faqs', name: 'FAQs', icon: '❓', href: '/portal/coordinating-agency/faqs' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/coordinating-agency/settings' }
  ];

  const stats = [
    { title: 'Total Schemes', value: '47', change: '+5', icon: '💵' },
    { title: 'Active Schemes', value: '34', change: '+3', icon: '✅' },
    { title: 'Total Funds', value: '₦125.8B', change: '+₦15.2B', icon: '💼' },
    { title: 'Recovery Rate', value: '89.2%', change: '+3.5%', icon: '📈' }
  ];

  // Fund Schemes data
  const fundSchemes = [
    { 
      id: 'FS001', 
      name: 'Rice Value Chain Financing', 
      fundProvider: 'CBN Agricultural Finance', 
      amount: '₦25.5B', 
      beneficiaries: 12450, 
      status: 'Active',
      state: 'Multi-State',
      startDate: 'Jan 2024',
      recoveryRate: '92%'
    },
    { 
      id: 'FS002', 
      name: 'Cassava Production Support', 
      fundProvider: 'BOA Agric Investment', 
      amount: '₦18.3B', 
      beneficiaries: 8920, 
      status: 'Active',
      state: 'Ogun, Oyo, Ondo',
      startDate: 'Mar 2024',
      recoveryRate: '88%'
    },
    { 
      id: 'FS003', 
      name: 'Maize Farmers Credit Scheme', 
      fundProvider: 'Sterling Bank Agric Fund', 
      amount: '₦12.7B', 
      beneficiaries: 6780, 
      status: 'Active',
      state: 'Kaduna, Kano, Katsina',
      startDate: 'Feb 2024',
      recoveryRate: '85%'
    },
    { 
      id: 'FS004', 
      name: 'Poultry Expansion Program', 
      fundProvider: 'Access Bank Agric', 
      amount: '₦9.8B', 
      beneficiaries: 3450, 
      status: 'Active',
      state: 'Lagos, Ogun',
      startDate: 'Apr 2024',
      recoveryRate: '91%'
    },
    { 
      id: 'FS005', 
      name: 'Tomato Processing Scheme', 
      fundProvider: 'Zenith Bank Agric Finance', 
      amount: '₦8.2B', 
      beneficiaries: 2340, 
      status: 'Active',
      state: 'Kano, Jigawa',
      startDate: 'May 2024',
      recoveryRate: '87%'
    },
    { 
      id: 'FS006', 
      name: 'Cocoa Farmers Support', 
      fundProvider: 'FMARD Special Fund', 
      amount: '₦15.6B', 
      beneficiaries: 5620, 
      status: 'Active',
      state: 'Cross River, Ondo, Ekiti',
      startDate: 'Jan 2024',
      recoveryRate: '94%'
    },
    { 
      id: 'FS007', 
      name: 'Fish Farming Initiative', 
      fundProvider: 'UBA Agric Development', 
      amount: '₦7.4B', 
      beneficiaries: 1890, 
      status: 'Active',
      state: 'Delta, Rivers, Bayelsa',
      startDate: 'Mar 2024',
      recoveryRate: '83%'
    },
    { 
      id: 'FS008', 
      name: 'Sorghum Production Boost', 
      fundProvider: 'First Bank Agric', 
      amount: '₦6.9B', 
      beneficiaries: 4560, 
      status: 'Completed',
      state: 'Borno, Yobe, Adamawa',
      startDate: 'Nov 2023',
      recoveryRate: '79%'
    },
    { 
      id: 'FS009', 
      name: 'Vegetable Farming Credit', 
      fundProvider: 'GTBank Agricultural Fund', 
      amount: '₦5.3B', 
      beneficiaries: 3210, 
      status: 'Active',
      state: 'Plateau, Benue',
      startDate: 'Jun 2024',
      recoveryRate: '90%'
    },
    { 
      id: 'FS010', 
      name: 'Dairy Development Scheme', 
      fundProvider: 'NIRSAL Agric Fund', 
      amount: '₦11.2B', 
      beneficiaries: 2780, 
      status: 'Active',
      state: 'Adamawa, Taraba',
      startDate: 'Feb 2024',
      recoveryRate: '86%'
    },
    { 
      id: 'FS011', 
      name: 'Oil Palm Expansion', 
      fundProvider: 'CBN Anchor Borrowers', 
      amount: '₦13.8B', 
      beneficiaries: 4920, 
      status: 'Active',
      state: 'Edo, Delta, Imo',
      startDate: 'Apr 2024',
      recoveryRate: '88%'
    },
    { 
      id: 'FS012', 
      name: 'Youth Agripreneur Fund', 
      fundProvider: 'BOI Youth Fund', 
      amount: '₦9.1B', 
      beneficiaries: 6340, 
      status: 'Active',
      state: 'Multi-State',
      startDate: 'May 2024',
      recoveryRate: '82%'
    }
  ];

  // State management
  const [schemeSearch, setSchemeSearch] = useState('');
  const [schemePage, setSchemeePage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const schemePageSize = 6;

  // Filtered schemes
  const filteredSchemes = useMemo(() => {
    return fundSchemes.filter(scheme => {
      const matchesSearch = 
        scheme.name.toLowerCase().includes(schemeSearch.toLowerCase()) ||
        scheme.fundProvider.toLowerCase().includes(schemeSearch.toLowerCase()) ||
        scheme.state.toLowerCase().includes(schemeSearch.toLowerCase()) ||
        scheme.id.toLowerCase().includes(schemeSearch.toLowerCase());
      const matchesStatus = statusFilter === 'All' || scheme.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [schemeSearch, statusFilter]);

  const paginatedSchemes = useMemo(() => {
    const start = (schemePage - 1) * schemePageSize;
    return filteredSchemes.slice(start, start + schemePageSize);
  }, [filteredSchemes, schemePage]);

  return (
    <PortalLayout role="Coordinating Agency (Super Admin)" roleIcon="🏛️" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Fund Schemes Management</h1>
          <p className="text-gray-200 font-serif">
            Monitor and manage all agricultural finance schemes across the nation. Track fund deployment, beneficiary reach, and recovery performance.
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

        {/* Filters and Search */}
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <select 
                value={statusFilter} 
                onChange={(e) => { setStatusFilter(e.target.value); setSchemeePage(1); }}
                className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="relative w-full sm:w-auto">
              <input
                value={schemeSearch}
                onChange={(e) => { setSchemeePage(1); setSchemeSearch(e.target.value); }}
                placeholder="Search schemes..."
                className="w-full sm:w-64 px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                🔍
              </button>
            </div>
          </div>

          {/* Schemes Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Scheme ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Scheme Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Fund Provider</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Beneficiaries</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Recovery</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-700">
                {paginatedSchemes.map((scheme, index) => (
                  <tr key={index} className="hover:bg-primary-700 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-300 font-mono">{scheme.id}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-100">{scheme.name}</p>
                        <p className="text-xs text-gray-400">{scheme.state}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">{scheme.fundProvider}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-accent-400">{scheme.amount}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{scheme.beneficiaries.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-medium text-green-400">{scheme.recoveryRate}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        scheme.status === 'Active' ? 'bg-green-500 text-white' :
                        scheme.status === 'Completed' ? 'bg-blue-500 text-white' :
                        'bg-yellow-500 text-white'
                      }`}>
                        {scheme.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-accent-400 hover:text-accent-300 text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredSchemes.length > schemePageSize && (
            <div className="flex items-center justify-center space-x-2 mt-4 pt-4 border-t border-primary-700">
              <button 
                onClick={() => setSchemeePage(Math.max(schemePage - 1, 1))} 
                disabled={schemePage === 1}
                className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              <span className="text-xs text-gray-400">
                Page {schemePage} of {Math.ceil(filteredSchemes.length / schemePageSize)}
              </span>
              <button 
                onClick={() => setSchemeePage(Math.min(schemePage + 1, Math.ceil(filteredSchemes.length / schemePageSize)))} 
                disabled={schemePage >= Math.ceil(filteredSchemes.length / schemePageSize)}
                className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Top Performing Schemes</h3>
            <div className="space-y-3">
              {fundSchemes
                .sort((a, b) => parseFloat(b.recoveryRate) - parseFloat(a.recoveryRate))
                .slice(0, 5)
                .map((scheme, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-100">{scheme.name}</p>
                      <p className="text-xs text-gray-400">{scheme.fundProvider}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-400">{scheme.recoveryRate}</p>
                      <p className="text-xs text-gray-400">Recovery</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Largest Schemes by Amount</h3>
            <div className="space-y-3">
              {fundSchemes
                .sort((a, b) => {
                  const amountA = parseFloat(a.amount.replace(/[₦B,]/g, ''));
                  const amountB = parseFloat(b.amount.replace(/[₦B,]/g, ''));
                  return amountB - amountA;
                })
                .slice(0, 5)
                .map((scheme, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-100">{scheme.name}</p>
                      <p className="text-xs text-gray-400">{scheme.beneficiaries.toLocaleString()} beneficiaries</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-accent-400">{scheme.amount}</p>
                      <p className="text-xs text-gray-400">Deployed</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              className="btn-primary"
              onClick={() => generateReport('Fund Schemes Report', 'PDF')}
            >
              📄 Export Schemes Report
            </button>
            <button className="btn-secondary">
              ➕ Register New Scheme
            </button>
            <button className="btn-secondary">
              📊 View Analytics Dashboard
            </button>
          </div>
        </div>

        {/* Powered by */}
        <div className="mt-2 text-center text-xs text-gray-400 font-serif opacity-80">
          Powered by Mc. George
        </div>
      </div>
    </PortalLayout>
  );
};

export default FundSchemes;

