import React, { useEffect, useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { showNotification } from '../../../utils/quickActions';
import { useNotifications } from '../../../context/NotificationContext';
import {
  findPFIById,
  PFIFormData,
  PFIStatus,
  buildPFIApplicationData,
  updatePFIRecord,
  PFIRecord,
} from '../../../utils/localDatabase';
import { NIGERIAN_STATES } from '../../../constants/nigeriaStates';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'contact' | 'organization'>('contact');

  const [formData, setFormData] = useState({
    // Contact Info - Personal Details
    fullName: '',
    position: '',
    gender: '',
    birthDate: '',
    
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
    idDocument: '',
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
    organizationLogo: '',
    certificateOfIncorporation: '',
    hasPartnership: 'No',
    partnershipDetails: '',
    
    // Organization Info - Security & Terms
    password: '',
    confirmPassword: '',
    agreeToTerms: true
  });

  const [recordId, setRecordId] = useState<string | null>(null);
  const [status, setStatus] = useState<PFIStatus>('unverified');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [isLoadingRecord, setIsLoadingRecord] = useState(true);
  const { addNotification } = useNotifications();

  const isVerified = status === 'verified';
  const awaitingApproval = status === 'unverified' && !rejectionReason;

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/pfi' },
    { id: 'scheme-application', name: 'Schemes Application', icon: '📝', href: '/portal/pfi/scheme-application' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/pfi/settings' }
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
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

  const populateFormFromRecord = (record: PFIRecord) => {
    const data = record.formData;
    setFormData(prev => ({
      ...prev,
      fullName: data.fullName || '',
      position: data.position || '',
      gender: data.gender || '',
      birthDate: data.birthDate || '',
      email: data.email || '',
      phone: data.phone || '',
      whatsapp: data.whatsapp || '',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      country: data.country || '',
      idType: data.idType || '',
      idNumber: data.idNumber || '',
      idDocument: data.idDocumentName || '',
      emergencyContactName: data.emergencyContactName || '',
      emergencyContactPhone: data.emergencyContactPhone || '',
      emergencyRelationship: data.emergencyRelationship || '',
      organizationName: data.organizationName || '',
      registrationNumber: data.registrationNumber || '',
      organizationType: data.organizationType || '',
      yearEstablished: data.yearEstablished || '',
      industry: data.industry || '',
      missionStatement: data.missionStatement || '',
      headquartersAddress: data.headquartersAddress || '',
      hqCity: data.hqCity || '',
      hqState: data.hqState || '',
      hqCountry: data.hqCountry || '',
      officePhone: data.officePhone || '',
      officialEmail: data.officialEmail || '',
      website: data.website || '',
      facebook: data.facebook || '',
      linkedin: data.linkedin || '',
      twitter: data.twitter || '',
      instagram: data.instagram || '',
      numEmployees: data.numEmployees || '',
      areasOfOperation: (() => {
        const rawAreas = (data as any)?.areasOfOperation;
        if (Array.isArray(rawAreas)) {
          return rawAreas;
        }
        if (typeof rawAreas === 'string') {
          return rawAreas
            .split(',')
            .map((state: string) => state.trim())
            .filter(Boolean);
        }
        return [];
      })(),
      organizationLogo: data.organizationLogoName || '',
      certificateOfIncorporation: data.certificateOfIncorporationName || '',
      hasPartnership: data.hasPartnership || 'No',
      partnershipDetails: data.partnershipDetails || '',
      password: '',
      confirmPassword: '',
      agreeToTerms: true,
    }));
  };

  useEffect(() => {
    const loadRecord = () => {
      const rawSession = localStorage.getItem('user');
      if (!rawSession) {
        setIsLoadingRecord(false);
        return;
      }

      try {
        const session = JSON.parse(rawSession);
        if (!session || session.role !== 'Participating Bank (PFI)') {
          setIsLoadingRecord(false);
          return;
        }

        if (!session.id) {
          setIsLoadingRecord(false);
          return;
        }

        if (session.status) {
          setStatus(session.status as PFIStatus);
        }

        const record = findPFIById(session.id);
        if (record) {
          setRecordId(record.id);
          setStatus(record.status);
          setRejectionReason(record.rejectionReason || null);
          populateFormFromRecord(record);
        } else {
          setRecordId(null);
        }
      } catch (error) {
        console.error('Failed to load PFI registration', error);
      } finally {
        setIsLoadingRecord(false);
      }
    };

    loadRecord();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (isVerified) {
      showNotification('Your registration is already verified and cannot be modified.', 'info');
      return;
    }

    if (!recordId) {
      showNotification('No registration record found. Please complete the PFI registration first.', 'error');
      return;
    }

    if (formData.areasOfOperation.length === 0) {
      showNotification('Select at least one area of operation / coverage before submitting.', 'error');
      return;
    }

    const storedFormData: PFIFormData = {
      fullName: formData.fullName.trim(),
      position: formData.position.trim(),
      gender: formData.gender,
      birthDate: formData.birthDate,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      whatsapp: formData.whatsapp?.trim() || undefined,
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      country: formData.country.trim(),
      idType: formData.idType,
      idNumber: formData.idNumber.trim(),
      idDocumentName: formData.idDocument ? (formData.idDocument as any).name : undefined,
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
      officialEmail: formData.officialEmail.trim(),
      website: formData.website.trim(),
      facebook: formData.facebook?.trim() || undefined,
      linkedin: formData.linkedin?.trim() || undefined,
      twitter: formData.twitter?.trim() || undefined,
      instagram: formData.instagram?.trim() || undefined,
      numEmployees: formData.numEmployees.trim(),
      areasOfOperation: [...formData.areasOfOperation],
      organizationLogoName: formData.organizationLogo ? (formData.organizationLogo as any).name : undefined,
      certificateOfIncorporationName: formData.certificateOfIncorporation ? (formData.certificateOfIncorporation as any).name : undefined,
      hasPartnership: formData.hasPartnership,
      partnershipDetails: formData.partnershipDetails.trim(),
      password: '',
    };

    const applicationData = buildPFIApplicationData(storedFormData);

    const notificationId = addNotification({
      role: '🏦 PFI',
      targetRole: 'coordinating-agency',
      message: `${storedFormData.organizationName || storedFormData.fullName} updated their PFI details for review.`,
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
        pfiId: recordId,
        email: storedFormData.email,
        requiresDecision: true,
      },
    });

    const updatedRecord = updatePFIRecord(recordId, {
      formData: storedFormData,
      status: 'unverified',
      rejectionReason: undefined,
      lastSubmittedAt: new Date().toISOString(),
      pendingNotificationId: notificationId,
      email: storedFormData.officialEmail,
    } as Partial<Omit<PFIRecord, 'id'>>);

    setStatus('unverified');
    setRejectionReason(null);

    if (updatedRecord) {
      populateFormFromRecord(updatedRecord);
    }

    showNotification('Your updates have been sent to the Coordinating Agency for approval.', 'success');
  };

  if (isLoadingRecord) {
    return (
      <PortalLayout role="Participating Bank (PFI)" roleIcon="🏦" sidebarItems={sidebarItems}>
        <div className="card">
          <h1 className="text-lg font-semibold font-sans text-gray-100">Loading Settings</h1>
          <p className="text-sm text-gray-300 font-serif mt-2">Fetching your PFI registration details...</p>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout role="Participating Bank (PFI)" roleIcon="🏦" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        <div className="bg-primary-800 border border-primary-700 rounded-lg p-4">
          <p className="text-sm font-semibold font-sans text-gray-100">
            {isVerified ? (
              <span className="text-green-400">✓ Verified</span>
            ) : awaitingApproval ? (
              <span className="text-yellow-400">⏳ Awaiting approval from the Coordinating Agency.</span>
            ) : rejectionReason ? (
              <span className="text-red-400">✗ Registration Rejected</span>
            ) : (
              <span className="text-gray-400">Registration Status: Unverified</span>
            )}
          </p>
          {rejectionReason && (
            <p className="text-xs text-red-400 font-serif mt-2">
              Rejection Reason: {rejectionReason}
            </p>
          )}
          {awaitingApproval && (
            <p className="text-xs text-yellow-400 font-serif mt-2">
              Awaiting approval from the Coordinating Agency.
            </p>
          )}
          {!recordId && (
            <p className="text-xs text-yellow-400 font-serif mt-2">
              No registration data found. Please complete your PFI registration.
            </p>
          )}
        </div>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-sans text-gray-100">Settings</h1>
            <p className="text-sm md:text-base text-gray-400 font-serif mt-2">
              Manage your account information and preferences
            </p>
          </div>
          <button type="submit" form="settings-form" className="btn-primary w-full sm:w-auto justify-center">
            💾 Save Changes
          </button>
        </div>

        {/* Section Tabs */}
        <div className="bg-primary-800 rounded-lg p-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveSection('contact')}
              className={`p-3 rounded-lg text-center transition-all duration-200 ${
                activeSection === 'contact'
                  ? 'bg-primary-500 text-white'
                  : 'bg-primary-700 text-gray-300 hover:bg-primary-600 hover:text-white'
              }`}
            >
              <div className="font-medium font-sans">Contact Info</div>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('organization')}
              className={`p-3 rounded-lg text-center transition-all duration-200 ${
                activeSection === 'organization'
                  ? 'bg-primary-500 text-white'
                  : 'bg-primary-700 text-gray-300 hover:bg-primary-600 hover:text-white'
              }`}
            >
              <div className="font-medium font-sans">Organization Info</div>
            </button>
          </div>
        </div>

        <form id="settings-form" onSubmit={handleSave} className="space-y-6">
          {activeSection === 'contact' && (
            <>
              {/* Personal Details */}
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Position / Role in Organization <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter your position/role"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      WhatsApp (Optional)
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter WhatsApp number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Residential / Office Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter your address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter state"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </div>

              {/* Verification & Emergency */}
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Verification & Emergency</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      ID Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="idType"
                      value={formData.idType}
                      onChange={handleInputChange}
                      required
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
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      ID Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter ID number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Upload ID Document <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      name="idDocument"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="input-field"
                    />
                    {formData.idDocument && (
                      <p className="text-sm text-gray-400 font-serif mt-2">Current: {formData.idDocument}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Emergency Contact Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter emergency contact name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Emergency Contact Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter emergency contact phone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Emergency Relationship <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="emergencyRelationship"
                      value={formData.emergencyRelationship}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select Relationship</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Child">Child</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === 'organization' && (
            <>
              {/* Organization Info */}
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Organization Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Organization Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter organization name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Registration Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter registration number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Organization Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select Organization Type</option>
                      <option value="Company">Company</option>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Cooperative">Cooperative</option>
                      <option value="Government">Government</option>
                      <option value="Non-Profit">Non-Profit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Year Established <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="yearEstablished"
                      value={formData.yearEstablished}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter year established"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Industry <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter industry"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Mission Statement <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="missionStatement"
                      value={formData.missionStatement}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter mission statement"
                    />
                  </div>
                </div>
              </div>

              {/* Address & Contact Info */}
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Address & Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Headquarters Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="headquartersAddress"
                      value={formData.headquartersAddress}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter headquarters address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="hqCity"
                      value={formData.hqCity}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="hqState"
                      value={formData.hqState}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter state"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="hqCountry"
                      value={formData.hqCountry}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Office Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="officePhone"
                      value={formData.officePhone}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter office phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Official Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="officialEmail"
                      value={formData.officialEmail}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter official email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Website URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter website URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Facebook Page <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter Facebook page URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      LinkedIn Profile <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter LinkedIn profile URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Twitter Handle <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter Twitter handle"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Instagram Handle <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter Instagram handle"
                    />
                  </div>
                </div>
              </div>

              {/* Operations & Documentation */}
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Operations & Documentation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Number of Employees <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="numEmployees"
                      value={formData.numEmployees}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter number of employees"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Areas of Operation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="areasOfOperation"
                      value={formData.areasOfOperation}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter areas of operation"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Upload Certificate of Incorporation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      name="certificateOfIncorporation"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="input-field"
                    />
                    {formData.certificateOfIncorporation && (
                      <p className="text-sm text-gray-400 font-serif mt-2">Current: {formData.certificateOfIncorporation}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Has Partnership <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="hasPartnership"
                      value={formData.hasPartnership}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select Yes/No</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Partnership Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="partnershipDetails"
                      value={formData.partnershipDetails}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter partnership details"
                    />
                  </div>
                </div>
              </div>

              {/* Security & Terms */}
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Security & Terms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Confirm password"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-500 bg-primary-700 border-primary-600 rounded focus:ring-primary-500"
                    />
                    <label className="text-sm font-medium font-sans text-gray-300">
                      I agree to the terms and conditions
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}
        </form>

        {/* System Information */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">ℹ️ System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 font-serif">Account ID:</span>
                <span className="text-gray-100 font-sans">PFI-2024-001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-serif">Registration Date:</span>
                <span className="text-gray-100 font-sans">March 15, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-serif">Last Login:</span>
                <span className="text-gray-100 font-sans">Today, 2:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-serif">Account Status:</span>
                <span className="text-green-400 font-sans">Active</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 font-serif">API Version:</span>
                <span className="text-gray-100 font-sans">v2.1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-serif">Database Version:</span>
                <span className="text-gray-100 font-sans">PostgreSQL 14.2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-serif">System Uptime:</span>
                <span className="text-gray-100 font-sans">99.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-serif">Support Level:</span>
                <span className="text-blue-400 font-sans">Premium</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 text-center text-xs text-gray-400 font-serif opacity-80">
          Powered by Mc. George
        </div>
      </div>
    </PortalLayout>
  );
};

export default Settings;
