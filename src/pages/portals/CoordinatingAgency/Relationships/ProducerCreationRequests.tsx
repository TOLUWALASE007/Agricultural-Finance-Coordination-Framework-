import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../../../components/PortalLayout';
import CreateMEProjectModal from '../../../../components/CreateMEProjectModal';
import {
    getCreationRequests,
    updateCreationRequest,
    createRelationship,
    ProducerCreationRequest
} from '../../../../utils/relationshipDatabase';
import { registerProducer, findAnchorById } from '../../../../utils/localDatabase';
import { useNotifications } from '../../../../context/NotificationContext';

const ProducerCreationRequests: React.FC = () => {
    const navigate = useNavigate();
    const { addNotification, updateNotificationStatus } = useNotifications();
    const [requests, setRequests] = useState<ProducerCreationRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<ProducerCreationRequest | null>(null);
    const [showMEModal, setShowMEModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending-ca' | 'pending-me' | 'approved' | 'rejected'>('all');

    const sidebarItems = [
        {
            id: 'dashboard',
            name: 'Dashboard',
            icon: '🏠',
            href: '/portal/coordinating-agency',
            hasDropdown: true,
            dropdownItems: [
                { id: 'activities', name: 'Activities', icon: '⚡', href: '/portal/coordinating-agency/activities' },
                { id: 'fund-schemes', name: 'Fund Schemes', icon: '💼', href: '/portal/coordinating-agency/fund-schemes' },
                { id: 'reportings', name: 'Reports', icon: '📑', href: '/portal/coordinating-agency/reportings' },
                { id: 'trainings', name: 'Trainings', icon: '📚', href: '/portal/coordinating-agency/trainings' }
            ]
        },
        {
            id: 'me-team',
            name: 'M&E Team',
            icon: '📋',
            href: '/portal/coordinating-agency/monitoring/state'
        },
        {
            id: 'representative-body',
            name: 'Representative Body',
            icon: '🏛️',
            href: '/portal/coordinating-agency/representative',
            hasDropdown: true,
            dropdownItems: [
                { id: 'rep-insurance', name: 'Insurance Companies', icon: '🛡️', href: '/portal/coordinating-agency/representative/insurance-companies' },
                { id: 'rep-extension', name: 'Extension Organizations', icon: '🌿', href: '/portal/coordinating-agency/representative/extension-organizations' },
                { id: 'rep-ngos', name: 'NGOs', icon: '🤝', href: '/portal/coordinating-agency/representative/ngos' }
            ]
        },
        {
            id: 'applicants',
            name: 'Applicants',
            icon: '📝',
            href: '/portal/coordinating-agency/applicants',
            hasDropdown: true,
            dropdownItems: [
                { id: 'fund-provider', name: 'Fund Provider', icon: '💼', href: '/portal/coordinating-agency/applicants/fund-provider' },
                { id: 'pfis', name: 'PFIs', icon: '🏦', href: '/portal/coordinating-agency/applicants/pfis' },
                { id: 'insurance-companies', name: 'Insurance Companies', icon: '🛡️', href: '/portal/coordinating-agency/applicants/insurance-companies' },
                {
                    id: 'fund-beneficiaries',
                    name: 'Fund Beneficiaries',
                    icon: '👥',
                    href: '/portal/coordinating-agency/fund-beneficiaries',
                    hasDropdown: true,
                    dropdownItems: [
                        { id: 'lead-firms', name: 'Lead Firms', icon: '🏢', href: '/portal/coordinating-agency/fund-beneficiaries/lead-firms' },
                        { id: 'anchors', name: 'Anchors', icon: '⚓', href: '/portal/coordinating-agency/fund-beneficiaries/anchors' },
                        { id: 'cooperative-groups', name: 'Cooperative Groups', icon: '🤝', href: '/portal/coordinating-agency/fund-beneficiaries/cooperative-groups' },
                        { id: 'producers-farmers', name: 'Producers/Farmers', icon: '🌾', href: '/portal/coordinating-agency/fund-beneficiaries/producers-farmers' }
                    ]
                }
            ]
        },
        {
            id: 'relationships',
            name: 'Relationships',
            icon: '🤝',
            href: '/portal/coordinating-agency/relationships',
            hasDropdown: true,
            dropdownItems: [
                { id: 'creation-requests', name: 'Producer Creation Requests', icon: '➕', href: '/portal/coordinating-agency/relationships/creation-requests' },
                { id: 'invitation-requests', name: 'Invitation Requests', icon: '📨', href: '/portal/coordinating-agency/relationships/invitation-requests' },
                { id: 'leave-requests', name: 'Leave Requests', icon: '🚪', href: '/portal/coordinating-agency/relationships/leave-requests' },
            ]
        },
        {
            id: 'stakeholders',
            name: 'Department',
            icon: '🤝',
            href: '/portal/coordinating-agency/stakeholders',
            hasDropdown: true,
            dropdownItems: [
                { id: 'fund-management', name: 'Fund Management Department', icon: '💼', href: '/portal/coordinating-agency/stakeholders/fund-management' },
                { id: 'credit-risk', name: 'Agricultural Credit Risk Management Department', icon: '📊', href: '/portal/coordinating-agency/stakeholders/credit-risk' },
                { id: 'insurance', name: 'Agricultural Insurance Management Department', icon: '🛡️', href: '/portal/coordinating-agency/stakeholders/insurance' },
                { id: 'finance', name: 'Finance and Accounting Department', icon: '🪙', href: '/portal/coordinating-agency/stakeholders/finance' },
                { id: 'legal', name: 'Legal Department', icon: '⚖️', href: '/portal/coordinating-agency/stakeholders/legal' },
                { id: 'it', name: 'IT Department', icon: '💻', href: '/portal/coordinating-agency/stakeholders/it' },
                { id: 'training', name: 'Training Department', icon: '📚', href: '/portal/coordinating-agency/stakeholders/training' }
            ]
        },
        { id: 'publications', name: 'Publications', icon: '📚', href: '/portal/coordinating-agency/publications' },
        { id: 'blog', name: 'Blog', icon: '📰', href: '/portal/coordinating-agency/blog' },
        { id: 'faqs', name: 'FAQs', icon: '❓', href: '/portal/coordinating-agency/faqs' },
        { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/coordinating-agency/settings' }
    ];

    useEffect(() => {
        loadRequests();
    }, []);

    // Auto-open details modal when coming from notification
    useEffect(() => {
        const creationRequestId = sessionStorage.getItem('openCreationRequestModal');
        if (creationRequestId && requests.length > 0) {
            const request = requests.find(r => r.id === creationRequestId);
            if (request) {
                setSelectedRequest(request);
                setShowDetailsModal(true);
                // Clear the flag
                sessionStorage.removeItem('openCreationRequestModal');
            }
        }
    }, [requests]);

    const loadRequests = () => {
        const allRequests = getCreationRequests();
        setRequests(allRequests);
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch =
            req.requestedProducerData.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.anchorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.requestedProducerData.farmBusinessName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = filterStatus === 'all' || req.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const handleCreateMEProject = (request: ProducerCreationRequest) => {
        setSelectedRequest(request);
        setShowMEModal(true);
    };

    const handleMEProjectCreated = () => {
        if (!selectedRequest) return;

        // Update the creation request with M&E project ID (we'll use a placeholder since modal doesn't return it)
        updateCreationRequest(selectedRequest.id, {
            status: 'pending-me',
            meProjectId: `me_${Date.now()}`, // Placeholder since modal doesn't return project ID
        });

        // Send notification to anchor
        addNotification({
            role: '🏛️ Coordinating Agency',
            targetRole: 'anchor',
            message: `Your producer creation request for "${selectedRequest.requestedProducerData.fullName}" has been sent for M&E verification.`,
            creationRequestId: selectedRequest.id,
            anchorId: selectedRequest.anchorId,
            metadata: {
                type: 'creation-request-me-verification',
                creationRequestId: selectedRequest.id,
                anchorId: selectedRequest.anchorId,
            },
        });

        setShowMEModal(false);
        setSelectedRequest(null);
        loadRequests();
        alert('M&E project created successfully. The request is now pending M&E verification.');
    };

    const handleApprove = (request: ProducerCreationRequest) => {
        if (!request.meProjectId) {
            alert('Please create an M&E project first before approving.');
            return;
        }

        try {
            // Generate a temporary password for the producer
            const tempPassword = `Producer${Math.random().toString(36).slice(2, 10)}`;

            // Create the producer record
            const producerRecord = registerProducer({
                email: request.requestedProducerData.email || request.requestedProducerData.phone,
                password: tempPassword,
                formData: {
                    ...request.requestedProducerData,
                    password: tempPassword,
                },
            });

            // Create the relationship
            createRelationship({
                anchorId: request.anchorId,
                producerId: producerRecord.id,
                status: 'active',
                createdBy: 'ca',
                approvedAt: new Date().toISOString(),
            });

            // Update the creation request
            updateCreationRequest(request.id, {
                status: 'approved',
                reviewedAt: new Date().toISOString(),
                createdProducerId: producerRecord.id,
            });

            // Notify anchor of approval
            addNotification({
                role: '🏛️ Coordinating Agency',
                targetRole: 'anchor',
                message: `Producer/Farmer "${request.requestedProducerData.fullName}" has been created and attached to your organization.`,
                creationRequestId: request.id,
                anchorId: request.anchorId,
                producerId: producerRecord.id,
                producerName: request.requestedProducerData.fullName,
                metadata: {
                    type: 'creation-request-approved',
                    creationRequestId: request.id,
                    producerId: producerRecord.id,
                    anchorId: request.anchorId,
                    tempPassword: tempPassword,
                },
            });

            // Notify the producer (via phone/email)
            addNotification({
                role: '🏛️ Coordinating Agency',
                targetRole: 'producer',
                message: `Welcome! You have been registered as a Producer/Farmer under ${request.anchorName}. Your temporary password is: ${tempPassword}`,
                producerId: producerRecord.id,
                anchorId: request.anchorId,
                anchorName: request.anchorName,
                metadata: {
                    type: 'producer-created',
                    tempPassword: tempPassword,
                },
            });

            // Update notification status if exists
            if (request.caNotificationId) {
                updateNotificationStatus(request.caNotificationId, 'approved');
            }

            loadRequests();
            alert(`Producer created successfully! Temporary password: ${tempPassword}\n\nPlease share this with the producer.`);
        } catch (error: any) {
            console.error('Error approving creation request:', error);
            alert(error.message || 'Failed to approve creation request.');
        }
    };

    const handleReject = () => {
        if (!selectedRequest || !rejectionReason.trim()) {
            alert('Please provide a rejection reason.');
            return;
        }

        try {
            // Update the creation request
            updateCreationRequest(selectedRequest.id, {
                status: 'rejected',
                reviewedAt: new Date().toISOString(),
                rejectionReason: rejectionReason,
            });

            // Notify anchor of rejection
            addNotification({
                role: '🏛️ Coordinating Agency',
                targetRole: 'anchor',
                message: `Your producer creation request for "${selectedRequest.requestedProducerData.fullName}" has been rejected.`,
                creationRequestId: selectedRequest.id,
                anchorId: selectedRequest.anchorId,
                metadata: {
                    type: 'creation-request-rejected',
                    creationRequestId: selectedRequest.id,
                    anchorId: selectedRequest.anchorId,
                    rejectionReason: rejectionReason,
                },
            });

            // Update notification status if exists
            if (selectedRequest.caNotificationId) {
                updateNotificationStatus(selectedRequest.caNotificationId, 'rejected');
            }

            setShowRejectModal(false);
            setSelectedRequest(null);
            setRejectionReason('');
            loadRequests();
            alert('Creation request rejected successfully.');
        } catch (error: any) {
            console.error('Error rejecting creation request:', error);
            alert(error.message || 'Failed to reject creation request.');
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            'pending-ca': 'bg-yellow-500 text-white',
            'pending-me': 'bg-blue-500 text-white',
            'approved': 'bg-green-500 text-white',
            'rejected': 'bg-red-500 text-white',
        };
        return badges[status as keyof typeof badges] || 'bg-gray-500 text-white';
    };

    const getStatusText = (status: string) => {
        const texts = {
            'pending-ca': 'Pending CA Review',
            'pending-me': 'Pending M&E Verification',
            'approved': 'Approved',
            'rejected': 'Rejected',
        };
        return texts[status as keyof typeof texts] || status;
    };

    return (
        <PortalLayout role="Coordinating Agency" roleIcon="🏛️" sidebarItems={sidebarItems}>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold font-sans mb-2">Producer Creation Requests</h1>
                    <p className="text-gray-200 font-serif">
                        Review and approve producer/farmer creation requests from anchors. Create M&E projects for verification before approval.
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="card">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by producer name, anchor, or farm..."
                                className="w-full px-4 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            {['all', 'pending-ca', 'pending-me', 'approved', 'rejected'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status as any)}
                                    className={`px-4 py-2 rounded-md font-medium text-sm ${filterStatus === status
                                        ? 'bg-accent-500 text-white'
                                        : 'bg-primary-700 text-gray-300 hover:bg-primary-600'
                                        }`}
                                >
                                    {status === 'all' ? 'All' : getStatusText(status)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Requests List */}
                <div className="card">
                    <h2 className="text-xl font-bold font-sans text-gray-100 mb-4">
                        Requests ({filteredRequests.length})
                    </h2>

                    {filteredRequests.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📋</div>
                            <p className="text-gray-400 font-serif">No creation requests found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className="p-4 bg-primary-700 rounded-lg border border-primary-600 hover:border-accent-500 transition-colors"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold font-sans text-gray-100">
                                                    {request.requestedProducerData.fullName}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                                                    {getStatusText(request.status)}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                                                <div>
                                                    <span className="text-gray-400">Anchor:</span> {request.anchorName}
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Farm:</span> {request.requestedProducerData.farmBusinessName}
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Phone:</span> {request.requestedProducerData.phone}
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Farm Size:</span> {request.requestedProducerData.farmSize} hectares
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Submitted:</span> {new Date(request.createdAt).toLocaleDateString()}
                                                </div>
                                                {request.meProjectId && (
                                                    <div>
                                                        <span className="text-gray-400">M&E Project:</span> {request.meProjectId}
                                                    </div>
                                                )}
                                            </div>

                                            {request.rejectionReason && (
                                                <div className="mt-2 p-2 bg-red-900/20 border border-red-500/30 rounded">
                                                    <p className="text-sm text-red-400">
                                                        <span className="font-semibold">Rejection Reason:</span> {request.rejectionReason}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedRequest(request);
                                                    setShowDetailsModal(true);
                                                }}
                                                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-md font-medium text-sm"
                                            >
                                                View Details
                                            </button>

                                            {request.status === 'pending-ca' && (
                                                <>
                                                    <button
                                                        onClick={() => handleCreateMEProject(request)}
                                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium text-sm"
                                                    >
                                                        Create M&E Project
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedRequest(request);
                                                            setShowRejectModal(true);
                                                        }}
                                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium text-sm"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}

                                            {request.status === 'pending-me' && (
                                                <button
                                                    onClick={() => handleApprove(request)}
                                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium text-sm"
                                                >
                                                    Approve & Create Producer
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details Modal */}
                {showDetailsModal && selectedRequest && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-primary-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-primary-600">
                            <div className="sticky top-0 bg-primary-800 border-b border-primary-600 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold font-sans text-gray-100">Producer Details</h2>
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedRequest(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-200 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-lg font-semibold font-sans text-gray-100 mb-3">Personal Information</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400">Full Name:</span>
                                            <p className="text-gray-100">{selectedRequest.requestedProducerData.fullName}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Gender:</span>
                                            <p className="text-gray-100">{selectedRequest.requestedProducerData.gender}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Date of Birth:</span>
                                            <p className="text-gray-100">{selectedRequest.requestedProducerData.birthDate}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Phone:</span>
                                            <p className="text-gray-100">{selectedRequest.requestedProducerData.phone}</p>
                                        </div>
                                        {selectedRequest.requestedProducerData.email && (
                                            <div>
                                                <span className="text-gray-400">Email:</span>
                                                <p className="text-gray-100">{selectedRequest.requestedProducerData.email}</p>
                                            </div>
                                        )}
                                        <div className="col-span-2">
                                            <span className="text-gray-400">Address:</span>
                                            <p className="text-gray-100">
                                                {selectedRequest.requestedProducerData.address}, {selectedRequest.requestedProducerData.city}, {selectedRequest.requestedProducerData.state}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Farm Information */}
                                <div>
                                    <h3 className="text-lg font-semibold font-sans text-gray-100 mb-3">Farm Information</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400">Farm Business Name:</span>
                                            <p className="text-gray-100">{selectedRequest.requestedProducerData.farmBusinessName}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Farm Size:</span>
                                            <p className="text-gray-100">{selectedRequest.requestedProducerData.farmSize} hectares</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Years of Experience:</span>
                                            <p className="text-gray-100">{selectedRequest.requestedProducerData.yearsOfExperience}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Farmer Type:</span>
                                            <p className="text-gray-100">{selectedRequest.requestedProducerData.typeOfFarmer.join(', ')}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-400">Farm Address:</span>
                                            <p className="text-gray-100">{selectedRequest.requestedProducerData.farmAddress}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Crops:</span>
                                            <p className="text-gray-100">{selectedRequest.requestedProducerData.crops.join(', ') || 'None'}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Livestock:</span>
                                            <p className="text-gray-100">{selectedRequest.requestedProducerData.livestock.join(', ') || 'None'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Banking Information */}
                                <div>
                                    <h3 className="text-lg font-semibold font-sans text-gray-100 mb-3">Banking Information</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400">Bank Name:</span>
                                            <p className="text-gray-100">{selectedRequest.requestedProducerData.bankName}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Account Name:</span>
                                            <p className="text-gray-100">{selectedRequest.requestedProducerData.accountName}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Account Number:</span>
                                            <p className="text-gray-100">{selectedRequest.requestedProducerData.accountNumber}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Payment Method:</span>
                                            <p className="text-gray-100">{selectedRequest.requestedProducerData.preferredPaymentMethod}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reject Modal */}
                {showRejectModal && selectedRequest && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-primary-800 rounded-lg max-w-md w-full border border-primary-600">
                            <div className="px-6 py-4 border-b border-primary-600 flex justify-between items-center">
                                <h2 className="text-lg font-bold font-sans text-gray-100">Reject Creation Request</h2>
                                <button
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setSelectedRequest(null);
                                        setRejectionReason('');
                                    }}
                                    className="text-gray-400 hover:text-gray-200 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                        Rejection Reason <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
                                        placeholder="Provide a clear reason for rejection..."
                                    />
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => {
                                            setShowRejectModal(false);
                                            setSelectedRequest(null);
                                            setRejectionReason('');
                                        }}
                                        className="px-4 py-2 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium"
                                    >
                                        Reject Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* M&E Project Modal */}
                {selectedRequest && (
                    <CreateMEProjectModal
                        isOpen={showMEModal}
                        onClose={() => {
                            setShowMEModal(false);
                            setSelectedRequest(null);
                        }}
                        onSuccess={() => handleMEProjectCreated()}
                        projectType="registration"
                        sourceType="producer"
                        sourceId={selectedRequest.id}
                        sourceName={selectedRequest.requestedProducerData.fullName}
                        sourceEmail={selectedRequest.requestedProducerData.email}
                        sourcePhone={selectedRequest.requestedProducerData.phone}
                        submissionData={{
                            producerName: selectedRequest.requestedProducerData.fullName,
                            anchorName: selectedRequest.anchorName,
                            farmBusinessName: selectedRequest.requestedProducerData.farmBusinessName,
                            farmSize: selectedRequest.requestedProducerData.farmSize,
                            farmAddress: selectedRequest.requestedProducerData.farmAddress,
                            phone: selectedRequest.requestedProducerData.phone,
                            creationRequestId: selectedRequest.id,
                        }}
                    />
                )}

                <div className="mt-2 text-center text-xs text-gray-400 font-serif opacity-80">
                    Powered by Mc. George
                </div>
            </div>
        </PortalLayout>
    );
};

export default ProducerCreationRequests;
