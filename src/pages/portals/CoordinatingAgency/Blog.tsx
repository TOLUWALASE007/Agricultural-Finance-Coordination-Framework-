import React, { useMemo, useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';

const Blog: React.FC = () => {
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

  const posts = useMemo(() => ([
    { id: 'BLG-101', title: 'Program Launch Highlights', author: 'Admin', date: '2024-10-02', content: 'Today we launched a new program aimed at empowering smallholders with access to credit, inputs, and extension support. This blog details the objectives, partners, and expected outcomes.' },
    { id: 'BLG-102', title: 'How AFCF Supports Smallholders', author: 'Comms', date: '2024-09-15', content: 'AFCF connects farmers to PFIs and input suppliers while ensuring transparency and efficient fund disbursement. Learn how the framework works end-to-end.' },
    { id: 'BLG-103', title: 'Q3 Activities Roundup', author: 'Team', date: '2024-09-01', content: 'From monitoring missions in Kano and Kaduna to training sessions for PFIs, here is a summary of Q3 highlights and what to expect in Q4.' }
  ]), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(p => `${p.title} ${p.author} ${p.id}`.toLowerCase().includes(q));
  }, [posts, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  React.useEffect(() => { setPage(1); }, [search]);

  const [reading, setReading] = useState<{ id: string; title: string; author: string; date: string; content: string } | null>(null);

  return (
    <PortalLayout role="Coordinating Agency" roleIcon="🏛️" sidebarItems={sidebarItems}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-sans text-gray-100 mb-2">Blog</h1>
            <p className="text-gray-400 font-serif">Read and manage AFCF blog posts.</p>
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
              placeholder="Search posts..."
              className="w-full sm:w-72 px-3 py-2 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-600"
            />
          </div>

          {/* Blog Posts List - Mobile Friendly */}
          <div className="flex-1 flex flex-col">
            <div className="space-y-3 flex-1">
              {paginated.map((item) => (
                <div key={item.id} className="p-3 bg-primary-700 rounded-lg border border-primary-600">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-100 font-sans">{item.title}</p>
                          <p className="text-xs text-gray-400 font-serif">{item.id}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-300 font-serif mb-2">
                        <span className="flex items-center gap-1">
                          <span>👤</span> {item.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📅</span> {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setReading(item as any)}
                          className="text-xs text-accent-400 hover:text-accent-300 font-medium"
                        >
                          📖 Read
                        </button>
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

        {reading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-primary-800 rounded-lg shadow-xl w-full max-w-2xl p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-xl font-semibold text-gray-100">{reading.title}</h2>
                  <p className="text-xs text-gray-400">By {reading.author} • {reading.date}</p>
                </div>
                <button onClick={() => setReading(null)} className="text-gray-400 hover:text-gray-200">✖</button>
              </div>
              <div className="mt-3 text-gray-100 whitespace-pre-line leading-relaxed">
                {reading.content}
              </div>
            </div>
          </div>
        )}

        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-primary-800 rounded-lg shadow-xl w-full max-w-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Create Blog Post</h2>
              <div className="grid gap-3">
                <input className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600" placeholder="Title" />
                <input className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600" placeholder="Author" />
                <textarea className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600" placeholder="Content" />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-md bg-primary-700 text-gray-200 hover:bg-primary-600">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-md bg-accent-600 text-white hover:bg-accent-500">Publish</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default Blog;


