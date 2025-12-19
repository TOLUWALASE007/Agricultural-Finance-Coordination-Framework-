import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../../../components/PortalLayout';
import { getActiveProducerRecord, findAnchorById } from '../../../../utils/localDatabase';
import {
    getRelationshipsByProducer,
    updateRelationship,
    AnchorProducerRelationship
} from '../../../../utils/relationshipDatabase';
import { useNotifications } from '../../../../context/NotificationContext';

const Invitations: React.FC = () => {
    const navigate = useNavigate();
    const { addNotification, updateNotificationStatus } = useNotifications();
    const [producerRecord, setProducerRecord] = useState<any>(null);
    const [invitations, setInvitations] = useState<AnchorProducerRelationship[]>([]);
    const [selectedInvitation, setSelectedInvitation] = useState<AnchorProducerRelationship | null>(null);
    const [selectedAnchor, setSelectedAnchor] = useState<any>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [declineReason, setDeclineReason] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const sidebarItems = [
        { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/producer' },
        { id: 'scheme-application', name: 'Schemes Application', icon: '📝', href: '/portal/producer/scheme-application' },
        {
            id: 'anchor-relationships',
            name: 'Anchor Relationships',
            icon: '⚓',
            hasDropdown: true,
            dropdownItems: [
                { id: 'current-anchors', name: 'View Current Anchors', icon: '👁️', href: '/portal/producer/anchor-relationships/current' },
                { id: 'invitations', name: 'Accept/Decline Invitations', icon: '📨', href: '/portal/producer/anchor-relationships/invitations' },
                { id: 'leave-request', name: 'Request to Leave Anchor', icon: '🚪', href: '/portal/producer/anchor-relationships/leave' },
                { id: 'communication', name: 'Anchor Communication', icon: '💬', href: '/portal/producer/anchor-relationships/communication' },
                { id: 'history', name: 'Relationship History', icon: '📜', href: '/portal/producer/anchor-relationships/history' },
            ]
        },
        { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/producer/settings' }
    ];

    useEffect(() => {
        const record = getActiveProducerRecord();
        if (!record) {
            navigate('/portal/producer');
            return;
        }
        setProducerRecord(record);
        loadInvitations(record.id);
    }, [navigate]);

    const loadInvitations = (producerId: string) => {
        const relationships = getRelationshipsByProducer(producerId);
        const pendingInvitations = relationships.filter(r => r.status === 'invitation-sent');
        setInvitations(pendingInvitations);
    };

    const handleAccept = async (invitation: AnchorProducerRelationship) => {
        if (!producerRecord) return;

        const confirmAccept = window.confirm(
            `Are you sure you want to accept the invitation from ${findAnchorById(invitation.anchorId)?.formData.organizationName}?\n\nThis will send your acceptance to the Coordinating Agency for final approval.`
        );

        if (!confirmAccept) return;

        setIsProcessing(true);

        try {
            // Update relationship status - producer accepted, now pending CA final approval
            updateRelationship(invitation.id, {
                status: 'pending-ca-approval',
            });

            // Notify CA of producer's acceptance
            addNotification({
                role: '🌾 Producer/Farmer',
                targetRole: 'coordinating-agency',
                message: `${producerRecord.formData.fullName} has accepted the invitation from ${findAnchorById(invitation.anchorId)?.formData.organizationName}.`,
                relationshipId: invitation.id,
                producerId: producerRecord.id,
                producerName: producerRecord.formData.fullName,
                anchorId: invitation.anchorId,
                anchorName: findAnchorById(invitation.anchorId)?.formData.organizationName,
                metadata: {
                    type: 'producer-invitation-accepted',
                    relationshipId: invitation.id,
                },
            });

            // Notify anchor that producer accepted
            addNotification({
                role: '🌾 Producer/Farmer',
                targetRole: 'anchor',
                message: `${producerRecord.formData.fullName} has accepted your invitation. Awaiting CA final approval.`,
                relationshipId: invitation.id,
                producerId: producerRecord.id,
                producerName: producerRecord.formData.fullName,
                anchorId: invitation.anchorId,
                metadata: {
                    type: 'producer-invitation-accepted',
                    relationshipId: invitation.id,
                },
            });

            alert('Invitation accepted! Your acceptance has been sent to the Coordinating Agency for final approval.');
            loadInvitations(producerRecord.id);
        } catch (error: any) {
            console.error('Error accepting invitation:', error);
            alert(error.message || 'Failed to accept invitation. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDecline = async () => {
        if (!selectedInvitation || !producerRecord) return;

        if (!declineReason.trim()) {
            alert('Please provide a reason for declining.');
            return;
        }

        setIsProcessing(true);

        try {
            // Update relationship status to declined
            updateRelationship(selectedInvitation.id, {
                status: 'invitation-declined',
                rejectionReason: declineReason,
                invitationDeclinedAt: new Date().toISOString(),
            });

            // Notify CA of decline
            addNotification({
                role: '🌾 Producer/Farmer',
                targetRole: 'coordinating-agency',
                message: `${producerRecord.formData.fullName} has declined the invitation from ${findAnchorById(selectedInvitation.anchorId)?.formData.organizationName}.`,
                relationshipId: selectedInvitation.id,
                producerId: producerRecord.id,
                producerName: producerRecord.formData.fullName,
                anchorId: selectedInvitation.anchorId,
                anchorName: findAnchorById(selectedInvitation.anchorId)?.formData.organizationName,
                metadata: {
                    type: 'producer-invitation-declined',
                    relationshipId: selectedInvitation.id,
                    declineReason: declineReason,
                },
            });

            // Notify anchor of decline
            addNotification({
                role: '🌾 Producer/Farmer',
                targetRole: 'anchor',
                message: `${producerRecord.formData.fullName} has declined your invitation.`,
                relationshipId: selectedInvitation.id,
                producerId: producerRecord.id,
                producerName: producerRecord.formData.fullName,
                anchorId: selectedInvitation.anchorId,
                metadata: {
                    type: 'producer-invitation-declined',
                    relationshipId: selectedInvitation.id,
                    declineReason: declineReason,
                },
            });

            alert('Invitation declined. The anchor and CA have been notified.');
            setShowDeclineModal(false);
            setSelectedInvitation(null);
            setDeclineReason('');
            loadInvitations(producerRecord.id);
        } catch (error: any) {
            console.error('Error declining invitation:', error);
            alert(error.message || 'Failed to decline invitation. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const viewAnchorDetails = (invitation: AnchorProducerRelationship) => {
        const anchor = findAnchorById(invitation.anchorId);
        if (anchor) {
            setSelectedAnchor(anchor);
            setShowDetailsModal(true);
        }
    };

    return (
        <PortalLayout role="Producer/Farmer" roleIcon="🌾" sidebarItems={sidebarItems}>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold font-sans mb-2">Anchor Invitations</h1>
                    <p className="text-gray-200 font-serif">
                        Review and respond to invitations from anchor organizations.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Pending Invitations</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{invitations.length}</p>
                            </div>
                            <div className="text-3xl">📨</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Awaiting Your Response</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{invitations.length}</p>
                            </div>
                            <div className="text-3xl">⏳</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Action Required</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{invitations.length > 0 ? 'Yes' : 'No'}</p>
                            </div>
                            <div className="text-3xl">{invitations.length > 0 ? '🔔' : '✅'}</div>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="card bg-blue-900/20 border-blue-500/30">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">ℹ️</div>
                        <div>
                            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-2">How Invitations Work</h3>
                            <ul className="text-sm text-gray-300 space-y-1 font-serif">
                                <li>• Anchors send invitations after CA approval</li>
                                <li>• Review the anchor's details before accepting</li>
                                <li>• If you accept, CA will give final approval to establish the relationship</li>
                                <li>• If you decline, provide a reason so the anchor understands</li>
                                <li>• You can have multiple anchor relationships</li>
                                <li>• All parties are notified of your decision</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Invitations List */}
                <div className="card">
                    <h2 className="text-xl font-bold font-sans text-gray-100 mb-4">
                        Your Invitations ({invitations.length})
                    </h2>

                    {invitations.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-gray-400 font-serif mb-4">
                                You don't have any pending invitations at the moment.
                            </p>
                            <button
                                onClick={() => navigate('/portal/producer/anchor-relationships/current')}
                                className="btn-primary"
                            >
                                View Current Anchors
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {invitations.map((invitation) => {
                                const anchor = findAnchorById(invitation.anchorId);
                                if (!anchor) return null;

                                return (
                                    <div
                                        key={invitation.id}
                                        className="p-4 bg-primary-700 rounded-lg border-2 border-accent-500/50 hover:border-accent-500 transition-colors"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold font-sans text-gray-100">
                                                        {anchor.formData.organizationName}
                                                    </h3>
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                                                        New Invitation
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-300 mb-3">
                                                    <div>
                                                        <span className="text-gray-400">Contact Person:</span> {anchor.formData.fullName}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Industry:</span> {anchor.formData.industry}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Location:</span> {anchor.formData.hqCity}, {anchor.formData.hqState}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Phone:</span> {anchor.formData.officePhone}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Email:</span> {anchor.formData.officialEmail}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Invited:</span> {new Date(invitation.invitationSentAt || invitation.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>

                                                <p className="text-sm text-gray-400 italic">
                                                    "{anchor.formData.missionStatement}"
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-2 min-w-[200px]">
                                                <button
                                                    onClick={() => viewAnchorDetails(invitation)}
                                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-md font-medium text-sm"
                                                >
                                                    View Full Details
                                                </button>
                                                <button
                                                    onClick={() => handleAccept(invitation)}
                                                    disabled={isProcessing}
                                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    ✓ Accept Invitation
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedInvitation(invitation);
                                                        setShowDeclineModal(true);
                                                    }}
                                                    disabled={isProcessing}
                                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    ✗ Decline Invitation
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Anchor Details Modal */}
                {showDetailsModal && selectedAnchor && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-primary-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-primary-600">
                            <div className="sticky top-0 bg-primary-800 border-b border-primary-600 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold font-sans text-gray-100">Anchor Details</h2>
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedAnchor(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-200 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Organization Information */}
                                <div>
                                    <h3 className="text-lg font-semibold font-sans text-gray-100 mb-3">Organization Information</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400">Organization Name:</span>
                                            <p className="text-gray-100">{selectedAnchor.formData.organizationName}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Registration Number:</span>
                                            <p className="text-gray-100">{selectedAnchor.formData.registrationNumber}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Organization Type:</span>
                                            <p className="text-gray-100">{selectedAnchor.formData.organizationType}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Year Established:</span>
                                            <p className="text-gray-100">{selectedAnchor.formData.yearEstablished}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Industry:</span>
                                            <p className="text-gray-100">{selectedAnchor.formData.industry}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Number of Employees:</span>
                                            <p className="text-gray-100">{selectedAnchor.formData.numEmployees}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-400">Mission Statement:</span>
                                            <p className="text-gray-100">{selectedAnchor.formData.missionStatement}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div>
                                    <h3 className="text-lg font-semibold font-sans text-gray-100 mb-3">Contact Information</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400">Contact Person:</span>
                                            <p className="text-gray-100">{selectedAnchor.formData.fullName}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Position:</span>
                                            <p className="text-gray-100">{selectedAnchor.formData.position}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Office Phone:</span>
                                            <p className="text-gray-100">{selectedAnchor.formData.officePhone}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Official Email:</span>
                                            <p className="text-gray-100">{selectedAnchor.formData.officialEmail}</p>
                                        </div>
                                        {selectedAnchor.formData.website && (
                                            <div className="col-span-2">
                                                <span className="text-gray-400">Website:</span>
                                                <p className="text-gray-100">
                                                    <a href={selectedAnchor.formData.website} target="_blank" rel="noopener noreferrer" className="text-accent-400 hover:text-accent-300">
                                                        {selectedAnchor.formData.website}
                                                    </a>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <h3 className="text-lg font-semibold font-sans text-gray-100 mb-3">Headquarters Location</h3>
                                    <div className="text-sm text-gray-300">
                                        <p>{selectedAnchor.formData.headquartersAddress}</p>
                                        <p>{selectedAnchor.formData.hqCity}, {selectedAnchor.formData.hqState}</p>
                                        <p>{selectedAnchor.formData.hqCountry}</p>
                                    </div>
                                </div>

                                {/* Areas of Operation */}
                                <div>
                                    <h3 className="text-lg font-semibold font-sans text-gray-100 mb-3">Areas of Operation</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedAnchor.formData.areasOfOperation.map((area: string, index: number) => (
                                            <span key={index} className="px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-sm">
                                                {area}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Decline Modal */}
                {showDeclineModal && selectedInvitation && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-primary-800 rounded-lg max-w-md w-full border border-primary-600">
                            <div className="px-6 py-4 border-b border-primary-600 flex justify-between items-center">
                                <h2 className="text-lg font-bold font-sans text-gray-100">Decline Invitation</h2>
                                <button
                                    onClick={() => {
                                        setShowDeclineModal(false);
                                        setSelectedInvitation(null);
                                        setDeclineReason('');
                                    }}
                                    className="text-gray-400 hover:text-gray-200 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <p className="text-sm text-gray-300">
                                    Are you sure you want to decline the invitation from{' '}
                                    <span className="font-semibold text-gray-100">
                                        {findAnchorById(selectedInvitation.anchorId)?.formData.organizationName}
                                    </span>
                                    ?
                                </p>
                                <div>
                                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                        Reason for Declining <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        value={declineReason}
                                        onChange={(e) => setDeclineReason(e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
                                        placeholder="Please provide a reason for declining this invitation..."
                                    />
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => {
                                            setShowDeclineModal(false);
                                            setSelectedInvitation(null);
                                            setDeclineReason('');
                                        }}
                                        className="px-4 py-2 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md font-medium"
                                        disabled={isProcessing}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDecline}
                                        disabled={isProcessing || !declineReason.trim()}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isProcessing ? 'Declining...' : 'Decline Invitation'}
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

export default Invitations;
