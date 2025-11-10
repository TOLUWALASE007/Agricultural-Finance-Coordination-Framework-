import React, { useMemo, useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';

const FAQs: React.FC = () => {
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

  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const faqs = useMemo(() => ([
    { id: 'FAQ-01', question: 'Who is eligible for AFCF funding?', answer: 'Eligibility depends on scheme.', category: 'General' },
    { id: 'FAQ-02', question: 'How do I apply for a loan?', answer: 'Apply through a participating PFI.', category: 'Applications' },
    { id: 'FAQ-03', question: 'What documents are required?', answer: 'KYC and project details are needed.', category: 'Requirements' }
  ]), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(p => `${p.question} ${p.answer} ${p.category} ${p.id}`.toLowerCase().includes(q));
  }, [faqs, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  React.useEffect(() => { setPage(1); }, [search]);

  return (
    <PortalLayout role="Coordinating Agency" roleIcon="🏛️" sidebarItems={sidebarItems}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-sans text-gray-100 mb-2">FAQs</h1>
            <p className="text-gray-400 font-serif">Frequently asked questions about AFCF.</p>
          </div>
          <div className="sm:pt-1">
            <button onClick={() => setShowCreate(true)} className="px-4 py-2 rounded-md bg-accent-600 hover:bg-accent-500 text-white font-sans">➕ Create</button>
          </div>
        </div>

        <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search FAQs..."
              className="w-full sm:w-72 px-3 py-2 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-600"
            />
          </div>

          {/* FAQs List - Mobile Friendly */}
          <div className="flex-1 flex flex-col">
            <div className="space-y-3 flex-1">
              {paginated.map((item) => (
                <div key={item.id} className="p-3 bg-primary-700 rounded-lg border border-primary-600">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-100 font-sans">{item.question}</p>
                          <p className="text-xs text-gray-400 font-serif">{item.id}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-300 font-serif mb-2">
                        <span className="flex items-center gap-1">
                          <span>📁</span> {item.category}
                        </span>
                      </div>
                      <div className="bg-primary-800 p-3 rounded-md mt-2">
                        <p className="text-xs text-gray-400 font-serif mb-1">Answer:</p>
                        <p className="text-sm text-gray-200 whitespace-pre-line">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filtered.length > pageSize && (
              <div className="flex items-center justify-center space-x-2 mt-4 pt-4">
                <button 
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
                  disabled={page === 1}
                  className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                <span className="text-xs text-gray-400">{page} of {totalPages}</span>
                <button 
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} 
                  disabled={page === totalPages}
                  className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>

        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-primary-800 rounded-lg shadow-xl w-full max-w-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Create FAQ</h2>
              <div className="grid gap-3">
                <input className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600" placeholder="Question" />
                <input className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600" placeholder="Category" />
                <textarea className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600" placeholder="Answer" />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-md bg-primary-700 text-gray-200 hover:bg-primary-600">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-md bg-accent-600 text-white hover:bg-accent-500">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default FAQs;


