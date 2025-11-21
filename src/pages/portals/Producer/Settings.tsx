import React, { useEffect, useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { showNotification } from '../../../utils/quickActions';
import { useNotifications } from '../../../context/NotificationContext';
import {
  findProducerById,
  ProducerFormData,
  ProducerStatus,
  buildProducerApplicationData,
  updateProducerRecord,
  ProducerRecord,
} from '../../../utils/localDatabase';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'personal' | 'farm' | 'produce' | 'market' | 'verification' | 'banking' | 'security'>('personal');
  
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    fullName: '',
    gender: '',
    birthDate: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: '',
    
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
    idType: '',
    idNumber: '',
    idDocument: '',
    farmImages: '',
    certification: '',
    
    // Step 6: Banking & Payment Details
    preferredPaymentMethod: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    
    // Step 7: Security
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [recordId, setRecordId] = useState<string | null>(null);
  const [status, setStatus] = useState<ProducerStatus>('unverified');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [isLoadingRecord, setIsLoadingRecord] = useState(true);
  const { addNotification } = useNotifications();

  const isVerified = status === 'verified';
  const awaitingApproval = status === 'unverified' && !rejectionReason;

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/producer' },
    { id: 'scheme-application', name: 'Schemes Application', icon: '📝', href: '/portal/producer/scheme-application' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/producer/settings' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const field = (e.target as HTMLInputElement).name;
      setFormData(prev => ({ ...prev, [field]: file.name }));
    }
  };

  const handleTypeOfFarmerToggle = (type: string) => {
    if (isVerified) return;
    setFormData(prev => {
      const exists = prev.typeOfFarmer.includes(type);
      const updated = exists
        ? prev.typeOfFarmer.filter(t => t !== type)
        : [...prev.typeOfFarmer, type];
      return {
        ...prev,
        typeOfFarmer: updated,
      };
    });
  };

  const handleCropToggle = (crop: string) => {
    if (isVerified) return;
    setFormData(prev => {
      const exists = prev.crops.includes(crop);
      const updated = exists
        ? prev.crops.filter(c => c !== crop)
        : [...prev.crops, crop];
      return {
        ...prev,
        crops: updated,
      };
    });
  };

  const handleLivestockToggle = (animal: string) => {
    if (isVerified) return;
    setFormData(prev => {
      const exists = prev.livestock.includes(animal);
      const updated = exists
        ? prev.livestock.filter(l => l !== animal)
        : [...prev.livestock, animal];
      return {
        ...prev,
        livestock: updated,
      };
    });
  };

  const populateFormFromRecord = (record: ProducerRecord) => {
    const data = record.formData;
    setFormData(prev => ({
      ...prev,
      fullName: data.fullName || '',
      gender: data.gender || '',
      birthDate: data.birthDate || '',
      phone: data.phone || '',
      email: data.email || '',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      country: data.country || '',
      farmBusinessName: data.farmBusinessName || '',
      typeOfFarmer: Array.isArray(data.typeOfFarmer) ? data.typeOfFarmer : [],
      farmAddress: data.farmAddress || '',
      farmSize: data.farmSize || '',
      yearsOfExperience: data.yearsOfExperience || '',
      primarySourceOfIncome: data.primarySourceOfIncome || '',
      farmerAssociation: data.farmerAssociation || '',
      crops: Array.isArray(data.crops) ? data.crops : [],
      livestock: Array.isArray(data.livestock) ? data.livestock : [],
      hasProcessingValueAddition: data.hasProcessingValueAddition || '',
      processingValueAdditionDetails: data.processingValueAdditionDetails || '',
      totalAnnualProduction: data.totalAnnualProduction || '',
      primaryMarket: data.primaryMarket || '',
      majorBuyers: data.majorBuyers || '',
      challengesFaced: data.challengesFaced || '',
      idType: data.idType || '',
      idNumber: data.idNumber || '',
      idDocument: data.idDocumentName || '',
      farmImages: data.farmImagesName || '',
      certification: data.certificationName || '',
      preferredPaymentMethod: data.preferredPaymentMethod || '',
      bankName: data.bankName || '',
      accountName: data.accountName || '',
      accountNumber: data.accountNumber || '',
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
        if (!session || session.role !== 'Producer/Farmer') {
          setIsLoadingRecord(false);
          return;
        }

        if (!session.id) {
          setIsLoadingRecord(false);
          return;
        }

        if (session.status) {
          setStatus(session.status as ProducerStatus);
        }

        const record = findProducerById(session.id);
        if (record) {
          setRecordId(record.id);
          setStatus(record.status);
          setRejectionReason(record.rejectionReason || null);
          populateFormFromRecord(record);
        } else {
          setRecordId(null);
        }
      } catch (error) {
        console.error('Failed to load producer registration', error);
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
      showNotification('No registration record found. Please complete the Producer/Farmer registration first.', 'error');
      return;
    }

    if (formData.typeOfFarmer.length === 0) {
      showNotification('Select at least one type of farmer before submitting.', 'error');
      return;
    }

    if (formData.hasProcessingValueAddition === 'Yes' && !formData.processingValueAdditionDetails) {
      showNotification('Please specify processing/value addition activities.', 'error');
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
      idDocumentName: formData.idDocument.trim() || undefined,
      farmImagesName: formData.farmImages.trim() || undefined,
      certificationName: formData.certification.trim() || undefined,
      preferredPaymentMethod: formData.preferredPaymentMethod,
      bankName: formData.bankName.trim(),
      accountName: formData.accountName.trim(),
      accountNumber: formData.accountNumber.trim(),
      password: '',
    };

    const applicationData = buildProducerApplicationData(storedFormData);

    const notificationId = addNotification({
      role: '🌾 Producer/Farmer',
      targetRole: 'coordinating-agency',
      message: `${storedFormData.fullName} updated their Producer/Farmer details for review.`,
      applicantName: storedFormData.fullName,
      applicantType: 'Individual',
      fullAddress: `${storedFormData.address}, ${storedFormData.city}, ${storedFormData.state}, ${storedFormData.country}`,
      contactPersonName: storedFormData.fullName,
      contactPersonEmail: storedFormData.email || 'Not provided',
      contactPersonPhone: storedFormData.phone,
      applicationData,
      metadata: {
        type: 'producerRegistration',
        producerId: recordId,
        email: storedFormData.email || '',
        requiresDecision: true,
      },
    });

    const updatedRecord = updateProducerRecord(recordId, {
      formData: storedFormData,
      status: 'unverified',
      rejectionReason: undefined,
      lastSubmittedAt: new Date().toISOString(),
      pendingNotificationId: notificationId,
      email: storedFormData.email || storedFormData.phone,
    } as Partial<Omit<ProducerRecord, 'id'>>);

    setStatus('unverified');
    setRejectionReason(null);

    if (updatedRecord) {
      populateFormFromRecord(updatedRecord);
    }

    showNotification('Your updates have been sent to the Coordinating Agency for approval.', 'success');
  };

  return (
    <PortalLayout 
      role="Producer/Farmer" 
      roleIcon="🌾" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="bg-primary-800 border border-primary-700 rounded-lg p-4">
          <p className="text-sm font-semibold font-sans text-gray-100">
            Verification Status:{' '}
            <span className={isVerified ? 'text-green-400' : 'text-red-400'}>
              {isVerified ? 'Verified 🟢' : 'Unverified 🔴'}
            </span>
          </p>
          {isLoadingRecord ? (
            <p className="text-xs text-gray-400 font-serif mt-2">Loading registration details...</p>
          ) : (
            <>
              {isVerified ? (
                <p className="text-xs text-gray-400 font-serif mt-2">
                  Your account is verified. Contact the Coordinating Agency to request changes.
                </p>
              ) : rejectionReason ? (
                <p className="text-xs text-red-400 font-serif mt-2">
                  Rejection reason: {rejectionReason}
                </p>
              ) : awaitingApproval ? (
                <p className="text-xs text-gray-400 font-serif mt-2">
                  Awaiting approval from the Coordinating Agency.
                </p>
              ) : null}
              {!recordId && (
                <p className="text-xs text-yellow-400 font-serif mt-2">
                  No registration data found. Please complete your Producer/Farmer registration.
                </p>
              )}
            </>
          )}
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-sans text-gray-100">Settings</h1>
            <p className="text-sm md:text-base text-gray-400 font-serif mt-2">Manage your account information and preferences</p>
          </div>
          <button 
            type="submit"
            form="settings-form"
            disabled={isVerified || isLoadingRecord || !recordId}
            className={`btn-primary w-full sm:w-auto justify-center ${isVerified || isLoadingRecord || !recordId ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            💾 Save Changes
          </button>
        </div>

        {/* Section Tabs */}
        <div className="bg-primary-800 rounded-lg p-2">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { id: 'personal', label: 'Personal' },
              { id: 'farm', label: 'Farm/Business' },
              { id: 'produce', label: 'Produce' },
              { id: 'market', label: 'Market' },
              { id: 'verification', label: 'Documents' },
              { id: 'banking', label: 'Banking' },
              { id: 'security', label: 'Security' },
            ].map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id as any)}
                className={`p-2 md:p-3 rounded-lg text-center transition-all duration-200 text-xs md:text-sm ${
                  activeSection === section.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-primary-700 text-gray-300 hover:bg-primary-600 hover:text-white'
                }`}
              >
                <div className="font-medium font-sans">{section.label}</div>
              </button>
            ))}
          </div>
        </div>

        <form id="settings-form" onSubmit={handleSave} className="space-y-6">
          <fieldset disabled={isVerified} className="space-y-6">
            {activeSection === 'personal' && (
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Personal Information</h3>
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
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter email address (optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Residential Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter residential address"
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
            )}

            {activeSection === 'farm' && (
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Farm / Business Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Farm/Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="farmBusinessName"
                      value={formData.farmBusinessName}
                      onChange={handleInputChange}
                      required
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
                            onChange={() => handleTypeOfFarmerToggle(type)}
                            disabled={isVerified}
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
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Farm Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="farmAddress"
                      value={formData.farmAddress}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter farm address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Farm Size (in hectares) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="farmSize"
                      value={formData.farmSize}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter farm size"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Years of Experience <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter years of experience"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Is farming your primary source of income? <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="primarySourceOfIncome"
                      value={formData.primarySourceOfIncome}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Farmer Association/Cooperative (Optional)
                    </label>
                    <input
                      type="text"
                      name="farmerAssociation"
                      value={formData.farmerAssociation}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter association/cooperative name (optional)"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'produce' && (
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Type of Produce</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Crops (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-primary-700/60 border border-primary-600 rounded-md p-3">
                      {['Maize', 'Rice', 'Wheat', 'Cassava', 'Yam', 'Potato', 'Tomato', 'Pepper', 'Onion', 'Beans', 'Groundnut', 'Soybean', 'Cotton', 'Cocoa', 'Coffee', 'Other'].map((crop) => (
                        <label
                          key={crop}
                          className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm ${
                            formData.crops.includes(crop) ? 'bg-primary-600/70 text-white' : 'text-gray-300 hover:bg-primary-600/40'
                          } transition-colors`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.crops.includes(crop)}
                            onChange={() => handleCropToggle(crop)}
                            disabled={isVerified}
                            className="h-4 w-4 rounded border-primary-500 text-accent-500 focus:ring-accent-500 disabled:opacity-50"
                          />
                          <span className="font-sans">{crop}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Livestock (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-primary-700/60 border border-primary-600 rounded-md p-3">
                      {['Cattle', 'Goat', 'Sheep', 'Poultry', 'Pig', 'Fish', 'Rabbit', 'Other'].map((animal) => (
                        <label
                          key={animal}
                          className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm ${
                            formData.livestock.includes(animal) ? 'bg-primary-600/70 text-white' : 'text-gray-300 hover:bg-primary-600/40'
                          } transition-colors`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.livestock.includes(animal)}
                            onChange={() => handleLivestockToggle(animal)}
                            disabled={isVerified}
                            className="h-4 w-4 rounded border-primary-500 text-accent-500 focus:ring-accent-500 disabled:opacity-50"
                          />
                          <span className="font-sans">{animal}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Do you engage in Processing/Value Addition? <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="hasProcessingValueAddition"
                      value={formData.hasProcessingValueAddition}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  {formData.hasProcessingValueAddition === 'Yes' && (
                    <div>
                      <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                        Specify Processing/Value Addition Activities <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="processingValueAdditionDetails"
                        value={formData.processingValueAdditionDetails}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        rows={3}
                        placeholder="Describe your processing/value addition activities"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'market' && (
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Production Capacity & Market</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Total Annual Production <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="totalAnnualProduction"
                      value={formData.totalAnnualProduction}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="e.g., 500 tons, 1000 bags, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Primary Market <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="primaryMarket"
                      value={formData.primaryMarket}
                      onChange={handleInputChange}
                      required
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
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Major Buyers (Optional)
                    </label>
                    <textarea
                      name="majorBuyers"
                      value={formData.majorBuyers}
                      onChange={handleInputChange}
                      className="input-field"
                      rows={3}
                      placeholder="List your major buyers (optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Challenges Faced (Optional)
                    </label>
                    <textarea
                      name="challengesFaced"
                      value={formData.challengesFaced}
                      onChange={handleInputChange}
                      className="input-field"
                      rows={3}
                      placeholder="Describe challenges you face (optional)"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'verification' && (
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Verification & Documents</h3>
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
                      <option value="Other">Other</option>
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
                      Upload Farm Images (Optional)
                    </label>
                    <input
                      type="file"
                      name="farmImages"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png"
                      multiple
                      className="input-field"
                    />
                    {formData.farmImages && (
                      <p className="text-sm text-gray-400 font-serif mt-2">Current: {formData.farmImages}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Upload Any Certification (Optional)
                    </label>
                    <input
                      type="file"
                      name="certification"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="input-field"
                    />
                    {formData.certification && (
                      <p className="text-sm text-gray-400 font-serif mt-2">Current: {formData.certification}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'banking' && (
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Banking & Payment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Preferred Payment Method <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="preferredPaymentMethod"
                      value={formData.preferredPaymentMethod}
                      onChange={handleInputChange}
                      required
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
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter bank name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Account Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter account name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter account number"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Security & Terms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Create Password <span className="text-red-500">*</span>
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
                  <div className="md:col-span-2">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        required
                        className="mt-1 mr-2"
                      />
                      <label htmlFor="agreeToTerms" className="text-sm text-gray-300 font-serif">
                        I agree to the Terms & Conditions <span className="text-red-500">*</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </fieldset>
        </form>
        
        <div className="mt-2 text-center text-xs text-gray-400 font-serif opacity-80">
          Powered by Mc. George
        </div>
      </div>
    </PortalLayout>
  );
};

export default Settings;
