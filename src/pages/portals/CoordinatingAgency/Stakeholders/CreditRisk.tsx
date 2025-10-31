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

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [forwardOpen, setForwardOpen] = useState(false);
  const [forwardTargets, setForwardTargets] = useState('');
  const itemsPerPage = 6;

  // Create Department modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfirmCreate, setShowConfirmCreate] = useState(false);
  const [newDeptName, setNewDeptName] = useState('Agricultural Credit Risk Management Department');
  const [newDeptDesc, setNewDeptDesc] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  // Dummy data for reports from Credit Risk Management Department
  const reports = [
    { id: 'CRD-REP-001', title: 'Q1 2024 Credit Risk Assessment Report', teamName: 'Risk Assessment Team Alpha', date: '2024-03-31', fileUrl: `${process.env.PUBLIC_URL}/docs/crd-q1-risk-assessment-2024.pdf` },
    { id: 'CRD-REP-002', title: 'PFI Portfolio Risk Analysis - April 2024', teamName: 'Portfolio Risk Team Beta', date: '2024-04-30', fileUrl: `${process.env.PUBLIC_URL}/docs/crd-pfi-portfolio-april-2024.pdf` },
    { id: 'CRD-REP-003', title: 'Default Rate Monitoring Report', teamName: 'Monitoring Team Gamma', date: '2024-05-15', fileUrl: `${process.env.PUBLIC_URL}/docs/crd-default-monitoring-2024.pdf` },
    { id: 'CRD-REP-004', title: 'Credit Scoring Model Validation Q2 2024', teamName: 'Model Validation Team Delta', date: '2024-06-30', fileUrl: `${process.env.PUBLIC_URL}/docs/crd-scoring-validation-q2-2024.pdf` },
    { id: 'CRD-REP-005', title: 'Loan Recovery Performance Analysis', teamName: 'Recovery Analysis Team Epsilon', date: '2024-07-20', fileUrl: `${process.env.PUBLIC_URL}/docs/crd-recovery-analysis-2024.pdf` },
    { id: 'CRD-REP-006', title: 'Risk Mitigation Strategies Report', teamName: 'Mitigation Team Zeta', date: '2024-08-10', fileUrl: `${process.env.PUBLIC_URL}/docs/crd-mitigation-strategies-2024.pdf` },
    { id: 'CRD-REP-007', title: 'Quarterly Credit Risk Dashboard Q3 2024', teamName: 'Dashboard Team Theta', date: '2024-09-30', fileUrl: `${process.env.PUBLIC_URL}/docs/crd-dashboard-q3-2024.pdf` },
    { id: 'CRD-REP-008', title: 'Annual Credit Risk Management Review 2024', teamName: 'Management Review Team Iota', date: '2024-12-15', fileUrl: `${process.env.PUBLIC_URL}/docs/crd-annual-review-2024.pdf` },
  ];

  // Filtered and paginated reports
  const filteredReports = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter(report => 
      `${report.title} ${report.teamName} ${report.id}`.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReports.slice(start, start + itemsPerPage);
  }, [filteredReports, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / itemsPerPage));

  React.useEffect(() => { setCurrentPage(1); }, [searchTerm]);

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
    const a = document.createElement('a');
    a.href = report.fileUrl || '#';
    a.download = `${report.title}.pdf`;
    a.click();
  };

  const handleDownloadSelected = () => {
    const items = reports.filter(r => selectedReports.includes(r.id));
    items.forEach(handleDownloadOne);
  };

  const openForwardModal = () => setForwardOpen(true);
  const closeForwardModal = () => { setForwardOpen(false); setForwardTargets(''); };
  const handleForwardSend = () => {
    alert(`Forwarded ${selectedReports.length} report(s) to: ${forwardTargets || 'recipients'}`);
    closeForwardModal();
  };

  return (
    <PortalLayout role="Coordinating Agency" roleIcon="🏛️" sidebarItems={sidebarItems}>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-sans text-gray-100 mb-2">
              Agricultural Credit Risk Management Department
            </h1>
            <p className="text-gray-400 font-serif">
              Assess, monitor, and mitigate credit risks across agricultural lending portfolios
            </p>
          </div>
          <div className="sm:pt-1">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-md bg-accent-600 hover:bg-accent-500 text-white font-sans transition-colors w-full sm:w-auto"
            >
              ➕ Create Department
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-serif">Total Reports</p>
                <p className="text-2xl font-bold font-sans text-gray-100 mt-1">{reports.length}</p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </div>
          <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-serif">Active Teams</p>
                <p className="text-2xl font-bold font-sans text-gray-100 mt-1">
                  {new Set(reports.map(r => r.teamName)).size}
                </p>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </div>
          <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-serif">This Month</p>
                <p className="text-2xl font-bold font-sans text-gray-100 mt-1">
                  {reports.filter(r => {
                    const reportDate = new Date(r.date);
                    const now = new Date();
                    return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="text-3xl">📅</div>
            </div>
          </div>
          <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-serif">Selected</p>
                <p className="text-2xl font-bold font-sans text-gray-100 mt-1">{selectedReports.length}</p>
              </div>
              <div className="text-3xl">☑️</div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Risk Assessment & Access Management</h2>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <input
                value={searchTerm}
                onChange={(e) => { setCurrentPage(1); setSearchTerm(e.target.value); }}
                placeholder="Search reports..."
                className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                🔍
              </button>
            </div>
            <div className="text-xs text-gray-400 self-center">Tip: use the checkbox to select items on this page</div>
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
                  <th className="px-4 py-2">Team Name</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-700">
                {paginatedReports.map(report => (
                  <tr key={report.id} className="text-gray-100">
                    <td className="px-4 py-2">
                      <input type="checkbox" checked={selectedReports.includes(report.id)} onChange={() => toggleSelect(report.id)} />
                    </td>
                    <td className="px-4 py-2 font-mono text-sm">{report.id}</td>
                    <td className="px-4 py-2">{report.title}</td>
                    <td className="px-4 py-2">{report.teamName}</td>
                    <td className="px-4 py-2">{report.date}</td>
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
              {filteredReports.length === 0 ? 'No items' : `Showing ${((currentPage - 1) * itemsPerPage) + 1} to ${Math.min(currentPage * itemsPerPage, filteredReports.length)} of ${filteredReports.length} reports`}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} 
                disabled={currentPage === 1}
                className="px-3 py-2 bg-primary-700 text-gray-300 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                ← Previous
              </button>
              <span className="px-3 py-2 bg-accent-600 text-white rounded-md text-sm">{currentPage} of {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} 
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-primary-700 text-gray-300 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Powered by */}
        <div className="mt-6 text-center text-xs text-gray-400 font-serif opacity-80">
          Powered by Mc. George
        </div>
      </div>
      {/* Create Department Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg bg-primary-800 border border-primary-700 rounded-lg shadow-xl">
            <div className="px-4 py-3 border-b border-primary-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white font-sans">Create Department</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-200">✖</button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Department Name</label>
                <input value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} placeholder="Enter department name" className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Description</label>
                <textarea value={newDeptDesc} onChange={(e) => setNewDeptDesc(e.target.value)} rows={4} placeholder="Brief purpose and scope of the department..." className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Contact Person</label>
                  <input value={newContactName} onChange={(e) => setNewContactName(e.target.value)} placeholder="e.g., Risk Lead" className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Contact Email</label>
                  <input type="email" value={newContactEmail} onChange={(e) => setNewContactEmail(e.target.value)} placeholder="contact@example.com" className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Contact Phone</label>
                  <input value={newContactPhone} onChange={(e) => setNewContactPhone(e.target.value)} placeholder="e.g., +234 800 000 0000" className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500" />
                </div>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-primary-700 flex flex-col sm:flex-row gap-3 justify-end">
              <button onClick={() => setShowCreateModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={() => setShowConfirmCreate(true)} className="px-4 py-2 rounded-md bg-accent-600 hover:bg-accent-500 text-white font-sans">Continue</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md bg-primary-800 border border-primary-700 rounded-lg shadow-xl p-5">
            <h4 className="text-white font-semibold font-sans text-lg mb-2">Confirm Creation</h4>
            <p className="text-gray-300 font-serif mb-4">Create "{newDeptName}" department? Please confirm to proceed.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button onClick={() => setShowConfirmCreate(false)} className="btn-secondary">No, Go Back</button>
              <button onClick={() => { setShowConfirmCreate(false); setShowCreateModal(false); alert(`Department "${newDeptName}" created.`); }} className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-500 text-white font-sans">Yes, Create</button>
            </div>
          </div>
        </div>
      )}

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
                <textarea value={forwardTargets} onChange={(e) => setForwardTargets(e.target.value)} rows={4} placeholder="Enter email addresses separated by commas..." className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500" />
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

export default CreditRisk;
