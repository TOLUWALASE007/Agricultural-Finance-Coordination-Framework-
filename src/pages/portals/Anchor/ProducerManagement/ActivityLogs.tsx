import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../../../components/PortalLayout';
import { getActiveAnchorRecord, findProducerById } from '../../../../utils/localDatabase';
import {
    getRelationshipsByAnchor,
    getCreationRequestsByAnchor,
    AnchorProducerRelationship,
    ProducerCreationRequest
} from '../../../../utils/relationshipDatabase';

interface ActivityLog {
    id: string;
    type: 'creation-request' | 'invitation' | 'producer-accepted' | 'producer-declined' | 'relationship-active' | 'producer-left';
    timestamp: string;
    producerName: string;
    producerId?: string;
    status: string;
    details: string;
}

const ActivityLogs: React.FC = () => {
    const navigate = useNavigate();
    const [anchorRecord, setAnchorRecord] = useState<any>(null);
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'creation-request' | 'invitation' | 'relationship'>('all');

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
        loadActivityLogs(record.id);
    }, [navigate]);

    const loadActivityLogs = (anchorId: string) => {
        const logs: ActivityLog[] = [];

        // Get creation requests
        const creationRequests = getCreationRequestsByAnchor(anchorId);
        creationRequests.forEach(req => {
            logs.push({
                id: `cr-${req.id}`,
                type: 'creation-request',
                timestamp: req.createdAt,
                producerName: req.requestedProducerData.fullName,
                status: req.status,
                details: `Creation request submitted for ${req.requestedProducerData.fullName}`,
            });

            if (req.reviewedAt) {
                logs.push({
                    id: `cr-review-${req.id}`,
                    type: 'creation-request',
                    timestamp: req.reviewedAt,
                    producerName: req.requestedProducerData.fullName,
                    status: req.status,
                    details: `Creation request ${req.status === 'approved' ? 'approved' : 'rejected'} by CA`,
                });
            }
        });

        // Get relationships
        const relationships = getRelationshipsByAnchor(anchorId);
        relationships.forEach(rel => {
            const producer = findProducerById(rel.producerId);
            const producerName = producer?.formData.fullName || 'Unknown Producer';

            // Relationship created
            logs.push({
                id: `rel-created-${rel.id}`,
                type: 'invitation',
                timestamp: rel.createdAt,
                producerName: producerName,
                producerId: rel.producerId,
                status: rel.status,
                details: `Invitation request created for ${producerName}`,
            });

            // Invitation sent
            if (rel.invitationSentAt) {
                logs.push({
                    id: `rel-sent-${rel.id}`,
                    type: 'invitation',
                    timestamp: rel.invitationSentAt,
                    producerName: producerName,
                    producerId: rel.producerId,
                    status: 'invitation-sent',
                    details: `Invitation sent to ${producerName}`,
                });
            }

            // Producer accepted
            if (rel.status === 'pending-ca-approval' && rel.invitationSentAt) {
                logs.push({
                    id: `rel-accepted-${rel.id}`,
                    type: 'producer-accepted',
                    timestamp: rel.invitationSentAt,
                    producerName: producerName,
                    producerId: rel.producerId,
                    status: 'accepted',
                    details: `${producerName} accepted your invitation`,
                });
            }

            // Producer declined
            if (rel.status === 'invitation-declined' && rel.invitationDeclinedAt) {
                logs.push({
                    id: `rel-declined-${rel.id}`,
                    type: 'producer-declined',
                    timestamp: rel.invitationDeclinedAt,
                    producerName: producerName,
                    producerId: rel.producerId,
                    status: 'declined',
                    details: `${producerName} declined your invitation`,
                });
            }

            // Relationship approved
            if (rel.approvedAt) {
                logs.push({
                    id: `rel-approved-${rel.id}`,
                    type: 'relationship-active',
                    timestamp: rel.approvedAt,
                    producerName: producerName,
                    producerId: rel.producerId,
                    status: 'active',
                    details: `Relationship with ${producerName} is now active`,
                });
            }

            // Relationship terminated
            if (rel.terminatedAt) {
                logs.push({
                    id: `rel-terminated-${rel.id}`,
                    type: 'producer-left',
                    timestamp: rel.terminatedAt,
                    producerName: producerName,
                    producerId: rel.producerId,
                    status: 'terminated',
                    details: `${producerName} left your organization`,
                });
            }
        });

        // Sort by timestamp (newest first)
        logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setActivityLogs(logs);
    };

    const filteredLogs = activityLogs.filter(log => {
        const matchesSearch = log.producerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.details.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesFilter = true;
        if (filterType !== 'all') {
            if (filterType === 'creation-request') {
                matchesFilter = log.type === 'creation-request';
            } else if (filterType === 'invitation') {
                matchesFilter = log.type === 'invitation' || log.type === 'producer-accepted' || log.type === 'producer-declined';
            } else if (filterType === 'relationship') {
                matchesFilter = log.type === 'relationship-active' || log.type === 'producer-left';
            }
        }

        return matchesSearch && matchesFilter;
    });

    const getActivityIcon = (type: string) => {
        const icons: Record<string, string> = {
            'creation-request': '📝',
            'invitation': '📨',
            'producer-accepted': '✅',
            'producer-declined': '❌',
            'relationship-active': '🤝',
            'producer-left': '🚪',
        };
        return icons[type] || '📋';
    };

    const getActivityColor = (type: string) => {
        const colors: Record<string, string> = {
            'creation-request': 'text-blue-400',
            'invitation': 'text-purple-400',
            'producer-accepted': 'text-green-400',
            'producer-declined': 'text-red-400',
            'relationship-active': 'text-green-400',
            'producer-left': 'text-orange-400',
        };
        return colors[type] || 'text-gray-400';
    };

    return (
        <PortalLayout role="Anchor" roleIcon="⚓" sidebarItems={sidebarItems}>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold font-sans mb-2">Producer Activity Logs</h1>
                    <p className="text-gray-200 font-serif">
                        Track all activities related to your producer/farmer relationships.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Total Activities</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">{activityLogs.length}</p>
                            </div>
                            <div className="text-3xl">📊</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Creation Requests</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">
                                    {activityLogs.filter(l => l.type === 'creation-request').length}
                                </p>
                            </div>
                            <div className="text-3xl">📝</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Invitations</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">
                                    {activityLogs.filter(l => l.type === 'invitation').length}
                                </p>
                            </div>
                            <div className="text-3xl">📨</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Active Relationships</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">
                                    {activityLogs.filter(l => l.type === 'relationship-active').length}
                                </p>
                            </div>
                            <div className="text-3xl">🤝</div>
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
                                placeholder="Search activities..."
                                className="w-full px-4 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            {['all', 'creation-request', 'invitation', 'relationship'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type as any)}
                                    className={`px-4 py-2 rounded-md font-medium text-sm ${filterType === type
                                        ? 'bg-accent-500 text-white'
                                        : 'bg-primary-700 text-gray-300 hover:bg-primary-600'
                                        }`}
                                >
                                    {type === 'all' ? 'All' : type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity Logs */}
                <div className="card">
                    <h2 className="text-xl font-bold font-sans text-gray-100 mb-4">
                        Activity Timeline ({filteredLogs.length})
                    </h2>

                    {filteredLogs.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📋</div>
                            <p className="text-gray-400 font-serif">
                                {activityLogs.length === 0
                                    ? 'No activity logs found.'
                                    : 'No activities match your search criteria.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredLogs.map((log) => (
                                <div
                                    key={log.id}
                                    className="p-4 bg-primary-700 rounded-lg border border-primary-600 hover:border-accent-500 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`text-3xl ${getActivityColor(log.type)}`}>
                                            {getActivityIcon(log.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-100">{log.details}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(log.timestamp).toLocaleString()}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${log.status === 'approved' || log.status === 'active' || log.status === 'accepted'
                                                    ? 'bg-green-500 text-white'
                                                    : log.status === 'rejected' || log.status === 'declined'
                                                        ? 'bg-red-500 text-white'
                                                        : log.status === 'pending-ca' || log.status === 'pending-me'
                                                            ? 'bg-yellow-500 text-white'
                                                            : 'bg-blue-500 text-white'
                                                    }`}>
                                                    {log.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-2 text-center text-xs text-gray-400 font-serif opacity-80">
                    Powered by Mc. George
                </div>
            </div>
        </PortalLayout>
    );
};

export default ActivityLogs;
