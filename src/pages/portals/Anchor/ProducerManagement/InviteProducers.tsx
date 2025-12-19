import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../../../components/PortalLayout';
import { getActiveAnchorRecord, getProducers } from '../../../../utils/localDatabase';
import {
    createRelationship,
    hasActiveRelationship,
    hasPendingInvitation
} from '../../../../utils/relationshipDatabase';
import { useNotifications } from '../../../../context/NotificationContext';

const InviteProducers: React.FC = () => {
    const navigate = useNavigate();
    const { addNotification } = useNotifications();
    const [anchorRecord, setAnchorRecord] = useState<any>(null);
    const [producers, setProducers] = useState<any[]>([]);
    const [selectedProducers, setSelectedProducers] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    useEffect(() => {
        const record = getActiveAnchorRecord();
        if (!record) {
            navigate('/portal/anchor');
            return;
        }
        setAnchorRecord(record);
        loadProducers(record.id);
    }, [navigate]);

    const loadProducers = (anchorId: string) => {
        // Get all verified producers
        const allProducers = getProducers().filter(p => p.status === 'verified');

        // Filter out producers who already have a relationship or pending invitation
        const availableProducers = allProducers.filter(p => {
            const hasActive = hasActiveRelationship(anchorId, p.id);
            const hasPending = hasPendingInvitation(anchorId, p.id);
            return !hasActive && !hasPending;
        });

        setProducers(availableProducers);
    };

    const filteredProducers = producers.filter(producer => {
        const searchLower = searchQuery.toLowerCase();
        return (
            producer.formData.fullName.toLowerCase().includes(searchLower) ||
            producer.formData.farmBusinessName.toLowerCase().includes(searchLower) ||
            producer.formData.phone.toLowerCase().includes(searchLower) ||
            (producer.formData.email && producer.formData.email.toLowerCase().includes(searchLower))
        );
    });

    const toggleProducerSelection = (producerId: string) => {
        const newSelection = new Set(selectedProducers);
        if (newSelection.has(producerId)) {
            newSelection.delete(producerId);
        } else {
            newSelection.add(producerId);
        }
        setSelectedProducers(newSelection);
    };

    const selectAll = () => {
        const allIds = new Set(filteredProducers.map(p => p.id));
        setSelectedProducers(allIds);
    };

    const deselectAll = () => {
        setSelectedProducers(new Set());
    };

    const handleSendInvitations = async () => {
        if (selectedProducers.size === 0) {
            alert('Please select at least one producer to invite.');
            return;
        }

        if (!anchorRecord) {
            alert('Anchor information not found.');
            return;
        }

        setIsSubmitting(true);

        try {
            const invitedProducers: string[] = [];

            // Create relationships for each selected producer
            selectedProducers.forEach(producerId => {
                const producer = producers.find(p => p.id === producerId);
                if (!producer) return;

                // Create relationship with pending-ca-approval status
                const relationship = createRelationship({
                    anchorId: anchorRecord.id,
                    producerId: producerId,
                    status: 'pending-ca-approval',
                    createdBy: 'anchor',
                });

                // Send notification to CA for approval
                addNotification({
                    role: '⚓ Anchor',
                    targetRole: 'coordinating-agency',
                    message: `${anchorRecord.formData.organizationName || anchorRecord.formData.fullName} wants to invite producer "${producer.formData.fullName}" to join their network.`,
                    relationshipId: relationship.id,
                    anchorId: anchorRecord.id,
                    anchorName: anchorRecord.formData.organizationName || anchorRecord.formData.fullName,
                    producerId: producerId,
                    producerName: producer.formData.fullName,
                    metadata: {
                        type: 'producer-invitation-request',
                        relationshipId: relationship.id,
                        anchorId: anchorRecord.id,
                        producerId: producerId,
                    },
                });

                invitedProducers.push(producer.formData.fullName);
            });

            alert(`Invitation requests sent to CA for ${invitedProducers.length} producer(s):\n${invitedProducers.join(', ')}\n\nThe CA will review and approve before sending invitations to the producers.`);

            // Reload producers and clear selection
            loadProducers(anchorRecord.id);
            setSelectedProducers(new Set());
        } catch (error: any) {
            console.error('Error sending invitations:', error);
            alert(error.message || 'Failed to send invitations. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PortalLayout role="Anchor" roleIcon="⚓" sidebarItems={sidebarItems}>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold font-sans mb-2">Invite Existing Producers/Farmers</h1>
                    <p className="text-gray-200 font-serif">
                        Select verified producers/farmers to invite to your anchor network. The CA will review your invitation requests before sending them to the producers.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Available Producers</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{producers.length}</p>
                            </div>
                            <div className="text-3xl">🌾</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Selected</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{selectedProducers.size}</p>
                            </div>
                            <div className="text-3xl">✅</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Filtered Results</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{filteredProducers.length}</p>
                            </div>
                            <div className="text-3xl">🔍</div>
                        </div>
                    </div>
                </div>

                {/* Search and Actions */}
                <div className="card">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, farm, phone, or email..."
                                className="w-full px-4 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={selectAll}
                                className="px-4 py-2 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md font-medium text-sm"
                                disabled={filteredProducers.length === 0}
                            >
                                Select All
                            </button>
                            <button
                                onClick={deselectAll}
                                className="px-4 py-2 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md font-medium text-sm"
                                disabled={selectedProducers.size === 0}
                            >
                                Deselect All
                            </button>
                        </div>
                    </div>
                </div>

                {/* Producers List */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold font-sans text-gray-100">
                            Available Producers ({filteredProducers.length})
                        </h2>
                        {selectedProducers.size > 0 && (
                            <button
                                onClick={handleSendInvitations}
                                disabled={isSubmitting}
                                className="px-6 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sending...' : `Send ${selectedProducers.size} Invitation${selectedProducers.size > 1 ? 's' : ''}`}
                            </button>
                        )}
                    </div>

                    {filteredProducers.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🌾</div>
                            <p className="text-gray-400 font-serif mb-2">
                                {producers.length === 0
                                    ? 'No available producers to invite at this time.'
                                    : 'No producers match your search criteria.'}
                            </p>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="text-accent-400 hover:text-accent-300 font-medium text-sm"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredProducers.map((producer) => (
                                <div
                                    key={producer.id}
                                    onClick={() => toggleProducerSelection(producer.id)}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedProducers.has(producer.id)
                                        ? 'bg-accent-500/10 border-accent-500'
                                        : 'bg-primary-700 border-primary-600 hover:border-accent-500/50'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <input
                                                type="checkbox"
                                                checked={selectedProducers.has(producer.id)}
                                                onChange={() => toggleProducerSelection(producer.id)}
                                                className="w-5 h-5 text-accent-500 bg-primary-700 border-primary-600 rounded focus:ring-accent-500"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-2">
                                                {producer.formData.fullName}
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-300">
                                                <div>
                                                    <span className="text-gray-400">Farm:</span> {producer.formData.farmBusinessName}
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Phone:</span> {producer.formData.phone}
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Farm Size:</span> {producer.formData.farmSize} hectares
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Location:</span> {producer.formData.city}, {producer.formData.state}
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Experience:</span> {producer.formData.yearsOfExperience} years
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Crops:</span> {producer.formData.crops?.slice(0, 2).join(', ')}
                                                    {producer.formData.crops?.length > 2 && ` +${producer.formData.crops.length - 2}`}
                                                </div>
                                            </div>

                                            {producer.formData.farmerAssociation && (
                                                <div className="mt-2 text-sm">
                                                    <span className="text-gray-400">Association:</span>{' '}
                                                    <span className="text-gray-300">{producer.formData.farmerAssociation}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-shrink-0">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                                                Verified
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="card bg-blue-900/20 border-blue-500/30">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">ℹ️</div>
                        <div>
                            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-2">How Invitations Work</h3>
                            <ul className="text-sm text-gray-300 space-y-1 font-serif">
                                <li>• Select the producers you want to invite to your network</li>
                                <li>• Your invitation requests will be sent to the Coordinating Agency for review</li>
                                <li>• Once approved by CA, invitations will be sent to the selected producers</li>
                                <li>• Producers can accept or decline your invitation</li>
                                <li>• If a producer accepts, CA will give final approval to establish the relationship</li>
                                <li>• You'll receive notifications at each step of the process</li>
                            </ul>
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

export default InviteProducers;
