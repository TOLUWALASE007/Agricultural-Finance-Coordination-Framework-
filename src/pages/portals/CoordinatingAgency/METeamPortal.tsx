import React, { useState, useMemo, useEffect } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { useNotifications } from '../../../context/NotificationContext';
import {
    MEMemberRecord,
    MEProject,
    getMEMembers,
    getMEProjects,
    registerMEMember,
    updateMEMemberStatus,
    deleteMEMember,
    findMEMemberById,
    setCADecisionOnMEProject,
    updateMEProjectStatus,
} from '../../../utils/localDatabase';

const METeamPortal: React.FC = () => {
    const { addNotification } = useNotifications();

    const sidebarItems = [
        {
            id: 'dashboard', name: 'Dashboard', icon: '🏠', href: '/portal/coordinating-agency', hasDropdown: true, dropdownItems: [
                { id: 'activities', name: 'Activities', icon: '⚡', href: '/portal/coordinating-agency/activities' },
                { id: 'fund-schemes', name: 'Fund Schemes', icon: '💼', href: '/portal/coordinating-agency/fund-schemes' },
                { id: 'reportings', name: 'Reports', icon: '📑', href: '/portal/coordinating-agency/reportings' },
                { id: 'trainings', name: 'Trainings', icon: '📚', href: '/portal/coordinating-agency/trainings' }
            ]
        },
        { id: 'me-team', name: 'M&E Team', icon: '📋', href: '/portal/coordinating-agency/monitoring/state' },
        {
            id: 'representative-body', name: 'Representative Body', icon: '🏛️', href: '/portal/coordinating-agency/representative', hasDropdown: true, dropdownItems: [
                { id: 'rep-insurance', name: 'Insurance Companies', icon: '🛡️', href: '/portal/coordinating-agency/representative/insurance-companies' },
                { id: 'rep-extension', name: 'Extension Organizations', icon: '🌿', href: '/portal/coordinating-agency/representative/extension-organizations' },
                { id: 'rep-ngos', name: 'NGOs', icon: '🤝', href: '/portal/coordinating-agency/representative/ngos' }
            ]
        },
        {
            id: 'applicants', name: 'Applicants', icon: '📝', href: '/portal/coordinating-agency/applicants', hasDropdown: true, dropdownItems: [
                { id: 'fund-provider', name: 'Fund Provider', icon: '💼', href: '/portal/coordinating-agency/applicants/fund-provider' },
                { id: 'pfis', name: 'PFIs', icon: '🏦', href: '/portal/coordinating-agency/applicants/pfis' },
                { id: 'insurance-companies', name: 'Insurance Companies', icon: '🛡️', href: '/portal/coordinating-agency/applicants/insurance-companies' },
                {
                    id: 'fund-beneficiaries', name: 'Fund Beneficiaries', icon: '👥', href: '/portal/coordinating-agency/fund-beneficiaries', hasDropdown: true, dropdownItems: [
                        { id: 'lead-firms', name: 'Lead Firms', icon: '🏢', href: '/portal/coordinating-agency/fund-beneficiaries/lead-firms' },
                        { id: 'anchors', name: 'Anchors', icon: '⚓', href: '/portal/coordinating-agency/fund-beneficiaries/anchors' },
                        { id: 'cooperative-groups', name: 'Cooperative Groups', icon: '🤝', href: '/portal/coordinating-agency/fund-beneficiaries/cooperative-groups' },
                        { id: 'producers-farmers', name: 'Producers/Farmers', icon: '🌾', href: '/portal/coordinating-agency/fund-beneficiaries/producers-farmers' }
                    ]
                }
            ]
        },
        {
            id: 'stakeholders', name: 'Department', icon: '🤝', href: '/portal/coordinating-agency/stakeholders', hasDropdown: true, dropdownItems: [
                { id: 'fund-management', name: 'Fund Management Department', icon: '💼', href: '/portal/coordinating-agency/stakeholders/fund-management' },
                { id: 'credit-risk', name: 'Agricultural Credit Risk Management Department', icon: '📊', href: '/portal/coordinating-agency/stakeholders/credit-risk' },
                { id: 'insurance', name: 'Agricultural Insurance Management Department', icon: '🛡️', href: '/portal/coordinating-agency/stakeholders/insurance' },
                { id: 'finance', name: 'Finance and Accounting Department', icon: '🪙', href: '/portal/coordinating-agency/stakeholders/finance' },
                { id: 'legal', name: 'Legal Department', icon: '⚖️', href: '/portal/coordinating-agency/stakeholders/legal' },
                { id: 'it', name: 'IT Department', icon: '💻', href: '/portal/coordinating-agency/stakeholders/it' },
                { id: 'training', name: 'Training Department', icon: '📚', href: '/portal/coordinating-agency/stakeholders/training' }
            ]
        },
        { id: 'publications', name: 'Publications', icon: '📚', href: '/portal/coordinating-agency/publications' },
        { id: 'blog', name: 'Blog', icon: '📰', href: '/portal/coordinating-agency/blog' },
        { id: 'faqs', name: 'FAQs', icon: '❓', href: '/portal/coordinating-agency/faqs' },
        { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/coordinating-agency/settings' }
    ];

    const nigerianStates = [
        "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
        "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
        "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
        "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT Abuja"
    ];

    // State management
    const [activeTab, setActiveTab] = useState<'members' | 'projects' | 'reports'>('members');
    const [searchTerm, setSearchTerm] = useState('');
    const [stateFilter, setStateFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [members, setMembers] = useState<MEMemberRecord[]>([]);
    const [projects, setProjects] = useState<MEProject[]>([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Modal states
    const [showCreateMemberModal, setShowCreateMemberModal] = useState(false);
    const [showMemberDetailsModal, setShowMemberDetailsModal] = useState<MEMemberRecord | null>(null);
    const [showProjectDetailsModal, setShowProjectDetailsModal] = useState<MEProject | null>(null);
    const [showReportModal, setShowReportModal] = useState<MEProject | null>(null);
    const [showConfirmation, setShowConfirmation] = useState<{ type: string; message: string; name?: string } | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    // Form state for creating M&E member
    const [memberFormData, setMemberFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        position: '',
        department: '',
        state: '',
        lga: '',
        address: '',
        qualification: '',
        yearsOfExperience: '',
        specialization: '',
    });

    const itemsPerPage = 5;

    // Load data
    useEffect(() => {
        setMembers(getMEMembers());
        setProjects(getMEProjects());
    }, [refreshTrigger]);

    // Refresh function
    const refreshData = () => setRefreshTrigger(prev => prev + 1);

    // Show toast message
    const showToast = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    // Filter members
    const filteredMembers = useMemo(() => {
        return members.filter(member => {
            const matchesState = stateFilter === 'All' || member.formData.state === stateFilter;
            const matchesStatus = statusFilter === 'All' || member.status === statusFilter;
            const q = searchTerm.toLowerCase();
            const matchesSearch =
                member.formData.fullName.toLowerCase().includes(q) ||
                member.email.toLowerCase().includes(q) ||
                member.formData.position.toLowerCase().includes(q);
            return matchesState && matchesStatus && matchesSearch;
        });
    }, [members, stateFilter, statusFilter, searchTerm]);

    // Filter projects
    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
            const q = searchTerm.toLowerCase();
            const matchesSearch =
                project.name.toLowerCase().includes(q) ||
                project.sourceName.toLowerCase().includes(q) ||
                project.projectType.toLowerCase().includes(q);
            return matchesStatus && matchesSearch;
        });
    }, [projects, statusFilter, searchTerm]);

    // Filter projects with completed evaluations (for reports tab)
    const completedProjects = useMemo(() => {
        return projects.filter(project =>
            project.status === 'evaluation-complete' ||
            (project.evaluationReports && project.evaluationReports.length > 0)
        );
    }, [projects]);

    // Pagination
    const paginatedMembers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredMembers.slice(start, start + itemsPerPage);
    }, [filteredMembers, currentPage]);

    const paginatedProjects = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProjects.slice(start, start + itemsPerPage);
    }, [filteredProjects, currentPage]);

    const paginatedCompletedProjects = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return completedProjects.slice(start, start + itemsPerPage);
    }, [completedProjects, currentPage]);

    const getTotalPages = () => {
        if (activeTab === 'members') return Math.ceil(filteredMembers.length / itemsPerPage);
        if (activeTab === 'projects') return Math.ceil(filteredProjects.length / itemsPerPage);
        return Math.ceil(completedProjects.length / itemsPerPage);
    };

    // Reset page when filters change
    useEffect(() => { setCurrentPage(1); }, [searchTerm, stateFilter, statusFilter, activeTab]);

    // Handle create member
    const handleCreateMember = (e: React.FormEvent) => {
        e.preventDefault();

        if (!memberFormData.fullName || !memberFormData.email || !memberFormData.password) {
            showToast('❌ Please fill in all required fields');
            return;
        }

        try {
            registerMEMember({
                email: memberFormData.email,
                password: memberFormData.password,
                status: 'active',
                createdBy: 'coordinating-agency',
                formData: {
                    fullName: memberFormData.fullName,
                    email: memberFormData.email,
                    phone: memberFormData.phone,
                    position: memberFormData.position,
                    department: memberFormData.department,
                    state: memberFormData.state,
                    lga: memberFormData.lga,
                    address: memberFormData.address,
                    qualification: memberFormData.qualification,
                    yearsOfExperience: memberFormData.yearsOfExperience,
                    specialization: memberFormData.specialization,
                },
            });

            showToast(`✅ M&E Team Member "${memberFormData.fullName}" created successfully`);
            setShowCreateMemberModal(false);
            setMemberFormData({
                fullName: '', email: '', phone: '', password: '', position: '', department: '',
                state: '', lga: '', address: '', qualification: '', yearsOfExperience: '', specialization: '',
            });
            refreshData();
        } catch (error: any) {
            showToast(`❌ ${error.message}`);
        }
    };

    // Handle member status change
    const handleMemberStatusChange = (memberId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
        try {
            updateMEMemberStatus(memberId, newStatus);
            showToast(`✅ Member status updated to ${newStatus}`);
            refreshData();
        } catch (error: any) {
            showToast(`❌ ${error.message}`);
        }
    };

    // Handle delete member
    const handleDeleteMember = (memberId: string) => {
        try {
            deleteMEMember(memberId);
            showToast('✅ Member deleted successfully');
            setShowMemberDetailsModal(null);
            refreshData();
        } catch (error: any) {
            showToast(`❌ ${error.message}`);
        }
    };

    // Handle CA decision on project
    const handleCADecision = (projectId: string, decision: 'approved' | 'rejected', notes?: string) => {
        try {
            setCADecisionOnMEProject(projectId, decision, notes);

            // Send notification about decision
            const project = projects.find(p => p.id === projectId);
            if (project) {
                addNotification({
                    role: '🏛️ Coordinating Agency',
                    targetRole: project.sourceType as any,
                    message: decision === 'approved'
                        ? `Your ${project.projectType} has been approved after M&E evaluation.`
                        : `Your ${project.projectType} has been rejected after M&E evaluation. ${notes ? `Reason: ${notes}` : ''}`,
                    metadata: {
                        type: 'meProjectDecision',
                        projectId: project.id,
                        decision,
                    },
                });
            }

            showToast(`✅ Project ${decision} successfully`);
            setShowReportModal(null);
            refreshData();
        } catch (error: any) {
            showToast(`❌ ${error.message}`);
        }
    };

    // Stats calculations
    const stats = useMemo(() => ({
        totalMembers: members.length,
        activeMembers: members.filter(m => m.status === 'active').length,
        totalProjects: projects.length,
        pendingProjects: projects.filter(p => p.status === 'pending').length,
        inProgressProjects: projects.filter(p => p.status === 'in-progress').length,
        completedProjects: projects.filter(p => p.status === 'evaluation-complete').length,
        pendingReports: projects.filter(p => p.status === 'evaluation-complete' && !p.caDecision).length,
    }), [members, projects]);

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            'active': 'bg-green-600',
            'inactive': 'bg-gray-600',
            'suspended': 'bg-red-600',
            'pending': 'bg-yellow-600',
            'in-progress': 'bg-blue-600',
            'evaluation-complete': 'bg-purple-600',
            'archived': 'bg-gray-600',
        };
        return colors[status] || 'bg-gray-600';
    };

    const getPriorityBadge = (priority: string) => {
        const colors: Record<string, string> = {
            'low': 'bg-gray-500',
            'medium': 'bg-yellow-500',
            'high': 'bg-orange-500',
            'urgent': 'bg-red-500',
        };
        return colors[priority] || 'bg-gray-500';
    };

    return (
        <PortalLayout role="M&E Team Portal" roleIcon="📋" sidebarItems={sidebarItems}>
            <div className="space-y-6">
                {/* Toast notification */}
                {toast && (
                    <div className="fixed top-4 right-4 z-50 bg-primary-800 border border-primary-600 rounded-lg p-4 shadow-lg">
                        <p className="text-white">{toast}</p>
                    </div>
                )}

                {/* Header */}
                <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-lg p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-2">📋 M&E Team Portal</h1>
                            <p className="text-gray-300">
                                Manage Monitoring & Evaluation team members, projects, and verification reports
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button onClick={() => setShowCreateMemberModal(true)} className="btn-primary">
                                ➕ Create M&E Member
                            </button>
                            <button className="btn-secondary" onClick={refreshData}>
                                🔄 Refresh Data
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-primary-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Members</p>
                                <p className="text-2xl font-bold text-white">{stats.totalMembers}</p>
                                <p className="text-green-400 text-sm">{stats.activeMembers} active</p>
                            </div>
                            <div className="text-3xl">👥</div>
                        </div>
                    </div>
                    <div className="bg-primary-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Active Projects</p>
                                <p className="text-2xl font-bold text-white">{stats.pendingProjects + stats.inProgressProjects}</p>
                                <p className="text-yellow-400 text-sm">{stats.pendingProjects} pending assignment</p>
                            </div>
                            <div className="text-3xl">📂</div>
                        </div>
                    </div>
                    <div className="bg-primary-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Completed Evaluations</p>
                                <p className="text-2xl font-bold text-white">{stats.completedProjects}</p>
                                <p className="text-purple-400 text-sm">Ready for review</p>
                            </div>
                            <div className="text-3xl">✅</div>
                        </div>
                    </div>
                    <div className="bg-primary-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Pending Reports</p>
                                <p className="text-2xl font-bold text-white">{stats.pendingReports}</p>
                                <p className="text-orange-400 text-sm">Awaiting CA decision</p>
                            </div>
                            <div className="text-3xl">📊</div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-primary-800 rounded-lg p-2">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveTab('members')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'members' ? 'bg-accent-600 text-white' : 'text-gray-300 hover:bg-primary-700'
                                }`}
                        >
                            👥 Team Members ({members.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'projects' ? 'bg-accent-600 text-white' : 'text-gray-300 hover:bg-primary-700'
                                }`}
                        >
                            📂 M&E Projects ({projects.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('reports')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'reports' ? 'bg-accent-600 text-white' : 'text-gray-300 hover:bg-primary-700'
                                }`}
                        >
                            📊 Monitoring Reports ({completedProjects.length})
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-primary-800 rounded-lg p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={`Search ${activeTab}...`}
                                className="w-full px-4 py-2 rounded-md bg-primary-700 text-white border border-primary-600 focus:ring-2 focus:ring-accent-500"
                            />
                        </div>
                        {activeTab === 'members' && (
                            <select
                                value={stateFilter}
                                onChange={(e) => setStateFilter(e.target.value)}
                                className="px-4 py-2 rounded-md bg-primary-700 text-white border border-primary-600"
                            >
                                <option value="All">All States</option>
                                {nigerianStates.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        )}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 rounded-md bg-primary-700 text-white border border-primary-600"
                        >
                            <option value="All">All Status</option>
                            {activeTab === 'members' ? (
                                <>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                </>
                            ) : (
                                <>
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="evaluation-complete">Evaluation Complete</option>
                                    <option value="archived">Archived</option>
                                </>
                            )}
                        </select>
                    </div>
                </div>

                {/* Members Tab Content */}
                {activeTab === 'members' && (
                    <div className="bg-primary-800 rounded-lg p-4">
                        {paginatedMembers.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-lg">No M&E team members found.</p>
                                <button onClick={() => setShowCreateMemberModal(true)} className="btn-primary mt-4">
                                    ➕ Create First Member
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-primary-700">
                                            <th className="text-left py-3 px-4 text-gray-300 font-medium">Name</th>
                                            <th className="text-left py-3 px-4 text-gray-300 font-medium">Position</th>
                                            <th className="text-left py-3 px-4 text-gray-300 font-medium">State</th>
                                            <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                                            <th className="text-left py-3 px-4 text-gray-300 font-medium">Projects</th>
                                            <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedMembers.map((member) => (
                                            <tr key={member.id} className="border-b border-primary-700 hover:bg-primary-700/50">
                                                <td className="py-3 px-4">
                                                    <div>
                                                        <p className="text-white font-medium">{member.formData.fullName}</p>
                                                        <p className="text-gray-400 text-sm">{member.email}</p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-gray-300">{member.formData.position || 'N/A'}</td>
                                                <td className="py-3 px-4 text-gray-300">{member.formData.state || 'N/A'}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusBadge(member.status)}`}>
                                                        {member.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-gray-300">
                                                    {member.assignedProjectsCount} / {member.completedProjectsCount} completed
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setShowMemberDetailsModal(member)}
                                                            className="text-blue-400 hover:text-blue-300 text-sm"
                                                        >
                                                            👁️ View
                                                        </button>
                                                        <button
                                                            onClick={() => handleMemberStatusChange(
                                                                member.id,
                                                                member.status === 'active' ? 'inactive' : 'active'
                                                            )}
                                                            className="text-yellow-400 hover:text-yellow-300 text-sm"
                                                        >
                                                            {member.status === 'active' ? '⏸️ Deactivate' : '▶️ Activate'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Projects Tab Content */}
                {activeTab === 'projects' && (
                    <div className="bg-primary-800 rounded-lg p-4">
                        {paginatedProjects.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-lg">No M&E projects found.</p>
                                <p className="text-gray-500 text-sm mt-2">
                                    Projects are created when you click "Create M&E Project" from user registrations or scheme applications.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {paginatedProjects.map((project) => (
                                    <div key={project.id} className="bg-primary-700 rounded-lg p-4 border border-primary-600">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <h3 className="text-white font-semibold">{project.name}</h3>
                                                    {project.leadMEMemberId && (
                                                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-black">
                                                            ⭐ HAS LEAD M&E
                                                        </span>
                                                    )}
                                                    <span className={`px-2 py-0.5 rounded-full text-xs text-white ${getStatusBadge(project.status)}`}>
                                                        {project.status.replace('-', ' ')}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs text-white ${getPriorityBadge(project.priority)}`}>
                                                        {project.priority}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                                    <div>
                                                        <span className="text-gray-400">Type:</span>
                                                        <span className="text-gray-200 ml-1">{project.projectType.replace('-', ' ')}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Source:</span>
                                                        <span className="text-gray-200 ml-1">{project.sourceName}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Assigned to:</span>
                                                        <div className="ml-1">
                                                            {project.assignedMemberNames.length > 0 ? (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {project.assignedMemberNames.map((name, idx) => {
                                                                        const memberId = project.assignedMemberIds[idx];
                                                                        const isLeadME = memberId === project.leadMEMemberId;

                                                                        return (
                                                                            <span
                                                                                key={idx}
                                                                                className={`inline-flex items-center gap-1 ${isLeadME
                                                                                    ? 'text-yellow-400 font-semibold'
                                                                                    : 'text-gray-200'
                                                                                    }`}
                                                                            >
                                                                                {name}
                                                                                {isLeadME && (
                                                                                    <span className="text-xs px-1 py-0.5 rounded bg-yellow-500/20 text-yellow-300">
                                                                                        LEAD
                                                                                    </span>
                                                                                )}
                                                                                {idx < project.assignedMemberNames.length - 1 && ', '}
                                                                            </span>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-200">Not assigned</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {project.evaluationReports.length > 0 && (
                                                    <div className="mt-2 text-sm">
                                                        <span className="text-green-400">
                                                            ✅ {project.evaluationReports.length} report(s) submitted
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setShowProjectDetailsModal(project)}
                                                    className="btn-secondary text-sm py-1"
                                                >
                                                    👁️ View Details
                                                </button>
                                                {project.evaluationReports.length > 0 && (
                                                    <button
                                                        onClick={() => setShowReportModal(project)}
                                                        className="btn-primary text-sm py-1"
                                                    >
                                                        📊 View Report
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Reports Tab Content */}
                {activeTab === 'reports' && (
                    <div className="bg-primary-800 rounded-lg p-4">
                        {paginatedCompletedProjects.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-lg">No monitoring reports available yet.</p>
                                <p className="text-gray-500 text-sm mt-2">
                                    Reports will appear here once M&E team members complete their evaluations.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {paginatedCompletedProjects.map((project) => (
                                    <div key={project.id} className="bg-primary-700 rounded-lg p-4 border border-primary-600">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <h3 className="text-white font-semibold">{project.name}</h3>
                                                    {project.leadMEMemberId && (
                                                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-black">
                                                            ⭐ HAS LEAD M&E
                                                        </span>
                                                    )}
                                                    {project.caDecision ? (
                                                        <span className={`px-2 py-0.5 rounded-full text-xs text-white ${project.caDecision === 'approved' ? 'bg-green-600' : 'bg-red-600'
                                                            }`}>
                                                            CA: {project.caDecision}
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded-full text-xs text-white bg-orange-600">
                                                            Awaiting CA Decision
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    {project.evaluationReports.map((report) => {
                                                        const isLeadMEReport = report.isLeadMEReport || false;

                                                        return (
                                                            <div
                                                                key={report.id}
                                                                className={`rounded p-3 text-sm ${isLeadMEReport
                                                                    ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600/50'
                                                                    : 'bg-primary-800'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                                                                    <span className="text-gray-300">
                                                                        Report by: <span className={isLeadMEReport ? 'text-yellow-400 font-semibold' : 'text-white'}>{report.evaluatorName}</span>
                                                                        {isLeadMEReport && (
                                                                            <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-bold">
                                                                                ⭐ LEAD M&E
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                    <span className={`px-2 py-0.5 rounded text-xs text-white ${report.recommendation === 'approve' ? 'bg-green-600' :
                                                                        report.recommendation === 'reject' ? 'bg-red-600' : 'bg-yellow-600'
                                                                        }`}>
                                                                        Recommends: {report.recommendation}
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-400">{report.findings.substring(0, 150)}...</p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setShowReportModal(project)}
                                                    className="btn-primary text-sm py-1"
                                                >
                                                    📊 Review & Decide
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {getTotalPages() > 1 && (
                    <div className="flex items-center justify-between bg-primary-800 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">
                            Page {currentPage} of {getTotalPages()}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded bg-primary-700 text-gray-300 disabled:opacity-50"
                            >
                                ← Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(getTotalPages(), p + 1))}
                                disabled={currentPage === getTotalPages()}
                                className="px-3 py-1 rounded bg-primary-700 text-gray-300 disabled:opacity-50"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}

                {/* Create Member Modal */}
                {showCreateMemberModal && (
                    <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowCreateMemberModal(false)}>
                        <div className="min-h-screen flex items-center justify-center py-8">
                            <div className="w-full max-w-2xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">➕ Create M&E Team Member</h3>
                                    <button onClick={() => setShowCreateMemberModal(false)} className="text-gray-400 hover:text-white">✖</button>
                                </div>
                                <form onSubmit={handleCreateMember} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-1">Full Name *</label>
                                            <input
                                                type="text"
                                                value={memberFormData.fullName}
                                                onChange={(e) => setMemberFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                                className="w-full px-3 py-2 rounded-md bg-primary-700 text-white border border-primary-600"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-1">Email *</label>
                                            <input
                                                type="email"
                                                value={memberFormData.email}
                                                onChange={(e) => setMemberFormData(prev => ({ ...prev, email: e.target.value }))}
                                                className="w-full px-3 py-2 rounded-md bg-primary-700 text-white border border-primary-600"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-1">Phone</label>
                                            <input
                                                type="tel"
                                                value={memberFormData.phone}
                                                onChange={(e) => setMemberFormData(prev => ({ ...prev, phone: e.target.value }))}
                                                className="w-full px-3 py-2 rounded-md bg-primary-700 text-white border border-primary-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-1">Password *</label>
                                            <input
                                                type="password"
                                                value={memberFormData.password}
                                                onChange={(e) => setMemberFormData(prev => ({ ...prev, password: e.target.value }))}
                                                className="w-full px-3 py-2 rounded-md bg-primary-700 text-white border border-primary-600"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-1">Position</label>
                                            <input
                                                type="text"
                                                value={memberFormData.position}
                                                onChange={(e) => setMemberFormData(prev => ({ ...prev, position: e.target.value }))}
                                                className="w-full px-3 py-2 rounded-md bg-primary-700 text-white border border-primary-600"
                                                placeholder="e.g., Field Evaluator, Senior Analyst"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-1">Department</label>
                                            <input
                                                type="text"
                                                value={memberFormData.department}
                                                onChange={(e) => setMemberFormData(prev => ({ ...prev, department: e.target.value }))}
                                                className="w-full px-3 py-2 rounded-md bg-primary-700 text-white border border-primary-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-1">State</label>
                                            <select
                                                value={memberFormData.state}
                                                onChange={(e) => setMemberFormData(prev => ({ ...prev, state: e.target.value }))}
                                                className="w-full px-3 py-2 rounded-md bg-primary-700 text-white border border-primary-600"
                                            >
                                                <option value="">Select State</option>
                                                {nigerianStates.map(state => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-1">LGA</label>
                                            <input
                                                type="text"
                                                value={memberFormData.lga}
                                                onChange={(e) => setMemberFormData(prev => ({ ...prev, lga: e.target.value }))}
                                                className="w-full px-3 py-2 rounded-md bg-primary-700 text-white border border-primary-600"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm text-gray-300 mb-1">Address</label>
                                            <input
                                                type="text"
                                                value={memberFormData.address}
                                                onChange={(e) => setMemberFormData(prev => ({ ...prev, address: e.target.value }))}
                                                className="w-full px-3 py-2 rounded-md bg-primary-700 text-white border border-primary-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-1">Qualification</label>
                                            <input
                                                type="text"
                                                value={memberFormData.qualification}
                                                onChange={(e) => setMemberFormData(prev => ({ ...prev, qualification: e.target.value }))}
                                                className="w-full px-3 py-2 rounded-md bg-primary-700 text-white border border-primary-600"
                                                placeholder="e.g., B.Sc Agriculture, M.Sc Economics"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-1">Years of Experience</label>
                                            <input
                                                type="text"
                                                value={memberFormData.yearsOfExperience}
                                                onChange={(e) => setMemberFormData(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
                                                className="w-full px-3 py-2 rounded-md bg-primary-700 text-white border border-primary-600"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm text-gray-300 mb-1">Specialization</label>
                                            <input
                                                type="text"
                                                value={memberFormData.specialization}
                                                onChange={(e) => setMemberFormData(prev => ({ ...prev, specialization: e.target.value }))}
                                                className="w-full px-3 py-2 rounded-md bg-primary-700 text-white border border-primary-600"
                                                placeholder="e.g., Crop Farming, Livestock, Financial Verification"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-4 border-t border-primary-700">
                                        <button type="button" onClick={() => setShowCreateMemberModal(false)} className="btn-secondary">
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn-primary">
                                            ➕ Create Member
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Member Details Modal */}
                {showMemberDetailsModal && (
                    <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowMemberDetailsModal(null)}>
                        <div className="min-h-screen flex items-center justify-center py-8">
                            <div className="w-full max-w-lg bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">👤 Member Details</h3>
                                    <button onClick={() => setShowMemberDetailsModal(null)} className="text-gray-400 hover:text-white">✖</button>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-accent-600 rounded-full mx-auto flex items-center justify-center text-3xl text-white mb-2">
                                            {showMemberDetailsModal.formData.fullName.charAt(0)}
                                        </div>
                                        <h4 className="text-xl font-bold text-white">{showMemberDetailsModal.formData.fullName}</h4>
                                        <p className="text-gray-400">{showMemberDetailsModal.formData.position || 'M&E Team Member'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-gray-400">Email:</span>
                                            <p className="text-white">{showMemberDetailsModal.email}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Phone:</span>
                                            <p className="text-white">{showMemberDetailsModal.formData.phone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">State:</span>
                                            <p className="text-white">{showMemberDetailsModal.formData.state || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Status:</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs text-white ${getStatusBadge(showMemberDetailsModal.status)}`}>
                                                {showMemberDetailsModal.status}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Assigned Projects:</span>
                                            <p className="text-white">{showMemberDetailsModal.assignedProjectsCount}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Completed:</span>
                                            <p className="text-white">{showMemberDetailsModal.completedProjectsCount}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-4 border-t border-primary-700">
                                        <button
                                            onClick={() => {
                                                handleDeleteMember(showMemberDetailsModal.id);
                                            }}
                                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            🗑️ Delete
                                        </button>
                                        <button
                                            onClick={() => setShowMemberDetailsModal(null)}
                                            className="btn-secondary"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Report Review Modal */}
                {showReportModal && (
                    <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowReportModal(null)}>
                        <div className="min-h-screen flex items-center justify-center py-8">
                            <div className="w-full max-w-3xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">📊 M&E Evaluation Report</h3>
                                    <button onClick={() => setShowReportModal(null)} className="text-gray-400 hover:text-white">✖</button>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-primary-800 rounded-lg p-4">
                                        <h4 className="text-white font-medium mb-2">{showReportModal.name}</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-gray-400">Type:</span>
                                                <span className="text-white ml-1">{showReportModal.projectType}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Source:</span>
                                                <span className="text-white ml-1">{showReportModal.sourceName}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {showReportModal.evaluationReports.map((report) => (
                                        <div key={report.id} className="bg-primary-800 rounded-lg p-4 border border-primary-700">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <p className="text-white font-medium">Report by {report.evaluatorName}</p>
                                                    <p className="text-gray-400 text-sm">
                                                        Submitted: {new Date(report.submittedAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-sm text-white ${report.recommendation === 'approve' ? 'bg-green-600' :
                                                    report.recommendation === 'reject' ? 'bg-red-600' : 'bg-yellow-600'
                                                    }`}>
                                                    Recommends: {report.recommendation.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-gray-400 text-sm">Findings:</p>
                                                    <p className="text-white">{report.findings}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-sm">Reason for Recommendation:</p>
                                                    <p className="text-white">{report.recommendationReason}</p>
                                                </div>
                                                {report.additionalNotes && (
                                                    <div>
                                                        <p className="text-gray-400 text-sm">Additional Notes:</p>
                                                        <p className="text-white">{report.additionalNotes}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {!showReportModal.caDecision && (
                                        <div className="border-t border-primary-700 pt-4">
                                            <h4 className="text-white font-medium mb-3">CA Decision</h4>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleCADecision(showReportModal.id, 'approved')}
                                                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                >
                                                    ✅ Approve
                                                </button>
                                                <button
                                                    onClick={() => handleCADecision(showReportModal.id, 'rejected', 'Based on M&E evaluation')}
                                                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                >
                                                    ❌ Reject
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {showReportModal.caDecision && (
                                        <div className="bg-primary-800 rounded-lg p-4 border border-green-600">
                                            <p className="text-green-400 font-medium">
                                                ✅ CA Decision: {showReportModal.caDecision.toUpperCase()}
                                            </p>
                                            {showReportModal.caDecisionNotes && (
                                                <p className="text-gray-300 text-sm mt-1">{showReportModal.caDecisionNotes}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center text-gray-400 text-sm py-4">
                    Powered by Mc. George
                </div>
            </div>
        </PortalLayout>
    );
};

export default METeamPortal;

