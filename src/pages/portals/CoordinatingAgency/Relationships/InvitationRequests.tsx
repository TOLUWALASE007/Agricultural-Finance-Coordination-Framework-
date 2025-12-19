import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../../../components/PortalLayout';
import {
    getRelationships,
    updateRelationship,
    AnchorProducerRelationship
} from '../../../../utils/relationshipDatabase';
import { findAnchorById, findProducerById } from '../../../../utils/localDatabase';
import { useNotifications } from '../../../../context/NotificationContext';

const InvitationRequests: React.FC = () => {
    const navigate = useNavigate();
    const { addNotification, updateNotificationStatus } = useNotifications();
    const [requests, setRequests] = useState<AnchorProducerRelationship[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<AnchorProducerRelationship | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending-ca-approval' | 'invitation-sent' | 'invitation-declined'>('all');

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
        const allRelationships = getRelationships();
        // Get relationships that are invitation requests (pending CA approval or already sent/declined)
        const invitationRequests = allRelationships.filter(r =>
            r.status === 'pending-ca-approval' ||
            r.status === 'invitation-sent' ||
            r.status === 'invitation-declined'
        );
        setRequests(invitationRequests);
    };

    const filteredRequests = requests.filter(req => {
        const anchor = findAnchorById(req.anchorId);
        const producer = findProducerById(req.producerId);

        const matchesSearch =
            anchor?.formData.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            producer?.formData.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            producer?.formData.farmBusinessName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = filterStatus === 'all' || req.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const handleApproveInvitation = (request: AnchorProducerRelationship) => {
        const anchor = findAnchorById(request.anchorId);
        const producer = findProducerById(request.producerId);

        if (!anchor || !producer) {
            alert('Anchor or Producer information not found.');
            return;
        }

        const confirmApprove = window.confirm(
            `Approve invitation from ${anchor.formData.organizationName} to ${producer.formData.fullName}?\n\nThis will send the invitation to the producer for acceptance.`
        );

        if (!confirmApprove) return;

        try {
            // Update relationship status to invitation-sent
            updateRelationship(request.id, {
                status: 'invitation-sent',
                invitationSentAt: new Date().toISOString(),
            });

            // Notify producer of invitation
            addNotification({
                role: '🏛️ Coordinating Agency',
                targetRole: 'producer',
                message: `You have received an invitation from ${anchor.formData.organizationName} to join their network.`,
                relationshipId: request.id,
                producerId: producer.id,
                producerName: producer.formData.fullName,
                anchorId: anchor.id,
                anchorName: anchor.formData.organizationName,
                metadata: {
                    type: 'producer-invitation',
                    relationshipId: request.id,
                    producerId: producer.id,  // Added this line
                    anchorId: anchor.id,      // Added this line for consistency
                },
            });

            // Notify anchor that invitation was sent
            addNotification({
                role: '🏛️ Coordinating Agency',
                targetRole: 'anchor',
                message: `Your invitation to ${producer.formData.fullName} has been approved and sent.`,
                relationshipId: request.id,
                anchorId: anchor.id,
                producerId: producer.id,
                producerName: producer.formData.fullName,
                metadata: {
                    type: 'invitation-approved',
                    relationshipId: request.id,
                    anchorId: anchor.id,      // Added this line
                    producerId: producer.id,  // Added this line for consistency
                },
            });

            loadRequests();
            alert('Invitation approved and sent to producer!');
        } catch (error: any) {
            console.error('Error approving invitation:', error);
            alert(error.message || 'Failed to approve invitation.');
        }
    };

    const handleApproveAcceptance = (request: AnchorProducerRelationship) => {
        const anchor = findAnchorById(request.anchorId);
        const producer = findProducerById(request.producerId);

        if (!anchor || !producer) {
            alert('Anchor or Producer information not found.');
            return;
        }

        const confirmApprove = window.confirm(
            `Approve the relationship between ${anchor.formData.organizationName} and ${producer.formData.fullName}?\n\nThis will establish an active relationship.`
        );

        if (!confirmApprove) return;

        try {
            // Update relationship status to active
            updateRelationship(request.id, {
                status: 'active',
                approvedAt: new Date().toISOString(),
            });

            // Notify producer
            addNotification({
                role: '🏛️ Coordinating Agency',
                targetRole: 'producer',
                message: `Your relationship with ${anchor.formData.organizationName} has been approved and is now active!`,
                relationshipId: request.id,
                producerId: producer.id,
                anchorId: anchor.id,
                anchorName: anchor.formData.organizationName,
                metadata: {
                    type: 'relationship-approved',
                    relationshipId: request.id,
                },
            });

            // Notify anchor
            addNotification({
                role: '🏛️ Coordinating Agency',
                targetRole: 'anchor',
                message: `Your relationship with ${producer.formData.fullName} has been approved and is now active!`,
                relationshipId: request.id,
                anchorId: anchor.id,
                producerId: producer.id,
                producerName: producer.formData.fullName,
                metadata: {
                    type: 'relationship-approved',
                    relationshipId: request.id,
                },
            });

            loadRequests();
            alert('Relationship approved and activated!');
        } catch (error: any) {
            console.error('Error approving relationship:', error);
            alert(error.message || 'Failed to approve relationship.');
        }
    };

    const handleReject = () => {
        if (!selectedRequest || !rejectionReason.trim()) {
            alert('Please provide a rejection reason.');
            return;
        }

        const anchor = findAnchorById(selectedRequest.anchorId);
        const producer = findProducerById(selectedRequest.producerId);

        if (!anchor || !producer) {
            alert('Anchor or Producer information not found.');
            return;
        }

        try {
            // Update relationship status to rejected
            updateRelationship(selectedRequest.id, {
                status: 'rejected',
                rejectionReason: rejectionReason,
            });

            // Notify anchor
            addNotification({
                role: '🏛️ Coordinating Agency',
                targetRole: 'anchor',
                message: `Your invitation request to ${producer.formData.fullName} has been rejected.`,
                relationshipId: selectedRequest.id,
                anchorId: anchor.id,
                producerId: producer.id,
                producerName: producer.formData.fullName,
                metadata: {
                    type: 'invitation-rejected',
                    relationshipId: selectedRequest.id,
                    rejectionReason: rejectionReason,
                },
            });

            setShowRejectModal(false);
            setSelectedRequest(null);
            setRejectionReason('');
            loadRequests();
            alert('Invitation request rejected.');
        } catch (error: any) {
            console.error('Error rejecting invitation:', error);
            alert(error.message || 'Failed to reject invitation.');
        }
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, string> = {
            'pending-ca-approval': 'bg-yellow-500 text-white',
            'invitation-sent': 'bg-blue-500 text-white',
            'invitation-declined': 'bg-orange-500 text-white',
            'active': 'bg-green-500 text-white',
            'rejected': 'bg-red-500 text-white',
        };
        return badges[status] || 'bg-gray-500 text-white';
    };

    const getStatusText = (status: string) => {
        const texts: Record<string, string> = {
            'pending-ca-approval': 'Pending CA Approval',
            'invitation-sent': 'Invitation Sent',
            'invitation-declined': 'Producer Declined',
            'active': 'Active',
            'rejected': 'Rejected',
        };
        return texts[status] || status;
    };

    const pendingApprovalCount = requests.filter(r => r.status === 'pending-ca-approval' && !r.invitationSentAt).length;
    const pendingAcceptanceCount = requests.filter(r => r.status === 'pending-ca-approval' && r.invitationSentAt).length;
    const invitationSentCount = requests.filter(r => r.status === 'invitation-sent').length;
    const declinedCount = requests.filter(r => r.status === 'invitation-declined').length;

    return (
        <PortalLayout role="Coordinating Agency" roleIcon="🏛️" sidebarItems={sidebarItems}>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold font-sans mb-2">Invitation Requests</h1>
                    <p className="text-gray-200 font-serif">
                        Review and approve anchor invitation requests to producers. Monitor producer responses and establish relationships.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Pending Approval</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{pendingApprovalCount}</p>
                            </div>
                            <div className="text-3xl">⏳</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Awaiting Producer</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{invitationSentCount}</p>
                            </div>
                            <div className="text-3xl">📨</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Producer Accepted</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{pendingAcceptanceCount}</p>
                            </div>
                            <div className="text-3xl">✅</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Declined</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{declinedCount}</p>
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
                                placeholder="Search by anchor, producer, or farm..."
                                className="w-full px-4 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                            {['all', 'pending-ca-approval', 'invitation-sent', 'invitation-declined'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status as any)}
                                    className={`px-4 py-2 rounded-md font-medium text-sm whitespace-nowrap ${filterStatus === status
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
                        Invitation Requests ({filteredRequests.length})
                    </h2>

                    {filteredRequests.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📋</div>
                            <p className="text-gray-400 font-serif">No invitation requests found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredRequests.map((request) => {
                                const anchor = findAnchorById(request.anchorId);
                                const producer = findProducerById(request.producerId);

                                if (!anchor || !producer) return null;

                                const isAwaitingProducer = request.status === 'invitation-sent';
                                const isProducerAccepted = request.status === 'pending-ca-approval' && request.invitationSentAt;
                                const isPendingInitialApproval = request.status === 'pending-ca-approval' && !request.invitationSentAt;

                                return (
                                    <div
                                        key={request.id}
                                        className="p-4 bg-primary-700 rounded-lg border border-primary-600 hover:border-accent-500 transition-colors"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold font-sans text-gray-100">
                                                        {anchor.formData.organizationName} → {producer.formData.fullName}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                                                        {getStatusText(request.status)}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-300">
                                                    <div>
                                                        <span className="text-gray-400">Anchor Industry:</span> {anchor.formData.industry}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Producer Farm:</span> {producer.formData.farmBusinessName}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Farm Size:</span> {producer.formData.farmSize} hectares
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Created:</span> {new Date(request.createdAt).toLocaleDateString()}
                                                    </div>
                                                    {request.invitationSentAt && (
                                                        <div>
                                                            <span className="text-gray-400">Invitation Sent:</span> {new Date(request.invitationSentAt).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                    {request.approvedAt && (
                                                        <div>
                                                            <span className="text-gray-400">Approved:</span> {new Date(request.approvedAt).toLocaleDateString()}
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

                                                {request.status === 'invitation-declined' && request.invitationDeclinedAt && (
                                                    <div className="mt-2 p-2 bg-orange-900/20 border border-orange-500/30 rounded">
                                                        <p className="text-sm text-orange-400">
                                                            <span className="font-semibold">Producer declined on:</span> {new Date(request.invitationDeclinedAt).toLocaleDateString()}
                                                            {request.rejectionReason && ` - Reason: ${request.rejectionReason}`}
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

                                                {isPendingInitialApproval && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApproveInvitation(request)}
                                                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium text-sm"
                                                        >
                                                            Approve & Send Invitation
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedRequest(request);
                                                                setShowRejectModal(true);
                                                            }}
                                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium text-sm"
                                                        >
                                                            Reject Request
                                                        </button>
                                                    </>
                                                )}

                                                {isProducerAccepted && (
                                                    <button
                                                        onClick={() => handleApproveAcceptance(request)}
                                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium text-sm"
                                                    >
                                                        Approve Relationship
                                                    </button>
                                                )}

                                                {isAwaitingProducer && (
                                                    <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-md font-medium text-sm text-center">
                                                        Awaiting Producer Response
                                                    </span>
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
                                <h2 className="text-xl font-bold font-sans text-gray-100">Invitation Request Details</h2>
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
                                    const anchor = findAnchorById(selectedRequest.anchorId);
                                    const producer = findProducerById(selectedRequest.producerId);

                                    if (!anchor || !producer) return <p className="text-gray-400">Data not found</p>;

                                    return (
                                        <>
                                            {/* Anchor Information */}
                                            <div>
                                                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-3">Anchor Information</h3>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-gray-400">Organization:</span>
                                                        <p className="text-gray-100">{anchor.formData.organizationName}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Industry:</span>
                                                        <p className="text-gray-100">{anchor.formData.industry}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Contact Person:</span>
                                                        <p className="text-gray-100">{anchor.formData.fullName}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Phone:</span>
                                                        <p className="text-gray-100">{anchor.formData.officePhone}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Producer Information */}
                                            <div>
                                                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-3">Producer Information</h3>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-gray-400">Full Name:</span>
                                                        <p className="text-gray-100">{producer.formData.fullName}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Farm Business:</span>
                                                        <p className="text-gray-100">{producer.formData.farmBusinessName}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Phone:</span>
                                                        <p className="text-gray-100">{producer.formData.phone}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Farm Size:</span>
                                                        <p className="text-gray-100">{producer.formData.farmSize} hectares</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Crops:</span>
                                                        <p className="text-gray-100">{producer.formData.crops?.join(', ') || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Location:</span>
                                                        <p className="text-gray-100">{producer.formData.city}, {producer.formData.state}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Relationship Timeline */}
                                            <div>
                                                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-3">Timeline</h3>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-accent-400">•</span>
                                                        <span className="text-gray-300">Created: {new Date(selectedRequest.createdAt).toLocaleString()}</span>
                                                    </div>
                                                    {selectedRequest.invitationSentAt && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-accent-400">•</span>
                                                            <span className="text-gray-300">Invitation Sent: {new Date(selectedRequest.invitationSentAt).toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                    {selectedRequest.approvedAt && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-accent-400">•</span>
                                                            <span className="text-gray-300">Approved: {new Date(selectedRequest.approvedAt).toLocaleString()}</span>
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
                                <h2 className="text-lg font-bold font-sans text-gray-100">Reject Invitation Request</h2>
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

                <div className="mt-2 text-center text-xs text-gray-400 font-serif opacity-80">
                    Powered by Mc. George
                </div>
            </div>
        </PortalLayout>
    );
};

export default InvitationRequests;
