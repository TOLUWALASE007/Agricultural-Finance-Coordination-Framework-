import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeTypeTab, setActiveTypeTab] = useState<'individual' | 'company'>('individual');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Personal Details
    title: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    birthMonth: '',
    birthYear: '',
    gender: '',
    maritalStatus: '',
    email: '',
    phone: '',
    
    // Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    
    // Employment Information
    jobTitle: '',
    organization: '',
    occupation: '',
    yearsExperience: '',
    
    // Company Details
    companyName: '',
    companyId: '',
    taxId: '',
    legalStatus: '',
    fieldOfBusiness: '',
    registeredOffice: '',
    companyState: '',
    companyPostalCode: '',
    companyStreet: '',
    companyEmail: '',
    companyPhone: '',
    websiteUrl: '',
    
    // Contact Information
    contactPersonName: '',
    contactPersonTitle: '',
    contactPersonEmail: '',
    contactPersonDesignation: '',
    contactPersonPassport: '',
    
    // Security
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const roles = [
    {
      id: 'fund-provider',
      name: 'Fund Provider',
      icon: '💰',
      description: 'Financial institutions and organizations providing agricultural financing',
      registrationTypes: ['individual', 'company']
    },
    {
      id: 'coordinating-agency',
      name: 'Coordinating Agency',
      icon: '🏛️',
      description: 'Government agencies coordinating agricultural finance programs',
      registrationTypes: ['company']
    },
    {
      id: 'pfi',
      name: 'Participating Bank (PFI)',
      icon: '🏦',
      description: 'Participating Financial Institutions processing loan applications',
      registrationTypes: ['company']
    },
    {
      id: 'insurance',
      name: 'Insurance Company',
      icon: '🛡️',
      description: 'Insurance providers offering agricultural risk protection',
      registrationTypes: ['company']
    },
    {
      id: 'pmt',
      name: 'Project Management Team (PMT)',
      icon: '👥',
      description: 'Teams managing agricultural finance coordination projects',
      registrationTypes: ['company']
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
      registrationTypes: ['company']
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
      registrationTypes: ['company']
    },
    {
      id: 'de-risking',
      name: 'De-risking Institution',
      icon: '📊',
      description: 'Institutions providing risk mitigation services',
      registrationTypes: ['company']
    },
    {
      id: 'extension',
      name: 'Extension Organization',
      icon: '🌱',
      description: 'Agricultural extension and advisory service providers',
      registrationTypes: ['company']
    },
    {
      id: 'researcher',
      name: 'Researcher/Student',
      icon: '🎓',
      description: 'Academic researchers and students in agricultural finance',
      registrationTypes: ['individual']
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    if (activeTypeTab === 'individual') {
      return 4; // Personal Details, Address, Employment, Security
    } else {
      return 4; // Company Details, Registered Office, Contact Info, Security
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate registration process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    // Navigate to login or dashboard after successful registration
    navigate('/login');
  };

  // Render form step content
  const renderStepContent = () => {
    const currentRole = getCurrentRole();
    
    if (activeTypeTab === 'individual') {
      switch (currentStep) {
        case 1: // Personal Details
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Personal Details</h3>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Title
                </label>
                <select
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select Title</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Miss">Miss</option>
                  <option value="Dr">Dr</option>
                  <option value="Prof">Prof</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="birthMonth" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Birth Month *
                  </label>
                  <select
                    id="birthMonth"
                    name="birthMonth"
                    required
                    value={formData.birthMonth}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Month</option>
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', {month: 'long'})}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Day *
                  </label>
                  <select
                    id="birthDate"
                    name="birthDate"
                    required
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Day</option>
                    {Array.from({length: 31}, (_, i) => (
                      <option key={i+1} value={i+1}>{i+1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="birthYear" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Year *
                  </label>
                  <select
                    id="birthYear"
                    name="birthYear"
                    required
                    value={formData.birthYear}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Year</option>
                    {Array.from({length: 80}, (_, i) => (
                      <option key={2024-i} value={2024-i}>{2024-i}</option>
                    ))}
                  </select>
                </div>
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
                  </select>
                </div>
                <div>
                  <label htmlFor="maritalStatus" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Marital Status *
                  </label>
                  <select
                    id="maritalStatus"
                    name="maritalStatus"
                    required
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </div>
          );

        case 2: // Address
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Address</h3>
              
              <div>
                <label htmlFor="addressLine1" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  required
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter address line 1"
                />
              </div>

              <div>
                <label htmlFor="addressLine2" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter address line 2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Postal/Zip Code *
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
            </div>
          );

        case 3: // Employment Information
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Employment Information</h3>
              
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  required
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter job title"
                />
              </div>

              <div>
                <label htmlFor="organization" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Organization *
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  required
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter organization name"
                />
              </div>

              <div>
                <label htmlFor="occupation" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Occupation *
                </label>
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  required
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter occupation"
                />
              </div>

              <div>
                <label htmlFor="yearsExperience" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Years of Experience *
                </label>
                <select
                  id="yearsExperience"
                  name="yearsExperience"
                  required
                  value={formData.yearsExperience}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select Years</option>
                  <option value="0-1">0-1 years</option>
                  <option value="2-5">2-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="11-15">11-15 years</option>
                  <option value="16-20">16-20 years</option>
                  <option value="20+">20+ years</option>
                </select>
              </div>
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
    } else {
      // Company registration steps
      switch (currentStep) {
        case 1: // Company Details
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Company Details</h3>
              
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter company name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="companyId" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Company ID *
                  </label>
                  <input
                    type="text"
                    id="companyId"
                    name="companyId"
                    required
                    value={formData.companyId}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter company ID"
                  />
                </div>
                <div>
                  <label htmlFor="taxId" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Tax ID *
                  </label>
                  <input
                    type="text"
                    id="taxId"
                    name="taxId"
                    required
                    value={formData.taxId}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter tax ID"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="legalStatus" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Legal Status *
                  </label>
                  <select
                    id="legalStatus"
                    name="legalStatus"
                    required
                    value={formData.legalStatus}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select Legal Status</option>
                    <option value="Corporation">Corporation</option>
                    <option value="LLC">LLC</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                    <option value="Non-Profit">Non-Profit</option>
                    <option value="Government">Government</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="fieldOfBusiness" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Field of Business *
                  </label>
                  <input
                    type="text"
                    id="fieldOfBusiness"
                    name="fieldOfBusiness"
                    required
                    value={formData.fieldOfBusiness}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter field of business"
                  />
                </div>
              </div>
            </div>
          );

        case 2: // Registered Office
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Registered Office</h3>
              
              <div>
                <label htmlFor="registeredOffice" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Registered Office *
                </label>
                <input
                  type="text"
                  id="registeredOffice"
                  name="registeredOffice"
                  required
                  value={formData.registeredOffice}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter registered office address"
                />
              </div>

              <div>
                <label htmlFor="companyStreet" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Street *
                </label>
                <input
                  type="text"
                  id="companyStreet"
                  name="companyStreet"
                  required
                  value={formData.companyStreet}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="companyState" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    id="companyState"
                    name="companyState"
                    required
                    value={formData.companyState}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label htmlFor="companyPostalCode" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    id="companyPostalCode"
                    name="companyPostalCode"
                    required
                    value={formData.companyPostalCode}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter postal code"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="companyEmail" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Company Email *
                  </label>
                  <input
                    type="email"
                    id="companyEmail"
                    name="companyEmail"
                    required
                    value={formData.companyEmail}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter company email"
                  />
                </div>
                <div>
                  <label htmlFor="companyPhone" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Company Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="companyPhone"
                    name="companyPhone"
                    required
                    value={formData.companyPhone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter company phone"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="websiteUrl" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  id="websiteUrl"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter website URL"
                />
              </div>
            </div>
          );

        case 3: // Contact Information
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans text-gray-100 mb-6">Contact Information</h3>
              
              <div>
                <label htmlFor="contactPersonName" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  id="contactPersonName"
                  name="contactPersonName"
                  required
                  value={formData.contactPersonName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter contact person name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactPersonTitle" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Contact Person Title *
                  </label>
                  <input
                    type="text"
                    id="contactPersonTitle"
                    name="contactPersonTitle"
                    required
                    value={formData.contactPersonTitle}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter contact person title"
                  />
                </div>
                <div>
                  <label htmlFor="contactPersonDesignation" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                    Contact Person Designation *
                  </label>
                  <input
                    type="text"
                    id="contactPersonDesignation"
                    name="contactPersonDesignation"
                    required
                    value={formData.contactPersonDesignation}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter designation"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contactPersonEmail" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Contact Person Email Address *
                </label>
                <input
                  type="email"
                  id="contactPersonEmail"
                  name="contactPersonEmail"
                  required
                  value={formData.contactPersonEmail}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter contact person email"
                />
              </div>

              <div>
                <label htmlFor="contactPersonPassport" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Contact Person Passport *
                </label>
                <input
                  type="text"
                  id="contactPersonPassport"
                  name="contactPersonPassport"
                  required
                  value={formData.contactPersonPassport}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter passport number"
                />
              </div>
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
              src="/images/logo/LOGO.svg" 
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {roles.map((role, index) => (
                <button
                  key={role.id}
                  onClick={() => {
                    setActiveTab(index);
                    setCurrentStep(1);
                    // Set default registration type based on role
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

        {/* Registration Type Tabs (only show if role supports multiple types) */}
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
                    <div className="font-medium font-sans capitalize">{type}</div>
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
                  {currentStep < getTotalSteps() ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn-primary"
                    >
                      Next
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
