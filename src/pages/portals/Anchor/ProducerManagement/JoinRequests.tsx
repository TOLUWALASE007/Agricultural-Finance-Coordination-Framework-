import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../../../components/PortalLayout';
import { getActiveAnchorRecord } from '../../../../utils/localDatabase';

const JoinRequests: React.FC = () => {
    const navigate = useNavigate();
    const [anchorRecord, setAnchorRecord] = useState<any>(null);

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
    }, [navigate]);

    return (
        <PortalLayout role="Anchor" roleIcon="⚓" sidebarItems={sidebarItems}>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold font-sans mb-2">Producer Join Requests</h1>
                    <p className="text-gray-200 font-serif">
                        Review and respond to requests from producers/farmers who want to join your organization.
                    </p>
                </div>

                {/* Info Box */}
                <div className="card bg-blue-900/20 border-blue-500/30">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">ℹ️</div>
                        <div>
                            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-2">Join Requests Feature</h3>
                            <p className="text-sm text-gray-300 font-serif mb-3">
                                This feature allows producers/farmers to initiate relationships by requesting to join your anchor organization.
                            </p>
                            <p className="text-sm text-gray-300 font-serif mb-2">
                                <span className="font-semibold">Current Implementation Status:</span>
                            </p>
                            <ul className="text-sm text-gray-300 space-y-1 font-serif">
                                <li>• ✅ Anchors can create new producers</li>
                                <li>• ✅ Anchors can invite existing producers</li>
                                <li>• ✅ Producers can accept/decline invitations</li>
                                <li>• ✅ Producers can request to leave anchors</li>
                                <li>• 🔄 Producer-initiated join requests (coming soon)</li>
                            </ul>
                            <p className="text-sm text-gray-300 font-serif mt-3">
                                In the full implementation, this page would display:
                            </p>
                            <ul className="text-sm text-gray-300 space-y-1 font-serif mt-2">
                                <li>• Requests from producers wanting to join your organization</li>
                                <li>• Producer details and qualifications</li>
                                <li>• Accept/reject functionality with CA approval workflow</li>
                                <li>• Request history and tracking</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Pending Requests</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">0</p>
                            </div>
                            <div className="text-3xl">⏳</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Approved</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">0</p>
                            </div>
                            <div className="text-3xl">✅</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-serif">Declined</p>
                                <p className="text-2xl font-bold font-sans text-gray-100">0</p>
                            </div>
                            <div className="text-3xl">❌</div>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                <div className="card">
                    <div className="text-center py-16">
                        <div className="text-8xl mb-6">🌾</div>
                        <h3 className="text-2xl font-bold font-sans text-gray-100 mb-3">
                            No Join Requests Yet
                        </h3>
                        <p className="text-gray-400 font-serif mb-6 max-w-md mx-auto">
                            When producers/farmers request to join your organization, they will appear here for your review.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/portal/anchor/producer-management/create')}
                                className="btn-primary"
                            >
                                Create New Producer
                            </button>
                            <button
                                onClick={() => navigate('/portal/anchor/producer-management/invite')}
                                className="btn-secondary"
                            >
                                Invite Existing Producers
                            </button>
                        </div>
                    </div>
                </div>

                {/* How It Works */}
                <div className="card">
                    <h2 className="text-xl font-bold font-sans text-gray-100 mb-4">How Join Requests Work</h2>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-white font-bold">
                                1
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-1">Producer Submits Request</h3>
                                <p className="text-sm text-gray-400 font-serif">
                                    A verified producer/farmer finds your organization and submits a request to join.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-white font-bold">
                                2
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-1">You Review the Request</h3>
                                <p className="text-sm text-gray-400 font-serif">
                                    Review the producer's profile, farm details, and qualifications to decide if they're a good fit.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-white font-bold">
                                3
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-1">Accept or Decline</h3>
                                <p className="text-sm text-gray-400 font-serif">
                                    Accept the request to send it to CA for approval, or decline with a reason.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-white font-bold">
                                4
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-1">CA Final Approval</h3>
                                <p className="text-sm text-gray-400 font-serif">
                                    If you accept, the Coordinating Agency reviews and gives final approval to establish the relationship.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alternative Actions */}
                <div className="card bg-purple-900/20 border-purple-500/30">
                    <h2 className="text-xl font-bold font-sans text-gray-100 mb-4">Meanwhile, You Can:</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-primary-700 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">➕</span>
                                <h3 className="text-lg font-semibold font-sans text-gray-100">Create New Producers</h3>
                            </div>
                            <p className="text-sm text-gray-400 font-serif mb-3">
                                Submit a request to create a new producer/farmer who will be attached to your organization.
                            </p>
                            <button
                                onClick={() => navigate('/portal/anchor/producer-management/create')}
                                className="btn-primary w-full"
                            >
                                Create Producer
                            </button>
                        </div>

                        <div className="p-4 bg-primary-700 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">📨</span>
                                <h3 className="text-lg font-semibold font-sans text-gray-100">Invite Existing Producers</h3>
                            </div>
                            <p className="text-sm text-gray-400 font-serif mb-3">
                                Browse verified producers and send invitations to join your organization.
                            </p>
                            <button
                                onClick={() => navigate('/portal/anchor/producer-management/invite')}
                                className="btn-primary w-full"
                            >
                                Invite Producers
                            </button>
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

export default JoinRequests;
