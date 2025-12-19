import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../../components/PortalLayout';
import { schemeAPI } from '../../../utils/api';
import { useNotifications } from '../../../context/NotificationContext';
import { getPFIStatusSnapshot, PFIStatus, getActivePFIRecord, findInsuranceCompanyById, getInsuranceCompanies } from '../../../utils/localDatabase';

const SchemeApplication: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showFullSchemeDetails, setShowFullSchemeDetails] = useState(false);
  const [expandedInsuranceCompany, setExpandedInsuranceCompany] = useState<string | null>(null);
  const [schemesPage, setSchemesPage] = useState(1);
  const [schemeSearch, setSchemeSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const schemesPerPage = 3;

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/pfi' },
    { id: 'scheme-application', name: 'Schemes Application', icon: '📝', href: '/portal/pfi/scheme-application' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/pfi/settings' }
  ];

  const [status, setStatus] = useState<PFIStatus>('unverified');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [recordLoaded, setRecordLoaded] = useState(false);

  useEffect(() => {
    const snapshot = getPFIStatusSnapshot();
    if (snapshot) {
      setStatus(snapshot.status);
      setRejectionReason(snapshot.rejectionReason);
    }
    setRecordLoaded(true);
  }, []);

  const isVerified = status === 'verified';

  const { addNotification } = useNotifications();
  const activePFI = useMemo(() => getActivePFIRecord(), []);

  const [formData, setFormData] = useState({
    // Step 1: Contact Information
    bankName: '',
    contactPersonName: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
    bankWebsite: '',
    discussPreviousProjects: '',

    // Step 2: Account Profile
    bankType: '',
    maxDisbursementAmount: '',
    targetAudience: '',
    geographicFocus: [] as string[],
    descriptionOfServices: '',

    // Step 3: Financial Products and Terms
    financialProductsOffered: [] as string[],
    termsOfReferenceAFCF: '',
    termsOfReferenceFundProvider: '',
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

  const bankTypes = [
    'Commercial Bank',
    'Microfinance Bank',
    'Development Bank',
    'Merchant Bank',
    'Non-Interest Bank',
    'Other'
  ];

  const targetAudienceOptions = [
    'Anchors/Lead Firms',
    'Cooperative Groups',
    'Producers/Farmers'
  ];

  const financialProducts = [
    'Loans',
    'Grant',
    'Equity Investment'
  ];

  // Available Schemes Data
  const [availableSchemes, setAvailableSchemes] = useState<any[]>([]);
  const [schemesLoading, setSchemesLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger to force refresh

  // PFI Application Form Data (for workflow)
  const [pfiApplicationData, setPfiApplicationData] = useState({
    proposedInterestRate: '',
    policies: '',
    documents: [] as Array<{ fileName: string; description: string; file: File | null }>
  });

  // Fetch schemes from API or localStorage
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setSchemesLoading(true);

        // Get current PFI ID
        const currentPFI = activePFI;
        if (!currentPFI) {
          setAvailableSchemes([]);
          setSchemesLoading(false);
          return;
        }

        // First, check if there's localStorage data (from Coordinating Agency portal)
        const storedSchemes = localStorage.getItem('fundSchemes');
        if (storedSchemes) {
          try {
            const parsedSchemes = JSON.parse(storedSchemes);
            // Filter schemes: only show Active schemes where this PFI is selected
            // In consolidated Stage 0 workflow, PFIs are selected during scheme creation (Step 7)
            // Hide if PFI has pending or approved application, but show if rejected (allows reapplication)
            const relevantSchemes = parsedSchemes
              .filter((scheme: any) => {
                const isActive = scheme.status === 'Active';
                // Check if this PFI is selected for the scheme
                const isSelected = scheme.selectedPFIIds?.includes(currentPFI.id);

                // DEBUG: Log selection status for schemes that have selected PFIs
                if (scheme.selectedPFIIds && scheme.selectedPFIIds.length > 0) {
                  console.log(`[PFI Filter] Scheme: "${scheme.name}" (${scheme.id})`);
                  console.log(`[PFI Filter] - Selected PFI IDs:`, scheme.selectedPFIIds);
                  console.log(`[PFI Filter] - Current PFI ID:`, currentPFI.id);
                  console.log(`[PFI Filter] - Is Selected:`, isSelected);
                  console.log(`[PFI Filter] - Workflow Stage:`, scheme.workflowStage);
                }

                const isInitialStage = scheme.workflowStage === 'initial' || !scheme.workflowStage;

                // Check applications for this PFI
                const applications = scheme.pfiApplications?.filter((app: any) =>
                  app.pfiId === currentPFI.id
                ) || [];

                // Hide if there's an approved application (PFI already linked)
                const hasApprovedApplication = applications.some((app: any) => app.status === 'approved');

                // Hide if there's a pending application (waiting for CA review)
                const hasPendingApplication = applications.some((app: any) => app.status === 'pending');

                // DEBUG: Log filtering decisions for schemes with applications
                if (applications.length > 0) {
                  console.log(`[PFI Scheme Filter] "${scheme.name}":`, {
                    isActive,
                    isSelected,
                    isInitialStage,
                    applications: applications.map((app: any) => ({
                      status: app.status,
                      submittedAt: app.submittedAt
                    })),
                    hasApprovedApplication,
                    hasPendingApplication,
                    willShow: isActive && isSelected && isInitialStage && !hasApprovedApplication && !hasPendingApplication
                  });
                }

                // Show if selected, active, in initial stage, and no approved or pending applications
                return isActive && isSelected && isInitialStage && !hasApprovedApplication && !hasPendingApplication;
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
                workflowStage: scheme.workflowStage || 'initial',
                fullSchemeData: scheme, // Store full scheme data for application - CRITICAL for modal display
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
          // Filter out any schemes with status 'Completed' or 'Inactive'
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
          // Do not display schemes if response is not successful
          setAvailableSchemes([]);
        }
      } catch (err: any) {
        console.error('Error fetching schemes:', err);
        // Do not display schemes on error
        setAvailableSchemes([]);
      } finally {
        setSchemesLoading(false);
      }
    };

    fetchSchemes();

    // Listen for localStorage changes (from other windows/tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fundSchemes') {
        console.log('[PFI Scheme Refresh] storage event received, triggering refresh...');
        setRefreshTrigger(prev => prev + 1);
      }
    };

    // Listen for custom event (for same-window updates, e.g., when CA rejects application)
    const handleSchemesUpdate = () => {
      console.log('[PFI Scheme Refresh] fundSchemes-updated event received, triggering refresh...');
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('fundSchemes-updated' as any, handleSchemesUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('fundSchemes-updated' as any, handleSchemesUpdate);
    };
  }, [activePFI, refreshTrigger]); // Add refreshTrigger to dependencies

  // Define handleApplyToScheme before useEffect hooks that use it
  const handleApplyToScheme = useCallback((schemeId: string) => {
    // First, try to find scheme in availableSchemes
    let scheme = availableSchemes.find(s => s.id === schemeId);

    // If not found, try to fetch from localStorage directly
    if (!scheme) {
      try {
        const storedSchemes = localStorage.getItem('fundSchemes');
        if (storedSchemes) {
          const parsedSchemes = JSON.parse(storedSchemes);
          const foundScheme = parsedSchemes.find((s: any) => s.id === schemeId);

          if (foundScheme) {
            // Check if scheme is eligible (Stage 0 initial workflow)
            // In the new workflow, PFIs are selected during scheme creation (Step 7)
            const isActive = foundScheme.status === 'Active';
            const isInitialStage = foundScheme.workflowStage === 'initial' || !foundScheme.workflowStage;
            const currentPFI = activePFI;
            const isPFISelected = currentPFI ? (foundScheme.selectedPFIIds?.includes(currentPFI.id) || false) : false;

            if (isActive && isInitialStage && isPFISelected) {
              // Check if PFI has already applied
              if (currentPFI) {
                const applications = foundScheme.pfiApplications?.filter((app: any) =>
                  app.pfiId === currentPFI.id
                ) || [];

                const hasApprovedApplication = applications.some((app: any) => app.status === 'approved');
                const hasPendingApplication = applications.some((app: any) => app.status === 'pending');

                // Only proceed if PFI hasn't already applied (or was rejected)
                if (!hasApprovedApplication && !hasPendingApplication) {
                  // Create scheme object in the expected format
                  scheme = {
                    id: foundScheme.id,
                    title: foundScheme.name || foundScheme.title || 'Untitled Scheme',
                    description: foundScheme.description || `Fund scheme: ${foundScheme.name || foundScheme.title || 'Untitled'}`,
                    amount: foundScheme.amount || 'N/A',
                    deadline: foundScheme.applicationDeadline || foundScheme.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    category: 'Fund Scheme',
                    state: foundScheme.state || 'Multi-State',
                    status: foundScheme.status || 'Active',
                    workflowStage: foundScheme.workflowStage || 'initial',
                    fullSchemeData: foundScheme,
                    approvedInsuranceCompany: foundScheme.insuranceCompanySubmissions?.find((sub: any) => sub.status === 'approved')
                  };

                  // Add to availableSchemes temporarily so it's available
                  setAvailableSchemes(prev => {
                    // Check if already exists to avoid duplicates
                    if (prev.find(s => s.id === schemeId)) {
                      return prev;
                    }
                    return [...prev, scheme!];
                  });
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching scheme from localStorage:', error);
      }
    }

    // If still not found, show error
    if (!scheme) {
      alert('Scheme not found. The scheme may not be available for application yet, or you may have already applied. Please check your Available Schemes or refresh the page.');
      return;
    }

    setSelectedScheme(schemeId);
    setShowForm(true);
    setCurrentStep(1);
    // Reset PFI application form
    setPfiApplicationData({
      proposedInterestRate: '',
      policies: '',
      documents: []
    });
  }, [availableSchemes, activePFI]);

  // Listen for notification clicks to open scheme application modal
  useEffect(() => {
    const handleNotificationSchemeClick = (event: CustomEvent) => {
      const { schemeId } = event.detail;
      if (schemeId) {
        // Small delay to ensure schemes are loaded if page just loaded
        setTimeout(() => {
          handleApplyToScheme(schemeId);
        }, 100);
      }
    };

    window.addEventListener('notification-scheme-click' as any, handleNotificationSchemeClick as EventListener);
    return () => {
      window.removeEventListener('notification-scheme-click' as any, handleNotificationSchemeClick as EventListener);
    };
  }, [handleApplyToScheme]); // Use handleApplyToScheme as dependency since it's now memoized

  // Check for schemeId in URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const schemeIdFromUrl = urlParams.get('schemeId');
    if (schemeIdFromUrl && !selectedScheme && !showForm) {
      // Wait for schemes to load before opening modal, or use handleApplyToScheme which can fetch from localStorage
      if (availableSchemes.length > 0 || !schemesLoading) {
        handleApplyToScheme(schemeIdFromUrl);
        // Clean up URL after opening modal
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [availableSchemes, schemesLoading, selectedScheme, showForm, handleApplyToScheme]);

  // Filter schemes based on search and state
  // Also exclude any schemes with status 'Completed' (double-check)
  const filteredSchemes = useMemo(() => {
    let filtered = availableSchemes.filter((scheme: any) => {
      // Additional check: only show Active schemes (shouldn't happen if filtering worked above, but double-check)
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
          bankName: formData.bankName,
          contactPersonName: formData.contactPersonName,
          contactPersonEmail: formData.contactPersonEmail,
          contactPersonPhone: formData.contactPersonPhone,
          bankWebsite: formData.bankWebsite,
          discussPreviousProjects: formData.discussPreviousProjects
        },
        step2: {
          bankType: formData.bankType,
          maxDisbursementAmount: formData.maxDisbursementAmount,
          targetAudience: formData.targetAudience,
          geographicFocus: formData.geographicFocus,
          descriptionOfServices: formData.descriptionOfServices
        },
        step3: {
          financialProductsOffered: formData.financialProductsOffered,
          termsOfReferenceAFCF: formData.termsOfReferenceAFCF,
          termsOfReferenceFundProvider: formData.termsOfReferenceFundProvider,
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

      // Update scheme in localStorage with PFI application
      const storedSchemes = localStorage.getItem('fundSchemes');
      if (storedSchemes) {
        const schemes = JSON.parse(storedSchemes);

        // DEBUG: Log IC submissions before update
        const targetScheme = schemes.find((s: any) => s.id === selectedScheme);
        console.log('[PFI Submit] Before update - IC submissions:', targetScheme?.insuranceCompanySubmissions);
        console.log('[PFI Submit] Before update - PFI applications:', targetScheme?.pfiApplications);

        const updatedSchemes = schemes.map((scheme: any) => {
          if (scheme.id === selectedScheme) {
            const pfiApplication = {
              pfiId: activePFI?.id,
              pfiName: formData.bankName || formData.contactPersonName,
              proposedInterestRate: formData.maxDisbursementAmount || '', // Using this field as interest rate placeholder
              documents: [], // PFI documents would go here
              submittedAt: new Date().toISOString(),
              status: 'pending' as const
            };

            const updated = {
              ...scheme,
              pfiApplications: [
                ...(scheme.pfiApplications || []),
                pfiApplication
              ]
            };

            // DEBUG: Verify IC submissions preserved
            console.log('[PFI Submit] After spread - IC submissions preserved:', updated.insuranceCompanySubmissions);
            console.log('[PFI Submit] After spread - PFI applications:', updated.pfiApplications);

            return updated;
          }
          return scheme;
        });
        localStorage.setItem('fundSchemes', JSON.stringify(updatedSchemes));

        // DEBUG: Verify final saved data
        const saved = JSON.parse(localStorage.getItem('fundSchemes') || '[]');
        const savedScheme = saved.find((s: any) => s.id === selectedScheme);
        console.log('[PFI Submit] After save - IC submissions in localStorage:', savedScheme?.insuranceCompanySubmissions);
      }

      // Send notification to CA
      addNotification({
        role: '🏦 PFI',
        targetRole: 'coordinating-agency',
        message: `New scheme application from ${formData.bankName || formData.contactPersonName} for scheme "${selectedSchemeData?.title || 'Unknown Scheme'}".`,
        applicantName: formData.contactPersonName,
        applicantType: 'Company',
        companyName: formData.bankName,
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
          type: 'pfiSchemeApplication',
          pfiId: activePFI?.id,
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

  const handlePFIApplication = async () => {
    if (!selectedScheme || !activePFI) return;

    setIsSubmitting(true);

    try {
      // Get the full scheme data
      const schemeData = availableSchemes.find(s => s.id === selectedScheme)?.fullSchemeData;
      if (!schemeData) {
        alert('Scheme data not found. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Validate application
      if (!pfiApplicationData.proposedInterestRate.trim()) {
        alert('Please enter the proposed interest rate.');
        setIsSubmitting(false);
        return;
      }

      if (!pfiApplicationData.policies.trim()) {
        alert('Please provide policy-related information.');
        setIsSubmitting(false);
        return;
      }

      // Create application object
      const application: any = {
        pfiId: activePFI.id,
        pfiName: activePFI.formData.organizationName || 'PFI',
        proposedInterestRate: pfiApplicationData.proposedInterestRate,
        policies: pfiApplicationData.policies,
        documents: pfiApplicationData.documents.map(doc => ({
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

        // DEBUG: Check IC submissions before update
        const targetScheme = schemes.find((s: any) => s.id === selectedScheme);
        console.log('[handlePFIApplication] Before update - IC submissions:', targetScheme?.insuranceCompanySubmissions);
        console.log('[handlePFIApplication] Before update - PFI applications:', targetScheme?.pfiApplications);

        const updatedSchemes = schemes.map((scheme: any) => {
          if (scheme.id === selectedScheme) {
            const updated = {
              ...scheme,
              pfiApplications: [
                ...(scheme.pfiApplications || []),
                application
              ]
            };

            // DEBUG: Verify IC submissions preserved
            console.log('[handlePFIApplication] After spread - IC submissions:', updated.insuranceCompanySubmissions);

            return updated;
          }
          return scheme;
        });
        localStorage.setItem('fundSchemes', JSON.stringify(updatedSchemes));

        // CRITICAL: Notify FundSchemes component that localStorage was updated
        window.dispatchEvent(new CustomEvent('fundSchemes-updated'));
        console.log('[handlePFIApplication] Dispatched fundSchemes-updated event');

        // DEBUG: Verify final saved data
        const saved = JSON.parse(localStorage.getItem('fundSchemes') || '[]');
        const savedScheme = saved.find((s: any) => s.id === selectedScheme);
        console.log('[handlePFIApplication] After save - IC submissions:', savedScheme?.insuranceCompanySubmissions);
      }

      // Send notification to CA
      addNotification({
        role: '🏦 PFI',
        targetRole: 'coordinating-agency',
        message: `PFI "${activePFI.formData.organizationName || 'PFI'}" has applied for scheme "${schemeData.name}" with proposed interest rate of ${pfiApplicationData.proposedInterestRate}%. Please review and select.`,
        applicantName: activePFI.formData.organizationName || 'PFI',
        applicantType: 'Company',
        companyName: activePFI.formData.organizationName || 'PFI',
        contactPersonName: activePFI.formData.fullName,
        contactPersonEmail: activePFI.formData.email,
        contactPersonPhone: activePFI.formData.phone,
        companyEmail: activePFI.formData.officialEmail || activePFI.formData.email,
        schemeId: selectedScheme,
        schemeName: schemeData.name,
        applicationId: `pfi_app_${Date.now()}`,
        applicationData: {
          proposedInterestRate: pfiApplicationData.proposedInterestRate,
          policies: pfiApplicationData.policies,
          documents: pfiApplicationData.documents.map(d => ({ fileName: d.fileName, description: d.description })),
          submittedAt: application.submittedAt // Crucial for matching
        },
        applicationStatus: 'pending',
        metadata: {
          type: 'pfiSchemeApplication',
          pfiId: activePFI.id,
          applicationId: application.pfiId + '_' + Date.now()
        }
      });

      // Refresh schemes list
      const fetchSchemes = async () => {
        const stored = localStorage.getItem('fundSchemes');
        if (stored) {
          const parsed = JSON.parse(stored);
          const currentPFI = activePFI;
          const relevant = parsed
            .filter((s: any) => {
              const isActive = s.status === 'Active';
              const isSelected = s.selectedPFIIds?.includes(currentPFI.id) || false;
              const isInitialStage = s.workflowStage === 'initial' || !s.workflowStage;

              // Check applications for this PFI
              const applications = s.pfiApplications?.filter((app: any) =>
                app.pfiId === currentPFI.id
              ) || [];

              // Hide if there's an approved application (PFI already linked)
              const hasApprovedApplication = applications.some((app: any) => app.status === 'approved');

              // Hide if there's a pending application (waiting for CA review)
              const hasPendingApplication = applications.some((app: any) => app.status === 'pending');

              // Show if selected, active, in initial stage, and no approved or pending applications
              return isActive && isSelected && isInitialStage && !hasApprovedApplication && !hasPendingApplication;
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
              workflowStage: s.workflowStage || 'initial',
              fullSchemeData: s,
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
      console.error('Error submitting PFI application:', error);
      alert('Failed to submit. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedScheme(null);
    setCurrentStep(1);
    setShowFullSchemeDetails(false);
    setExpandedInsuranceCompany(null);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Contact Information</h3>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Bank Name *</label>
        <input
          type="text"
          name="bankName"
          value={formData.bankName}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Enter your bank name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Contact Person Name *</label>
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
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Bank Website *</label>
        <input
          type="url"
          name="bankWebsite"
          value={formData.bankWebsite}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="https://example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Discuss about previous projects *</label>
        <textarea
          name="discussPreviousProjects"
          value={formData.discussPreviousProjects}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Describe your previous fund disbursement projects, experience, and achievements..."
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Account Profile</h3>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Bank Type *</label>
        <select
          name="bankType"
          value={formData.bankType}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
        >
          <option value="">Select Bank Type</option>
          {bankTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Maximum Disbursement Amount *</label>
        <input
          type="text"
          name="maxDisbursementAmount"
          value={formData.maxDisbursementAmount}
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
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Description of Services and Fund Disbursement Programs *</label>
        <textarea
          name="descriptionOfServices"
          value={formData.descriptionOfServices}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Describe your services, fund disbursement programs, and previous benefits..."
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
        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">Terms of Reference to Fund Provider *</label>
        <textarea
          name="termsOfReferenceFundProvider"
          value={formData.termsOfReferenceFundProvider}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Enter terms of reference to Fund Provider..."
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
          placeholder="Describe how you will report on disbursement activities, what metrics you will track, and the reporting formats you will use..."
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
          placeholder="Describe your bank's regulatory compliance status, CBN licenses held, adherence to banking regulations, AML/CFT compliance, and any regulatory requirements you meet..."
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

  const renderSchemeContent = () => {
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

    // Check workflowStage from both scheme object and fullSchemeData
    // Stage 0 workflow: PFIs are selected during scheme creation and submit their applications
    const workflowStage = scheme?.workflowStage || scheme?.fullSchemeData?.workflowStage;
    const isWorkflowScheme = workflowStage === 'initial';

    // If it's an initial stage scheme, show the PFI application form
    if (isWorkflowScheme) {
      // Show PFI Application Form with full scheme details
      const fullScheme = scheme?.fullSchemeData || scheme;

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
          {/* Full Scheme Details */}
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
                  {/* Scheme Details */}
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

                  {/* Location Allocation */}
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

                  {/* Fund Allocation */}
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

                  {/* Beneficiaries */}
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

                  {/* Documents */}
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

                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                  Proposed Interest Rate for Beneficiaries (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={pfiApplicationData.proposedInterestRate}
                  onChange={(e) => setPfiApplicationData(prev => ({ ...prev, proposedInterestRate: e.target.value }))}
                  placeholder="e.g., 9.5"
                  className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <p className="text-xs text-gray-400 mt-1 font-serif">Enter the interest rate percentage you will charge beneficiaries for this scheme.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                  Policies <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={pfiApplicationData.policies}
                  onChange={(e) => setPfiApplicationData(prev => ({ ...prev, policies: e.target.value }))}
                  placeholder="Provide all policy-related information relevant to your application..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  required
                />
                <p className="text-xs text-gray-400 mt-1 font-serif">Enter all policy-related information relevant to your application.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                  Supporting Documents (Optional)
                </label>
                <div className="space-y-3">
                  {pfiApplicationData.documents.map((doc, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          const updated = [...pfiApplicationData.documents];
                          updated[index] = {
                            ...updated[index],
                            fileName: file?.name || '',
                            file: file
                          };
                          setPfiApplicationData(prev => ({ ...prev, documents: updated }));
                        }}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="flex-1 px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent-500 file:text-white hover:file:bg-accent-600"
                      />
                      <input
                        type="text"
                        value={doc.description}
                        onChange={(e) => {
                          const updated = [...pfiApplicationData.documents];
                          updated[index].description = e.target.value;
                          setPfiApplicationData(prev => ({ ...prev, documents: updated }));
                        }}
                        placeholder="Description"
                        className="flex-1 px-4 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = pfiApplicationData.documents.filter((_, i) => i !== index);
                          setPfiApplicationData(prev => ({ ...prev, documents: updated }));
                        }}
                        className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPfiApplicationData(prev => ({
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
                  onClick={handlePFIApplication}
                  disabled={isSubmitting || !pfiApplicationData.proposedInterestRate.trim()}
                  className="px-6 py-2 rounded-md bg-accent-500 hover:bg-accent-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // If not a workflow scheme or no fullSchemeData, show error
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
  };

  if (!recordLoaded) {
    return (
      <PortalLayout role="Participating Bank (PFI)" roleIcon="🏦" sidebarItems={sidebarItems}>
        <div className="card">
          <h1 className="text-lg font-semibold font-sans text-gray-100">Loading Schemes</h1>
          <p className="text-sm text-gray-300 font-serif mt-2">Preparing the list of available schemes...</p>
        </div>
      </PortalLayout>
    );
  }

  if (!isVerified) {
    return (
      <PortalLayout role="Participating Bank (PFI)" roleIcon="🏦" sidebarItems={sidebarItems}>
        <div className="space-y-4">
          <div className="card">
            <h1 className="text-xl font-bold font-sans text-gray-100 mb-2">Access Restricted</h1>
            <p className="text-sm text-gray-300 font-serif">
              Scheme applications are available only after your PFI registration is verified by the Coordinating Agency. Review and update your registration details from the Settings page, then await approval.
            </p>
            <Link
              to="/portal/pfi/settings"
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

  return (
    <PortalLayout role="Participating Bank (PFI)" roleIcon="🏦" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Available Schemes Section - Always visible */}
        {!showForm && (
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
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleApplyToScheme(scheme.id);
                      }}
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
                  {renderSchemeContent()}
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
    </PortalLayout>
  );
};

export default SchemeApplication;