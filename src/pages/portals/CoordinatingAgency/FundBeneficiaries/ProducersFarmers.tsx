import React, { useMemo, useState, useEffect } from 'react';
import PortalLayout from '../../../../components/PortalLayout';

import { useNotifications } from '../../../../context/NotificationContext';
import CreateMEProjectModal from '../../../../components/CreateMEProjectModal';
import { userAPI, notificationAPI } from '../../../../utils/api';

const ProducersFarmers: React.FC = () => {
  const sidebarItems = [
    {
      id: 'dashboard', name: 'Dashboard', icon: '🏠', href: '/portal/coordinating-agency', hasDropdown: true, dropdownItems: [
        { id: 'activities', name: 'Activities', icon: '⚡', href: '/portal/coordinating-agency/activities' },
        { id: 'fund-schemes', name: 'Fund Schemes', icon: '💼', href: '/portal/coordinating-agency/fund-schemes' },
        { id: 'reportings', name: 'Reports', icon: '📑', href: '/portal/coordinating-agency/reportings' },
        { id: 'trainings', name: 'Trainings', icon: '📚', href: '/portal/coordinating-agency/trainings' }
      ]
    },
    { id: 'me-team', name: 'M&E Team', icon: '📋', href: '/portal/coordinating-agency/monitoring/state' },
    {
      id: 'representative-body', name: 'Representative Body', icon: '🏛️', href: '/portal/coordinating-agency/representative', hasDropdown: true, dropdownItems: [
        { id: 'rep-insurance', name: 'Insurance Companies', icon: '🛡️', href: '/portal/coordinating-agency/representative/insurance-companies' },
        { id: 'rep-extension', name: 'Extension Organizations', icon: '🌿', href: '/portal/coordinating-agency/representative/extension-organizations' },
        { id: 'rep-ngos', name: 'NGOs', icon: '🤝', href: '/portal/coordinating-agency/representative/ngos' }
      ]
    },
    {
      id: 'applicants', name: 'Applicants', icon: '📝', href: '/portal/coordinating-agency/applicants', hasDropdown: true, dropdownItems: [
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
      id: 'stakeholders', name: 'Department', icon: '🤝', href: '/portal/coordinating-agency/stakeholders', hasDropdown: true, dropdownItems: [
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

  // State blocks
  const [approveSearch, setApproveSearch] = useState('');
  const [approvePage, setApprovePage] = useState(1);
  const [approveStateFilter, setApproveStateFilter] = useState('All');
  const [selectedApproveUsers, setSelectedApproveUsers] = useState<string[]>([]);
  const [showApproveMoreInfo, setShowApproveMoreInfo] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState<string | null>(null);
  const [approvalDecision, setApprovalDecision] = useState('');
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [disbursementAmount, setDisbursementAmount] = useState('');
  const [finalApprovalNotice, setFinalApprovalNotice] = useState<string | null>(null);
  const [finalApprovalConfirm, setFinalApprovalConfirm] = useState<{ name: string; decision: string } | null>(null);
  const [showFullApplication, setShowFullApplication] = useState(false);
  const [showApprovalConfirmation, setShowApprovalConfirmation] = useState(false);
  const [showRejectionConfirmation, setShowRejectionConfirmation] = useState(false);
  const [documentModal, setDocumentModal] = useState<{
    title: string;
    documents: { label: string; name: string; type: string }[];
  } | null>(null);

  const { notifications, addNotification, getNotificationsByRole, updateNotificationStatus } = useNotifications();

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
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger to force refresh of Approval Rights data
  const [showRightsModal, setShowRightsModal] = useState<string | null>(null);
  const [rightsDecision, setRightsDecision] = useState('');
  const [rightsRemarks, setRightsRemarks] = useState('');
  const [rightsToast, setRightsToast] = useState<string | null>(null);
  const [rightsConfirm, setRightsConfirm] = useState<{ name: string; decision: string } | null>(null);

  // Batch Approval Modal State
  const [showBatchApprovalModal, setShowBatchApprovalModal] = useState(false);
  const [batchDisbursementAmount, setBatchDisbursementAmount] = useState('');
  const [batchApprovalRemarks, setBatchApprovalRemarks] = useState('');

  // Batch Restriction Modal State
  const [showBatchRestrictionModal, setShowBatchRestrictionModal] = useState(false);
  const [batchRestrictionReason, setBatchRestrictionReason] = useState('');
  const [batchRestrictionRemarks, setBatchRestrictionRemarks] = useState('');

  // M&E Project Modal State
  const [showMEProjectModal, setShowMEProjectModal] = useState(false);
  const [meProjectData, setMEProjectData] = useState<{
    sourceType: 'producer';
    sourceId: string;
    sourceName: string;
    sourceEmail?: string;
    sourcePhone?: string;
    schemeId?: string;
    schemeName?: string;
    notificationId?: string;
    submissionData: Record<string, any>;
    projectType: 'registration' | 'scheme-application' | 'incident-report';
  } | null>(null);

  const pageSize = 3;
  const nigerianStates = ['Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'];

  // Get all Producer records




  // Refresh records when status changes


  // Helper function to render full application view for Producer (7 steps)
  const renderFullApplicationView = (applicationData: any, isSchemeApplication: boolean = false) => {
    if (!applicationData) return null;

    // Handle scheme application data
    if (isSchemeApplication) {
      return (
        <div className="mt-4 space-y-4 bg-primary-800 rounded-md p-4">
          <div className="bg-primary-900/60 rounded-md border border-primary-700 p-4 space-y-3">
            <h6 className="text-sm font-semibold text-accent-300 font-sans mb-3">Producer/Farmer Scheme Application Details</h6>

            {/* Produce Type */}
            {applicationData.produceType && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-400 font-serif">Produce Type</dt>
                  <dd className="text-sm text-gray-100 font-sans mt-1">{applicationData.produceType}</dd>
                </div>
              </div>
            )}

            {/* Documents */}
            {applicationData.documents && applicationData.documents.length > 0 && (
              <div className="mt-4 pt-4 border-t border-primary-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs uppercase tracking-wide text-gray-400 font-serif">Supporting Documents</p>
                  <button
                    type="button"
                    onClick={() => {
                      const docs = applicationData.documents.map((doc: any) => ({
                        label: doc.description || 'Supporting Document',
                        name: doc.fileName
                      }));
                      setDocumentModal({
                        title: 'Producer/Farmer Scheme Application Documents',
                        documents: docs.map((doc: any) => ({
                          ...doc,
                          type: doc.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
                        })),
                      });
                    }}
                    className="text-xs text-accent-400 hover:text-accent-300 font-semibold transition-colors"
                  >
                    📄 View & Forward Documents
                  </button>
                </div>
                <ul className="list-disc list-inside text-sm text-gray-100 font-sans space-y-1">
                  {applicationData.documents.map((doc: any, idx: number) => (
                    <li key={idx}>
                      {doc.fileName} {doc.description && `(${doc.description})`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    }

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
    return notifications
      .filter(n => n.metadata?.type === 'producerRegistration' || (n.metadata?.targetRole === 'coordinating-agency' && n.role?.includes('Producer') && n.message.includes('registration')))
      .map(n => ({
        id: n.id,
        name: n.applicantName || n.organization || 'New Applicant',
        email: n.contactPersonEmail || n.metadata?.email || 'No email',
        phone: n.contactPersonPhone || n.metadata?.phone || 'N/A',
        state: n.metadata?.state || 'N/A',
        companyId: n.companyId || n.metadata?.idNumber || 'N/A',
        fullAddress: n.fullAddress || n.metadata?.address || 'N/A',
        organizationProfile: n.organizationProfile || n.metadata?.organizationProfile || 'New stakeholder registration request.',
        contactPersonName: n.applicantName || 'N/A',
        contactPersonEmail: n.contactPersonEmail || n.metadata?.email || 'N/A',
        contactPersonPhone: n.contactPersonPhone || n.metadata?.phone || 'N/A',
        companyEmail: n.companyEmail || n.metadata?.email || 'N/A',
        registrationDate: n.receivedAt ? new Date(n.receivedAt).toLocaleDateString() : new Date().toLocaleDateString(),
        organization: n.organization || n.companyName || 'N/A',
        role: 'Producer/Farmer',
        status: 'unverified' as 'verified' | 'unverified',
        record: null as any,
        metadata: n.metadata,
        applicationData: n.applicationData || {
          step1: { fullName: n.applicantName, email: n.contactPersonEmail, phone: n.contactPersonPhone },
          step2: { farmBusinessName: n.organization }
        }
      }));
  }, [notifications]);

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
    notification?: any; // Store notification for scheme applications
    submissionStatus?: string; // Added for status display
    companyId?: string;
    fullAddress?: string;
    organizationProfile?: string;
    contactPersonName?: string;
    contactPersonEmail?: string;
    contactPersonPhone?: string;
    companyEmail?: string;
    applicationData?: any;
  };

  // Get Producer scheme application notifications
  const producerSchemeNotifications = useMemo(() => {
    const allNotifications = getNotificationsByRole('coordinating-agency');
    return allNotifications.filter(n =>
      n.metadata?.type === 'beneficiarySchemeApplication' &&
      n.metadata?.beneficiaryType === 'Producer/Farmer' &&
      (n.status === 'pending' || n.status === 'read' || n.status === 'approved' || n.status === 'rejected') &&
      n.schemeId
    );
  }, [getNotificationsByRole]);

  const filteredApprovalRightsUsers: ApprovalRightsUser[] = useMemo(() => {
    // Map notifications to ApprovalRightsUser
    const userMap = new Map<string, ApprovalRightsUser & { notification?: any; submissionStatus?: string }>();

    producerSchemeNotifications.forEach(notif => {
      const schemeId = String(notif.schemeId || '').trim();
      const beneficiaryId = String(notif.metadata?.beneficiaryId || '').trim();
      const uniqueUserId = `submission_${schemeId}_${beneficiaryId}`;

      if (!schemeId || !beneficiaryId) return;

      const submissionStatus = notif.status || 'pending';

      // Status display rules:
      // - Pending → show "Pending"
      // - Rejected → show "Rejected"
      // - Approved → show "Approved"
      const displayStatus = submissionStatus === 'approved' ? 'Approved' :
        submissionStatus === 'rejected' ? 'Rejected' :
          'Pending';

      const user: ApprovalRightsUser & { notification?: any; submissionStatus?: string } = {
        id: uniqueUserId,
        name: notif.applicantName || notif.companyName || 'Unknown',
        email: notif.contactPersonEmail || notif.companyEmail || '',
        role: 'Producer/Farmer',
        state: notif.metadata?.state || 'N/A',
        organization: notif.companyName || 'Unknown',
        canApprove: true,
        notification: notif,
        submissionStatus: displayStatus
      };

      userMap.set(uniqueUserId, user);
    });

    return Array.from(userMap.values()).filter((user): user is ApprovalRightsUser => {
      const matchesSearch = !approvalRightsSearch ||
        user.name.toLowerCase().includes(approvalRightsSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(approvalRightsSearch.toLowerCase()) ||
        user.organization.toLowerCase().includes(approvalRightsSearch.toLowerCase());

      const matchesState = approvalRightsStateFilter === 'All' ||
        user.state === approvalRightsStateFilter;

      return matchesSearch && matchesState;
    });
  }, [producerSchemeNotifications, approvalRightsSearch, approvalRightsStateFilter, refreshTrigger]);

  const paginatedApprovalRightsUsers = useMemo(() => {
    const startIndex = (approvalRightsPage - 1) * pageSize;
    return filteredApprovalRightsUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredApprovalRightsUsers, approvalRightsPage]);

  const totalApprovalRightsPages = Math.ceil(filteredApprovalRightsUsers.length / pageSize);
  const approvalRightsAllOnPageSelected = paginatedApprovalRightsUsers.length > 0 && paginatedApprovalRightsUsers.every(u => selectedApprovalRightsUsers.includes(u.id));
  const toggleApprovalRightsSelectAll = () => {
    if (approvalRightsAllOnPageSelected) setSelectedApprovalRightsUsers(prev => prev.filter(id => !paginatedApprovalRightsUsers.some(u => u.id === id)));
    else setSelectedApprovalRightsUsers(prev => [...prev, ...paginatedApprovalRightsUsers.map(u => u.id).filter(id => !prev.includes(id))]);
  };

  // Reset pages on filter/search change
  useEffect(() => { setApprovePage(1); }, [approveSearch, approveStateFilter]);
  useEffect(() => { setRestrictPage(1); }, [restrictSearch, restrictStateFilter]);
  useEffect(() => { setApprovalRightsPage(1); }, [approvalRightsSearch, approvalRightsStateFilter]);

  // Handle opening modal from notification click
  useEffect(() => {
    const notificationIdFromSession = sessionStorage.getItem('openProducerSubmissionModal');
    if (notificationIdFromSession) {
      setShowApprovalModal(notificationIdFromSession);
      sessionStorage.removeItem('openProducerSubmissionModal'); // Clear it after use
    }
  }, [producerSchemeNotifications]);

  const handleApproveCheckboxChange = (userId: string) => setSelectedApproveUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  const handleRestrictCheckboxChange = (userId: string) => setSelectedRestrictUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  const handleApprovalRightsCheckboxChange = (userId: string) => setSelectedApprovalRightsUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);

  // Listen for fundSchemes updates to refresh Approval Rights Card
  useEffect(() => {
    const handleFundSchemesUpdate = () => {
      console.log('[ProducersFarmers] fundSchemes updated - refreshing Approval Rights data');
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('fundSchemes-updated', handleFundSchemesUpdate);
    return () => window.removeEventListener('fundSchemes-updated', handleFundSchemesUpdate);
  }, []);

  const handleMassApprove = () => {
    if (selectedApproveUsers.length === 0) return;
    alert(`Approved ${selectedApproveUsers.length} Producer/Farmer applications`);
    setSelectedApproveUsers([]);
  };

  // Process approval/rejection for scheme applications
  const processSchemeApplicationApproval = (notificationId: string) => {
    console.log('[ProducersFarmers] processSchemeApplicationApproval called with notificationId:', notificationId);
    const notification = producerSchemeNotifications.find(n => n.id === notificationId);
    if (!notification) {
      console.log('[ProducersFarmers] Notification not found!');
      return;
    }

    const isApproved = approvalDecision === 'approve';
    const schemeId = notification.schemeId;
    const beneficiaryId = notification.metadata?.beneficiaryId as string | undefined;

    const trimmedRemarks = approvalRemarks.trim();

    if (!isApproved && !trimmedRemarks) {
      alert('Please provide a reason for rejecting this Producer/Farmer application.');
      return;
    }

    if (isApproved && !disbursementAmount.trim()) {
      alert('Please specify the amount to be disbursed.');
      return;
    }

    // Update notification status
    updateNotificationStatus(notificationId, isApproved ? 'approved' : 'rejected');

    // Notify Producer/Farmer about the decision
    const message = isApproved
      ? `Your application for scheme "${notification.schemeName}" has been approved. You can now proceed to one of the approved PFIs to withdraw your funds.`
      : `Your application for scheme "${notification.schemeName}" has been rejected. ${trimmedRemarks ? `Reason: ${trimmedRemarks}` : ''}`;

    addNotification({
      role: '🏛️ Coordinating Agency',
      targetRole: 'producer',
      message,
      schemeId: notification.schemeId,
      schemeName: notification.schemeName,
      metadata: {
        type: 'beneficiarySchemeApplicationResponse',
        beneficiaryId,
        beneficiaryType: 'Producer/Farmer',
        producerId: beneficiaryId, // Include for filtering
        relatedNotificationId: notification.id,
        rejectionReason: !isApproved ? trimmedRemarks : undefined,
        isApproved: isApproved,
      },
    });

    // Refresh and close modals
    setShowApprovalModal(null);
    setApprovalDecision('');
    setApprovalRemarks('');
    setDisbursementAmount('');
    setShowFullApplication(false);
    setShowApprovalConfirmation(false);
    setShowRejectionConfirmation(false);
    setFinalApprovalNotice(`✅ Decision ${isApproved ? 'Approved' : 'Rejected'} submitted for ${notification.applicantName || 'Producer/Farmer'}`);
    setTimeout(() => setFinalApprovalNotice(null), 3000);
  };

  // Process approval/rejection
  const processApproval = (userId: string) => {
    if (!approvalDecision) return;

    const user = producersFarmers.find(u => u.id === userId);
    if (!user) return;

    const trimmedRemarks = approvalRemarks.trim();
    const isApproved = approvalDecision === 'approve';

    if (!isApproved && !trimmedRemarks) {
      alert('Please provide a reason for rejecting this Producer/Farmer.');
      return;
    }

    // Backend handling
    const backendUserId = (user as any).metadata?.userId;
    if (backendUserId) {
      if (isApproved) {
        userAPI.verify(backendUserId).catch(err => console.error('Failed to verify backend Producer user:', err));
      } else {
        userAPI.deactivate(backendUserId).catch(err => console.error('Failed to reject backend Producer user:', err));
      }

      // Update notification status
      notificationAPI.updateStatus(user.id, isApproved ? 'approved' : 'rejected')
        .catch(err => console.error('Failed to update notification status:', err));
    }

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

    // Check if this is a scheme application or registration application
    const schemeAppUser = filteredApprovalRightsUsers.find(u => u.notification?.id === showApprovalModal);
    const isSchemeApplication = !!schemeAppUser?.notification;

    if (approvalDecision === 'approve' && !showApprovalConfirmation) {
      setShowApprovalConfirmation(true);
      return;
    }

    if (approvalDecision === 'reject' && !showRejectionConfirmation) {
      setShowRejectionConfirmation(true);
      return;
    }

    // Use appropriate handler based on application type
    if (isSchemeApplication) {
      processSchemeApplicationApproval(showApprovalModal);
    } else {
      processApproval(showApprovalModal);
    }
  };

  const handleConfirmApproval = () => {
    setShowApprovalConfirmation(false);
    if (showApprovalModal) {
      // Check if this is a scheme application or registration application
      const schemeAppUser = filteredApprovalRightsUsers.find(u => u.notification?.id === showApprovalModal);
      const isSchemeApplication = !!schemeAppUser?.notification;

      if (isSchemeApplication) {
        processSchemeApplicationApproval(showApprovalModal);
      } else {
        processApproval(showApprovalModal);
      }
    }
  };

  const handleConfirmRejection = () => {
    console.log('[ProducersFarmers] handleConfirmRejection called');
    setShowRejectionConfirmation(false);
    if (showApprovalModal) {
      console.log('[ProducersFarmers] showApprovalModal:', showApprovalModal);
      // Check if this is a scheme application or registration application
      const schemeAppUser = filteredApprovalRightsUsers.find(u => u.notification?.id === showApprovalModal);
      const isSchemeApplication = !!schemeAppUser?.notification;

      console.log('[ProducersFarmers] isSchemeApplication:', isSchemeApplication);
      if (isSchemeApplication) {
        processSchemeApplicationApproval(showApprovalModal);
      } else {
        processApproval(showApprovalModal);
      }
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
    if (user && user.metadata?.userId) {
      userAPI.deactivate(user.metadata.userId).catch(err => console.error('Failed to restrict user:', err));
    }

    // Send notification
    addNotification({
      role: '🏛️ Coordinating Agency',
      targetRole: 'producer',
      message: `Your access has been restricted. Reason: ${restrictRemarks || 'Access restricted by Coordinating Agency'}`,
      metadata: {
        type: 'producerRegistrationResponse',
        producerId: userId,
      },
    });

    setShowRestrictModal(null);
    setRestrictReason('');
    setRestrictRemarks('');
    if (user) {
      setRestrictToast(`🚫 Access restricted for ${user.name}`);
    }
    setTimeout(() => setRestrictToast(null), 3000);
  };

  const handleMassRestrict = () => {
    if (selectedRestrictUsers.length === 0) return;
    setShowBatchRestrictionModal(true);
  };

  const processBatchRestriction = () => {
    if (!batchRestrictionReason.trim()) {
      alert('Please provide a reason for restriction.');
      return;
    }

    const selectedUsers = filteredRestrictUsers.filter(u => selectedRestrictUsers.includes(u.id));

    selectedUsers.forEach(user => {
      const backendUserId = user.metadata?.userId;
      if (backendUserId) {
        userAPI.deactivate(backendUserId).catch(err => console.error('Failed to restrict user:', err));
      }

      // Send notification to Producer
      addNotification({
        role: '🏛️ Coordinating Agency',
        targetRole: 'producer',
        message: `Your access has been restricted. Reason: ${batchRestrictionReason.trim()}${batchRestrictionRemarks.trim() ? ` | ${batchRestrictionRemarks.trim()}` : ''}`,
        metadata: {
          type: 'producerAccessRestricted',
          producerId: user.id,
          reason: batchRestrictionReason.trim(),
        },
      });
    });

    // Close modal and reset
    setShowBatchRestrictionModal(false);
    setBatchRestrictionReason('');
    setBatchRestrictionRemarks('');
    setSelectedRestrictUsers([]);

    // Show success message
    setRestrictToast(`🚫 Successfully restricted access for ${selectedUsers.length} Producer/Farmer users`);
    setTimeout(() => setRestrictToast(null), 3000);
  };

  const handleMassApprovalRights = () => {
    if (selectedApprovalRightsUsers.length === 0) return;

    // Check if any selected items are scheme applications
    const selectedUsers = filteredApprovalRightsUsers.filter(u => selectedApprovalRightsUsers.includes(u.id));
    const hasSchemeApplications = selectedUsers.some(u => !!u.notification);

    if (hasSchemeApplications) {
      // Open batch approval modal for scheme applications
      setShowBatchApprovalModal(true);
    } else {
      // For non-scheme applications (registration), just approve them
      alert(`Updated approval rights for ${selectedApprovalRightsUsers.length} Producer/Farmer users`);
      setSelectedApprovalRightsUsers([]);
    }
  };

  const processBatchApproval = () => {
    if (!batchDisbursementAmount.trim()) {
      alert('Please specify the amount to be disbursed.');
      return;
    }

    const selectedUsers = filteredApprovalRightsUsers.filter(u => selectedApprovalRightsUsers.includes(u.id));
    const schemeApplications = selectedUsers.filter(u => !!u.notification);

    let successCount = 0;

    schemeApplications.forEach(user => {
      const notification = user.notification;
      if (!notification) return;

      const schemeId = notification.schemeId;
      const beneficiaryId = notification.metadata?.beneficiaryId;

      if (schemeId && beneficiaryId) {
        updateNotificationStatus(notification.id, 'approved');

        addNotification({
          role: '🏛️ Coordinating Agency',
          targetRole: 'producer',
          message: `Your application for scheme "${notification.schemeName}" has been approved. You can now proceed to one of the approved PFIs to withdraw your funds.`,
          schemeId: notification.schemeId,
          schemeName: notification.schemeName,
          metadata: {
            type: 'beneficiarySchemeApplicationResponse',
            beneficiaryId,
            beneficiaryType: 'Producer/Farmer',
            producerId: beneficiaryId,
            relatedNotificationId: notification.id,
            isApproved: true,
          },
        });

        successCount++;
      }
    });

    // Close modal and reset
    setShowBatchApprovalModal(false);
    setBatchDisbursementAmount('');
    setBatchApprovalRemarks('');
    setSelectedApprovalRightsUsers([]);

    // Show success message
    setFinalApprovalNotice(`✅ Successfully approved ${successCount} Producer/Farmer scheme applications`);
    setTimeout(() => setFinalApprovalNotice(null), 3000);
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
              <button onClick={() => { }} className="btn-secondary text-xs px-3 py-1">📜 View History</button>
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
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'verified'
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

                    {/* Backend Registration Documents */}
                    {(user as any).metadata?.documentFilenames && (user as any).metadata.documentFilenames.length > 0 && (
                      <div className="bg-primary-800 rounded-md p-4">
                        <h4 className="text-sm font-semibold text-accent-400 font-sans mb-3">Registration Documents</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(user as any).metadata.documentFilenames.map((filename: string, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-primary-700 rounded border border-primary-600">
                              <span className="text-sm text-gray-200 truncate">{filename}</span>
                              <button
                                onClick={() => window.open(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/documents/view/${filename}`, '_blank')}
                                className="text-xs text-accent-400 hover:text-accent-300 font-medium"
                              >
                                View
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setMEProjectData({
                          sourceType: 'producer',
                          sourceId: user.record?.id || user.id,
                          sourceName: user.name,
                          sourceEmail: user.email,
                          sourcePhone: user.phone,
                          submissionData: user.applicationData || {},
                          projectType: 'registration',
                        });
                        setShowMEProjectModal(true);
                        setShowApproveMoreInfo(null);
                      }}
                      className="btn-secondary"
                    >
                      📋 Create M&E Project
                    </button>
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
          // Check if this is a scheme application (notification-based) or registration application
          const schemeAppUser = filteredApprovalRightsUsers.find(u => u.notification?.id === showApprovalModal);
          const registrationUser = producersFarmers.find(u => u.id === showApprovalModal);
          const user = schemeAppUser || registrationUser;
          const notification = schemeAppUser?.notification;
          const isSchemeApplication = !!notification;

          // Extract user data - for scheme applications, get from notification; for registration, use user directly
          const userData = isSchemeApplication && notification && user ? {
            name: notification.applicantName || notification.companyName || user.name,
            email: notification.contactPersonEmail || notification.companyEmail || user.email,
            phone: notification.contactPersonPhone || ((user as any).phone || (user as any).contactPersonPhone),
            fullAddress: notification.fullAddress || (user as any).fullAddress,
            organizationProfile: notification.organizationProfile || (user as any).organizationProfile,
            organization: notification.companyName || (user as any).organization,
            applicationData: notification.applicationData
          } : (user as any);

          return user ? (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowApprovalModal(null)}>
              <div className="min-h-screen flex items-center justify-center py-8">
                <div className="w-full max-w-3xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold font-sans text-gray-100">
                        {isSchemeApplication ? 'Producer/Farmer Scheme Application Review' : 'Producer/Farmer Application Review'}
                      </h3>
                      <div className="mt-2 p-3 bg-primary-800 rounded-md">
                        <p className="text-xs text-accent-400 font-sans font-medium mb-1">🌾 Producer/Farmer</p>
                        <p className="text-sm text-gray-200">
                          {userData.name} - {isSchemeApplication ? `Scheme: ${notification?.schemeName || 'Unknown'}` : 'Registration Application'}
                        </p>
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
                          <p className="text-sm text-gray-100 font-sans">{userData.name}</p>
                        </div>
                        {userData.email && (
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Email</p>
                            <p className="text-sm text-gray-100 font-sans">{userData.email}</p>
                          </div>
                        )}
                        {userData.phone && (
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Phone</p>
                            <p className="text-sm text-gray-100 font-sans">{userData.phone}</p>
                          </div>
                        )}
                        {userData.fullAddress && (
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-400 font-serif mb-1">Address</p>
                            <p className="text-sm text-gray-100 font-sans">{userData.fullAddress}</p>
                          </div>
                        )}
                        {userData.organizationProfile && (
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-400 font-serif mb-1">Farm Business</p>
                            <p className="text-sm text-gray-100 font-sans">{userData.organizationProfile}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Backend Registration Documents (Approval View) */}
                    {(userData as any).metadata?.documentFilenames && (userData as any).metadata.documentFilenames.length > 0 && (
                      <div className="bg-primary-800 rounded-md p-4">
                        <h4 className="text-sm font-semibold text-accent-400 font-sans mb-3">Registration Documents</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(userData as any).metadata.documentFilenames.map((filename: string, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-primary-700 rounded border border-primary-600">
                              <span className="text-sm text-gray-200 truncate">{filename}</span>
                              <button
                                onClick={() => window.open(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/documents/view/${filename}`, '_blank')}
                                className="text-xs text-accent-400 hover:text-accent-300 font-medium"
                              >
                                View
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Scheme Application Details - PFI and IC Selections */}
                    {isSchemeApplication && notification && (() => {
                      // Get from notification.applicationData
                      const selectedPFIId = notification.applicationData?.selectedPFI;
                      const selectedICId = notification.applicationData?.selectedInsuranceCompany;
                      const produceType = notification.applicationData?.produceType;

                      const selectedPFIName = notification.applicationData?.selectedPFIName;
                      const selectedICName = notification.applicationData?.selectedICName;
                      const pfiInterestRate = notification.applicationData?.pfiInterestRate;
                      const icPremiumRate = notification.applicationData?.icPremiumRate;

                      // If we have selections, display them
                      if (selectedPFIId || selectedICId) {
                        return (
                          <div className="bg-primary-800 rounded-md p-4">
                            <h4 className="text-sm font-semibold text-accent-400 font-sans mb-3">Selected Service Providers</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {selectedPFIId && (
                                <div>
                                  <p className="text-xs text-gray-400 font-serif mb-1">Selected PFI</p>
                                  <p className="text-sm text-gray-100 font-sans font-medium">{selectedPFIName || 'PFI'}</p>
                                  {pfiInterestRate && <p className="text-xs text-gray-400 font-serif mt-1">Interest Rate: {pfiInterestRate}%</p>}
                                </div>
                              )}
                              {selectedICId && (
                                <div>
                                  <p className="text-xs text-gray-400 font-serif mb-1">Selected Insurance Company</p>
                                  <p className="text-sm text-gray-100 font-sans font-medium">{selectedICName || 'Insurance Company'}</p>
                                  {icPremiumRate && <p className="text-xs text-gray-400 font-serif mt-1">Premium Rate: {icPremiumRate}%</p>}
                                </div>
                              )}
                              {produceType && (
                                <div>
                                  <p className="text-xs text-gray-400 font-serif mb-1">Produce Type</p>
                                  <p className="text-sm text-gray-100 font-sans">{produceType}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </div>


                  {/* View Full Application Section */}
                  {userData.applicationData && (
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

                      {showFullApplication && renderFullApplicationView(userData.applicationData, isSchemeApplication)}
                    </div>
                  )}

                  {/* M&E Verification Option - for scheme applications */}
                  {isSchemeApplication && notification && (
                    <div className="mb-6 border-t border-primary-700 pt-4">
                      <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">📋</div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-blue-300 mb-1">Request M&E Verification</h4>
                            <p className="text-xs text-gray-400 mb-3">
                              Before making a decision, you can request the M&E team to verify this scheme application in the field.
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                const beneficiaryId = notification.metadata?.beneficiaryId as string;
                                setMEProjectData({
                                  sourceType: 'producer',
                                  sourceId: beneficiaryId || user.id,
                                  sourceName: userData.name || user.name,
                                  sourceEmail: userData.email,
                                  sourcePhone: userData.phone,
                                  submissionData: {
                                    schemeId: notification.schemeId,
                                    schemeName: notification.schemeName,
                                    applicationType: 'Scheme Application',
                                    applicationData: userData.applicationData || notification.applicationData,
                                  },
                                  projectType: 'scheme-application',
                                  schemeId: notification.schemeId,
                                  schemeName: notification.schemeName,
                                  notificationId: notification.id,
                                });
                                setShowMEProjectModal(true);
                              }}
                              className="btn-secondary text-sm"
                            >
                              📋 Create M&E Verification Project
                            </button>
                          </div>
                        </div>
                      </div>
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
                    {isSchemeApplication && approvalDecision === 'approve' && (
                      <div>
                        <label className="block text-sm text-gray-300 font-serif mb-1">
                          Amount to be Disbursed <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={disbursementAmount}
                          onChange={(e) => setDisbursementAmount(e.target.value)}
                          placeholder="Enter amount to be disbursed"
                          className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"
                          required
                          min="0"
                          step="0.01"
                        />
                        <p className="text-xs text-gray-400 mt-1 font-serif">Enter the amount to be disbursed to this Producer/Farmer for the scheme.</p>
                      </div>
                    )}
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

          {selectedRestrictUsers.length > 0 && (
            <div className="flex items-center justify-between p-2 bg-accent-600/20 border border-accent-600 rounded-md mb-4">
              <span className="text-sm text-gray-200 font-sans">{selectedRestrictUsers.length} selected</span>
              <button
                onClick={handleMassRestrict}
                className="btn-primary text-xs px-3 py-1"
              >
                🚫 Restrict All Selected
              </button>
            </div>
          )}

          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {paginatedRestrictUsers.length > 0 ? (
              <>
                <div className="flex items-center gap-2 p-2 bg-primary-700 rounded-md mb-3">
                  <input
                    type="checkbox"
                    checked={restrictAllOnPageSelected}
                    onChange={toggleRestrictSelectAll}
                    className="w-4 h-4 accent-accent-500"
                  />
                  <span className="text-xs text-gray-400 font-sans">Select All</span>
                </div>
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
              </>
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

          {selectedApprovalRightsUsers.length > 0 && (
            <div className="flex items-center justify-between p-2 bg-accent-600/20 border border-accent-600 rounded-md mb-4">
              <span className="text-sm text-gray-200 font-sans">{selectedApprovalRightsUsers.length} selected</span>
              <button
                onClick={handleMassApprovalRights}
                className="btn-primary text-xs px-3 py-1"
              >
                ✅ Approve All Selected
              </button>
            </div>
          )}

          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {paginatedApprovalRightsUsers.length > 0 ? (
              <>
                <div className="flex items-center gap-2 p-2 bg-primary-700 rounded-md mb-3">
                  <input
                    type="checkbox"
                    checked={approvalRightsAllOnPageSelected}
                    onChange={toggleApprovalRightsSelectAll}
                    className="w-4 h-4 accent-accent-500"
                  />
                  <span className="text-xs text-gray-400 font-sans">Select All</span>
                </div>
                <div className="space-y-4">
                  {paginatedApprovalRightsUsers.map((user) => {
                    const isSchemeApplication = !!user.notification;
                    return (
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
                              {isSchemeApplication && user.notification?.schemeName && (
                                <p className="text-xs text-accent-400 font-sans mt-1">
                                  Scheme: {user.notification.schemeName}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {isSchemeApplication && user.submissionStatus && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.submissionStatus === 'Approved'
                                  ? 'bg-green-500 text-white'
                                  : user.submissionStatus === 'Rejected'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-yellow-500 text-white'
                                  }`}>
                                  {user.submissionStatus}
                                </span>
                              )}
                              {!isSchemeApplication && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.canApprove ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                                  }`}>
                                  {user.canApprove ? 'Can Approve' : 'No Approval Rights'}
                                </span>
                              )}
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
                              <span>🌾</span> {user.organization}
                            </span>
                          </div>
                          {!isSchemeApplication && (
                            <>
                              <div className="bg-primary-700 p-2 rounded-md mb-2">
                                <label className="flex items-center gap-2 text-sm text-gray-300 font-serif cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={user.canApprove}
                                    onChange={() => {/* toggleApprovalRights(user.id) */ }}
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
                            </>
                          )}
                          {isSchemeApplication && (
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => setShowApprovalModal(user.notification.id)}
                                className="btn-primary text-sm px-3 py-1"
                              >
                                📋 Review Application
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
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

                    {/* Backend Registration Documents (Approval View) */}
                    {(user as any).metadata?.documentFilenames && (user as any).metadata.documentFilenames.length > 0 && (
                      <div className="bg-primary-800 rounded-md p-4">
                        <h4 className="text-sm font-semibold text-accent-400 font-sans mb-3">Registration Documents</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(user as any).metadata.documentFilenames.map((filename: string, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-primary-700 rounded border border-primary-600">
                              <span className="text-sm text-gray-200 truncate">{filename}</span>
                              <button
                                onClick={() => window.open(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/documents/view/${filename}`, '_blank')}
                                className="text-xs text-accent-400 hover:text-accent-300 font-medium"
                              >
                                View
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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

        {/* M&E Project Modal */}
        {showMEProjectModal && meProjectData && (
          <CreateMEProjectModal
            isOpen={showMEProjectModal}
            onClose={() => {
              setShowMEProjectModal(false);
              setMEProjectData(null);
            }}
            projectType={meProjectData.projectType}
            sourceType="producer"
            sourceId={meProjectData.sourceId}
            sourceName={meProjectData.sourceName}
            sourceEmail={meProjectData.sourceEmail}
            sourcePhone={meProjectData.sourcePhone}
            schemeId={meProjectData.schemeId}
            schemeName={meProjectData.schemeName}
            notificationId={meProjectData.notificationId}
            submissionData={meProjectData.submissionData}
            onSuccess={() => {
              setFinalApprovalNotice('✅ M&E Project created successfully! M&E team members have been notified.');
              setTimeout(() => setFinalApprovalNotice(null), 3000);
            }}
          />
        )}

        {/* Batch Restriction Modal */}
        {showBatchRestrictionModal && (
          <div className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center" onClick={() => setShowBatchRestrictionModal(false)}>
            <div className="w-full max-w-md bg-primary-900 border border-primary-700 rounded-lg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 font-sans">Batch Restriction</h3>
                  <p className="text-sm text-gray-300 font-serif mt-2">
                    Restrict access for {selectedRestrictUsers.length} selected Producer/Farmer users
                  </p>
                </div>
                <button
                  onClick={() => setShowBatchRestrictionModal(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  ✖
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 font-serif mb-1">
                    Reason for Restriction <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={batchRestrictionReason}
                    onChange={(e) => setBatchRestrictionReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"
                    required
                  >
                    <option value="">Select reason</option>
                    <option value="Fraudulent Activity">Fraudulent Activity</option>
                    <option value="Policy Violation">Policy Violation</option>
                    <option value="Suspicious Behavior">Suspicious Behavior</option>
                    <option value="Non-compliance">Non-compliance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 font-serif mb-1">
                    Additional Remarks (Optional)
                  </label>
                  <textarea
                    value={batchRestrictionRemarks}
                    onChange={(e) => setBatchRestrictionRemarks(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"
                    placeholder="Add additional remarks (optional)"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowBatchRestrictionModal(false);
                    setBatchRestrictionReason('');
                    setBatchRestrictionRemarks('');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={processBatchRestriction}
                  className="btn-primary bg-red-600 hover:bg-red-700"
                >
                  🚫 Restrict All ({selectedRestrictUsers.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Batch Approval Modal */}
        {showBatchApprovalModal && (
          <div className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center" onClick={() => setShowBatchApprovalModal(false)}>
            <div className="w-full max-w-md bg-primary-900 border border-primary-700 rounded-lg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 font-sans">Batch Approval</h3>
                  <p className="text-sm text-gray-300 font-serif mt-2">
                    Approve {selectedApprovalRightsUsers.length} selected Producer/Farmer scheme applications
                  </p>
                </div>
                <button
                  onClick={() => setShowBatchApprovalModal(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  ✖
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 font-serif mb-1">
                    Amount to be Disbursed <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={batchDisbursementAmount}
                    onChange={(e) => setBatchDisbursementAmount(e.target.value)}
                    placeholder="Enter amount to be disbursed"
                    className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"
                    required
                    min="0"
                    step="0.01"
                  />
                  <p className="text-xs text-gray-400 mt-1 font-serif">This amount will be applied to all selected applications.</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 font-serif mb-1">
                    Remarks (Optional)
                  </label>
                  <textarea
                    value={batchApprovalRemarks}
                    onChange={(e) => setBatchApprovalRemarks(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"
                    placeholder="Add remarks (optional)"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowBatchApprovalModal(false);
                    setBatchDisbursementAmount('');
                    setBatchApprovalRemarks('');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={processBatchApproval}
                  className="btn-primary"
                >
                  ✅ Approve All ({selectedApprovalRightsUsers.length})
                </button>
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


