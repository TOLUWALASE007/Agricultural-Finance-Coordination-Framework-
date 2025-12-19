import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../../../components/PortalLayout';
import { getActiveAnchorRecord, getProducers, findProducerById } from '../../../../utils/localDatabase';
import {
    getRelationshipsByAnchor,
    getCreationRequestsByAnchor,
    AnchorProducerRelationship,
    ProducerCreationRequest
} from '../../../../utils/relationshipDatabase';

const ManageProducers: React.FC = () => {
    const navigate = useNavigate();
    const [anchorRecord, setAnchorRecord] = useState<any>(null);
    const [relationships, setRelationships] = useState<AnchorProducerRelationship[]>([]);
    const [creationRequests, setCreationRequests] = useState<ProducerCreationRequest[]>([]);
    const [selectedProducer, setSelectedProducer] = useState<any>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'terminated'>('all');

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
        loadData(record.id);
    }, [navigate]);

    const loadData = (anchorId: string) => {
        const rels = getRelationshipsByAnchor(anchorId);
        setRelationships(rels);

        const requests = getCreationRequestsByAnchor(anchorId);
        setCreationRequests(requests);
    };

    const getProducerData = (producerId: string) => {
        return findProducerById(producerId);
    };

    const getCreationRequestData = (requestId: string) => {
        return creationRequests.find(r => r.id === requestId);
    };

    // Combine active relationships and pending creation requests
    const allProducers = [
        ...relationships.map(rel => ({
            type: 'relationship' as const,
            id: rel.id,
            producerId: rel.producerId,
            status: rel.status,
            createdAt: rel.createdAt,
            producer: getProducerData(rel.producerId),
        })),
        ...creationRequests
            .filter(req => req.status === 'pending-ca' || req.status === 'pending-me')
            .map(req => ({
                type: 'creation-request' as const,
                id: req.id,
                status: req.status,
                createdAt: req.createdAt,
                producerData: req.requestedProducerData,
            })),
    ];

    const filteredProducers = allProducers.filter(item => {
        let matchesSearch = false;

        if (item.type === 'relationship' && item.producer) {
            matchesSearch =
                item.producer.formData.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.producer.formData.farmBusinessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.producer.formData.phone.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (item.type === 'creation-request') {
            matchesSearch =
                item.producerData.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.producerData.farmBusinessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.producerData.phone.toLowerCase().includes(searchQuery.toLowerCase());
        }

        let matchesFilter = true;
        if (filterStatus !== 'all') {
            if (filterStatus === 'active') {
                matchesFilter = item.type === 'relationship' && item.status === 'active';
            } else if (filterStatus === 'pending') {
                matchesFilter = item.type === 'creation-request' ||
                    (item.type === 'relationship' && (item.status === 'pending-ca-approval' || item.status === 'invitation-sent'));
            } else if (filterStatus === 'terminated') {
                matchesFilter = item.type === 'relationship' && item.status === 'terminated';
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
            'pending-ca': 'bg-yellow-500 text-white',
            'pending-me': 'bg-blue-500 text-white',
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
            'pending-ca': 'Pending CA Review',
            'pending-me': 'Pending M&E Verification',
        };
        return texts[status] || status;
    };

    const activeCount = relationships.filter(r => r.status === 'active').length;
    const pendingCount = creationRequests.filter(r => r.status === 'pending-ca' || r.status === 'pending-me').length;
    const invitationCount = relationships.filter(r => r.status === 'invitation-sent').length;

    return (
        <PortalLayout role="Anchor" roleIcon="⚓" sidebarItems={sidebarItems}>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold font-sans mb-2">Manage Producers/Farmers</h1>
                    <p className="text-gray-200 font-serif">
                        View and manage all producers/farmers under your anchor organization.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Active Producers</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{activeCount}</p>
                            </div>
                            <div className="text-3xl">✅</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Pending Creation</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{pendingCount}</p>
                            </div>
                            <div className="text-3xl">⏳</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Invitations Sent</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{invitationCount}</p>
                            </div>
                            <div className="text-3xl">📨</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Total</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{allProducers.length}</p>
                            </div>
                            <div className="text-3xl">🌾</div>
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
                                placeholder="Search by name, farm, or phone..."
                                className="w-full px-4 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            {['all', 'active', 'pending', 'terminated'].map((status) => (
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

                {/* Quick Actions */}
                <div className="card">
                    <h2 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => navigate('/portal/anchor/producer-management/create')}
                            className="btn-primary text-center"
                        >
                            ➕ Create New Producer
                        </button>
                        <button
                            onClick={() => navigate('/portal/anchor/producer-management/invite')}
                            className="btn-secondary text-center"
                        >
                            📨 Invite Existing Producers
                        </button>
                        <button
                            onClick={() => navigate('/portal/anchor/producer-management/logs')}
                            className="btn-secondary text-center"
                        >
                            📋 View Activity Logs
                        </button>
                    </div>
                </div>

                {/* Producers List */}
                <div className="card">
                    <h2 className="text-xl font-bold font-sans text-gray-100 mb-4">
                        Producers/Farmers ({filteredProducers.length})
                    </h2>

                    {filteredProducers.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🌾</div>
                            <p className="text-gray-400 font-serif mb-4">No producers found</p>
                            <button
                                onClick={() => navigate('/portal/anchor/producer-management/create')}
                                className="btn-primary"
                            >
                                Create Your First Producer
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredProducers.map((item) => {
                                const isRelationship = item.type === 'relationship';
                                const name = isRelationship && item.producer
                                    ? item.producer.formData.fullName
                                    : item.type === 'creation-request'
                                        ? item.producerData.fullName
                                        : 'Unknown';

                                const farmName = isRelationship && item.producer
                                    ? item.producer.formData.farmBusinessName
                                    : item.type === 'creation-request'
                                        ? item.producerData.farmBusinessName
                                        : 'Unknown';

                                const phone = isRelationship && item.producer
                                    ? item.producer.formData.phone
                                    : item.type === 'creation-request'
                                        ? item.producerData.phone
                                        : 'Unknown';

                                const farmSize = isRelationship && item.producer
                                    ? item.producer.formData.farmSize
                                    : item.type === 'creation-request'
                                        ? item.producerData.farmSize
                                        : 'Unknown';

                                return (
                                    <div
                                        key={item.id}
                                        className="p-4 bg-primary-700 rounded-lg border border-primary-600 hover:border-accent-500 transition-colors"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold font-sans text-gray-100">
                                                        {name}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                                                        {getStatusText(item.status)}
                                                    </span>
                                                    {item.type === 'creation-request' && (
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                                                            Pending Creation
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-300">
                                                    <div>
                                                        <span className="text-gray-400">Farm:</span> {farmName}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Phone:</span> {phone}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Farm Size:</span> {farmSize} hectares
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Added:</span> {new Date(item.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => {
                                                        if (isRelationship && item.producer) {
                                                            setSelectedProducer(item.producer);
                                                            setShowDetailsModal(true);
                                                        } else if (item.type === 'creation-request') {
                                                            setSelectedProducer({ formData: item.producerData, isPending: true });
                                                            setShowDetailsModal(true);
                                                        }
                                                    }}
                                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-md font-medium text-sm"
                                                >
                                                    View Details
                                                </button>

                                                {isRelationship && item.status === 'active' && (
                                                    <button
                                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium text-sm"
                                                    >
                                                        Send Message
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
                {showDetailsModal && selectedProducer && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-primary-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-primary-600">
                            <div className="sticky top-0 bg-primary-800 border-b border-primary-600 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold font-sans text-gray-100">
                                    Producer Details {selectedProducer.isPending && '(Pending Creation)'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedProducer(null);
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
                                            <p className="text-gray-100">{selectedProducer.formData.fullName}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Gender:</span>
                                            <p className="text-gray-100">{selectedProducer.formData.gender}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Date of Birth:</span>
                                            <p className="text-gray-100">{selectedProducer.formData.birthDate}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Phone:</span>
                                            <p className="text-gray-100">{selectedProducer.formData.phone}</p>
                                        </div>
                                        {selectedProducer.formData.email && (
                                            <div>
                                                <span className="text-gray-400">Email:</span>
                                                <p className="text-gray-100">{selectedProducer.formData.email}</p>
                                            </div>
                                        )}
                                        <div className="col-span-2">
                                            <span className="text-gray-400">Address:</span>
                                            <p className="text-gray-100">
                                                {selectedProducer.formData.address}, {selectedProducer.formData.city}, {selectedProducer.formData.state}
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
                                            <p className="text-gray-100">{selectedProducer.formData.farmBusinessName}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Farm Size:</span>
                                            <p className="text-gray-100">{selectedProducer.formData.farmSize} hectares</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Years of Experience:</span>
                                            <p className="text-gray-100">{selectedProducer.formData.yearsOfExperience}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Farmer Type:</span>
                                            <p className="text-gray-100">{selectedProducer.formData.typeOfFarmer?.join(', ') || 'N/A'}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-400">Farm Address:</span>
                                            <p className="text-gray-100">{selectedProducer.formData.farmAddress}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Crops:</span>
                                            <p className="text-gray-100">{selectedProducer.formData.crops?.join(', ') || 'None'}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Livestock:</span>
                                            <p className="text-gray-100">{selectedProducer.formData.livestock?.join(', ') || 'None'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Banking Information */}
                                <div>
                                    <h3 className="text-lg font-semibold font-sans text-gray-100 mb-3">Banking Information</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400">Bank Name:</span>
                                            <p className="text-gray-100">{selectedProducer.formData.bankName}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Account Name:</span>
                                            <p className="text-gray-100">{selectedProducer.formData.accountName}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Account Number:</span>
                                            <p className="text-gray-100">{selectedProducer.formData.accountNumber}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Payment Method:</span>
                                            <p className="text-gray-100">{selectedProducer.formData.preferredPaymentMethod}</p>
                                        </div>
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

export default ManageProducers;
