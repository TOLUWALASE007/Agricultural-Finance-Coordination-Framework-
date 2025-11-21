import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NIGERIAN_STATES } from '../constants/nigeriaStates';
import { useNotifications } from '../context/NotificationContext';
import {
  registerFundProvider,
  updateFundProviderRecord,
  FundProviderFormData,
  buildFundProviderApplicationData,
  findFundProviderByEmail,
  registerInsuranceCompany,
  updateInsuranceCompanyRecord,
  InsuranceCompanyFormData,
  buildInsuranceCompanyApplicationData,
  registerCooperativeGroup,
  updateCooperativeGroupRecord,
  CooperativeGroupFormData,
  buildCooperativeGroupApplicationData,
  registerExtensionOrganization,
  updateExtensionOrganizationRecord,
  ExtensionOrganizationFormData,
  buildExtensionOrganizationApplicationData,
  registerPFI,
  updatePFIRecord,
  PFIFormData,
  buildPFIApplicationData,
  registerAnchor,
  updateAnchorRecord,
  AnchorFormData,
  buildAnchorApplicationData,
  registerLeadFirm,
  updateLeadFirmRecord,
  LeadFirmFormData,
  buildLeadFirmApplicationData,
  registerProducer,
  updateProducerRecord,
  ProducerFormData,
  buildProducerApplicationData,
  registerResearcher,
  updateResearcherRecord,
  ResearcherFormData,
  buildResearcherApplicationData,
} from '../utils/localDatabase';

const Register: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeTypeTab, setActiveTypeTab] = useState<'individual' | 'company'>('individual');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  // Initial form data state - used for resetting form when switching roles
  const getInitialFormData = () => ({
    // Contact Info - Personal Details
    fullName: '',
    position: '',
    gender: '',
    birthDate: '',
    birthMonth: '',
    birthYear: '',
    
    // Contact Info - Contact Information
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    state: '',
    country: '',
    
    // Contact Info - Verification & Emergency
    idType: '',
    idNumber: '',
    idDocument: null as File | null,
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyRelationship: '',
    
    // Organization Info - Basic Information
    organizationName: '',
    registrationNumber: '',
    organizationType: '',
    yearEstablished: '',
    industry: '',
    missionStatement: '',
    
    // Organization Info - Address & Contact Info
    headquartersAddress: '',
    hqCity: '',
    hqState: '',
    hqCountry: '',
    officePhone: '',
    officialEmail: '',
    website: '',
    facebook: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    
    // Organization Info - Operations & Documentation
    numEmployees: '',
    areasOfOperation: [] as string[],
    organizationLogo: null as File | null,
    certificateOfIncorporation: null as File | null,
    hasPartnership: '',
    partnershipDetails: '',
    
    // Security
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    
    // Student/Researcher specific fields
    // Step 1: Contact Information
    nationality: '',
    
    // Step 2: Academic / Research Information
    institutionName: '',
    faculty: '',
    currentLevel: '',
    studentResearcherId: '',
    yearOfEntry: '',
    expectedCompletionYear: '',
    areaOfStudy: '',
    researchTopic: '',
    supervisorName: '',
    supervisorEmail: '',
    supportingDocument: null as File | null,
    googleScholar: '',
    researchGate: '',
    linkedinProfile: '',
    agreeToDataSharing: false,
    agreeToAccuracy: false,
    
    // Producer/Farmer specific fields
    // Step 1: Personal Information
    // (uses existing: fullName, gender, birthDate, phone, email, address, city, state, country)
    
    // Step 2: Farm / Business Details
    farmBusinessName: '',
    typeOfFarmer: [] as string[],
    farmAddress: '',
    farmSize: '',
    yearsOfExperience: '',
    primarySourceOfIncome: '',
    farmerAssociation: '',
    
    // Step 3: Type of Produce
    crops: [] as string[],
    livestock: [] as string[],
    hasProcessingValueAddition: '',
    processingValueAdditionDetails: '',
    
    // Step 4: Production Capacity & Market
    totalAnnualProduction: '',
    primaryMarket: '',
    majorBuyers: '',
    challengesFaced: '',
    
    // Step 5: Verification & Documents
    farmImages: null as File | null,
    certification: null as File | null,
    
    // Step 6: Banking & Payment Details
    preferredPaymentMethod: '',
    bankName: '',
    accountName: '',
    accountNumber: ''
  });

  const [formData, setFormData] = useState(getInitialFormData());

  const roles = [
    {
      id: 'fund-provider',
      name: 'Fund Provider',
      icon: '💼',
      description: 'Financial institutions and organizations providing agricultural financing',
      registrationTypes: ['individual', 'company']
    },
    {
      id: 'coordinating-agency',
      name: 'Coordinating Agency',
      icon: '🏛️',
      description: 'Government agencies coordinating agricultural finance programs',
      registrationTypes: ['individual', 'company']
    },
    {
      id: 'pfi',
      name: 'Participating Bank (PFI)',
      icon: '🏦',
      description: 'Participating Financial Institutions processing loan applications',
      registrationTypes: ['individual', 'company']
    },
    {
      id: 'insurance',
      name: 'Insurance Company',
      icon: '🛡️',
      description: 'Insurance providers offering agricultural risk protection',
      registrationTypes: ['individual', 'company']
    },
    {
      id: 'anchor',
      name: 'Anchor',
      icon: '⚓',
      description: 'Large agricultural enterprises anchoring value chains',
      registrationTypes: ['individual', 'company']
    },
    {
      id: 'lead-firm',
      name: 'Lead Firm',
      icon: '🏭',
      description: 'Input manufacturers and dealers leading agricultural supply chains',
      registrationTypes: ['individual', 'company']
    },
    {
      id: 'producer',
      name: 'Producer/Farmer',
      icon: '🌾',
      description: 'Individual farmers and agricultural producers',
      registrationTypes: ['individual']
    },
    {
      id: 'cooperative',
      name: 'Cooperative Group',
      icon: '🤝',
      description: 'Agricultural cooperative organizations and groups',
      registrationTypes: ['individual', 'company']
    },
    {
      id: 'extension',
      name: 'Extension Organization',
      icon: '🌱',
      description: 'Agricultural extension and advisory service providers',
      registrationTypes: ['individual', 'company']
    },
    {
      id: 'researcher',
      name: 'Researcher/Student',
      icon: '🎓',
      description: 'Academic researchers and students in agricultural finance',
      registrationTypes: ['individual']
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => {
      const newValue = type === 'checkbox' ? checked : (value ?? '');
      return {
        ...prev,
        [name]: newValue
      };
    });
  };

  // Helper to ensure input values are always strings (never undefined)
  const getInputValue = (fieldName: keyof typeof formData): string => {
    const value = formData[fieldName];
    if (typeof value === 'string') return value;
    if (value === null || value === undefined) return '';
    return String(value);
  };

  const handleAreaToggle = (stateName: string) => {
    setFormData(prev => {
      const exists = prev.areasOfOperation.includes(stateName);
      const updatedAreas = exists
        ? prev.areasOfOperation.filter(area => area !== stateName)
        : [...prev.areasOfOperation, stateName];
      return {
        ...prev,
        areasOfOperation: updatedAreas,
      };
    });
  };

  const handleSelectAllAreas = () => {
    setFormData(prev => ({
      ...prev,
      areasOfOperation:
        prev.areasOfOperation.length === NIGERIAN_STATES.length ? [] : [...NIGERIAN_STATES],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      [name]: file
    }));
  };

  const getCurrentRole = () => roles[activeTab];
  const getAvailableRegistrationTypes = () => getCurrentRole().registrationTypes;
  const hasMultipleRegistrationTypes = () => getAvailableRegistrationTypes().length > 1;

  const nextStep = () => {
    if (currentStep < getTotalSteps()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getTotalSteps = () => {
    const currentRole = getCurrentRole();
    
    // Student/Researcher: 3 steps
    if (currentRole.id === 'researcher') {
      return 3;
    }
    
    // Producer/Farmer: 7 steps
    if (currentRole.id === 'producer') {
      return 7;
    }
    
    // Contact Info tab has 3 steps (no Security & Terms)
    // Organization Info tab has 4 steps (includes Security & Terms)
    return activeTypeTab === 'individual' ? 3 : 4;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const currentRole = getCurrentRole();
    
    // CRITICAL: Early role validation to prevent cross-role registration
    // Verify the role is correctly identified before proceeding
    if (!currentRole || !currentRole.id) {
      alert('Registration error: Unable to determine selected role. Please refresh and try again.');
      return;
    }

    // Prevent any registration if role state is ambiguous
    const cooperativeGroupIndex = roles.findIndex(r => r.id === 'cooperative');
    const fundProviderIndex = roles.findIndex(r => r.id === 'fund-provider');
    
    if (currentRole.id === 'cooperative' && activeTab !== cooperativeGroupIndex) {
      console.error('CRITICAL: Cooperative Group role mismatch', { 
        currentRoleId: currentRole.id, 
        activeTab, 
        expectedIndex: cooperativeGroupIndex 
      });
      alert('Registration error: Role selection mismatch detected. Please select Cooperative Group tab and try again.');
      return;
    }

    if (currentRole.id === 'fund-provider' && activeTab !== fundProviderIndex) {
      console.error('CRITICAL: Fund Provider role mismatch', { 
        currentRoleId: currentRole.id, 
        activeTab, 
        expectedIndex: fundProviderIndex 
      });
      alert('Registration error: Role selection mismatch detected. Please select Fund Provider tab and try again.');
      return;
    }

    setIsSubmitting(true);

    // Explicit role validation to prevent cross-role registration
    if (currentRole.id === 'fund-provider') {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match.');
        setIsSubmitting(false);
        return;
      }

      try {
        const registrationType: 'individual' | 'company' = activeTypeTab;
        if (formData.areasOfOperation.length === 0) {
          alert('Select at least one area of operation / coverage.');
          setIsSubmitting(false);
          return;
        }
        const contactEmail = formData.email.trim();
        const officialEmail = formData.officialEmail.trim();

        if (!officialEmail) {
          alert('Official company email is required for portal access.');
          setIsSubmitting(false);
          return;
        }

        const storedFormData: FundProviderFormData = {
          fullName: formData.fullName.trim(),
          position: formData.position.trim(),
          gender: formData.gender,
          birthDate: formData.birthDate,
          email: contactEmail,
          phone: formData.phone.trim(),
          whatsapp: formData.whatsapp?.trim() || undefined,
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim(),
          idType: formData.idType,
          idNumber: formData.idNumber.trim(),
          idDocumentName: formData.idDocument ? formData.idDocument.name : undefined,
          emergencyContactName: formData.emergencyContactName.trim(),
          emergencyContactPhone: formData.emergencyContactPhone.trim(),
          emergencyRelationship: formData.emergencyRelationship.trim(),
          organizationName: formData.organizationName.trim(),
          registrationNumber: formData.registrationNumber.trim(),
          organizationType: formData.organizationType,
          yearEstablished: formData.yearEstablished.trim(),
          industry: formData.industry.trim(),
          missionStatement: formData.missionStatement.trim(),
          headquartersAddress: formData.headquartersAddress.trim(),
          hqCity: formData.hqCity.trim(),
          hqState: formData.hqState.trim(),
          hqCountry: formData.hqCountry.trim(),
          officePhone: formData.officePhone.trim(),
          officialEmail,
          website: formData.website.trim(),
          facebook: formData.facebook?.trim() || undefined,
          linkedin: formData.linkedin?.trim() || undefined,
          twitter: formData.twitter?.trim() || undefined,
          instagram: formData.instagram?.trim() || undefined,
          numEmployees: formData.numEmployees.trim(),
          areasOfOperation: [...formData.areasOfOperation],
          organizationLogoName: formData.organizationLogo ? formData.organizationLogo.name : undefined,
          certificateOfIncorporationName: formData.certificateOfIncorporation ? formData.certificateOfIncorporation.name : undefined,
          hasPartnership: formData.hasPartnership,
          partnershipDetails: formData.partnershipDetails.trim(),
          password: '',
        };

        const applicationData = buildFundProviderApplicationData(storedFormData);

        const record = registerFundProvider({
          email: officialEmail,
          password: formData.password,
          registrationType,
          formData: storedFormData,
        });

        const notificationId = addNotification({
          role: '💼 Fund Provider',
          targetRole: 'coordinating-agency',
          message: `${storedFormData.organizationName || storedFormData.fullName} submitted a new Fund Provider registration for approval.`,
          applicantName: storedFormData.fullName,
          applicantType: 'Company',
          companyName: storedFormData.organizationName,
          companyId: storedFormData.registrationNumber,
          organization: storedFormData.organizationName,
          fullAddress: `${storedFormData.address}, ${storedFormData.city}, ${storedFormData.state}, ${storedFormData.country}`,
          contactPersonName: storedFormData.fullName,
          contactPersonEmail: storedFormData.email,
          contactPersonPhone: storedFormData.phone,
          applicationData,
          metadata: {
            type: 'fundProviderRegistration',
            fundProviderId: record.id,
            email: record.email,
            requiresDecision: true,
          },
        });

        updateFundProviderRecord(record.id, { pendingNotificationId: notificationId });

        alert('Registration submitted successfully! Please sign in to track your verification status.');
        navigate('/login');
      } catch (error) {
        console.error('Fund Provider registration failed:', error);
        const message = error instanceof Error ? error.message : 'Unable to complete registration. Please try again.';
        alert(message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (currentRole.id === 'insurance') {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match.');
        setIsSubmitting(false);
        return;
      }

      try {
        const registrationType: 'individual' | 'company' = activeTypeTab;
        if (formData.areasOfOperation.length === 0) {
          alert('Select at least one area of operation / coverage.');
          setIsSubmitting(false);
          return;
        }
        const contactEmail = formData.email.trim();
        const officialEmail = formData.officialEmail.trim();

        if (!officialEmail) {
          alert('Official company email is required for portal access.');
          setIsSubmitting(false);
          return;
        }

        const storedFormData: InsuranceCompanyFormData = {
          fullName: formData.fullName.trim(),
          position: formData.position.trim(),
          gender: formData.gender,
          birthDate: formData.birthDate,
          email: contactEmail,
          phone: formData.phone.trim(),
          whatsapp: formData.whatsapp?.trim() || undefined,
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim(),
          idType: formData.idType,
          idNumber: formData.idNumber.trim(),
          idDocumentName: formData.idDocument ? formData.idDocument.name : undefined,
          emergencyContactName: formData.emergencyContactName.trim(),
          emergencyContactPhone: formData.emergencyContactPhone.trim(),
          emergencyRelationship: formData.emergencyRelationship.trim(),
          organizationName: formData.organizationName.trim(),
          registrationNumber: formData.registrationNumber.trim(),
          organizationType: formData.organizationType,
          yearEstablished: formData.yearEstablished.trim(),
          industry: formData.industry.trim(),
          missionStatement: formData.missionStatement.trim(),
          headquartersAddress: formData.headquartersAddress.trim(),
          hqCity: formData.hqCity.trim(),
          hqState: formData.hqState.trim(),
          hqCountry: formData.hqCountry.trim(),
          officePhone: formData.officePhone.trim(),
          officialEmail,
          website: formData.website.trim(),
          facebook: formData.facebook?.trim() || undefined,
          linkedin: formData.linkedin?.trim() || undefined,
          twitter: formData.twitter?.trim() || undefined,
          instagram: formData.instagram?.trim() || undefined,
          numEmployees: formData.numEmployees.trim(),
          areasOfOperation: [...formData.areasOfOperation],
          organizationLogoName: formData.organizationLogo ? formData.organizationLogo.name : undefined,
          certificateOfIncorporationName: formData.certificateOfIncorporation ? formData.certificateOfIncorporation.name : undefined,
          hasPartnership: formData.hasPartnership,
          partnershipDetails: formData.partnershipDetails.trim(),
          password: '',
        };

        const applicationData = buildInsuranceCompanyApplicationData(storedFormData);

        const record = registerInsuranceCompany({
          email: officialEmail,
          password: formData.password,
          registrationType,
          formData: storedFormData,
        });

        const notificationId = addNotification({
          role: '🛡️ Insurance Company',
          targetRole: 'coordinating-agency',
          message: `${storedFormData.organizationName || storedFormData.fullName} submitted a new Insurance Company registration for approval.`,
          applicantName: storedFormData.fullName,
          applicantType: 'Company',
          companyName: storedFormData.organizationName,
          companyId: storedFormData.registrationNumber,
          organization: storedFormData.organizationName,
          fullAddress: `${storedFormData.address}, ${storedFormData.city}, ${storedFormData.state}, ${storedFormData.country}`,
          contactPersonName: storedFormData.fullName,
          contactPersonEmail: storedFormData.email,
          contactPersonPhone: storedFormData.phone,
          applicationData,
          metadata: {
            type: 'insuranceCompanyRegistration',
            insuranceCompanyId: record.id,
            email: record.email,
            requiresDecision: true,
          },
        });

        updateInsuranceCompanyRecord(record.id, { pendingNotificationId: notificationId });

        alert('Registration submitted successfully! Please sign in to track your verification status.');
        navigate('/login');
      } catch (error) {
        console.error('Insurance Company registration failed:', error);
        const message = error instanceof Error ? error.message : 'Unable to complete registration. Please try again.';
        alert(message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (currentRole.id === 'cooperative') {
      // CRITICAL: Final validation before Cooperative Group registration
      // Ensure we're absolutely certain this is Cooperative Group registration
      if (currentRole.id !== 'cooperative' || currentRole.name !== 'Cooperative Group') {
        console.error('CRITICAL: Cooperative Group registration blocked - role validation failed', { 
          currentRole, 
          activeTab 
        });
        alert('Registration error: Invalid role detected. Cannot proceed with Cooperative Group registration.');
        setIsSubmitting(false);
        return;
      }

      // Double-check activeTab matches Cooperative Group index
      const cooperativeGroupIndex = roles.findIndex(r => r.id === 'cooperative');
      if (activeTab !== cooperativeGroupIndex) {
        console.error('CRITICAL: Cooperative Group registration blocked - activeTab mismatch', { 
          activeTab, 
          expectedIndex: cooperativeGroupIndex 
        });
        alert('Registration error: Tab selection mismatch. Please ensure Cooperative Group is selected.');
        setIsSubmitting(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match.');
        setIsSubmitting(false);
        return;
      }

      try {
        const registrationType: 'individual' | 'company' = activeTypeTab;
        if (formData.areasOfOperation.length === 0) {
          alert('Select at least one area of operation / coverage.');
          setIsSubmitting(false);
          return;
        }
        const contactEmail = formData.email.trim();
        const officialEmail = formData.officialEmail.trim();

        if (!officialEmail) {
          alert('Official company email is required for portal access.');
          setIsSubmitting(false);
          return;
        }

        const storedFormData: CooperativeGroupFormData = {
          fullName: formData.fullName.trim(),
          position: formData.position.trim(),
          gender: formData.gender,
          birthDate: formData.birthDate,
          email: contactEmail,
          phone: formData.phone.trim(),
          whatsapp: formData.whatsapp?.trim() || undefined,
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim(),
          idType: formData.idType,
          idNumber: formData.idNumber.trim(),
          idDocumentName: formData.idDocument ? formData.idDocument.name : undefined,
          emergencyContactName: formData.emergencyContactName.trim(),
          emergencyContactPhone: formData.emergencyContactPhone.trim(),
          emergencyRelationship: formData.emergencyRelationship.trim(),
          organizationName: formData.organizationName.trim(),
          registrationNumber: formData.registrationNumber.trim(),
          organizationType: formData.organizationType,
          yearEstablished: formData.yearEstablished.trim(),
          industry: formData.industry.trim(),
          missionStatement: formData.missionStatement.trim(),
          headquartersAddress: formData.headquartersAddress.trim(),
          hqCity: formData.hqCity.trim(),
          hqState: formData.hqState.trim(),
          hqCountry: formData.hqCountry.trim(),
          officePhone: formData.officePhone.trim(),
          officialEmail,
          website: formData.website.trim(),
          facebook: formData.facebook?.trim() || undefined,
          linkedin: formData.linkedin?.trim() || undefined,
          twitter: formData.twitter?.trim() || undefined,
          instagram: formData.instagram?.trim() || undefined,
          numEmployees: formData.numEmployees.trim(),
          areasOfOperation: [...formData.areasOfOperation],
          organizationLogoName: formData.organizationLogo ? formData.organizationLogo.name : undefined,
          certificateOfIncorporationName: formData.certificateOfIncorporation ? formData.certificateOfIncorporation.name : undefined,
          hasPartnership: formData.hasPartnership,
          partnershipDetails: formData.partnershipDetails.trim(),
          password: '',
        };

        const applicationData = buildCooperativeGroupApplicationData(storedFormData);

        // CRITICAL: Final validation before calling registration function
        // Ensure we NEVER call registerFundProvider for Cooperative Group registration
        if (currentRole.id !== 'cooperative' || currentRole.name !== 'Cooperative Group') {
          console.error('CRITICAL: Blocked Cooperative Group registration - role validation failed', { 
            currentRole, 
            activeTab 
          });
          alert('Registration error: Role validation failed. Cannot proceed.');
          setIsSubmitting(false);
          return;
        }

        // CRITICAL: Only call registerCooperativeGroup, NEVER registerFundProvider
        const record = registerCooperativeGroup({
          email: officialEmail,
          password: formData.password,
          registrationType,
          formData: storedFormData,
        });

        // CRITICAL: Verify the record was created as Cooperative Group (ID must start with 'cg_')
        // If it starts with 'fp_', it means a Fund Provider record was created incorrectly
        if (!record || !record.id) {
          console.error('CRITICAL: Cooperative Group record creation returned invalid record', { record });
          alert('Registration error: Record creation failed. Please try again.');
          setIsSubmitting(false);
          return;
        }

        if (!record.id.startsWith('cg_')) {
          console.error('CRITICAL: Wrong record type created! Expected Cooperative Group (cg_), got:', record.id);
          alert('Registration error: Incorrect record type created. Please contact support.');
          setIsSubmitting(false);
          return;
        }

        // Verify no Fund Provider record exists with the same email
        const existingFP = findFundProviderByEmail(officialEmail);
        if (existingFP) {
          console.error('CRITICAL: Fund Provider record already exists with this email!', { 
            email: officialEmail, 
            fpRecordId: existingFP.id,
            cgRecordId: record.id 
          });
          alert('Registration error: Email conflict detected. Please contact support.');
          setIsSubmitting(false);
          return;
        }

        // CRITICAL: Ensure notification role is Cooperative Group, NOT Fund Provider
        const notificationRole = '🤝 Cooperative Group';
        const notificationMessage = `${storedFormData.organizationName || storedFormData.fullName} submitted a new Cooperative Group registration for approval.`;
        
        // Final validation: ensure notification role matches Cooperative Group
        if (notificationRole !== '🤝 Cooperative Group') {
          console.error('CRITICAL: Notification role mismatch!', { notificationRole });
          alert('Registration error: Notification configuration error. Please contact support.');
          setIsSubmitting(false);
          return;
        }

        const notificationId = addNotification({
          role: notificationRole,
          targetRole: 'coordinating-agency',
          message: notificationMessage,
          applicantName: storedFormData.fullName,
          applicantType: 'Company',
          companyName: storedFormData.organizationName,
          companyId: storedFormData.registrationNumber,
          organization: storedFormData.organizationName,
          fullAddress: `${storedFormData.address}, ${storedFormData.city}, ${storedFormData.state}, ${storedFormData.country}`,
          contactPersonName: storedFormData.fullName,
          contactPersonEmail: storedFormData.email,
          contactPersonPhone: storedFormData.phone,
          applicationData,
          metadata: {
            type: 'cooperativeGroupRegistration',
            cooperativeGroupId: record.id,
            email: record.email,
            requiresDecision: true,
          },
        });

        updateCooperativeGroupRecord(record.id, { pendingNotificationId: notificationId });

        alert('Registration submitted successfully! Please sign in to track your verification status.');
        navigate('/login');
      } catch (error) {
        console.error('Cooperative Group registration failed:', error);
        const message = error instanceof Error ? error.message : 'Unable to complete registration. Please try again.';
        alert(message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (currentRole.id === 'extension') {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match.');
        setIsSubmitting(false);
        return;
      }

      try {
        const registrationType: 'individual' | 'company' = activeTypeTab;
        if (formData.areasOfOperation.length === 0) {
          alert('Select at least one area of operation / coverage.');
          setIsSubmitting(false);
          return;
        }
        const contactEmail = formData.email.trim();
        const officialEmail = formData.officialEmail.trim();

        if (!officialEmail) {
          alert('Official company email is required for portal access.');
          setIsSubmitting(false);
          return;
        }

        const storedFormData: ExtensionOrganizationFormData = {
          fullName: formData.fullName.trim(),
          position: formData.position.trim(),
          gender: formData.gender,
          birthDate: formData.birthDate,
          email: contactEmail,
          phone: formData.phone.trim(),
          whatsapp: formData.whatsapp?.trim() || undefined,
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim(),
          idType: formData.idType,
          idNumber: formData.idNumber.trim(),
          idDocumentName: formData.idDocument ? formData.idDocument.name : undefined,
          emergencyContactName: formData.emergencyContactName.trim(),
          emergencyContactPhone: formData.emergencyContactPhone.trim(),
          emergencyRelationship: formData.emergencyRelationship.trim(),
          organizationName: formData.organizationName.trim(),
          registrationNumber: formData.registrationNumber.trim(),
          organizationType: formData.organizationType,
          yearEstablished: formData.yearEstablished.trim(),
          industry: formData.industry.trim(),
          missionStatement: formData.missionStatement.trim(),
          headquartersAddress: formData.headquartersAddress.trim(),
          hqCity: formData.hqCity.trim(),
          hqState: formData.hqState.trim(),
          hqCountry: formData.hqCountry.trim(),
          officePhone: formData.officePhone.trim(),
          officialEmail,
          website: formData.website.trim(),
          facebook: formData.facebook?.trim() || undefined,
          linkedin: formData.linkedin?.trim() || undefined,
          twitter: formData.twitter?.trim() || undefined,
          instagram: formData.instagram?.trim() || undefined,
          numEmployees: formData.numEmployees.trim(),
          areasOfOperation: [...formData.areasOfOperation],
          organizationLogoName: formData.organizationLogo ? formData.organizationLogo.name : undefined,
          certificateOfIncorporationName: formData.certificateOfIncorporation ? formData.certificateOfIncorporation.name : undefined,
          hasPartnership: formData.hasPartnership,
          partnershipDetails: formData.partnershipDetails.trim(),
          password: '',
        };

        const applicationData = buildExtensionOrganizationApplicationData(storedFormData);

        const record = registerExtensionOrganization({
          email: officialEmail,
          password: formData.password,
          registrationType,
          formData: storedFormData,
        });

        if (!record || !record.id || !record.id.startsWith('eo_')) {
          console.error('CRITICAL: Extension Organization record validation failed', { record });
          alert('Registration error: Record creation failed. Please try again.');
          setIsSubmitting(false);
          return;
        }

        const notificationId = addNotification({
          role: '🌱 Extension Organization',
          targetRole: 'coordinating-agency',
          message: `${storedFormData.organizationName || storedFormData.fullName} submitted a new Extension Organization registration for approval.`,
          applicantName: storedFormData.fullName,
          applicantType: 'Company',
          companyName: storedFormData.organizationName,
          companyId: storedFormData.registrationNumber,
          organization: storedFormData.organizationName,
          fullAddress: `${storedFormData.address}, ${storedFormData.city}, ${storedFormData.state}, ${storedFormData.country}`,
          contactPersonName: storedFormData.fullName,
          contactPersonEmail: storedFormData.email,
          contactPersonPhone: storedFormData.phone,
          applicationData,
          metadata: {
            type: 'extensionOrganizationRegistration',
            extensionOrganizationId: record.id,
            email: record.email,
            requiresDecision: true,
          },
        });

        updateExtensionOrganizationRecord(record.id, { pendingNotificationId: notificationId });

        alert('Registration submitted successfully! Please sign in to track your verification status.');
        navigate('/login');
      } catch (error) {
        console.error('Extension Organization registration failed:', error);
        const message = error instanceof Error ? error.message : 'Unable to complete registration. Please try again.';
        alert(message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (currentRole.id === 'pfi') {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match.');
        setIsSubmitting(false);
        return;
      }

      try {
        const registrationType: 'individual' | 'company' = activeTypeTab;
        if (formData.areasOfOperation.length === 0) {
          alert('Select at least one area of operation / coverage.');
          setIsSubmitting(false);
          return;
        }
        const contactEmail = formData.email.trim();
        const officialEmail = formData.officialEmail.trim();

        if (!officialEmail) {
          alert('Official company email is required for portal access.');
          setIsSubmitting(false);
          return;
        }

        const storedFormData: PFIFormData = {
          fullName: formData.fullName.trim(),
          position: formData.position.trim(),
          gender: formData.gender,
          birthDate: formData.birthDate,
          email: contactEmail,
          phone: formData.phone.trim(),
          whatsapp: formData.whatsapp?.trim() || undefined,
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim(),
          idType: formData.idType,
          idNumber: formData.idNumber.trim(),
          idDocumentName: formData.idDocument ? formData.idDocument.name : undefined,
          emergencyContactName: formData.emergencyContactName.trim(),
          emergencyContactPhone: formData.emergencyContactPhone.trim(),
          emergencyRelationship: formData.emergencyRelationship.trim(),
          organizationName: formData.organizationName.trim(),
          registrationNumber: formData.registrationNumber.trim(),
          organizationType: formData.organizationType,
          yearEstablished: formData.yearEstablished.trim(),
          industry: formData.industry.trim(),
          missionStatement: formData.missionStatement.trim(),
          headquartersAddress: formData.headquartersAddress.trim(),
          hqCity: formData.hqCity.trim(),
          hqState: formData.hqState.trim(),
          hqCountry: formData.hqCountry.trim(),
          officePhone: formData.officePhone.trim(),
          officialEmail,
          website: formData.website.trim(),
          facebook: formData.facebook?.trim() || undefined,
          linkedin: formData.linkedin?.trim() || undefined,
          twitter: formData.twitter?.trim() || undefined,
          instagram: formData.instagram?.trim() || undefined,
          numEmployees: formData.numEmployees.trim(),
          areasOfOperation: [...formData.areasOfOperation],
          organizationLogoName: formData.organizationLogo ? formData.organizationLogo.name : undefined,
          certificateOfIncorporationName: formData.certificateOfIncorporation ? formData.certificateOfIncorporation.name : undefined,
          hasPartnership: formData.hasPartnership,
          partnershipDetails: formData.partnershipDetails.trim(),
          password: '',
        };

        const applicationData = buildPFIApplicationData(storedFormData);

        const record = registerPFI({
          email: officialEmail,
          password: formData.password,
          registrationType,
          formData: storedFormData,
        });

        if (!record || !record.id || !record.id.startsWith('pfi_')) {
          console.error('CRITICAL: PFI record validation failed', { record });
          alert('Registration error: Record creation failed. Please try again.');
          setIsSubmitting(false);
          return;
        }

        const notificationId = addNotification({
          role: '🏦 PFI',
          targetRole: 'coordinating-agency',
          message: `${storedFormData.organizationName || storedFormData.fullName} submitted a new PFI registration for approval.`,
          applicantName: storedFormData.fullName,
          applicantType: 'Company',
          companyName: storedFormData.organizationName,
          companyId: storedFormData.registrationNumber,
          organization: storedFormData.organizationName,
          fullAddress: `${storedFormData.address}, ${storedFormData.city}, ${storedFormData.state}, ${storedFormData.country}`,
          contactPersonName: storedFormData.fullName,
          contactPersonEmail: storedFormData.email,
          contactPersonPhone: storedFormData.phone,
          applicationData,
          metadata: {
            type: 'pfiRegistration',
            pfiId: record.id,
            email: record.email,
            requiresDecision: true,
          },
        });

        updatePFIRecord(record.id, { pendingNotificationId: notificationId });

        alert('Registration submitted successfully! Please sign in to track your verification status.');
        navigate('/login');
      } catch (error) {
        console.error('PFI registration failed:', error);
        const message = error instanceof Error ? error.message : 'Unable to complete registration. Please try again.';
        alert(message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (currentRole.id === 'anchor') {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match.');
        setIsSubmitting(false);
        return;
      }

      try {
        const registrationType: 'individual' | 'company' = activeTypeTab;
        if (formData.areasOfOperation.length === 0) {
          alert('Select at least one area of operation / coverage.');
          setIsSubmitting(false);
          return;
        }
        const contactEmail = formData.email.trim();
        const officialEmail = formData.officialEmail.trim();

        if (!officialEmail) {
          alert('Official company email is required for portal access.');
          setIsSubmitting(false);
          return;
        }

        const storedFormData: AnchorFormData = {
          fullName: formData.fullName.trim(),
          position: formData.position.trim(),
          gender: formData.gender,
          birthDate: formData.birthDate,
          email: contactEmail,
          phone: formData.phone.trim(),
          whatsapp: formData.whatsapp?.trim() || undefined,
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim(),
          idType: formData.idType,
          idNumber: formData.idNumber.trim(),
          idDocumentName: formData.idDocument ? formData.idDocument.name : undefined,
          emergencyContactName: formData.emergencyContactName.trim(),
          emergencyContactPhone: formData.emergencyContactPhone.trim(),
          emergencyRelationship: formData.emergencyRelationship.trim(),
          organizationName: formData.organizationName.trim(),
          registrationNumber: formData.registrationNumber.trim(),
          organizationType: formData.organizationType,
          yearEstablished: formData.yearEstablished.trim(),
          industry: formData.industry.trim(),
          missionStatement: formData.missionStatement.trim(),
          headquartersAddress: formData.headquartersAddress.trim(),
          hqCity: formData.hqCity.trim(),
          hqState: formData.hqState.trim(),
          hqCountry: formData.hqCountry.trim(),
          officePhone: formData.officePhone.trim(),
          officialEmail,
          website: formData.website.trim(),
          facebook: formData.facebook?.trim() || undefined,
          linkedin: formData.linkedin?.trim() || undefined,
          twitter: formData.twitter?.trim() || undefined,
          instagram: formData.instagram?.trim() || undefined,
          numEmployees: formData.numEmployees.trim(),
          areasOfOperation: [...formData.areasOfOperation],
          organizationLogoName: formData.organizationLogo ? formData.organizationLogo.name : undefined,
          certificateOfIncorporationName: formData.certificateOfIncorporation ? formData.certificateOfIncorporation.name : undefined,
          hasPartnership: formData.hasPartnership,
          partnershipDetails: formData.partnershipDetails.trim(),
          password: '',
        };

        const applicationData = buildAnchorApplicationData(storedFormData);

        const record = registerAnchor({
          email: officialEmail,
          password: formData.password,
          registrationType,
          formData: storedFormData,
        });

        if (!record || !record.id || !record.id.startsWith('anchor_')) {
          console.error('CRITICAL: Anchor record validation failed', { record });
          alert('Registration error: Record creation failed. Please try again.');
          setIsSubmitting(false);
          return;
        }

        const notificationId = addNotification({
          role: '⚓ Anchor',
          targetRole: 'coordinating-agency',
          message: `${storedFormData.organizationName || storedFormData.fullName} submitted a new Anchor registration for approval.`,
          applicantName: storedFormData.fullName,
          applicantType: 'Company',
          companyName: storedFormData.organizationName,
          companyId: storedFormData.registrationNumber,
          organization: storedFormData.organizationName,
          fullAddress: `${storedFormData.address}, ${storedFormData.city}, ${storedFormData.state}, ${storedFormData.country}`,
          contactPersonName: storedFormData.fullName,
          contactPersonEmail: storedFormData.email,
          contactPersonPhone: storedFormData.phone,
          applicationData,
          metadata: {
            type: 'anchorRegistration',
            anchorId: record.id,
            email: record.email,
            requiresDecision: true,
          },
        });

        updateAnchorRecord(record.id, { pendingNotificationId: notificationId });

        alert('Registration submitted successfully! Please sign in to track your verification status.');
        navigate('/login');
      } catch (error) {
        console.error('Anchor registration failed:', error);
        const message = error instanceof Error ? error.message : 'Unable to complete registration. Please try again.';
        alert(message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (currentRole.id === 'lead-firm') {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match.');
        setIsSubmitting(false);
        return;
      }

      try {
        const registrationType: 'individual' | 'company' = activeTypeTab;
        if (formData.areasOfOperation.length === 0) {
          alert('Select at least one area of operation / coverage.');
          setIsSubmitting(false);
          return;
        }
        const contactEmail = formData.email.trim();
        const officialEmail = formData.officialEmail.trim();

        if (!officialEmail) {
          alert('Official company email is required for portal access.');
          setIsSubmitting(false);
          return;
        }

        const storedFormData: LeadFirmFormData = {
          fullName: formData.fullName.trim(),
          position: formData.position.trim(),
          gender: formData.gender,
          birthDate: formData.birthDate,
          email: contactEmail,
          phone: formData.phone.trim(),
          whatsapp: formData.whatsapp?.trim() || undefined,
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim(),
          idType: formData.idType,
          idNumber: formData.idNumber.trim(),
          idDocumentName: formData.idDocument ? formData.idDocument.name : undefined,
          emergencyContactName: formData.emergencyContactName.trim(),
          emergencyContactPhone: formData.emergencyContactPhone.trim(),
          emergencyRelationship: formData.emergencyRelationship.trim(),
          organizationName: formData.organizationName.trim(),
          registrationNumber: formData.registrationNumber.trim(),
          organizationType: formData.organizationType,
          yearEstablished: formData.yearEstablished.trim(),
          industry: formData.industry.trim(),
          missionStatement: formData.missionStatement.trim(),
          headquartersAddress: formData.headquartersAddress.trim(),
          hqCity: formData.hqCity.trim(),
          hqState: formData.hqState.trim(),
          hqCountry: formData.hqCountry.trim(),
          officePhone: formData.officePhone.trim(),
          officialEmail,
          website: formData.website.trim(),
          facebook: formData.facebook?.trim() || undefined,
          linkedin: formData.linkedin?.trim() || undefined,
          twitter: formData.twitter?.trim() || undefined,
          instagram: formData.instagram?.trim() || undefined,
          numEmployees: formData.numEmployees.trim(),
          areasOfOperation: [...formData.areasOfOperation],
          organizationLogoName: formData.organizationLogo ? formData.organizationLogo.name : undefined,
          certificateOfIncorporationName: formData.certificateOfIncorporation ? formData.certificateOfIncorporation.name : undefined,
          hasPartnership: formData.hasPartnership,
          partnershipDetails: formData.partnershipDetails.trim(),
          password: '',
        };

        const applicationData = buildLeadFirmApplicationData(storedFormData);

        const record = registerLeadFirm({
          email: officialEmail,
          password: formData.password,
          registrationType,
          formData: storedFormData,
        });

        if (!record || !record.id || !record.id.startsWith('lf_')) {
          console.error('CRITICAL: Lead Firm record validation failed', { record });
          alert('Registration error: Record creation failed. Please try again.');
          setIsSubmitting(false);
          return;
        }

        const notificationId = addNotification({
          role: '🌱 Lead Firm',
          targetRole: 'coordinating-agency',
          message: `${storedFormData.organizationName || storedFormData.fullName} submitted a new Lead Firm registration for approval.`,
          applicantName: storedFormData.fullName,
          applicantType: 'Company',
          companyName: storedFormData.organizationName,
          companyId: storedFormData.registrationNumber,
          organization: storedFormData.organizationName,
          fullAddress: `${storedFormData.address}, ${storedFormData.city}, ${storedFormData.state}, ${storedFormData.country}`,
          contactPersonName: storedFormData.fullName,
          contactPersonEmail: storedFormData.email,
          contactPersonPhone: storedFormData.phone,
          applicationData,
          metadata: {
            type: 'leadFirmRegistration',
            leadFirmId: record.id,
            email: record.email,
            requiresDecision: true,
          },
        });

        updateLeadFirmRecord(record.id, { pendingNotificationId: notificationId });

        alert('Registration submitted successfully! Please sign in to track your verification status.');
        navigate('/login');
      } catch (error) {
        console.error('Lead Firm registration failed:', error);
        const message = error instanceof Error ? error.message : 'Unable to complete registration. Please try again.';
        alert(message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (currentRole.id === 'producer') {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match.');
        setIsSubmitting(false);
        return;
      }

      if (!formData.agreeToTerms) {
        alert('You must agree to the Terms & Conditions to register.');
        setIsSubmitting(false);
        return;
      }

      if (formData.typeOfFarmer.length === 0) {
        alert('Select at least one type of farmer.');
        setIsSubmitting(false);
        return;
      }

      if (formData.hasProcessingValueAddition === 'Yes' && !formData.processingValueAdditionDetails) {
        alert('Please specify processing/value addition activities.');
        setIsSubmitting(false);
        return;
      }

      try {
        const email = formData.email.trim() || formData.phone.trim();
        if (!email) {
          alert('Either email or phone number is required for registration.');
          setIsSubmitting(false);
          return;
        }

        const storedFormData: ProducerFormData = {
          fullName: formData.fullName.trim(),
          gender: formData.gender,
          birthDate: formData.birthDate,
          phone: formData.phone.trim(),
          email: formData.email.trim() || undefined,
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim(),
          farmBusinessName: formData.farmBusinessName.trim(),
          typeOfFarmer: [...formData.typeOfFarmer],
          farmAddress: formData.farmAddress.trim(),
          farmSize: formData.farmSize.trim(),
          yearsOfExperience: formData.yearsOfExperience.trim(),
          primarySourceOfIncome: formData.primarySourceOfIncome,
          farmerAssociation: formData.farmerAssociation.trim() || undefined,
          crops: [...formData.crops],
          livestock: [...formData.livestock],
          hasProcessingValueAddition: formData.hasProcessingValueAddition,
          processingValueAdditionDetails: formData.processingValueAdditionDetails.trim() || undefined,
          totalAnnualProduction: formData.totalAnnualProduction.trim(),
          primaryMarket: formData.primaryMarket,
          majorBuyers: formData.majorBuyers.trim() || undefined,
          challengesFaced: formData.challengesFaced.trim() || undefined,
          idType: formData.idType,
          idNumber: formData.idNumber.trim(),
          idDocumentName: formData.idDocument ? formData.idDocument.name : undefined,
          farmImagesName: formData.farmImages ? formData.farmImages.name : undefined,
          certificationName: formData.certification ? formData.certification.name : undefined,
          preferredPaymentMethod: formData.preferredPaymentMethod,
          bankName: formData.bankName.trim(),
          accountName: formData.accountName.trim(),
          accountNumber: formData.accountNumber.trim(),
          password: formData.password,
        };

        const applicationData = buildProducerApplicationData(storedFormData);

        const record = registerProducer({
          email: email,
          password: formData.password,
          formData: storedFormData,
        });

        if (!record || !record.id || !record.id.startsWith('producer_')) {
          console.error('CRITICAL: Producer record validation failed', { record });
          alert('Registration error: Record creation failed. Please try again.');
          setIsSubmitting(false);
          return;
        }

        const notificationId = addNotification({
          role: '🌾 Producer/Farmer',
          targetRole: 'coordinating-agency',
          message: `${storedFormData.fullName} submitted a new Producer/Farmer registration for approval.`,
          applicantName: storedFormData.fullName,
          applicantType: 'Individual',
          fullAddress: `${storedFormData.address}, ${storedFormData.city}, ${storedFormData.state}, ${storedFormData.country}`,
          contactPersonName: storedFormData.fullName,
          contactPersonEmail: storedFormData.email || storedFormData.phone,
          contactPersonPhone: storedFormData.phone,
          applicationData,
          metadata: {
            type: 'producerRegistration',
            producerId: record.id,
            email: record.email,
            requiresDecision: true,
          },
        });

        updateProducerRecord(record.id, { pendingNotificationId: notificationId });

        alert('Registration submitted successfully! Please sign in to track your verification status.');
        navigate('/login');
      } catch (error) {
        console.error('Producer registration failed:', error);
        const message = error instanceof Error ? error.message : 'Unable to complete registration. Please try again.';
        alert(message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (currentRole.id === 'researcher') {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match.');
        setIsSubmitting(false);
        return;
      }

      if (!formData.agreeToTerms || !formData.agreeToAccuracy) {
        alert('You must agree to both the Terms & Conditions and confirm the accuracy of your information.');
        setIsSubmitting(false);
        return;
      }

      try {
        const email = formData.email.trim();
        if (!email) {
          alert('Email is required for registration.');
          setIsSubmitting(false);
          return;
        }

        const storedFormData: ResearcherFormData = {
          fullName: formData.fullName.trim(),
          gender: formData.gender,
          birthDate: formData.birthDate,
          nationality: formData.nationality.trim(),
          email: email,
          phone: formData.phone.trim(),
          whatsapp: formData.whatsapp.trim() || undefined,
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim(),
          idType: formData.idType,
          idNumber: formData.idNumber.trim(),
          idDocumentName: formData.idDocument ? formData.idDocument.name : undefined,
          institutionName: formData.institutionName.trim(),
          faculty: formData.faculty.trim(),
          currentLevel: formData.currentLevel,
          studentResearcherId: formData.studentResearcherId.trim(),
          yearOfEntry: formData.yearOfEntry.trim(),
          expectedCompletionYear: formData.expectedCompletionYear.trim(),
          areaOfStudy: formData.areaOfStudy.trim(),
          researchTopic: formData.researchTopic.trim() || undefined,
          supervisorName: formData.supervisorName.trim() || undefined,
          supervisorEmail: formData.supervisorEmail.trim() || undefined,
          supportingDocumentName: formData.supportingDocument ? formData.supportingDocument.name : undefined,
          googleScholar: formData.googleScholar.trim() || undefined,
          researchGate: formData.researchGate.trim() || undefined,
          linkedinProfile: formData.linkedinProfile.trim() || undefined,
          password: formData.password,
        };

        const applicationData = buildResearcherApplicationData(storedFormData);

        const record = registerResearcher({
          email: email,
          password: formData.password,
          formData: storedFormData,
        });

        if (!record || !record.id || !record.id.startsWith('researcher_')) {
          console.error('CRITICAL: Researcher record validation failed', { record });
          alert('Registration error: Record creation failed. Please try again.');
          setIsSubmitting(false);
          return;
        }

        const notificationId = addNotification({
          role: '🎓 Researcher/Student',
          targetRole: 'coordinating-agency',
          message: `${storedFormData.fullName} submitted a new Researcher/Student registration for approval.`,
          applicantName: storedFormData.fullName,
          applicantType: 'Individual',
          fullAddress: `${storedFormData.address}, ${storedFormData.city}, ${storedFormData.state}, ${storedFormData.country}`,
          contactPersonName: storedFormData.fullName,
          contactPersonEmail: storedFormData.email,
          contactPersonPhone: storedFormData.phone,
          applicationData,
          metadata: {
            type: 'researcherRegistration',
            researcherId: record.id,
            email: record.email,
            requiresDecision: true,
          },
        });

        updateResearcherRecord(record.id, { pendingNotificationId: notificationId });

        alert('Registration submitted successfully! Please sign in to track your verification status.');
        navigate('/login');
      } catch (error) {
        console.error('Researcher registration failed:', error);
        const message = error instanceof Error ? error.message : 'Unable to complete registration. Please try again.';
        alert(message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Default behaviour for other roles (placeholder)
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    navigate('/login');
  };

  // Render form step content
  const renderStepContent = () => {
    const currentRole = getCurrentRole();
    
    // Student/Researcher Registration Form (3 steps)
    if (currentRole.id === 'researcher') {
      switch (currentStep) {
        case 1: // Contact Information
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Contact Information</h3>
              
              {/* Personal Details */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold font-sans text-gray-200">Personal Details</h4>
                
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Gender *
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      required
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="nationality" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Nationality *
                  </label>
                  <input
                    type="text"
                    id="nationality"
                    name="nationality"
                    required
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your nationality"
                  />
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold font-sans text-gray-200">Contact Details</h4>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      WhatsApp (Optional)
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter WhatsApp number"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Residential Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your residential address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter state/province"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </div>

              {/* Identity Verification */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold font-sans text-gray-200">Identity Verification</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="idType" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      ID Type *
                    </label>
                    <select
                      id="idType"
                      name="idType"
                      required
                      value={formData.idType}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="">Select ID Type</option>
                      <option value="National ID">National ID</option>
                      <option value="Passport">Passport</option>
                      <option value="Driver's License">Driver's License</option>
                      <option value="Student ID">Student ID</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="idNumber" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      ID Number *
                    </label>
                    <input
                      type="text"
                      id="idNumber"
                      name="idNumber"
                      required
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter ID number"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="idDocument" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Upload ID Document *
                  </label>
                  <input
                    type="file"
                    id="idDocument"
                    name="idDocument"
                    required
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          );

        case 2: // Academic / Research Information
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Academic / Research Information</h3>
              
              {/* Academic Profile */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold font-sans text-gray-200">Academic Profile</h4>
                
                <div>
                  <label htmlFor="institutionName" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Institution *
                  </label>
                  <input
                    type="text"
                    id="institutionName"
                    name="institutionName"
                    required
                    value={formData.institutionName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter institution name"
                  />
                </div>

                <div>
                  <label htmlFor="faculty" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Faculty *
                  </label>
                  <input
                    type="text"
                    id="faculty"
                    name="faculty"
                    required
                    value={formData.faculty}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter faculty/department"
                  />
                </div>

                <div>
                  <label htmlFor="currentLevel" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Current Level *
                  </label>
                  <select
                    id="currentLevel"
                    name="currentLevel"
                    required
                    value={formData.currentLevel}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select Current Level</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate (Masters)">Postgraduate (Masters)</option>
                    <option value="Postgraduate (PhD)">Postgraduate (PhD)</option>
                    <option value="Researcher">Researcher</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="studentResearcherId" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Student/Researcher ID *
                    </label>
                    <input
                      type="text"
                      id="studentResearcherId"
                      name="studentResearcherId"
                      required
                      value={formData.studentResearcherId}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter student/researcher ID"
                    />
                  </div>
                  <div>
                    <label htmlFor="yearOfEntry" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Year of Entry *
                    </label>
                    <input
                      type="number"
                      id="yearOfEntry"
                      name="yearOfEntry"
                      required
                      value={formData.yearOfEntry}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="YYYY"
                      min="1900"
                      max="2100"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="expectedCompletionYear" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Expected Completion Year *
                  </label>
                  <input
                    type="number"
                    id="expectedCompletionYear"
                    name="expectedCompletionYear"
                    required
                    value={formData.expectedCompletionYear}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="YYYY"
                    min="1900"
                    max="2100"
                  />
                </div>
              </div>

              {/* Research Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold font-sans text-gray-200">Research Information</h4>
                
                <div>
                  <label htmlFor="areaOfStudy" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Area of Study *
                  </label>
                  <input
                    type="text"
                    id="areaOfStudy"
                    name="areaOfStudy"
                    required
                    value={formData.areaOfStudy}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter area of study"
                  />
                </div>

                <div>
                  <label htmlFor="researchTopic" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Research Topic (Optional)
                  </label>
                  <textarea
                    id="researchTopic"
                    name="researchTopic"
                    value={formData.researchTopic}
                    onChange={handleInputChange}
                    className="input-field"
                    rows={3}
                    placeholder="Enter research topic (optional)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="supervisorName" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Supervisor Name (Optional)
                    </label>
                    <input
                      type="text"
                      id="supervisorName"
                      name="supervisorName"
                      value={formData.supervisorName}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter supervisor name"
                    />
                  </div>
                  <div>
                    <label htmlFor="supervisorEmail" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Supervisor Email (Optional)
                    </label>
                    <input
                      type="email"
                      id="supervisorEmail"
                      name="supervisorEmail"
                      value={formData.supervisorEmail}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter supervisor email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="supportingDocument" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Supporting Document (Optional)
                  </label>
                  <input
                    type="file"
                    id="supportingDocument"
                    name="supportingDocument"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Optional Professional Links */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold font-sans text-gray-200">Optional Professional Links</h4>
                
                <div>
                  <label htmlFor="googleScholar" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Google Scholar Profile (Optional)
                  </label>
                  <input
                    type="url"
                    id="googleScholar"
                    name="googleScholar"
                    value={formData.googleScholar}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter Google Scholar profile URL"
                  />
                </div>

                <div>
                  <label htmlFor="researchGate" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    ResearchGate Profile (Optional)
                  </label>
                  <input
                    type="url"
                    id="researchGate"
                    name="researchGate"
                    value={formData.researchGate}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter ResearchGate profile URL"
                  />
                </div>

                <div>
                  <label htmlFor="linkedinProfile" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    LinkedIn Profile (Optional)
                  </label>
                  <input
                    type="url"
                    id="linkedinProfile"
                    name="linkedinProfile"
                    value={formData.linkedinProfile}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter LinkedIn profile URL"
                  />
                </div>
              </div>
            </div>
          );

        case 3: // Security & Terms
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Security & Terms</h3>
              
              {/* Account Security */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold font-sans text-gray-200">Account Security</h4>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter password"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              {/* Terms & Confirmation */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold font-sans text-gray-200">Terms & Confirmation</h4>
                
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    required
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-1 mr-2"
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-gray-300 font-serif">
                    I agree to the Terms and Conditions *
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreeToAccuracy"
                    name="agreeToAccuracy"
                    required
                    checked={formData.agreeToAccuracy}
                    onChange={handleInputChange}
                    className="mt-1 mr-2"
                  />
                  <label htmlFor="agreeToAccuracy" className="text-sm text-gray-300 font-serif">
                    I confirm that all information provided is accurate *
                  </label>
                </div>
              </div>
            </div>
          );

        default:
          return null;
      }
    }

    // Producer/Farmer Registration Form (7 steps)
    if (currentRole.id === 'producer') {
      switch (currentStep) {
        case 1: // Personal Information
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Personal Information</h3>
              
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    required
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter email address (optional)"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Residential Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter residential address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>
          );

        case 2: // Farm / Business Details
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Farm / Business Details</h3>
              
              <div>
                <label htmlFor="farmBusinessName" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Farm/Business Name *
                </label>
                <input
                  type="text"
                  id="farmBusinessName"
                  name="farmBusinessName"
                  required
                  value={formData.farmBusinessName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter farm/business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Type of Farmer * (Select all that apply)
                </label>
                <div className="space-y-2">
                  {['Crop', 'Livestock', 'Mixed'].map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`typeOfFarmer-${type}`}
                        checked={formData.typeOfFarmer.includes(type)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData(prev => ({
                            ...prev,
                            typeOfFarmer: checked
                              ? [...prev.typeOfFarmer, type]
                              : prev.typeOfFarmer.filter(t => t !== type)
                          }));
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`typeOfFarmer-${type}`} className="text-sm text-gray-300 font-serif">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="farmAddress" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Farm Address *
                </label>
                <input
                  type="text"
                  id="farmAddress"
                  name="farmAddress"
                  required
                  value={formData.farmAddress}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter farm address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="farmSize" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Farm Size (in hectares) *
                  </label>
                  <input
                    type="number"
                    id="farmSize"
                    name="farmSize"
                    required
                    value={formData.farmSize}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter farm size"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label htmlFor="yearsOfExperience" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    required
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter years of experience"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="primarySourceOfIncome" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Is farming your primary source of income? *
                </label>
                <select
                  id="primarySourceOfIncome"
                  name="primarySourceOfIncome"
                  required
                  value={formData.primarySourceOfIncome}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label htmlFor="farmerAssociation" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Farmer Association/Cooperative (Optional)
                </label>
                <input
                  type="text"
                  id="farmerAssociation"
                  name="farmerAssociation"
                  value={formData.farmerAssociation}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter association/cooperative name (optional)"
                />
              </div>
            </div>
          );

        case 3: // Type of Produce
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Type of Produce</h3>
              
              <div>
                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Crops (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Maize', 'Rice', 'Wheat', 'Cassava', 'Yam', 'Potato', 'Tomato', 'Pepper', 'Onion', 'Beans', 'Groundnut', 'Soybean', 'Cotton', 'Cocoa', 'Coffee', 'Other'].map((crop) => (
                    <div key={crop} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`crop-${crop}`}
                        checked={formData.crops.includes(crop)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData(prev => ({
                            ...prev,
                            crops: checked
                              ? [...prev.crops, crop]
                              : prev.crops.filter(c => c !== crop)
                          }));
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`crop-${crop}`} className="text-sm text-gray-300 font-serif">
                        {crop}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Livestock (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Cattle', 'Goat', 'Sheep', 'Poultry', 'Pig', 'Fish', 'Rabbit', 'Other'].map((animal) => (
                    <div key={animal} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`livestock-${animal}`}
                        checked={formData.livestock.includes(animal)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData(prev => ({
                            ...prev,
                            livestock: checked
                              ? [...prev.livestock, animal]
                              : prev.livestock.filter(l => l !== animal)
                          }));
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`livestock-${animal}`} className="text-sm text-gray-300 font-serif">
                        {animal}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="hasProcessingValueAddition" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Do you engage in Processing/Value Addition? *
                </label>
                <select
                  id="hasProcessingValueAddition"
                  name="hasProcessingValueAddition"
                  required
                  value={formData.hasProcessingValueAddition}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {formData.hasProcessingValueAddition === 'Yes' && (
                <div>
                  <label htmlFor="processingValueAdditionDetails" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Specify Processing/Value Addition Activities *
                  </label>
                  <textarea
                    id="processingValueAdditionDetails"
                    name="processingValueAdditionDetails"
                    required
                    value={formData.processingValueAdditionDetails}
                    onChange={handleInputChange}
                    className="input-field"
                    rows={3}
                    placeholder="Describe your processing/value addition activities"
                  />
                </div>
              )}
            </div>
          );

        case 4: // Production Capacity & Market
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Production Capacity & Market</h3>
              
              <div>
                <label htmlFor="totalAnnualProduction" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Total Annual Production *
                </label>
                <input
                  type="text"
                  id="totalAnnualProduction"
                  name="totalAnnualProduction"
                  required
                  value={formData.totalAnnualProduction}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., 500 tons, 1000 bags, etc."
                />
              </div>

              <div>
                <label htmlFor="primaryMarket" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Primary Market *
                </label>
                <select
                  id="primaryMarket"
                  name="primaryMarket"
                  required
                  value={formData.primaryMarket}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select Primary Market</option>
                  <option value="Local">Local</option>
                  <option value="Regional">Regional</option>
                  <option value="National">National</option>
                  <option value="Export">Export</option>
                </select>
              </div>

              <div>
                <label htmlFor="majorBuyers" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Major Buyers (Optional)
                </label>
                <textarea
                  id="majorBuyers"
                  name="majorBuyers"
                  value={formData.majorBuyers}
                  onChange={handleInputChange}
                  className="input-field"
                  rows={3}
                  placeholder="List your major buyers (optional)"
                />
              </div>

              <div>
                <label htmlFor="challengesFaced" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Challenges Faced (Optional)
                </label>
                <textarea
                  id="challengesFaced"
                  name="challengesFaced"
                  value={formData.challengesFaced}
                  onChange={handleInputChange}
                  className="input-field"
                  rows={3}
                  placeholder="Describe challenges you face (optional)"
                />
              </div>
            </div>
          );

        case 5: // Verification & Documents
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Verification & Documents</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="idType" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    ID Type *
                  </label>
                  <select
                    id="idType"
                    name="idType"
                    required
                    value={formData.idType}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select ID Type</option>
                    <option value="National ID">National ID</option>
                    <option value="Passport">Passport</option>
                    <option value="Driver's License">Driver's License</option>
                    <option value="Voter's Card">Voter's Card</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="idNumber" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    ID Number *
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    required
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter ID number"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="idDocument" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Upload ID Document *
                </label>
                <input
                  type="file"
                  id="idDocument"
                  name="idDocument"
                  required
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="farmImages" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Upload Farm Images (Optional)
                </label>
                <input
                  type="file"
                  id="farmImages"
                  name="farmImages"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png"
                  multiple
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="certification" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Upload Any Certification (Optional)
                </label>
                <input
                  type="file"
                  id="certification"
                  name="certification"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="input-field"
                />
              </div>
            </div>
          );

        case 6: // Banking & Payment Details
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Banking & Payment Details</h3>
              
              <div>
                <label htmlFor="preferredPaymentMethod" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Preferred Payment Method *
                </label>
                <select
                  id="preferredPaymentMethod"
                  name="preferredPaymentMethod"
                  required
                  value={formData.preferredPaymentMethod}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select Payment Method</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Mobile Money">Mobile Money</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="bankName" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Bank Name *
                </label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  required
                  value={formData.bankName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter bank name"
                />
              </div>

              <div>
                <label htmlFor="accountName" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Account Name *
                </label>
                <input
                  type="text"
                  id="accountName"
                  name="accountName"
                  required
                  value={formData.accountName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter account name"
                />
              </div>

              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  required
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter account number"
                />
              </div>
            </div>
          );

        case 7: // Security & Terms
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Security & Terms</h3>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Create Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Confirm password"
                />
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 mr-2"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-300 font-serif">
                  I agree to the Terms & Conditions *
                </label>
              </div>
            </div>
          );

        default:
          return null;
      }
    }

    // Default form rendering for other roles
    if (activeTypeTab === 'individual') {
      // Contact Info tab
      switch (currentStep) {
        case 1: // Personal Details
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Personal Details</h3>
              
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="position" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Position / Role in Organization *
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  required
                  value={formData.position}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your position/role"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    required
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          );

        case 2: // Contact Information
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Contact Information</h3>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter WhatsApp number"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Residential / Office Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>
          );

        case 3: // Verification & Emergency
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Verification & Emergency</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="idType" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    ID Type *
                  </label>
                  <select
                    id="idType"
                    name="idType"
                    required
                    value={formData.idType}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select ID Type</option>
                    <option value="National ID">National ID</option>
                    <option value="Passport">Passport</option>
                    <option value="Driver's License">Driver's License</option>
                    <option value="Voter's Card">Voter's Card</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="idNumber" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    ID Number *
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    required
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter ID number"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="idDocument" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Upload ID Document *
                </label>
                <input
                  type="file"
                  id="idDocument"
                  name="idDocument"
                  required
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="emergencyContactName" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Emergency Contact Name *
                </label>
                <input
                  type="text"
                  id="emergencyContactName"
                  name="emergencyContactName"
                  required
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter emergency contact name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="emergencyContactPhone" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Emergency Contact Phone *
                  </label>
                  <input
                    type="tel"
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    required
                    value={formData.emergencyContactPhone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter emergency contact phone"
                  />
                </div>
                <div>
                  <label htmlFor="emergencyRelationship" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Relationship with Emergency Contact *
                  </label>
                  <input
                    type="text"
                    id="emergencyRelationship"
                    name="emergencyRelationship"
                    required
                    value={formData.emergencyRelationship}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Spouse, Parent, Sibling"
                  />
                </div>
              </div>
            </div>
          );

        default:
          return null;
      }
    } else {
      // Organization Info tab
      switch (currentStep) {
        case 1: // Basic Information
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Basic Information</h3>
              
              <div>
                <label htmlFor="organizationName" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  id="organizationName"
                  name="organizationName"
                  required
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter organization name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="registrationNumber" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Registration Number / CAC Number *
                  </label>
                  <input
                    type="text"
                    id="registrationNumber"
                    name="registrationNumber"
                    required
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter registration/CAC number"
                  />
                </div>
                <div>
                  <label htmlFor="organizationType" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Type of Organization *
                  </label>
                  <select
                    id="organizationType"
                    name="organizationType"
                    required
                    value={formData.organizationType}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select Type</option>
                    <option value="NGO">NGO</option>
                    <option value="Company">Company</option>
                    <option value="Institution">Institution</option>
                    <option value="Government Agency">Government Agency</option>
                    <option value="Cooperative">Cooperative</option>
                    <option value="Foundation">Foundation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="yearEstablished" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Year Established *
                  </label>
                  <input
                    type="number"
                    id="yearEstablished"
                    name="yearEstablished"
                    required
                    value={formData.yearEstablished}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter year"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Industry / Sector *
                  </label>
                  <input
                    type="text"
                    id="industry"
                    name="industry"
                    required
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter industry/sector"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="missionStatement" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Short Description / Mission Statement *
                </label>
                <textarea
                  id="missionStatement"
                  name="missionStatement"
                  required
                  value={formData.missionStatement}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-field"
                  placeholder="Enter mission statement or description"
                />
              </div>
            </div>
          );

        case 2: // Address & Contact Info
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Address & Contact Info</h3>
              
              <div>
                <label htmlFor="headquartersAddress" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Headquarters Address *
                </label>
                <input
                  type="text"
                  id="headquartersAddress"
                  name="headquartersAddress"
                  required
                  value={formData.headquartersAddress}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter headquarters address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="hqCity" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="hqCity"
                    name="hqCity"
                    required
                    value={formData.hqCity}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label htmlFor="hqState" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    id="hqState"
                    name="hqState"
                    required
                    value={formData.hqState}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label htmlFor="hqCountry" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    id="hqCountry"
                    name="hqCountry"
                    required
                    value={formData.hqCountry}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter country"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="officePhone" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Office Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="officePhone"
                    name="officePhone"
                    required
                    value={formData.officePhone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter office phone"
                  />
                </div>
                <div>
                  <label htmlFor="officialEmail" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Official Email Address *
                  </label>
                  <input
                    type="email"
                    id="officialEmail"
                    name="officialEmail"
                    required
                    value={formData.officialEmail}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter official email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Website URL (if any)
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter website URL"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="facebook" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Facebook
                  </label>
                  <input
                    type="text"
                    id="facebook"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter Facebook handle"
                  />
                </div>
                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter LinkedIn handle"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    X (Twitter)
                  </label>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter X handle"
                  />
                </div>
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter Instagram handle"
                  />
                </div>
              </div>
            </div>
          );

        case 3: // Operations & Documentation
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Operations & Documentation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="numEmployees" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Number of Employees / Volunteers *
                  </label>
                  <input
                    type="number"
                    id="numEmployees"
                    name="numEmployees"
                    required
                    value={formData.numEmployees}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter number"
                    min="1"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium font-sans text-gray-300">
                      Areas of Operation / Coverage <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleSelectAllAreas}
                      className="text-xs text-accent-400 hover:text-accent-300 font-semibold transition-colors"
                    >
                      {formData.areasOfOperation.length === NIGERIAN_STATES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  <div className="mt-3 bg-primary-700/60 border border-primary-600 rounded-md p-3">
                    <div className="max-h-56 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {NIGERIAN_STATES.map((state) => {
                        const isChecked = formData.areasOfOperation.includes(state);
                        return (
                          <label
                            key={state}
                            className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm ${
                              isChecked ? 'bg-primary-600/70 text-white' : 'text-gray-300 hover:bg-primary-600/40'
                            } transition-colors`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleAreaToggle(state)}
                              className="h-4 w-4 rounded border-primary-500 text-accent-500 focus:ring-accent-500"
                            />
                            <span className="font-sans">{state}</span>
                          </label>
                        );
                      })}
                    </div>
                    {formData.areasOfOperation.length > 0 ? (
                      <p className="mt-3 text-xs text-gray-400 font-serif">
                        Selected: {formData.areasOfOperation.length}{' '}
                        {formData.areasOfOperation.length === 1 ? 'state' : 'states'}
                      </p>
                    ) : (
                      <p className="mt-3 text-xs text-red-400 font-serif">Select at least one state.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="organizationLogo" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Upload Organization Logo
                  </label>
                  <input
                    type="file"
                    id="organizationLogo"
                    name="organizationLogo"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png"
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="certificateOfIncorporation" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Upload Certificate of Incorporation or Registration *
                  </label>
                  <input
                    type="file"
                    id="certificateOfIncorporation"
                    name="certificateOfIncorporation"
                    required
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="hasPartnership" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Any Partnership or Affiliation *
                </label>
                <select
                  id="hasPartnership"
                  name="hasPartnership"
                  required
                  value={formData.hasPartnership}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {formData.hasPartnership === 'Yes' && (
                <div>
                  <label htmlFor="partnershipDetails" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Partnership Details *
                  </label>
                  <textarea
                    id="partnershipDetails"
                    name="partnershipDetails"
                    required={formData.hasPartnership === 'Yes'}
                    value={formData.partnershipDetails}
                    onChange={handleInputChange}
                    rows={3}
                    className="input-field"
                    placeholder="Specify partnership or affiliation details"
                  />
                </div>
              )}
            </div>
          );

        case 4: // Security & Terms
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Security & Terms</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Create password"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <div className="flex items-start">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-primary-600 bg-primary-700 rounded mt-1"
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-300 font-serif">
                  I hereby agree that the information given is true, accurate and complete as of the date of this application submission. *
                </label>
              </div>
            </div>
          );

        default:
          return null;
      }
    }
  };

  return (
    <div className="min-h-screen bg-primary-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src={`${process.env.PUBLIC_URL}/images/logo/LOGO.svg`} 
              alt="AFCF Logo" 
              className="h-12 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold font-sans text-gray-100 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-300 font-serif">
            Choose your role and register for the AFCF platform
          </p>
        </div>

        {/* Role Tabs */}
        <div className="mb-8">
          <div className="bg-primary-800 rounded-lg p-2">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {roles.map((role, index) => (
                <button
                  key={role.id}
                  onClick={() => {
                    setActiveTab(index);
                    setCurrentStep(1);
                    if (role.registrationTypes.length === 1) {
                      setActiveTypeTab(role.registrationTypes[0] as 'individual' | 'company');
                    } else {
                      setActiveTypeTab('individual');
                    }
                    // Reset form data when switching roles to ensure data isolation
                    setFormData(getInitialFormData());
                  }}
                  className={`p-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === index
                      ? 'bg-primary-500 text-white'
                      : 'bg-primary-700 text-gray-300 hover:bg-primary-600 hover:text-white'
                  }`}
                >
                  <div className="text-lg mb-1">{role.icon}</div>
                  <div className="text-sm font-medium font-sans">{role.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Registration Type Tabs */}
        {hasMultipleRegistrationTypes() && (
          <div className="mb-8">
            <div className="bg-primary-800 rounded-lg p-2 max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-2">
                {getAvailableRegistrationTypes().map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setActiveTypeTab(type as 'individual' | 'company');
                      setCurrentStep(1);
                    }}
                    className={`p-3 rounded-lg text-center transition-all duration-200 ${
                      activeTypeTab === type
                        ? 'bg-primary-500 text-white'
                        : 'bg-primary-700 text-gray-300 hover:bg-primary-600 hover:text-white'
                    }`}
                  >
                    <div className="font-medium font-sans">
                      {type === 'individual' ? 'Contact Info' : 'Organization Info'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium font-sans text-gray-300">
                  Step {currentStep} of {getTotalSteps()}
                </span>
                <span className="text-sm font-medium font-sans text-gray-300">
                  {Math.round((currentStep / getTotalSteps()) * 100)}%
                </span>
              </div>
              <div className="w-full bg-primary-800 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / getTotalSteps()) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <form onSubmit={handleSubmit}>
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-primary-700">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`btn-secondary ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Previous
                </button>
                
                <div className="flex space-x-4">
                  {(() => {
                    const currentRole = getCurrentRole();
                    const isLastStepOfIndividualTab = hasMultipleRegistrationTypes() && activeTypeTab === 'individual' && currentStep === 3 && currentRole.id !== 'researcher' && currentRole.id !== 'producer';
                    const shouldShowProceedButton = isLastStepOfIndividualTab;
                    const shouldShowSubmitButton = currentStep >= getTotalSteps() && !shouldShowProceedButton;
                    
                    if (shouldShowProceedButton) {
                      return (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTypeTab('company');
                            setCurrentStep(1);
                          }}
                          className="btn-primary"
                        >
                          Proceed to Organization Info
                        </button>
                      );
                    }
                    
                    if (shouldShowSubmitButton) {
                      return (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isSubmitting ? 'Creating Account...' : `Register as ${getCurrentRole().name}`}
                        </button>
                      );
                    }
                    
                    return (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn-primary"
                      >
                        Next
                      </button>
                    );
                  })()}
                </div>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-300 font-serif">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-accent-400 hover:text-accent-300 transition-colors duration-200"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
