import React, { useState, useMemo } from 'react';
import PortalLayout from '../../../components/PortalLayout';

const LocalMonitoring: React.FC = () => {
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
        { id: 'training', name: 'Training Department', icon: '📚', href: '/portal/coordinating-agency/stakeholders/training' },
        { 
          id: 'monitoring-dept', 
          name: 'Monitoring Department', 
          icon: '📈', 
          href: '/portal/coordinating-agency/stakeholders/monitoring',
          hasDropdown: true,
          dropdownItems: [
            { id: 'central-monitoring', name: 'Central Monitoring Department', icon: '🏛️', href: '/portal/coordinating-agency/monitoring/central' },
            { id: 'local-monitoring', name: 'Local Monitoring Department', icon: '🏘️', href: '/portal/coordinating-agency/monitoring/local' },
            { id: 'ward-monitoring', name: 'Ward Monitoring Department', icon: '🏡', href: '/portal/coordinating-agency/monitoring/ward' }
          ]
        }
      ]
    },
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
  const itemsPerPage = 5;

  // Local Monitoring Reports - Comprehensive Dummy Data
  const monitoringReports = [
    {
      id: '1',
      title: 'Ikeja LGA Agricultural Credit Distribution Assessment',
      state: 'Lagos',
      lga: 'Ikeja',
      reportType: 'Credit Distribution',
      date: '2024-01-15',
      status: 'Completed',
      priority: 'High',
      findings: 'Credit distribution efficiency at 92% with strong farmer satisfaction',
      recommendations: 'Expand credit programs to cover more farming communities',
      assignedTo: 'Mr. Adebayo Johnson',
      completionRate: 100,
      farmersReached: 2500,
      creditDisbursed: '₦45M'
    },
    {
      id: '2',
      title: 'Kano Municipal Cooperative Society Performance Review',
      state: 'Kano',
      lga: 'Kano Municipal',
      reportType: 'Cooperative Review',
      date: '2024-01-12',
      status: 'In Progress',
      priority: 'High',
      findings: 'Cooperative performance improved with 88% repayment rate',
      recommendations: 'Support formation of new cooperatives in underserved areas',
      assignedTo: 'Dr. Aisha Mohammed',
      completionRate: 75,
      farmersReached: 3200,
      creditDisbursed: '₦62M'
    },
    {
      id: '3',
      title: 'Port Harcourt LGA Insurance Coverage Assessment',
      state: 'Rivers',
      lga: 'Port Harcourt',
      reportType: 'Insurance Coverage',
      date: '2024-01-10',
      status: 'Completed',
      priority: 'Medium',
      findings: 'Insurance coverage increased to 28% among local farmers',
      recommendations: 'Increase awareness campaigns in rural communities',
      assignedTo: 'Ms. Blessing Okafor',
      completionRate: 100,
      farmersReached: 1800,
      creditDisbursed: '₦32M'
    },
    {
      id: '4',
      title: 'Kaduna North Youth Agricultural Program Evaluation',
      state: 'Kaduna',
      lga: 'Kaduna North',
      reportType: 'Youth Program',
      date: '2024-01-08',
      status: 'In Progress',
      priority: 'High',
      findings: 'Youth participation in agriculture increased by 35%',
      recommendations: 'Create more youth-focused agricultural programs',
      assignedTo: 'Mr. Ibrahim Garba',
      completionRate: 80,
      farmersReached: 1200,
      creditDisbursed: '₦28M'
    },
    {
      id: '5',
      title: 'Ibadan North LGA Extension Services Impact Study',
      state: 'Oyo',
      lga: 'Ibadan North',
      reportType: 'Extension Services',
      date: '2024-01-05',
      status: 'Completed',
      priority: 'Medium',
      findings: 'Extension services led to 25% increase in crop yields',
      recommendations: 'Expand extension services to more farming communities',
      assignedTo: 'Dr. Tunde Adebayo',
      completionRate: 100,
      farmersReached: 2800,
      creditDisbursed: '₦55M'
    },
    {
      id: '6',
      title: 'Birnin Kebbi LGA Rice Farmers Credit Assessment',
      state: 'Kebbi',
      lga: 'Birnin Kebbi',
      reportType: 'Crop-Specific Credit',
      date: '2024-01-03',
      status: 'Pending Review',
      priority: 'High',
      findings: 'Rice farmers need improved access to seasonal credit',
      recommendations: 'Develop rice-specific credit products for local farmers',
      assignedTo: 'Mr. Usman Garba',
      completionRate: 90,
      farmersReached: 2100,
      creditDisbursed: '₦38M'
    },
    {
      id: '7',
      title: 'Makurdi LGA Cassava Processing Finance Program',
      state: 'Benue',
      lga: 'Makurdi',
      reportType: 'Processing Finance',
      date: '2023-12-30',
      status: 'Completed',
      priority: 'Medium',
      findings: 'Cassava processing facilities need more financing support',
      recommendations: 'Support establishment of more processing centers',
      assignedTo: 'Dr. Peter Okwu',
      completionRate: 100,
      farmersReached: 1900,
      creditDisbursed: '₦42M'
    },
    {
      id: '8',
      title: 'Ilorin East Women Agricultural Finance Initiative',
      state: 'Kwara',
      lga: 'Ilorin East',
      reportType: 'Women Finance',
      date: '2023-12-28',
      status: 'In Progress',
      priority: 'High',
      findings: 'Women farmers need better access to credit facilities',
      recommendations: 'Establish women-focused financial products',
      assignedTo: 'Ms. Fatima Usman',
      completionRate: 70,
      farmersReached: 1500,
      creditDisbursed: '₦35M'
    },
    {
      id: '9',
      title: 'Sokoto North Climate-Resilient Agriculture Program',
      state: 'Sokoto',
      lga: 'Sokoto North',
      reportType: 'Climate Resilience',
      date: '2023-12-25',
      status: 'Completed',
      priority: 'High',
      findings: 'Climate risks affecting 55% of agricultural loans',
      recommendations: 'Implement climate insurance products for local farmers',
      assignedTo: 'Dr. Amina Hassan',
      completionRate: 100,
      farmersReached: 2200,
      creditDisbursed: '₦48M'
    },
    {
      id: '10',
      title: 'Calabar Municipal Cocoa Farmers Credit Program',
      state: 'Cross River',
      lga: 'Calabar Municipal',
      reportType: 'Export Crop Finance',
      date: '2023-12-22',
      status: 'In Progress',
      priority: 'Medium',
      findings: 'Cocoa farmers need export financing support',
      recommendations: 'Develop export-focused credit products',
      assignedTo: 'Mr. Emmanuel Okon',
      completionRate: 65,
      farmersReached: 1100,
      creditDisbursed: '₦25M'
    },
    {
      id: '11',
      title: 'Jos North Potato Farmers Financial Inclusion',
      state: 'Plateau',
      lga: 'Jos North',
      reportType: 'Financial Inclusion',
      date: '2023-12-20',
      status: 'Completed',
      priority: 'Medium',
      findings: 'Financial inclusion rate improved to 38% among potato farmers',
      recommendations: 'Expand mobile banking services in rural areas',
      assignedTo: 'Dr. Sarah Ibrahim',
      completionRate: 100,
      farmersReached: 1600,
      creditDisbursed: '₦30M'
    },
    {
      id: '12',
      title: 'Warri South Oil Palm Farmers Credit Assessment',
      state: 'Delta',
      lga: 'Warri South',
      reportType: 'Oil Palm Finance',
      date: '2023-12-18',
      status: 'Pending Review',
      priority: 'High',
      findings: 'Oil palm farmers need long-term financing options',
      recommendations: 'Create long-term credit products for oil palm cultivation',
      assignedTo: 'Ms. Grace Okonkwo',
      completionRate: 85,
      farmersReached: 2000,
      creditDisbursed: '₦52M'
    }
  ];

  // Filter and paginate reports
  const filteredReports = useMemo(() => {
    return monitoringReports.filter(report => {
      const matchesState = stateFilter === 'All' || report.state === stateFilter;
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.reportType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.lga.toLowerCase().includes(searchTerm.toLowerCase());
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
    { title: 'LGAs Monitored', value: monitoringReports.length.toString(), change: '+5', icon: '🏘️' },
    { title: 'Total Farmers Reached', value: (monitoringReports.reduce((sum, r) => sum + r.farmersReached, 0) / 1000).toFixed(0) + 'K', change: '+8K', icon: '👥' },
    { title: 'Credit Disbursed', value: '₦' + (monitoringReports.reduce((sum, r) => sum + parseInt(r.creditDisbursed.replace('₦', '').replace('M', '')), 0)) + 'M', change: '+₦120M', icon: '💼' },
    { title: 'Active Programs', value: monitoringReports.filter(r => r.status === 'In Progress').length.toString(), change: '+2', icon: '🔄' }
  ];

  return (
    <PortalLayout role="Local Monitoring Department" roleIcon="🏘️" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-primary-800 rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Local Monitoring Department</h1>
              <p className="text-gray-300">
                Local Government Area (LGA) level monitoring and implementation of agricultural finance programs
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="btn-primary">
                📊 Generate LGA Report
              </button>
              <button className="btn-secondary">
                📈 LGA Analytics
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

        {/* Local Monitoring Reports Management */}
        <div className="bg-primary-800 rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-white">Local Monitoring Reports</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={stateFilter}
                onChange={(e) => { setStateFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
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
                  placeholder="Search LGA reports..."
                  className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
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
                    onClick={() => handleMassAction('Forward to State')}
                    className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
                  >
                    📋 Forward to State
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reports Table */}
          <div className="overflow-x-auto">
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
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">State/LGA</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Farmers</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Credit</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Assigned To</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Progress</th>
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
                      <div>
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                          {report.state}
                        </span>
                        <p className="text-gray-300 text-sm mt-1">{report.lga}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                        {report.reportType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        report.status === 'Completed' ? 'bg-green-600 text-white' :
                        report.status === 'In Progress' ? 'bg-yellow-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{report.farmersReached.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-300">{report.creditDisbursed}</td>
                    <td className="py-3 px-4 text-gray-300">{report.assignedTo}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-primary-700 rounded-full h-2">
                          <div 
                            className="bg-accent-500 h-2 rounded-full" 
                            style={{ width: `${report.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-300 text-sm">{report.completionRate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                          👁️ View
                        </button>
                        <button className="text-green-400 hover:text-green-300 text-sm">
                          ✏️ Edit
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-gray-400 text-sm">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredReports.length)} of {filteredReports.length} reports
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-primary-700 text-gray-300 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <span className="px-3 py-1 bg-accent-600 text-white rounded-md">
                  {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-primary-700 text-gray-300 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-primary-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="btn-primary">
              📊 Generate LGA Performance Report
            </button>
            <button className="btn-secondary">
              📈 View LGA Analytics Dashboard
            </button>
            <button className="btn-secondary">
              📋 Export All LGA Reports
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm py-4">
          Powered by Mc. George
        </div>
      </div>
    </PortalLayout>
  );
};

export default LocalMonitoring;