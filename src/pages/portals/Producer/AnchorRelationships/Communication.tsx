import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../../../components/PortalLayout';
import { getActiveProducerRecord, findAnchorById } from '../../../../utils/localDatabase';
import { getActiveRelationshipsByProducer } from '../../../../utils/relationshipDatabase';

const Communication: React.FC = () => {
    const navigate = useNavigate();
    const [producerRecord, setProducerRecord] = useState<any>(null);
    const [activeAnchors, setActiveAnchors] = useState<any[]>([]);
    const [selectedAnchorId, setSelectedAnchorId] = useState('');
    const [message, setMessage] = useState('');
    const [subject, setSubject] = useState('');

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
        loadActiveAnchors(record.id);
    }, [navigate]);

    const loadActiveAnchors = (producerId: string) => {
        const relationships = getActiveRelationshipsByProducer(producerId);
        const anchorsWithData = relationships.map(rel => ({
            relationship: rel,
            anchor: findAnchorById(rel.anchorId),
        })).filter(item => item.anchor !== undefined);

        setActiveAnchors(anchorsWithData);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedAnchorId) {
            alert('Please select an anchor to send a message to.');
            return;
        }

        if (!subject.trim() || !message.trim()) {
            alert('Please provide both a subject and message.');
            return;
        }

        // In a real implementation, this would send the message through a messaging system
        alert(`Message sent successfully!\n\nThis is a placeholder feature. In the full implementation, this would:\n- Send the message to the anchor\n- Store it in a messaging database\n- Send a notification to the anchor\n- Show in a message history`);

        // Clear form
        setSubject('');
        setMessage('');
        setSelectedAnchorId('');
    };

    return (
        <PortalLayout role="Producer/Farmer" roleIcon="🌾" sidebarItems={sidebarItems}>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold font-sans mb-2">Anchor Communication</h1>
                    <p className="text-gray-200 font-serif">
                        Send messages and communicate with your anchor organizations.
                    </p>
                </div>

                {/* Info Box */}
                <div className="card bg-blue-900/20 border-blue-500/30">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">ℹ️</div>
                        <div>
                            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-2">Communication Feature</h3>
                            <p className="text-sm text-gray-300 font-serif">
                                This is a basic messaging interface. In the full implementation, this would include:
                            </p>
                            <ul className="text-sm text-gray-300 space-y-1 font-serif mt-2">
                                <li>• Message history and threading</li>
                                <li>• Real-time notifications</li>
                                <li>• File attachments</li>
                                <li>• Read receipts</li>
                                <li>• Message search and filtering</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {activeAnchors.length === 0 ? (
                    <div className="card">
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">⚓</div>
                            <p className="text-gray-400 font-serif mb-4">
                                You don't have any active anchor relationships to communicate with.
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
                    <>
                        {/* Quick Contact Cards */}
                        <div className="card">
                            <h2 className="text-xl font-bold font-sans text-gray-100 mb-4">Your Anchors</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeAnchors.map(({ relationship, anchor }) => (
                                    <div
                                        key={relationship.id}
                                        className="p-4 bg-primary-700 rounded-lg border border-primary-600"
                                    >
                                        <h3 className="text-lg font-semibold font-sans text-gray-100 mb-2">
                                            {anchor.formData.organizationName}
                                        </h3>
                                        <div className="space-y-1 text-sm text-gray-300">
                                            <div>
                                                <span className="text-gray-400">Contact:</span> {anchor.formData.fullName}
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Phone:</span> {anchor.formData.officePhone}
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Email:</span> {anchor.formData.officialEmail}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Send Message Form */}
                        <form onSubmit={handleSendMessage} className="card">
                            <h2 className="text-xl font-bold font-sans text-gray-100 mb-4">Send Message</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                        Select Anchor <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        value={selectedAnchorId}
                                        onChange={(e) => setSelectedAnchorId(e.target.value)}
                                        className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                                        required
                                    >
                                        <option value="">-- Select an anchor --</option>
                                        {activeAnchors.map(({ relationship, anchor }) => (
                                            <option key={anchor.id} value={anchor.id}>
                                                {anchor.formData.organizationName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                        Subject <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                                        placeholder="Enter message subject"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                                        Message <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows={8}
                                        className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
                                        placeholder="Type your message here..."
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSubject('');
                                            setMessage('');
                                            setSelectedAnchorId('');
                                        }}
                                        className="px-6 py-2 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md font-medium"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-md font-medium"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Placeholder for Message History */}
                        <div className="card">
                            <h2 className="text-xl font-bold font-sans text-gray-100 mb-4">Message History</h2>
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">💬</div>
                                <p className="text-gray-400 font-serif">
                                    Message history will appear here in the full implementation.
                                </p>
                            </div>
                        </div>
                    </>
                )}

                <div className="mt-2 text-center text-xs text-gray-400 font-serif opacity-80">
                    Powered by Mc. George
                </div>
            </div>
        </PortalLayout>
    );
};

export default Communication;
