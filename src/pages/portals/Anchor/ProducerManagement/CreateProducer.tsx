import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../../../components/PortalLayout';
import { getActiveAnchorRecord } from '../../../../utils/localDatabase';
import { createCreationRequest } from '../../../../utils/relationshipDatabase';
import { useNotifications } from '../../../../context/NotificationContext';

const CreateProducer: React.FC = () => {
    const navigate = useNavigate();
    const { addNotification } = useNotifications();
    const [anchorRecord, setAnchorRecord] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        // Personal Information
        fullName: '',
        gender: '',
        birthDate: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        country: 'Nigeria',

        // Farm Information
        farmBusinessName: '',
        typeOfFarmer: [] as string[],
        farmAddress: '',
        farmSize: '',
        yearsOfExperience: '',
        primarySourceOfIncome: '',
        farmerAssociation: '',

        // Production Details
        crops: [] as string[],
        livestock: [] as string[],
        hasProcessingValueAddition: 'No',
        processingValueAdditionDetails: '',
        totalAnnualProduction: '',
        primaryMarket: '',
        majorBuyers: '',
        challengesFaced: '',

        // Identification
        idType: '',
        idNumber: '',

        // Banking Information
        preferredPaymentMethod: '',
        bankName: '',
        accountName: '',
        accountNumber: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const record = getActiveAnchorRecord();
        if (!record) {
            navigate('/portal/anchor');
            return;
        }
        setAnchorRecord(record);
    }, [navigate]);

    const sidebarItems = [
        { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/anchor' },
        { id: 'scheme-application', name: 'Schemes Application', icon: '📝', href: '/portal/anchor/scheme-application' },
        {
            id: 'producer-management',
            name: 'Producer/Farmer Management',
            icon: '🌾',
            hasDropdown: true,
            dropdownItems: [
                { id: 'create-producer', name: 'Create New Producer/Farmer', icon: '➕', href: '/portal/anchor/producer-management/create' },
                { id: 'invite-producers', name: 'Invite Existing Producers', icon: '📨', href: '/portal/anchor/producer-management/invite' },
                { id: 'manage-producers', name: 'Manage Current Producers', icon: '👥', href: '/portal/anchor/producer-management/manage' },
                { id: 'join-requests', name: 'View Join Requests', icon: '📥', href: '/portal/anchor/producer-management/requests' },
                { id: 'activity-logs', name: 'Producer Activity Logs', icon: '📋', href: '/portal/anchor/producer-management/logs' },
            ]
        },
        { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/anchor/settings' }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleMultiSelectChange = (name: string, value: string) => {
        setFormData(prev => {
            const currentValues = prev[name as keyof typeof prev] as string[];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            return { ...prev, [name]: newValues };
        });
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Required fields validation
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.birthDate) newErrors.birthDate = 'Date of birth is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.farmBusinessName.trim()) newErrors.farmBusinessName = 'Farm business name is required';
        if (formData.typeOfFarmer.length === 0) newErrors.typeOfFarmer = 'Select at least one farmer type';
        if (!formData.farmAddress.trim()) newErrors.farmAddress = 'Farm address is required';
        if (!formData.farmSize.trim()) newErrors.farmSize = 'Farm size is required';
        if (!formData.yearsOfExperience.trim()) newErrors.yearsOfExperience = 'Years of experience is required';
        if (!formData.primarySourceOfIncome.trim()) newErrors.primarySourceOfIncome = 'Primary source of income is required';
        if (!formData.idType) newErrors.idType = 'ID type is required';
        if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required';
        if (!formData.preferredPaymentMethod) newErrors.preferredPaymentMethod = 'Payment method is required';
        if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
        if (!formData.accountName.trim()) newErrors.accountName = 'Account name is required';
        if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';

        // At least one crop or livestock
        if (formData.crops.length === 0 && formData.livestock.length === 0) {
            newErrors.crops = 'Select at least one crop or livestock';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Please fill in all required fields');
            return;
        }

        if (!anchorRecord) {
            alert('Anchor information not found');
            return;
        }

        setIsSubmitting(true);

        try {
            // Create the producer creation request
            const creationRequest = createCreationRequest({
                anchorId: anchorRecord.id,
                anchorName: anchorRecord.formData.organizationName || anchorRecord.formData.fullName,
                requestedProducerData: formData,
            });

            // Send notification to CA
            const notificationId = addNotification({
                role: '⚓ Anchor',
                targetRole: 'coordinating-agency',
                message: `New Producer/Farmer creation request from ${anchorRecord.formData.organizationName || anchorRecord.formData.fullName}`,
                applicantName: formData.fullName,
                creationRequestId: creationRequest.id,
                anchorId: anchorRecord.id,
                anchorName: anchorRecord.formData.organizationName || anchorRecord.formData.fullName,
                metadata: {
                    type: 'producer-creation-request',
                    creationRequestId: creationRequest.id,
                    producerData: formData,
                },
            });

            alert('Producer/Farmer creation request submitted successfully! The Coordinating Agency will review your request.');
            navigate('/portal/anchor/producer-management/manage');
        } catch (error: any) {
            console.error('Error submitting creation request:', error);
            alert(error.message || 'Failed to submit creation request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const farmerTypes = ['Smallholder', 'Commercial', 'Subsistence', 'Organic', 'Contract'];
    const cropOptions = ['Maize', 'Rice', 'Cassava', 'Yam', 'Beans', 'Sorghum', 'Millet', 'Groundnut', 'Soybean', 'Vegetables'];
    const livestockOptions = ['Cattle', 'Goats', 'Sheep', 'Poultry', 'Pigs', 'Fish'];
    const idTypes = ['National ID', 'Voter\'s Card', 'Driver\'s License', 'International Passport', 'BVN'];
    const paymentMethods = ['Bank Transfer', 'Mobile Money', 'Cash', 'Cheque'];

    return (
        <PortalLayout role="Anchor" roleIcon="⚓" sidebarItems={sidebarItems}>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold font-sans mb-2">Create New Producer/Farmer</h1>
                    <p className="text-gray-200 font-serif">
                        Submit a request to create a new producer/farmer under your anchor organization. The Coordinating Agency will review and verify the details.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="card">
                        <h2 className="text-xl font-bold font-sans text-gray-100 mb-4">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    Full Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border ${errors.fullName ? 'border-red-500' : 'border-primary-600'
                                        } focus:outline-none focus:ring-2 focus:ring-accent-500`}
                                    placeholder="Enter full name"
                                />
                                {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    Gender <span className="text-red-400">*</span>
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border ${errors.gender ? 'border-red-500' : 'border-primary-600'
                                        } focus:outline-none focus:ring-2 focus:ring-accent-500`}
                                >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    Date of Birth <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border ${errors.birthDate ? 'border-red-500' : 'border-primary-600'
                                        } focus:outline-none focus:ring-2 focus:ring-accent-500`}
                                />
                                {errors.birthDate && <p className="text-red-400 text-xs mt-1">{errors.birthDate}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    Phone Number <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border ${errors.phone ? 'border-red-500' : 'border-primary-600'
                                        } focus:outline-none focus:ring-2 focus:ring-accent-500`}
                                    placeholder="+234 XXX XXX XXXX"
                                />
                                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
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
                                    className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                                    placeholder="email@example.com"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    Address <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border ${errors.address ? 'border-red-500' : 'border-primary-600'
                                        } focus:outline-none focus:ring-2 focus:ring-accent-500`}
                                    placeholder="Street address"
                                />
                                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    City <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border ${errors.city ? 'border-red-500' : 'border-primary-600'
                                        } focus:outline-none focus:ring-2 focus:ring-accent-500`}
                                    placeholder="City"
                                />
                                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    State <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border ${errors.state ? 'border-red-500' : 'border-primary-600'
                                        } focus:outline-none focus:ring-2 focus:ring-accent-500`}
                                    placeholder="State"
                                />
                                {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Farm Information */}
                    <div className="card">
                        <h2 className="text-xl font-bold font-sans text-gray-100 mb-4">Farm Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    Farm Business Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="farmBusinessName"
                                    value={formData.farmBusinessName}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border ${errors.farmBusinessName ? 'border-red-500' : 'border-primary-600'
                                        } focus:outline-none focus:ring-2 focus:ring-accent-500`}
                                    placeholder="Farm or business name"
                                />
                                {errors.farmBusinessName && <p className="text-red-400 text-xs mt-1">{errors.farmBusinessName}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    Type of Farmer <span className="text-red-400">*</span>
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {farmerTypes.map(type => (
                                        <label key={type} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.typeOfFarmer.includes(type)}
                                                onChange={() => handleMultiSelectChange('typeOfFarmer', type)}
                                                className="w-4 h-4 text-accent-500 bg-primary-700 border-primary-600 rounded focus:ring-accent-500"
                                            />
                                            <span className="text-sm text-gray-300">{type}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.typeOfFarmer && <p className="text-red-400 text-xs mt-1">{errors.typeOfFarmer}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    Farm Address <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="farmAddress"
                                    value={formData.farmAddress}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border ${errors.farmAddress ? 'border-red-500' : 'border-primary-600'
                                        } focus:outline-none focus:ring-2 focus:ring-accent-500`}
                                    placeholder="Physical location of farm"
                                />
                                {errors.farmAddress && <p className="text-red-400 text-xs mt-1">{errors.farmAddress}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    Farm Size (Hectares) <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="farmSize"
                                    value={formData.farmSize}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border ${errors.farmSize ? 'border-red-500' : 'border-primary-600'
                                        } focus:outline-none focus:ring-2 focus:ring-accent-500`}
                                    placeholder="e.g., 5.5"
                                />
                                {errors.farmSize && <p className="text-red-400 text-xs mt-1">{errors.farmSize}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    Years of Experience <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="yearsOfExperience"
                                    value={formData.yearsOfExperience}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border ${errors.yearsOfExperience ? 'border-red-500' : 'border-primary-600'
                                        } focus:outline-none focus:ring-2 focus:ring-accent-500`}
                                    placeholder="e.g., 10"
                                />
                                {errors.yearsOfExperience && <p className="text-red-400 text-xs mt-1">{errors.yearsOfExperience}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    Primary Source of Income <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="primarySourceOfIncome"
                                    value={formData.primarySourceOfIncome}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border ${errors.primarySourceOfIncome ? 'border-red-500' : 'border-primary-600'
                                        } focus:outline-none focus:ring-2 focus:ring-accent-500`}
                                    placeholder="e.g., Farming"
                                />
                                {errors.primarySourceOfIncome && <p className="text-red-400 text-xs mt-1">{errors.primarySourceOfIncome}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    Farmer Association (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="farmerAssociation"
                                    value={formData.farmerAssociation}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                                    placeholder="Association name"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Production Details */}
                    <div className="card">
                        <h2 className="text-xl font-bold font-sans text-gray-100 mb-4">Production Details</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    Crops <span className="text-red-400">*</span>
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {cropOptions.map(crop => (
                                        <label key={crop} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.crops.includes(crop)}
                                                onChange={() => handleMultiSelectChange('crops', crop)}
                                                className="w-4 h-4 text-accent-500 bg-primary-700 border-primary-600 rounded focus:ring-accent-500"
                                            />
                                            <span className="text-sm text-gray-300">{crop}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.crops && <p className="text-red-400 text-xs mt-1">{errors.crops}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    Livestock
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {livestockOptions.map(animal => (
                                        <label key={animal} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.livestock.includes(animal)}
                                                onChange={() => handleMultiSelectChange('livestock', animal)}
                                                className="w-4 h-4 text-accent-500 bg-primary-700 border-primary-600 rounded focus:ring-accent-500"
                                            />
                                            <span className="text-sm text-gray-300">{animal}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                        Total Annual Production
                                    </label>
                                    <input
                                        type="text"
                                        name="totalAnnualProduction"
                                        value={formData.totalAnnualProduction}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                                        placeholder="e.g., 500 tons"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                        Primary Market
                                    </label>
                                    <input
                                        type="text"
                                        name="primaryMarket"
                                        value={formData.primaryMarket}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                                        placeholder="e.g., Local market"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    Major Buyers (Optional)
                                </label>
                                <textarea
                                    name="majorBuyers"
                                    value={formData.majorBuyers}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
                                    placeholder="List major buyers"
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
                                    rows={3}
                                    className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
                                    placeholder="Describe challenges"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Identification */}
                    <div className="card">
                        <h2 className="text-xl font-bold font-sans text-gray-100 mb-4">Identification</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    ID Type <span className="text-red-400">*</span>
                                </label>
                                <select
                                    name="idType"
                                    value={formData.idType}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border ${errors.idType ? 'border-red-500' : 'border-primary-600'
                                        } focus:outline-none focus:ring-2 focus:ring-accent-500`}
                                >
                                    <option value="">Select ID type</option>
                                    {idTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                {errors.idType && <p className="text-red-400 text-xs mt-1">{errors.idType}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    ID Number <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="idNumber"
                                    value={formData.idNumber}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border ${errors.idNumber ? 'border-red-500' : 'border-primary-600'
                                        } focus:outline-none focus:ring-2 focus:ring-accent-500`}
                                    placeholder="ID number"
                                />
                                {errors.idNumber && <p className="text-red-400 text-xs mt-1">{errors.idNumber}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Banking Information */}
                    <div className="card">
                        <h2 className="text-xl font-bold font-sans text-gray-100 mb-4">Banking Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    Preferred Payment Method <span className="text-red-400">*</span>
                                </label>
                                <select
                                    name="preferredPaymentMethod"
                                    value={formData.preferredPaymentMethod}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border ${errors.preferredPaymentMethod ? 'border-red-500' : 'border-primary-600'
                                        } focus:outline-none focus:ring-2 focus:ring-accent-500`}
                                >
                                    <option value="">Select payment method</option>
                                    {paymentMethods.map(method => (
                                        <option key={method} value={method}>{method}</option>
                                    ))}
                                </select>
                                {errors.preferredPaymentMethod && <p className="text-red-400 text-xs mt-1">{errors.preferredPaymentMethod}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    Bank Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border ${errors.bankName ? 'border-red-500' : 'border-primary-600'
                                        } focus:outline-none focus:ring-2 focus:ring-accent-500`}
                                    placeholder="Bank name"
                                />
                                {errors.bankName && <p className="text-red-400 text-xs mt-1">{errors.bankName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    Account Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="accountName"
                                    value={formData.accountName}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border ${errors.accountName ? 'border-red-500' : 'border-primary-600'
                                        } focus:outline-none focus:ring-2 focus:ring-accent-500`}
                                    placeholder="Account name"
                                />
                                {errors.accountName && <p className="text-red-400 text-xs mt-1">{errors.accountName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    Account Number <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border ${errors.accountNumber ? 'border-red-500' : 'border-primary-600'
                                        } focus:outline-none focus:ring-2 focus:ring-accent-500`}
                                    placeholder="Account number"
                                />
                                {errors.accountNumber && <p className="text-red-400 text-xs mt-1">{errors.accountNumber}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="card">
                        <div className="flex flex-col sm:flex-row gap-4 justify-end">
                            <button
                                type="button"
                                onClick={() => navigate('/portal/anchor/producer-management/manage')}
                                className="px-6 py-3 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md font-medium"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="mt-2 text-center text-xs text-gray-400 font-serif opacity-80">
                    Powered by Mc. George
                </div>
            </div>
        </PortalLayout>
    );
};

export default CreateProducer;
