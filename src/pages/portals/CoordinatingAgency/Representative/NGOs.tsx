import React, { useMemo, useState } from 'react';
import PortalLayout from '../../../../components/PortalLayout';

const RepresentativeNGOs: React.FC = () => {
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

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [stateFilter, setStateFilter] = useState('All');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgDesc, setOrgDesc] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [reportTitle, setReportTitle] = useState('');

  const nigerianStates = [
    'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara','FCT Abuja'
  ];

  const reports = [
    { id: 'r1', org: 'Heifer International', title: 'Livelihood Impact Report', date: '2025-09-18', state: 'Benue' },
    { id: 'r2', org: 'IFAD Nigeria', title: 'Community Outreach Summary', date: '2025-09-10', state: 'FCT Abuja' },
    { id: 'r3', org: 'Oxfam Nigeria', title: 'Food Security Assessment', date: '2025-09-03', state: 'Kano' },
    { id: 'r4', org: 'CARE Nigeria', title: 'Women in Agric Support', date: '2025-09-01', state: 'Kaduna' },
    { id: 'r5', org: 'ActionAid', title: 'Nutrition Program Update', date: '2025-08-28', state: 'Lagos' }
  ];

  const filtered = useMemo(() => reports.filter(r => {
    const s = search.toLowerCase();
    const matchesText = r.org.toLowerCase().includes(s) || r.title.toLowerCase().includes(s);
    const matchesState = stateFilter === 'All' || r.state === stateFilter;
    return matchesText && matchesState;
  }), [search, stateFilter]);

  const pageSize = 5;
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <PortalLayout role="Coordinating Agency" roleIcon="🏛️" sidebarItems={sidebarItems}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-sans text-gray-100 mb-2">NGOs</h1>
            <p className="text-gray-400 font-serif">Receive and manage reports from NGOs supporting agricultural finance and livelihoods</p>
          </div>
          <div className="sm:pt-1">
            <button onClick={() => setShowCreate(true)} className="px-4 py-2 rounded-md bg-accent-600 hover:bg-accent-500 text-white font-sans">➕ Create</button>
          </div>
        </div>

        <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex flex-col gap-3 mb-4">
            <div className="relative flex-1">
              <input value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} placeholder="Search reports or NGOs..." className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500" />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">🔍</button>
            </div>
            <div>
              <label className="block text-xs text-gray-300 mb-1">State</label>
              <select value={stateFilter} onChange={(e)=>{ setStateFilter(e.target.value); setPage(1); }} className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500">
                <option value="All">All</option>
                {nigerianStates.map(st => (<option key={st} value={st}>{st}</option>))}
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => {
                const ids = paginated.map(p => p.id);
                if (selectedReports.length === ids.length) setSelectedReports([]); else setSelectedReports(ids);
              }} className="btn-secondary w-full sm:w-auto">{selectedReports.length === paginated.length ? '☐ Deselect All' : '☑ Select All'}</button>
              {selectedReports.length > 0 && (
                <>
                  <button className="btn-secondary text-sm">📥 Download Selected</button>
                  <button className="btn-secondary text-sm">📋 Forward Selected</button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {paginated.map((r) => (
              <div key={r.id} className="bg-primary-700 rounded-md p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" checked={selectedReports.includes(r.id)} onChange={() => setSelectedReports(prev => prev.includes(r.id) ? prev.filter(id => id !== r.id) : [...prev, r.id])} className="form-checkbox h-5 w-5 text-accent-500 rounded mt-1" />
                    <div>
                      <p className="text-white font-sans font-medium">{r.title}</p>
                      <p className="text-gray-400 text-sm font-serif">{r.org} • {r.state} • {r.date}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="btn-secondary text-sm">📥 Download</button>
                  <button className="btn-secondary text-sm">📋 Forward</button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
            <button onClick={() => setPage(Math.max(1, page - 1))} className="btn-secondary text-sm p-1" disabled={page === 1}>←</button>
            <span className="text-gray-300 text-sm">Page {page} of {Math.max(totalPages,1)}</span>
            <button onClick={() => setPage(page + 1)} className="btn-secondary text-sm p-1" disabled={page >= totalPages}>→</button>
          </div>
        </div>
        {/* Powered by */}
        <div className="mt-6 text-center text-xs text-gray-400 font-serif opacity-80">
          Powered by Mc. George
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg bg-primary-800 border border-primary-700 rounded-lg shadow-xl">
            <div className="px-4 py-3 border-b border-primary-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white font-sans">Create Representative Organization</h3>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-200">✖</button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Organization Name</label>
                <input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="e.g., Heifer International" className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Organization Description</label>
                <textarea value={orgDesc} onChange={(e) => setOrgDesc(e.target.value)} rows={3} placeholder="Brief description of the organization..." className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Contact Person</label>
                  <input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Full name" className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Email</label>
                  <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="contact@example.com" className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Phone</label>
                  <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+234 800 000 0000" className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Initial Report Title (optional)</label>
                <input value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} placeholder="e.g., Impact Report" className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500" />
              </div>
            </div>
            <div className="px-4 py-3 border-t border-primary-700 flex gap-3 justify-end">
              <button onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
              <button onClick={() => setShowConfirm(true)} className="px-4 py-2 rounded-md bg-accent-600 hover:bg-accent-500 text-white font-sans">Continue</button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md bg-primary-800 border border-primary-700 rounded-lg shadow-xl p-5">
            <h4 className="text-white font-semibold font-sans text-lg mb-2">Confirm Creation</h4>
            <p className="text-gray-300 font-serif mb-4">Create "{orgName || 'New Organization'}"? Please confirm to proceed.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirm(false)} className="btn-secondary">No, Go Back</button>
              <button onClick={() => { setShowConfirm(false); setShowCreate(false); alert('Organization created.'); }} className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-500 text-white font-sans">Yes, Create</button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};

export default RepresentativeNGOs;


