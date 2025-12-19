import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../../../components/PortalLayout';
import { getActiveProducerRecord, findAnchorById } from '../../../../utils/localDatabase';
import { getRelationshipsByProducer, AnchorProducerRelationship } from '../../../../utils/relationshipDatabase';

const CurrentAnchors: React.FC = () => {
    const navigate = useNavigate();
    const [producerRecord, setProducerRecord] = useState<any>(null);
    const [relationships, setRelationships] = useState<AnchorProducerRelationship[]>([]);
    const [selectedAnchor, setSelectedAnchor] = useState<any>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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
        const rels = getRelationshipsByProducer(producerId);
        setRelationships(rels);
    };

    const getAnchorData = (anchorId: string) => {
        return findAnchorById(anchorId);
    };

    const activeRelationships = relationships.filter(r => r.status === 'active');
    const pendingRelationships = relationships.filter(r =>
        r.status === 'pending-ca-approval' || r.status === 'invitation-sent'
    );

    const allAnchorsWithData = relationships.map(rel => ({
        relationship: rel,
        anchor: getAnchorData(rel.anchorId),
    })).filter(item => item.anchor !== undefined);

    const filteredAnchors = allAnchorsWithData.filter(item => {
        if (!item.anchor) return false;
        const searchLower = searchQuery.toLowerCase();
        return (
            item.anchor.formData.organizationName.toLowerCase().includes(searchLower) ||
            item.anchor.formData.fullName.toLowerCase().includes(searchLower) ||
            item.anchor.formData.industry.toLowerCase().includes(searchLower)
        );
    });

    const getStatusBadge = (status: string) => {
        const badges: Record<string, string> = {
            'active': 'bg-green-500 text-white',
            'pending-ca-approval': 'bg-yellow-500 text-white',
            'invitation-sent': 'bg-blue-500 text-white',
            'pending-termination': 'bg-orange-500 text-white',
            'terminated': 'bg-gray-500 text-white',
        };
        return badges[status] || 'bg-gray-500 text-white';
    };

    const getStatusText = (status: string) => {
        const texts: Record<string, string> = {
            'active': 'Active',
            'pending-ca-approval': 'Pending CA Approval',
            'invitation-sent': 'Invitation Sent',
            'pending-termination': 'Pending Termination',
            'terminated': 'Terminated',
        };
        return texts[status] || status;
    };

    return (
        <PortalLayout role="Producer/Farmer" roleIcon="🌾" sidebarItems={sidebarItems}>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold font-sans mb-2">My Anchor Relationships</h1>
                    <p className="text-gray-200 font-serif">
                        View and manage your relationships with anchor organizations.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Active Anchors</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{activeRelationships.length}</p>
                            </div>
                            <div className="text-3xl">⚓</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Pending Invitations</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{pendingRelationships.length}</p>
                            </div>
                            <div className="text-3xl">📨</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Total Relationships</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{relationships.length}</p>
                            </div>
                            <div className="text-3xl">🤝</div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="card">
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
                </div>

                {/* Quick Actions */}
                <div className="card">
                    <h2 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => navigate('/portal/producer/anchor-relationships/invitations')}
                            className="btn-primary text-center"
                        >
                            📨 View Invitations
                        </button>
                        <button
                            onClick={() => navigate('/portal/producer/anchor-relationships/leave')}
                            className="btn-secondary text-center"
                        >
                            🚪 Request to Leave
                        </button>
                        <button
                            onClick={() => navigate('/portal/producer/anchor-relationships/history')}
                            className="btn-secondary text-center"
                        >
                            📜 View History
                        </button>
                    </div>
                </div>

                {/* Anchors List */}
                <div className="card">
                    <h2 className="text-xl font-bold font-sans text-gray-100 mb-4">
                        My Anchors ({filteredAnchors.length})
                    </h2>

                    {filteredAnchors.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">⚓</div>
                            <p className="text-gray-400 font-serif mb-4">
                                {relationships.length === 0
                                    ? 'You are not currently associated with any anchor organizations.'
                                    : 'No anchors match your search criteria.'}
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
                            {filteredAnchors.map(({ relationship, anchor }) => {
                                if (!anchor) return null; // Type guard

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
                                                        <span className="text-gray-400">Joined:</span> {new Date(relationship.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>

                                                {relationship.approvedAt && (
                                                    <div className="mt-2 text-sm text-gray-400">
                                                        <span className="font-medium">Approved:</span> {new Date(relationship.approvedAt).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedAnchor(anchor);
                                                        setShowDetailsModal(true);
                                                    }}
                                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-md font-medium text-sm"
                                                >
                                                    View Details
                                                </button>

                                                {relationship.status === 'active' && (
                                                    <>
                                                        <button
                                                            onClick={() => navigate('/portal/producer/anchor-relationships/communication')}
                                                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium text-sm"
                                                        >
                                                            Send Message
                                                        </button>
                                                        <button
                                                            onClick={() => navigate('/portal/producer/anchor-relationships/leave', {
                                                                state: { anchorId: anchor.id, anchorName: anchor.formData.organizationName }
                                                            })}
                                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium text-sm"
                                                        >
                                                            Request to Leave
                                                        </button>
                                                    </>
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

                <div className="mt-2 text-center text-xs text-gray-400 font-serif opacity-80">
                    Powered by Mc. George
                </div>
            </div>
        </PortalLayout>
    );
};

export default CurrentAnchors;
