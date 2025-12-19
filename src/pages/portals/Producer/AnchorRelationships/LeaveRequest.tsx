import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PortalLayout from '../../../../components/PortalLayout';
import { getActiveProducerRecord, findAnchorById } from '../../../../utils/localDatabase';
import {
    getActiveRelationshipsByProducer,
    createLeaveRequest,
    findRelationshipByAnchorAndProducer
} from '../../../../utils/relationshipDatabase';
import { useNotifications } from '../../../../context/NotificationContext';

const LeaveRequest: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addNotification } = useNotifications();
    const [producerRecord, setProducerRecord] = useState<any>(null);
    const [activeRelationships, setActiveRelationships] = useState<any[]>([]);
    const [selectedAnchorId, setSelectedAnchorId] = useState('');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        loadActiveRelationships(record.id);

        // Check if anchor was pre-selected from navigation state
        const state = location.state as any;
        if (state?.anchorId) {
            setSelectedAnchorId(state.anchorId);
        }
    }, [navigate, location]);

    const loadActiveRelationships = (producerId: string) => {
        const relationships = getActiveRelationshipsByProducer(producerId);
        const relationshipsWithAnchors = relationships.map(rel => ({
            relationship: rel,
            anchor: findAnchorById(rel.anchorId),
        })).filter(item => item.anchor !== undefined);

        setActiveRelationships(relationshipsWithAnchors);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedAnchorId) {
            alert('Please select an anchor to leave.');
            return;
        }

        if (!reason.trim()) {
            alert('Please provide a reason for leaving.');
            return;
        }

        if (!producerRecord) {
            alert('Producer information not found.');
            return;
        }

        const selectedRelationship = activeRelationships.find(
            item => item.relationship.anchorId === selectedAnchorId
        );

        if (!selectedRelationship) {
            alert('Relationship not found.');
            return;
        }

        const confirmLeave = window.confirm(
            `Are you sure you want to request to leave ${selectedRelationship.anchor.formData.organizationName}?\n\nThis request will be sent to the Coordinating Agency for review and M&E verification.`
        );

        if (!confirmLeave) return;

        setIsSubmitting(true);

        try {
            // Create the leave request
            const leaveRequest = createLeaveRequest({
                producerId: producerRecord.id,
                producerName: producerRecord.formData.fullName,
                anchorId: selectedAnchorId,
                anchorName: selectedRelationship.anchor.formData.organizationName,
                relationshipId: selectedRelationship.relationship.id,
                reason: reason,
            });

            // Send notification to CA
            const caNotificationId = addNotification({
                role: '🌾 Producer/Farmer',
                targetRole: 'coordinating-agency',
                message: `${producerRecord.formData.fullName} has requested to leave anchor "${selectedRelationship.anchor.formData.organizationName}".`,
                leaveRequestId: leaveRequest.id,
                producerId: producerRecord.id,
                producerName: producerRecord.formData.fullName,
                anchorId: selectedAnchorId,
                anchorName: selectedRelationship.anchor.formData.organizationName,
                metadata: {
                    type: 'producer-leave-request',
                    leaveRequestId: leaveRequest.id,
                    reason: reason,
                },
            });

            alert('Leave request submitted successfully!\n\nThe Coordinating Agency will review your request and initiate M&E verification. You will be notified of the decision.');

            setSelectedAnchorId('');
            setReason('');
            navigate('/portal/producer/anchor-relationships/current');
        } catch (error: any) {
            console.error('Error submitting leave request:', error);
            alert(error.message || 'Failed to submit leave request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PortalLayout role="Producer/Farmer" roleIcon="🌾" sidebarItems={sidebarItems}>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold font-sans mb-2">Request to Leave Anchor</h1>
                    <p className="text-gray-200 font-serif">
                        Submit a request to terminate your relationship with an anchor organization. The CA will review and verify your request.
                    </p>
                </div>

                {/* Info Box */}
                <div className="card bg-yellow-900/20 border-yellow-500/30">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">⚠️</div>
                        <div>
                            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-2">Important Information</h3>
                            <ul className="text-sm text-gray-300 space-y-1 font-serif">
                                <li>• Your leave request will be sent to the Coordinating Agency for review</li>
                                <li>• The CA will initiate an M&E verification process to validate your request</li>
                                <li>• M&E will verify your identity, current relationship status, and any pending obligations</li>
                                <li>• The CA will make a final decision based on the M&E report</li>
                                <li>• If approved, your relationship with the anchor will be terminated</li>
                                <li>• Both you and the anchor will be notified of the decision</li>
                                <li>• You can view the status of your request in the Relationship History section</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Form */}
                {activeRelationships.length === 0 ? (
                    <div className="card">
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">⚓</div>
                            <p className="text-gray-400 font-serif mb-4">
                                You don't have any active anchor relationships to leave.
                            </p>
                            <button
                                onClick={() => navigate('/portal/producer/anchor-relationships/current')}
                                className="btn-primary"
                            >
                                View My Anchors
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Select Anchor */}
                        <div className="card">
                            <h2 className="text-xl font-bold font-sans text-gray-100 mb-4">Select Anchor to Leave</h2>

                            <div className="space-y-3">
                                {activeRelationships.map(({ relationship, anchor }) => (
                                    <div
                                        key={relationship.id}
                                        onClick={() => setSelectedAnchorId(anchor.id)}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedAnchorId === anchor.id
                                            ? 'bg-accent-500/10 border-accent-500'
                                            : 'bg-primary-700 border-primary-600 hover:border-accent-500/50'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 mt-1">
                                                <input
                                                    type="radio"
                                                    name="anchor"
                                                    checked={selectedAnchorId === anchor.id}
                                                    onChange={() => setSelectedAnchorId(anchor.id)}
                                                    className="w-5 h-5 text-accent-500 bg-primary-700 border-primary-600 focus:ring-accent-500"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-2">
                                                    {anchor.formData.organizationName}
                                                </h3>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-300">
                                                    <div>
                                                        <span className="text-gray-400">Contact:</span> {anchor.formData.fullName}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Industry:</span> {anchor.formData.industry}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Location:</span> {anchor.formData.hqCity}, {anchor.formData.hqState}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Joined:</span> {new Date(relationship.createdAt).toLocaleDateString()}
                                                    </div>
                                                    {relationship.approvedAt && (
                                                        <div>
                                                            <span className="text-gray-400">Approved:</span> {new Date(relationship.approvedAt).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="card">
                            <h2 className="text-xl font-bold font-sans text-gray-100 mb-4">Reason for Leaving</h2>

                            <div>
                                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                    Please provide a detailed reason for your decision to leave <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={6}
                                    className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
                                    placeholder="Explain your reasons for leaving this anchor organization. This information will be reviewed by the Coordinating Agency and M&E team."
                                    required
                                />
                                <p className="text-xs text-gray-400 mt-2">
                                    Be clear and honest in your explanation. This will help the CA and M&E team process your request efficiently.
                                </p>
                            </div>
                        </div>

                        {/* Common Reasons */}
                        <div className="card bg-blue-900/20 border-blue-500/30">
                            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-3">Common Reasons for Leaving</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                                <div className="flex items-start gap-2">
                                    <span className="text-accent-400">•</span>
                                    <span>Better opportunities with another anchor</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-accent-400">•</span>
                                    <span>Dissatisfaction with support or services</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-accent-400">•</span>
                                    <span>Geographic relocation</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-accent-400">•</span>
                                    <span>Change in farming activities or scale</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-accent-400">•</span>
                                    <span>Payment or contract disputes</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-accent-400">•</span>
                                    <span>Personal or business reasons</span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="card">
                            <div className="flex flex-col sm:flex-row gap-4 justify-end">
                                <button
                                    type="button"
                                    onClick={() => navigate('/portal/producer/anchor-relationships/current')}
                                    className="px-6 py-3 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md font-medium"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitting || !selectedAnchorId || !reason.trim()}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Leave Request'}
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                <div className="mt-2 text-center text-xs text-gray-400 font-serif opacity-80">
                    Powered by Mc. George
                </div>
            </div>
        </PortalLayout>
    );
};

export default LeaveRequest;
