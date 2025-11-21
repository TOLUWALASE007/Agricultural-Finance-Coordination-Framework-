import React, { useMemo, useState, useEffect } from 'react';
import PortalLayout from '../../../../components/PortalLayout';
import { getProducers, updateProducerStatus, buildProducerApplicationData, ProducerRecord } from '../../../../utils/localDatabase';
import { useNotifications } from '../../../../context/NotificationContext';

const ProducersFarmers: React.FC = () => {
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
  const [showFullApplication, setShowFullApplication] = useState(false);
  const [showApprovalConfirmation, setShowApprovalConfirmation] = useState(false);
  const [showRejectionConfirmation, setShowRejectionConfirmation] = useState(false);
  const [documentModal, setDocumentModal] = useState<{
    title: string;
    documents: { label: string; name: string; type: string }[];
  } | null>(null);
  
  const { addNotification } = useNotifications();

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
  
  // Get all Producer records
  const [producerRecords, setProducerRecords] = useState<ProducerRecord[]>([]);
  
  useEffect(() => {
    const records = getProducers();
    setProducerRecords(records);
  }, []);
  
  // Refresh records when status changes
  const refreshProducers = () => {
    const records = getProducers();
    setProducerRecords(records);
  };
  
  // Helper function to render full application view for Producer (7 steps)
  const renderFullApplicationView = (applicationData: any) => {
    if (!applicationData) return null;
    
    const buildEntries = (source: Record<string, any>, labels: Record<string, string>) =>
      Object.entries(labels)
        .map(([key, label]) => {
          const rawValue = source?.[key];
          if (rawValue === undefined || rawValue === null) return null;
          const value = Array.isArray(rawValue) ? rawValue.join(', ') : String(rawValue);
          const trimmed = value.trim();
          if (!trimmed || trimmed === 'Not provided') return null;
          return { label, value: trimmed };
        })
        .filter(Boolean) as { label: string; value: string }[];
    
    const deriveDocumentType = (fileName: string) => {
      if (!fileName) return 'Unknown';
      const extension = fileName.split('.').pop();
      return extension ? extension.toUpperCase() : 'Unknown';
    };
    
    const openDocuments = (title: string, docs: { label: string; name: string }[]) => {
      if (!docs.length) return;
      setDocumentModal({
        title,
        documents: docs.map((doc) => ({
          ...doc,
          type: deriveDocumentType(doc.name),
        })),
      });
    };
    
    const renderGroup = (
      title: string,
      entries: { label: string; value: string }[],
      action?: React.ReactNode
    ) => (
      <div key={title} className="bg-primary-900/60 rounded-md border border-primary-700 p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h6 className="text-sm font-semibold text-accent-300 font-sans">{title}</h6>
          {action}
        </div>
        {entries.length > 0 ? (
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            {entries.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs uppercase tracking-wide text-gray-400 font-serif">{label}</dt>
                <dd className="text-sm text-gray-100 font-sans mt-1 whitespace-pre-line break-words">{value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-xs text-gray-500 font-serif">No data provided.</p>
        )}
      </div>
    );
    
    const step1 = applicationData.step1 ?? {};
    const step2 = applicationData.step2 ?? {};
    const step3 = applicationData.step3 ?? {};
    const step4 = applicationData.step4 ?? {};
    const step5 = applicationData.step5 ?? {};
    const step6 = applicationData.step6 ?? {};
    
    const personalDetailsEntries = buildEntries(step1, {
      fullName: 'Full Name',
      gender: 'Gender',
      birthDate: 'Date of Birth',
      phone: 'Phone Number',
      email: 'Email Address',
      address: 'Address',
      city: 'City',
      state: 'State',
      country: 'Country',
    });
    
    const farmDetailsEntries = buildEntries(step2, {
      farmBusinessName: 'Farm Business Name',
      typeOfFarmer: 'Type of Farmer',
      farmAddress: 'Farm Address',
      farmSize: 'Farm Size',
      yearsOfExperience: 'Years of Experience',
      primarySourceOfIncome: 'Primary Source of Income',
      farmerAssociation: 'Farmer Association',
    });
    
    const productionEntries = buildEntries(step3, {
      crops: 'Crops',
      livestock: 'Livestock',
      hasProcessingValueAddition: 'Has Processing/Value Addition',
      processingValueAdditionDetails: 'Processing/Value Addition Details',
    });
    
    const marketEntries = buildEntries(step4, {
      totalAnnualProduction: 'Total Annual Production',
      primaryMarket: 'Primary Market',
      majorBuyers: 'Major Buyers',
      challengesFaced: 'Challenges Faced',
    });
    
    const verificationEntries = buildEntries(step5, {
      idType: 'ID Type',
      idNumber: 'ID Number',
      idDocumentName: 'Uploaded ID Document',
      farmImagesName: 'Farm Images',
      certificationName: 'Certification',
    });
    
    const paymentEntries = buildEntries(step6, {
      preferredPaymentMethod: 'Preferred Payment Method',
      bankName: 'Bank Name',
      accountName: 'Account Name',
      accountNumber: 'Account Number',
    });
    
    const verificationDocuments = [
      step5?.idDocumentName && step5.idDocumentName !== 'Not provided'
        ? { label: 'Government-issued ID', name: String(step5.idDocumentName) }
        : null,
      step5?.farmImagesName && step5.farmImagesName !== 'Not provided'
        ? { label: 'Farm Images', name: String(step5.farmImagesName) }
        : null,
      step5?.certificationName && step5.certificationName !== 'Not provided'
        ? { label: 'Certification', name: String(step5.certificationName) }
        : null,
    ].filter(Boolean) as { label: string; name: string }[];
    
    return (
      <div className="mt-4 space-y-6 bg-primary-800 rounded-md p-4">
        <div className="space-y-4">
          <h5 className="text-sm font-semibold text-accent-400 font-sans uppercase tracking-wide">Personal & Farm Info</h5>
          {renderGroup('Personal Details', personalDetailsEntries)}
          {renderGroup('Farm Details', farmDetailsEntries)}
          {renderGroup('Production Information', productionEntries)}
          {renderGroup('Market Information', marketEntries)}
          {renderGroup(
            'Verification & Documents',
            verificationEntries,
            verificationDocuments.length > 0 ? (
              <button
                type="button"
                onClick={() => openDocuments('Verification Documents', verificationDocuments)}
                className="text-xs text-accent-400 hover:text-accent-300 font-semibold transition-colors"
              >
                View Documents
              </button>
            ) : undefined
          )}
          {renderGroup('Payment Information', paymentEntries)}
        </div>
      </div>
    );
  };

  // Transform Producer records to display format
  const producersFarmers = useMemo(() => {
    return producerRecords.map(record => {
      return {
        id: record.id,
        name: record.formData.fullName,
        email: record.email || record.formData.phone,
        phone: record.formData.phone,
        state: record.formData.state,
        companyId: record.formData.idNumber || 'N/A',
        fullAddress: `${record.formData.address}, ${record.formData.city}, ${record.formData.state}, ${record.formData.country}`,
        organizationProfile: record.formData.farmBusinessName || 'Not provided',
        contactPersonName: record.formData.fullName,
        contactPersonEmail: record.formData.email || record.formData.phone,
        contactPersonPhone: record.formData.phone,
        companyEmail: record.formData.email || record.formData.phone,
        registrationDate: record.lastSubmittedAt,
        organization: record.formData.farmBusinessName || record.formData.fullName,
        role: 'Producer/Farmer',
        status: record.status, // 'verified' or 'unverified'
        record: record, // Store full record for access
        applicationData: buildProducerApplicationData(record.formData)
      };
    });
  }, [producerRecords]);

  // Filters and pagination (Approve) - ALL Producers/Farmers
  const filteredApproveUsers = useMemo(() => {
    return producersFarmers.filter(user => {
      const matchesState = approveStateFilter === 'All' || user.state === approveStateFilter;
      const q = approveSearch.toLowerCase();
      const matchesSearch = user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q) || user.organization.toLowerCase().includes(q);
      return matchesState && matchesSearch;
    });
  }, [producersFarmers, approveStateFilter, approveSearch]);
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

  // Filters and pagination (Restrict) - ONLY Approved (verified) Producers/Farmers
  const filteredRestrictUsers = useMemo(() => {
    return producersFarmers
      .filter(user => user.status === 'verified')
      .filter(user => {
        const matchesState = restrictStateFilter === 'All' || user.state === restrictStateFilter;
        const q = restrictSearch.toLowerCase();
        const matchesSearch = user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q) || user.organization.toLowerCase().includes(q);
        return matchesState && matchesSearch;
      });
  }, [producersFarmers, restrictStateFilter, restrictSearch]);
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

  // Filter for Approval Rights - Producers/Farmers who applied for schemes (using notifications)
  type ApprovalRightsUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    state: string;
    organization: string;
    canApprove: boolean;
  };
  
  const filteredApprovalRightsUsers: ApprovalRightsUser[] = useMemo(() => {
    // This will be populated from notifications for scheme applications
    // For now, return empty array - this card is preserved for scheme applications
    return [] as ApprovalRightsUser[];
  }, []);
  
  const paginatedApprovalRightsUsers = useMemo(() => {
    const startIndex = (approvalRightsPage - 1) * pageSize;
    return filteredApprovalRightsUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredApprovalRightsUsers, approvalRightsPage]);
  
  const totalApprovalRightsPages = Math.ceil(filteredApprovalRightsUsers.length / pageSize);
  
  // Reset pages on filter/search change
  useEffect(() => { setApprovePage(1); }, [approveSearch, approveStateFilter]);
  useEffect(() => { setRestrictPage(1); }, [restrictSearch, restrictStateFilter]);
  useEffect(() => { setApprovalRightsPage(1); }, [approvalRightsSearch, approvalRightsStateFilter]);

  const handleApproveCheckboxChange = (userId: string) => setSelectedApproveUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  const handleRestrictCheckboxChange = (userId: string) => setSelectedRestrictUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  const handleApprovalRightsCheckboxChange = (userId: string) => setSelectedApprovalRightsUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  
  const handleMassApprove = () => {
    if (selectedApproveUsers.length === 0) return;
    alert(`Approved ${selectedApproveUsers.length} Producer/Farmer applications`);
    setSelectedApproveUsers([]);
    refreshProducers();
  };
  
  // Process approval/rejection
  const processApproval = (userId: string) => {
    if (!approvalDecision) return;
    
    const user = producersFarmers.find(u => u.id === userId);
    if (!user || !user.record) return;
    
    const trimmedRemarks = approvalRemarks.trim();
    const isApproved = approvalDecision === 'approve';
    
    if (!isApproved && !trimmedRemarks) {
      alert('Please provide a reason for rejecting this Producer/Farmer.');
      return;
    }
    
    // Update Producer status
    updateProducerStatus(user.record.id, isApproved ? 'verified' : 'unverified', {
      rejectionReason: isApproved ? undefined : trimmedRemarks,
      pendingNotificationId: null,
    });
    
    // Send notification to Producer
    const message = isApproved
      ? 'Your registration has been approved. You now have full access.'
      : `Your registration has been rejected due to ${trimmedRemarks}. Please update your details and resubmit for approval.`;
    
    addNotification({
      role: '🏛️ Coordinating Agency',
      targetRole: 'producer',
      message,
      metadata: {
        type: 'producerRegistrationResponse',
        producerId: user.record.id,
      },
    });
    
    refreshProducers();
    setShowApprovalModal(null);
    setApprovalDecision('');
    setApprovalRemarks('');
    setShowFullApplication(false);
    setShowApprovalConfirmation(false);
    setShowRejectionConfirmation(false);
    setFinalApprovalNotice(`✅ Decision ${isApproved ? 'Approved' : 'Rejected'} submitted for ${user.name}`);
    setTimeout(() => setFinalApprovalNotice(null), 3000);
  };
  
  const handleApprovalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showApprovalModal || !approvalDecision) return;
    
    if (approvalDecision === 'approve' && !showApprovalConfirmation) {
      setShowApprovalConfirmation(true);
      return;
    }
    
    if (approvalDecision === 'reject' && !showRejectionConfirmation) {
      setShowRejectionConfirmation(true);
      return;
    }
    
    processApproval(showApprovalModal);
  };
  
  const handleConfirmApproval = () => {
    setShowApprovalConfirmation(false);
    if (showApprovalModal) {
      processApproval(showApprovalModal);
    }
  };
  
  const handleConfirmRejection = () => {
    setShowRejectionConfirmation(false);
    if (showApprovalModal) {
      processApproval(showApprovalModal);
    }
  };
  
  const handleCancelApproval = () => {
    setShowApprovalConfirmation(false);
    setApprovalDecision('');
  };
  
  const handleCancelRejection = () => {
    setShowRejectionConfirmation(false);
    setApprovalDecision('');
  };
  
  // Handle restrict access
  const handleRestrictAccess = (userId: string) => {
    const user = producersFarmers.find(u => u.id === userId);
    if (!user || !user.record) return;
    
    // Change status from verified to unverified
    updateProducerStatus(user.record.id, 'unverified', {
      rejectionReason: restrictRemarks || 'Access restricted by Coordinating Agency',
      pendingNotificationId: null,
    });
    
    // Send notification
    addNotification({
      role: '🏛️ Coordinating Agency',
      targetRole: 'producer',
      message: `Your access has been restricted. Reason: ${restrictRemarks || 'Access restricted by Coordinating Agency'}`,
      metadata: {
        type: 'producerRegistrationResponse',
        producerId: user.record.id,
      },
    });
    
    refreshProducers();
    setShowRestrictModal(null);
    setRestrictReason('');
    setRestrictRemarks('');
    setRestrictToast(`🚫 Access restricted for ${user.name}`);
    setTimeout(() => setRestrictToast(null), 3000);
  };
  
  const handleMassRestrict = () => {
    if (selectedRestrictUsers.length === 0) return;
    alert(`Restricted access for ${selectedRestrictUsers.length} Producer/Farmer users`);
    setSelectedRestrictUsers([]);
  };
  
  const handleMassApprovalRights = () => {
    if (selectedApprovalRightsUsers.length === 0) return;
    alert(`Updated approval rights for ${selectedApprovalRightsUsers.length} Producer/Farmer users`);
    setSelectedApprovalRightsUsers([]);
  };

  return (
    <PortalLayout role="Producers/Farmers" roleIcon="🌾" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        <div className="bg-primary-800 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Producers/Farmers</h1>
              <p className="text-gray-300">Manage access, restrictions, and approval rights for producers and farmers</p>
            </div>
          </div>
        </div>

        {/* Approve Access Card */}
        <div className="card flex flex-col">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-semibold font-sans text-gray-100">Approve Access</h2>
                <span className="px-2 py-1 bg-accent-600 text-white text-xs rounded-full font-medium">
                  {filteredApproveUsers.filter(u => u.status === 'unverified').length} Pending
                </span>
              </div>
              <button onClick={() => {}} className="btn-secondary text-xs px-3 py-1">📜 View History</button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  value={approveSearch}
                  onChange={(e) => { setApproveSearch(e.target.value); setApprovePage(1); }}
                  placeholder="Search applications..."
                  className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  🔍
                </button>
              </div>
              <select
                value={approveStateFilter}
                onChange={(e) => { setApproveStateFilter(e.target.value); setApprovePage(1); }}
                className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="All">All States</option>
                {nigerianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {selectedApproveUsers.length > 0 && (
              <div className="flex items-center justify-between p-2 bg-accent-600/20 border border-accent-600 rounded-md">
                <span className="text-sm text-gray-200 font-sans">{selectedApproveUsers.length} selected</span>
                <button 
                  onClick={handleMassApprove}
                  className="btn-primary text-xs px-3 py-1"
                >
                  ✅ Approve All Selected
                </button>
              </div>
            )}
          </div>
            
          <div className="flex-1 flex flex-col">
            <div className="space-y-3 flex-1">
              {paginatedApproveUsers.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 p-2 bg-primary-700 rounded-md">
                    <input
                      type="checkbox"
                      checked={approveAllOnPageSelected}
                      onChange={toggleApproveSelectAll}
                      className="w-4 h-4 accent-accent-500"
                    />
                    <span className="text-xs text-gray-400 font-sans">Select All</span>
                  </div>
                  {paginatedApproveUsers.map((user) => (
                    <div key={user.id} className="p-3 bg-primary-700 rounded-lg border border-primary-600 hover:border-accent-500 transition-colors">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedApproveUsers.includes(user.id)}
                          onChange={() => handleApproveCheckboxChange(user.id)}
                          className="mt-1 w-4 h-4 accent-accent-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm font-medium text-gray-100 font-sans">{user.name}</p>
                              <p className="text-xs text-gray-400 font-serif">{user.email}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 'verified' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-yellow-500 text-white'
                            }`}>
                              {user.status === 'verified' ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-300 font-serif mb-2">
                            <span className="flex items-center gap-1">
                              <span>👤</span> {user.role}
                            </span>
                            <span className="flex items-center gap-1">
                              <span>📍</span> {user.state}
                            </span>
                            <span className="flex items-center gap-1">
                              <span>🌾</span> {user.organization}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button 
                              onClick={() => setShowApproveMoreInfo(user.id)}
                              className="text-xs text-accent-400 hover:text-accent-300 font-medium"
                            >
                              📋 More Info
                            </button>
                            <button 
                              onClick={() => setShowApprovalModal(user.id)}
                              className="text-xs bg-accent-600 hover:bg-accent-700 text-white px-3 py-1 rounded transition-colors font-medium"
                            >
                              ✅ Review & Approve
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-gray-400 font-sans">No pending applications</p>
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
        </div>

        {/* More Info Modal - Shows Full Application View */}
        {showApproveMoreInfo && (() => {
          const user = producersFarmers.find(u => u.id === showApproveMoreInfo);
          return user ? (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowApproveMoreInfo(null)}>
              <div className="min-h-screen flex items-center justify-center py-8">
                <div className="w-full max-w-3xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold font-sans text-gray-100">Producer/Farmer Application</h3>
                      <div className="mt-2 p-3 bg-primary-800 rounded-md">
                        <p className="text-xs text-accent-400 font-sans font-medium mb-1">🌾 Producer/Farmer</p>
                        <p className="text-sm text-gray-200">{user.name} - Registration Application</p>
                      </div>
                    </div>
                    <button onClick={() => setShowApproveMoreInfo(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                  </div>
                  
                  {/* Application Details Section */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-primary-800 rounded-md p-4">
                      <h4 className="text-sm font-semibold text-accent-400 font-sans mb-3">Personal Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-400 font-serif mb-1">Full Name</p>
                          <p className="text-sm text-gray-100 font-sans">{user.name}</p>
                        </div>
                        {user.email && (
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Email</p>
                            <p className="text-sm text-gray-100 font-sans">{user.email}</p>
                          </div>
                        )}
                        {user.phone && (
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Phone</p>
                            <p className="text-sm text-gray-100 font-sans">{user.phone}</p>
                          </div>
                        )}
                        {user.fullAddress && (
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-400 font-serif mb-1">Address</p>
                            <p className="text-sm text-gray-100 font-sans">{user.fullAddress}</p>
                          </div>
                        )}
                        {user.organizationProfile && (
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-400 font-serif mb-1">Farm Business</p>
                            <p className="text-sm text-gray-100 font-sans">{user.organizationProfile}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* View Full Application Section */}
                  {user.applicationData && (
                    <div className="mb-6 border-t border-primary-700 pt-4">
                      <button
                        onClick={() => setShowFullApplication(!showFullApplication)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-primary-800 hover:bg-primary-700 rounded-md transition-colors"
                      >
                        <span className="text-sm font-semibold text-accent-400 font-sans">
                          {showFullApplication ? '▼' : '▶'} View Full Application
                        </span>
                        <span className="text-xs text-gray-400 font-serif">
                          {showFullApplication ? 'Hide detailed view' : 'Show detailed view'}
                        </span>
                      </button>
                      
                      {showFullApplication && renderFullApplicationView(user.applicationData)}
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => { setShowApproveMoreInfo(null); setShowApprovalModal(user.id); }}
                      className="btn-primary"
                    >
                      Proceed to Approval
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {/* Review & Approve Modal - Full Application View with Decision Form */}
        {showApprovalModal && (() => {
          const user = producersFarmers.find(u => u.id === showApprovalModal);
          return user ? (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowApprovalModal(null)}>
              <div className="min-h-screen flex items-center justify-center py-8">
                <div className="w-full max-w-3xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold font-sans text-gray-100">Producer/Farmer Application Review</h3>
                      <div className="mt-2 p-3 bg-primary-800 rounded-md">
                        <p className="text-xs text-accent-400 font-sans font-medium mb-1">🌾 Producer/Farmer</p>
                        <p className="text-sm text-gray-200">{user.name} - Registration Application</p>
                      </div>
                    </div>
                    <button onClick={() => setShowApprovalModal(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                  </div>
                  
                  {/* Application Details Section */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-primary-800 rounded-md p-4">
                      <h4 className="text-sm font-semibold text-accent-400 font-sans mb-3">Personal Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-400 font-serif mb-1">Full Name</p>
                          <p className="text-sm text-gray-100 font-sans">{user.name}</p>
                        </div>
                        {user.email && (
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Email</p>
                            <p className="text-sm text-gray-100 font-sans">{user.email}</p>
                          </div>
                        )}
                        {user.phone && (
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Phone</p>
                            <p className="text-sm text-gray-100 font-sans">{user.phone}</p>
                          </div>
                        )}
                        {user.fullAddress && (
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-400 font-serif mb-1">Address</p>
                            <p className="text-sm text-gray-100 font-sans">{user.fullAddress}</p>
                          </div>
                        )}
                        {user.organizationProfile && (
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-400 font-serif mb-1">Farm Business</p>
                            <p className="text-sm text-gray-100 font-sans">{user.organizationProfile}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* View Full Application Section */}
                  {user.applicationData && (
                    <div className="mb-6 border-t border-primary-700 pt-4">
                      <button
                        onClick={() => setShowFullApplication(!showFullApplication)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-primary-800 hover:bg-primary-700 rounded-md transition-colors"
                      >
                        <span className="text-sm font-semibold text-accent-400 font-sans">
                          {showFullApplication ? '▼' : '▶'} View Full Application
                        </span>
                        <span className="text-xs text-gray-400 font-serif">
                          {showFullApplication ? 'Hide detailed view' : 'Show detailed view'}
                        </span>
                      </button>
                      
                      {showFullApplication && renderFullApplicationView(user.applicationData)}
                    </div>
                  )}
                  
                  {/* Approval Form */}
                  <form onSubmit={handleApprovalSubmit} className="space-y-4 border-t border-primary-700 pt-4">
                    <div>
                      <label className="block text-sm text-gray-300 font-serif mb-1">Decision</label>
                      <select 
                        value={approvalDecision} 
                        onChange={(e) => setApprovalDecision(e.target.value)} 
                        className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"
                        required
                      >
                        <option value="">Select decision</option>
                        <option value="approve">Approve</option>
                        <option value="reject">Reject</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 font-serif mb-1">
                        {approvalDecision === 'reject' ? 'Reason for Rejection' : 'Remarks'}
                      </label>
                      <textarea 
                        value={approvalRemarks} 
                        onChange={(e) => setApprovalRemarks(e.target.value)} 
                        rows={3} 
                        className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600" 
                        placeholder={approvalDecision === 'reject' ? 'Provide the reason for rejection' : 'Add remarks (optional)'} 
                        required={approvalDecision === 'reject'}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button 
                        type="button" 
                        onClick={() => {
                          setShowApprovalModal(null);
                          setShowFullApplication(false);
                        }} 
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary">Submit Decision</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {finalApprovalNotice && (<div className="fixed right-4 bottom-4 sm:right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">{finalApprovalNotice}</div>)}
        
        {/* Approval Confirmation Dialogs */}
        {showApprovalConfirmation && showApprovalModal && (
          <div
            className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center"
            onClick={handleCancelApproval}
          >
            <div
              className="w-full max-w-md bg-primary-900 border border-primary-700 rounded-lg p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 font-sans">Confirm Approval</h3>
                  <p className="text-sm text-gray-300 font-serif mt-2">
                    Are you sure you want to approve this registration? This action will grant the user full access to the portal.
                  </p>
                </div>
                <button
                  onClick={handleCancelApproval}
                  className="text-gray-400 hover:text-gray-200"
                >
                  ✖
                </button>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={handleCancelApproval} className="btn-secondary">Cancel</button>
                <button onClick={handleConfirmApproval} className="btn-primary">Confirm Approval</button>
              </div>
            </div>
          </div>
        )}

        {showRejectionConfirmation && showApprovalModal && (
          <div
            className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center"
            onClick={handleCancelRejection}
          >
            <div
              className="w-full max-w-md bg-primary-900 border border-primary-700 rounded-lg p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 font-sans">Confirm Rejection</h3>
                  <p className="text-sm text-gray-300 font-serif mt-2">
                    Are you sure you want to reject this registration? The user will need to update their details and resubmit for approval.
                  </p>
                </div>
                <button
                  onClick={handleCancelRejection}
                  className="text-gray-400 hover:text-gray-200"
                >
                  ✖
                </button>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={handleCancelRejection} className="btn-secondary">Cancel</button>
                <button onClick={handleConfirmRejection} className="btn-primary bg-red-600 hover:bg-red-700">Confirm Rejection</button>
              </div>
            </div>
          </div>
        )}

        {/* Restrict Access Card */}
        <div className="card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold font-sans text-gray-100">Restrict Access</h2>
            <button onClick={() => setShowRestrictHistory(true)} className="text-xs text-accent-400 hover:text-accent-300 font-medium flex items-center gap-1">📜 View History</button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <input
                value={restrictSearch}
                onChange={(e) => { setRestrictSearch(e.target.value); setRestrictPage(1); }}
                placeholder="Search users..."
                className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                🔍
              </button>
            </div>
            <select
              value={restrictStateFilter}
              onChange={(e) => { setRestrictStateFilter(e.target.value); setRestrictPage(1); }}
              className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="All">Filter by State</option>
              {nigerianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
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
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                          Approved
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
                          <span>🌾</span> {user.organization}
                        </span>
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
                          🚫 Restrict Access
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-gray-400 font-sans">No approved Producers/Farmers found</p>
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
                <input value={approvalRightsSearch} onChange={(e) => { setApprovalRightsSearch(e.target.value); setApprovalRightsPage(1); }} placeholder="Search producers/farmers..." className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm sm:text-base" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">🔍</button>
              </div>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {paginatedApprovalRightsUsers.length > 0 ? (
              <div className="space-y-4">
                {paginatedApprovalRightsUsers.map((user) => (
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
                          <span>🌾</span> {user.organization}
                        </span>
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
                <p className="text-gray-400 font-sans">No scheme applications found</p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {filteredApprovalRightsUsers.length > pageSize && (
            <div className="flex items-center justify-center space-x-2 mt-4 pt-4">
              <button 
                onClick={() => setApprovalRightsPage(prev => Math.max(prev - 1, 1))} 
                disabled={approvalRightsPage === 1}
                className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              <span className="text-xs text-gray-400">{approvalRightsPage} of {totalApprovalRightsPages}</span>
              <button 
                onClick={() => setApprovalRightsPage(prev => Math.min(prev + 1, totalApprovalRightsPages))} 
                disabled={approvalRightsPage === totalApprovalRightsPages}
                className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Restrict More Info Modal */}
        {showRestrictMoreInfo && (() => {
          const user = producersFarmers.find(u => u.id === showRestrictMoreInfo);
          return user ? (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowRestrictMoreInfo(null)}>
              <div className="min-h-screen flex items-center justify-center py-8">
                <div className="w-full max-w-3xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold font-sans text-gray-100">Producer/Farmer Application</h3>
                      <div className="mt-2 p-3 bg-primary-800 rounded-md">
                        <p className="text-xs text-accent-400 font-sans font-medium mb-1">🌾 Producer/Farmer</p>
                        <p className="text-sm text-gray-200">{user.name} - Registration Application</p>
                      </div>
                    </div>
                    <button onClick={() => setShowRestrictMoreInfo(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                  </div>
                  
                  {/* Application Details Section */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-primary-800 rounded-md p-4">
                      <h4 className="text-sm font-semibold text-accent-400 font-sans mb-3">Personal Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-400 font-serif mb-1">Full Name</p>
                          <p className="text-sm text-gray-100 font-sans">{user.name}</p>
                        </div>
                        {user.email && (
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Email</p>
                            <p className="text-sm text-gray-100 font-sans">{user.email}</p>
                          </div>
                        )}
                        {user.phone && (
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Phone</p>
                            <p className="text-sm text-gray-100 font-sans">{user.phone}</p>
                          </div>
                        )}
                        {user.fullAddress && (
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-400 font-serif mb-1">Address</p>
                            <p className="text-sm text-gray-100 font-sans">{user.fullAddress}</p>
                          </div>
                        )}
                        {user.organizationProfile && (
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-400 font-serif mb-1">Farm Business</p>
                            <p className="text-sm text-gray-100 font-sans">{user.organizationProfile}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* View Full Application Section */}
                  {user.applicationData && (
                    <div className="mb-6 border-t border-primary-700 pt-4">
                      <button
                        onClick={() => setShowFullApplication(!showFullApplication)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-primary-800 hover:bg-primary-700 rounded-md transition-colors"
                      >
                        <span className="text-sm font-semibold text-accent-400 font-sans">
                          {showFullApplication ? '▼' : '▶'} View Full Application
                        </span>
                        <span className="text-xs text-gray-400 font-serif">
                          {showFullApplication ? 'Hide detailed view' : 'Show detailed view'}
                        </span>
                      </button>
                      
                      {showFullApplication && renderFullApplicationView(user.applicationData)}
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <button onClick={() => setShowRestrictMoreInfo(null)} className="btn-primary">Close</button>
                  </div>
                </div>
              </div>
            </div>
          ) : null;
        })()}
        
        {/* Restrict Access Modal */}
        {showRestrictModal && (() => {
          const user = producersFarmers.find(u => u.id === showRestrictModal);
          return user ? (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowRestrictModal(null)}>
              <div className="min-h-screen flex items-center justify-center py-8">
                <div className="w-full max-w-md bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold font-sans text-gray-100">Restrict Access</h3>
                    <button onClick={() => setShowRestrictModal(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); handleRestrictAccess(user.id); }} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 font-serif mb-1">Reason for Restriction</label>
                      <select 
                        value={restrictReason} 
                        onChange={(e) => setRestrictReason(e.target.value)} 
                        className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"
                        required
                      >
                        <option value="">Select reason</option>
                        <option value="Policy Violation">Policy Violation</option>
                        <option value="Incomplete Documentation">Incomplete Documentation</option>
                        <option value="Compliance Issue">Compliance Issue</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 font-serif mb-1">Remarks</label>
                      <textarea 
                        value={restrictRemarks} 
                        onChange={(e) => setRestrictRemarks(e.target.value)} 
                        rows={3} 
                        className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600" 
                        placeholder="Add remarks (required)" 
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button 
                        type="button" 
                        onClick={() => {
                          setShowRestrictModal(null);
                          setRestrictReason('');
                          setRestrictRemarks('');
                        }} 
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary bg-red-600 hover:bg-red-700">Restrict Access</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : null;
        })()}
        
        {restrictToast && (<div className="fixed right-4 bottom-4 sm:right-6 z-50 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg">{restrictToast}</div>)}

        {showApprovalRightsMoreInfo && (() => {
          const user = producersFarmers.find(u => u.id === showApprovalRightsMoreInfo);
          return user ? (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowApprovalRightsMoreInfo(null)}>
              <div className="min-h-screen flex items-center justify-center py-8">
                <div className="w-full max-w-2xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold font-sans text-gray-100">User Details</h3>
                    <button onClick={() => setShowApprovalRightsMoreInfo(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-100">
                    <div className="bg-primary-800 rounded p-3"><p className="text-xs text-gray-400">Name</p><p className="text-sm">{user.name}</p></div>
                    <div className="bg-primary-800 rounded p-3"><p className="text-xs text-gray-400">Email</p><p className="text-sm">{user.email}</p></div>
                    <div className="bg-primary-800 rounded p-3 md:col-span-2"><p className="text-xs text-gray-400">Address</p><p className="text-sm">{user.fullAddress}</p></div>
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
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {/* History Modals */}
        {showRestrictHistory && (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowRestrictHistory(false)}>
            <div className="min-h-screen flex items-center justify-center py-8">
              <div className="w-full max-w-xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-100">Restrict Access - History</h3>
                  <button onClick={() => setShowRestrictHistory(false)} className="text-gray-400 hover:text-gray-200">✖</button>
                </div>
                <ul className="space-y-2 text-gray-100 text-sm">
                  <li>2024-10-03 • Restricted 1 producer/farmer due to non-compliance</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        {showApprovalRightsHistory && (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowApprovalRightsHistory(false)}>
            <div className="min-h-screen flex items-center justify-center py-8">
              <div className="w-full max-w-xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-100">Approval Rights - History</h3>
                  <button onClick={() => setShowApprovalRightsHistory(false)} className="text-gray-400 hover:text-gray-200">✖</button>
                </div>
                <ul className="space-y-2 text-gray-100 text-sm">
                  <li>2024-10-04 • Granted approval rights to Ibrahim Mohammed</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Modals shared (Restrict/Rights) */}

        {showRestrictModal && (() => {
          const user = producersFarmers.find(u => u.id === showRestrictModal);
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
          const user = filteredApprovalRightsUsers.find(u => u.id === showRightsModal);
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
        {restrictToast && (<div className="fixed right-4 bottom-24 z-50 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg">{restrictToast}</div>)}
        {rightsToast && (<div className="fixed right-4 bottom-24 z-50 bg-purple-600 text-white px-4 py-3 rounded-lg shadow-lg">{rightsToast}</div>)}
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

export default ProducersFarmers;
