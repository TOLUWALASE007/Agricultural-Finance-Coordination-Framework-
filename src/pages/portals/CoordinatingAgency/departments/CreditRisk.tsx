import React, { useState, useMemo } from 'react';
import PortalLayout from '../../../../components/PortalLayout';

const CreditRisk: React.FC = () => {
  const sidebarItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: '🏠', 
      href: '/portal/coordinating-agency',
      hasDropdown: true,
      dropdownItems: [
        { id: 'activities', name: 'Activities', icon: '⚡', href: '/portal/coordinating-agency/activities' },
        { id: 'fund-schemes', name: 'Fund Schemes', icon: '💵', href: '/portal/coordinating-agency/fund-schemes' },
        { id: 'reportings', name: 'Reportings', icon: '📑', href: '/portal/coordinating-agency/reportings' }
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
    { title: 'Risk Assessments', value: '156', change: '+12', icon: '📊' },
    { title: 'De-risking Coverage', value: '₦28.5B', change: '+₦2.1B', icon: '🛡️' },
    { title: 'Default Rate', value: '4.2%', change: '-0.8%', icon: '📉' },
    { title: 'Risk Mitigation', value: '94.3%', change: '+1.5%', icon: '✅' }
  ];

  // Risk Assessment Data
  const [riskAssessments] = useState([
    { id: 'RA-001', scheme: 'Rice Value Chain Development', riskLevel: 'Low', score: 85, deRisking: '₦4.2B', status: 'Approved', date: '2025-01-15' },
    { id: 'RA-002', scheme: 'Cassava Processing Initiative', riskLevel: 'Medium', score: 72, deRisking: '₦2.8B', status: 'Under Review', date: '2025-01-20' },
    { id: 'RA-003', scheme: 'Maize Production Expansion', riskLevel: 'Low', score: 88, deRisking: '₦3.5B', status: 'Approved', date: '2025-01-18' },
    { id: 'RA-004', scheme: 'Poultry Farming Support', riskLevel: 'Medium', score: 68, deRisking: '₦2.1B', status: 'Approved', date: '2025-01-22' },
    { id: 'RA-005', scheme: 'Fish Farming Development', riskLevel: 'High', score: 58, deRisking: '₦2.5B', status: 'Pending', date: '2025-01-25' },
    { id: 'RA-006', scheme: 'Cocoa Rehabilitation Program', riskLevel: 'Low', score: 82, deRisking: '₦3.2B', status: 'Approved', date: '2025-01-16' },
    { id: 'RA-007', scheme: 'Yam Production Enhancement', riskLevel: 'Medium', score: 70, deRisking: '₦1.9B', status: 'Approved', date: '2025-01-19' },
    { id: 'RA-008', scheme: 'Palm Oil Processing', riskLevel: 'Low', score: 86, deRisking: '₦2.9B', status: 'Approved', date: '2025-01-21' }
  ]);

  // Mitigation Strategies
  const [mitigationStrategies] = useState([
    { id: 'MS-001', strategy: 'Collateral Management System', schemes: 24, coverage: '₦12.5B', effectiveness: '92%', status: 'Active' },
    { id: 'MS-002', strategy: 'Credit Guarantee Scheme', schemes: 18, coverage: '₦8.3B', effectiveness: '88%', status: 'Active' },
    { id: 'MS-003', strategy: 'Weather Index Insurance', schemes: 15, coverage: '₦5.7B', effectiveness: '85%', status: 'Active' },
    { id: 'MS-004', strategy: 'Value Chain Financing', schemes: 12, coverage: '₦4.2B', effectiveness: '90%', status: 'Active' },
    { id: 'MS-005', strategy: 'Cooperative Lending Model', schemes: 10, coverage: '₦3.8B', effectiveness: '87%', status: 'Active' }
  ]);

  // Search and pagination
  const [assessmentSearch, setAssessmentSearch] = useState('');
  const [assessmentPage, setAssessmentPage] = useState(1);
  const [strategySearch, setStrategySearch] = useState('');
  const [strategyPage, setStrategyPage] = useState(1);

  const assessmentPageSize = 5;
  const strategyPageSize = 4;

  const filteredAssessments = useMemo(() => {
    return riskAssessments.filter(item =>
      item.scheme.toLowerCase().includes(assessmentSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(assessmentSearch.toLowerCase()) ||
      item.riskLevel.toLowerCase().includes(assessmentSearch.toLowerCase())
    );
  }, [assessmentSearch, riskAssessments]);

  const paginatedAssessments = useMemo(() => {
    const start = (assessmentPage - 1) * assessmentPageSize;
    return filteredAssessments.slice(start, start + assessmentPageSize);
  }, [filteredAssessments, assessmentPage]);

  const assessmentTotalPages = Math.ceil(filteredAssessments.length / assessmentPageSize);

  const filteredStrategies = useMemo(() => {
    return mitigationStrategies.filter(item =>
      item.strategy.toLowerCase().includes(strategySearch.toLowerCase()) ||
      item.id.toLowerCase().includes(strategySearch.toLowerCase())
    );
  }, [strategySearch, mitigationStrategies]);

  const paginatedStrategies = useMemo(() => {
    const start = (strategyPage - 1) * strategyPageSize;
    return filteredStrategies.slice(start, start + strategyPageSize);
  }, [filteredStrategies, strategyPage]);

  const strategyTotalPages = Math.ceil(filteredStrategies.length / strategyPageSize);

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
            📊 Agricultural Credit Risk Management Department
          </h1>
          <p className="text-sm sm:text-base text-gray-400 font-serif">
            Manages credit risk assessment, mitigation strategies, and de-risking mechanisms
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl sm:text-3xl">{stat.icon}</span>
                <span className={`text-xs sm:text-sm font-sans ${
                  stat.change.startsWith('-') ? 'text-green-400' : 'text-green-400'
                }`}>{stat.change}</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold font-sans text-gray-100 mb-1">{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-400 font-serif">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Risk Assessments Card */}
        <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <h3 className="text-lg font-semibold font-sans text-gray-100">Risk Assessments</h3>
            <div className="relative w-full sm:w-auto">
              <input
                value={assessmentSearch}
                onChange={(e) => { setAssessmentPage(1); setAssessmentSearch(e.target.value); }}
                placeholder="Search assessments..."
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
                  <th className="text-left py-3 px-2 text-xs sm:text-sm font-semibold text-gray-300 font-sans">Assessment ID</th>
                  <th className="text-left py-3 px-2 text-xs sm:text-sm font-semibold text-gray-300 font-sans">Scheme</th>
                  <th className="text-left py-3 px-2 text-xs sm:text-sm font-semibold text-gray-300 font-sans">Risk Level</th>
                  <th className="text-left py-3 px-2 text-xs sm:text-sm font-semibold text-gray-300 font-sans">Score</th>
                  <th className="text-left py-3 px-2 text-xs sm:text-sm font-semibold text-gray-300 font-sans">De-risking</th>
                  <th className="text-left py-3 px-2 text-xs sm:text-sm font-semibold text-gray-300 font-sans">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAssessments.map((item) => (
                  <tr key={item.id} className="border-b border-primary-700 hover:bg-primary-700">
                    <td className="py-3 px-2 text-xs sm:text-sm text-gray-300 font-sans">{item.id}</td>
                    <td className="py-3 px-2 text-xs sm:text-sm text-gray-100 font-sans">{item.scheme}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.riskLevel === 'Low' ? 'bg-green-500 text-white' :
                        item.riskLevel === 'Medium' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {item.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-xs sm:text-sm text-accent-400 font-sans font-bold">{item.score}</td>
                    <td className="py-3 px-2 text-xs sm:text-sm text-gray-300 font-sans">{item.deRisking}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Approved' ? 'bg-green-500 text-white' :
                        item.status === 'Under Review' ? 'bg-yellow-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {assessmentTotalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-4">
              <button 
                onClick={() => setAssessmentPage(Math.max(assessmentPage - 1, 1))} 
                disabled={assessmentPage === 1}
                className="btn-secondary text-sm p-2 disabled:opacity-50"
              >
                ←
              </button>
              <span className="text-sm text-gray-300 font-sans">
                Page {assessmentPage} of {assessmentTotalPages}
              </span>
              <button 
                onClick={() => setAssessmentPage(Math.min(assessmentPage + 1, assessmentTotalPages))} 
                disabled={assessmentPage === assessmentTotalPages}
                className="btn-secondary text-sm p-2 disabled:opacity-50"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Mitigation Strategies Card */}
        <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <h3 className="text-lg font-semibold font-sans text-gray-100">Risk Mitigation Strategies</h3>
            <div className="relative w-full sm:w-auto">
              <input
                value={strategySearch}
                onChange={(e) => { setStrategyPage(1); setStrategySearch(e.target.value); }}
                placeholder="Search strategies..."
                className="w-full sm:w-64 px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                🔍
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {paginatedStrategies.map((item) => (
              <div key={item.id} className="bg-primary-700 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-100 font-sans">{item.strategy}</p>
                    <p className="text-xs text-gray-400 font-serif">{item.id} • {item.schemes} Schemes</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white w-fit">
                    {item.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-xs text-gray-400 font-serif">Coverage</p>
                    <p className="text-sm font-bold text-accent-400 font-sans">{item.coverage}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-serif">Effectiveness</p>
                    <p className="text-sm font-bold text-green-400 font-sans">{item.effectiveness}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {strategyTotalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-4">
              <button 
                onClick={() => setStrategyPage(Math.max(strategyPage - 1, 1))} 
                disabled={strategyPage === 1}
                className="btn-secondary text-sm p-2 disabled:opacity-50"
              >
                ←
              </button>
              <span className="text-sm text-gray-300 font-sans">
                Page {strategyPage} of {strategyTotalPages}
              </span>
              <button 
                onClick={() => setStrategyPage(Math.min(strategyPage + 1, strategyTotalPages))} 
                disabled={strategyPage === strategyTotalPages}
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
              📊 New Risk Assessment
            </button>
            <button className="btn-secondary text-sm">
              🛡️ Update De-risking
            </button>
            <button className="btn-secondary text-sm">
              📈 Risk Analytics Report
            </button>
            <button className="btn-secondary text-sm">
              📋 Export Risk Data
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

export default CreditRisk;

