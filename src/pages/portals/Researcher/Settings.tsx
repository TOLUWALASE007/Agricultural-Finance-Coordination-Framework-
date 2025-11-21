import React, { useEffect, useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { showNotification } from '../../../utils/quickActions';
import { useNotifications } from '../../../context/NotificationContext';
import {
  findResearcherById,
  ResearcherFormData,
  ResearcherStatus,
  buildResearcherApplicationData,
  updateResearcherRecord,
  ResearcherRecord,
} from '../../../utils/localDatabase';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'contact' | 'academic' | 'security'>('contact');
  
  const [formData, setFormData] = useState({
    // Step 1: Contact Information
    fullName: '',
    gender: '',
    birthDate: '',
    nationality: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    state: '',
    country: '',
    idType: '',
    idNumber: '',
    idDocument: '',
    
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
    supportingDocument: '',
    googleScholar: '',
    researchGate: '',
    linkedinProfile: '',
    
    // Step 3: Security
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToAccuracy: false,
  });

  const [recordId, setRecordId] = useState<string | null>(null);
  const [status, setStatus] = useState<ResearcherStatus>('unverified');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [isLoadingRecord, setIsLoadingRecord] = useState(true);
  const { addNotification } = useNotifications();

  const isVerified = status === 'verified';
  const awaitingApproval = status === 'unverified' && !rejectionReason;

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/researcher' },
    { id: 'scheme-application', name: 'Schemes Application', icon: '📝', href: '/portal/researcher/scheme-application' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/researcher/settings' }
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

  const populateFormFromRecord = (record: ResearcherRecord) => {
    const data = record.formData;
    setFormData(prev => ({
      ...prev,
      fullName: data.fullName || '',
      gender: data.gender || '',
      birthDate: data.birthDate || '',
      nationality: data.nationality || '',
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
      institutionName: data.institutionName || '',
      faculty: data.faculty || '',
      currentLevel: data.currentLevel || '',
      studentResearcherId: data.studentResearcherId || '',
      yearOfEntry: data.yearOfEntry || '',
      expectedCompletionYear: data.expectedCompletionYear || '',
      areaOfStudy: data.areaOfStudy || '',
      researchTopic: data.researchTopic || '',
      supervisorName: data.supervisorName || '',
      supervisorEmail: data.supervisorEmail || '',
      supportingDocument: data.supportingDocumentName || '',
      googleScholar: data.googleScholar || '',
      researchGate: data.researchGate || '',
      linkedinProfile: data.linkedinProfile || '',
      password: '',
      confirmPassword: '',
      agreeToTerms: true,
      agreeToAccuracy: true,
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
        if (!session || session.role !== 'Researcher/Student') {
          setIsLoadingRecord(false);
          return;
        }

        if (!session.id) {
          setIsLoadingRecord(false);
          return;
        }

        if (session.status) {
          setStatus(session.status as ResearcherStatus);
        }

        const record = findResearcherById(session.id);
        if (record) {
          setRecordId(record.id);
          setStatus(record.status);
          setRejectionReason(record.rejectionReason || null);
          populateFormFromRecord(record);
        } else {
          setRecordId(null);
        }
      } catch (error) {
        console.error('Failed to load researcher registration', error);
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
      showNotification('No registration record found. Please complete the Researcher/Student registration first.', 'error');
      return;
    }

    const storedFormData: ResearcherFormData = {
      fullName: formData.fullName.trim(),
      gender: formData.gender,
      birthDate: formData.birthDate,
      nationality: formData.nationality.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      whatsapp: formData.whatsapp.trim() || undefined,
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      country: formData.country.trim(),
      idType: formData.idType,
      idNumber: formData.idNumber.trim(),
      idDocumentName: formData.idDocument.trim() || undefined,
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
      supportingDocumentName: formData.supportingDocument.trim() || undefined,
      googleScholar: formData.googleScholar.trim() || undefined,
      researchGate: formData.researchGate.trim() || undefined,
      linkedinProfile: formData.linkedinProfile.trim() || undefined,
      password: '',
    };

    const applicationData = buildResearcherApplicationData(storedFormData);

    const notificationId = addNotification({
      role: '🎓 Researcher/Student',
      targetRole: 'coordinating-agency',
      message: `${storedFormData.fullName} updated their Researcher/Student details for review.`,
      applicantName: storedFormData.fullName,
      applicantType: 'Individual',
      fullAddress: `${storedFormData.address}, ${storedFormData.city}, ${storedFormData.state}, ${storedFormData.country}`,
      contactPersonName: storedFormData.fullName,
      contactPersonEmail: storedFormData.email,
      contactPersonPhone: storedFormData.phone,
      applicationData,
      metadata: {
        type: 'researcherRegistration',
        researcherId: recordId,
        email: storedFormData.email,
        requiresDecision: true,
      },
    });

    const updatedRecord = updateResearcherRecord(recordId, {
      formData: storedFormData,
      status: 'unverified',
      rejectionReason: undefined,
      lastSubmittedAt: new Date().toISOString(),
      pendingNotificationId: notificationId,
      email: storedFormData.email,
    } as Partial<Omit<ResearcherRecord, 'id'>>);

    setStatus('unverified');
    setRejectionReason(null);

    if (updatedRecord) {
      populateFormFromRecord(updatedRecord);
    }

    showNotification('Your updates have been sent to the Coordinating Agency for approval.', 'success');
  };

  return (
    <PortalLayout 
      role="Researcher/Student" 
      roleIcon="🎓" 
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
                  No registration data found. Please complete your Researcher/Student registration.
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
          <div className="grid grid-cols-3 gap-2">
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
              onClick={() => setActiveSection('academic')}
              className={`p-3 rounded-lg text-center transition-all duration-200 ${
                activeSection === 'academic'
                  ? 'bg-primary-500 text-white'
                  : 'bg-primary-700 text-gray-300 hover:bg-primary-600 hover:text-white'
              }`}
            >
              <div className="font-medium font-sans">Academic / Research</div>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('security')}
              className={`p-3 rounded-lg text-center transition-all duration-200 ${
                activeSection === 'security'
                  ? 'bg-primary-500 text-white'
                  : 'bg-primary-700 text-gray-300 hover:bg-primary-600 hover:text-white'
              }`}
            >
              <div className="font-medium font-sans">Security</div>
            </button>
          </div>
        </div>

        <form id="settings-form" onSubmit={handleSave} className="space-y-6">
          <fieldset disabled={isVerified} className="space-y-6">
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
                        Nationality <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="Enter your nationality"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="card">
                  <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                        Email <span className="text-red-500">*</span>
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
                        Phone <span className="text-red-500">*</span>
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
                        Residential Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="Enter your residential address"
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
                        State/Province <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="Enter state/province"
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

                {/* Identity Verification */}
                <div className="card">
                  <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Identity Verification</h3>
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
                        <option value="Student ID">Student ID</option>
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
                  </div>
                </div>
              </>
            )}

            {activeSection === 'academic' && (
              <>
                {/* Academic Profile */}
                <div className="card">
                  <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Academic Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                        Institution <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="institutionName"
                        value={formData.institutionName}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="Enter institution name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                        Faculty <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="faculty"
                        value={formData.faculty}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="Enter faculty/department"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                        Current Level <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="currentLevel"
                        value={formData.currentLevel}
                        onChange={handleInputChange}
                        required
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
                    <div>
                      <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                        Student/Researcher ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="studentResearcherId"
                        value={formData.studentResearcherId}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="Enter student/researcher ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                        Year of Entry <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="yearOfEntry"
                        value={formData.yearOfEntry}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="YYYY"
                        min="1900"
                        max="2100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                        Expected Completion Year <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="expectedCompletionYear"
                        value={formData.expectedCompletionYear}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="YYYY"
                        min="1900"
                        max="2100"
                      />
                    </div>
                  </div>
                </div>

                {/* Research Information */}
                <div className="card">
                  <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Research Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                        Area of Study <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="areaOfStudy"
                        value={formData.areaOfStudy}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="Enter area of study"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                        Research Topic (Optional)
                      </label>
                      <textarea
                        name="researchTopic"
                        value={formData.researchTopic}
                        onChange={handleInputChange}
                        className="input-field"
                        rows={3}
                        placeholder="Enter research topic (optional)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                        Supervisor Name (Optional)
                      </label>
                      <input
                        type="text"
                        name="supervisorName"
                        value={formData.supervisorName}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter supervisor name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                        Supervisor Email (Optional)
                      </label>
                      <input
                        type="email"
                        name="supervisorEmail"
                        value={formData.supervisorEmail}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter supervisor email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                        Supporting Document (Optional)
                      </label>
                      <input
                        type="file"
                        name="supportingDocument"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="input-field"
                      />
                      {formData.supportingDocument && (
                        <p className="text-sm text-gray-400 font-serif mt-2">Current: {formData.supportingDocument}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Optional Professional Links */}
                <div className="card">
                  <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Optional Professional Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                        Google Scholar Profile (Optional)
                      </label>
                      <input
                        type="url"
                        name="googleScholar"
                        value={formData.googleScholar}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter Google Scholar profile URL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                        ResearchGate Profile (Optional)
                      </label>
                      <input
                        type="url"
                        name="researchGate"
                        value={formData.researchGate}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter ResearchGate profile URL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                        LinkedIn Profile (Optional)
                      </label>
                      <input
                        type="url"
                        name="linkedinProfile"
                        value={formData.linkedinProfile}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter LinkedIn profile URL"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === 'security' && (
              <>
                {/* Account Security */}
                <div className="card">
                  <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Account Security</h3>
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
                  </div>
                </div>

                {/* Terms & Confirmation */}
                <div className="card">
                  <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Terms & Confirmation</h3>
                  <div className="space-y-4">
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
                        I agree to the Terms and Conditions <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="agreeToAccuracy"
                        name="agreeToAccuracy"
                        checked={formData.agreeToAccuracy}
                        onChange={handleInputChange}
                        required
                        className="mt-1 mr-2"
                      />
                      <label htmlFor="agreeToAccuracy" className="text-sm text-gray-300 font-serif">
                        I confirm that all information provided is accurate <span className="text-red-500">*</span>
                      </label>
                    </div>
                  </div>
                </div>
              </>
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
