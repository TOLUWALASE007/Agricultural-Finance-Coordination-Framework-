import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NIGERIAN_STATES } from '../constants/nigeriaStates';
import { useNotifications } from '../context/NotificationContext';
import {
  registerFundProvider,
  updateFundProviderRecord,
  FundProviderFormData,
  buildFundProviderApplicationData,
} from '../utils/localDatabase';

const Register: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeTypeTab, setActiveTypeTab] = useState<'individual' | 'company'>('individual');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
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
    agreeToTerms: false
  });

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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
    // Contact Info tab has 3 steps (no Security & Terms)
    // Organization Info tab has 4 steps (includes Security & Terms)
    return activeTypeTab === 'individual' ? 3 : 4;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const currentRole = getCurrentRole();
    setIsSubmitting(true);

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

    // Default behaviour for other roles (placeholder)
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    navigate('/login');
  };

  // Render form step content
  const renderStepContent = () => {
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
                    }
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
                  {(currentStep < getTotalSteps() || (activeTypeTab === 'individual' && currentStep === 3)) ? (
                    <button
                      type="button"
                      onClick={() => {
                        // If on step 3 of Contact Info tab, switch to Organization Info tab
                        if (activeTypeTab === 'individual' && currentStep === 3) {
                          setActiveTypeTab('company');
                          setCurrentStep(1);
                        } else {
                          nextStep();
                        }
                      }}
                      className="btn-primary"
                    >
                      {activeTypeTab === 'individual' && currentStep === 3 
                        ? 'Proceed to Organization Info' 
                        : 'Next'}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Creating Account...' : `Register as ${getCurrentRole().name}`}
                    </button>
                  )}
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
