import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../../../components/PortalLayout';
import CreateMEProjectModal from '../../../../components/CreateMEProjectModal';
import {
    getLeaveRequests,
    updateLeaveRequest,
    updateRelationship,
    ProducerLeaveRequest
} from '../../../../utils/relationshipDatabase';
import { findAnchorById, findProducerById } from '../../../../utils/localDatabase';
import { useNotifications } from '../../../../context/NotificationContext';

const LeaveRequests: React.FC = () => {
    const navigate = useNavigate();
    const { addNotification, updateNotificationStatus } = useNotifications();
    const [requests, setRequests] = useState<ProducerLeaveRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<ProducerLeaveRequest | null>(null);
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

    const loadRequests = () => {
        const allRequests = getLeaveRequests();
        setRequests(allRequests);
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch =
            req.producerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.anchorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.reason.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = filterStatus === 'all' || req.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const handleCreateMEProject = (request: ProducerLeaveRequest) => {
        setSelectedRequest(request);
        setShowMEModal(true);
    };

    const handleMEProjectCreated = () => {
        if (!selectedRequest) return;

        // Update the leave request with M&E project ID (placeholder since modal doesn't return it)
        updateLeaveRequest(selectedRequest.id, {
            status: 'pending-me',
            meProjectId: `me_${Date.now()}`,
        });

        // Send notification to producer
        addNotification({
            role: '🏛️ Coordinating Agency',
            targetRole: 'producer',
            message: `Your leave request from "${selectedRequest.anchorName}" has been sent for M&E verification.`,
            leaveRequestId: selectedRequest.id,
            producerId: selectedRequest.producerId,
            anchorId: selectedRequest.anchorId,
            anchorName: selectedRequest.anchorName,
            metadata: {
                type: 'leave-request-me-verification',
                leaveRequestId: selectedRequest.id,
                producerId: selectedRequest.producerId,
            },
        });

        // Send notification to anchor
        addNotification({
            role: '🏛️ Coordinating Agency',
            targetRole: 'anchor',
            message: `Leave request from "${selectedRequest.producerName}" is being verified by M&E.`,
            leaveRequestId: selectedRequest.id,
            producerId: selectedRequest.producerId,
            producerName: selectedRequest.producerName,
            anchorId: selectedRequest.anchorId,
            metadata: {
                type: 'leave-request-me-verification',
                leaveRequestId: selectedRequest.id,
                anchorId: selectedRequest.anchorId,
            },
        });

        setShowMEModal(false);
        setSelectedRequest(null);
        loadRequests();
        alert('M&E project created successfully. The request is now pending M&E verification.');
    };

    const handleApprove = (request: ProducerLeaveRequest) => {
        if (!request.meProjectId) {
            alert('Please create an M&E project first before approving.');
            return;
        }

        const confirmApprove = window.confirm(
            `Approve leave request from ${request.producerName}?\n\nThis will terminate the relationship with ${request.anchorName}.`
        );

        if (!confirmApprove) return;

        try {
            // Update the relationship to terminated
            updateRelationship(request.relationshipId, {
                status: 'terminated',
                terminatedAt: new Date().toISOString(),
                terminationReason: request.reason,
            });

            // Update the leave request
            updateLeaveRequest(request.id, {
                status: 'approved',
                reviewedAt: new Date().toISOString(),
            });

            // Notify producer of approval
            addNotification({
                role: '🏛️ Coordinating Agency',
                targetRole: 'producer',
                message: `Your leave request from "${request.anchorName}" has been approved. The relationship has been terminated.`,
                leaveRequestId: request.id,
                producerId: request.producerId,
                anchorId: request.anchorId,
                anchorName: request.anchorName,
                metadata: {
                    type: 'leave-request-approved',
                    leaveRequestId: request.id,
                    producerId: request.producerId,
                },
            });

            // Notify anchor of termination
            addNotification({
                role: '🏛️ Coordinating Agency',
                targetRole: 'anchor',
                message: `${request.producerName} has left your organization. The relationship has been terminated.`,
                leaveRequestId: request.id,
                producerId: request.producerId,
                producerName: request.producerName,
                anchorId: request.anchorId,
                metadata: {
                    type: 'producer-left',
                    leaveRequestId: request.id,
                    reason: request.reason,
                    anchorId: request.anchorId,
                },
            });

            // Update notification status if exists
            if (request.caNotificationId) {
                updateNotificationStatus(request.caNotificationId, 'approved');
            }

            loadRequests();
            alert('Leave request approved. The relationship has been terminated.');
        } catch (error: any) {
            console.error('Error approving leave request:', error);
            alert(error.message || 'Failed to approve leave request.');
        }
    };

    const handleReject = () => {
        if (!selectedRequest || !rejectionReason.trim()) {
            alert('Please provide a rejection reason.');
            return;
        }

        try {
            // Update the leave request
            updateLeaveRequest(selectedRequest.id, {
                status: 'rejected',
                reviewedAt: new Date().toISOString(),
                rejectionReason: rejectionReason,
            });

            // Notify producer of rejection
            addNotification({
                role: '🏛️ Coordinating Agency',
                targetRole: 'producer',
                message: `Your leave request from "${selectedRequest.anchorName}" has been rejected.`,
                leaveRequestId: selectedRequest.id,
                producerId: selectedRequest.producerId,
                anchorId: selectedRequest.anchorId,
                anchorName: selectedRequest.anchorName,
                metadata: {
                    type: 'leave-request-rejected',
                    leaveRequestId: selectedRequest.id,
                    rejectionReason: rejectionReason,
                    producerId: selectedRequest.producerId,
                },
            });

            // Notify anchor
            addNotification({
                role: '🏛️ Coordinating Agency',
                targetRole: 'anchor',
                message: `Leave request from "${selectedRequest.producerName}" has been rejected. The relationship remains active.`,
                leaveRequestId: selectedRequest.id,
                producerId: selectedRequest.producerId,
                producerName: selectedRequest.producerName,
                anchorId: selectedRequest.anchorId,
                metadata: {
                    type: 'leave-request-rejected',
                    leaveRequestId: selectedRequest.id,
                    anchorId: selectedRequest.anchorId,
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
            alert('Leave request rejected successfully.');
        } catch (error: any) {
            console.error('Error rejecting leave request:', error);
            alert(error.message || 'Failed to reject leave request.');
        }
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, string> = {
            'pending-ca': 'bg-yellow-500 text-white',
            'pending-me': 'bg-blue-500 text-white',
            'approved': 'bg-green-500 text-white',
            'rejected': 'bg-red-500 text-white',
        };
        return badges[status] || 'bg-gray-500 text-white';
    };

    const getStatusText = (status: string) => {
        const texts: Record<string, string> = {
            'pending-ca': 'Pending CA Review',
            'pending-me': 'Pending M&E Verification',
            'approved': 'Approved',
            'rejected': 'Rejected',
        };
        return texts[status] || status;
    };

    const pendingCACount = requests.filter(r => r.status === 'pending-ca').length;
    const pendingMECount = requests.filter(r => r.status === 'pending-me').length;
    const approvedCount = requests.filter(r => r.status === 'approved').length;
    const rejectedCount = requests.filter(r => r.status === 'rejected').length;

    return (
        <PortalLayout role="Coordinating Agency" roleIcon="🏛️" sidebarItems={sidebarItems}>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold font-sans mb-2">Producer Leave Requests</h1>
                    <p className="text-gray-200 font-serif">
                        Review producer leave requests with M&E verification. Approve or reject relationship terminations.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Pending CA Review</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{pendingCACount}</p>
                            </div>
                            <div className="text-3xl">⏳</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Pending M&E</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{pendingMECount}</p>
                            </div>
                            <div className="text-3xl">📋</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Approved</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{approvedCount}</p>
                            </div>
                            <div className="text-3xl">✅</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Rejected</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{rejectedCount}</p>
                            </div>
                            <div className="text-3xl">❌</div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="card">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by producer, anchor, or reason..."
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
                        Leave Requests ({filteredRequests.length})
                    </h2>

                    {filteredRequests.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📋</div>
                            <p className="text-gray-400 font-serif">No leave requests found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredRequests.map((request) => {
                                const producer = findProducerById(request.producerId);
                                const anchor = findAnchorById(request.anchorId);

                                return (
                                    <div
                                        key={request.id}
                                        className="p-4 bg-primary-700 rounded-lg border border-primary-600 hover:border-accent-500 transition-colors"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold font-sans text-gray-100">
                                                        {request.producerName} leaving {request.anchorName}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                                                        {getStatusText(request.status)}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300 mb-3">
                                                    <div>
                                                        <span className="text-gray-400">Producer:</span> {request.producerName}
                                                        {producer && ` (${producer.formData.farmBusinessName})`}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Anchor:</span> {request.anchorName}
                                                        {anchor && ` (${anchor.formData.industry})`}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Submitted:</span> {new Date(request.createdAt).toLocaleDateString()}
                                                    </div>
                                                    {request.meProjectId && (
                                                        <div>
                                                            <span className="text-gray-400">M&E Project:</span> {request.meProjectId}
                                                        </div>
                                                    )}
                                                    {request.reviewedAt && (
                                                        <div>
                                                            <span className="text-gray-400">Reviewed:</span> {new Date(request.reviewedAt).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-3 bg-primary-600 rounded-md">
                                                    <p className="text-sm text-gray-300">
                                                        <span className="font-semibold text-gray-100">Reason:</span> {request.reason}
                                                    </p>
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
                                                        Approve & Terminate
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Details Modal */}
                {showDetailsModal && selectedRequest && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-primary-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-primary-600">
                            <div className="sticky top-0 bg-primary-800 border-b border-primary-600 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold font-sans text-gray-100">Leave Request Details</h2>
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
                                {(() => {
                                    const producer = findProducerById(selectedRequest.producerId);
                                    const anchor = findAnchorById(selectedRequest.anchorId);

                                    return (
                                        <>
                                            {/* Producer Information */}
                                            <div>
                                                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-3">Producer Information</h3>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-gray-400">Name:</span>
                                                        <p className="text-gray-100">{selectedRequest.producerName}</p>
                                                    </div>
                                                    {producer && (
                                                        <>
                                                            <div>
                                                                <span className="text-gray-400">Farm:</span>
                                                                <p className="text-gray-100">{producer.formData.farmBusinessName}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-400">Phone:</span>
                                                                <p className="text-gray-100">{producer.formData.phone}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-400">Location:</span>
                                                                <p className="text-gray-100">{producer.formData.city}, {producer.formData.state}</p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Anchor Information */}
                                            <div>
                                                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-3">Anchor Information</h3>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-gray-400">Organization:</span>
                                                        <p className="text-gray-100">{selectedRequest.anchorName}</p>
                                                    </div>
                                                    {anchor && (
                                                        <>
                                                            <div>
                                                                <span className="text-gray-400">Industry:</span>
                                                                <p className="text-gray-100">{anchor.formData.industry}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-400">Contact:</span>
                                                                <p className="text-gray-100">{anchor.formData.fullName}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-400">Phone:</span>
                                                                <p className="text-gray-100">{anchor.formData.officePhone}</p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Leave Request Details */}
                                            <div>
                                                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-3">Request Details</h3>
                                                <div className="space-y-3 text-sm">
                                                    <div>
                                                        <span className="text-gray-400">Reason for Leaving:</span>
                                                        <p className="text-gray-100 mt-1 p-3 bg-primary-700 rounded">{selectedRequest.reason}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Submitted:</span>
                                                        <p className="text-gray-100">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                                                    </div>
                                                    {selectedRequest.meProjectId && (
                                                        <div>
                                                            <span className="text-gray-400">M&E Project ID:</span>
                                                            <p className="text-gray-100">{selectedRequest.meProjectId}</p>
                                                        </div>
                                                    )}
                                                    {selectedRequest.reviewedAt && (
                                                        <div>
                                                            <span className="text-gray-400">Reviewed:</span>
                                                            <p className="text-gray-100">{new Date(selectedRequest.reviewedAt).toLocaleString()}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}

                {/* Reject Modal */}
                {showRejectModal && selectedRequest && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-primary-800 rounded-lg max-w-md w-full border border-primary-600">
                            <div className="px-6 py-4 border-b border-primary-600 flex justify-between items-center">
                                <h2 className="text-lg font-bold font-sans text-gray-100">Reject Leave Request</h2>
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
                        sourceId={selectedRequest.producerId}
                        sourceName={selectedRequest.producerName}
                        submissionData={{
                            producerName: selectedRequest.producerName,
                            anchorName: selectedRequest.anchorName,
                            leaveReason: selectedRequest.reason,
                            leaveRequestId: selectedRequest.id,
                            relationshipId: selectedRequest.relationshipId,
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

export default LeaveRequests;
