import React, { useState, useMemo, useEffect } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { useNotifications } from '../../../context/NotificationContext';
import {
    MEMemberRecord,
    MEProject,
    getActiveMEMemberRecord,
    getMEProjectsByMemberId,
    submitMEEvaluationReport,
    updateMEProjectStatus,
    findMEProjectById,
    saveMEMemberSession,
    clearMEMemberSession,
    authenticateMEMember,
} from '../../../utils/localDatabase';

const MEMemberPortal: React.FC = () => {
    const { addNotification } = useNotifications();

    // State management
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentMember, setCurrentMember] = useState<MEMemberRecord | null>(null);
    const [projects, setProjects] = useState<MEProject[]>([]);
    const [activeTab, setActiveTab] = useState<'assigned' | 'in-progress' | 'completed'>('assigned');
    const [selectedProject, setSelectedProject] = useState<MEProject | null>(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [personalDetailsExpanded, setPersonalDetailsExpanded] = useState(false);

    // Login form state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Report form state
    const [reportForm, setReportForm] = useState({
        findings: '',
        recommendation: 'pending' as 'approve' | 'reject' | 'pending',
        recommendationReason: '',
        additionalNotes: '',
    });

    // Check for existing session
    useEffect(() => {
        const member = getActiveMEMemberRecord();
        if (member) {
            setCurrentMember(member);
            setIsLoggedIn(true);
        }
    }, []);

    // Load projects when logged in
    useEffect(() => {
        if (currentMember) {
            const memberProjects = getMEProjectsByMemberId(currentMember.id);
            setProjects(memberProjects);
        }
    }, [currentMember, refreshTrigger]);

    // Sidebar items for M&E member
    const sidebarItems = [
        { id: 'dashboard', name: 'My Projects', icon: '📂', href: '/portal/me-member' },
        { id: 'assigned', name: 'Assigned Projects', icon: '📋', href: '#assigned' },
        { id: 'in-progress', name: 'In Progress', icon: '🔄', href: '#in-progress' },
        { id: 'completed', name: 'Completed', icon: '✅', href: '#completed' },
        { id: 'logout', name: 'Logout', icon: '🚪', href: '#logout' },
    ];

    // Refresh function
    const refreshData = () => setRefreshTrigger(prev => prev + 1);

    // Show toast message
    const showToast = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    // Handle login
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

        const member = authenticateMEMember(loginEmail, loginPassword);
        if (member) {
            saveMEMemberSession(member);
            setCurrentMember(member);
            setIsLoggedIn(true);
            showToast(`✅ Welcome, ${member.formData.fullName}!`);
        } else {
            setLoginError('Invalid email or password, or account is not active.');
        }
    };

    // Handle logout
    const handleLogout = () => {
        clearMEMemberSession();
        setCurrentMember(null);
        setIsLoggedIn(false);
        setProjects([]);
    };

    // Filter projects by tab
    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            switch (activeTab) {
                case 'assigned':
                    return project.status === 'pending';
                case 'in-progress':
                    return project.status === 'in-progress';
                case 'completed':
                    return project.status === 'evaluation-complete' || project.status === 'archived';
                default:
                    return true;
            }
        });
    }, [projects, activeTab]);

    // Start evaluation (move to in-progress)
    const handleStartEvaluation = (projectId: string) => {
        try {
            updateMEProjectStatus(projectId, 'in-progress');
            showToast('✅ Evaluation started. Project moved to In Progress.');
            refreshData();
        } catch (error: any) {
            showToast(`❌ ${error.message}`);
        }
    };

    // Submit evaluation report
    const handleSubmitReport = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedProject || !currentMember) return;

        if (!reportForm.findings.trim()) {
            showToast('❌ Please provide your findings');
            return;
        }

        if (reportForm.recommendation === 'pending') {
            showToast('❌ Please select a recommendation (Approve or Reject)');
            return;
        }

        if (!reportForm.recommendationReason.trim()) {
            showToast('❌ Please provide a reason for your recommendation');
            return;
        }

        try {
            submitMEEvaluationReport(selectedProject.id, {
                evaluatorId: currentMember.id,
                evaluatorName: currentMember.formData.fullName,
                findings: reportForm.findings,
                recommendation: reportForm.recommendation,
                recommendationReason: reportForm.recommendationReason,
                additionalNotes: reportForm.additionalNotes || undefined,
            });

            // Send notification to CA
            addNotification({
                role: `📋 M&E Team - ${currentMember.formData.fullName}`,
                targetRole: 'coordinating-agency',
                message: `M&E evaluation report submitted for "${selectedProject.name}". Recommendation: ${reportForm.recommendation.toUpperCase()}`,
                metadata: {
                    type: 'meEvaluationReport',
                    projectId: selectedProject.id,
                    evaluatorId: currentMember.id,
                    recommendation: reportForm.recommendation,
                },
            });

            showToast('✅ Evaluation report submitted successfully!');
            setShowReportModal(false);
            setSelectedProject(null);
            setReportForm({
                findings: '',
                recommendation: 'pending',
                recommendationReason: '',
                additionalNotes: '',
            });
            refreshData();
        } catch (error: any) {
            showToast(`❌ ${error.message}`);
        }
    };

    // Check if member already submitted report for a project
    const hasSubmittedReport = (project: MEProject) => {
        return currentMember && project.evaluationReports.some(
            report => report.evaluatorId === currentMember.id
        );
    };

    // Get member's report for a project
    const getMemberReport = (project: MEProject) => {
        return currentMember ? project.evaluationReports.find(
            report => report.evaluatorId === currentMember.id
        ) : null;
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            'pending': 'bg-yellow-600',
            'in-progress': 'bg-blue-600',
            'evaluation-complete': 'bg-green-600',
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

    // Render full application view (matching CA's More Info modal format)
    const renderFullApplicationView = (submissionData: any, projectType: string) => {
        if (!submissionData || Object.keys(submissionData).length === 0) return null;

        const buildEntries = (source: Record<string, any>, labels: Record<string, string>) =>
            Object.entries(labels)
                .map(([key, label]) => {
                    const rawValue = source?.[key];
                    if (rawValue === undefined || rawValue === null) return null;
                    const value = Array.isArray(rawValue) ? rawValue.join(', ') : String(rawValue);
                    const trimmed = value.trim();
                    if (!trimmed || trimmed === 'Not provided') return null;
                    return { label, value: trimmed };
                })
                .filter(Boolean) as { label: string; value: string }[];

        const renderGroup = (
            title: string,
            entries: { label: string; value: string }[],
            action?: React.ReactNode
        ) => (
            <div key={title} className="bg-primary-900/60 rounded-md border border-primary-700 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <h6 className="text-sm font-semibold text-accent-300">{title}</h6>
                    {action}
                </div>
                {entries.length > 0 ? (
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                        {entries.map(({ label, value }) => (
                            <div key={label}>
                                <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
                                <dd className="text-sm text-gray-100 mt-1 whitespace-pre-line break-words">{value}</dd>
                            </div>
                        ))}
                    </dl>
                ) : (
                    <p className="text-xs text-gray-500">No data provided.</p>
                )}
            </div>
        );

        // Handle leave request data
        if (submissionData.leaveReason && submissionData.anchorName) {
            return (
                <div className="space-y-4">
                    <h5 className="text-sm font-semibold text-accent-400 uppercase tracking-wide">Leave Request Verification Details</h5>

                    {/* Leave Request Summary */}
                    <div className="bg-primary-900/60 rounded-md border border-primary-700 p-4 space-y-3">
                        <h6 className="text-sm font-semibold text-accent-300">Leave Request Details</h6>
                        <div className="space-y-3">
                            <div>
                                <dt className="text-xs uppercase tracking-wide text-gray-400">Reason for Leaving</dt>
                                <dd className="text-sm text-gray-100 mt-1 p-3 bg-primary-800 rounded whitespace-pre-line">
                                    {submissionData.leaveReason}
                                </dd>
                            </div>

                        </div>
                    </div>

                    {/* Producer Information */}
                    {submissionData.producerName && (
                        <div className="bg-primary-900/60 rounded-md border border-primary-700 p-4 space-y-3">
                            <h6 className="text-sm font-semibold text-accent-300">Producer Information</h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                <div>
                                    <dt className="text-xs uppercase tracking-wide text-gray-400">Producer Name</dt>
                                    <dd className="text-sm text-gray-100 mt-1">{submissionData.producerName}</dd>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Anchor Information */}
                    {submissionData.anchorName && (
                        <div className="bg-primary-900/60 rounded-md border border-primary-700 p-4 space-y-3">
                            <h6 className="text-sm font-semibold text-accent-300">Anchor Information</h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                <div>
                                    <dt className="text-xs uppercase tracking-wide text-gray-400">Anchor Name</dt>
                                    <dd className="text-sm text-gray-100 mt-1">{submissionData.anchorName}</dd>
                                </div>
                            </div>
                        </div>
                    )}


                </div>
            );
        }

        // Handle scheme application data
        if (projectType === 'scheme-application' && submissionData.applicationData) {
            const appData = submissionData.applicationData;
            return (
                <div className="space-y-4">
                    <h5 className="text-sm font-semibold text-accent-400 uppercase tracking-wide">Scheme Application Details</h5>
                    <div className="bg-primary-900/60 rounded-md border border-primary-700 p-4 space-y-3">
                        {appData.produceType && (
                            <div>
                                <dt className="text-xs uppercase tracking-wide text-gray-400">Produce Type</dt>
                                <dd className="text-sm text-gray-100 mt-1">{appData.produceType}</dd>
                            </div>
                        )}
                        {appData.documents && appData.documents.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-primary-700">
                                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Supporting Documents</p>
                                <ul className="list-disc list-inside text-sm text-gray-100 space-y-1">
                                    {appData.documents.map((doc: any, idx: number) => (
                                        <li key={idx}>
                                            {doc.fileName} {doc.description && `(${doc.description})`}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // Handle registration data
        const step1 = submissionData.step1 ?? {};
        const step2 = submissionData.step2 ?? {};
        const step3 = submissionData.step3 ?? {};
        const step4 = submissionData.step4 ?? {};
        const step5 = submissionData.step5 ?? {};
        const step6 = submissionData.step6 ?? {};

        const personalDetailsEntries = buildEntries(step1, {
            fullName: 'Full Name',
            gender: 'Gender',
            birthDate: 'Date of Birth',
            phone: 'Phone Number',
            email: 'Email Address',
            address: 'Address',
            city: 'City',
            state: 'State',
            country: 'Country',
        });

        const farmDetailsEntries = buildEntries(step2, {
            farmBusinessName: 'Farm Business Name',
            typeOfFarmer: 'Type of Farmer',
            farmAddress: 'Farm Address',
            farmSize: 'Farm Size',
            yearsOfExperience: 'Years of Experience',
            primarySourceOfIncome: 'Primary Source of Income',
            farmerAssociation: 'Farmer Association',
        });

        const productionEntries = buildEntries(step3, {
            crops: 'Crops',
            livestock: 'Livestock',
            hasProcessingValueAddition: 'Has Processing/Value Addition',
            processingValueAdditionDetails: 'Processing/Value Addition Details',
        });

        const marketEntries = buildEntries(step4, {
            totalAnnualProduction: 'Total Annual Production',
            primaryMarket: 'Primary Market',
            majorBuyers: 'Major Buyers',
            challengesFaced: 'Challenges Faced',
        });

        const verificationEntries = buildEntries(step5, {
            idType: 'ID Type',
            idNumber: 'ID Number',
            idDocumentName: 'Uploaded ID Document',
            farmImagesName: 'Farm Images',
            certificationName: 'Certification',
        });

        const paymentEntries = buildEntries(step6, {
            preferredPaymentMethod: 'Preferred Payment Method',
            bankName: 'Bank Name',
            accountName: 'Account Name',
            accountNumber: 'Account Number',
        });

        return (
            <div className="space-y-4">
                <h5 className="text-sm font-semibold text-accent-400 uppercase tracking-wide">Personal & Farm Info</h5>
                {renderGroup('Personal Details', personalDetailsEntries)}
                {renderGroup('Farm Details', farmDetailsEntries)}
                {renderGroup('Production Information', productionEntries)}
                {renderGroup('Market Information', marketEntries)}
                {renderGroup('Verification & Documents', verificationEntries)}
                {renderGroup('Payment Information', paymentEntries)}
            </div>
        );
    };


    // Login Screen
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-primary-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-primary-800 rounded-lg p-8 border border-primary-700">
                        <div className="text-center mb-6">
                            <div className="text-5xl mb-4">📋</div>
                            <h1 className="text-2xl font-bold text-white">M&E Member Portal</h1>
                            <p className="text-gray-400 mt-2">Login to access your assigned projects</p>
                        </div>

                        {loginError && (
                            <div className="bg-red-900/50 border border-red-600 text-red-300 p-3 rounded-lg mb-4">
                                {loginError}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    className="w-full px-4 py-2 rounded-md bg-primary-700 text-white border border-primary-600 focus:ring-2 focus:ring-accent-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    className="w-full px-4 py-2 rounded-md bg-primary-700 text-white border border-primary-600 focus:ring-2 focus:ring-accent-500"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full btn-primary py-3">
                                🔐 Login
                            </button>
                        </form>

                        <p className="text-center text-gray-500 text-sm mt-6">
                            Contact your Coordinating Agency administrator if you need access.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Main Portal UI
    return (
        <PortalLayout role={`M&E Member - ${currentMember?.formData.fullName}`} roleIcon="📋" sidebarItems={sidebarItems}>
            <div className="space-y-6">
                {/* Toast notification */}
                {toast && (
                    <div className="fixed top-4 right-4 z-50 bg-primary-800 border border-primary-600 rounded-lg p-4 shadow-lg">
                        <p className="text-white">{toast}</p>
                    </div>
                )}

                {/* Header */}
                <div className="bg-gradient-to-r from-accent-700 to-accent-900 rounded-lg p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-2">
                                👋 Welcome, {currentMember?.formData.fullName}
                            </h1>
                            <p className="text-gray-200">
                                {currentMember?.formData.position || 'M&E Team Member'} | {currentMember?.formData.state || 'Nigeria'}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={refreshData} className="btn-secondary">
                                🔄 Refresh
                            </button>
                            <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                🚪 Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-primary-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Assigned Projects</p>
                                <p className="text-2xl font-bold text-white">
                                    {projects.filter(p => p.status === 'pending').length}
                                </p>
                            </div>
                            <div className="text-3xl">📋</div>
                        </div>
                    </div>
                    <div className="bg-primary-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">In Progress</p>
                                <p className="text-2xl font-bold text-white">
                                    {projects.filter(p => p.status === 'in-progress').length}
                                </p>
                            </div>
                            <div className="text-3xl">🔄</div>
                        </div>
                    </div>
                    <div className="bg-primary-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Completed</p>
                                <p className="text-2xl font-bold text-white">
                                    {projects.filter(p => p.status === 'evaluation-complete' || p.status === 'archived').length}
                                </p>
                            </div>
                            <div className="text-3xl">✅</div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-primary-800 rounded-lg p-2">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveTab('assigned')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'assigned' ? 'bg-accent-600 text-white' : 'text-gray-300 hover:bg-primary-700'
                                }`}
                        >
                            📋 Assigned ({projects.filter(p => p.status === 'pending').length})
                        </button>
                        <button
                            onClick={() => setActiveTab('in-progress')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'in-progress' ? 'bg-accent-600 text-white' : 'text-gray-300 hover:bg-primary-700'
                                }`}
                        >
                            🔄 In Progress ({projects.filter(p => p.status === 'in-progress').length})
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'completed' ? 'bg-accent-600 text-white' : 'text-gray-300 hover:bg-primary-700'
                                }`}
                        >
                            ✅ Completed ({projects.filter(p => p.status === 'evaluation-complete' || p.status === 'archived').length})
                        </button>
                    </div>
                </div>

                {/* Projects List */}
                <div className="bg-primary-800 rounded-lg p-4">
                    {filteredProjects.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg">
                                {activeTab === 'assigned' && 'No new projects assigned to you.'}
                                {activeTab === 'in-progress' && 'No projects currently in progress.'}
                                {activeTab === 'completed' && 'No completed evaluations yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredProjects.map((project) => {
                                const isLeadME = currentMember && project.leadMEMemberId === currentMember.id;

                                return (
                                    <div
                                        key={project.id}
                                        className={`rounded-lg p-4 border ${isLeadME
                                            ? 'bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-600/50'
                                            : 'bg-primary-700 border-primary-600'
                                            }`}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <h3 className="text-white font-semibold">{project.name}</h3>
                                                    {isLeadME && (
                                                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-black">
                                                            ⭐ YOU ARE THE LEAD M&E
                                                        </span>
                                                    )}
                                                    <span className={`px-2 py-0.5 rounded-full text-xs text-white ${getStatusBadge(project.status)}`}>
                                                        {project.status.replace('-', ' ')}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs text-white ${getPriorityBadge(project.priority)}`}>
                                                        {project.priority}
                                                    </span>
                                                </div>

                                                {project.description && (
                                                    <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                                                )}

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <span className="text-gray-400">Type:</span>
                                                        <span className="text-gray-200 ml-1">{project.projectType.replace('-', ' ')}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Subject:</span>
                                                        <span className="text-gray-200 ml-1">{project.sourceName}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Source Type:</span>
                                                        <span className="text-gray-200 ml-1 capitalize">{project.sourceType}</span>
                                                    </div>
                                                    {project.schemeName && (
                                                        <div>
                                                            <span className="text-gray-400">Scheme:</span>
                                                            <span className="text-gray-200 ml-1">{project.schemeName}</span>
                                                        </div>
                                                    )}
                                                    {project.dueDate && (
                                                        <div>
                                                            <span className="text-gray-400">Due Date:</span>
                                                            <span className="text-gray-200 ml-1">{new Date(project.dueDate).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {isLeadME && (
                                                    <div className="mt-3 p-2 bg-yellow-900/30 border border-yellow-600/50 rounded text-sm">
                                                        <span className="text-yellow-300">
                                                            💡 As the Lead M&E, your report will be marked as priority for the Coordinating Agency.
                                                        </span>
                                                    </div>
                                                )}

                                                {hasSubmittedReport(project) && (
                                                    <div className="mt-3 p-2 bg-green-900/30 border border-green-700 rounded text-sm">
                                                        <span className="text-green-400">✅ You have submitted your evaluation report</span>
                                                        <span className="text-gray-400 ml-2">
                                                            (Recommendation: {getMemberReport(project)?.recommendation})
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => setSelectedProject(project)}
                                                    className="btn-secondary text-sm py-1"
                                                >
                                                    👁️ View Details
                                                </button>

                                                {project.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleStartEvaluation(project.id)}
                                                        className="btn-primary text-sm py-1"
                                                    >
                                                        ▶️ Start Evaluation
                                                    </button>
                                                )}

                                                {project.status === 'in-progress' && !hasSubmittedReport(project) && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProject(project);
                                                            setShowReportModal(true);
                                                        }}
                                                        className="btn-primary text-sm py-1"
                                                    >
                                                        📝 Submit Report
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

                {/* Project Details Modal */}
                {selectedProject && !showReportModal && (
                    <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setSelectedProject(null)}>
                        <div className="min-h-screen flex items-center justify-center py-8">
                            <div className="w-full max-w-3xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">📂 Project Details</h3>
                                    <button onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-white">✖</button>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-primary-800 rounded-lg p-4">
                                        <h4 className="text-white font-semibold text-lg mb-2">{selectedProject.name}</h4>
                                        {selectedProject.description && (
                                            <p className="text-gray-400">{selectedProject.description}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-primary-800 rounded-lg p-4">
                                            <h5 className="text-gray-400 text-sm mb-2">Subject Information</h5>
                                            <div className="space-y-2 text-sm">
                                                <div>
                                                    <span className="text-gray-400">Name:</span>
                                                    <span className="text-white ml-1">{selectedProject.sourceName}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Type:</span>
                                                    <span className="text-white ml-1 capitalize">{selectedProject.sourceType}</span>
                                                </div>
                                                {selectedProject.sourceEmail && (
                                                    <div>
                                                        <span className="text-gray-400">Email:</span>
                                                        <span className="text-white ml-1">{selectedProject.sourceEmail}</span>
                                                    </div>
                                                )}
                                                {selectedProject.sourcePhone && (
                                                    <div>
                                                        <span className="text-gray-400">Phone:</span>
                                                        <span className="text-white ml-1">{selectedProject.sourcePhone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-primary-800 rounded-lg p-4">
                                            <h5 className="text-gray-400 text-sm mb-2">Project Details</h5>
                                            <div className="space-y-2 text-sm">
                                                <div>
                                                    <span className="text-gray-400">Type:</span>
                                                    <span className="text-white ml-1">{selectedProject.projectType.replace('-', ' ')}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Priority:</span>
                                                    <span className={`ml-1 px-2 py-0.5 rounded text-xs text-white ${getPriorityBadge(selectedProject.priority)}`}>
                                                        {selectedProject.priority}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Created:</span>
                                                    <span className="text-white ml-1">{new Date(selectedProject.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submission Data */}
                                    {selectedProject.submissionData && Object.keys(selectedProject.submissionData).length > 0 && (
                                        <div className="bg-primary-800 rounded-lg p-4">
                                            <h5 className="text-gray-400 text-sm mb-3">📄 Attached Submission Data</h5>
                                            <div className="max-h-96 overflow-y-auto">
                                                {renderFullApplicationView(selectedProject.submissionData, selectedProject.projectType)}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div className="flex justify-end gap-2 pt-4 border-t border-primary-700">
                                        {selectedProject.status === 'pending' && (
                                            <button
                                                onClick={() => {
                                                    handleStartEvaluation(selectedProject.id);
                                                    setSelectedProject(null);
                                                }}
                                                className="btn-primary"
                                            >
                                                ▶️ Start Evaluation
                                            </button>
                                        )}
                                        {selectedProject.status === 'in-progress' && !hasSubmittedReport(selectedProject) && (
                                            <button
                                                onClick={() => setShowReportModal(true)}
                                                className="btn-primary"
                                            >
                                                📝 Submit Report
                                            </button>
                                        )}
                                        <button onClick={() => setSelectedProject(null)} className="btn-secondary">
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit Report Modal */}
                {showReportModal && selectedProject && (
                    <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowReportModal(false)}>
                        <div className="min-h-screen flex items-center justify-center py-8">
                            <div className="w-full max-w-2xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">📝 Submit Evaluation Report</h3>
                                    <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-white">✖</button>
                                </div>

                                <div className="bg-primary-800 rounded-lg p-3 mb-4">
                                    <p className="text-gray-400 text-sm">Project:</p>
                                    <p className="text-white font-medium">{selectedProject.name}</p>
                                </div>

                                <form onSubmit={handleSubmitReport} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1">Findings *</label>
                                        <textarea
                                            value={reportForm.findings}
                                            onChange={(e) => setReportForm(prev => ({ ...prev, findings: e.target.value }))}
                                            rows={4}
                                            className="w-full px-3 py-2 rounded-md bg-primary-700 text-white border border-primary-600"
                                            placeholder="Describe your findings from the evaluation..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1">Recommendation *</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="recommendation"
                                                    value="approve"
                                                    checked={reportForm.recommendation === 'approve'}
                                                    onChange={(e) => setReportForm(prev => ({ ...prev, recommendation: 'approve' }))}
                                                    className="text-green-500"
                                                />
                                                <span className="text-green-400">✅ Approve</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="recommendation"
                                                    value="reject"
                                                    checked={reportForm.recommendation === 'reject'}
                                                    onChange={(e) => setReportForm(prev => ({ ...prev, recommendation: 'reject' }))}
                                                    className="text-red-500"
                                                />
                                                <span className="text-red-400">❌ Reject</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1">Reason for Recommendation *</label>
                                        <textarea
                                            value={reportForm.recommendationReason}
                                            onChange={(e) => setReportForm(prev => ({ ...prev, recommendationReason: e.target.value }))}
                                            rows={3}
                                            className="w-full px-3 py-2 rounded-md bg-primary-700 text-white border border-primary-600"
                                            placeholder="Explain why you are making this recommendation..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1">Additional Notes (Optional)</label>
                                        <textarea
                                            value={reportForm.additionalNotes}
                                            onChange={(e) => setReportForm(prev => ({ ...prev, additionalNotes: e.target.value }))}
                                            rows={2}
                                            className="w-full px-3 py-2 rounded-md bg-primary-700 text-white border border-primary-600"
                                            placeholder="Any additional observations or notes..."
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2 pt-4 border-t border-primary-700">
                                        <button type="button" onClick={() => setShowReportModal(false)} className="btn-secondary">
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn-primary">
                                            📤 Submit Report
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center text-gray-400 text-sm py-4">
                    Powered by Mc. George
                </div>
            </div>
        </PortalLayout >
    );
};

export default MEMemberPortal;

