import React, { useState, useMemo, useEffect } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, showNotification } from '../../../utils/quickActions';
import { getMEProjects } from '../../../utils/localDatabase';

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
      id: 'me-team',
      name: 'M&E Team',
      icon: '📋',
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
    { title: 'Pending Review', value: '8', change: '-2', icon: '⏳' },
    { title: 'Active PFIs', value: '24', change: '+3', icon: '🏦' },
    { title: 'Active Insurance Companies', value: '18', change: '+2', icon: '🛡️' }
  ];

  // Get M&E Reports from projects with submitted reports
  const meProjects = getMEProjects();
  // Show reports from projects that have at least one submitted report
  const projectsWithReports = meProjects.filter(p => p.evaluationReports && p.evaluationReports.length > 0);

  // Transform M&E projects into report format
  const reports = projectsWithReports.flatMap(project => {
    return project.evaluationReports.map(report => ({
      id: report.id,
      title: `M&E Evaluation Report - ${project.name}`,
      type: 'M&E Report',
      category: 'Monitoring & Evaluation',
      generatedBy: report.evaluatorName,
      evaluatorId: report.evaluatorId,
      date: report.submittedAt,
      status: 'Published',
      downloads: 0,
      size: '1.2 MB',
      projectId: project.id,
      projectName: project.name,
      recommendation: report.recommendation,
      findings: report.findings,
      recommendationReason: report.recommendationReason,
      additionalNotes: report.additionalNotes,
      isLeadMEReport: report.isLeadMEReport || false, // Lead M&E flag
      leadMEMemberName: project.leadMEMemberName, // Lead M&E name for the project
    }));
  });

  // Nigerian States
  const nigerianStates = [
    'All States',
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
    'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
    'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
  ];

  // State management
  const [reportPage, setReportPage] = useState(1);
  const [reportStateFilter, setReportStateFilter] = useState('All States');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [forwardOpen, setForwardOpen] = useState(false);
  const [forwardTargets, setForwardTargets] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadReportType, setDownloadReportType] = useState('');
  const [downloadFileFormat, setDownloadFileFormat] = useState('PDF');
  const [viewReportModal, setViewReportModal] = useState<any>(null); // For viewing report details
  const reportPageSize = 6;

  // Mock data for graphs based on state
  const getMonthlyData = (state: string) => {
    const baseData = [
      { month: 'Jan', reports: 12 },
      { month: 'Feb', reports: 15 },
      { month: 'Mar', reports: 18 },
      { month: 'Apr', reports: 14 },
      { month: 'May', reports: 20 },
      { month: 'Jun', reports: 22 },
      { month: 'Jul', reports: 19 },
      { month: 'Aug', reports: 25 },
      { month: 'Sep', reports: 23 },
      { month: 'Oct', reports: 28 },
      { month: 'Nov', reports: 24 },
      { month: 'Dec', reports: 26 }
    ];

    if (state === 'All States') return baseData;

    // Simulate state-specific data with variation
    return baseData.map(item => ({
      ...item,
      reports: Math.max(1, Math.floor(item.reports * (0.3 + Math.random() * 0.7)))
    }));
  };

  const getQuarterlyData = (state: string) => {
    const baseData = [
      { quarter: 'Q1 2023', reports: 45 },
      { quarter: 'Q2 2023', reports: 52 },
      { quarter: 'Q3 2023', reports: 48 },
      { quarter: 'Q4 2023', reports: 58 },
      { quarter: 'Q1 2024', reports: 62 },
      { quarter: 'Q2 2024', reports: 55 },
      { quarter: 'Q3 2024', reports: 68 },
      { quarter: 'Q4 2024', reports: 72 }
    ];

    if (state === 'All States') return baseData;

    return baseData.map(item => ({
      ...item,
      reports: Math.max(5, Math.floor(item.reports * (0.2 + Math.random() * 0.6)))
    }));
  };

  const getStateData = (state: string) => {
    if (state !== 'All States') {
      // Show only the selected state
      return [{ state: state, reports: Math.floor(Math.random() * 50) + 20 }];
    }

    // Show top 10 states when "All States" is selected
    return [
      { state: 'Lagos', reports: 65 },
      { state: 'Kano', reports: 58 },
      { state: 'Kaduna', reports: 52 },
      { state: 'Rivers', reports: 48 },
      { state: 'Oyo', reports: 45 },
      { state: 'Delta', reports: 42 },
      { state: 'Ogun', reports: 40 },
      { state: 'Katsina', reports: 38 },
      { state: 'Benue', reports: 35 },
      { state: 'Plateau', reports: 32 }
    ];
  };

  const monthlyData = useMemo(() => getMonthlyData(selectedState), [selectedState]);
  const quarterlyData = useMemo(() => getQuarterlyData(selectedState), [selectedState]);
  const stateData = useMemo(() => getStateData(selectedState), [selectedState]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    // For now, show all M&E reports regardless of state filter
    // TODO: Add state information to ME projects for proper filtering
    const filtered = reports;

    // Sort by date only (newest first) - no priority sorting for Lead M&E
    return filtered.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [reports, reportStateFilter]);

  const paginatedReports = useMemo(() => {
    const start = (reportPage - 1) * reportPageSize;
    return filteredReports.slice(start, start + reportPageSize);
  }, [filteredReports, reportPage]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / reportPageSize));

  useEffect(() => { setReportPage(1); }, [reportStateFilter]);

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
    if (!forwardTargets.trim()) {
      showNotification('Please enter at least one email address', 'error');
      return;
    }

    const emails = forwardTargets.split(',').map(e => e.trim()).filter(Boolean);
    const selectedReportsList = reports.filter(r => selectedReports.includes(r.id));

    // Simulate sending emails (in production, this would call an API)
    showNotification(
      `Successfully forwarded ${selectedReportsList.length} M&E report(s) to ${emails.length} recipient(s)`,
      'success'
    );

    // Reset selection and close modal
    setSelectedReports([]);
    closeForwardModal();
  };

  return (
    <PortalLayout role="Coordinating Agency (Super Admin)" roleIcon="🏛️" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-4 sm:p-6 text-white">
          <h1 className="text-base sm:text-xl font-bold font-sans mb-2">Reports & Documentation</h1>
          <p className="text-xs sm:text-sm text-gray-200 font-serif">
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

        {/* State Filter */}
        <div className="card">
          <label className="block text-sm font-semibold text-gray-100 mb-2">Filter by State</label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            {nigerianStates.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-2">
            {selectedState === 'All States'
              ? 'Showing aggregated data across all states'
              : `Showing data for ${selectedState}`}
          </p>
        </div>

        {/* Report Graphs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Monthly Reports Graph */}
          <div
            className="card hover:border-accent-500 transition-all cursor-pointer transform hover:scale-105"
            onClick={() => {
              setDownloadReportType('Monthly');
              setDownloadModalOpen(true);
            }}
          >
            <h3 className="text-sm font-semibold text-gray-100 mb-4 flex items-center gap-2">
              <span>📅</span> Monthly Reports
            </h3>
            <div className="w-full h-48 overflow-x-auto overflow-y-hidden" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#3b82f6 #1f2937'
            }}>
              <style>{`
                .overflow-x-auto::-webkit-scrollbar {
                  height: 8px;
                }
                .overflow-x-auto::-webkit-scrollbar-track {
                  background: #1f2937;
                  border-radius: 4px;
                }
                .overflow-x-auto::-webkit-scrollbar-thumb {
                  background: #3b82f6;
                  border-radius: 4px;
                }
                .overflow-x-auto::-webkit-scrollbar-thumb:hover {
                  background: #60a5fa;
                }
              `}</style>
              <svg
                width={Math.max(300, monthlyData.length * 40)}
                height="180"
                viewBox={`0 0 ${Math.max(300, monthlyData.length * 40)} 180`}
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="monthlyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                {(() => {
                  const data = monthlyData;
                  const maxValue = Math.max(...data.map(d => d.reports));
                  const svgWidth = Math.max(300, data.length * 40);
                  const padding = 20;

                  const points = data.map((item, index) => {
                    const x = padding + (index / Math.max(data.length - 1, 1)) * (svgWidth - 2 * padding);
                    const y = 160 - ((item.reports / maxValue) * 140);
                    return { x, y, value: item.reports, label: item.month };
                  });

                  const pathD = points.map((p, i) =>
                    i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
                  ).join(' ');

                  const areaD = `${pathD} L ${points[points.length - 1].x} 160 L ${points[0].x} 160 Z`;

                  return (
                    <>
                      <path d={areaD} fill="url(#monthlyGradient)" />
                      <path d={pathD} stroke="#3b82f6" strokeWidth="2" fill="none" />
                      {points.map((point, i) => (
                        <g key={i}>
                          <circle cx={point.x} cy={point.y} r="4" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2" />
                          <text x={point.x} y="175" fontSize="10" fill="#9ca3af" textAnchor="middle">{point.label}</text>
                          <text x={point.x} y={point.y - 10} fontSize="10" fill="#e5e7eb" textAnchor="middle" fontWeight="bold">{point.value}</text>
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">Click to download report</p>
          </div>

          {/* Quarterly Reports Graph */}
          <div
            className="card hover:border-accent-500 transition-all cursor-pointer transform hover:scale-105"
            onClick={() => {
              setDownloadReportType('Quarterly');
              setDownloadModalOpen(true);
            }}
          >
            <h3 className="text-sm font-semibold text-gray-100 mb-4 flex items-center gap-2">
              <span>📊</span> Quarterly Reports
            </h3>
            <div className="w-full h-48 overflow-x-auto overflow-y-hidden" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#a855f7 #1f2937'
            }}>
              <style>{`
                .overflow-x-auto::-webkit-scrollbar {
                  height: 8px;
                }
                .overflow-x-auto::-webkit-scrollbar-track {
                  background: #1f2937;
                  border-radius: 4px;
                }
                .overflow-x-auto::-webkit-scrollbar-thumb {
                  background: #a855f7;
                  border-radius: 4px;
                }
                .overflow-x-auto::-webkit-scrollbar-thumb:hover {
                  background: #c084fc;
                }
              `}</style>
              <svg
                width={Math.max(300, quarterlyData.length * 60)}
                height="180"
                viewBox={`0 0 ${Math.max(300, quarterlyData.length * 60)} 180`}
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="quarterlyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                {(() => {
                  const data = quarterlyData;
                  const maxValue = Math.max(...data.map(d => d.reports));
                  const svgWidth = Math.max(300, data.length * 60);
                  const padding = 20;

                  const points = data.map((item, index) => {
                    const x = padding + (index / Math.max(data.length - 1, 1)) * (svgWidth - 2 * padding);
                    const y = 160 - ((item.reports / maxValue) * 140);
                    return { x, y, value: item.reports, label: item.quarter };
                  });

                  const pathD = points.map((p, i) =>
                    i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
                  ).join(' ');

                  const areaD = `${pathD} L ${points[points.length - 1].x} 160 L ${points[0].x} 160 Z`;

                  return (
                    <>
                      <path d={areaD} fill="url(#quarterlyGradient)" />
                      <path d={pathD} stroke="#a855f7" strokeWidth="2" fill="none" />
                      {points.map((point, i) => (
                        <g key={i}>
                          <circle cx={point.x} cy={point.y} r="4" fill="#a855f7" stroke="#6b21a8" strokeWidth="2" />
                          <text x={point.x} y="175" fontSize="9" fill="#9ca3af" textAnchor="middle">{point.label}</text>
                          <text x={point.x} y={point.y - 10} fontSize="10" fill="#e5e7eb" textAnchor="middle" fontWeight="bold">{point.value}</text>
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">Click to download report</p>
          </div>

          {/* State Reports Graph */}
          <div
            className="card hover:border-accent-500 transition-all cursor-pointer transform hover:scale-105"
            onClick={() => {
              setDownloadReportType('State');
              setDownloadModalOpen(true);
            }}
          >
            <h3 className="text-sm font-semibold text-gray-100 mb-4 flex items-center gap-2">
              <span>🗺️</span> State Reports
            </h3>
            <div className="w-full h-48 overflow-x-auto overflow-y-hidden" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#22c55e #1f2937'
            }}>
              <style>{`
                .w-full.h-48::-webkit-scrollbar {
                  height: 8px;
                }
                .w-full.h-48::-webkit-scrollbar-track {
                  background: #1f2937;
                  border-radius: 4px;
                }
                .w-full.h-48::-webkit-scrollbar-thumb {
                  background: #22c55e;
                  border-radius: 4px;
                }
                .w-full.h-48::-webkit-scrollbar-thumb:hover {
                  background: #4ade80;
                }
              `}</style>
              <svg
                width={Math.max(300, stateData.length * 50)}
                height="180"
                viewBox={`0 0 ${Math.max(300, stateData.length * 50)} 180`}
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="stateGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                {(() => {
                  const data = stateData;
                  const maxValue = Math.max(...data.map(d => d.reports));
                  const svgWidth = Math.max(300, data.length * 50);
                  const padding = 20;

                  const points = data.map((item, index) => {
                    const x = padding + (index / Math.max(data.length - 1, 1)) * (svgWidth - 2 * padding);
                    const y = 160 - ((item.reports / maxValue) * 140);
                    return { x, y, value: item.reports, label: item.state };
                  });

                  const pathD = points.map((p, i) =>
                    i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
                  ).join(' ');

                  const areaD = points.length > 1
                    ? `${pathD} L ${points[points.length - 1].x} 160 L ${points[0].x} 160 Z`
                    : '';

                  return (
                    <>
                      {areaD && <path d={areaD} fill="url(#stateGradient)" />}
                      {points.length > 1 && <path d={pathD} stroke="#22c55e" strokeWidth="2" fill="none" />}
                      {points.map((point, i) => (
                        <g key={i}>
                          <circle cx={point.x} cy={point.y} r="4" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
                          <text
                            x={point.x}
                            y="175"
                            fontSize="10"
                            fill="#9ca3af"
                            textAnchor="middle"
                          >
                            {point.label}
                          </text>
                          <text x={point.x} y={point.y - 10} fontSize="10" fill="#e5e7eb" textAnchor="middle" fontWeight="bold">{point.value}</text>
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">Click to download report</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card flex flex-col">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <select
                value={reportStateFilter}
                onChange={(e) => { setReportStateFilter(e.target.value); setReportPage(1); }}
                className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
              >
                <option value="All States">All States</option>
                {nigerianStates.slice(1).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>

              <div className="flex items-center gap-2 ml-auto">
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAllOnPageSelected}
                    onChange={toggleSelectAllOnPage}
                    className="w-4 h-4 accent-accent-500"
                  />
                  <span>Select All on Page</span>
                </label>
              </div>
            </div>
          </div>

          {/* Bulk Action Buttons */}
          {selectedReports.length > 0 && (
            <div className="flex items-center justify-between p-2 bg-accent-600/20 border border-accent-600 rounded-md mb-4">
              <span className="text-sm text-gray-200 font-sans">{selectedReports.length} selected</span>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadSelected}
                  className="btn-primary text-xs px-3 py-1"
                >
                  ⬇️ Download Selected
                </button>
                <button
                  onClick={openForwardModal}
                  className="btn-primary text-xs px-3 py-1"
                >
                  ➡️ Forward Selected
                </button>
              </div>
            </div>
          )}

          {/* Reports List - Mobile Friendly */}
          <div className="flex-1 flex flex-col">
            <div className="space-y-3 flex-1">
              {paginatedReports.map((report) => (
                <div
                  key={report.id}
                  className={`p-3 rounded-lg border ${report.isLeadMEReport
                    ? 'bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-600/50'
                    : 'bg-primary-700 border-primary-600'
                    }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedReports.includes(report.id)}
                      onChange={() => toggleSelect(report.id)}
                      className="mt-1 w-4 h-4 accent-accent-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium text-gray-100 font-sans">{report.title}</p>
                            {report.isLeadMEReport && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-black">
                                ⭐ PRIORITY - LEAD M&E
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-300 font-serif mb-2">
                        <span className="flex items-center gap-1">
                          <span>📄</span> {report.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📁</span> {report.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>👤</span> {report.generatedBy}
                          {report.isLeadMEReport && (
                            <span className="text-yellow-400 font-semibold">(Lead M&E)</span>
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📅</span> {new Date(report.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => setViewReportModal(report)} className="text-xs text-accent-400 hover:text-accent-300 font-medium">👁️ View</button>
                        <button onClick={() => handleDownloadOne(report)} className="text-xs text-accent-400 hover:text-accent-300 font-medium">⬇️ Download</button>
                        <button onClick={() => { setSelectedReports(prev => prev.includes(report.id) ? prev : [...prev, report.id]); openForwardModal(); }} className="text-xs text-accent-400 hover:text-accent-300 font-medium">➡️ Forward</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredReports.length > reportPageSize && (
              <div className="flex items-center justify-center space-x-2 mt-4 pt-4">
                <button
                  onClick={() => setReportPage(Math.max(reportPage - 1, 1))}
                  disabled={reportPage === 1}
                  className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                <span className="text-xs text-gray-400">{reportPage} of {totalPages}</span>
                <button
                  onClick={() => setReportPage(Math.min(reportPage + 1, totalPages))}
                  disabled={reportPage === totalPages}
                  className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Most Downloaded Reports */}
        <div className="card flex flex-col">
          <h3 className="text-base sm:text-lg font-semibold font-sans text-gray-100 mb-4">Most Downloaded Reports</h3>
          <div className="space-y-3 flex-1">
            {reports
              .sort((a, b) => b.downloads - a.downloads)
              .slice(0, 3)
              .map((report, index) => (
                <div key={index} className="p-3 bg-primary-700 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="text-xl">🏆</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-100 font-sans">{report.title}</p>
                      <p className="text-xs text-gray-400 font-serif">{report.category}</p>
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
          <div className="w-full max-w-lg bg-primary-800 border border-primary-700 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="px-4 py-3 border-b border-primary-700 flex items-center justify-between sticky top-0 bg-primary-800">
              <h3 className="text-base sm:text-lg font-semibold text-white font-sans">Forward Reports</h3>
              <button onClick={closeForwardModal} className="text-gray-400 hover:text-gray-200 text-xl">✖</button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs sm:text-sm text-gray-300 mb-1">Recipients (Email addresses, comma-separated)</label>
                <textarea
                  value={forwardTargets}
                  onChange={(e) => setForwardTargets(e.target.value)}
                  rows={4}
                  placeholder="Enter email addresses separated by commas..."
                  className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
                />
              </div>
              <div className="text-xs sm:text-sm text-gray-400">
                Forwarding <span className="font-semibold text-gray-300">{selectedReports.length}</span> report(s)
              </div>
            </div>
            <div className="px-4 py-3 border-t border-primary-700 flex flex-col sm:flex-row gap-3 justify-end sticky bottom-0 bg-primary-800">
              <button onClick={closeForwardModal} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleForwardSend} className="px-4 py-2 rounded-md bg-accent-600 hover:bg-accent-500 text-white font-sans text-sm">Send</button>
            </div>
          </div>
        </div>
      )}

      {/* Download Modal */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md bg-primary-800 border border-primary-700 rounded-lg shadow-xl">
            <div className="px-4 py-3 border-b border-primary-700 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-white font-sans">
                Download {downloadReportType} Report
              </h3>
              <button
                onClick={() => {
                  setDownloadModalOpen(false);
                  setDownloadFileFormat('PDF');
                }}
                className="text-gray-400 hover:text-gray-200 text-xl"
              >
                ✖
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Report Type</label>
                <div className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600">
                  {downloadReportType} Reports
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">State Filter</label>
                <div className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600">
                  {selectedState}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">File Format</label>
                <select
                  value={downloadFileFormat}
                  onChange={(e) => setDownloadFileFormat(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  <option value="PDF">PDF</option>
                  <option value="Excel">Excel (XLSX)</option>
                  <option value="CSV">CSV</option>
                </select>
              </div>
              <div className="text-xs text-gray-400">
                {selectedState === 'All States'
                  ? `This will download ${downloadReportType.toLowerCase()} reports for all states in ${downloadFileFormat} format.`
                  : `This will download ${downloadReportType.toLowerCase()} reports for ${selectedState} in ${downloadFileFormat} format.`}
              </div>
            </div>
            <div className="px-4 py-3 border-t border-primary-700 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => {
                  setDownloadModalOpen(false);
                  setDownloadFileFormat('PDF');
                }}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const reportTitle = `${downloadReportType} Report - ${selectedState}`;
                  generateReport(reportTitle, downloadFileFormat);
                  setDownloadModalOpen(false);
                  setDownloadFileFormat('PDF');
                }}
                className="px-4 py-2 rounded-md bg-accent-600 hover:bg-accent-500 text-white font-sans text-sm flex items-center gap-2"
              >
                <span>⬇️</span> Download {downloadFileFormat}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Report Modal */}
      {viewReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setViewReportModal(null)}>
          <div className="min-h-screen flex items-center justify-center py-8">
            <div
              className={`w-full max-w-3xl rounded-lg border p-6 ${viewReportModal.isLeadMEReport
                ? 'bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-600/50'
                : 'bg-primary-900 border-primary-700'
                }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="text-xl font-semibold text-white">M&E Evaluation Report</h3>
                    {viewReportModal.isLeadMEReport && (
                      <span className="px-2 py-1 rounded text-xs font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-black">
                        ⭐ PRIORITY - LEAD M&E
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{viewReportModal.projectName}</p>
                </div>
                <button
                  onClick={() => setViewReportModal(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✖
                </button>
              </div>

              {/* Report Details */}
              <div className="space-y-4">
                {/* Evaluator Info */}
                <div className="bg-primary-800/50 rounded-lg p-4 border border-primary-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase mb-1">Evaluator</p>
                      <p className={`text-sm font-medium ${viewReportModal.isLeadMEReport ? 'text-yellow-400' : 'text-white'}`}>
                        {viewReportModal.generatedBy}
                        {viewReportModal.isLeadMEReport && (
                          <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300">
                            LEAD M&E
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase mb-1">Submitted On</p>
                      <p className="text-sm text-white">{new Date(viewReportModal.date).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-primary-800/50 rounded-lg p-4 border border-primary-700">
                  <p className="text-xs text-gray-400 uppercase mb-2">Recommendation</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${viewReportModal.recommendation === 'approve'
                      ? 'bg-green-600 text-white'
                      : viewReportModal.recommendation === 'reject'
                        ? 'bg-red-600 text-white'
                        : 'bg-yellow-600 text-white'
                      }`}>
                      {viewReportModal.recommendation === 'approve' ? '✅ APPROVE' :
                        viewReportModal.recommendation === 'reject' ? '❌ REJECT' :
                          '⏳ PENDING'}
                    </span>
                  </div>
                </div>

                {/* Findings */}
                <div className="bg-primary-800/50 rounded-lg p-4 border border-primary-700">
                  <p className="text-xs text-gray-400 uppercase mb-2">Findings</p>
                  <p className="text-sm text-gray-200 whitespace-pre-wrap">{viewReportModal.findings}</p>
                </div>

                {/* Recommendation Reason */}
                <div className="bg-primary-800/50 rounded-lg p-4 border border-primary-700">
                  <p className="text-xs text-gray-400 uppercase mb-2">Reason for Recommendation</p>
                  <p className="text-sm text-gray-200 whitespace-pre-wrap">{viewReportModal.recommendationReason}</p>
                </div>

                {/* Additional Notes */}
                {viewReportModal.additionalNotes && (
                  <div className="bg-primary-800/50 rounded-lg p-4 border border-primary-700">
                    <p className="text-xs text-gray-400 uppercase mb-2">Additional Notes</p>
                    <p className="text-sm text-gray-200 whitespace-pre-wrap">{viewReportModal.additionalNotes}</p>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-primary-700">
                <button
                  onClick={() => handleDownloadOne(viewReportModal)}
                  className="btn-secondary"
                >
                  ⬇️ Download Report
                </button>
                <button
                  onClick={() => setViewReportModal(null)}
                  className="btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};

export default Reportings;


