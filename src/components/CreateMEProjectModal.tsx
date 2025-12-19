import React, { useState, useMemo } from 'react';
import {
    MEMemberRecord,
    getMEMembers,
    createMEProject,
    MEProjectType,
    assignLeadMEToProject,
} from '../utils/localDatabase';
import { useNotifications } from '../context/NotificationContext';

interface CreateMEProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectType: MEProjectType;
    sourceType: 'producer' | 'anchor' | 'lead-firm' | 'cooperative' | 'pfi' | 'insurance' | 'extension' | 'researcher';
    sourceId: string;
    sourceName: string;
    sourceEmail?: string;
    sourcePhone?: string;
    schemeId?: string;
    schemeName?: string;
    notificationId?: string;
    submissionData: Record<string, any>;
    onSuccess?: () => void;
}

const CreateMEProjectModal: React.FC<CreateMEProjectModalProps> = ({
    isOpen,
    onClose,
    projectType,
    sourceType,
    sourceId,
    sourceName,
    sourceEmail,
    sourcePhone,
    schemeId,
    schemeName,
    notificationId,
    submissionData,
    onSuccess,
}) => {
    const { addNotification } = useNotifications();
    const [members, setMembers] = useState<MEMemberRecord[]>([]);
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [leadMEMemberId, setLeadMEMemberId] = useState<string>(''); // Lead M&E designation
    const [dueDate, setDueDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Load M&E members on mount
    React.useEffect(() => {
        if (isOpen) {
            const meMembers = getMEMembers().filter(m => m.status === 'active');
            setMembers(meMembers);

            // Check if this is a leave request verification
            const isLeaveRequest = submissionData?.leaveReason && submissionData?.anchorName;

            if (isLeaveRequest) {
                // Generate title for leave request
                setProjectName(`Leave Request Verification - ${sourceName} from ${submissionData.anchorName}`);

                // Generate detailed description for leave request
                const leaveDescription = `Verification of leave request from ${sourceName} to leave ${submissionData.anchorName}.

Producer: ${sourceName}
Anchor: ${submissionData.anchorName}
Reason: ${submissionData.leaveReason}

Verification Required:
- Verify producer identity
- Confirm current relationship status
- Check for pending obligations
- Validate leave reason
- Interview producer and anchor if necessary`;

                setDescription(leaveDescription);
            } else {
                // Auto-generate project name for other types
                const typeLabels: Record<MEProjectType, string> = {
                    'registration': 'Verify Registration',
                    'scheme-application': 'Verify Scheme Application',
                    'incident-report': 'Investigate Incident Report',
                };
                setProjectName(`${typeLabels[projectType]} - ${sourceName}`);
            }
        }
    }, [isOpen, projectType, sourceName, submissionData]);

    const handleMemberToggle = (memberId: string) => {
        setSelectedMembers(prev => {
            const newSelection = prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId];

            // Auto-designate Lead M&E if only one member is selected
            if (newSelection.length === 1) {
                setLeadMEMemberId(newSelection[0]);
            }
            // Clear Lead M&E if the Lead is deselected
            else if (leadMEMemberId === memberId && !newSelection.includes(memberId)) {
                setLeadMEMemberId('');
            }

            return newSelection;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!projectName.trim()) {
            setError('Please enter a project name');
            return;
        }

        if (selectedMembers.length === 0) {
            setError('Please select at least one M&E team member');
            return;
        }

        // Validate Lead M&E selection when multiple members are selected
        if (selectedMembers.length > 1 && !leadMEMemberId) {
            setError('Please designate one M&E member as the Lead M&E');
            return;
        }

        // Ensure Lead M&E is one of the selected members
        if (leadMEMemberId && !selectedMembers.includes(leadMEMemberId)) {
            setError('Lead M&E must be one of the selected members');
            return;
        }

        setIsLoading(true);

        try {
            const selectedMemberNames = selectedMembers
                .map(id => members.find(m => m.id === id)?.formData.fullName || '')
                .filter(Boolean);

            const project = createMEProject({
                name: projectName.trim(),
                description: description.trim() || undefined,
                projectType,
                status: 'pending',
                priority,
                sourceType,
                sourceId,
                sourceName,
                sourceEmail,
                sourcePhone,
                schemeId,
                schemeName,
                notificationId,
                submissionData,
                attachments: [],
                assignedMemberIds: selectedMembers,
                assignedMemberNames: selectedMemberNames,
                createdBy: 'coordinating-agency',
                dueDate: dueDate || undefined,
            });

            // Assign Lead M&E if designated
            if (leadMEMemberId) {
                try {
                    assignLeadMEToProject(project.id, leadMEMemberId, 'coordinating-agency');
                } catch (err: any) {
                    console.error('Failed to assign Lead M&E:', err);
                    // Continue even if Lead M&E assignment fails
                }
            }

            // Send notifications to assigned M&E members
            selectedMembers.forEach(memberId => {
                const member = members.find(m => m.id === memberId);
                const isLead = memberId === leadMEMemberId;

                if (member) {
                    addNotification({
                        role: '🏛️ Coordinating Agency',
                        targetRole: 'coordinating-agency', // M&E members access through CA
                        message: `You have been assigned to a new M&E project: "${projectName}"${isLead ? ' as the Lead M&E' : ''}. Please review and evaluate the submission.`,
                        metadata: {
                            type: 'meProjectAssignment',
                            projectId: project.id,
                            memberId,
                            isLeadME: isLead,
                        },
                    });
                }
            });

            onSuccess?.();
            onClose();

            // Reset form
            setProjectName('');
            setDescription('');
            setPriority('medium');
            setSelectedMembers([]);
            setLeadMEMemberId('');
            setDueDate('');
        } catch (err: any) {
            setError(err.message || 'Failed to create M&E project');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={onClose}>
            <div className="min-h-screen flex items-center justify-center py-8">
                <div
                    className="w-full max-w-2xl bg-primary-900 rounded-lg border border-primary-700 p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">📋 Create M&E Verification Project</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">✖</button>
                    </div>

                    {/* Source Info */}
                    <div className="bg-primary-800 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-400">Subject:</span>
                                <span className="text-white ml-1 font-medium">{sourceName}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Type:</span>
                                <span className="text-white ml-1 capitalize">{sourceType}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Project Type:</span>
                                <span className="text-white ml-1 capitalize">{projectType.replace('-', ' ')}</span>
                            </div>
                            {schemeName && (
                                <div>
                                    <span className="text-gray-400">Scheme:</span>
                                    <span className="text-white ml-1">{schemeName}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-900/50 border border-red-600 text-red-300 p-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Project Name *</label>
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-primary-700 text-white border border-primary-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 rounded-md bg-primary-700 text-white border border-primary-600"
                                placeholder="Additional instructions for M&E evaluators..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Priority *</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as any)}
                                    className="w-full px-3 py-2 rounded-md bg-primary-700 text-white border border-primary-600"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full px-3 py-2 rounded-md bg-primary-700 text-white border border-primary-600"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Assign M&E Team Members *
                                <span className="text-gray-500 ml-1">({selectedMembers.length} selected)</span>
                            </label>

                            {members.length === 0 ? (
                                <div className="bg-primary-800 rounded-lg p-4 text-center">
                                    <p className="text-gray-400">No active M&E team members available.</p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Create M&E members in the M&E Team Portal first.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Select All Checkbox */}
                                    <div className="bg-primary-700 rounded-lg p-3 mb-2 border border-primary-600">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedMembers.length === members.length && members.length > 0}
                                                onChange={() => {
                                                    if (selectedMembers.length === members.length) {
                                                        setSelectedMembers([]);
                                                        setLeadMEMemberId('');
                                                    } else {
                                                        const allMemberIds = members.map(m => m.id);
                                                        setSelectedMembers(allMemberIds);
                                                        // Auto-select first member as Lead if selecting all
                                                        if (allMemberIds.length > 0) {
                                                            setLeadMEMemberId(allMemberIds[0]);
                                                        }
                                                    }
                                                }}
                                                className="rounded border-primary-600 text-accent-500"
                                            />
                                            <span className="text-white font-medium">
                                                Select All M&E Members ({members.length})
                                            </span>
                                        </label>
                                    </div>

                                    {/* M&E Members List */}
                                    <div className="bg-primary-800 rounded-lg p-2 max-h-48 overflow-y-auto space-y-1 mb-3">
                                        {members.map((member) => (
                                            <label
                                                key={member.id}
                                                className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${selectedMembers.includes(member.id)
                                                    ? 'bg-accent-600/30 border border-accent-500'
                                                    : 'bg-primary-700 hover:bg-primary-600'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMembers.includes(member.id)}
                                                    onChange={() => handleMemberToggle(member.id)}
                                                    className="rounded border-primary-600 text-accent-500"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-white font-medium">{member.formData.fullName}</p>
                                                    <p className="text-gray-400 text-xs">
                                                        {member.formData.position || 'M&E Member'} • {member.formData.state || 'Nigeria'}
                                                    </p>
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {member.assignedProjectsCount} projects
                                                </div>
                                            </label>
                                        ))}
                                    </div>

                                    {/* Lead M&E Designation */}
                                    {selectedMembers.length > 0 && (
                                        <div className="bg-primary-700 rounded-lg p-4 border border-primary-600">
                                            <label className="block text-sm text-gray-300 mb-3">
                                                Designate Lead M&E {selectedMembers.length > 1 && <span className="text-red-400">*</span>}
                                                <span className="text-gray-500 ml-1 text-xs">
                                                    {selectedMembers.length === 1 ? '(Auto-selected)' : '(Required when multiple M&E selected)'}
                                                </span>
                                            </label>
                                            <div className="space-y-2">
                                                {selectedMembers.map(memberId => {
                                                    const member = members.find(m => m.id === memberId);
                                                    if (!member) return null;

                                                    return (
                                                        <label
                                                            key={memberId}
                                                            className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors ${leadMEMemberId === memberId
                                                                ? 'bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border border-yellow-500'
                                                                : 'bg-primary-800 hover:bg-primary-600 border border-primary-600'
                                                                }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="leadME"
                                                                checked={leadMEMemberId === memberId}
                                                                onChange={() => setLeadMEMemberId(memberId)}
                                                                className="text-yellow-500"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-white font-medium">{member.formData.fullName}</p>
                                                                    {leadMEMemberId === memberId && (
                                                                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-black">
                                                                            ⭐ LEAD M&E
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-gray-400 text-xs">
                                                                    {member.formData.position || 'M&E Member'} • {member.formData.state || 'Nigeria'}
                                                                </p>
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                            {selectedMembers.length > 1 && (
                                                <p className="text-xs text-gray-400 mt-2">
                                                    💡 The Lead M&E's reports will be marked as priority in the CA's notification portal.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t border-primary-700">
                            <button type="button" onClick={onClose} className="btn-secondary">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || members.length === 0}
                                className="btn-primary disabled:opacity-50"
                            >
                                {isLoading ? '⏳ Creating...' : '📋 Create M&E Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateMEProjectModal;
