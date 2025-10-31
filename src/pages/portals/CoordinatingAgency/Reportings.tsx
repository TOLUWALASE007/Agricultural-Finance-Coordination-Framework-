import React, { useState, useMemo, useEffect } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport } from '../../../utils/quickActions';

const Reportings: React.FC = () => {
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
    { title: 'Total Reports', value: '156', change: '+12', icon: '📑' },
    { title: 'This Month', value: '23', change: '+5', icon: '📅' },
    { title: 'Pending Review', value: '8', change: '-2', icon: '⏳' },
    { title: 'Compliance Score', value: '94%', change: '+2%', icon: '✅' }
  ];

  // Reports data
  const reports = [
    {
      id: 'RPT-2024-001',
      title: 'Q1 2024 National Agricultural Finance Performance Report',
      type: 'Quarterly',
      category: 'Performance',
      generatedBy: 'Central Monitoring Team',
      date: '2024-10-15',
      status: 'Published',
      downloads: 1250,
      size: '2.3 MB'
    },
    {
      id: 'RPT-2024-002',
      title: 'September 2024 Fund Deployment & Recovery Analysis',
      type: 'Monthly',
      category: 'Financial',
      generatedBy: 'Finance Division',
      date: '2024-10-10',
      status: 'Published',
      downloads: 890,
      size: '1.8 MB'
    },
    {
      id: 'RPT-2024-003',
      title: 'Rice Value Chain Impact Assessment Report',
      type: 'Special',
      category: 'Impact Assessment',
      generatedBy: 'Research Unit',
      date: '2024-10-08',
      status: 'Published',
      downloads: 650,
      size: '3.1 MB'
    },
    {
      id: 'RPT-2024-004',
      title: 'Stakeholder Compliance Audit - October 2024',
      type: 'Monthly',
      category: 'Compliance',
      generatedBy: 'Compliance Team',
      date: '2024-10-05',
      status: 'Under Review',
      downloads: 0,
      size: '1.5 MB'
    },
    {
      id: 'RPT-2024-005',
      title: 'Northern States Agricultural Finance Progress',
      type: 'Regional',
      category: 'Regional',
      generatedBy: 'State Monitoring Team',
      date: '2024-10-01',
      status: 'Published',
      downloads: 420,
      size: '2.7 MB'
    },
    {
      id: 'RPT-2024-006',
      title: 'Youth Agripreneur Program Evaluation',
      type: 'Special',
      category: 'Program Evaluation',
      generatedBy: 'Program Management',
      date: '2024-09-28',
      status: 'Published',
      downloads: 780,
      size: '2.0 MB'
    },
    {
      id: 'RPT-2024-007',
      title: 'Anchor Borrowers Program Mid-Year Review',
      type: 'Special',
      category: 'Performance',
      generatedBy: 'Central Monitoring Team',
      date: '2024-09-20',
      status: 'Published',
      downloads: 1100,
      size: '3.5 MB'
    },
    {
      id: 'RPT-2024-008',
      title: 'Insurance Penetration & Claims Analysis - Q3',
      type: 'Quarterly',
      category: 'Insurance',
      generatedBy: 'Insurance Desk',
      date: '2024-09-15',
      status: 'Published',
      downloads: 540,
      size: '1.9 MB'
    },
    {
      id: 'RPT-2024-009',
      title: 'PFI Performance Scorecard - September 2024',
      type: 'Monthly',
      category: 'Performance',
      generatedBy: 'PFI Coordination Unit',
      date: '2024-09-10',
      status: 'Published',
      downloads: 920,
      size: '2.2 MB'
    },
    {
      id: 'RPT-2024-010',
      title: 'Smallholder Farmer Beneficiary Impact Study',
      type: 'Special',
      category: 'Impact Assessment',
      generatedBy: 'Research Unit',
      date: '2024-09-05',
      status: 'Published',
      downloads: 1350,
      size: '4.1 MB'
    },
    {
      id: 'RPT-2024-011',
      title: 'August 2024 Recovery Performance Dashboard',
      type: 'Monthly',
      category: 'Financial',
      generatedBy: 'Finance Division',
      date: '2024-08-30',
      status: 'Published',
      downloads: 670,
      size: '1.6 MB'
    },
    {
      id: 'RPT-2024-012',
      title: 'State-Level Fund Utilization Comparative Analysis',
      type: 'Special',
      category: 'Regional',
      generatedBy: 'State Monitoring Team',
      date: '2024-08-25',
      status: 'Published',
      downloads: 810,
      size: '2.9 MB'
    }
  ];

  // State management
  const [reportSearch, setReportSearch] = useState('');
  const [reportPage, setReportPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [forwardOpen, setForwardOpen] = useState(false);
  const [forwardTargets, setForwardTargets] = useState('');
  const reportPageSize = 6;

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = 
        report.title.toLowerCase().includes(reportSearch.toLowerCase()) ||
        report.id.toLowerCase().includes(reportSearch.toLowerCase()) ||
        report.generatedBy.toLowerCase().includes(reportSearch.toLowerCase());
      const matchesType = typeFilter === 'All' || report.type === typeFilter;
      const matchesCategory = categoryFilter === 'All' || report.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
      return matchesSearch && matchesType && matchesCategory && matchesStatus;
    });
  }, [reportSearch, typeFilter, categoryFilter, statusFilter]);

  const paginatedReports = useMemo(() => {
    const start = (reportPage - 1) * reportPageSize;
    return filteredReports.slice(start, start + reportPageSize);
  }, [filteredReports, reportPage]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / reportPageSize));

  useEffect(() => { setReportPage(1); }, [reportSearch, typeFilter, categoryFilter, statusFilter]);

  const isAllOnPageSelected = paginatedReports.length > 0 && paginatedReports.every(r => selectedReports.includes(r.id));

  const toggleSelectAllOnPage = () => {
    if (isAllOnPageSelected) {
      setSelectedReports(prev => prev.filter(id => !paginatedReports.some(r => r.id === id)));
    } else {
      const idsToAdd = paginatedReports.map(r => r.id).filter(id => !selectedReports.includes(id));
      setSelectedReports(prev => [...prev, ...idsToAdd]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedReports(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleDownloadOne = (report: any) => {
    generateReport(report.title, 'PDF');
  };

  const handleDownloadSelected = () => {
    const items = reports.filter(r => selectedReports.includes(r.id));
    items.forEach(item => generateReport(item.title, 'PDF'));
  };

  const openForwardModal = () => setForwardOpen(true);
  const closeForwardModal = () => { setForwardOpen(false); setForwardTargets(''); };
  const handleForwardSend = () => {
    alert(`Forwarded ${selectedReports.length} report(s) to: ${forwardTargets || 'recipients'}`);
    closeForwardModal();
  };

  return (
    <PortalLayout role="Coordinating Agency (Super Admin)" roleIcon="🏛️" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Reports & Documentation</h1>
          <p className="text-gray-200 font-serif">
            Access comprehensive reports, analytics, and documentation for all agricultural finance programs and stakeholder activities.
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

        {/* Report Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card hover:border-accent-500 transition-colors cursor-pointer">
            <div className="text-center">
              <div className="text-3xl mb-2">📅</div>
              <p className="text-sm font-semibold text-gray-100">Monthly Reports</p>
              <p className="text-xs text-gray-400 mt-1">35 reports</p>
            </div>
          </div>
          <div className="card hover:border-accent-500 transition-colors cursor-pointer">
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-sm font-semibold text-gray-100">Quarterly Reports</p>
              <p className="text-xs text-gray-400 mt-1">12 reports</p>
            </div>
          </div>
          <div className="card hover:border-accent-500 transition-colors cursor-pointer">
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-sm font-semibold text-gray-100">Special Reports</p>
              <p className="text-xs text-gray-400 mt-1">28 reports</p>
            </div>
          </div>
          <div className="card hover:border-accent-500 transition-colors cursor-pointer">
            <div className="text-center">
              <div className="text-3xl mb-2">🗺️</div>
              <p className="text-sm font-semibold text-gray-100">Regional Reports</p>
              <p className="text-xs text-gray-400 mt-1">18 reports</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <select 
                value={typeFilter} 
                onChange={(e) => { setTypeFilter(e.target.value); setReportPage(1); }}
                className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="All">All Types</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Special">Special</option>
                <option value="Regional">Regional</option>
              </select>
              <select 
                value={categoryFilter} 
                onChange={(e) => { setCategoryFilter(e.target.value); setReportPage(1); }}
                className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="All">All Categories</option>
                <option value="Performance">Performance</option>
                <option value="Financial">Financial</option>
                <option value="Compliance">Compliance</option>
                <option value="Impact Assessment">Impact Assessment</option>
                <option value="Regional">Regional</option>
              </select>
              <select 
                value={statusFilter} 
                onChange={(e) => { setStatusFilter(e.target.value); setReportPage(1); }}
                className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="All">All Status</option>
                <option value="Published">Published</option>
                <option value="Under Review">Under Review</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
            <div className="relative w-full sm:w-auto">
              <input
                value={reportSearch}
                onChange={(e) => { setReportPage(1); setReportSearch(e.target.value); }}
                placeholder="Search reports..."
                className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                🔍
              </button>
            </div>
          </div>

          {/* Bulk Action Buttons */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={openForwardModal}
              disabled={selectedReports.length === 0}
              className="px-3 py-2 bg-primary-700 text-gray-200 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              ➡️ Forward Selected ({selectedReports.length})
            </button>
            <button
              onClick={handleDownloadSelected}
              disabled={selectedReports.length === 0}
              className="px-3 py-2 bg-primary-700 text-gray-200 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              ⬇️ Download Selected ({selectedReports.length})
            </button>
          </div>

          {/* Reports Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-primary-700">
              <thead>
                <tr className="text-left text-gray-300">
                  <th className="px-4 py-2 w-10">
                    <input type="checkbox" checked={isAllOnPageSelected} onChange={toggleSelectAllOnPage} />
                  </th>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Generated By</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-700">
                {paginatedReports.map((report) => (
                  <tr key={report.id} className="text-gray-100">
                    <td className="px-4 py-2">
                      <input type="checkbox" checked={selectedReports.includes(report.id)} onChange={() => toggleSelect(report.id)} />
                    </td>
                    <td className="px-4 py-2 font-mono text-sm">{report.id}</td>
                    <td className="px-4 py-2">{report.title}</td>
                    <td className="px-4 py-2">{report.type}</td>
                    <td className="px-4 py-2">{report.category}</td>
                    <td className="px-4 py-2">{report.generatedBy}</td>
                    <td className="px-4 py-2">{new Date(report.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button onClick={() => handleDownloadOne(report)} className="px-3 py-1 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md text-sm">⬇️ Download</button>
                        <button onClick={() => { setSelectedReports(prev => prev.includes(report.id) ? prev : [...prev, report.id]); openForwardModal(); }} className="px-3 py-1 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md text-sm">➡️ Forward</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
            <p className="text-gray-400 text-xs sm:text-sm">
              {filteredReports.length === 0 ? 'No items' : `Showing ${((reportPage - 1) * reportPageSize) + 1} to ${Math.min(reportPage * reportPageSize, filteredReports.length)} of ${filteredReports.length} reports`}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setReportPage(Math.max(reportPage - 1, 1))} 
                disabled={reportPage === 1}
                className="px-3 py-2 bg-primary-700 text-gray-300 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                ← Previous
              </button>
              <span className="px-3 py-2 bg-accent-600 text-white rounded-md text-sm">{reportPage} of {totalPages}</span>
              <button 
                onClick={() => setReportPage(Math.min(reportPage + 1, totalPages))} 
                disabled={reportPage === totalPages}
                className="px-3 py-2 bg-primary-700 text-gray-300 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Generate New Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => generateReport('Monthly Performance Report', 'PDF')}
            >
              📅 Monthly Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => generateReport('Quarterly Analysis Report', 'PDF')}
            >
              📊 Quarterly Report
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Custom Report', 'PDF')}
            >
              🎯 Custom Report
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Compliance Audit', 'PDF')}
            >
              ✅ Compliance Audit
            </button>
          </div>
        </div>

        {/* Most Downloaded Reports */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Most Downloaded Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reports
              .sort((a, b) => b.downloads - a.downloads)
              .slice(0, 3)
              .map((report, index) => (
                <div key={index} className="p-4 bg-primary-700 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="text-2xl">🏆</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-100 line-clamp-2">{report.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{report.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-primary-600">
                    <span className="text-xs text-accent-400 font-semibold">
                      ⬇️ {report.downloads} downloads
                    </span>
                    <button className="text-xs text-accent-400 hover:text-accent-300 font-medium">
                      Download →
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Powered by */}
        <div className="mt-2 text-center text-xs text-gray-400 font-serif opacity-80">
          Powered by Mc. George
        </div>
      </div>

      {/* Forward Modal */}
      {forwardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg bg-primary-800 border border-primary-700 rounded-lg shadow-xl">
            <div className="px-4 py-3 border-b border-primary-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white font-sans">Forward Reports</h3>
              <button onClick={closeForwardModal} className="text-gray-400 hover:text-gray-200">✖</button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Recipients (Email addresses, comma-separated)</label>
                <textarea
                  value={forwardTargets}
                  onChange={(e) => setForwardTargets(e.target.value)}
                  rows={4}
                  placeholder="Enter email addresses separated by commas..."
                  className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>
              <div className="text-sm text-gray-400">
                Forwarding <span className="font-semibold text-gray-300">{selectedReports.length}</span> report(s)
              </div>
            </div>
            <div className="px-4 py-3 border-t border-primary-700 flex flex-col sm:flex-row gap-3 justify-end">
              <button onClick={closeForwardModal} className="btn-secondary">Cancel</button>
              <button onClick={handleForwardSend} className="px-4 py-2 rounded-md bg-accent-600 hover:bg-accent-500 text-white font-sans">Send</button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};

export default Reportings;

