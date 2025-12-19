import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../../../components/PortalLayout';
import { getActiveProducerRecord, findAnchorById } from '../../../../utils/localDatabase';
import { getRelationshipsByProducer, AnchorProducerRelationship } from '../../../../utils/relationshipDatabase';

const RelationshipHistory: React.FC = () => {
    const navigate = useNavigate();
    const [producerRecord, setProducerRecord] = useState<any>(null);
    const [relationships, setRelationships] = useState<AnchorProducerRelationship[]>([]);
    const [selectedRelationship, setSelectedRelationship] = useState<AnchorProducerRelationship | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'terminated' | 'declined'>('all');

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
        loadRelationships(record.id);
    }, [navigate]);

    const loadRelationships = (producerId: string) => {
        const allRelationships = getRelationshipsByProducer(producerId);
        setRelationships(allRelationships);
    };

    const filteredRelationships = relationships.filter(rel => {
        const anchor = findAnchorById(rel.anchorId);
        if (!anchor) return false;

        const matchesSearch =
            anchor.formData.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            anchor.formData.industry.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesFilter = true;
        if (filterStatus !== 'all') {
            if (filterStatus === 'active') {
                matchesFilter = rel.status === 'active';
            } else if (filterStatus === 'terminated') {
                matchesFilter = rel.status === 'terminated';
            } else if (filterStatus === 'declined') {
                matchesFilter = rel.status === 'invitation-declined';
            }
        }

        return matchesSearch && matchesFilter;
    });

    const getStatusBadge = (status: string) => {
        const badges: Record<string, string> = {
            'active': 'bg-green-500 text-white',
            'pending-ca-approval': 'bg-yellow-500 text-white',
            'invitation-sent': 'bg-blue-500 text-white',
            'invitation-declined': 'bg-orange-500 text-white',
            'pending-termination': 'bg-yellow-500 text-white',
            'terminated': 'bg-gray-500 text-white',
            'rejected': 'bg-red-500 text-white',
        };
        return badges[status] || 'bg-gray-500 text-white';
    };

    const getStatusText = (status: string) => {
        const texts: Record<string, string> = {
            'active': 'Active',
            'pending-ca-approval': 'Pending CA Approval',
            'invitation-sent': 'Invitation Sent',
            'invitation-declined': 'Invitation Declined',
            'pending-termination': 'Pending Termination',
            'terminated': 'Terminated',
            'rejected': 'Rejected',
        };
        return texts[status] || status;
    };

    const activeCount = relationships.filter(r => r.status === 'active').length;
    const terminatedCount = relationships.filter(r => r.status === 'terminated').length;
    const declinedCount = relationships.filter(r => r.status === 'invitation-declined').length;

    return (
        <PortalLayout role="Producer/Farmer" roleIcon="🌾" sidebarItems={sidebarItems}>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold font-sans mb-2">Relationship History</h1>
                    <p className="text-gray-200 font-serif">
                        View your complete history of anchor relationships, including active, terminated, and declined invitations.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Total Relationships</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{relationships.length}</p>
                            </div>
                            <div className="text-3xl">📊</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Active</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{activeCount}</p>
                            </div>
                            <div className="text-3xl">✅</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Terminated</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{terminatedCount}</p>
                            </div>
                            <div className="text-3xl">🔚</div>
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
                                placeholder="Search by anchor name or industry..."
                                className="w-full px-4 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            {['all', 'active', 'terminated', 'declined'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status as any)}
                                    className={`px-4 py-2 rounded-md font-medium text-sm ${filterStatus === status
                                        ? 'bg-accent-500 text-white'
                                        : 'bg-primary-700 text-gray-300 hover:bg-primary-600'
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Relationship History List */}
                <div className="card">
                    <h2 className="text-xl font-bold font-sans text-gray-100 mb-4">
                        All Relationships ({filteredRelationships.length})
                    </h2>

                    {filteredRelationships.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📜</div>
                            <p className="text-gray-400 font-serif mb-4">
                                {relationships.length === 0
                                    ? 'No relationship history found.'
                                    : 'No relationships match your search criteria.'}
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
                        <div className="space-y-4">
                            {filteredRelationships.map((relationship) => {
                                const anchor = findAnchorById(relationship.anchorId);
                                if (!anchor) return null;

                                return (
                                    <div
                                        key={relationship.id}
                                        className="p-4 bg-primary-700 rounded-lg border border-primary-600 hover:border-accent-500 transition-colors"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold font-sans text-gray-100">
                                                        {anchor.formData.organizationName}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(relationship.status)}`}>
                                                        {getStatusText(relationship.status)}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-300">
                                                    <div>
                                                        <span className="text-gray-400">Industry:</span> {anchor.formData.industry}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Location:</span> {anchor.formData.hqCity}, {anchor.formData.hqState}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Created:</span> {new Date(relationship.createdAt).toLocaleDateString()}
                                                    </div>
                                                    {relationship.approvedAt && (
                                                        <div>
                                                            <span className="text-gray-400">Approved:</span> {new Date(relationship.approvedAt).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                    {relationship.terminatedAt && (
                                                        <div>
                                                            <span className="text-gray-400">Terminated:</span> {new Date(relationship.terminatedAt).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                    {relationship.invitationSentAt && (
                                                        <div>
                                                            <span className="text-gray-400">Invited:</span> {new Date(relationship.invitationSentAt).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </div>

                                                {relationship.terminationReason && (
                                                    <div className="mt-2 p-2 bg-gray-900/20 border border-gray-500/30 rounded">
                                                        <p className="text-sm text-gray-400">
                                                            <span className="font-semibold">Termination Reason:</span> {relationship.terminationReason}
                                                        </p>
                                                    </div>
                                                )}

                                                {relationship.rejectionReason && (
                                                    <div className="mt-2 p-2 bg-red-900/20 border border-red-500/30 rounded">
                                                        <p className="text-sm text-red-400">
                                                            <span className="font-semibold">Rejection Reason:</span> {relationship.rejectionReason}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedRelationship(relationship);
                                                        setShowDetailsModal(true);
                                                    }}
                                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-md font-medium text-sm"
                                                >
                                                    View Timeline
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Timeline Modal */}
                {showDetailsModal && selectedRelationship && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-primary-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-primary-600">
                            <div className="sticky top-0 bg-primary-800 border-b border-primary-600 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold font-sans text-gray-100">Relationship Timeline</h2>
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedRelationship(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-200 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="p-6">
                                {(() => {
                                    const anchor = findAnchorById(selectedRelationship.anchorId);
                                    if (!anchor) return <p className="text-gray-400">Anchor data not found</p>;

                                    return (
                                        <div className="space-y-6">
                                            {/* Anchor Info */}
                                            <div>
                                                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-2">
                                                    {anchor.formData.organizationName}
                                                </h3>
                                                <p className="text-sm text-gray-400">{anchor.formData.industry}</p>
                                            </div>

                                            {/* Timeline */}
                                            <div>
                                                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Timeline</h3>
                                                <div className="space-y-4">
                                                    {/* Created */}
                                                    <div className="flex gap-4">
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-3 h-3 rounded-full bg-accent-500"></div>
                                                            <div className="w-0.5 h-full bg-accent-500/30"></div>
                                                        </div>
                                                        <div className="flex-1 pb-4">
                                                            <p className="text-sm font-semibold text-gray-100">Relationship Created</p>
                                                            <p className="text-xs text-gray-400">{new Date(selectedRelationship.createdAt).toLocaleString()}</p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Created by: {selectedRelationship.createdBy === 'anchor' ? 'Anchor' : 'Producer'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Invitation Sent */}
                                                    {selectedRelationship.invitationSentAt && (
                                                        <div className="flex gap-4">
                                                            <div className="flex flex-col items-center">
                                                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                                                <div className="w-0.5 h-full bg-blue-500/30"></div>
                                                            </div>
                                                            <div className="flex-1 pb-4">
                                                                <p className="text-sm font-semibold text-gray-100">Invitation Sent</p>
                                                                <p className="text-xs text-gray-400">{new Date(selectedRelationship.invitationSentAt).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Approved */}
                                                    {selectedRelationship.approvedAt && (
                                                        <div className="flex gap-4">
                                                            <div className="flex flex-col items-center">
                                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                                <div className="w-0.5 h-full bg-green-500/30"></div>
                                                            </div>
                                                            <div className="flex-1 pb-4">
                                                                <p className="text-sm font-semibold text-gray-100">Relationship Approved</p>
                                                                <p className="text-xs text-gray-400">{new Date(selectedRelationship.approvedAt).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Terminated */}
                                                    {selectedRelationship.terminatedAt && (
                                                        <div className="flex gap-4">
                                                            <div className="flex flex-col items-center">
                                                                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-semibold text-gray-100">Relationship Terminated</p>
                                                                <p className="text-xs text-gray-400">{new Date(selectedRelationship.terminatedAt).toLocaleString()}</p>
                                                                {selectedRelationship.terminationReason && (
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        Reason: {selectedRelationship.terminationReason}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Declined */}
                                                    {selectedRelationship.status === 'invitation-declined' && (
                                                        <div className="flex gap-4">
                                                            <div className="flex flex-col items-center">
                                                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-semibold text-gray-100">Invitation Declined</p>
                                                                {selectedRelationship.invitationDeclinedAt && (
                                                                    <p className="text-xs text-gray-400">{new Date(selectedRelationship.invitationDeclinedAt).toLocaleString()}</p>
                                                                )}
                                                                {selectedRelationship.rejectionReason && (
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        Reason: {selectedRelationship.rejectionReason}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Current Status */}
                                            <div className="p-4 bg-primary-700 rounded-lg">
                                                <p className="text-sm text-gray-400 mb-1">Current Status</p>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedRelationship.status)}`}>
                                                    {getStatusText(selectedRelationship.status)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })()}
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

export default RelationshipHistory;
