import React, { useState, useMemo, useEffect, useRef } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, showNotification } from '../../../utils/quickActions';
import { getMEProjects } from '../../../utils/localDatabase';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [forwardOpen, setForwardOpen] = useState(false);
  const [forwardTargets, setForwardTargets] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadReportType, setDownloadReportType] = useState('');
  const [downloadFileFormat, setDownloadFileFormat] = useState('PDF');
  const [viewReportModal, setViewReportModal] = useState<any>(null);

  // Ref for page content to download
  const pageContentRef = useRef<HTMLDivElement>(null);

  // Handler to download entire page as PDF
  const handleDownloadPage = async () => {
    if (!pageContentRef.current) return;

    try {
      showNotification('Generating page PDF...', 'info');

      const canvas = await html2canvas(pageContentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#0f172a'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Reports_Page_${new Date().toISOString().split('T')[0]}.pdf`);
      showNotification('Page downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showNotification('Failed to generate PDF', 'error');
    }
  };

  // Ref for graph to download
  const graphRef = useRef<HTMLDivElement>(null);

  // Handler to download graph as image
  const handleDownloadGraph = async () => {
    if (!graphRef.current) return;

    try {
      showNotification('Generating graph image...', 'info');

      const canvas = await html2canvas(graphRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#1e293b'
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Scheme_Performance_Graph_${new Date().toISOString().split('T')[0]}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          showNotification('Graph downloaded successfully!', 'success');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error generating graph image:', error);
      showNotification('Failed to generate graph image', 'error');
    }
  };

  const reportPageSize = 6;

  // Scheme Performance Data
  const getSchemePerformanceData = (state: string) => {
    const baseData = [
      { category: 'Performing', funds: 45000000000, schemes: 156, color: '#22c55e' }, // ₦45B
      { category: 'Non-Performing', funds: 12000000000, schemes: 42, color: '#f59e0b' }, // ₦12B
      { category: 'Bad', funds: 3500000000, schemes: 18, color: '#ef4444' } // ₦3.5B
    ];

    if (state === 'All States') return baseData;

    // Simulate state-specific data with variation
    return baseData.map(item => ({
      ...item,
      funds: Math.floor(item.funds * (0.3 + Math.random() * 0.7)),
      schemes: Math.max(1, Math.floor(item.schemes * (0.3 + Math.random() * 0.7)))
    }));
  };

  const schemeData = useMemo(() => getSchemePerformanceData(selectedState), [selectedState]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    let filtered = reports;

    // Filter by month
    if (selectedMonth !== 'All Months') {
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.date);
        const reportMonth = reportDate.toLocaleString('en-US', { month: 'long' });
        return reportMonth === selectedMonth;
      });
    }

    // Filter by year
    filtered = filtered.filter(report => {
      const reportDate = new Date(report.date);
      const reportYear = reportDate.getFullYear().toString();
      return reportYear === selectedYear;
    });

    // Sort by date (newest first)
    return filtered.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [reports, selectedState, selectedMonth, selectedYear]);

  const paginatedReports = useMemo(() => {
    const start = (reportPage - 1) * reportPageSize;
    return filteredReports.slice(start, start + reportPageSize);
  }, [filteredReports, reportPage]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / reportPageSize));

  useEffect(() => { setReportPage(1); }, [selectedState, selectedMonth, selectedYear]);

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
      <div className="space-y-6" ref={pageContentRef}>
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-4 sm:p-6 text-white">
          <h1 className="text-base sm:text-xl font-bold font-sans mb-2">Reports & Documentation</h1>
          <p className="text-xs sm:text-sm text-gray-200 font-serif">
            Access comprehensive reports, analytics, and documentation for all agricultural finance programs and stakeholder activities.
          </p>
        </div>

        {/* Download Page Button */}
        <div className="flex justify-end">
          <button
            onClick={handleDownloadPage}
            className="btn-primary flex items-center gap-2 px-4 py-2"
          >
            <span>📄</span>
            <span>Download Page as PDF</span>
          </button>
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

        {/* Unified Filters */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-100 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* State Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
              >
                {nigerianStates.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* Month Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
              >
                <option value="All Months">All Months</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            {selectedState === 'All States' && selectedMonth === 'All Months'
              ? `Showing all reports for ${selectedYear}`
              : selectedState === 'All States'
                ? `Showing ${selectedMonth} ${selectedYear} reports across all states`
                : selectedMonth === 'All Months'
                  ? `Showing ${selectedYear} reports for ${selectedState}`
                  : `Showing ${selectedMonth} ${selectedYear} reports for ${selectedState}`}
          </p>
        </div>

        {/* Scheme Performance Graph */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
              <span>📊</span> Scheme Performance vs Funds
            </h3>
            <button
              onClick={handleDownloadGraph}
              className="btn-secondary text-xs px-3 py-2 flex items-center gap-1"
            >
              <span>⬇️</span>
              <span>Download Graph</span>
            </button>
          </div>

          <div ref={graphRef} className="bg-primary-800/50 rounded-lg p-6">
            <div className="w-full h-80">
              <svg width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="performingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="nonPerformingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="badGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {(() => {
                  const maxFunds = Math.max(...schemeData.map(d => d.funds));
                  const padding = 60;
                  const graphWidth = 800 - 2 * padding;
                  const graphHeight = 240;

                  const timePoints = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

                  const createLineData = (baseValue: number, variance: number) => {
                    return timePoints.map((_, index) => {
                      const x = padding + (index / (timePoints.length - 1)) * graphWidth;
                      const randomVariance = (Math.random() - 0.5) * variance;
                      const value = baseValue + randomVariance;
                      const y = 280 - ((value / maxFunds) * graphHeight);
                      return { x, y, value, label: timePoints[index] };
                    });
                  };

                  const performingLine = createLineData(schemeData[0].funds, schemeData[0].funds * 0.1);
                  const nonPerformingLine = createLineData(schemeData[1].funds, schemeData[1].funds * 0.15);
                  const badLine = createLineData(schemeData[2].funds, schemeData[2].funds * 0.2);

                  const createPath = (points: Array<{ x: number, y: number, value: number, label: string }>) => {
                    return points.map((p, i) =>
                      i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
                    ).join(' ');
                  };

                  const createAreaPath = (points: Array<{ x: number, y: number, value: number, label: string }>) => {
                    const linePath = createPath(points);
                    return `${linePath} L ${points[points.length - 1].x} 280 L ${points[0].x} 280 Z`;
                  };

                  return (
                    <>
                      {[0, 1, 2, 3, 4].map((i) => {
                        const y = 40 + (i * graphHeight / 4);
                        return (
                          <line
                            key={i}
                            x1={padding}
                            y1={y}
                            x2={800 - padding}
                            y2={y}
                            stroke="#374151"
                            strokeWidth="1"
                            strokeDasharray="4,4"
                          />
                        );
                      })}

                      {[0, 1, 2, 3, 4].map((i) => {
                        const y = 40 + (i * graphHeight / 4);
                        const value = maxFunds - (i * maxFunds / 4);
                        return (
                          <text
                            key={i}
                            x={padding - 10}
                            y={y + 5}
                            fontSize="12"
                            fill="#9ca3af"
                            textAnchor="end"
                          >
                            ₦{(value / 1000000000).toFixed(0)}B
                          </text>
                        );
                      })}

                      <path d={createAreaPath(performingLine)} fill="url(#performingGradient)" />
                      <path d={createPath(performingLine)} stroke="#22c55e" strokeWidth="3" fill="none" />
                      {performingLine.map((point, i) => (
                        <g key={`perf-${i}`}>
                          <circle cx={point.x} cy={point.y} r="5" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
                          {i === performingLine.length - 1 && (
                            <text x={point.x} y={point.y - 15} fontSize="11" fill="#22c55e" textAnchor="middle" fontWeight="bold">
                              ₦{(point.value / 1000000000).toFixed(1)}B
                            </text>
                          )}
                        </g>
                      ))}

                      <path d={createAreaPath(nonPerformingLine)} fill="url(#nonPerformingGradient)" />
                      <path d={createPath(nonPerformingLine)} stroke="#f59e0b" strokeWidth="3" fill="none" />
                      {nonPerformingLine.map((point, i) => (
                        <g key={`non-${i}`}>
                          <circle cx={point.x} cy={point.y} r="5" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
                          {i === nonPerformingLine.length - 1 && (
                            <text x={point.x} y={point.y - 15} fontSize="11" fill="#f59e0b" textAnchor="middle" fontWeight="bold">
                              ₦{(point.value / 1000000000).toFixed(1)}B
                            </text>
                          )}
                        </g>
                      ))}

                      <path d={createAreaPath(badLine)} fill="url(#badGradient)" />
                      <path d={createPath(badLine)} stroke="#ef4444" strokeWidth="3" fill="none" />
                      {badLine.map((point, i) => (
                        <g key={`bad-${i}`}>
                          <circle cx={point.x} cy={point.y} r="5" fill="#ef4444" stroke="#dc2626" strokeWidth="2" />
                          {i === badLine.length - 1 && (
                            <text x={point.x} y={point.y - 15} fontSize="11" fill="#ef4444" textAnchor="middle" fontWeight="bold">
                              ₦{(point.value / 1000000000).toFixed(1)}B
                            </text>
                          )}
                        </g>
                      ))}

                      {timePoints.map((label, i) => {
                        const x = padding + (i / (timePoints.length - 1)) * graphWidth;
                        return (
                          <text
                            key={label}
                            x={x}
                            y="305"
                            fontSize="12"
                            fill="#9ca3af"
                            textAnchor="middle"
                          >
                            {label}
                          </text>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            </div>

            <div className="mt-6 pt-4 border-t border-primary-700">
              <div className="flex flex-wrap justify-center gap-6 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-300">Performing ({schemeData[0].schemes} schemes)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-gray-300">Non-Performing ({schemeData[1].schemes} schemes)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-300">Bad ({schemeData[2].schemes} schemes)</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center">
                {selectedState === 'All States'
                  ? 'Showing aggregated scheme performance across all states'
                  : `Showing scheme performance for ${selectedState}`}
              </p>
            </div>
          </div>
        </div>


        {/* Reports List Header */}
        <div className="card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-100">M&E Reports</h3>
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


