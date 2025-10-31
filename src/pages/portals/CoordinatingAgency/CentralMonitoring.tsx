import React, { useState, useMemo } from 'react';
import PortalLayout from '../../../components/PortalLayout';

const CentralMonitoring: React.FC = () => {
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

  // Central Monitoring Reports - Comprehensive Dummy Data
  const monitoringReports = [
    {
      id: '1',
      title: 'National Agricultural Credit Performance Assessment',
      state: 'FCT Abuja',
      reportType: 'Performance Review',
      date: '2024-01-15',
      status: 'Completed',
      priority: 'High',
      findings: 'Overall credit performance improved by 15% compared to previous quarter',
      recommendations: 'Increase funding allocation to high-performing states',
      assignedTo: 'Dr. Sarah Ibrahim',
      completionRate: 100
    },
    {
      id: '2',
      title: 'PFI Compliance Monitoring Report - Q4 2023',
      state: 'Lagos',
      reportType: 'Compliance',
      date: '2024-01-10',
      status: 'In Progress',
      priority: 'Medium',
      findings: '85% compliance rate across all PFI partners',
      recommendations: 'Address non-compliance issues in 3 identified institutions',
      assignedTo: 'Mr. Adebayo Ogunlesi',
      completionRate: 75
    },
    {
      id: '3',
      title: 'Agricultural Insurance Penetration Analysis',
      state: 'Kano',
      reportType: 'Market Analysis',
      date: '2024-01-08',
      status: 'Completed',
      priority: 'High',
      findings: 'Insurance penetration increased to 23% in Northern states',
      recommendations: 'Expand insurance products to cover more crop varieties',
      assignedTo: 'Dr. Fatima Usman',
      completionRate: 100
    },
    {
      id: '4',
      title: 'Fund Utilization Efficiency Report',
      state: 'Rivers',
      reportType: 'Financial Analysis',
      date: '2024-01-05',
      status: 'Pending Review',
      priority: 'High',
      findings: 'Fund utilization efficiency at 78% across all programs',
      recommendations: 'Implement stricter monitoring mechanisms',
      assignedTo: 'Ms. Grace Okonkwo',
      completionRate: 90
    },
    {
      id: '5',
      title: 'Stakeholder Engagement Assessment',
      state: 'Oyo',
      reportType: 'Stakeholder Analysis',
      date: '2024-01-03',
      status: 'Completed',
      priority: 'Medium',
      findings: 'Strong stakeholder engagement in South-West region',
      recommendations: 'Replicate engagement model in other regions',
      assignedTo: 'Mr. Tunde Adebayo',
      completionRate: 100
    },
    {
      id: '6',
      title: 'Technology Adoption in Agricultural Finance',
      state: 'FCT Abuja',
      reportType: 'Technology Assessment',
      date: '2024-01-01',
      status: 'In Progress',
      priority: 'Medium',
      findings: 'Digital adoption rate at 45% among farmers',
      recommendations: 'Increase digital literacy programs',
      assignedTo: 'Dr. Chinedu Nwosu',
      completionRate: 60
    },
    {
      id: '7',
      title: 'Risk Management Framework Evaluation',
      state: 'Kaduna',
      reportType: 'Risk Assessment',
      date: '2023-12-28',
      status: 'Completed',
      priority: 'High',
      findings: 'Risk management framework needs updating',
      recommendations: 'Implement new risk assessment tools',
      assignedTo: 'Ms. Aisha Mohammed',
      completionRate: 100
    },
    {
      id: '8',
      title: 'Agricultural Extension Services Impact Study',
      state: 'Benue',
      reportType: 'Impact Assessment',
      date: '2023-12-25',
      status: 'Completed',
      priority: 'Medium',
      findings: 'Extension services increased yield by 20%',
      recommendations: 'Scale up extension programs',
      assignedTo: 'Dr. Peter Okwu',
      completionRate: 100
    },
    {
      id: '9',
      title: 'Financial Inclusion Index for Rural Areas',
      state: 'Kebbi',
      reportType: 'Financial Inclusion',
      date: '2023-12-22',
      status: 'In Progress',
      priority: 'High',
      findings: 'Financial inclusion rate at 35% in rural areas',
      recommendations: 'Deploy more mobile banking agents',
      assignedTo: 'Mr. Ibrahim Garba',
      completionRate: 80
    },
    {
      id: '10',
      title: 'Climate Risk Assessment for Agricultural Finance',
      state: 'Sokoto',
      reportType: 'Climate Risk',
      date: '2023-12-20',
      status: 'Pending Review',
      priority: 'High',
      findings: 'Climate risks affecting 40% of agricultural loans',
      recommendations: 'Develop climate-resilient financing products',
      assignedTo: 'Dr. Amina Hassan',
      completionRate: 95
    },
    {
      id: '11',
      title: 'Youth Participation in Agricultural Finance Programs',
      state: 'Lagos',
      reportType: 'Demographic Analysis',
      date: '2023-12-18',
      status: 'Completed',
      priority: 'Medium',
      findings: 'Youth participation increased to 28%',
      recommendations: 'Create youth-specific financial products',
      assignedTo: 'Ms. Blessing Okafor',
      completionRate: 100
    },
    {
      id: '12',
      title: 'Women Empowerment Through Agricultural Finance',
      state: 'Kwara',
      reportType: 'Gender Analysis',
      date: '2023-12-15',
      status: 'In Progress',
      priority: 'High',
      findings: 'Women participation at 42% in agricultural finance',
      recommendations: 'Increase women-focused financial products',
      assignedTo: 'Dr. Maryam Abdullahi',
      completionRate: 70
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
    { title: 'Total Reports', value: monitoringReports.length.toString(), change: '+3', icon: '📊' },
    { title: 'Completed Reports', value: monitoringReports.filter(r => r.status === 'Completed').length.toString(), change: '+2', icon: '✅' },
    { title: 'In Progress', value: monitoringReports.filter(r => r.status === 'In Progress').length.toString(), change: '+1', icon: '🔄' },
    { title: 'High Priority', value: monitoringReports.filter(r => r.priority === 'High').length.toString(), change: '+1', icon: '🔴' }
  ];

  return (
    <PortalLayout role="Central Monitoring Department" roleIcon="🏛️" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-primary-800 rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Central Monitoring Department</h1>
              <p className="text-gray-300">
                National-level monitoring and oversight of all agricultural finance programs across Nigeria
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="btn-primary">
                📊 Generate Report
              </button>
              <button className="btn-secondary">
                📈 Analytics Dashboard
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

        {/* Monitoring Reports Management */}
        <div className="bg-primary-800 rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-white">Monitoring Reports</h2>
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
                  placeholder="Search reports..."
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
                    onClick={() => handleMassAction('Archive')}
                    className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700"
                  >
                    📁 Archive Selected
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
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">State</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Priority</th>
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
                    <td className="py-3 px-4 text-gray-300">{report.state}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
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
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        report.priority === 'High' ? 'bg-red-600 text-white' :
                        report.priority === 'Medium' ? 'bg-yellow-600 text-white' :
                        'bg-green-600 text-white'
                      }`}>
                        {report.priority}
                      </span>
                    </td>
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
                        <button className="text-red-400 hover:text-red-300 text-sm">
                          🗑️ Delete
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
              📊 Generate Performance Report
            </button>
            <button className="btn-secondary">
              📈 View Analytics Dashboard
            </button>
            <button className="btn-secondary">
              📋 Export All Reports
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

export default CentralMonitoring;