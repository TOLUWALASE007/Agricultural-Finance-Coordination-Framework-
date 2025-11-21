import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../../components/PortalLayout';
import { schemeAPI } from '../../../utils/api';
import { useNotifications } from '../../../context/NotificationContext';
import { getResearcherStatusSnapshot, ResearcherStatus, getActiveResearcherRecord } from '../../../utils/localDatabase';

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
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/researcher' },
    { id: 'scheme-application', name: 'Schemes Application', icon: '📝', href: '/portal/researcher/scheme-application' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/researcher/settings' }
  ];

  const [status, setStatus] = useState<ResearcherStatus>('unverified');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [recordLoaded, setRecordLoaded] = useState(false);

  useEffect(() => {
    const snapshot = getResearcherStatusSnapshot();
    if (snapshot) {
      setStatus(snapshot.status);
      setRejectionReason(snapshot.rejectionReason);
    }
    setRecordLoaded(true);
  }, []);

  const isVerified = status === 'verified';

  const { addNotification } = useNotifications();
  const activeResearcher = useMemo(() => getActiveResearcherRecord(), []);

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

  // Available Schemes Data
  const [availableSchemes, setAvailableSchemes] = useState<any[]>([]);
  const [schemesLoading, setSchemesLoading] = useState(true);

  // Fetch schemes from API or localStorage
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setSchemesLoading(true);
        
        // First, check if there's localStorage data (from Coordinating Agency portal)
        const storedSchemes = localStorage.getItem('fundSchemes');
        if (storedSchemes) {
          try {
            const parsedSchemes = JSON.parse(storedSchemes);
            // Filter out deleted and completed schemes - only show Active schemes
            const activeSchemes = parsedSchemes
              .filter((scheme: any) => scheme.status === 'Active')
              .map((scheme: any) => ({
                id: scheme.id,
                title: scheme.name || scheme.title || 'Untitled Scheme',
                description: scheme.description || `Fund scheme: ${scheme.name || scheme.title || 'Untitled'}`,
                amount: scheme.amount || 'N/A',
                deadline: scheme.applicationDeadline || scheme.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 30 days from now
                category: 'Fund Scheme',
                state: scheme.state || 'Multi-State',
                status: scheme.status || 'Active' // Include status for filtering
              }));
            setAvailableSchemes(activeSchemes);
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
        role: '🎓 Researcher/Student',
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
          type: 'researcherSchemeApplication',
          researcherId: activeResearcher?.id,
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
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedScheme(null);
    setCurrentStep(1);
  };

  if (!recordLoaded) {
    return (
      <PortalLayout role="Researcher/Student" roleIcon="🎓" sidebarItems={sidebarItems}>
        <div className="card">
          <h1 className="text-lg font-semibold font-sans text-gray-100">Loading Schemes</h1>
          <p className="text-sm text-gray-300 font-serif mt-2">Preparing the list of available schemes...</p>
        </div>
      </PortalLayout>
    );
  }

  if (!isVerified) {
    return (
      <PortalLayout role="Researcher/Student" roleIcon="🎓" sidebarItems={sidebarItems}>
        <div className="space-y-4">
          <div className="card">
            <h1 className="text-xl font-bold font-sans text-gray-100 mb-2">Access Restricted</h1>
            <p className="text-sm text-gray-300 font-serif">
              Scheme applications are available only after your Researcher/Student registration is verified by the Coordinating Agency. Review and update your registration details from the Settings page, then await approval.
            </p>
            <Link
              to="/portal/researcher/settings"
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
    <PortalLayout role="Researcher/Student" roleIcon="🎓" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {!showForm ? (
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
        ) : (
          <>
            {/* Application Form */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl sm:text-2xl font-bold font-sans text-gray-100">Scheme Application</h1>
                <button
                  onClick={handleCloseForm}
                  className="px-4 py-2 rounded-md bg-primary-700 text-gray-300 border border-primary-600 hover:bg-primary-600 font-medium"
                >
                  ← Back to Schemes
                </button>
              </div>
              
              {selectedScheme && (
                <div className="mb-4 p-3 bg-primary-700 rounded-lg border border-primary-600">
                  <p className="text-sm text-gray-400 font-serif">Applying for: <span className="text-accent-400 font-medium">{availableSchemes.find(s => s.id === selectedScheme)?.title}</span></p>
                </div>
              )}

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400 font-serif">Step {currentStep} of 5</span>
                  <span className="text-sm text-gray-400 font-serif">{Math.round((currentStep / 5) * 100)}%</span>
                </div>
                <div className="w-full bg-primary-700 rounded-full h-2">
                  <div
                    className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step Content */}
              <div className="mb-6">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
                {currentStep === 5 && renderStep5()}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="px-6 py-2 rounded-md bg-primary-700 text-gray-300 border border-primary-600 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Previous
                </button>
                {currentStep < 5 ? (
                  <button
                    onClick={handleNext}
                    disabled={!validateStep(currentStep)}
                    className="px-6 py-2 rounded-md bg-accent-500 text-white hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 rounded-md bg-accent-500 text-white hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                )}
              </div>
            </div>
          </>
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

