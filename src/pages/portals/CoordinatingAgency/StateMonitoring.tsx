import React, { useState, useMemo } from 'react';
import PortalLayout from '../../../components/PortalLayout';

const StateMonitoring: React.FC = () => {
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

  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
    "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
    "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
    "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT Abuja"
  ];

  const [stateFilter, setStateFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedTeamName, setSubmittedTeamName] = useState('');
  const [formData, setFormData] = useState({
    teamName: '',
    state: '',
    teamLeadName: '',
    teamLeadEmail: '',
    teamLeadPhone: '',
    officeAddress: '',
    contactPersonName: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
    description: ''
  });
  const itemsPerPage = 5;

  // State Monitoring Reports - Comprehensive Dummy Data
  const monitoringReports = [
    {
      id: '1',
      title: 'Lagos State Agricultural Finance Performance Review',
      state: 'Lagos',
      reportType: 'State Performance',
      date: '2024-01-15',
      status: 'Completed',
      priority: 'High',
      findings: 'Lagos leads in digital adoption with 78% of farmers using mobile banking',
      recommendations: 'Replicate Lagos model in other South-West states',
      assignedTo: 'Mr. Femi Adebayo',
      completionRate: 100,
      lgaCount: 20,
      farmersReached: 45000
    },
    {
      id: '2',
      title: 'Kano State PFI Partnership Assessment',
      state: 'Kano',
      reportType: 'Partnership Review',
      date: '2024-01-12',
      status: 'In Progress',
      priority: 'High',
      findings: 'Strong PFI partnerships with 12 active institutions',
      recommendations: 'Expand partnerships to cover more LGAs',
      assignedTo: 'Dr. Aisha Mohammed',
      completionRate: 80,
      lgaCount: 44,
      farmersReached: 120000
    },
    {
      id: '3',
      title: 'Rivers State Insurance Penetration Study',
      state: 'Rivers',
      reportType: 'Insurance Analysis',
      date: '2024-01-10',
      status: 'Completed',
      priority: 'Medium',
      findings: 'Insurance coverage at 35% among rice farmers',
      recommendations: 'Increase awareness campaigns in rural areas',
      assignedTo: 'Ms. Blessing Okafor',
      completionRate: 100,
      lgaCount: 23,
      farmersReached: 32000
    },
    {
      id: '4',
      title: 'Kaduna State Youth Agricultural Finance Program',
      state: 'Kaduna',
      reportType: 'Youth Program',
      date: '2024-01-08',
      status: 'In Progress',
      priority: 'High',
      findings: 'Youth participation increased to 45% in agricultural finance',
      recommendations: 'Create more youth-friendly financial products',
      assignedTo: 'Mr. Ibrahim Garba',
      completionRate: 70,
      lgaCount: 23,
      farmersReached: 28000
    },
    {
      id: '5',
      title: 'Oyo State Cooperative Society Performance',
      state: 'Oyo',
      reportType: 'Cooperative Analysis',
      date: '2024-01-05',
      status: 'Completed',
      priority: 'Medium',
      findings: 'Cooperative societies performing well with 85% repayment rate',
      recommendations: 'Support expansion of successful cooperatives',
      assignedTo: 'Dr. Tunde Adebayo',
      completionRate: 100,
      lgaCount: 33,
      farmersReached: 55000
    },
    {
      id: '6',
      title: 'Kebbi State Rice Farmers Credit Assessment',
      state: 'Kebbi',
      reportType: 'Crop-Specific Analysis',
      date: '2024-01-03',
      status: 'Pending Review',
      priority: 'High',
      findings: 'Rice farmers need improved access to seasonal credit',
      recommendations: 'Develop rice-specific credit products',
      assignedTo: 'Mr. Usman Garba',
      completionRate: 90,
      lgaCount: 21,
      farmersReached: 38000
    },
    {
      id: '7',
      title: 'Benue State Cassava Value Chain Finance',
      state: 'Benue',
      reportType: 'Value Chain Analysis',
      date: '2023-12-30',
      status: 'Completed',
      priority: 'Medium',
      findings: 'Cassava value chain needs more financing support',
      recommendations: 'Create cassava-specific financial products',
      assignedTo: 'Dr. Peter Okwu',
      completionRate: 100,
      lgaCount: 23,
      farmersReached: 42000
    },
    {
      id: '8',
      title: 'Kwara State Women Agricultural Finance Initiative',
      state: 'Kwara',
      reportType: 'Gender Analysis',
      date: '2023-12-28',
      status: 'In Progress',
      priority: 'High',
      findings: 'Women farmers need better access to credit facilities',
      recommendations: 'Establish women-focused financial products',
      assignedTo: 'Ms. Fatima Usman',
      completionRate: 75,
      lgaCount: 16,
      farmersReached: 25000
    },
    {
      id: '9',
      title: 'Sokoto State Climate-Resilient Finance Program',
      state: 'Sokoto',
      reportType: 'Climate Finance',
      date: '2023-12-25',
      status: 'Completed',
      priority: 'High',
      findings: 'Climate risks affecting 60% of agricultural loans',
      recommendations: 'Implement climate insurance products',
      assignedTo: 'Dr. Amina Hassan',
      completionRate: 100,
      lgaCount: 23,
      farmersReached: 35000
    },
    {
      id: '10',
      title: 'Cross River State Cocoa Farmers Credit Program',
      state: 'Cross River',
      reportType: 'Export Crop Analysis',
      date: '2023-12-22',
      status: 'In Progress',
      priority: 'Medium',
      findings: 'Cocoa farmers need export financing support',
      recommendations: 'Develop export-focused credit products',
      assignedTo: 'Mr. Emmanuel Okon',
      completionRate: 65,
      lgaCount: 18,
      farmersReached: 18000
    },
    {
      id: '11',
      title: 'Plateau State Potato Farmers Financial Inclusion',
      state: 'Plateau',
      reportType: 'Financial Inclusion',
      date: '2023-12-20',
      status: 'Completed',
      priority: 'Medium',
      findings: 'Financial inclusion rate improved to 40% among potato farmers',
      recommendations: 'Expand mobile banking services',
      assignedTo: 'Dr. Sarah Ibrahim',
      completionRate: 100,
      lgaCount: 17,
      farmersReached: 22000
    },
    {
      id: '12',
      title: 'Delta State Oil Palm Farmers Credit Assessment',
      state: 'Delta',
      reportType: 'Oil Palm Analysis',
      date: '2023-12-18',
      status: 'Pending Review',
      priority: 'High',
      findings: 'Oil palm farmers need long-term financing options',
      recommendations: 'Create long-term credit products for oil palm',
      assignedTo: 'Ms. Grace Okonkwo',
      completionRate: 85,
      lgaCount: 25,
      farmersReached: 30000
    }
  ];

  // Filter and paginate reports
  const filteredReports = useMemo(() => {
    return monitoringReports.filter(report => {
      const matchesState = stateFilter === 'All' || report.state === stateFilter;
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.reportType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesState && matchesSearch;
    });
  }, [stateFilter, searchTerm]);

  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredReports.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReports, currentPage]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const handleSelectAll = () => {
    if (selectedReports.length === paginatedReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(paginatedReports.map(report => report.id));
    }
  };

  const handleReportSelect = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleMassAction = (action: string) => {
    if (selectedReports.length === 0) return;
    
    alert(`${action} applied to ${selectedReports.length} selected reports`);
    setSelectedReports([]);
  };

  const stats = [
    { title: 'States Monitored', value: '36', change: '+2', icon: '🗺️' },
    { title: 'Total LGAs Covered', value: monitoringReports.reduce((sum, r) => sum + r.lgaCount, 0).toString(), change: '+15', icon: '🏘️' },
    { title: 'Farmers Reached', value: (monitoringReports.reduce((sum, r) => sum + r.farmersReached, 0) / 1000).toFixed(0) + 'K', change: '+25K', icon: '👥' },
    { title: 'Active Programs', value: monitoringReports.filter(r => r.status === 'In Progress').length.toString(), change: '+3', icon: '🔄' }
  ];

  return (
    <PortalLayout role="State Monitoring Department" roleIcon="🗺️" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-primary-800 rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">State Monitoring Department</h1>
              <p className="text-gray-300">
                State-level monitoring and coordination of agricultural finance programs across all Nigerian states
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                ➕ Create Team
              </button>
              <button className="btn-secondary">
                📊 Generate State Report
              </button>
              <button className="btn-secondary">
                📈 State Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-primary-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-green-400 text-sm mt-1">{stat.change} this month</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* State Monitoring Reports Management */}
        <div className="bg-primary-800 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white">State Monitoring Reports</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={stateFilter}
                onChange={(e) => { setStateFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm sm:text-base"
              >
                <option value="All">All States</option>
                {nigerianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <div className="relative flex-1">
                <input
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  placeholder="Search state reports..."
                  className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm sm:text-base"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  🔍
                </button>
              </div>
            </div>
          </div>

          {/* Mass Actions */}
          {selectedReports.length > 0 && (
            <div className="bg-accent-600 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-white font-medium">
                  {selectedReports.length} report{selectedReports.length > 1 ? 's' : ''} selected
                </p>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => handleMassAction('Approve')}
                    className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                  >
                    ✅ Approve Selected
                  </button>
                  <button 
                    onClick={() => handleMassAction('Export')}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    📤 Export Selected
                  </button>
                  <button 
                    onClick={() => handleMassAction('Forward to Central')}
                    className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
                  >
                    📋 Forward to Central
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reports Table - Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedReports.length === paginatedReports.length && paginatedReports.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-primary-600 bg-primary-700 text-accent-500 focus:ring-accent-500"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Report Title</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">State</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">LGAs</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Farmers</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Assigned To</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReports.map((report) => (
                  <tr key={report.id} className="border-b border-primary-700 hover:bg-primary-700/50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        onChange={() => handleReportSelect(report.id)}
                        className="rounded border-primary-600 bg-primary-700 text-accent-500 focus:ring-accent-500"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-white font-medium">{report.title}</p>
                        <p className="text-gray-400 text-sm">{report.findings}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                        {report.state}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                        {report.reportType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{report.lgaCount}</td>
                    <td className="py-3 px-4 text-gray-300">{(report.farmersReached / 1000).toFixed(0)}K</td>
                    <td className="py-3 px-4 text-gray-300">{report.assignedTo}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                          📥 Download
                        </button>
                        <button className="text-purple-400 hover:text-purple-300 text-sm">
                          📋 Forward
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Reports Cards - Mobile */}
          <div className="lg:hidden space-y-4">
            {paginatedReports.map((report) => (
              <div key={report.id} className="bg-primary-700 rounded-lg p-4 border border-primary-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedReports.includes(report.id)}
                      onChange={() => handleReportSelect(report.id)}
                      className="rounded border-primary-600 bg-primary-700 text-accent-500 focus:ring-accent-500"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-sm sm:text-base">{report.title}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1">{report.findings}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <span className="text-gray-400 text-xs">State</span>
                    <div className="mt-1">
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                        {report.state}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">Type</span>
                    <div className="mt-1">
                      <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                        {report.reportType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <span className="text-gray-400 text-xs">LGAs</span>
                    <p className="text-white text-sm font-medium">{report.lgaCount}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">Farmers</span>
                    <p className="text-white text-sm font-medium">{(report.farmersReached / 1000).toFixed(0)}K</p>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-gray-400 text-xs">Assigned To</span>
                  <p className="text-white text-sm font-medium">{report.assignedTo}</p>
                </div>

                <div className="flex gap-2 pt-2 border-t border-primary-600">
                  <button className="flex-1 text-blue-400 hover:text-blue-300 text-sm py-2 px-3 bg-primary-800 rounded-md hover:bg-primary-700 transition-colors">
                    📥 Download
                  </button>
                  <button className="flex-1 text-purple-400 hover:text-purple-300 text-sm py-2 px-3 bg-primary-800 rounded-md hover:bg-primary-700 transition-colors">
                    📋 Forward
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
              <p className="text-gray-400 text-xs sm:text-sm">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredReports.length)} of {filteredReports.length} reports
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-primary-700 text-gray-300 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  ← Previous
                </button>
                <span className="px-3 py-2 bg-accent-600 text-white rounded-md text-sm">
                  {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-primary-700 text-gray-300 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-primary-800 rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <button className="btn-primary text-sm sm:text-base py-3">
              📊 Generate State Performance Report
            </button>
            <button className="btn-secondary text-sm sm:text-base py-3">
              📈 View State Analytics Dashboard
            </button>
            <button className="btn-secondary text-sm sm:text-base py-3">
              📋 Export All State Reports
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm py-4">
          Powered by Mc. George
        </div>

        {/* Create Team Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowCreateModal(false)}>
            <div className="min-h-screen flex items-center justify-center py-8">
              <div className="w-full max-w-2xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold font-sans text-gray-100">Create State Monitoring Team</h3>
                  <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-200">✖</button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  setSubmittedTeamName(formData.teamName);
                  setShowCreateModal(false);
                  setShowConfirmation(true);
                  // Reset form
                  setFormData({
                    teamName: '',
                    state: '',
                    teamLeadName: '',
                    teamLeadEmail: '',
                    teamLeadPhone: '',
                    officeAddress: '',
                    contactPersonName: '',
                    contactPersonEmail: '',
                    contactPersonPhone: '',
                    description: ''
                  });
                }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 font-serif mb-1">Team Name</label>
                      <input
                        type="text"
                        value={formData.teamName}
                        onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"
                        placeholder="e.g., Lagos State Monitoring Team"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 font-serif mb-1">State</label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"
                      >
                        <option value="">Select State</option>
                        {nigerianStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-primary-800 rounded-md p-4">
                    <h4 className="text-sm font-semibold text-accent-400 font-sans mb-3">Team Lead Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-300 font-serif mb-1">Team Lead Name</label>
                        <input
                          type="text"
                          value={formData.teamLeadName}
                          onChange={(e) => setFormData(prev => ({ ...prev, teamLeadName: e.target.value }))}
                          className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 font-serif mb-1">Team Lead Email</label>
                        <input
                          type="email"
                          value={formData.teamLeadEmail}
                          onChange={(e) => setFormData(prev => ({ ...prev, teamLeadEmail: e.target.value }))}
                          className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-300 font-serif mb-1">Team Lead Phone</label>
                        <input
                          type="tel"
                          value={formData.teamLeadPhone}
                          onChange={(e) => setFormData(prev => ({ ...prev, teamLeadPhone: e.target.value }))}
                          className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"
                          placeholder="+234-XXX-XXX-XXXX"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 font-serif mb-1">Office Address</label>
                    <textarea
                      value={formData.officeAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, officeAddress: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"
                      placeholder="Full office address"
                    />
                  </div>

                  <div className="bg-primary-800 rounded-md p-4">
                    <h4 className="text-sm font-semibold text-accent-400 font-sans mb-3">Contact Person Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-300 font-serif mb-1">Contact Person Name</label>
                        <input
                          type="text"
                          value={formData.contactPersonName}
                          onChange={(e) => setFormData(prev => ({ ...prev, contactPersonName: e.target.value }))}
                          className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 font-serif mb-1">Contact Person Email</label>
                        <input
                          type="email"
                          value={formData.contactPersonEmail}
                          onChange={(e) => setFormData(prev => ({ ...prev, contactPersonEmail: e.target.value }))}
                          className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-300 font-serif mb-1">Contact Person Phone</label>
                        <input
                          type="tel"
                          value={formData.contactPersonPhone}
                          onChange={(e) => setFormData(prev => ({ ...prev, contactPersonPhone: e.target.value }))}
                          className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"
                          placeholder="+234-XXX-XXX-XXXX"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 font-serif mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"
                      placeholder="Brief description of the team's responsibilities and scope (optional)"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-primary-700">
                    <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Final Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowConfirmation(false)}>
            <div className="min-h-screen flex items-center justify-center py-8">
              <div className="w-full max-w-md bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold font-sans text-gray-100">Team Created Successfully</h3>
                  <button onClick={() => setShowConfirmation(false)} className="text-gray-400 hover:text-gray-200">✖</button>
                </div>
                <div className="text-center py-6">
                  <div className="text-5xl mb-4">✅</div>
                  <p className="text-gray-200 mb-2">
                    <span className="font-semibold">{submittedTeamName || 'State Monitoring Team'}</span> has been created successfully.
                  </p>
                  <p className="text-sm text-gray-400">
                    The team is now active and ready to receive assignments.
                  </p>
                </div>
                <div className="flex justify-end mt-4">
                  <button onClick={() => setShowConfirmation(false)} className="btn-primary">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default StateMonitoring;