import React, { useState, useMemo } from 'react';
import PortalLayout from '../../../../components/PortalLayout';

const PFIApplicants: React.FC = () => {
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

  // State for different access management sections
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

  // Nigerian states
  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
    'Taraba', 'Yobe', 'Zamfara'
  ];

  // Demo data for PFI applicants
  const pfiApplicants = [
    {
      id: '1',
      name: 'First Bank of Nigeria',
      email: 'agriculture@firstbank.ng',
      phone: '+234-1-905-5555',
      state: 'Lagos',
      companyId: 'RC-001234',
      fullAddress: '35 Marina, Lagos Island, Lagos State, Nigeria',
      organizationProfile: 'Leading commercial bank with extensive agricultural finance portfolio',
      contactPersonName: 'Mr. Tunde Adebayo',
      contactPersonEmail: 'tunde.adebayo@firstbank.ng',
      contactPersonPhone: '+234-802-123-4567',
      companyEmail: 'info@firstbank.ng',
      registrationDate: '2024-01-10',
      organization: 'First Bank of Nigeria',
      role: 'PFI',
      accessScope: 'Full' as const,
      restricted: false,
      canApprove: true
    },
    {
      id: '2',
      name: 'Access Bank Plc',
      email: 'agribusiness@accessbank.ng',
      phone: '+234-1-280-5000',
      state: 'Lagos',
      companyId: 'RC-002345',
      fullAddress: '14/15 Ahmadu Bello Way, Victoria Island, Lagos State, Nigeria',
      organizationProfile: 'Commercial bank with strong focus on agricultural lending',
      contactPersonName: 'Ms. Funmi Ojo',
      contactPersonEmail: 'funmi.ojo@accessbank.ng',
      contactPersonPhone: '+234-803-234-5678',
      companyEmail: 'contact@accessbank.ng',
      registrationDate: '2024-01-12',
      organization: 'Access Bank Plc',
      role: 'PFI',
      accessScope: 'Standard' as const,
      restricted: false,
      canApprove: false
    },
    {
      id: '3',
      name: 'Zenith Bank Plc',
      email: 'agriculture@zenithbank.ng',
      phone: '+234-1-278-7000',
      state: 'Lagos',
      companyId: 'RC-003456',
      fullAddress: 'Plot 84, Ajose Adeogun Street, Victoria Island, Lagos State, Nigeria',
      organizationProfile: 'Leading financial institution with agricultural finance expertise',
      contactPersonName: 'Dr. Ibrahim Hassan',
      contactPersonEmail: 'ibrahim.hassan@zenithbank.ng',
      contactPersonPhone: '+234-804-345-6789',
      companyEmail: 'info@zenithbank.ng',
      registrationDate: '2024-01-15',
      organization: 'Zenith Bank Plc',
      role: 'PFI',
      accessScope: 'Full' as const,
      restricted: false,
      canApprove: true
    },
    {
      id: '4',
      name: 'Union Bank of Nigeria',
      email: 'agribusiness@unionbank.ng',
      phone: '+234-1-271-5000',
      state: 'Lagos',
      companyId: 'RC-004567',
      fullAddress: '36 Marina, Lagos Island, Lagos State, Nigeria',
      organizationProfile: 'Established bank with agricultural lending programs',
      contactPersonName: 'Mrs. Grace Okonkwo',
      contactPersonEmail: 'grace.okonkwo@unionbank.ng',
      contactPersonPhone: '+234-805-456-7890',
      companyEmail: 'support@unionbank.ng',
      registrationDate: '2024-01-18',
      organization: 'Union Bank of Nigeria',
      role: 'PFI',
      accessScope: 'Basic' as const,
      restricted: true,
      canApprove: false
    },
    {
      id: '5',
      name: 'GTBank Plc',
      email: 'agriculture@gtbank.ng',
      phone: '+234-1-271-0000',
      state: 'Lagos',
      companyId: 'RC-005678',
      fullAddress: '635 Akin Adesola Street, Victoria Island, Lagos State, Nigeria',
      organizationProfile: 'Innovative bank with digital agricultural finance solutions',
      contactPersonName: 'Mr. Chidi Nwosu',
      contactPersonEmail: 'chidi.nwosu@gtbank.ng',
      contactPersonPhone: '+234-806-567-8901',
      companyEmail: 'info@gtbank.ng',
      registrationDate: '2024-01-20',
      organization: 'GTBank Plc',
      role: 'PFI',
      accessScope: 'Standard' as const,
      restricted: false,
      canApprove: true
    }
  ];

  // Filter and paginate functions
  const filteredApproveUsers = useMemo(() => {
    return pfiApplicants.filter(user => {
      const matchesState = approveStateFilter === 'All' || user.state === approveStateFilter;
      const matchesSearch = user.name.toLowerCase().includes(approveSearch.toLowerCase()) ||
                           user.email.toLowerCase().includes(approveSearch.toLowerCase()) ||
                           user.organization.toLowerCase().includes(approveSearch.toLowerCase());
      return matchesState && matchesSearch;
    });
  }, [approveStateFilter, approveSearch]);

  const paginatedApproveUsers = useMemo(() => {
    const startIndex = (approvePage - 1) * pageSize;
    return filteredApproveUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredApproveUsers, approvePage]);

  const totalApprovePages = Math.ceil(filteredApproveUsers.length / pageSize);

  // Select-all helpers (Approve)
  const approveAllOnPageSelected = paginatedApproveUsers.length > 0 && paginatedApproveUsers.every(u => selectedApproveUsers.includes(u.id));
  const toggleApproveSelectAll = () => {
    if (approveAllOnPageSelected) {
      setSelectedApproveUsers(prev => prev.filter(id => !paginatedApproveUsers.some(u => u.id === id)));
    } else {
      const toAdd = paginatedApproveUsers.map(u => u.id).filter(id => !selectedApproveUsers.includes(id));
      setSelectedApproveUsers(prev => [...prev, ...toAdd]);
    }
  };

  // Similar functions for other sections
  const filteredEditUsers = useMemo(() => {
    return pfiApplicants.filter(user => {
      const matchesState = editStateFilter === 'All' || user.state === editStateFilter;
      const matchesSearch = user.name.toLowerCase().includes(editSearch.toLowerCase()) ||
                           user.email.toLowerCase().includes(editSearch.toLowerCase()) ||
                           user.organization.toLowerCase().includes(editSearch.toLowerCase());
      return matchesState && matchesSearch;
    });
  }, [editStateFilter, editSearch]);

  const paginatedEditUsers = useMemo(() => {
    const startIndex = (editPage - 1) * pageSize;
    return filteredEditUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredEditUsers, editPage]);

  const totalEditPages = Math.ceil(filteredEditUsers.length / pageSize);

  // Select-all helpers (Edit)
  const editAllOnPageSelected = paginatedEditUsers.length > 0 && paginatedEditUsers.every(u => selectedEditUsers.includes(u.id));
  const toggleEditSelectAll = () => {
    if (editAllOnPageSelected) {
      setSelectedEditUsers(prev => prev.filter(id => !paginatedEditUsers.some(u => u.id === id)));
    } else {
      const toAdd = paginatedEditUsers.map(u => u.id).filter(id => !selectedEditUsers.includes(id));
      setSelectedEditUsers(prev => [...prev, ...toAdd]);
    }
  };

  // Handlers
  const handleApproveCheckboxChange = (userId: string) => {
    setSelectedApproveUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleMassApprove = () => {
    if (selectedApproveUsers.length === 0) return;
    alert(`Approved ${selectedApproveUsers.length} PFI applications`);
    setSelectedApproveUsers([]);
  };

  const handleEditCheckboxChange = (userId: string) => {
    setSelectedEditUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleMassEditApply = () => {
    if (selectedEditUsers.length === 0) return;
    alert(`Updated access for ${selectedEditUsers.length} PFI users`);
    setSelectedEditUsers([]);
  };

  const handleRestrictCheckboxChange = (userId: string) => {
    setSelectedRestrictUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleMassRestrict = () => {
    if (selectedRestrictUsers.length === 0) return;
    alert(`Restricted access for ${selectedRestrictUsers.length} PFI users`);
    setSelectedRestrictUsers([]);
  };

  // Select-all helpers (Restrict)
  const restrictAllOnPageSelected = paginatedEditUsers.length > 0 && paginatedEditUsers.every(u => selectedRestrictUsers.includes(u.id));
  const toggleRestrictSelectAll = () => {
    if (restrictAllOnPageSelected) {
      setSelectedRestrictUsers(prev => prev.filter(id => !paginatedEditUsers.some(u => u.id === id)));
    } else {
      const toAdd = paginatedEditUsers.map(u => u.id).filter(id => !selectedRestrictUsers.includes(id));
      setSelectedRestrictUsers(prev => [...prev, ...toAdd]);
    }
  };

  const handleApprovalRightsCheckboxChange = (userId: string) => {
    setSelectedApprovalRightsUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleMassApprovalRights = () => {
    if (selectedApprovalRightsUsers.length === 0) return;
    alert(`Updated approval rights for ${selectedApprovalRightsUsers.length} PFI users`);
    setSelectedApprovalRightsUsers([]);
  };

  // Select-all helpers (Rights)
  const rightsAllOnPageSelected = paginatedEditUsers.length > 0 && paginatedEditUsers.every(u => selectedApprovalRightsUsers.includes(u.id));
  const toggleRightsSelectAll = () => {
    if (rightsAllOnPageSelected) {
      setSelectedApprovalRightsUsers(prev => prev.filter(id => !paginatedEditUsers.some(u => u.id === id)));
    } else {
      const toAdd = paginatedEditUsers.map(u => u.id).filter(id => !selectedApprovalRightsUsers.includes(id));
      setSelectedApprovalRightsUsers(prev => [...prev, ...toAdd]);
    }
  };

  return (
    <PortalLayout role="PFI Applicants" roleIcon="🏦" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-primary-800 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">PFI Applicants</h1>
              <p className="text-gray-300">
                Manage access, permissions, and approval rights for Participating Financial Institution applicants
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="btn-primary">
                📊 Generate Report
              </button>
              <button className="btn-secondary">
                📈 Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Approve: Application Details and Final Approval */}
        {showApproveMoreInfo && (() => {
          const user = pfiApplicants.find(u => u.id === showApproveMoreInfo);
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
          const user = pfiApplicants.find(u => u.id === showApprovalModal);
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

        {finalApprovalNotice && (
          <div className="fixed right-4 bottom-4 sm:right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">{finalApprovalNotice}</div>
        )}

        {finalApprovalConfirm && (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setFinalApprovalConfirm(null)}>
            <div className="min-h-screen flex items-center justify-center py-8">
              <div className="w-full max-w-md bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold font-sans text-gray-100">Final Confirmation</h3>
                  <button onClick={() => setFinalApprovalConfirm(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                </div>
                <p className="text-gray-200 mb-4">
                  ✅ Decision <span className="font-semibold">{finalApprovalConfirm.decision === 'approve' ? 'Approved' : 'Rejected'}</span> submitted for <span className="font-semibold">{finalApprovalConfirm.name}</span>.
                </p>
                <div className="flex justify-end">
                  <button onClick={() => setFinalApprovalConfirm(null)} className="btn-primary">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (() => {
          const user = pfiApplicants.find(u => u.id === showEditModal);
          return user ? (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowEditModal(null)}>
              <div className="min-h-screen flex items-center justify-center py-8">
                <div className="w-full max-w-xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold font-sans text-gray-100">Edit Access</h3>
                    <button onClick={() => setShowEditModal(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); setShowEditModal(null); setEditToast(`✅ Access updated for ${user.name}`); setEditConfirm({ name: user.name, scope: editAccessScope || String(user.accessScope) }); setTimeout(() => setEditToast(null), 2500); }} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 font-serif mb-1">Access Scope</label>
                      <select value={editAccessScope} onChange={(e) => setEditAccessScope(e.target.value)} className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600">
                        <option value="">Select scope</option>
                        <option value="Basic">Basic</option>
                        <option value="Standard">Standard</option>
                        <option value="Full">Full</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 font-serif mb-1">Remarks</label>
                      <textarea value={editRemarks} onChange={(e) => setEditRemarks(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600" placeholder="What changed and why?" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setShowEditModal(null)} className="btn-secondary">Cancel</button>
                      <button type="submit" className="btn-primary">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {editToast && (<div className="fixed right-4 bottom-24 z-50 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg">{editToast}</div>)}
        {editConfirm && (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setEditConfirm(null)}>
            <div className="min-h-screen flex items-center justify-center py-8">
              <div className="w-full max-w-md bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold font-sans text-gray-100">Edit Confirmation</h3>
                  <button onClick={() => setEditConfirm(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                </div>
                <p className="text-gray-200 mb-4">✅ Access for <span className="font-semibold">{editConfirm.name}</span> updated to scope <span className="font-semibold">{editConfirm.scope || '—'}</span>.</p>
                <div className="flex justify-end"><button onClick={() => setEditConfirm(null)} className="btn-primary">Close</button></div>
              </div>
            </div>
          </div>
        )}

        {/* Restrict Modal */}
        {showRestrictModal && (() => {
          const user = pfiApplicants.find(u => u.id === showRestrictModal);
          return user ? (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowRestrictModal(null)}>
              <div className="min-h-screen flex items-center justify-center py-8">
                <div className="w-full max-w-xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold font-sans text-gray-100">Restrict Access</h3>
                    <button onClick={() => setShowRestrictModal(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); setShowRestrictModal(null); setRestrictToast(`🚫 Access restricted for ${user.name}`); setRestrictConfirm({ name: user.name, reason: restrictReason || 'Non-compliance' }); setTimeout(() => setRestrictToast(null), 2500); }} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 font-serif mb-1">Reason</label>
                      <select value={restrictReason} onChange={(e) => setRestrictReason(e.target.value)} className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600">
                        <option value="">Select reason</option>
                        <option value="Non-compliance">Non-compliance</option>
                        <option value="Incomplete documents">Incomplete documents</option>
                        <option value="Fraud suspicion">Fraud suspicion</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 font-serif mb-1">Remarks</label>
                      <textarea value={restrictRemarks} onChange={(e) => setRestrictRemarks(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600" placeholder="Provide details (optional)" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setShowRestrictModal(null)} className="btn-secondary">Cancel</button>
                      <button type="submit" className="btn-primary">Restrict</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {restrictToast && (<div className="fixed right-4 bottom-24 z-50 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg">{restrictToast}</div>)}
        {restrictConfirm && (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setRestrictConfirm(null)}>
            <div className="min-h-screen flex items-center justify-center py-8">
              <div className="w-full max-w-md bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold font-sans text-gray-100">Restriction Confirmation</h3>
                  <button onClick={() => setRestrictConfirm(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                </div>
                <p className="text-gray-200 mb-4">🚫 Access for <span className="font-semibold">{restrictConfirm.name}</span> restricted. Reason: <span className="font-semibold">{restrictConfirm.reason}</span>.</p>
                <div className="flex justify-end"><button onClick={() => setRestrictConfirm(null)} className="btn-primary">Close</button></div>
              </div>
            </div>
          </div>
        )}

        {/* Rights Modal */}
        {showRightsModal && (() => {
          const user = pfiApplicants.find(u => u.id === showRightsModal);
          return user ? (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowRightsModal(null)}>
              <div className="min-h-screen flex items-center justify-center py-8">
                <div className="w-full max-w-xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold font-sans text-gray-100">Update Approval Rights</h3>
                    <button onClick={() => setShowRightsModal(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); setShowRightsModal(null); setRightsToast(`✅ Approval rights updated for ${user.name}`); setRightsConfirm({ name: user.name, decision: rightsDecision || (user.canApprove ? 'Revoke' : 'Grant') }); setTimeout(() => setRightsToast(null), 2500); }} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 font-serif mb-1">Decision</label>
                      <select value={rightsDecision} onChange={(e) => setRightsDecision(e.target.value)} className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600">
                        <option value="">Select decision</option>
                        <option value="Grant">Grant</option>
                        <option value="Revoke">Revoke</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 font-serif mb-1">Remarks</label>
                      <textarea value={rightsRemarks} onChange={(e) => setRightsRemarks(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600" placeholder="Provide details (optional)" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setShowRightsModal(null)} className="btn-secondary">Cancel</button>
                      <button type="submit" className="btn-primary">Update Rights</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {rightsToast && (<div className="fixed right-4 bottom-24 z-50 bg-purple-600 text-white px-4 py-3 rounded-lg shadow-lg">{rightsToast}</div>)}
        {rightsConfirm && (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setRightsConfirm(null)}>
            <div className="min-h-screen flex items-center justify-center py-8">
              <div className="w-full max-w-md bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold font-sans text-gray-100">Approval Rights Confirmation</h3>
                  <button onClick={() => setRightsConfirm(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                </div>
                <p className="text-gray-200 mb-4">✅ Rights for <span className="font-semibold">{rightsConfirm.name}</span>: <span className="font-semibold">{rightsConfirm.decision}</span>.</p>
                <div className="flex justify-end"><button onClick={() => setRightsConfirm(null)} className="btn-primary">Close</button></div>
              </div>
            </div>
          </div>
        )}
        {/* Approve Access Card */}
        <div className="bg-primary-800 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-white">Approve Access</h2>
              <button onClick={() => alert('View approval history')} className="text-xs px-2 py-1 rounded bg-primary-700 text-gray-200 hover:bg-primary-600">📋 View History</button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={approveStateFilter}
                onChange={(e) => { setApproveStateFilter(e.target.value); setApprovePage(1); }}
                className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm sm:text-base"
              >
                <option value="All">All States</option>
                {nigerianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <div className="relative flex-1">
                <input
                  value={approveSearch}
                  onChange={(e) => { setApproveSearch(e.target.value); setApprovePage(1); }}
                  placeholder="Search PFI applicants..."
                  className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm sm:text-base"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  🔍
                </button>
              </div>
            </div>
          </div>

          {/* Mass Actions */}
          {selectedApproveUsers.length > 0 && (
            <div className="bg-accent-600 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-white font-medium">
                  {selectedApproveUsers.length} applicant{selectedApproveUsers.length > 1 ? 's' : ''} selected
                </p>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={handleMassApprove}
                    className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                  >
                    ✅ Approve Selected
                  </button>
                  <button 
                    onClick={() => alert('View approval history')}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    📋 View History
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users List */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-1">
              <label className="flex items-center gap-2 text-gray-200 text-sm">
                <input type="checkbox" checked={approveAllOnPageSelected} onChange={toggleApproveSelectAll} />
                <span>Select all on this page</span>
              </label>
            </div>
            {paginatedApproveUsers.map((user) => (
              <div key={user.id} className="bg-primary-700 rounded-lg p-4 border border-primary-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedApproveUsers.includes(user.id)}
                      onChange={() => handleApproveCheckboxChange(user.id)}
                      className="rounded border-primary-600 bg-primary-700 text-accent-500 focus:ring-accent-500"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{user.name}</h3>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                          {user.state}
                        </span>
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowApproveMoreInfo(user.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    >
                      More Info
                    </button>
                    <button 
                      onClick={() => setShowApprovalModal(user.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalApprovePages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
              <p className="text-gray-400 text-xs sm:text-sm">
                Showing {((approvePage - 1) * pageSize) + 1} to {Math.min(approvePage * pageSize, filteredApproveUsers.length)} of {filteredApproveUsers.length} applicants
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setApprovePage(prev => Math.max(prev - 1, 1))}
                  disabled={approvePage === 1}
                  className="px-3 py-2 bg-primary-700 text-gray-300 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  ← Previous
                </button>
                <span className="px-3 py-2 bg-accent-600 text-white rounded-md text-sm">
                  {approvePage} of {totalApprovePages}
                </span>
                <button
                  onClick={() => setApprovePage(prev => Math.min(prev + 1, totalApprovePages))}
                  disabled={approvePage === totalApprovePages}
                  className="px-3 py-2 bg-primary-700 text-gray-300 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Edit Access Card */}
        <div className="bg-primary-800 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-white">Edit Access</h2>
              <button onClick={() => setShowEditHistory(true)} className="text-xs px-2 py-1 rounded bg-primary-700 text-gray-200 hover:bg-primary-600">📋 View History</button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={editStateFilter}
                onChange={(e) => { setEditStateFilter(e.target.value); setEditPage(1); }}
                className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm sm:text-base"
              >
                <option value="All">All States</option>
                {nigerianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <div className="relative flex-1">
                <input
                  value={editSearch}
                  onChange={(e) => { setEditSearch(e.target.value); setEditPage(1); }}
                  placeholder="Search PFI users..."
                  className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm sm:text-base"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  🔍
                </button>
              </div>
            </div>
          </div>

          {/* Mass Actions */}
          {selectedEditUsers.length > 0 && (
            <div className="bg-accent-600 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-white font-medium">
                  {selectedEditUsers.length} user{selectedEditUsers.length > 1 ? 's' : ''} selected
                </p>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={handleMassEditApply}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    ✅ Update Selected
                  </button>
                  <button 
                    onClick={() => alert('View edit history')}
                    className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
                  >
                    📋 View History
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users List */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-1">
              <label className="flex items-center gap-2 text-gray-200 text-sm">
                <input type="checkbox" checked={editAllOnPageSelected} onChange={toggleEditSelectAll} />
                <span>Select all on this page</span>
              </label>
            </div>
            {paginatedEditUsers.map((user) => (
              <div key={user.id} className="bg-primary-700 rounded-lg p-4 border border-primary-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedEditUsers.includes(user.id)}
                      onChange={() => handleEditCheckboxChange(user.id)}
                      className="rounded border-primary-600 bg-primary-700 text-accent-500 focus:ring-accent-500"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{user.name}</h3>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                          {user.state}
                        </span>
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                          {user.accessScope}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowEditMoreInfo(user.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    >
                      More Info
                    </button>
                    <button 
                      onClick={() => setShowEditModal(user.id)}
                      className="px-3 py-1 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalEditPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
              <p className="text-gray-400 text-xs sm:text-sm">
                Showing {((editPage - 1) * pageSize) + 1} to {Math.min(editPage * pageSize, filteredEditUsers.length)} of {filteredEditUsers.length} users
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditPage(prev => Math.max(prev - 1, 1))}
                  disabled={editPage === 1}
                  className="px-3 py-2 bg-primary-700 text-gray-300 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  ← Previous
                </button>
                <span className="px-3 py-2 bg-accent-600 text-white rounded-md text-sm">
                  {editPage} of {totalEditPages}
                </span>
                <button
                  onClick={() => setEditPage(prev => Math.min(prev + 1, totalEditPages))}
                  disabled={editPage === totalEditPages}
                  className="px-3 py-2 bg-primary-700 text-gray-300 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Restrict Access Card */}
        <div className="bg-primary-800 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-white">Restrict Access</h2>
              <button onClick={() => setShowRestrictHistory(true)} className="text-xs px-2 py-1 rounded bg-primary-700 text-gray-200 hover:bg-primary-600">📋 View History</button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={restrictStateFilter}
                onChange={(e) => { setRestrictStateFilter(e.target.value); setRestrictPage(1); }}
                className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm sm:text-base"
              >
                <option value="All">All States</option>
                {nigerianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <div className="relative flex-1">
                <input
                  value={restrictSearch}
                  onChange={(e) => { setRestrictSearch(e.target.value); setRestrictPage(1); }}
                  placeholder="Search PFI users..."
                  className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm sm:text-base"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  🔍
                </button>
              </div>
            </div>
          </div>

          {/* Mass Actions */}
          {selectedRestrictUsers.length > 0 && (
            <div className="bg-accent-600 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-white font-medium">
                  {selectedRestrictUsers.length} user{selectedRestrictUsers.length > 1 ? 's' : ''} selected
                </p>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={handleMassRestrict}
                    className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                  >
                    🚫 Restrict Selected
                  </button>
                  <button 
                    onClick={() => alert('View restriction history')}
                    className="px-3 py-1 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700"
                  >
                    📋 View History
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users List */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-1">
              <label className="flex items-center gap-2 text-gray-200 text-sm">
                <input type="checkbox" checked={restrictAllOnPageSelected} onChange={toggleRestrictSelectAll} />
                <span>Select all on this page</span>
              </label>
            </div>
            {paginatedEditUsers.map((user) => (
              <div key={user.id} className="bg-primary-700 rounded-lg p-4 border border-primary-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedRestrictUsers.includes(user.id)}
                      onChange={() => handleRestrictCheckboxChange(user.id)}
                      className="rounded border-primary-600 bg-primary-700 text-accent-500 focus:ring-accent-500"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{user.name}</h3>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                          {user.state}
                        </span>
                        <span className={`px-2 py-1 text-white text-xs rounded-full ${
                          user.restricted ? 'bg-red-600' : 'bg-green-600'
                        }`}>
                          {user.restricted ? 'Restricted' : 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowRestrictMoreInfo(user.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    >
                      More Info
                    </button>
                    <button 
                      onClick={() => setShowRestrictModal(user.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                    >
                      Restrict
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalEditPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
              <p className="text-gray-400 text-xs sm:text-sm">
                Showing {((restrictPage - 1) * pageSize) + 1} to {Math.min(restrictPage * pageSize, filteredEditUsers.length)} of {filteredEditUsers.length} users
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setRestrictPage(prev => Math.max(prev - 1, 1))}
                  disabled={restrictPage === 1}
                  className="px-3 py-2 bg-primary-700 text-gray-300 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  ← Previous
                </button>
                <span className="px-3 py-2 bg-accent-600 text-white rounded-md text-sm">
                  {restrictPage} of {totalEditPages}
                </span>
                <button
                  onClick={() => setRestrictPage(prev => Math.min(prev + 1, totalEditPages))}
                  disabled={restrictPage === totalEditPages}
                  className="px-3 py-2 bg-primary-700 text-gray-300 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Approval Rights Card */}
        <div className="bg-primary-800 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-white">Approval Rights</h2>
              <button onClick={() => setShowApprovalRightsHistory(true)} className="text-xs px-2 py-1 rounded bg-primary-700 text-gray-200 hover:bg-primary-600">📋 View History</button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={approvalRightsStateFilter}
                onChange={(e) => { setApprovalRightsStateFilter(e.target.value); setApprovalRightsPage(1); }}
                className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm sm:text-base"
              >
                <option value="All">All States</option>
                {nigerianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <div className="relative flex-1">
                <input
                  value={approvalRightsSearch}
                  onChange={(e) => { setApprovalRightsSearch(e.target.value); setApprovalRightsPage(1); }}
                  placeholder="Search PFI users..."
                  className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm sm:text-base"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  🔍
                </button>
              </div>
            </div>
          </div>

          {/* Mass Actions */}
          {selectedApprovalRightsUsers.length > 0 && (
            <div className="bg-accent-600 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-white font-medium">
                  {selectedApprovalRightsUsers.length} user{selectedApprovalRightsUsers.length > 1 ? 's' : ''} selected
                </p>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={handleMassApprovalRights}
                    className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
                  >
                    ✅ Update Rights
                  </button>
                  <button 
                    onClick={() => alert('View approval rights history')}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                  >
                    📋 View History
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users List */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-1">
              <label className="flex items-center gap-2 text-gray-200 text-sm">
                <input type="checkbox" checked={rightsAllOnPageSelected} onChange={toggleRightsSelectAll} />
                <span>Select all on this page</span>
              </label>
            </div>
            {paginatedEditUsers.map((user) => (
              <div key={user.id} className="bg-primary-700 rounded-lg p-4 border border-primary-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedApprovalRightsUsers.includes(user.id)}
                      onChange={() => handleApprovalRightsCheckboxChange(user.id)}
                      className="rounded border-primary-600 bg-primary-700 text-accent-500 focus:ring-accent-500"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{user.name}</h3>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                          {user.state}
                        </span>
                        <span className={`px-2 py-1 text-white text-xs rounded-full ${
                          user.canApprove ? 'bg-green-600' : 'bg-gray-600'
                        }`}>
                          {user.canApprove ? 'Can Approve' : 'No Approval Rights'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowApprovalRightsMoreInfo(user.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    >
                      More Info
                    </button>
                    <button 
                      onClick={() => setShowRightsModal(user.id)}
                      className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
                    >
                      Update Rights
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalEditPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
              <p className="text-gray-400 text-xs sm:text-sm">
                Showing {((approvalRightsPage - 1) * pageSize) + 1} to {Math.min(approvalRightsPage * pageSize, filteredEditUsers.length)} of {filteredEditUsers.length} users
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setApprovalRightsPage(prev => Math.max(prev - 1, 1))}
                  disabled={approvalRightsPage === 1}
                  className="px-3 py-2 bg-primary-700 text-gray-300 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  ← Previous
                </button>
                <span className="px-3 py-2 bg-accent-600 text-white rounded-md text-sm">
                  {approvalRightsPage} of {totalEditPages}
                </span>
                <button
                  onClick={() => setApprovalRightsPage(prev => Math.min(prev + 1, totalEditPages))}
                  disabled={approvalRightsPage === totalEditPages}
                  className="px-3 py-2 bg-primary-700 text-gray-300 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm py-4">
          Powered by Mc. George
        </div>
      </div>
    </PortalLayout>
  );
};

export default PFIApplicants;
