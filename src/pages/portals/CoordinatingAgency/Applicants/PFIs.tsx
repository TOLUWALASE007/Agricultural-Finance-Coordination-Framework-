import React, { useState, useMemo, useEffect } from 'react';
import PortalLayout from '../../../../components/PortalLayout';
import { getPFIs, updatePFIStatus, buildPFIApplicationData, PFIRecord } from '../../../../utils/localDatabase';
import { useNotifications } from '../../../../context/NotificationContext';

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

  // State for different access management sections
  const [approveSearch, setApproveSearch] = useState('');
  const [approvePage, setApprovePage] = useState(1);
  const [approveStateFilter, setApproveStateFilter] = useState('All');
  const [selectedApproveUsers, setSelectedApproveUsers] = useState<string[]>([]);
  const [showApproveMoreInfo, setShowApproveMoreInfo] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState<string | null>(null);
  const [approvalDecision, setApprovalDecision] = useState('');
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [showApprovalHistory, setShowApprovalHistory] = useState(false);
  const [finalApprovalNotice, setFinalApprovalNotice] = useState<string | null>(null);
  const [finalApprovalConfirm, setFinalApprovalConfirm] = useState<{ name: string; decision: string } | null>(null);
  const [showFullApplication, setShowFullApplication] = useState(false);
  const [showApprovalConfirmation, setShowApprovalConfirmation] = useState(false);
  const [showRejectionConfirmation, setShowRejectionConfirmation] = useState(false);
  const [documentModal, setDocumentModal] = useState<{
    title: string;
    documents: { label: string; name: string; type: string }[];
  } | null>(null);

  const { addNotification, getNotificationsByRole } = useNotifications();

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

  // Batch Approval Modal State
  const [showBatchApprovalModal, setShowBatchApprovalModal] = useState(false);
  const [batchApprovalRemarks, setBatchApprovalRemarks] = useState('');

  // Batch Restriction Modal State
  const [showBatchRestrictionModal, setShowBatchRestrictionModal] = useState(false);
  const [batchRestrictionReason, setBatchRestrictionReason] = useState('');
  const [batchRestrictionRemarks, setBatchRestrictionRemarks] = useState('');

  // Get all PFI records
  const [pfiRecords, setPfiRecords] = useState<PFIRecord[]>([]);

  useEffect(() => {
    const records = getPFIs();
    setPfiRecords(records);
  }, []);

  // Refresh records when status changes
  const refreshPFIs = () => {
    const records = getPFIs();
    setPfiRecords(records);
  };

  const pageSize = 3;

  // Helper function to render full application view for PFI
  const renderFullApplicationView = (applicationData: any) => {
    if (!applicationData) return null;

    // Check if this is a PFI scheme application (has proposedInterestRate)
    if (applicationData.proposedInterestRate !== undefined) {
      return (
        <div className="mt-4 space-y-4 bg-primary-800 rounded-md p-4">
          <div className="bg-primary-900/60 rounded-md border border-primary-700 p-4 space-y-3">
            <h6 className="text-sm font-semibold text-accent-300 font-sans mb-3">PFI Scheme Application Details</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <dt className="text-xs uppercase tracking-wide text-gray-400 font-serif">Proposed Interest Rate</dt>
                <dd className="text-sm text-gray-100 font-sans mt-1">{applicationData.proposedInterestRate}%</dd>
              </div>
            </div>
            {applicationData.policies && (
              <div className="mt-4 pt-4 border-t border-primary-700">
                <dt className="text-xs uppercase tracking-wide text-gray-400 font-serif mb-2">Policies</dt>
                <dd className="text-sm text-gray-100 font-sans mt-1 whitespace-pre-line break-words">{applicationData.policies}</dd>
              </div>
            )}
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
                        title: 'PFI Scheme Application Documents',
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

    // Otherwise, it's a registration application - render the full registration details
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
      position: 'Position',
      gender: 'Gender',
      birthDate: 'Date of Birth',
    });

    const contactInformationEntries = buildEntries(step2, {
      email: 'Email Address',
      phone: 'Phone Number',
      whatsapp: 'WhatsApp (Optional)',
      address: 'Residential / Office Address',
      city: 'City',
      state: 'State',
      country: 'Country',
    });

    const verificationEntries = buildEntries(step3, {
      idType: 'ID Type',
      idNumber: 'ID Number',
      emergencyContactName: 'Emergency Contact Name',
      emergencyContactPhone: 'Emergency Contact Phone',
      emergencyRelationship: 'Relationship with Emergency Contact',
      idDocumentName: 'Uploaded ID Document',
    });

    const basicInformationEntries = buildEntries(step4, {
      organizationName: 'Organization Name',
      registrationNumber: 'Registration Number / CAC Number',
      organizationType: 'Type of Organization',
      yearEstablished: 'Year Established',
      industry: 'Industry / Sector',
      missionStatement: 'Short Description / Mission Statement',
    });

    const addressInformationEntries = buildEntries(step5, {
      headquartersAddress: 'Headquarters Address',
      hqCity: 'Headquarters City',
      hqState: 'Headquarters State',
      hqCountry: 'Headquarters Country',
      officePhone: 'Office Phone Number',
      officialEmail: 'Official Email Address',
      website: 'Website URL',
      facebook: 'Facebook Handle',
      linkedin: 'LinkedIn Handle',
      twitter: 'X Handle',
      instagram: 'Instagram Handle',
    });

    const operationsEntries = buildEntries(
      {
        numEmployees: step6.numEmployees,
        areasOfOperation: Array.isArray(step6.areasOfOperation) ? step6.areasOfOperation.join(', ') : step6.areasOfOperation,
        hasPartnership: step6.hasPartnership,
        partnershipDetails: step6.partnershipDetails,
      },
      {
        numEmployees: 'Number of Employees / Volunteers',
        areasOfOperation: 'Areas of Operation / Coverage',
        hasPartnership: 'Has Partnership or Affiliation',
        partnershipDetails: 'Partnership Details',
      }
    );

    const verificationDocuments =
      step3?.idDocumentName && step3.idDocumentName !== 'Not provided'
        ? [{ label: 'Government-issued ID', name: String(step3.idDocumentName) }]
        : [];

    const operationsDocuments = [
      step6?.organizationLogoName && step6.organizationLogoName !== 'Not provided'
        ? { label: 'Organization Logo', name: String(step6.organizationLogoName) }
        : null,
      step6?.certificateOfIncorporationName && step6.certificateOfIncorporationName !== 'Not provided'
        ? {
          label: 'Certificate of Incorporation / Registration',
          name: String(step6.certificateOfIncorporationName),
        }
        : null,
    ].filter(Boolean) as { label: string; name: string }[];

    return (
      <div className="mt-4 space-y-6 bg-primary-800 rounded-md p-4">
        <div className="space-y-4">
          <h5 className="text-sm font-semibold text-accent-400 font-sans uppercase tracking-wide">Contact Info</h5>
          {renderGroup('Personal Details', personalDetailsEntries)}
          {renderGroup('Contact Information', contactInformationEntries)}
          {renderGroup(
            'Verification & Emergency',
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
        </div>
        <div className="space-y-4">
          <h5 className="text-sm font-semibold text-accent-400 font-sans uppercase tracking-wide">Organization Info</h5>
          {renderGroup('Basic Information', basicInformationEntries)}
          {renderGroup('Address & Contact Info', addressInformationEntries)}
          {renderGroup(
            'Operations & Documentation',
            operationsEntries,
            operationsDocuments.length > 0 ? (
              <button
                type="button"
                onClick={() => openDocuments('Operations & Documentation Documents', operationsDocuments)}
                className="text-xs text-accent-400 hover:text-accent-300 font-semibold transition-colors"
              >
                View Documents
              </button>
            ) : undefined
          )}
        </div>
      </div>
    );
  };

  // Nigerian states
  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
    'Taraba', 'Yobe', 'Zamfara'
  ];

  // Transform PFI records to display format
  const pfiApplicants = useMemo(() => {
    return pfiRecords.map(record => {
      // Normalize formData to ensure areasOfOperation is an array
      const normalizedFormData = {
        ...record.formData,
        areasOfOperation: Array.isArray(record.formData.areasOfOperation)
          ? record.formData.areasOfOperation
          : (record.formData.areasOfOperation ? [record.formData.areasOfOperation] : [])
      };

      return {
        id: record.id,
        name: record.formData.organizationName || record.formData.fullName,
        email: record.email,
        phone: record.formData.phone,
        state: record.formData.state,
        companyId: record.formData.registrationNumber,
        fullAddress: `${record.formData.address}, ${record.formData.city}, ${record.formData.state}, ${record.formData.country}`,
        organizationProfile: record.formData.missionStatement || 'Not provided',
        contactPersonName: record.formData.fullName,
        contactPersonEmail: record.formData.email,
        contactPersonPhone: record.formData.phone,
        companyEmail: record.formData.officialEmail,
        registrationDate: record.lastSubmittedAt,
        organization: record.formData.organizationName || record.formData.fullName,
        role: 'PFI',
        status: record.status, // 'verified' or 'unverified'
        record: record, // Store full record for access
        applicationData: buildPFIApplicationData(normalizedFormData)
      };
    });
  }, [pfiRecords]);

  // Filter and paginate functions for Approve Access - ALL PFIs
  const filteredApproveUsers = useMemo(() => {
    return pfiApplicants.filter(user => {
      const matchesState = approveStateFilter === 'All' || user.state === approveStateFilter;
      const matchesSearch = user.name.toLowerCase().includes(approveSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(approveSearch.toLowerCase()) ||
        user.organization.toLowerCase().includes(approveSearch.toLowerCase());
      return matchesState && matchesSearch;
    });
  }, [pfiApplicants, approveStateFilter, approveSearch]);

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

  // Filter for Restrict Access - ONLY Approved (verified) PFIs
  const filteredRestrictUsers = useMemo(() => {
    return pfiApplicants
      .filter(user => user.status === 'verified')
      .filter(user => {
        const matchesState = restrictStateFilter === 'All' || user.state === restrictStateFilter;
        const matchesSearch = user.name.toLowerCase().includes(restrictSearch.toLowerCase()) ||
          user.email.toLowerCase().includes(restrictSearch.toLowerCase()) ||
          user.organization.toLowerCase().includes(restrictSearch.toLowerCase());
        return matchesState && matchesSearch;
      });
  }, [pfiApplicants, restrictStateFilter, restrictSearch]);


  const paginatedRestrictUsers = useMemo(() => {
    const startIndex = (restrictPage - 1) * pageSize;
    return filteredRestrictUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredRestrictUsers, restrictPage]);

  const totalRestrictPages = Math.ceil(filteredRestrictUsers.length / pageSize);

  // Filter for Approval Rights - PFIs who applied for schemes (using notifications)
  // This card is preserved for scheme applications, not registration approvals
  type ApprovalRightsUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    state: string;
    organization: string;
    canApprove: boolean;
    notification?: any; // Store notification for scheme applications
    submissionStatus?: string; // Status of the submission: 'Approved' or 'Pending'
  };

  // Fetch PFI scheme application notifications
  // Include all statuses (pending, read, approved, rejected) to maintain audit trail
  // Items are only removed when the scheme is deleted
  const pfiSchemeNotifications = useMemo(() => {
    const allNotifications = getNotificationsByRole('coordinating-agency');
    const filtered = allNotifications.filter(n =>
      n.metadata?.type === 'pfiSchemeApplication' &&
      (n.status === 'pending' || n.status === 'read' || n.status === 'approved' || n.status === 'rejected') &&
      n.schemeId
    );

    // DEBUG: Log PFI notification count to track any clearing
    console.log('[PFI Approval Rights] Total CA notifications:', allNotifications.length);
    console.log('[PFI Approval Rights] PFI notifications found:', filtered.length);
    if (filtered.length > 0) {
      console.log('[PFI Approval Rights] PFI notifications:', filtered.map(n => ({
        id: n.id,
        schemeId: n.schemeId,
        company: n.companyName,
        status: n.status
      })));
    }

    return filtered;
  }, [getNotificationsByRole]);

  const filteredApprovalRightsUsers: ApprovalRightsUser[] = useMemo(() => {
    // Load schemes to check submission status
    const storedSchemes = localStorage.getItem('fundSchemes');
    const schemes = storedSchemes ? JSON.parse(storedSchemes) : [];

    // Step 1: Build a map of all applications (pending, approved, rejected) from scheme data
    // This is the source of truth for application status
    const applicationsMap = new Map<string, {
      schemeId: string;
      pfiId: string;
      submittedAt: string;
      status: 'pending' | 'approved' | 'rejected';
    }>();
    schemes.forEach((scheme: any) => {
      if (scheme.pfiApplications) {
        scheme.pfiApplications.forEach((app: any) => {
          const key = `${scheme.id}_${app.pfiId}`;
          // Keep the most recent application for each scheme+PFI combination
          const existing = applicationsMap.get(key);
          if (!existing || (app.submittedAt && (!existing.submittedAt || app.submittedAt > existing.submittedAt))) {
            applicationsMap.set(key, {
              schemeId: scheme.id,
              pfiId: app.pfiId,
              submittedAt: app.submittedAt,
              status: app.status || 'pending'
            });
          }
        });
      }
    });

    // Step 2: Filter notifications to only those matching applications in scheme data
    // and deduplicate by schemeId + pfiId
    const notificationMap = new Map<string, typeof pfiSchemeNotifications[0]>();
    const seenNotificationIds = new Set<string>();

    pfiSchemeNotifications.forEach(notif => {
      // Skip if we've already seen this notification ID
      if (seenNotificationIds.has(notif.id)) {
        return;
      }
      seenNotificationIds.add(notif.id);

      // Normalize keys
      const schemeId = String(notif.schemeId || '').trim();
      const pfiId = String(notif.metadata?.pfiId || '').trim();
      const uniqueKey = `${schemeId}_${pfiId}`;

      // Skip if key is invalid
      if (!schemeId || !pfiId) {
        return;
      }

      // Check if this application exists in scheme data
      const application = applicationsMap.get(uniqueKey);
      if (!application) {
        // This application doesn't exist in scheme data (scheme may have been deleted)
        return;
      }

      // Check if the scheme still exists (not deleted)
      const scheme = schemes.find((s: any) => s.id === schemeId);
      if (!scheme) {
        // Scheme has been deleted - don't show this application
        return;
      }

      // Keep ALL applications (pending, approved, rejected) - they all remain visible
      // Check if we already have a notification for this application
      const existing = notificationMap.get(uniqueKey);
      if (!existing) {
        // First notification for this application - add it
        notificationMap.set(uniqueKey, notif);
      } else {
        // We already have a notification - keep the best one
        // Priority: pending > read, then most recent
        const existingIsPending = existing.status === 'pending';
        const currentIsPending = notif.status === 'pending';

        if (currentIsPending && !existingIsPending) {
          // Current is pending, existing is read - keep current
          notificationMap.set(uniqueKey, notif);
        } else if (!currentIsPending && existingIsPending) {
          // Current is read, existing is pending - keep existing
          // Do nothing
        } else {
          // Both have same status - keep the most recent one
          const existingTime = existing.receivedAt || '';
          const currentTime = notif.receivedAt || '';
          if (currentTime > existingTime) {
            notificationMap.set(uniqueKey, notif);
          }
        }
      }
    });

    // Step 3: Get final unique list
    const finalUniqueNotifications = Array.from(notificationMap.values());

    // Map to Approval Rights Users, using schemeId + pfiId as the unique ID
    // This ensures that even if there are multiple notifications, we only show one user entry
    const userMap = new Map<string, ApprovalRightsUser & { notification?: any; submissionStatus?: string }>();

    finalUniqueNotifications.forEach(notif => {
      const schemeId = String(notif.schemeId || '').trim();
      const pfiId = String(notif.metadata?.pfiId || '').trim();
      const uniqueUserId = `submission_${schemeId}_${pfiId}`;

      // Skip if we already have a user for this application
      if (userMap.has(uniqueUserId)) {
        return;
      }

      const pfiRecord = pfiApplicants.find(r => r.record?.id === pfiId);
      const application = applicationsMap.get(`${schemeId}_${pfiId}`);
      const applicationStatus = application?.status || 'pending';

      // Status display rules:
      // - Approved → show "Approved"
      // - Rejected → show "Pending" (because PFI can reapply, so CA is still waiting)
      // - Pending → show "Pending"
      const displayStatus = applicationStatus === 'approved' ? 'Approved' : 'Pending';

      const user: ApprovalRightsUser & { notification?: any; submissionStatus?: string } = {
        id: uniqueUserId, // Use stable unique ID based on application, not notification
        name: notif.applicantName || notif.companyName || pfiRecord?.name || 'Unknown',
        email: notif.contactPersonEmail || notif.companyEmail || pfiRecord?.email || '',
        role: 'PFI',
        state: pfiRecord?.state || 'N/A',
        organization: notif.companyName || pfiRecord?.organization || 'Unknown',
        canApprove: true,
        notification: notif, // Store the full notification for access
        submissionStatus: displayStatus // Display status according to rules
      };

      userMap.set(uniqueUserId, user);
    });

    return Array.from(userMap.values()).filter((user): user is ApprovalRightsUser & { notification?: any; submissionStatus?: string } => {
      // Filter by search
      const matchesSearch = !approvalRightsSearch ||
        user.name.toLowerCase().includes(approvalRightsSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(approvalRightsSearch.toLowerCase()) ||
        user.organization.toLowerCase().includes(approvalRightsSearch.toLowerCase());

      // Filter by state
      const matchesState = approvalRightsStateFilter === 'All' ||
        user.state === approvalRightsStateFilter;

      return matchesSearch && matchesState;
    });
  }, [pfiSchemeNotifications, pfiApplicants, approvalRightsSearch, approvalRightsStateFilter]);

  const paginatedApprovalRightsUsers = useMemo(() => {
    const startIndex = (approvalRightsPage - 1) * pageSize;
    return filteredApprovalRightsUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredApprovalRightsUsers, approvalRightsPage]);

  const totalApprovalRightsPages = Math.ceil(filteredApprovalRightsUsers.length / pageSize);

  // Build submission history from all schemes
  const submissionHistory = useMemo(() => {
    const storedSchemes = localStorage.getItem('fundSchemes');
    if (!storedSchemes) return [];

    const schemes = JSON.parse(storedSchemes);
    const history: Array<{
      date: string;
      pfiName: string;
      schemeName: string;
      action: 'Approved' | 'Rejected';
      rejectionReason?: string;
      reviewedAt: string;
    }> = [];

    schemes.forEach((scheme: any) => {
      if (scheme.pfiApplications) {
        scheme.pfiApplications.forEach((app: any) => {
          // Only include applications that have been reviewed (approved or rejected)
          if (app.reviewedAt && (app.status === 'approved' || app.status === 'rejected')) {
            const pfiRecord = pfiApplicants.find(r => r.record?.id === app.pfiId);
            const pfiName = pfiRecord?.name || pfiRecord?.organization || 'Unknown PFI';

            history.push({
              date: new Date(app.reviewedAt).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }).replace(',', ''),
              pfiName,
              schemeName: scheme.name || 'Unknown Scheme',
              action: app.status === 'approved' ? 'Approved' : 'Rejected',
              rejectionReason: app.reviewNotes || undefined,
              reviewedAt: app.reviewedAt
            });
          }
        });
      }
    });

    // Sort by reviewedAt (most recent first)
    return history.sort((a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime());
  }, [pfiApplicants]);

  // Check for sessionStorage flag to open modal only when explicitly triggered by notification click
  // (must be after pfiSchemeNotifications and filteredApprovalRightsUsers declaration)
  useEffect(() => {
    // Only open modal if there's a sessionStorage flag indicating intentional click
    const notificationIdToOpen = sessionStorage.getItem('openPFISubmissionModal');
    if (notificationIdToOpen && !showApprovalModal) {
      // Clear the flag immediately to prevent reopening on subsequent renders
      sessionStorage.removeItem('openPFISubmissionModal');

      // Function to find and open the modal
      const findAndOpenModal = () => {
        // First, check all notifications (not just filtered ones) to find the notification
        const allNotifications = getNotificationsByRole('coordinating-agency');
        const notification = allNotifications.find(n =>
          n.id === notificationIdToOpen &&
          n.metadata?.type === 'pfiSchemeApplication'
        );

        if (notification) {
          // Open the modal with the notification ID
          setShowApprovalModal(notificationIdToOpen);
          // Scroll to top to ensure modal is visible
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return true;
        }
        return false;
      };

      // Try immediately first
      if (findAndOpenModal()) {
        return;
      }

      // If not found, try again after a delay (notifications might still be loading)
      const timer = setTimeout(() => {
        findAndOpenModal();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [getNotificationsByRole, showApprovalModal]);

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
    // Handle mass approval if needed
    alert(`Approved ${selectedApproveUsers.length} PFI applications`);
    setSelectedApproveUsers([]);
    refreshPFIs();
  };

  // Process approval/rejection for scheme applications
  const processSchemeApplicationApproval = (notificationId: string) => {
    if (!approvalDecision) return;

    // Find the notification to get scheme and PFI details
    const allNotifications = getNotificationsByRole('coordinating-agency');
    const notification = allNotifications.find(n => n.id === notificationId);

    if (!notification || notification.metadata?.type !== 'pfiSchemeApplication') {
      // Not a scheme application, fall back to registration approval
      processApproval(notificationId);
      return;
    }

    const trimmedRemarks = approvalRemarks.trim();
    const isApproved = approvalDecision === 'approve';
    const schemeId = notification.schemeId;
    const pfiId = notification.metadata?.pfiId as string | undefined;

    if (!isApproved && !trimmedRemarks) {
      alert('Please provide a reason for rejecting this PFI application.');
      return;
    }

    if (schemeId && pfiId) {
      // Update scheme in localStorage
      const storedSchemes = localStorage.getItem('fundSchemes');
      if (storedSchemes) {
        const schemes = JSON.parse(storedSchemes);
        const updatedSchemes = schemes.map((scheme: any) => {
          if (scheme.id === schemeId) {
            const updatedApplications = (scheme.pfiApplications || []).map((app: any) => {
              if (app.pfiId === pfiId && app.submittedAt === (notification.applicationData as any)?.submittedAt) {
                return {
                  ...app,
                  status: isApproved ? 'approved' : 'rejected',
                  reviewedAt: new Date().toISOString(),
                  reviewNotes: trimmedRemarks || undefined
                };
              }
              return app;
            });

            const updatedScheme: any = {
              ...scheme,
              pfiApplications: updatedApplications
            };

            // If approved, check if this is the first approved PFI (scheme becomes eligible for Beneficiaries)
            if (isApproved) {
              // Check if this is the first approved PFI
              const approvedPFICount = updatedApplications.filter((app: any) => app.status === 'approved').length;
              const wasFirstApproval = approvedPFICount === 1;

              if (wasFirstApproval && scheme.workflowStage === 'stage1') {
                // Notify CA that scheme is ready to open for Beneficiaries
                addNotification({
                  role: '🏛️ Coordinating Agency',
                  targetRole: 'coordinating-agency',
                  message: `A scheme is now ready to open for Beneficiary applications.`,
                  schemeId: schemeId,
                  schemeName: scheme.name,
                  metadata: {
                    type: 'schemeReadyForBeneficiaries',
                    schemeId: schemeId,
                    actionType: 'open_for_beneficiaries'
                  }
                });
              }
            }

            // If approved, add to selectedPFIIds
            if (isApproved) {
              updatedScheme.selectedPFIIds = [...(scheme.selectedPFIIds || []), pfiId];
            }

            return updatedScheme;
          }
          return scheme;
        });
        localStorage.setItem('fundSchemes', JSON.stringify(updatedSchemes));
      }
    }

    // Notify PFI
    const message = isApproved
      ? `Your application for scheme "${notification.schemeName}" has been approved. Your proposed interest rate of ${(notification.applicationData as any)?.proposedInterestRate}% has been accepted.`
      : `Your application for scheme "${notification.schemeName}" has been rejected. ${trimmedRemarks ? `Reason: ${trimmedRemarks}` : ''}`;

    addNotification({
      role: '🏛️ Coordinating Agency',
      targetRole: 'pfi',
      message,
      schemeId: notification.schemeId,
      schemeName: notification.schemeName,
      metadata: {
        type: 'pfiSchemeApplicationResponse',
        pfiId,
        relatedNotificationId: notification.id,
      },
    });

    // Close modals and reset state
    setShowApprovalModal(null);
    setShowRejectionConfirmation(false);
    setApprovalDecision('');
    setApprovalRemarks('');
    setShowFullApplication(false);

    // Show success message
    setFinalApprovalNotice(`✅ Decision ${isApproved ? 'Approved' : 'Rejected'} submitted for scheme application`);
    setTimeout(() => setFinalApprovalNotice(null), 3000);
  };

  // Process approval/rejection for registration applications
  const processApproval = (userId: string) => {
    if (!approvalDecision) return;

    const user = pfiApplicants.find(u => u.id === userId);
    if (!user || !user.record) return;

    const trimmedRemarks = approvalRemarks.trim();
    const isApproved = approvalDecision === 'approve';

    if (!isApproved && !trimmedRemarks) {
      alert('Please provide a reason for rejecting this PFI.');
      return;
    }

    // Update PFI status
    updatePFIStatus(user.record.id, isApproved ? 'verified' : 'unverified', {
      rejectionReason: isApproved ? undefined : trimmedRemarks,
      pendingNotificationId: null,
    });

    // Send notification to PFI
    const message = isApproved
      ? 'Your registration has been approved. You now have full access.'
      : `Your registration has been rejected due to ${trimmedRemarks}. Please update your details and resubmit for approval.`;

    addNotification({
      role: '🏛️ Coordinating Agency',
      targetRole: 'pfi',
      message,
      metadata: {
        type: 'pfiRegistrationResponse',
        pfiId: user.record.id,
      },
    });

    refreshPFIs();
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
    setShowRejectionConfirmation(false);
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
    const user = pfiApplicants.find(u => u.id === userId);
    if (!user || !user.record) return;

    // Change status from verified to unverified
    updatePFIStatus(user.record.id, 'unverified', {
      rejectionReason: restrictRemarks || 'Access restricted by Coordinating Agency',
      pendingNotificationId: null,
    });

    // Send notification
    addNotification({
      role: '🏛️ Coordinating Agency',
      targetRole: 'pfi',
      message: `Your access has been restricted. Reason: ${restrictRemarks || 'Access restricted by Coordinating Agency'}`,
      metadata: {
        type: 'pfiRegistrationResponse',
        pfiId: user.record.id,
      },
    });

    refreshPFIs();
    setShowRestrictModal(null);
    setRestrictReason('');
    setRestrictRemarks('');
    setRestrictToast(`🚫 Access restricted for ${user.name}`);
    setTimeout(() => setRestrictToast(null), 3000);
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
    setShowBatchRestrictionModal(true);
  };

  const processBatchRestriction = () => {
    if (!batchRestrictionReason.trim()) {
      alert('Please provide a reason for restriction.');
      return;
    }

    const selectedUsers = filteredRestrictUsers.filter(u => selectedRestrictUsers.includes(u.id));

    selectedUsers.forEach(user => {
      if (user.record) {
        const restrictionMessage = `RESTRICTED: ${batchRestrictionReason.trim()}${batchRestrictionRemarks.trim() ? ` | ${batchRestrictionRemarks.trim()}` : ''}`;
        updatePFIStatus(user.record.id, 'unverified', {
          rejectionReason: restrictionMessage,
          pendingNotificationId: null,
        });

        addNotification({
          role: '🏛️ Coordinating Agency',
          targetRole: 'pfi',
          message: `Your access has been restricted. Reason: ${batchRestrictionReason.trim()}${batchRestrictionRemarks.trim() ? ` | ${batchRestrictionRemarks.trim()}` : ''}`,
          metadata: {
            type: 'pfiAccessRestricted',
            pfiId: user.record.id,
            reason: batchRestrictionReason.trim(),
          },
        });
      }
    });

    setShowBatchRestrictionModal(false);
    setBatchRestrictionReason('');
    setBatchRestrictionRemarks('');
    setSelectedRestrictUsers([]);
    refreshPFIs();

    setRestrictToast(`🚫 Successfully restricted access for ${selectedUsers.length} PFI users`);
    setTimeout(() => setRestrictToast(null), 3000);
  };

  // Select-all helpers (Restrict)
  const restrictAllOnPageSelected = paginatedRestrictUsers.length > 0 && paginatedRestrictUsers.every(u => selectedRestrictUsers.includes(u.id));
  const toggleRestrictSelectAll = () => {
    if (restrictAllOnPageSelected) {
      setSelectedRestrictUsers(prev => prev.filter(id => !paginatedRestrictUsers.some(u => u.id === id)));
    } else {
      const toAdd = paginatedRestrictUsers.map(u => u.id).filter(id => !selectedRestrictUsers.includes(id));
      setSelectedRestrictUsers(prev => [...prev, ...toAdd]);
    }
  };

  // Select-all helpers (Approval Rights)
  const rightsAllOnPageSelected = paginatedApprovalRightsUsers.length > 0 && paginatedApprovalRightsUsers.every(u => selectedApprovalRightsUsers.includes(u.id));
  const toggleRightsSelectAll = () => {
    if (rightsAllOnPageSelected) {
      setSelectedApprovalRightsUsers(prev => prev.filter(id => !paginatedApprovalRightsUsers.some(u => u.id === id)));
    } else {
      const toAdd = paginatedApprovalRightsUsers.map(u => u.id).filter(id => !selectedApprovalRightsUsers.includes(id));
      setSelectedApprovalRightsUsers(prev => [...prev, ...toAdd]);
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
    setShowBatchApprovalModal(true);
  };

  const { updateNotificationStatus } = useNotifications();

  const processBatchApproval = () => {
    if (!batchApprovalRemarks.trim()) {
      alert('Please provide remarks for batch approval.');
      return;
    }

    const selectedUsers = filteredApprovalRightsUsers.filter(u => selectedApprovalRightsUsers.includes(u.id));

    let successCount = 0;
    const storedSchemes = localStorage.getItem('fundSchemes');
    if (storedSchemes) {
      let schemes = JSON.parse(storedSchemes);

      selectedUsers.forEach(user => {
        const notification = user.notification;
        if (!notification) return;

        const schemeId = notification.schemeId;
        const pfiId = notification.metadata?.pfiId;

        if (schemeId && pfiId) {
          schemes = schemes.map((scheme: any) => {
            if (scheme.id === schemeId) {
              const updatedApplications = (scheme.pfiApplications || []).map((app: any) => {
                if (app.pfiId === pfiId && app.status === 'pending') {
                  return {
                    ...app,
                    status: 'approved',
                    reviewedAt: new Date().toISOString(),
                    reviewNotes: batchApprovalRemarks.trim()
                  };
                }
                return app;
              });

              return {
                ...scheme,
                pfiApplications: updatedApplications
              };
            }
            return scheme;
          });

          updateNotificationStatus(notification.id, 'approved');

          addNotification({
            role: '🏛️ Coordinating Agency',
            targetRole: 'pfi',
            message: `Your application for scheme "${notification.schemeName}" has been approved.`,
            schemeId: notification.schemeId,
            schemeName: notification.schemeName,
            metadata: {
              type: 'pfiSchemeApplicationResponse',
              pfiId,
              relatedNotificationId: notification.id,
              isApproved: true,
            },
          });

          successCount++;
        }
      });

      localStorage.setItem('fundSchemes', JSON.stringify(schemes));
    }

    setShowBatchApprovalModal(false);
    setBatchApprovalRemarks('');
    setSelectedApprovalRightsUsers([]);
    refreshPFIs();

    setFinalApprovalNotice(`✅ Successfully approved ${successCount} PFI applications`);
    setTimeout(() => setFinalApprovalNotice(null), 3000);
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

        {/* More Info Modal - Shows Full Application View */}
        {showApproveMoreInfo && (() => {
          const user = pfiApplicants.find(u => u.id === showApproveMoreInfo);
          return user ? (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowApproveMoreInfo(null)}>
              <div className="min-h-screen flex items-center justify-center py-8">
                <div className="w-full max-w-3xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold font-sans text-gray-100">PFI Application</h3>
                      <div className="mt-2 p-3 bg-primary-800 rounded-md">
                        <p className="text-xs text-accent-400 font-sans font-medium mb-1">🏦 PFI</p>
                        <p className="text-sm text-gray-200">{user.organization} - Registration Application</p>
                      </div>
                    </div>
                    <button onClick={() => setShowApproveMoreInfo(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                  </div>

                  {/* Application Details Section */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-primary-800 rounded-md p-4">
                      <h4 className="text-sm font-semibold text-accent-400 font-sans mb-3">Company Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-400 font-serif mb-1">Organization Name</p>
                          <p className="text-sm text-gray-100 font-sans">{user.organization}</p>
                        </div>
                        {user.companyId && (
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Company ID</p>
                            <p className="text-sm text-gray-100 font-sans">{user.companyId}</p>
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
                            <p className="text-xs text-gray-400 font-serif mb-1">Organization Profile</p>
                            <p className="text-sm text-gray-100 font-sans">{user.organizationProfile}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Person Information */}
                    <div className="bg-primary-800 rounded-md p-4">
                      <h4 className="text-sm font-semibold text-accent-400 font-sans mb-3">Contact Person Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {user.contactPersonName && (
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Name</p>
                            <p className="text-sm text-gray-100 font-sans">{user.contactPersonName}</p>
                          </div>
                        )}
                        {user.contactPersonEmail && (
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Email</p>
                            <p className="text-sm text-gray-100 font-sans">{user.contactPersonEmail}</p>
                          </div>
                        )}
                        {user.contactPersonPhone && (
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Phone</p>
                            <p className="text-sm text-gray-100 font-sans">{user.contactPersonPhone}</p>
                          </div>
                        )}
                        {user.companyEmail && (
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Company Email</p>
                            <p className="text-sm text-gray-100 font-sans">{user.companyEmail}</p>
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
          // Check if this is a scheme application (notification-based) or registration application
          const schemeAppUser = filteredApprovalRightsUsers.find(u => u.notification?.id === showApprovalModal);
          const registrationUser = pfiApplicants.find(u => u.id === showApprovalModal);
          const user = schemeAppUser || registrationUser;
          const notification = schemeAppUser?.notification;
          const isSchemeApplication = !!notification;

          // Extract user data - for scheme applications, get from notification; for registration, use user directly
          const userData = isSchemeApplication && notification && user ? {
            organization: notification.companyName || user.organization,
            companyId: notification.companyId,
            fullAddress: notification.fullAddress,
            organizationProfile: notification.organizationProfile,
            contactPersonName: notification.contactPersonName,
            contactPersonEmail: notification.contactPersonEmail,
            contactPersonPhone: notification.contactPersonPhone,
            companyEmail: notification.companyEmail,
            applicationData: notification.applicationData
          } : (user as any);

          return user ? (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowApprovalModal(null)}>
              <div className="min-h-screen flex items-center justify-center py-8">
                <div className="w-full max-w-3xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold font-sans text-gray-100">
                        {isSchemeApplication ? 'PFI Scheme Application Review' : 'PFI Application Review'}
                      </h3>
                      <div className="mt-2 p-3 bg-primary-800 rounded-md">
                        <p className="text-xs text-accent-400 font-sans font-medium mb-1">🏦 PFI</p>
                        <p className="text-sm text-gray-200">
                          {user.organization} - {isSchemeApplication ? `Scheme: ${notification?.schemeName || 'Unknown'}` : 'Registration Application'}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => setShowApprovalModal(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                  </div>

                  {/* Application Details Section */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-primary-800 rounded-md p-4">
                      <h4 className="text-sm font-semibold text-accent-400 font-sans mb-3">Company Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-400 font-serif mb-1">Organization Name</p>
                          <p className="text-sm text-gray-100 font-sans">{userData.organization || user.organization}</p>
                        </div>
                        {userData.companyId && (
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Company ID</p>
                            <p className="text-sm text-gray-100 font-sans">{userData.companyId}</p>
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
                            <p className="text-xs text-gray-400 font-serif mb-1">Organization Profile</p>
                            <p className="text-sm text-gray-100 font-sans">{userData.organizationProfile}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Person Information */}
                    <div className="bg-primary-800 rounded-md p-4">
                      <h4 className="text-sm font-semibold text-accent-400 font-sans mb-3">Contact Person Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {userData.contactPersonName && (
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Name</p>
                            <p className="text-sm text-gray-100 font-sans">{userData.contactPersonName}</p>
                          </div>
                        )}
                        {userData.contactPersonEmail && (
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Email</p>
                            <p className="text-sm text-gray-100 font-sans">{userData.contactPersonEmail}</p>
                          </div>
                        )}
                        {userData.contactPersonPhone && (
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Phone</p>
                            <p className="text-sm text-gray-100 font-sans">{userData.contactPersonPhone}</p>
                          </div>
                        )}
                        {userData.companyEmail && (
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Company Email</p>
                            <p className="text-sm text-gray-100 font-sans">{userData.companyEmail}</p>
                          </div>
                        )}
                      </div>
                    </div>
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

                      {showFullApplication && renderFullApplicationView(userData.applicationData)}
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

        {finalApprovalNotice && (
          <div className="fixed right-4 bottom-4 sm:right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">{finalApprovalNotice}</div>
        )}

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
                  <form onSubmit={(e) => { e.preventDefault(); handleRestrictAccess(user.id); }} className="space-y-4">
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

        {restrictToast && (<div className="fixed right-4 bottom-4 sm:right-6 z-50 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg">{restrictToast}</div>)}

        {/* Rights Modal */}
        {showRightsModal && (() => {
          const user = filteredApprovalRightsUsers.find(u => u.id === showRightsModal);
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
        <div className="card flex flex-col">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-semibold font-sans text-gray-100">Approve Access</h2>
                <span className="px-2 py-1 bg-accent-600 text-white text-xs rounded-full font-medium">
                  {filteredApproveUsers.filter(u => u.status === 'unverified').length} Pending
                </span>
              </div>
              <button onClick={() => setShowApprovalHistory(true)} className="btn-secondary text-xs px-3 py-1">📜 View History</button>
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
                              <span>🏢</span> {user.organization}
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
                            <span>🏢</span> {user.organization}
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
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-gray-400 font-sans">No users found</p>
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

        {/* Approval Rights Card */}
        <div className="card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold font-sans text-gray-100">Approval Rights</h2>
            <button onClick={() => setShowApprovalRightsHistory(true)} className="text-xs text-accent-400 hover:text-accent-300 font-medium flex items-center gap-1">📜 View History</button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <input
                value={approvalRightsSearch}
                onChange={(e) => { setApprovalRightsSearch(e.target.value); setApprovalRightsPage(1); }}
                placeholder="Search users..."
                className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                🔍
              </button>
            </div>
            <select
              value={approvalRightsStateFilter}
              onChange={(e) => { setApprovalRightsStateFilter(e.target.value); setApprovalRightsPage(1); }}
              className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="All">Filter by State</option>
              {nigerianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
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
                    checked={rightsAllOnPageSelected}
                    onChange={toggleRightsSelectAll}
                    className="w-4 h-4 accent-accent-500"
                  />
                  <span className="text-xs text-gray-400 font-sans">Select All</span>
                </div>
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
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${(user as any).submissionStatus === 'Approved'
                            ? 'bg-green-500 text-white'
                            : 'bg-yellow-500 text-white'
                            }`}>
                            {(user as any).submissionStatus || 'Pending'}
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
                          {user.notification?.schemeName && (
                            <span className="flex items-center gap-1">
                              <span>💼</span> Scheme: {user.notification.schemeName}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {user.notification ? (
                            <button
                              onClick={() => {
                                // For scheme applications, open PortalLayout approval modal directly
                                // This will be handled by PortalLayout's notification system
                                setShowApprovalModal(user.notification.id);
                                setShowApprovalRightsMoreInfo(user.id);
                              }}
                              className="btn-primary text-sm px-3 py-1"
                            >
                              📋 Review Application
                            </button>
                          ) : (
                            <>
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
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <div className="text-4xl mb-2">📋</div>
                <p className="text-gray-400 font-sans">No scheme applications found</p>
                <p className="text-xs text-gray-500 mt-2">This card displays PFIs who applied for schemes</p>
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

        {/* Approval Rights History Modal */}
        {showApprovalRightsHistory && (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowApprovalRightsHistory(false)}>
            <div className="min-h-screen flex items-center justify-center py-8">
              <div className="w-full max-w-3xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold font-sans text-gray-100">PFI Scheme Application History</h3>
                  <button onClick={() => setShowApprovalRightsHistory(false)} className="text-gray-400 hover:text-gray-200">✖</button>
                </div>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {submissionHistory.length > 0 ? (
                    submissionHistory.map((entry, idx) => (
                      <div key={idx} className="bg-primary-800 rounded p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm text-gray-400">{entry.date}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${entry.action === 'Approved'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                            }`}>
                            {entry.action}
                          </span>
                        </div>
                        <p className="text-sm text-gray-200 mb-1">
                          <strong>{entry.pfiName}</strong> - {entry.action} for scheme <strong>{entry.schemeName}</strong>
                        </p>
                        {entry.rejectionReason && (
                          <p className="text-xs text-gray-400 mt-2 p-2 bg-primary-700 rounded">
                            <span className="font-semibold">Rejection Reason:</span> {entry.rejectionReason}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400 font-sans">No submission history available</p>
                      <p className="text-xs text-gray-500 mt-2">Submission decisions will appear here once actions are taken</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end mt-4">
                  <button onClick={() => setShowApprovalRightsHistory(false)} className="btn-primary">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Document Modal */}
        {documentModal && (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setDocumentModal(null)}>
            <div className="min-h-screen flex items-center justify-center py-8">
              <div className="w-full max-w-3xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold font-sans text-gray-100">{documentModal.title}</h3>
                    <p className="text-xs text-gray-400 font-serif mt-1">Preview and forward documents submitted by the PFI</p>
                  </div>
                  <button onClick={() => setDocumentModal(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                </div>
                <div className="space-y-3 mb-4">
                  {documentModal.documents.map((doc, index) => (
                    <div key={index} className="bg-primary-800 rounded-md p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-100 font-sans">{doc.label}</p>
                          <p className="text-xs text-gray-400 font-serif mt-1">{doc.name}</p>
                          <span className="inline-block mt-2 px-2 py-1 bg-accent-600 text-white text-xs rounded">
                            {doc.type}
                          </span>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              // In a real application, this would open the document for preview
                              // For now, we'll show an alert
                              alert(`Previewing document: ${doc.name}\n\nIn a production environment, this would open the document viewer.`);
                            }}
                            className="text-xs bg-primary-700 hover:bg-primary-600 text-gray-100 px-3 py-1 rounded transition-colors"
                          >
                            👁️ Preview
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-primary-700 pt-4">
                  <h4 className="text-sm font-semibold text-accent-400 font-sans mb-3">Forward Documents</h4>
                  <div className="bg-primary-800 rounded-md p-4 space-y-3">
                    <div>
                      <label className="block text-xs text-gray-400 font-serif mb-1">Forward To</label>
                      <select className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 text-sm">
                        <option value="">Select recipient...</option>
                        <option value="insurance">Insurance Companies</option>
                        <option value="fund-provider">Fund Provider</option>
                        <option value="beneficiaries">Beneficiaries</option>
                        <option value="other">Other Parties</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 font-serif mb-1">Message (Optional)</label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 text-sm"
                        placeholder="Add a message to accompany the forwarded documents..."
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setDocumentModal(null)}
                        className="btn-secondary text-sm px-4 py-2"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          alert('Documents forwarded successfully!\n\nIn a production environment, this would send the documents to the selected recipient.');
                          setDocumentModal(null);
                        }}
                        className="btn-primary text-sm px-4 py-2"
                      >
                        📤 Forward Documents
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button onClick={() => setDocumentModal(null)} className="btn-secondary">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Batch Restriction Modal */}
        {showBatchRestrictionModal && (
          <div className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center" onClick={() => setShowBatchRestrictionModal(false)}>
            <div className="w-full max-w-md bg-primary-900 border border-primary-700 rounded-lg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 font-sans">Batch Restriction</h3>
                  <p className="text-sm text-gray-300 font-serif mt-2">
                    Restrict access for {selectedRestrictUsers.length} selected PFI users
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
                    Approve {selectedApprovalRightsUsers.length} selected PFI scheme applications
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
                    Remarks <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={batchApprovalRemarks}
                    onChange={(e) => setBatchApprovalRemarks(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"
                    placeholder="Add remarks for batch approval"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1 font-serif">These remarks will be applied to all selected applications.</p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowBatchApprovalModal(false);
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
        <div className="text-center text-gray-400 text-sm py-4">
          Powered by Mc. George
        </div>
      </div>
    </PortalLayout>
  );
};

export default PFIApplicants;

