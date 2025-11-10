import React, { useMemo, useState } from 'react';
import PortalLayout from '../../../../components/PortalLayout';

const CooperativeGroups: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '🏠', href: '/portal/coordinating-agency', hasDropdown: true, dropdownItems: [
      { id: 'activities', name: 'Activities', icon: '⚡', href: '/portal/coordinating-agency/activities' },
      { id: 'fund-schemes', name: 'Fund Schemes', icon: '💼', href: '/portal/coordinating-agency/fund-schemes' },
      { id: 'reportings', name: 'Reports', icon: '📑', href: '/portal/coordinating-agency/reportings' },
      { id: 'trainings', name: 'Trainings', icon: '📚', href: '/portal/coordinating-agency/trainings' }
    ] },
    { id: 'state-monitoring', name: 'State Monitoring Team', icon: '🗺️', href: '/portal/coordinating-agency/monitoring/state' },
    { id: 'representative-body', name: 'Representative Body', icon: '🏛️', href: '/portal/coordinating-agency/representative', hasDropdown: true, dropdownItems: [
      { id: 'rep-insurance', name: 'Insurance Companies', icon: '🛡️', href: '/portal/coordinating-agency/representative/insurance-companies' },
      { id: 'rep-extension', name: 'Extension Organizations', icon: '🌿', href: '/portal/coordinating-agency/representative/extension-organizations' },
      { id: 'rep-ngos', name: 'NGOs', icon: '🤝', href: '/portal/coordinating-agency/representative/ngos' }
    ] },
    { id: 'applicants', name: 'Applicants', icon: '📝', href: '/portal/coordinating-agency/applicants', hasDropdown: true, dropdownItems: [
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
    ] },
    { id: 'stakeholders', name: 'Department', icon: '🤝', href: '/portal/coordinating-agency/stakeholders', hasDropdown: true, dropdownItems: [
      { id: 'fund-management', name: 'Fund Management Department', icon: '💼', href: '/portal/coordinating-agency/stakeholders/fund-management' },
      { id: 'credit-risk', name: 'Agricultural Credit Risk Management Department', icon: '📊', href: '/portal/coordinating-agency/stakeholders/credit-risk' },
      { id: 'insurance', name: 'Agricultural Insurance Management Department', icon: '🛡️', href: '/portal/coordinating-agency/stakeholders/insurance' },
      { id: 'finance', name: 'Finance and Accounting Department', icon: '🪙', href: '/portal/coordinating-agency/stakeholders/finance' },
      { id: 'legal', name: 'Legal Department', icon: '⚖️', href: '/portal/coordinating-agency/stakeholders/legal' },
      { id: 'it', name: 'IT Department', icon: '💻', href: '/portal/coordinating-agency/stakeholders/it' },
      { id: 'training', name: 'Training Department', icon: '📚', href: '/portal/coordinating-agency/stakeholders/training' }
    ] },
    { id: 'publications', name: 'Publications', icon: '📚', href: '/portal/coordinating-agency/publications' },
    { id: 'blog', name: 'Blog', icon: '📰', href: '/portal/coordinating-agency/blog' },
    { id: 'faqs', name: 'FAQs', icon: '❓', href: '/portal/coordinating-agency/faqs' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/coordinating-agency/settings' }
  ];

  // State blocks
  const [approveSearch, setApproveSearch] = useState('');
  const [approvePage, setApprovePage] = useState(1);
  const [approveStateFilter, setApproveStateFilter] = useState('All');
  const [selectedApproveUsers, setSelectedApproveUsers] = useState<string[]>([]);
  const [showApproveMoreInfo, setShowApproveMoreInfo] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState<string | null>(null);
  const [approvalDecision, setApprovalDecision] = useState('');
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [finalApprovalNotice, setFinalApprovalNotice] = useState<string | null>(null);
  const [finalApprovalConfirm, setFinalApprovalConfirm] = useState<{ name: string; decision: string } | null>(null);

  const [editSearch, setEditSearch] = useState('');
  const [editPage, setEditPage] = useState(1);
  const [editStateFilter, setEditStateFilter] = useState('All');
  const [selectedEditUsers, setSelectedEditUsers] = useState<string[]>([]);
  const [showEditMoreInfo, setShowEditMoreInfo] = useState<string | null>(null);
  const [showEditHistory, setShowEditHistory] = useState(false);
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const [editAccessScope, setEditAccessScope] = useState('');
  const [editRemarks, setEditRemarks] = useState('');
  const [editToast, setEditToast] = useState<string | null>(null);
  const [editConfirm, setEditConfirm] = useState<{ name: string; scope: string } | null>(null);

  const [restrictSearch, setRestrictSearch] = useState('');
  const [restrictPage, setRestrictPage] = useState(1);
  const [restrictStateFilter, setRestrictStateFilter] = useState('All');
  const [selectedRestrictUsers, setSelectedRestrictUsers] = useState<string[]>([]);
  const [showRestrictMoreInfo, setShowRestrictMoreInfo] = useState<string | null>(null);
  const [showRestrictHistory, setShowRestrictHistory] = useState(false);
  const [showRestrictModal, setShowRestrictModal] = useState<string | null>(null);
  const [restrictReason, setRestrictReason] = useState('');
  const [restrictRemarks, setRestrictRemarks] = useState('');
  const [restrictToast, setRestrictToast] = useState<string | null>(null);
  const [restrictConfirm, setRestrictConfirm] = useState<{ name: string; reason: string } | null>(null);

  const [approvalRightsSearch, setApprovalRightsSearch] = useState('');
  const [approvalRightsPage, setApprovalRightsPage] = useState(1);
  const [approvalRightsStateFilter, setApprovalRightsStateFilter] = useState('All');
  const [selectedApprovalRightsUsers, setSelectedApprovalRightsUsers] = useState<string[]>([]);
  const [showApprovalRightsMoreInfo, setShowApprovalRightsMoreInfo] = useState<string | null>(null);
  const [showApprovalRightsHistory, setShowApprovalRightsHistory] = useState(false);
  const [showRightsModal, setShowRightsModal] = useState<string | null>(null);
  const [rightsDecision, setRightsDecision] = useState('');
  const [rightsRemarks, setRightsRemarks] = useState('');
  const [rightsToast, setRightsToast] = useState<string | null>(null);
  const [rightsConfirm, setRightsConfirm] = useState<{ name: string; decision: string } | null>(null);

  const pageSize = 3;
  const nigerianStates = [ 'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT Abuja','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara' ];

  // Demo data for Cooperative Groups
  const cooperativeGroups = [
    { id: '1', name: 'Nigerian Farmers Cooperative Union', email: 'contact@nfcunion.com', phone: '+234-1-448-2001', state: 'Kaduna', companyId: 'CG-0001', fullAddress: 'Ahmadu Bello Way, Kaduna, Kaduna State', organizationProfile: 'Large cooperative union representing farmers across northern Nigeria', contactPersonName: 'Alhaji Musa Bello', contactPersonEmail: 'm.bello@nfcunion.com', contactPersonPhone: '+234-802-111-2001', companyEmail: 'info@nfcunion.com', registrationDate: '2024-01-10', organization: 'Nigerian Farmers Cooperative Union', role: 'Cooperative Group', accessScope: 'Full' as const, restricted: false, canApprove: true },
    { id: '2', name: 'Southwest Agricultural Cooperative', email: 'contact@swacooperative.com', phone: '+234-1-448-2002', state: 'Oyo', companyId: 'CG-0002', fullAddress: 'Ibadan, Oyo State', organizationProfile: 'Regional cooperative supporting agricultural development in Southwest', contactPersonName: 'Chief Adewale Ogunleye', contactPersonEmail: 'a.ogunleye@swacooperative.com', contactPersonPhone: '+234-803-222-2002', companyEmail: 'info@swacooperative.com', registrationDate: '2024-01-12', organization: 'Southwest Agricultural Cooperative', role: 'Cooperative Group', accessScope: 'Standard' as const, restricted: false, canApprove: false },
    { id: '3', name: 'Delta State Farmers Alliance', email: 'contact@deltafarmers.com', phone: '+234-1-448-2003', state: 'Delta', companyId: 'CG-0003', fullAddress: 'Asaba, Delta State', organizationProfile: 'State-level cooperative group promoting farmer interests and market access', contactPersonName: 'Dr. Grace Okonkwo', contactPersonEmail: 'g.okonkwo@deltafarmers.com', contactPersonPhone: '+234-804-333-2003', companyEmail: 'info@deltafarmers.com', registrationDate: '2024-01-15', organization: 'Delta State Farmers Alliance', role: 'Cooperative Group', accessScope: 'Basic' as const, restricted: true, canApprove: false },
  ];

  // Filters and pagination (Approve)
  const filteredApproveUsers = useMemo(() => {
    return cooperativeGroups.filter(user => {
      const matchesState = approveStateFilter === 'All' || user.state === approveStateFilter;
      const q = approveSearch.toLowerCase();
      const matchesSearch = user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q) || user.organization.toLowerCase().includes(q);
      return matchesState && matchesSearch;
    });
  }, [approveStateFilter, approveSearch]);
  const paginatedApproveUsers = useMemo(() => {
    const startIndex = (approvePage - 1) * pageSize;
    return filteredApproveUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredApproveUsers, approvePage]);
  const totalApprovePages = Math.ceil(filteredApproveUsers.length / pageSize);
  const approveAllOnPageSelected = paginatedApproveUsers.length > 0 && paginatedApproveUsers.every(u => selectedApproveUsers.includes(u.id));
  const toggleApproveSelectAll = () => {
    if (approveAllOnPageSelected) setSelectedApproveUsers(prev => prev.filter(id => !paginatedApproveUsers.some(u => u.id === id)));
    else setSelectedApproveUsers(prev => [...prev, ...paginatedApproveUsers.map(u => u.id).filter(id => !prev.includes(id))]);
  };

  // Filters and pagination (Edit)
  const filteredEditUsers = useMemo(() => {
    return cooperativeGroups.filter(user => {
      const matchesState = editStateFilter === 'All' || user.state === editStateFilter;
      const q = editSearch.toLowerCase();
      const matchesSearch = user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q) || user.organization.toLowerCase().includes(q);
      return matchesState && matchesSearch;
    });
  }, [editStateFilter, editSearch]);
  const paginatedEditUsers = useMemo(() => {
    const startIndex = (editPage - 1) * pageSize;
    return filteredEditUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredEditUsers, editPage]);
  const totalEditPages = Math.ceil(filteredEditUsers.length / pageSize);
  const editAllOnPageSelected = paginatedEditUsers.length > 0 && paginatedEditUsers.every(u => selectedEditUsers.includes(u.id));
  const toggleEditSelectAll = () => {
    if (editAllOnPageSelected) setSelectedEditUsers(prev => prev.filter(id => !paginatedEditUsers.some(u => u.id === id)));
    else setSelectedEditUsers(prev => [...prev, ...paginatedEditUsers.map(u => u.id).filter(id => !prev.includes(id))]);
  };

  // Filters and pagination (Restrict)
  const filteredRestrictUsers = useMemo(() => {
    return cooperativeGroups.filter(user => {
      const matchesState = restrictStateFilter === 'All' || user.state === restrictStateFilter;
      const q = restrictSearch.toLowerCase();
      const matchesSearch = user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q) || user.organization.toLowerCase().includes(q);
      return matchesState && matchesSearch;
    });
  }, [restrictStateFilter, restrictSearch]);
  const paginatedRestrictUsers = useMemo(() => {
    const startIndex = (restrictPage - 1) * pageSize;
    return filteredRestrictUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredRestrictUsers, restrictPage]);
  const totalRestrictPages = Math.ceil(filteredRestrictUsers.length / pageSize);
  const restrictAllOnPageSelected = paginatedRestrictUsers.length > 0 && paginatedRestrictUsers.every(u => selectedRestrictUsers.includes(u.id));
  const toggleRestrictSelectAll = () => {
    if (restrictAllOnPageSelected) setSelectedRestrictUsers(prev => prev.filter(id => !paginatedRestrictUsers.some(u => u.id === id)));
    else setSelectedRestrictUsers(prev => [...prev, ...paginatedRestrictUsers.map(u => u.id).filter(id => !prev.includes(id))]);
  };

  // Filters and pagination (Rights)
  const filteredRightsUsers = useMemo(() => {
    return cooperativeGroups.filter(user => {
      const matchesState = approvalRightsStateFilter === 'All' || user.state === approvalRightsStateFilter;
      const q = approvalRightsSearch.toLowerCase();
      const matchesSearch = user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q) || user.organization.toLowerCase().includes(q);
      return matchesState && matchesSearch;
    });
  }, [approvalRightsStateFilter, approvalRightsSearch]);
  const paginatedRightsUsers = useMemo(() => {
    const startIndex = (approvalRightsPage - 1) * pageSize;
    return filteredRightsUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredRightsUsers, approvalRightsPage]);
  const totalRightsPages = Math.ceil(filteredRightsUsers.length / pageSize);
  const rightsAllOnPageSelected = paginatedRightsUsers.length > 0 && paginatedRightsUsers.every(u => selectedApprovalRightsUsers.includes(u.id));
  const toggleRightsSelectAll = () => {
    if (rightsAllOnPageSelected) setSelectedApprovalRightsUsers(prev => prev.filter(id => !paginatedRightsUsers.some(u => u.id === id)));
    else setSelectedApprovalRightsUsers(prev => [...prev, ...paginatedRightsUsers.map(u => u.id).filter(id => !prev.includes(id))]);
  };

  const handleApproveCheckboxChange = (userId: string) => setSelectedApproveUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  const handleEditCheckboxChange = (userId: string) => setSelectedEditUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  const handleRestrictCheckboxChange = (userId: string) => setSelectedRestrictUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  const handleApprovalRightsCheckboxChange = (userId: string) => setSelectedApprovalRightsUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);

  return (
    <PortalLayout role="Cooperative Groups" roleIcon="🤝" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        <div className="bg-primary-800 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Cooperative Groups</h1>
              <p className="text-gray-300">Manage access, restrictions, and approval rights for cooperative groups</p>
            </div>
          </div>
        </div>

        {/* Approve Access */}
        <div className="bg-primary-800 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-white">Approve Access</h2>
              <button onClick={() => {}} className="text-xs px-2 py-1 rounded bg-primary-700 text-gray-200 hover:bg-primary-600">📋 View History</button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select value={approveStateFilter} onChange={(e) => { setApproveStateFilter(e.target.value); setApprovePage(1); }} className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm sm:text-base">
                <option value="All">All States</option>
                {nigerianStates.map(state => (<option key={state} value={state}>{state}</option>))}
              </select>
              <div className="relative flex-1">
                <input value={approveSearch} onChange={(e) => { setApproveSearch(e.target.value); setApprovePage(1); }} placeholder="Search cooperative groups..." className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm sm:text-base" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">🔍</button>
              </div>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {paginatedApproveUsers.length > 0 ? (
              <div className="space-y-4">
                {paginatedApproveUsers.map((user) => (
                  <div key={user.id} className="flex items-start bg-primary-800 p-3 rounded-lg shadow-sm">
                    <input
                      type="checkbox"
                      checked={selectedApproveUsers.includes(user.id)}
                      onChange={() => handleApproveCheckboxChange(user.id)}
                      className="form-checkbox h-5 w-5 text-accent-500 rounded mr-3 mt-1"
                    />
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-gray-100 font-sans font-semibold">{user.name}</p>
                          <p className="text-gray-400 text-sm font-serif">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-300 font-serif mb-3">
                        <span className="flex items-center gap-1">
                          <span>👤</span> {user.role}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📍</span> {user.state}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>🏢</span> {user.organization}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => setShowApproveMoreInfo(user.id)} 
                          className="btn-secondary text-sm px-3 py-1"
                        >
                          📋 More Info
                        </button>
                        <button 
                          onClick={() => setShowApprovalModal(user.id)} 
                          className="btn-primary text-sm px-3 py-1"
                        >
                          ✅ Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-gray-400 font-sans">No groups found</p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {filteredApproveUsers.length > pageSize && (
            <div className="flex items-center justify-center space-x-2 mt-4 pt-4">
              <button 
                onClick={() => setApprovePage(prev => Math.max(prev - 1, 1))} 
                disabled={approvePage === 1}
                className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              <span className="text-xs text-gray-400">{approvePage} of {totalApprovePages}</span>
              <button 
                onClick={() => setApprovePage(prev => Math.min(prev + 1, totalApprovePages))} 
                disabled={approvePage === totalApprovePages}
                className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Application Details and Final Approval Modals */}
        {showApproveMoreInfo && (() => {
          const user = cooperativeGroups.find(u => u.id === showApproveMoreInfo);
          return user ? (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowApproveMoreInfo(null)}>
              <div className="min-h-screen flex items-center justify-center py-8">
                <div className="w-full max-w-2xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold font-sans text-gray-100">Application Details</h3>
                    <button onClick={() => setShowApproveMoreInfo(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                  </div>
                  <div className="space-y-3 text-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-primary-800 rounded p-3"><p className="text-xs text-gray-400">Organization</p><p className="text-sm">{user.organization}</p></div>
                      <div className="bg-primary-800 rounded p-3"><p className="text-xs text-gray-400">Company ID</p><p className="text-sm">{user.companyId}</p></div>
                      <div className="bg-primary-800 rounded p-3 md:col-span-2"><p className="text-xs text-gray-400">Address</p><p className="text-sm">{user.fullAddress}</p></div>
                      <div className="bg-primary-800 rounded p-3 md:col-span-2"><p className="text-xs text-gray-400">Profile</p><p className="text-sm">{user.organizationProfile}</p></div>
                      <div className="bg-primary-800 rounded p-3 md:col-span-2">
                        <p className="text-xs text-gray-400 mb-2">Contact Person</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li><span className="text-gray-400">Name:</span> {user.contactPersonName}</li>
                          <li><span className="text-gray-400">Email:</span> {user.contactPersonEmail}</li>
                          <li><span className="text-gray-400">Phone:</span> {user.contactPersonPhone}</li>
                          <li><span className="text-gray-400">Company Email:</span> {user.companyEmail}</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button onClick={() => { setShowApproveMoreInfo(null); setShowApprovalModal(user.id); }} className="btn-primary">Proceed to Approval</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {showApprovalModal && (() => {
          const user = cooperativeGroups.find(u => u.id === showApprovalModal);
          return user ? (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowApprovalModal(null)}>
              <div className="min-h-screen flex items-center justify-center py-8">
                <div className="w-full max-w-xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold font-sans text-gray-100">Final Approval</h3>
                    <button onClick={() => setShowApprovalModal(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); setShowApprovalModal(null); setFinalApprovalConfirm({ name: user.name, decision: approvalDecision || 'approve' }); setFinalApprovalNotice(`✅ Final decision submitted for ${user.name}`); setTimeout(() => setFinalApprovalNotice(null), 2500); }} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 font-serif mb-1">Decision</label>
                      <select value={approvalDecision} onChange={(e) => setApprovalDecision(e.target.value)} className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600">
                        <option value="">Select decision</option>
                        <option value="approve">Approve</option>
                        <option value="reject">Reject</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 font-serif mb-1">Remarks</label>
                      <textarea value={approvalRemarks} onChange={(e) => setApprovalRemarks(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600" placeholder="Add remarks (optional)" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setShowApprovalModal(null)} className="btn-secondary">Cancel</button>
                      <button type="submit" className="btn-primary">Submit Decision</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {finalApprovalNotice && (<div className="fixed right-4 bottom-4 sm:right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">{finalApprovalNotice}</div>)}
        {finalApprovalConfirm && (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setFinalApprovalConfirm(null)}>
            <div className="min-h-screen flex items-center justify-center py-8">
              <div className="w-full max-w-md bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-3"><h3 className="text-lg font-semibold font-sans text-gray-100">Final Confirmation</h3><button onClick={() => setFinalApprovalConfirm(null)} className="text-gray-400 hover:text-gray-200">✖</button></div>
                <p className="text-gray-200 mb-4">✅ Decision <span className="font-semibold">{finalApprovalConfirm.decision === 'approve' ? 'Approved' : 'Rejected'}</span> submitted for <span className="font-semibold">{finalApprovalConfirm.name}</span>.</p>
                <div className="flex justify-end"><button onClick={() => setFinalApprovalConfirm(null)} className="btn-primary">Close</button></div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Access */}
        <div className="bg-primary-800 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-white">Edit Access</h2>
              <button onClick={() => setShowEditHistory(true)} className="text-xs px-2 py-1 rounded bg-primary-700 text-gray-200 hover:bg-primary-600">📋 View History</button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select value={editStateFilter} onChange={(e) => { setEditStateFilter(e.target.value); setEditPage(1); }} className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm sm:text-base">
                <option value="All">All States</option>
                {nigerianStates.map(state => (<option key={state} value={state}>{state}</option>))}
              </select>
              <div className="relative flex-1">
                <input value={editSearch} onChange={(e) => { setEditSearch(e.target.value); setEditPage(1); }} placeholder="Search cooperative groups..." className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm sm:text-base" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">🔍</button>
              </div>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {paginatedEditUsers.length > 0 ? (
              <div className="space-y-4">
                {paginatedEditUsers.map((user) => (
                  <div key={user.id} className="flex items-start bg-primary-800 p-3 rounded-lg shadow-sm">
                    <input
                      type="checkbox"
                      checked={selectedEditUsers.includes(user.id)}
                      onChange={() => handleEditCheckboxChange(user.id)}
                      className="form-checkbox h-5 w-5 text-accent-500 rounded mr-3 mt-1"
                    />
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-gray-100 font-sans font-semibold">{user.name}</p>
                          <p className="text-gray-400 text-sm font-serif">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-300 font-serif mb-3">
                        <span className="flex items-center gap-1">
                          <span>👤</span> {user.role}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📍</span> {user.state}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>🏢</span> {user.organization}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => setShowEditMoreInfo(user.id)} 
                          className="btn-secondary text-sm px-3 py-1"
                        >
                          📋 More Info
                        </button>
                        <button 
                          onClick={() => setShowEditModal(user.id)} 
                          className="btn-primary text-sm px-3 py-1"
                        >
                          ✅ Apply Changes
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-gray-400 font-sans">No groups found</p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {filteredEditUsers.length > pageSize && (
            <div className="flex items-center justify-center space-x-2 mt-4 pt-4">
              <button 
                onClick={() => setEditPage(prev => Math.max(prev - 1, 1))} 
                disabled={editPage === 1}
                className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              <span className="text-xs text-gray-400">{editPage} of {totalEditPages}</span>
              <button 
                onClick={() => setEditPage(prev => Math.min(prev + 1, totalEditPages))} 
                disabled={editPage === totalEditPages}
                className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Restrict Access */}
        <div className="bg-primary-800 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-white">Restrict Access</h2>
              <button onClick={() => setShowRestrictHistory(true)} className="text-xs px-2 py-1 rounded bg-primary-700 text-gray-200 hover:bg-primary-600">📋 View History</button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select value={restrictStateFilter} onChange={(e) => { setRestrictStateFilter(e.target.value); setRestrictPage(1); }} className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm sm:text-base">
                <option value="All">All States</option>
                {nigerianStates.map(state => (<option key={state} value={state}>{state}</option>))}
              </select>
              <div className="relative flex-1">
                <input value={restrictSearch} onChange={(e) => { setRestrictSearch(e.target.value); setRestrictPage(1); }} placeholder="Search cooperative groups..." className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm sm:text-base" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">🔍</button>
              </div>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {paginatedRestrictUsers.length > 0 ? (
              <div className="space-y-4">
                {paginatedRestrictUsers.map((user) => (
                  <div key={user.id} className="flex items-start bg-primary-800 p-3 rounded-lg shadow-sm">
                    <input
                      type="checkbox"
                      checked={selectedRestrictUsers.includes(user.id)}
                      onChange={() => handleRestrictCheckboxChange(user.id)}
                      className="form-checkbox h-5 w-5 text-accent-500 rounded mr-3 mt-1"
                    />
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-gray-100 font-sans font-semibold">{user.name}</p>
                          <p className="text-gray-400 text-sm font-serif">{user.email}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.restricted ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                        }`}>
                          {user.restricted ? 'Restricted' : 'Active'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-300 font-serif mb-3">
                        <span className="flex items-center gap-1">
                          <span>👤</span> {user.role}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📍</span> {user.state}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>🏢</span> {user.organization}
                        </span>
                      </div>
                      <div className="bg-primary-700 p-2 rounded-md mb-2">
                        <label className="flex items-center gap-2 text-sm text-gray-300 font-serif cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!user.restricted}
                            onChange={() => {/* toggleRestrict(user.id) */}}
                            className="accent-accent-500 w-4 h-4"
                          />
                          <span>Grant Active Access (Unrestrict User)</span>
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => setShowRestrictMoreInfo(user.id)} 
                          className="btn-secondary text-sm px-3 py-1"
                        >
                          📋 More Info
                        </button>
                        <button 
                          onClick={() => setShowRestrictModal(user.id)} 
                          className="btn-primary text-sm px-3 py-1"
                        >
                          ✅ Apply Changes
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-gray-400 font-sans">No groups found</p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {filteredRestrictUsers.length > pageSize && (
            <div className="flex items-center justify-center space-x-2 mt-4 pt-4">
              <button 
                onClick={() => setRestrictPage(prev => Math.max(prev - 1, 1))} 
                disabled={restrictPage === 1}
                className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              <span className="text-xs text-gray-400">{restrictPage} of {totalRestrictPages}</span>
              <button 
                onClick={() => setRestrictPage(prev => Math.min(prev + 1, totalRestrictPages))} 
                disabled={restrictPage === totalRestrictPages}
                className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Approval Rights */}
        <div className="bg-primary-800 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-white">Approval Rights</h2>
              <button onClick={() => setShowApprovalRightsHistory(true)} className="text-xs px-2 py-1 rounded bg-primary-700 text-gray-200 hover:bg-primary-600">📋 View History</button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select value={approvalRightsStateFilter} onChange={(e) => { setApprovalRightsStateFilter(e.target.value); setApprovalRightsPage(1); }} className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm sm:text-base">
                <option value="All">All States</option>
                {nigerianStates.map(state => (<option key={state} value={state}>{state}</option>))}
              </select>
              <div className="relative flex-1">
                <input value={approvalRightsSearch} onChange={(e) => { setApprovalRightsSearch(e.target.value); setApprovalRightsPage(1); }} placeholder="Search cooperative groups..." className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm sm:text-base" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">🔍</button>
              </div>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {paginatedRightsUsers.length > 0 ? (
              <div className="space-y-4">
                {paginatedRightsUsers.map((user) => (
                  <div key={user.id} className="flex items-start bg-primary-800 p-3 rounded-lg shadow-sm">
                    <input
                      type="checkbox"
                      checked={selectedApprovalRightsUsers.includes(user.id)}
                      onChange={() => handleApprovalRightsCheckboxChange(user.id)}
                      className="form-checkbox h-5 w-5 text-accent-500 rounded mr-3 mt-1"
                    />
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-gray-100 font-sans font-semibold">{user.name}</p>
                          <p className="text-gray-400 text-sm font-serif">{user.email}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.canApprove ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                        }`}>
                          {user.canApprove ? 'Can Approve' : 'No Approval Rights'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-300 font-serif mb-3">
                        <span className="flex items-center gap-1">
                          <span>👤</span> {user.role}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📍</span> {user.state}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>🏢</span> {user.organization}
                        </span>
                      </div>
                      <div className="bg-primary-700 p-2 rounded-md mb-2">
                        <label className="flex items-center gap-2 text-sm text-gray-300 font-serif cursor-pointer">
                          <input
                            type="checkbox"
                            checked={user.canApprove}
                            onChange={() => {/* toggleApprovalRights(user.id) */}}
                            className="accent-accent-500 w-4 h-4"
                          />
                          <span>Grant Approval Rights</span>
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => setShowApprovalRightsMoreInfo(user.id)} 
                          className="btn-secondary text-sm px-3 py-1"
                        >
                          📋 More Info
                        </button>
                        <button 
                          onClick={() => setShowRightsModal(user.id)} 
                          className="btn-primary text-sm px-3 py-1"
                        >
                          ✅ Apply Changes
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-gray-400 font-sans">No groups found</p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {filteredRightsUsers.length > pageSize && (
            <div className="flex items-center justify-center space-x-2 mt-4 pt-4">
              <button 
                onClick={() => setApprovalRightsPage(prev => Math.max(prev - 1, 1))} 
                disabled={approvalRightsPage === 1}
                className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              <span className="text-xs text-gray-400">{approvalRightsPage} of {totalRightsPages}</span>
              <button 
                onClick={() => setApprovalRightsPage(prev => Math.min(prev + 1, totalRightsPages))} 
                disabled={approvalRightsPage === totalRightsPages}
                className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Modals shared (Edit/Restrict/Rights) */}
        {showEditModal && (() => {
          const user = cooperativeGroups.find(u => u.id === showEditModal);
          return user ? (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowEditModal(null)}>
              <div className="min-h-screen flex items-center justify-center py-8">
                <div className="w-full max-w-xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4"><h3 className="text-lg font-semibold font-sans text-gray-100">Edit Access</h3><button onClick={() => setShowEditModal(null)} className="text-gray-400 hover:text-gray-200">✖</button></div>
                  <form onSubmit={(e) => { e.preventDefault(); setShowEditModal(null); setEditToast(`✅ Access updated for ${user.name}`); setEditConfirm({ name: user.name, scope: editAccessScope || String(user.accessScope) }); setTimeout(() => setEditToast(null), 2500); }} className="space-y-4">
                    <div><label className="block text-sm text-gray-300 font-serif mb-1">Access Scope</label><select value={editAccessScope} onChange={(e) => setEditAccessScope(e.target.value)} className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"><option value="">Select scope</option><option value="Basic">Basic</option><option value="Standard">Standard</option><option value="Full">Full</option></select></div>
                    <div><label className="block text-sm text-gray-300 font-serif mb-1">Remarks</label><textarea value={editRemarks} onChange={(e) => setEditRemarks(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600" placeholder="What changed and why?" /></div>
                    <div className="flex justify-end gap-2"><button type="button" onClick={() => setShowEditModal(null)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">Save Changes</button></div>
                  </form>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {showRestrictModal && (() => {
          const user = cooperativeGroups.find(u => u.id === showRestrictModal);
          return user ? (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowRestrictModal(null)}>
              <div className="min-h-screen flex items-center justify-center py-8">
                <div className="w-full max-w-xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4"><h3 className="text-lg font-semibold font-sans text-gray-100">Restrict Access</h3><button onClick={() => setShowRestrictModal(null)} className="text-gray-400 hover:text-gray-200">✖</button></div>
                  <form onSubmit={(e) => { e.preventDefault(); setShowRestrictModal(null); setRestrictToast(`🚫 Access restricted for ${user.name}`); setRestrictConfirm({ name: user.name, reason: restrictReason || 'Non-compliance' }); setTimeout(() => setRestrictToast(null), 2500); }} className="space-y-4">
                    <div><label className="block text-sm text-gray-300 font-serif mb-1">Reason</label><select value={restrictReason} onChange={(e) => setRestrictReason(e.target.value)} className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"><option value="">Select reason</option><option value="Non-compliance">Non-compliance</option><option value="Incomplete documents">Incomplete documents</option><option value="Fraud suspicion">Fraud suspicion</option><option value="Other">Other</option></select></div>
                    <div><label className="block text-sm text-gray-300 font-serif mb-1">Remarks</label><textarea value={restrictRemarks} onChange={(e) => setRestrictRemarks(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600" placeholder="Provide details (optional)" /></div>
                    <div className="flex justify-end gap-2"><button type="button" onClick={() => setShowRestrictModal(null)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">Restrict</button></div>
                  </form>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {showRightsModal && (() => {
          const user = cooperativeGroups.find(u => u.id === showRightsModal);
          return user ? (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowRightsModal(null)}>
              <div className="min-h-screen flex items-center justify-center py-8">
                <div className="w-full max-w-xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4"><h3 className="text-lg font-semibold font-sans text-gray-100">Update Approval Rights</h3><button onClick={() => setShowRightsModal(null)} className="text-gray-400 hover:text-gray-200">✖</button></div>
                  <form onSubmit={(e) => { e.preventDefault(); setShowRightsModal(null); setRightsToast(`✅ Approval rights updated for ${user.name}`); setRightsConfirm({ name: user.name, decision: rightsDecision || (user.canApprove ? 'Revoke' : 'Grant') }); setTimeout(() => setRightsToast(null), 2500); }} className="space-y-4">
                    <div><label className="block text-sm text-gray-300 font-serif mb-1">Decision</label><select value={rightsDecision} onChange={(e) => setRightsDecision(e.target.value)} className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"><option value="">Select decision</option><option value="Grant">Grant</option><option value="Revoke">Revoke</option></select></div>
                    <div><label className="block text-sm text-gray-300 font-serif mb-1">Remarks</label><textarea value={rightsRemarks} onChange={(e) => setRightsRemarks(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600" placeholder="Provide details (optional)" /></div>
                    <div className="flex justify-end gap-2"><button type="button" onClick={() => setShowRightsModal(null)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">Update Rights</button></div>
                  </form>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {/* Toasts & Confirmations */}
        {editToast && (<div className="fixed right-4 bottom-24 z-50 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg">{editToast}</div>)}
        {restrictToast && (<div className="fixed right-4 bottom-24 z-50 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg">{restrictToast}</div>)}
        {rightsToast && (<div className="fixed right-4 bottom-24 z-50 bg-purple-600 text-white px-4 py-3 rounded-lg shadow-lg">{rightsToast}</div>)}
        {editConfirm && (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setEditConfirm(null)}>
            <div className="min-h-screen flex items-center justify-center py-8">
              <div className="w-full max-w-md bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-3"><h3 className="text-lg font-semibold font-sans text-gray-100">Edit Confirmation</h3><button onClick={() => setEditConfirm(null)} className="text-gray-400 hover:text-gray-200">✖</button></div>
                <p className="text-gray-200 mb-4">✅ Access for <span className="font-semibold">{editConfirm.name}</span> updated to scope <span className="font-semibold">{editConfirm.scope || '—'}</span>.</p>
                <div className="flex justify-end"><button onClick={() => setEditConfirm(null)} className="btn-primary">Close</button></div>
              </div>
            </div>
          </div>
        )}
        {restrictConfirm && (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setRestrictConfirm(null)}>
            <div className="min-h-screen flex items-center justify-center py-8">
              <div className="w-full max-w-md bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-3"><h3 className="text-lg font-semibold font-sans text-gray-100">Restriction Confirmation</h3><button onClick={() => setRestrictConfirm(null)} className="text-gray-400 hover:text-gray-200">✖</button></div>
                <p className="text-gray-200 mb-4">🚫 Access for <span className="font-semibold">{restrictConfirm.name}</span> restricted. Reason: <span className="font-semibold">{restrictConfirm.reason}</span>.</p>
                <div className="flex justify-end"><button onClick={() => setRestrictConfirm(null)} className="btn-primary">Close</button></div>
              </div>
            </div>
          </div>
        )}
        {rightsConfirm && (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setRightsConfirm(null)}>
            <div className="min-h-screen flex items-center justify-center py-8">
              <div className="w-full max-w-md bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-3"><h3 className="text-lg font-semibold font-sans text-gray-100">Approval Rights Confirmation</h3><button onClick={() => setRightsConfirm(null)} className="text-gray-400 hover:text-gray-200">✖</button></div>
                <p className="text-gray-200 mb-4">✅ Rights for <span className="font-semibold">{rightsConfirm.name}</span>: <span className="font-semibold">{rightsConfirm.decision}</span>.</p>
                <div className="flex justify-end"><button onClick={() => setRightsConfirm(null)} className="btn-primary">Close</button></div>
              </div>
            </div>
          </div>
        )}
        {/* Footer */}
        <div className="text-center text-gray-400 text-sm py-4">Powered by Mc. George</div>
      </div>
    </PortalLayout>
  );
};

export default CooperativeGroups;
