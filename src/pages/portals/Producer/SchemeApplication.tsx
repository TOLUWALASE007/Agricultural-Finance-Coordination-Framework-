import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../../components/PortalLayout';
import { schemeAPI } from '../../../utils/api';
import { useNotifications } from '../../../context/NotificationContext';
import { getProducerStatusSnapshot, ProducerStatus, getActiveProducerRecord } from '../../../utils/localDatabase';
import { getInsuranceCompanies, findInsuranceCompanyById } from '../../../utils/localDatabase';
import { getPFIs, findPFIById } from '../../../utils/localDatabase';

const SchemeApplication: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [schemesPage, setSchemesPage] = useState(1);
  const [schemeSearch, setSchemeSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const schemesPerPage = 3;

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/producer' },
    { id: 'scheme-application', name: 'Schemes Application', icon: '📝', href: '/portal/producer/scheme-application' },
    {
      id: 'anchor-relationships',
      name: 'Anchor Relationships',
      icon: '⚓',
      hasDropdown: true,
      dropdownItems: [
        { id: 'current-anchors', name: 'View Current Anchors', icon: '👁️', href: '/portal/producer/anchor-relationships/current' },
        { id: 'invitations', name: 'Accept/Decline Invitations', icon: '📨', href: '/portal/producer/anchor-relationships/invitations' },
        { id: 'leave-request', name: 'Request to Leave Anchor', icon: '🚪', href: '/portal/producer/anchor-relationships/leave' },
        { id: 'communication', name: 'Anchor Communication', icon: '💬', href: '/portal/producer/anchor-relationships/communication' },
        { id: 'history', name: 'Relationship History', icon: '📜', href: '/portal/producer/anchor-relationships/history' },
      ]
    },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/producer/settings' }
  ];

  const [status, setStatus] = useState<ProducerStatus>('unverified');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [recordLoaded, setRecordLoaded] = useState(false);

  useEffect(() => {
    const snapshot = getProducerStatusSnapshot();
    if (snapshot) {
      setStatus(snapshot.status);
      setRejectionReason(snapshot.rejectionReason);
    }
    setRecordLoaded(true);
  }, []);

  const isVerified = status === 'verified';

  const { addNotification } = useNotifications();
  const activeProducer = useMemo(() => getActiveProducerRecord(), []);

  const [formData, setFormData] = useState({
    // Step 1: Contact Information
    nameOfAccount: '',
    accountWebsite: '',
    contactPersonName: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
    discussPreviousProjects: '',

    // Step 2: Account Profile
    profileType: '',
    maximumAmountExpected: '',
    targetAudience: '',
    averageFundingMarket: '',
    geographicFocus: [] as string[],
    descriptionOfServices: '',
    fundingProgramsPreviousBenefit: '',

    // Step 3: Financial Products and Terms
    financialProductsOffered: [] as string[],
    termsOfReferenceAFCF: '',
    termsOfReferencePFI: '',
    termsOfReferenceInsurance: '',
    termsOfReferenceBeneficiaries: '',

    // Step 4: Reporting and Transparency
    reportingFrequency: '',
    reportingMechanisms: '',
    transparencyMeasures: '',
    monitoringAndEvaluation: '',

    // Step 5: Compliance and Documentation
    regulatoryCompliance: '',
    fundSchemeDocumentation: null as File | null,
    contractDocumentation: null as File | null,
    exitStrategy: '',
    recordsHistory: ''
  });

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
    'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
    'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  const profileTypes = [
    'Government Agency',
    'Private Fund',
    'Development Organization',
    'Impact Investment Fund',
    'Commercial Bank',
    'Microfinance Institution',
    'Non-Governmental Organization (NGO)',
    'Other'
  ];

  const targetAudienceOptions = [
    'Anchors/Lead Firms',
    'Cooperative Groups'
  ];

  const financialProducts = [
    'Loans',
    'Grant',
    'Equity Investment'
  ];

  const fundingMarkets = [
    'Enterprise',
    'Livestock',
    'Arable',
    'SMEs',
    'Agribusiness'
  ];

  // Beneficiary Application Form Data (for workflow)
  const [beneficiaryApplicationData, setBeneficiaryApplicationData] = useState({
    produceType: '',
    selectedPFI: '',
    selectedInsuranceCompany: '',
    documents: [] as Array<{ fileName: string; description: string; file: File | null }>
  });

  // Modal state
  const [showFullSchemeDetails, setShowFullSchemeDetails] = useState(false);
  const [expandedInsuranceCompany, setExpandedInsuranceCompany] = useState<string | null>(null);
  const [expandedPFI, setExpandedPFI] = useState<string | null>(null);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);

  // Available Schemes Data
  const [availableSchemes, setAvailableSchemes] = useState<any[]>([]);
  const [schemesLoading, setSchemesLoading] = useState(true);

  // Fetch schemes from API or localStorage
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setSchemesLoading(true);

        // Get current Producer ID
        if (!activeProducer) {
          setAvailableSchemes([]);
          setSchemesLoading(false);
          return;
        }

        // First, check if there's localStorage data (from Coordinating Agency portal)
        const storedSchemes = localStorage.getItem('fundSchemes');
        if (storedSchemes) {
          try {
            const parsedSchemes = JSON.parse(storedSchemes);
            // Filter schemes: only show Active schemes in initial stage that are open to beneficiaries
            // and where Producer/Farmer hasn't already applied
            const relevantSchemes = parsedSchemes
              .filter((scheme: any) => {
                const isActive = scheme.status === 'Active';
                const isInitial = scheme.workflowStage === 'initial';
                const isOpenToBeneficiaries = scheme.openToBeneficiaries === true;
                const hasSelectedPFIs = scheme.selectedPFIIds && scheme.selectedPFIIds.length > 0;
                // Check if Producer/Farmer has a rejected or approved application
                // Rejected and approved schemes must be hidden from Available Schemes
                // Pending applications should still show the scheme as available
                const application = scheme.beneficiaryApplications?.find((app: any) =>
                  app.beneficiaryId === activeProducer.id &&
                  app.beneficiaryType === 'Producer/Farmer'
                );
                const isRejectedOrApproved = application && (application.status === 'rejected' || application.status === 'approved');
                // Only show if Active, initial stage, open to beneficiaries, has PFIs, and not rejected/approved
                return isActive && isInitial && isOpenToBeneficiaries && hasSelectedPFIs && !isRejectedOrApproved;
              })
              .map((scheme: any) => ({
                id: scheme.id,
                title: scheme.name || scheme.title || 'Untitled Scheme',
                description: scheme.description || `Fund scheme: ${scheme.name || scheme.title || 'Untitled'}`,
                amount: scheme.amount || 'N/A',
                deadline: scheme.applicationDeadline || scheme.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                category: 'Fund Scheme',
                state: scheme.state || 'Multi-State',
                status: scheme.status || 'Active',
                workflowStage: scheme.workflowStage || 'stage2',
                fullSchemeData: scheme,
                selectedPFIs: scheme.pfiApplications?.filter((app: any) => scheme.selectedPFIIds?.includes(app.pfiId)) || [],
                approvedInsuranceCompany: scheme.insuranceCompanySubmissions?.find((sub: any) => sub.status === 'approved')
              }));
            setAvailableSchemes(relevantSchemes);
            setSchemesLoading(false);
            return;
          } catch (e) {
            console.error('Error parsing stored schemes:', e);
          }
        }

        // If no localStorage, fetch from API
        const response = await schemeAPI.getAll({
          page: 1,
          limit: 100,
          status: 'Active'
        });

        if (response.success && response.data) {
          // Transform API data to match the component's expected format
          // Filter out any schemes with status 'Past' or 'Inactive'
          const transformedSchemes = response.data
            .filter((scheme: any) => scheme.status === 'Active')
            .map((scheme: any) => ({
              id: scheme.schemeId,
              title: scheme.schemeName,
              description: scheme.description || `Fund scheme: ${scheme.schemeName}`,
              amount: scheme.amount,
              deadline: new Date(scheme.applicationDeadline).toISOString().split('T')[0],
              category: 'Fund Scheme',
              state: scheme.state || scheme.states?.join(', ') || 'Multi-State',
              status: scheme.status || 'Active' // Include status for filtering
            }));
          setAvailableSchemes(transformedSchemes);
        } else {
          // If response is not successful, do not display schemes
          setAvailableSchemes([]);
        }
      } catch (err: any) {
        console.error('Error fetching schemes:', err);
        // Do not display schemes on error - clear array
        setAvailableSchemes([]);
      } finally {
        setSchemesLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  // Listen for notification clicks to open scheme application modal
  useEffect(() => {
    const handleNotificationSchemeClick = (event: CustomEvent) => {
      const { schemeId } = event.detail;
      if (schemeId) {
        handleApplyToScheme(schemeId);
      }
    };

    window.addEventListener('notification-scheme-click' as any, handleNotificationSchemeClick as EventListener);
    return () => {
      window.removeEventListener('notification-scheme-click' as any, handleNotificationSchemeClick as EventListener);
    };
  }, []);

  // Check for schemeId in URL on load (from notification click)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const schemeIdFromUrl = urlParams.get('schemeId');
    if (schemeIdFromUrl && !selectedScheme && !showForm) {
      handleApplyToScheme(schemeIdFromUrl);
      // Clean up URL after opening modal
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Filter schemes based on search and state
  // Also exclude any schemes with status 'Completed' (double-check)
  const filteredSchemes = useMemo(() => {
    let filtered = availableSchemes.filter((scheme: any) => {
      // Additional check: exclude if status is 'Completed' (shouldn't happen if filtering worked above, but double-check)
      return scheme.status === 'Active';
    });

    if (schemeSearch.trim()) {
      const searchLower = schemeSearch.toLowerCase();
      filtered = filtered.filter((scheme: any) =>
        scheme.title.toLowerCase().includes(searchLower) ||
        scheme.description.toLowerCase().includes(searchLower) ||
        scheme.category.toLowerCase().includes(searchLower) ||
        scheme.amount.toLowerCase().includes(searchLower)
      );
    }

    if (stateFilter !== 'All') {
      filtered = filtered.filter((scheme: any) =>
        scheme.state === stateFilter || scheme.state?.toLowerCase().includes(stateFilter.toLowerCase())
      );
    }

    return filtered;
  }, [availableSchemes, schemeSearch, stateFilter]);

  // Pagination for schemes
  const totalSchemesPages = Math.ceil(filteredSchemes.length / schemesPerPage);
  const paginatedSchemes = useMemo(() => {
    const startIndex = (schemesPage - 1) * schemesPerPage;
    const endIndex = startIndex + schemesPerPage;
    return filteredSchemes.slice(startIndex, endIndex);
  }, [filteredSchemes, schemesPage, schemesPerPage]);

  // Reset to page 1 when search or state filter changes
  useEffect(() => {
    setSchemesPage(1);
  }, [schemeSearch, stateFilter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string, value: string) => {
    setFormData(prev => {
      const currentArray = prev[name as keyof typeof prev] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return {
        ...prev,
        [name]: newArray
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      [name]: file
    }));
  };


  const validateStep = (step: number): boolean => {
    // Allow navigation without validation for now
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Prepare application data
      const applicationData = {
        step1: {
          nameOfAccount: formData.nameOfAccount,
          accountWebsite: formData.accountWebsite,
          contactPersonName: formData.contactPersonName,
          contactPersonEmail: formData.contactPersonEmail,
          contactPersonPhone: formData.contactPersonPhone,
          discussPreviousProjects: formData.discussPreviousProjects
        },
        step2: {
          profileType: formData.profileType,
          maximumAmountExpected: formData.maximumAmountExpected,
          targetAudience: formData.targetAudience,
          averageFundingMarket: formData.averageFundingMarket,
          geographicFocus: formData.geographicFocus,
          descriptionOfServices: formData.descriptionOfServices,
          fundingProgramsPreviousBenefit: formData.fundingProgramsPreviousBenefit
        },
        step3: {
          financialProductsOffered: formData.financialProductsOffered,
          termsOfReferenceAFCF: formData.termsOfReferenceAFCF,
          termsOfReferencePFI: formData.termsOfReferencePFI,
          termsOfReferenceInsurance: formData.termsOfReferenceInsurance,
          termsOfReferenceBeneficiaries: formData.termsOfReferenceBeneficiaries
        },
        step4: {
          reportingFrequency: formData.reportingFrequency,
          reportingMechanisms: formData.reportingMechanisms,
          transparencyMeasures: formData.transparencyMeasures,
          monitoringAndEvaluation: formData.monitoringAndEvaluation
        },
        step5: {
          regulatoryCompliance: formData.regulatoryCompliance,
          exitStrategy: formData.exitStrategy,
          recordsHistory: formData.recordsHistory
        }
      };

      const selectedSchemeData = availableSchemes.find(s => s.id === selectedScheme);

      // Create notification to CA
      const applicationId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      addNotification({
        role: '🌾 Producer/Farmer',
        targetRole: 'coordinating-agency',
        message: `New scheme application from ${formData.nameOfAccount || formData.contactPersonName} for scheme "${selectedSchemeData?.title || 'Unknown Scheme'}".`,
        applicantName: formData.contactPersonName,
        applicantType: 'Individual',
        companyName: formData.nameOfAccount,
        contactPersonName: formData.contactPersonName,
        contactPersonEmail: formData.contactPersonEmail,
        contactPersonPhone: formData.contactPersonPhone,
        companyEmail: formData.contactPersonEmail,
        schemeId: selectedScheme || '',
        schemeName: selectedSchemeData?.title || '',
        applicationId: applicationId,
        applicationData: applicationData,
        applicationStatus: 'pending',
        metadata: {
          type: 'producerSchemeApplication',
          producerId: activeProducer?.id,
        },
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitting(false);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      setIsSubmitting(false);
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleApplyToScheme = (schemeId: string) => {
    setSelectedScheme(schemeId);
    setShowForm(true);
    setCurrentStep(1);
    // Reset beneficiary application form
    setBeneficiaryApplicationData({
      produceType: '',
      selectedPFI: '',
      selectedInsuranceCompany: '',
      documents: []
    });
  };

  const handleBeneficiaryApplication = async () => {
    if (!selectedScheme || !activeProducer) return;

    setIsSubmitting(true);

    try {
      // Get the full scheme data
      const schemeData = availableSchemes.find(s => s.id === selectedScheme)?.fullSchemeData;
      if (!schemeData) {
        alert('Scheme data not found. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Create application object
      const application: any = {
        beneficiaryId: activeProducer.id,
        beneficiaryName: activeProducer.formData.fullName || 'Producer/Farmer',
        beneficiaryType: 'Producer/Farmer' as const,
        produceType: beneficiaryApplicationData.produceType,
        selectedPFI: beneficiaryApplicationData.selectedPFI,
        selectedInsuranceCompany: beneficiaryApplicationData.selectedInsuranceCompany,
        documents: beneficiaryApplicationData.documents.map(doc => ({
          fileName: doc.fileName,
          description: doc.description
        })),
        submittedAt: new Date().toISOString(),
        status: 'pending' as const
      };

      // Update scheme in localStorage
      const storedSchemes = localStorage.getItem('fundSchemes');
      if (storedSchemes) {
        const schemes = JSON.parse(storedSchemes);
        const updatedSchemes = schemes.map((scheme: any) => {
          if (scheme.id === selectedScheme) {
            return {
              ...scheme,
              beneficiaryApplications: [
                ...(scheme.beneficiaryApplications || []),
                application
              ]
            };
          }
          return scheme;
        });
        localStorage.setItem('fundSchemes', JSON.stringify(updatedSchemes));

        // CRITICAL: Notify FundSchemes component that localStorage was updated
        window.dispatchEvent(new CustomEvent('fundSchemes-updated'));
      }

      // Send notification to CA
      addNotification({
        role: '🌾 Producer/Farmer',
        targetRole: 'coordinating-agency',
        message: `Producer/Farmer "${activeProducer.formData.fullName}" has applied for scheme "${schemeData.name}". Please review and approve.`,
        applicantName: activeProducer.formData.fullName || 'Producer/Farmer',
        applicantType: 'Individual',
        companyName: activeProducer.formData.farmBusinessName || 'Producer/Farmer',
        contactPersonName: activeProducer.formData.fullName,
        contactPersonEmail: activeProducer.formData.email,
        contactPersonPhone: activeProducer.formData.phone,
        companyEmail: activeProducer.formData.email,
        schemeId: selectedScheme,
        schemeName: schemeData.name,
        applicationId: `producer_app_${Date.now()}`,
        applicationData: {
          produceType: beneficiaryApplicationData.produceType,
          selectedPFI: beneficiaryApplicationData.selectedPFI,
          selectedInsuranceCompany: beneficiaryApplicationData.selectedInsuranceCompany,
          documents: beneficiaryApplicationData.documents.map(d => ({ fileName: d.fileName, description: d.description }))
        },
        applicationStatus: 'pending',
        metadata: {
          type: 'beneficiarySchemeApplication',
          beneficiaryId: activeProducer.id,
          beneficiaryType: 'Producer/Farmer',
          applicationId: application.beneficiaryId + '_' + Date.now()
        }
      });

      // Refresh schemes list
      const fetchSchemes = async () => {
        const stored = localStorage.getItem('fundSchemes');
        if (stored) {
          const parsed = JSON.parse(stored);
          const currentProducer = activeProducer;
          const relevant = parsed
            .filter((s: any) => {
              const isActive = s.status === 'Active';
              const isInitial = s.workflowStage === 'initial';
              const isOpenToBeneficiaries = s.openToBeneficiaries === true;
              const hasSelectedPFIs = s.selectedPFIIds && s.selectedPFIIds.length > 0;
              const notYetApplied = !s.beneficiaryApplications?.some((app: any) =>
                app.beneficiaryId === currentProducer.id &&
                app.beneficiaryType === 'Producer/Farmer' &&
                app.status !== 'rejected'
              );
              return isActive && isInitial && isOpenToBeneficiaries && hasSelectedPFIs && notYetApplied;
            })
            .map((s: any) => ({
              id: s.id,
              title: s.name || 'Untitled Scheme',
              description: s.description || `Fund scheme: ${s.name || 'Untitled'}`,
              amount: s.amount || 'N/A',
              deadline: s.applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              category: 'Fund Scheme',
              state: s.state || 'Multi-State',
              status: s.status || 'Active',
              workflowStage: s.workflowStage || 'stage2',
              fullSchemeData: s,
              selectedPFIs: s.pfiApplications?.filter((app: any) => s.selectedPFIIds?.includes(app.pfiId)) || [],
              approvedInsuranceCompany: s.insuranceCompanySubmissions?.find((sub: any) => sub.status === 'approved')
            }));
          setAvailableSchemes(relevant);
        }
      };
      fetchSchemes();

      setIsSubmitting(false);
      setShowConfirmation(true);
      setShowForm(false);
      setSelectedScheme(null);
    } catch (error) {
      console.error('Error submitting Producer/Farmer application:', error);
      alert('Failed to submit. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedScheme(null);
    setCurrentStep(1);
    // Reset modal states
    setShowFullSchemeDetails(false);
    setExpandedInsuranceCompany(null);
    setExpandedPFI(null);
  };

  if (!recordLoaded) {
    return (
      <PortalLayout role="Producer/Farmer" roleIcon="🌾" sidebarItems={sidebarItems}>
        <div className="card">
          <h1 className="text-lg font-semibold font-sans text-gray-100">Loading Schemes</h1>
          <p className="text-sm text-gray-300 font-serif mt-2">Preparing the list of available schemes...</p>
        </div>
      </PortalLayout>
    );
  }

  if (!isVerified) {
    return (
      <PortalLayout role="Producer/Farmer" roleIcon="🌾" sidebarItems={sidebarItems}>
        <div className="space-y-4">
          <div className="card">
            <h1 className="text-xl font-bold font-sans text-gray-100 mb-2">Access Restricted</h1>
            <p className="text-sm text-gray-300 font-serif">
              Scheme applications are available only after your Producer/Farmer registration is verified by the Coordinating Agency. Review and update your registration details from the Settings page, then await approval.
            </p>
            <Link
              to="/portal/producer/settings"
              className="inline-flex items-center mt-4 px-4 py-2 rounded-md bg-accent-500 hover:bg-accent-600 text-white font-medium"
            >
              Review Registration Details
            </Link>
          </div>
          {rejectionReason && (
            <div className="card">
              <h2 className="text-lg font-semibold font-sans text-gray-100 mb-2">Most Recent Feedback</h2>
              <p className="text-sm text-red-400 font-serif">{rejectionReason}</p>
            </div>
          )}
        </div>
      </PortalLayout>
    );
  }

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Contact Information</h3>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Name of Account *</label>
        <input
          type="text"
          name="nameOfAccount"
          value={formData.nameOfAccount}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Enter account name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Account Website *</label>
        <input
          type="url"
          name="accountWebsite"
          value={formData.accountWebsite}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="https://example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Contact Person's Name *</label>
        <input
          type="text"
          name="contactPersonName"
          value={formData.contactPersonName}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Enter contact person full name"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Email Address *</label>
          <input
            type="email"
            name="contactPersonEmail"
            value={formData.contactPersonEmail}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Phone Number *</label>
          <input
            type="tel"
            name="contactPersonPhone"
            value={formData.contactPersonPhone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
            placeholder="+234 XXX XXX XXXX"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Discuss about previous projects *</label>
        <textarea
          name="discussPreviousProjects"
          value={formData.discussPreviousProjects}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Describe your previous projects, experience, and achievements..."
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Account Profile</h3>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Profile Type *</label>
        <select
          name="profileType"
          value={formData.profileType}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
        >
          <option value="">Select Profile Type</option>
          {profileTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Enter Maximum Amount Expected *</label>
        <input
          type="text"
          name="maximumAmountExpected"
          value={formData.maximumAmountExpected}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="e.g., ₦500M"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Target Audience *</label>
        <select
          name="targetAudience"
          value={formData.targetAudience}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
        >
          <option value="">Select Target Audience</option>
          {targetAudienceOptions.map(audience => (
            <option key={audience} value={audience}>{audience}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Average Funding Market *</label>
        <select
          name="averageFundingMarket"
          value={formData.averageFundingMarket}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
        >
          <option value="">Select Funding Market</option>
          {fundingMarkets.map(market => (
            <option key={market} value={market}>{market}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Geographic Focus (Select States) *</label>
        <div className="max-h-48 overflow-y-auto border border-primary-600 rounded-md p-3 bg-primary-800">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {nigerianStates.map(state => (
              <label key={state} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.geographicFocus.includes(state)}
                  onChange={() => handleCheckboxChange('geographicFocus', state)}
                  className="w-4 h-4 accent-accent-500"
                />
                <span className="text-sm text-gray-300 font-serif">{state}</span>
              </label>
            ))}
          </div>
        </div>
        {formData.geographicFocus.length > 0 && (
          <p className="text-xs text-gray-400 mt-2 font-serif">
            Selected: {formData.geographicFocus.join(', ')}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Description of Services and Funding Programs Previous Benefit *</label>
        <textarea
          name="descriptionOfServices"
          value={formData.descriptionOfServices}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Describe your services, funding programs, and previous benefits..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Funding Programs Previous Benefit *</label>
        <textarea
          name="fundingProgramsPreviousBenefit"
          value={formData.fundingProgramsPreviousBenefit}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Describe previous benefits from funding programs..."
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Financial Products and Terms</h3>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">List of Financial Products Offered *</label>
        <select
          name="financialProductsOffered"
          multiple
          value={formData.financialProductsOffered}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, option => option.value);
            setFormData(prev => ({ ...prev, financialProductsOffered: selected }));
          }}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          size={3}
        >
          {financialProducts.map(product => (
            <option key={product} value={product}>{product}</option>
          ))}
        </select>
        <p className="text-xs text-gray-400 mt-1 font-serif">Hold Ctrl/Cmd to select multiple products</p>
        {formData.financialProductsOffered.length > 0 && (
          <p className="text-xs text-gray-400 mt-2 font-serif">
            Selected: {formData.financialProductsOffered.join(', ')}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Terms of Reference to AFCF *</label>
        <textarea
          name="termsOfReferenceAFCF"
          value={formData.termsOfReferenceAFCF}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Enter terms of reference to AFCF..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Terms of Reference to PFI *</label>
        <textarea
          name="termsOfReferencePFI"
          value={formData.termsOfReferencePFI}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Enter terms of reference to PFI..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Terms of Reference to Insurance Companies *</label>
        <textarea
          name="termsOfReferenceInsurance"
          value={formData.termsOfReferenceInsurance}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Enter terms of reference to Insurance Companies..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Terms of Reference to Beneficiaries *</label>
        <textarea
          name="termsOfReferenceBeneficiaries"
          value={formData.termsOfReferenceBeneficiaries}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Enter terms of reference to Beneficiaries..."
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Reporting and Transparency</h3>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Reporting Frequency *</label>
        <select
          name="reportingFrequency"
          value={formData.reportingFrequency}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
        >
          <option value="">Select Reporting Frequency</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="semi-annually">Semi-Annually</option>
          <option value="annually">Annually</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Reporting Mechanisms and Formats *</label>
        <textarea
          name="reportingMechanisms"
          value={formData.reportingMechanisms}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Describe how you will report on scheme progress, what metrics you will track, and the reporting formats you will use..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Transparency Measures *</label>
        <textarea
          name="transparencyMeasures"
          value={formData.transparencyMeasures}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Describe the transparency measures you will implement, including public disclosure of activities, financial transparency, and stakeholder engagement..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Monitoring and Evaluation Framework *</label>
        <textarea
          name="monitoringAndEvaluation"
          value={formData.monitoringAndEvaluation}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Describe your monitoring and evaluation framework, including key performance indicators (KPIs), assessment methods, and evaluation timelines..."
        />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Compliance and Documentation</h3>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Regulatory Compliance *</label>
        <textarea
          name="regulatoryCompliance"
          value={formData.regulatoryCompliance}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Describe your organization's regulatory compliance status, licenses held, adherence to financial regulations, and any regulatory requirements you meet..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Fund Scheme Documentation *</label>
        <input
          type="file"
          name="fundSchemeDocumentation"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent-500 file:text-white hover:file:bg-accent-600"
        />
        <p className="text-xs text-gray-400 mt-1 font-serif">Upload fund scheme documentation</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Contract Documentation *</label>
        <input
          type="file"
          name="contractDocumentation"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent-500 file:text-white hover:file:bg-accent-600"
        />
        <p className="text-xs text-gray-400 mt-1 font-serif">Upload contract documentation</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Exit Strategy *</label>
        <textarea
          name="exitStrategy"
          value={formData.exitStrategy}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Describe your exit strategy for the scheme..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Records History *</label>
        <textarea
          name="recordsHistory"
          value={formData.recordsHistory}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Provide records history and past performance..."
        />
      </div>
    </div>
  );

  return (
    <PortalLayout role="Producer/Farmer" roleIcon="🌾" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {!showForm && (
          <>
            {/* Available Schemes Section */}
            <div className="card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold font-sans text-gray-100 mb-2">Available Schemes</h1>
                  <p className="text-sm text-gray-400 font-serif">Select a scheme below to apply. Complete the multi-step application form to submit your application.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
                  >
                    <option value="All">All States</option>
                    {nigerianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                    <input
                      type="text"
                      value={schemeSearch}
                      onChange={(e) => setSchemeSearch(e.target.value)}
                      placeholder="Search schemes..."
                      className="w-full sm:w-64 px-4 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                      🔍
                    </button>
                  </div>
                </div>
              </div>

              {schemesLoading ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400 font-serif">Loading schemes...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedSchemes.map((scheme) => (
                    <div key={scheme.id} className="bg-primary-700 rounded-lg border border-primary-600 p-4 hover:border-accent-500 transition-colors flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-2">{scheme.title}</h3>
                          <p className="text-sm text-gray-300 font-serif mb-3">{scheme.description}</p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 font-serif">Amount:</span>
                          <span className="text-sm font-medium text-accent-400 font-sans">{scheme.amount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 font-serif">Category:</span>
                          <span className="text-sm text-gray-300 font-serif">{scheme.category}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 font-serif">Deadline:</span>
                          <span className="text-sm text-gray-300 font-serif">{new Date(scheme.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleApplyToScheme(scheme.id)}
                        className="w-full px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-md font-medium transition-colors mt-auto"
                      >
                        Apply Now
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {!schemesLoading && paginatedSchemes.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400 font-serif">No schemes found matching your search.</p>
                </div>
              )}

              {/* Pagination Controls */}
              {filteredSchemes.length > schemesPerPage && (
                <div className="flex items-center justify-center space-x-2 mt-6 pt-4 border-t border-primary-600">
                  <button
                    onClick={() => setSchemesPage(prev => Math.max(prev - 1, 1))}
                    disabled={schemesPage === 1}
                    className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ←
                  </button>
                  <span className="text-xs text-gray-400">{schemesPage} of {totalSchemesPages}</span>
                  <button
                    onClick={() => setSchemesPage(prev => Math.min(prev + 1, totalSchemesPages))}
                    disabled={schemesPage === totalSchemesPages}
                    className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Application Form Modal - Overlay */}
        {showForm && selectedScheme && (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={handleCloseForm}>
            <div className="min-h-screen flex items-center justify-center py-8">
              <div className="w-full max-w-4xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl sm:text-2xl font-bold font-sans text-gray-100">Scheme Application</h1>
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="text-gray-400 hover:text-gray-200 text-2xl font-bold"
                  >
                    ✖
                  </button>
                </div>

                <div className="max-h-[80vh] overflow-y-auto custom-scrollbar pr-2">
                  {(() => {
                    const scheme = availableSchemes.find(s => s.id === selectedScheme);

                    // If scheme not found, show error message
                    if (!scheme) {
                      return (
                        <div className="space-y-4">
                          <div className="p-4 bg-red-900/30 border border-red-600 rounded-md">
                            <p className="text-red-300 font-sans">Scheme not found. Please try again.</p>
                          </div>
                          <button
                            onClick={handleCloseForm}
                            className="px-6 py-2 rounded-md bg-primary-700 text-gray-300 border border-primary-600 hover:bg-primary-600 font-medium"
                          >
                            ← Back to Schemes
                          </button>
                        </div>
                      );
                    }

                    // For Stage 2 schemes, show beneficiary application form
                    const workflowStage = scheme?.workflowStage || scheme?.fullSchemeData?.workflowStage;
                    // Allow schemes in 'stage2' OR 'initial' if explicitly opened to beneficiaries
                    const isWorkflowScheme = workflowStage === 'stage2' ||
                      (workflowStage === 'initial' && (scheme?.openToBeneficiaries || scheme?.fullSchemeData?.openToBeneficiaries));

                    // If it's a Stage 2 scheme, show the beneficiary application form
                    if (isWorkflowScheme) {
                      const fullScheme = scheme?.fullSchemeData || scheme;
                      const approvedInsuranceCompanies = fullScheme?.insuranceCompanySubmissions?.filter((sub: any) => sub.status === 'approved') || [];
                      const approvedPFIs = (fullScheme?.pfiApplications || []).filter((app: any) =>
                        fullScheme?.selectedPFIIds?.includes(app.pfiId) && app.status === 'approved'
                      ) || [];

                      // Ensure we have scheme data
                      if (!fullScheme) {
                        return (
                          <div className="space-y-4">
                            <div className="p-4 bg-red-900/30 border border-red-600 rounded-md">
                              <p className="text-red-300 font-sans">Unable to load scheme details. Please try again.</p>
                            </div>
                            <button
                              onClick={handleCloseForm}
                              className="px-6 py-2 rounded-md bg-primary-700 text-gray-300 border border-primary-600 hover:bg-primary-600 font-medium"
                            >
                              ← Back to Schemes
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-6">
                          {/* Full Scheme Details - Same structure as Anchor/LeadFirm */}
                          <div className="mb-6 p-4 bg-primary-800 rounded-lg border border-primary-600">
                            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Scheme Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-gray-400 font-serif mb-1">Scheme Name</p>
                                <p className="text-sm font-medium text-gray-100 font-sans">{fullScheme?.name || scheme?.title}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 font-serif mb-1">Fund Amount</p>
                                <p className="text-sm font-medium text-accent-400 font-sans">{fullScheme?.amount || scheme?.amount}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 font-serif mb-1">State</p>
                                <p className="text-sm text-gray-100 font-sans">{fullScheme?.state || scheme?.state}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 font-serif mb-1">Status</p>
                                <p className="text-sm text-gray-100 font-sans">{fullScheme?.status || 'Active'}</p>
                              </div>
                              {fullScheme?.description && (
                                <div className="md:col-span-2">
                                  <p className="text-xs text-gray-400 font-serif mb-1">Description</p>
                                  <p className="text-sm text-gray-100 font-sans">{fullScheme.description}</p>
                                </div>
                              )}
                            </div>

                            {/* View Full Scheme Application Details Dropdown */}
                            <div className="mt-4 pt-4 border-t border-primary-600">
                              <button
                                type="button"
                                onClick={() => setShowFullSchemeDetails(!showFullSchemeDetails)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-primary-700 hover:bg-primary-600 rounded-md transition-colors"
                              >
                                <span className="text-sm font-semibold text-accent-400 font-sans">
                                  {showFullSchemeDetails ? '▼' : '▶'} View Full Scheme Application Details
                                </span>
                                <span className="text-xs text-gray-400 font-serif">
                                  {showFullSchemeDetails ? 'Hide details' : 'Show full details'}
                                </span>
                              </button>

                              {showFullSchemeDetails && fullScheme?.metadata && (
                                <div className="mt-3 p-4 bg-primary-700 rounded-md space-y-4">
                                  {/* Include all metadata sections - same as Anchor/LeadFirm */}
                                  {fullScheme.metadata.schemeDetails && (
                                    <div>
                                      <h5 className="text-sm font-semibold text-accent-400 font-sans mb-2">Scheme Details</h5>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                        <div>
                                          <p className="text-gray-400 font-serif">Scheme ID</p>
                                          <p className="text-gray-200 font-sans">{fullScheme.metadata.schemeDetails.schemeId}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-400 font-serif">Start Date</p>
                                          <p className="text-gray-200 font-sans">{new Date(fullScheme.metadata.schemeDetails.startDate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-400 font-serif">Application Deadline</p>
                                          <p className="text-gray-200 font-sans">{new Date(fullScheme.metadata.schemeDetails.applicationDeadline).toLocaleDateString()}</p>
                                        </div>
                                        {fullScheme.metadata.schemeDetails.enterprises && fullScheme.metadata.schemeDetails.enterprises.length > 0 && (
                                          <div className="md:col-span-2">
                                            <p className="text-gray-400 font-serif">Enterprises</p>
                                            <p className="text-gray-200 font-sans">{fullScheme.metadata.schemeDetails.enterprises.join(', ')}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {fullScheme.metadata.stateAllocation && (
                                    <div>
                                      <h5 className="text-sm font-semibold text-accent-400 font-sans mb-2">Location Allocation</h5>
                                      <div className="space-y-2 text-xs">
                                        <div>
                                          <p className="text-gray-400 font-serif">Location Type</p>
                                          <p className="text-gray-200 font-sans capitalize">{fullScheme.metadata.stateAllocation.locationType}</p>
                                        </div>
                                        {fullScheme.metadata.stateAllocation.selectedStates && fullScheme.metadata.stateAllocation.selectedStates.length > 0 && (
                                          <div>
                                            <p className="text-gray-400 font-serif">Selected States</p>
                                            <p className="text-gray-200 font-sans">{fullScheme.metadata.stateAllocation.selectedStates.join(', ')}</p>
                                          </div>
                                        )}
                                        <div>
                                          <p className="text-gray-400 font-serif">Allocation Type</p>
                                          <p className="text-gray-200 font-sans capitalize">{fullScheme.metadata.stateAllocation.allocationType}</p>
                                        </div>
                                        {fullScheme.metadata.stateAllocation.amountPerLocation && (
                                          <div>
                                            <p className="text-gray-400 font-serif">Amount Per Location</p>
                                            <p className="text-gray-200 font-sans">₦{parseFloat(fullScheme.metadata.stateAllocation.amountPerLocation).toLocaleString()}</p>
                                          </div>
                                        )}
                                        {fullScheme.metadata.stateAllocation.beneficiariesPerLocation && (
                                          <div>
                                            <p className="text-gray-400 font-serif">Beneficiaries Per Location</p>
                                            <p className="text-gray-200 font-sans">{fullScheme.metadata.stateAllocation.beneficiariesPerLocation}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {fullScheme.metadata.fundAllocation && (
                                    <div>
                                      <h5 className="text-sm font-semibold text-accent-400 font-sans mb-2">Fund Allocation</h5>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                        <div>
                                          <p className="text-gray-400 font-serif">Loan Amount</p>
                                          <p className="text-gray-200 font-sans">₦{parseFloat(fullScheme.metadata.fundAllocation.loanAmount || '0').toLocaleString()}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-400 font-serif">Loan Tenure</p>
                                          <p className="text-gray-200 font-sans">{fullScheme.metadata.fundAllocation.loanTenureValue} {fullScheme.metadata.fundAllocation.loanTenureUnit}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-400 font-serif">Deferment Period</p>
                                          <p className="text-gray-200 font-sans">{fullScheme.metadata.fundAllocation.defermentValue} {fullScheme.metadata.fundAllocation.defermentUnit}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-400 font-serif">Collateral Required</p>
                                          <p className="text-gray-200 font-sans">{fullScheme.metadata.fundAllocation.collateralRequired}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-400 font-serif">De-Risking Percentage</p>
                                          <p className="text-gray-200 font-sans">{fullScheme.metadata.fundAllocation.deRiskingPercentage}%</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-400 font-serif">PFI Interest Rate</p>
                                          <p className="text-gray-200 font-sans">{fullScheme.metadata.fundAllocation.pfiInterestRate}%</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-400 font-serif">Insurance Percentage</p>
                                          <p className="text-gray-200 font-sans">{fullScheme.metadata.fundAllocation.insurancePercentage}%</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {fullScheme.metadata.beneficiaries && (
                                    <div>
                                      <h5 className="text-sm font-semibold text-accent-400 font-sans mb-2">Beneficiaries</h5>
                                      <div className="space-y-2 text-xs">
                                        {fullScheme.metadata.beneficiaries.types && fullScheme.metadata.beneficiaries.types.length > 0 && (
                                          <div>
                                            <p className="text-gray-400 font-serif">Beneficiary Types</p>
                                            <p className="text-gray-200 font-sans">{fullScheme.metadata.beneficiaries.types.join(', ')}</p>
                                          </div>
                                        )}
                                        {fullScheme.metadata.beneficiaries.eligibilityNotes && (
                                          <div>
                                            <p className="text-gray-400 font-serif">Eligibility Notes</p>
                                            <p className="text-gray-200 font-sans">{fullScheme.metadata.beneficiaries.eligibilityNotes}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {fullScheme.metadata.documents && fullScheme.metadata.documents.items && fullScheme.metadata.documents.items.length > 0 && (
                                    <div>
                                      <h5 className="text-sm font-semibold text-accent-400 font-sans mb-2">Required Documents</h5>
                                      <ul className="space-y-1 text-xs">
                                        {fullScheme.metadata.documents.items.map((doc: any, idx: number) => (
                                          <li key={idx} className="text-gray-200 font-sans">
                                            • {doc.fileName} {doc.description && `- ${doc.description}`}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {fullScheme.metadata.insuranceCompanyRequirements?.requirements && (
                                    <div>
                                      <h5 className="text-sm font-semibold text-accent-400 font-sans mb-2">Insurance Company Requirements</h5>
                                      <p className="text-xs text-gray-200 font-sans whitespace-pre-wrap">{fullScheme.metadata.insuranceCompanyRequirements.requirements}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Approved Insurance Companies */}
                            {approvedInsuranceCompanies.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-primary-600">
                                <h4 className="text-sm font-semibold font-sans text-accent-400 mb-3">Approved Insurance Companies</h4>
                                <div className="space-y-2">
                                  {approvedInsuranceCompanies.map((ic: any, idx: number) => {
                                    const icRecord = ic.insuranceCompanyId ? findInsuranceCompanyById(ic.insuranceCompanyId) : null;
                                    const isExpanded = expandedInsuranceCompany === ic.insuranceCompanyId;

                                    return (
                                      <div key={idx} className="p-3 bg-primary-700 rounded-md">
                                        <p className="text-sm font-medium text-gray-100 font-sans">{ic.insuranceCompanyName || 'Insurance Company'}</p>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                          <div>
                                            <p className="text-xs text-gray-400 font-serif">Premium Rate</p>
                                            <p className="text-sm text-gray-200 font-sans">{ic.premiumRate}%</p>
                                          </div>
                                          {ic.insurancePolicies && (
                                            <div>
                                              <p className="text-xs text-gray-400 font-serif">Policies</p>
                                              <p className="text-sm text-gray-200 font-sans line-clamp-2">{ic.insurancePolicies}</p>
                                            </div>
                                          )}
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-primary-600">
                                          <button
                                            type="button"
                                            onClick={() => setExpandedInsuranceCompany(isExpanded ? null : ic.insuranceCompanyId)}
                                            className="w-full flex items-center justify-between px-3 py-2 bg-primary-800 hover:bg-primary-600 rounded-md transition-colors"
                                          >
                                            <span className="text-xs font-semibold text-accent-400 font-sans">
                                              {isExpanded ? '▼' : '▶'} View More About This Insurance Company
                                            </span>
                                            <span className="text-xs text-gray-400 font-serif">
                                              {isExpanded ? 'Hide details' : 'Show full details'}
                                            </span>
                                          </button>

                                          {isExpanded && (
                                            <div className="mt-3 p-3 bg-primary-800 rounded-md space-y-3">
                                              <div>
                                                <h6 className="text-xs font-semibold text-accent-400 font-sans mb-2">Scheme Submission Details</h6>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                                  <div>
                                                    <p className="text-gray-400 font-serif">Premium Rate</p>
                                                    <p className="text-gray-200 font-sans">{ic.premiumRate}%</p>
                                                  </div>
                                                  {ic.insurancePolicies && (
                                                    <div className="md:col-span-2">
                                                      <p className="text-gray-400 font-serif">Insurance Policies</p>
                                                      <p className="text-gray-200 font-sans whitespace-pre-wrap">{ic.insurancePolicies}</p>
                                                    </div>
                                                  )}
                                                  {ic.submittedAt && (
                                                    <div>
                                                      <p className="text-gray-400 font-serif">Submitted At</p>
                                                      <p className="text-gray-200 font-sans">{new Date(ic.submittedAt).toLocaleString()}</p>
                                                    </div>
                                                  )}
                                                  {ic.reviewedAt && (
                                                    <div>
                                                      <p className="text-gray-400 font-serif">Reviewed At</p>
                                                      <p className="text-gray-200 font-sans">{new Date(ic.reviewedAt).toLocaleString()}</p>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>

                                              {icRecord && (
                                                <div>
                                                  <h6 className="text-xs font-semibold text-accent-400 font-sans mb-2">Company Registration Details</h6>
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                                    <div>
                                                      <p className="text-gray-400 font-serif">Registration Number</p>
                                                      <p className="text-gray-200 font-sans">{icRecord.formData?.registrationNumber || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                      <p className="text-gray-400 font-serif">Organization Type</p>
                                                      <p className="text-gray-200 font-sans">{icRecord.formData?.organizationType || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                      <p className="text-gray-400 font-serif">Year Established</p>
                                                      <p className="text-gray-200 font-sans">{icRecord.formData?.yearEstablished || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                      <p className="text-gray-400 font-serif">Industry</p>
                                                      <p className="text-gray-200 font-sans">{icRecord.formData?.industry || 'N/A'}</p>
                                                    </div>
                                                    {icRecord.formData?.headquartersAddress && (
                                                      <div className="md:col-span-2">
                                                        <p className="text-gray-400 font-serif">Headquarters Address</p>
                                                        <p className="text-gray-200 font-sans">{icRecord.formData.headquartersAddress}, {icRecord.formData.hqCity}, {icRecord.formData.hqState}, {icRecord.formData.hqCountry}</p>
                                                      </div>
                                                    )}
                                                    {icRecord.formData?.officePhone && (
                                                      <div>
                                                        <p className="text-gray-400 font-serif">Office Phone</p>
                                                        <p className="text-gray-200 font-sans">{icRecord.formData.officePhone}</p>
                                                      </div>
                                                    )}
                                                    {icRecord.formData?.officialEmail && (
                                                      <div>
                                                        <p className="text-gray-400 font-serif">Official Email</p>
                                                        <p className="text-gray-200 font-sans">{icRecord.formData.officialEmail}</p>
                                                      </div>
                                                    )}
                                                    {icRecord.formData?.website && (
                                                      <div className="md:col-span-2">
                                                        <p className="text-gray-400 font-serif">Website</p>
                                                        <p className="text-gray-200 font-sans">{icRecord.formData.website}</p>
                                                      </div>
                                                    )}
                                                    {icRecord.formData?.missionStatement && (
                                                      <div className="md:col-span-2">
                                                        <p className="text-gray-400 font-serif">Mission Statement</p>
                                                        <p className="text-gray-200 font-sans">{icRecord.formData.missionStatement}</p>
                                                      </div>
                                                    )}
                                                    {icRecord.formData?.areasOfOperation && icRecord.formData.areasOfOperation.length > 0 && (
                                                      <div className="md:col-span-2">
                                                        <p className="text-gray-400 font-serif">Areas of Operation</p>
                                                        <p className="text-gray-200 font-sans">{icRecord.formData.areasOfOperation.join(', ')}</p>
                                                      </div>
                                                    )}
                                                    {icRecord.formData?.numEmployees && (
                                                      <div>
                                                        <p className="text-gray-400 font-serif">Number of Employees</p>
                                                        <p className="text-gray-200 font-sans">{icRecord.formData.numEmployees}</p>
                                                      </div>
                                                    )}
                                                    <div>
                                                      <p className="text-gray-400 font-serif">Status</p>
                                                      <p className={`text-gray-200 font-sans ${icRecord.status === 'verified' ? 'text-green-400' : 'text-yellow-400'}`}>
                                                        {icRecord.status === 'verified' ? 'Verified' : 'Unverified'}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              )}

                                              {!icRecord && (
                                                <div className="text-xs text-gray-400 font-serif italic">
                                                  Registration details not available
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Approved PFIs */}
                            {approvedPFIs.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-primary-600">
                                <h4 className="text-sm font-semibold font-sans text-accent-400 mb-3">Approved PFIs</h4>
                                <div className="space-y-2">
                                  {approvedPFIs.map((pfiApp: any, idx: number) => {
                                    const pfiRecord = pfiApp.pfiId ? findPFIById(pfiApp.pfiId) : null;
                                    const isExpanded = expandedPFI === pfiApp.pfiId;

                                    return (
                                      <div key={idx} className="p-3 bg-primary-700 rounded-md">
                                        <p className="text-sm font-medium text-gray-100 font-sans">{pfiRecord?.formData?.organizationName || 'PFI'}</p>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                          <div>
                                            <p className="text-xs text-gray-400 font-serif">Proposed Interest Rate</p>
                                            <p className="text-sm text-gray-200 font-sans">{pfiApp.proposedInterestRate}%</p>
                                          </div>
                                          {pfiApp.policies && (
                                            <div>
                                              <p className="text-xs text-gray-400 font-serif">Policies</p>
                                              <p className="text-sm text-gray-200 font-sans line-clamp-2">{pfiApp.policies}</p>
                                            </div>
                                          )}
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-primary-600">
                                          <button
                                            type="button"
                                            onClick={() => setExpandedPFI(isExpanded ? null : pfiApp.pfiId)}
                                            className="w-full flex items-center justify-between px-3 py-2 bg-primary-800 hover:bg-primary-600 rounded-md transition-colors"
                                          >
                                            <span className="text-xs font-semibold text-accent-400 font-sans">
                                              {isExpanded ? '▼' : '▶'} View More About This PFI
                                            </span>
                                            <span className="text-xs text-gray-400 font-serif">
                                              {isExpanded ? 'Hide details' : 'Show full details'}
                                            </span>
                                          </button>

                                          {isExpanded && (
                                            <div className="mt-3 p-3 bg-primary-800 rounded-md space-y-3">
                                              <div>
                                                <h6 className="text-xs font-semibold text-accent-400 font-sans mb-2">Scheme Application Details</h6>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                                  <div>
                                                    <p className="text-gray-400 font-serif">Proposed Interest Rate</p>
                                                    <p className="text-gray-200 font-sans">{pfiApp.proposedInterestRate}%</p>
                                                  </div>
                                                  {pfiApp.policies && (
                                                    <div className="md:col-span-2">
                                                      <p className="text-gray-400 font-serif">Policies</p>
                                                      <p className="text-gray-200 font-sans whitespace-pre-wrap">{pfiApp.policies}</p>
                                                    </div>
                                                  )}
                                                  {pfiApp.submittedAt && (
                                                    <div>
                                                      <p className="text-gray-400 font-serif">Submitted At</p>
                                                      <p className="text-gray-200 font-sans">{new Date(pfiApp.submittedAt).toLocaleString()}</p>
                                                    </div>
                                                  )}
                                                  {pfiApp.reviewedAt && (
                                                    <div>
                                                      <p className="text-gray-400 font-serif">Reviewed At</p>
                                                      <p className="text-gray-200 font-sans">{new Date(pfiApp.reviewedAt).toLocaleString()}</p>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>

                                              {pfiRecord && (
                                                <div>
                                                  <h6 className="text-xs font-semibold text-accent-400 font-sans mb-2">PFI Registration Details</h6>
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                                    <div>
                                                      <p className="text-gray-400 font-serif">Organization Name</p>
                                                      <p className="text-gray-200 font-sans">{pfiRecord.formData?.organizationName || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                      <p className="text-gray-400 font-serif">Registration Number</p>
                                                      <p className="text-gray-200 font-sans">{pfiRecord.formData?.registrationNumber || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                      <p className="text-gray-400 font-serif">Organization Type</p>
                                                      <p className="text-gray-200 font-sans">{pfiRecord.formData?.organizationType || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                      <p className="text-gray-400 font-serif">Year Established</p>
                                                      <p className="text-gray-200 font-sans">{pfiRecord.formData?.yearEstablished || 'N/A'}</p>
                                                    </div>
                                                    {pfiRecord.formData?.headquartersAddress && (
                                                      <div className="md:col-span-2">
                                                        <p className="text-gray-400 font-serif">Headquarters Address</p>
                                                        <p className="text-gray-200 font-sans">{pfiRecord.formData.headquartersAddress}, {pfiRecord.formData.hqCity}, {pfiRecord.formData.hqState}, {pfiRecord.formData.hqCountry}</p>
                                                      </div>
                                                    )}
                                                    {pfiRecord.formData?.officePhone && (
                                                      <div>
                                                        <p className="text-gray-400 font-serif">Office Phone</p>
                                                        <p className="text-gray-200 font-sans">{pfiRecord.formData.officePhone}</p>
                                                      </div>
                                                    )}
                                                    {pfiRecord.formData?.officialEmail && (
                                                      <div>
                                                        <p className="text-gray-400 font-serif">Official Email</p>
                                                        <p className="text-gray-200 font-sans">{pfiRecord.formData.officialEmail}</p>
                                                      </div>
                                                    )}
                                                    {pfiRecord.formData?.website && (
                                                      <div className="md:col-span-2">
                                                        <p className="text-gray-400 font-serif">Website</p>
                                                        <p className="text-gray-200 font-sans">{pfiRecord.formData.website}</p>
                                                      </div>
                                                    )}
                                                    {pfiRecord.formData?.missionStatement && (
                                                      <div className="md:col-span-2">
                                                        <p className="text-gray-400 font-serif">Mission Statement</p>
                                                        <p className="text-gray-200 font-sans">{pfiRecord.formData.missionStatement}</p>
                                                      </div>
                                                    )}
                                                    {pfiRecord.formData?.areasOfOperation && pfiRecord.formData.areasOfOperation.length > 0 && (
                                                      <div className="md:col-span-2">
                                                        <p className="text-gray-400 font-serif">Areas of Operation</p>
                                                        <p className="text-gray-200 font-sans">{pfiRecord.formData.areasOfOperation.join(', ')}</p>
                                                      </div>
                                                    )}
                                                    {pfiRecord.formData?.numEmployees && (
                                                      <div>
                                                        <p className="text-gray-400 font-serif">Number of Employees</p>
                                                        <p className="text-gray-200 font-sans">{pfiRecord.formData.numEmployees}</p>
                                                      </div>
                                                    )}
                                                    <div>
                                                      <p className="text-gray-400 font-serif">Status</p>
                                                      <p className={`text-gray-200 font-sans ${pfiRecord.status === 'verified' ? 'text-green-400' : 'text-yellow-400'}`}>
                                                        {pfiRecord.status === 'verified' ? 'Verified' : 'Unverified'}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              )}

                                              {!pfiRecord && (
                                                <div className="text-xs text-gray-400 font-serif italic">
                                                  Registration details not available
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Producer/Farmer Application Form */}
                          <div className="space-y-4">
                            {/* Produce Type Selection */}
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                                Produce Type <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={beneficiaryApplicationData.produceType}
                                onChange={(e) => setBeneficiaryApplicationData(prev => ({ ...prev, produceType: e.target.value }))}
                                className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                                required
                              >
                                <option value="">Select produce type</option>
                                <option value="Crops">Crops</option>
                                <option value="Livestock">Livestock</option>
                                <option value="Poultry">Poultry</option>
                                <option value="Fisheries">Fisheries</option>
                                <option value="Mixed">Mixed</option>
                                <option value="Other">Other</option>
                              </select>
                              <p className="text-xs text-gray-400 mt-1 font-serif">Select the type of produce you specialize in.</p>
                            </div>

                            {/* PFI Selection */}
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                                Select PFI <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={beneficiaryApplicationData.selectedPFI}
                                onChange={(e) => setBeneficiaryApplicationData(prev => ({ ...prev, selectedPFI: e.target.value }))}
                                className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                                required
                              >
                                <option value="">Select a PFI</option>
                                {approvedPFIs.map((pfi: any) => (
                                  <option key={pfi.pfiId} value={pfi.pfiId}>
                                    {pfi.pfiName || 'PFI'} - Interest Rate: {pfi.interestRate}%
                                  </option>
                                ))}
                              </select>
                              <p className="text-xs text-gray-400 mt-1 font-serif">
                                Select the Participating Financial Institution you wish to work with.
                              </p>
                            </div>

                            {/* Insurance Company Selection */}
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                                Select Insurance Company <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={beneficiaryApplicationData.selectedInsuranceCompany}
                                onChange={(e) => setBeneficiaryApplicationData(prev => ({ ...prev, selectedInsuranceCompany: e.target.value }))}
                                className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                                required
                              >
                                <option value="">Select an Insurance Company</option>
                                {approvedInsuranceCompanies.map((ic: any) => (
                                  <option key={ic.insuranceCompanyId} value={ic.insuranceCompanyId}>
                                    {ic.insuranceCompanyName || 'Insurance Company'} - Premium Rate: {ic.premiumRate}%
                                  </option>
                                ))}
                              </select>
                              <p className="text-xs text-gray-400 mt-1 font-serif">
                                Select the Insurance Company to provide coverage for your scheme participation.
                              </p>
                            </div>

                            {/* Supporting Documents */}
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                                Supporting Documents (Optional)
                              </label>
                              <div className="space-y-3">
                                {beneficiaryApplicationData.documents.map((doc, index) => (
                                  <div key={index} className="flex gap-2 items-start">
                                    <input
                                      type="file"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        const updated = [...beneficiaryApplicationData.documents];
                                        updated[index] = {
                                          ...updated[index],
                                          fileName: file?.name || '',
                                          file: file
                                        };
                                        setBeneficiaryApplicationData(prev => ({ ...prev, documents: updated }));
                                      }}
                                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                      className="flex-1 px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent-500 file:text-white hover:file:bg-accent-600"
                                    />
                                    <input
                                      type="text"
                                      value={doc.description}
                                      onChange={(e) => {
                                        const updated = [...beneficiaryApplicationData.documents];
                                        updated[index].description = e.target.value;
                                        setBeneficiaryApplicationData(prev => ({ ...prev, documents: updated }));
                                      }}
                                      placeholder="Description"
                                      className="flex-1 px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = beneficiaryApplicationData.documents.filter((_, i) => i !== index);
                                        setBeneficiaryApplicationData(prev => ({ ...prev, documents: updated }));
                                      }}
                                      className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
                                    >
                                      ✖
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => setBeneficiaryApplicationData(prev => ({
                                    ...prev,
                                    documents: [...prev.documents, { fileName: '', description: '', file: null }]
                                  }))}
                                  className="px-4 py-2 rounded-md bg-primary-600 hover:bg-primary-500 text-gray-200 text-sm"
                                >
                                  + Add Document
                                </button>
                              </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t border-primary-600">
                              <button
                                onClick={handleCloseForm}
                                className="px-6 py-2 rounded-md bg-primary-700 text-gray-300 border border-primary-600 hover:bg-primary-600 font-medium"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleBeneficiaryApplication}
                                disabled={isSubmitting || !beneficiaryApplicationData.produceType.trim() || !beneficiaryApplicationData.selectedPFI || !beneficiaryApplicationData.selectedInsuranceCompany}
                                className="px-6 py-2 rounded-md bg-accent-500 hover:bg-accent-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // For non-workflow schemes, show message
                    return (
                      <div className="space-y-4">
                        <div className="p-4 bg-yellow-900/30 border border-yellow-600 rounded-md">
                          <p className="text-yellow-300 font-sans">This scheme is not part of the workflow system. Please use the standard application form.</p>
                        </div>
                        <button
                          onClick={handleCloseForm}
                          className="px-6 py-2 rounded-md bg-primary-700 text-gray-300 border border-primary-600 hover:bg-primary-600 font-medium"
                        >
                          ← Back to Schemes
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Powered by */}
        <div className="mt-6 text-center text-xs text-gray-400 font-serif opacity-80">
          Powered by Mc. George
        </div>
      </div>

      {/* Final Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-primary-800 rounded-lg p-6 max-w-md w-full border border-primary-600">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-2">Application Submitted Successfully!</h3>
              <p className="text-sm text-gray-300 font-serif">
                Your scheme application has been submitted and is under review. You will receive a notification once a decision has been made.
              </p>
            </div>
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setShowForm(false);
                  setSelectedScheme(null);
                  setCurrentStep(1);
                  // Reset form if needed
                }}
                className="px-6 py-2 rounded-md bg-accent-500 text-white hover:bg-accent-600 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};

export default SchemeApplication;

