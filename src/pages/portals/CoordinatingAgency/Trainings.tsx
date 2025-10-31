import React, { useState, useMemo } from 'react';
import PortalLayout from '../../../components/PortalLayout';

const Trainings: React.FC = () => {
  const sidebarItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: '🏠', 
      href: '/portal/coordinating-agency',
      hasDropdown: true,
      dropdownItems: [
        { id: 'activities', name: 'Activities', icon: '⚡', href: '/portal/coordinating-agency/activities' },
        { id: 'fund-schemes', name: 'Fund Schemes', icon: '💼', href: '/portal/coordinating-agency/fund-schemes' },
        { id: 'reportings', name: 'Reports', icon: '📑', href: '/portal/coordinating-agency/reportings' },
        { id: 'trainings', name: 'Trainings', icon: '📚', href: '/portal/coordinating-agency/trainings' }
      ]
    },
    { 
      id: 'state-monitoring', 
      name: 'State Monitoring Team', 
      icon: '🗺️', 
      href: '/portal/coordinating-agency/monitoring/state'
    },
    { 
      id: 'representative-body', 
      name: 'Representative Body', 
      icon: '🏛️', 
      href: '/portal/coordinating-agency/representative',
      hasDropdown: true,
      dropdownItems: [
        { id: 'rep-insurance', name: 'Insurance Companies', icon: '🛡️', href: '/portal/coordinating-agency/representative/insurance-companies' },
        { id: 'rep-extension', name: 'Extension Organizations', icon: '🌿', href: '/portal/coordinating-agency/representative/extension-organizations' },
        { id: 'rep-ngos', name: 'NGOs', icon: '🤝', href: '/portal/coordinating-agency/representative/ngos' }
      ]
    },
    { 
      id: 'applicants', 
      name: 'Applicants', 
      icon: '📝', 
      href: '/portal/coordinating-agency/applicants',
      hasDropdown: true,
      dropdownItems: [
        { id: 'fund-provider', name: 'Fund Provider', icon: '💼', href: '/portal/coordinating-agency/applicants/fund-provider' },
        { id: 'pfis', name: 'PFIs', icon: '🏦', href: '/portal/coordinating-agency/applicants/pfis' },
        { id: 'insurance-companies', name: 'Insurance Companies', icon: '🛡️', href: '/portal/coordinating-agency/applicants/insurance-companies' },
        { 
          id: 'fund-beneficiaries', 
          name: 'Fund Beneficiaries', 
          icon: '👥', 
          href: '/portal/coordinating-agency/fund-beneficiaries',
          hasDropdown: true,
          dropdownItems: [
            { id: 'lead-firms', name: 'Lead Firms', icon: '🏢', href: '/portal/coordinating-agency/fund-beneficiaries/lead-firms' },
            { id: 'anchors', name: 'Anchors', icon: '⚓', href: '/portal/coordinating-agency/fund-beneficiaries/anchors' },
            { id: 'cooperative-groups', name: 'Cooperative Groups', icon: '🤝', href: '/portal/coordinating-agency/fund-beneficiaries/cooperative-groups' },
            { id: 'producers-farmers', name: 'Producers/Farmers', icon: '🌾', href: '/portal/coordinating-agency/fund-beneficiaries/producers-farmers' }
          ]
        }
      ]
    },
    { 
      id: 'stakeholders', 
      name: 'Department', 
      icon: '🤝', 
      href: '/portal/coordinating-agency/stakeholders',
      hasDropdown: true,
      dropdownItems: [
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

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrainings, setSelectedTrainings] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const itemsPerPage = 6;

  // Training Programs Data
  const trainingPrograms = [
    {
      id: 'TR001',
      title: 'Agricultural Finance Fundamentals',
      category: 'Finance',
      instructor: 'Dr. Sarah Ibrahim',
      duration: '5 days',
      participants: 45,
      maxParticipants: 50,
      status: 'Ongoing',
      startDate: '2024-01-15',
      endDate: '2024-01-19',
      location: 'Lagos',
      description: 'Comprehensive training on agricultural finance principles, risk assessment, and loan management.',
      modules: ['Introduction to Ag Finance', 'Risk Assessment', 'Loan Structuring', 'Recovery Strategies', 'Case Studies']
    },
    {
      id: 'TR002',
      title: 'Digital Agriculture Technologies',
      category: 'Technology',
      instructor: 'Eng. Michael Adebayo',
      duration: '3 days',
      participants: 32,
      maxParticipants: 40,
      status: 'Completed',
      startDate: '2024-01-08',
      endDate: '2024-01-10',
      location: 'Abuja',
      description: 'Training on modern digital tools and technologies for agricultural productivity enhancement.',
      modules: ['IoT in Agriculture', 'Precision Farming', 'Data Analytics', 'Mobile Applications']
    },
    {
      id: 'TR003',
      title: 'Insurance Product Development',
      category: 'Insurance',
      instructor: 'Mrs. Fatima Usman',
      duration: '4 days',
      participants: 28,
      maxParticipants: 35,
      status: 'Scheduled',
      startDate: '2024-02-05',
      endDate: '2024-02-08',
      location: 'Kano',
      description: 'Specialized training on developing agricultural insurance products and risk management.',
      modules: ['Insurance Basics', 'Product Design', 'Risk Modeling', 'Claims Management']
    },
    {
      id: 'TR004',
      title: 'Cooperative Management Excellence',
      category: 'Management',
      instructor: 'Mr. John Okafor',
      duration: '6 days',
      participants: 38,
      maxParticipants: 45,
      status: 'Ongoing',
      startDate: '2024-01-22',
      endDate: '2024-01-27',
      location: 'Ibadan',
      description: 'Comprehensive training on cooperative management, governance, and financial sustainability.',
      modules: ['Cooperative Principles', 'Governance', 'Financial Management', 'Member Relations', 'Strategic Planning', 'Legal Compliance']
    },
    {
      id: 'TR005',
      title: 'Value Chain Analysis',
      category: 'Business',
      instructor: 'Dr. Amina Mohammed',
      duration: '3 days',
      participants: 25,
      maxParticipants: 30,
      status: 'Completed',
      startDate: '2024-01-12',
      endDate: '2024-01-14',
      location: 'Port Harcourt',
      description: 'Training on analyzing and optimizing agricultural value chains for maximum efficiency.',
      modules: ['Value Chain Mapping', 'Stakeholder Analysis', 'Gap Identification', 'Improvement Strategies']
    },
    {
      id: 'TR006',
      title: 'Climate-Smart Agriculture',
      category: 'Environment',
      instructor: 'Prof. Ibrahim Hassan',
      duration: '4 days',
      participants: 42,
      maxParticipants: 50,
      status: 'Scheduled',
      startDate: '2024-02-12',
      endDate: '2024-02-15',
      location: 'Kaduna',
      description: 'Training on sustainable agricultural practices and climate adaptation strategies.',
      modules: ['Climate Change Impact', 'Adaptation Strategies', 'Sustainable Practices', 'Technology Solutions']
    },
    {
      id: 'TR007',
      title: 'Financial Literacy for Farmers',
      category: 'Education',
      instructor: 'Ms. Grace Okonkwo',
      duration: '2 days',
      participants: 55,
      maxParticipants: 60,
      status: 'Ongoing',
      startDate: '2024-01-29',
      endDate: '2024-01-30',
      location: 'Enugu',
      description: 'Basic financial literacy training for smallholder farmers and cooperative members.',
      modules: ['Basic Accounting', 'Budget Planning', 'Savings Strategies', 'Investment Basics']
    },
    {
      id: 'TR008',
      title: 'Market Access and Linkages',
      category: 'Marketing',
      instructor: 'Mr. David Nwosu',
      duration: '3 days',
      participants: 30,
      maxParticipants: 40,
      status: 'Completed',
      startDate: '2024-01-18',
      endDate: '2024-01-20',
      location: 'Calabar',
      description: 'Training on market analysis, access strategies, and building sustainable market linkages.',
      modules: ['Market Research', 'Access Strategies', 'Partnership Building', 'Quality Standards']
    },
    {
      id: 'TR009',
      title: 'Post-Harvest Management',
      category: 'Processing',
      instructor: 'Dr. Maryam Abdullahi',
      duration: '3 days',
      participants: 35,
      maxParticipants: 45,
      status: 'Scheduled',
      startDate: '2024-02-20',
      endDate: '2024-02-22',
      location: 'Maiduguri',
      description: 'Training on proper post-harvest handling, storage, and processing techniques.',
      modules: ['Harvest Timing', 'Storage Methods', 'Processing Techniques', 'Quality Control']
    },
    {
      id: 'TR010',
      title: 'Leadership and Governance',
      category: 'Leadership',
      instructor: 'Chief Adebayo Ogunlesi',
      duration: '5 days',
      participants: 40,
      maxParticipants: 50,
      status: 'Ongoing',
      startDate: '2024-01-25',
      endDate: '2024-01-29',
      location: 'Akure',
      description: 'Leadership development training for agricultural cooperative leaders and managers.',
      modules: ['Leadership Principles', 'Team Management', 'Decision Making', 'Conflict Resolution', 'Strategic Vision']
    },
    {
      id: 'TR011',
      title: 'Digital Financial Services',
      category: 'Technology',
      instructor: 'Eng. Tunde Adeyemi',
      duration: '2 days',
      participants: 28,
      maxParticipants: 35,
      status: 'Completed',
      startDate: '2024-01-05',
      endDate: '2024-01-06',
      location: 'Lagos',
      description: 'Training on digital payment systems and financial technology for agricultural transactions.',
      modules: ['Digital Payments', 'Mobile Banking', 'E-Wallets', 'Security Measures']
    },
    {
      id: 'TR012',
      title: 'Sustainable Farming Practices',
      category: 'Environment',
      instructor: 'Dr. Ngozi Eze',
      duration: '4 days',
      participants: 48,
      maxParticipants: 55,
      status: 'Scheduled',
      startDate: '2024-02-25',
      endDate: '2024-02-28',
      location: 'Abeokuta',
      description: 'Training on sustainable and environmentally friendly farming practices.',
      modules: ['Soil Conservation', 'Water Management', 'Organic Farming', 'Biodiversity Protection']
    }
  ];

  // Filtered and paginated trainings
  const filteredTrainings = useMemo(() => {
    return trainingPrograms.filter(training => {
      const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           training.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           training.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           training.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || training.status === filterStatus;
      const matchesCategory = filterCategory === 'All' || training.category === filterCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchTerm, filterStatus, filterCategory]);

  const paginatedTrainings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTrainings.slice(start, start + itemsPerPage);
  }, [filteredTrainings, currentPage]);

  const totalPages = Math.ceil(filteredTrainings.length / itemsPerPage);

  const handleSelectAll = () => {
    if (selectedTrainings.length === paginatedTrainings.length) {
      setSelectedTrainings([]);
    } else {
      setSelectedTrainings(paginatedTrainings.map(t => t.id));
    }
  };

  const handleSelectTraining = (trainingId: string) => {
    setSelectedTrainings(prev => 
      prev.includes(trainingId) 
        ? prev.filter(id => id !== trainingId)
        : [...prev, trainingId]
    );
  };

  const stats = [
    { title: 'Total Programs', value: '12', change: '+2', icon: '📚' },
    { title: 'Active Trainings', value: '4', change: '+1', icon: '🔄' },
    { title: 'Participants', value: '456', change: '+89', icon: '👥' },
    { title: 'Completion Rate', value: '94%', change: '+3%', icon: '✅' }
  ];

  return (
    <PortalLayout role="Coordinating Agency" roleIcon="🏛️" sidebarItems={sidebarItems}>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-sans text-gray-100">Training Programs</h1>
              <p className="text-gray-400 font-serif mt-1">Manage and monitor training programs across all stakeholders</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="btn-primary text-sm">
                📚 Schedule New Training
              </button>
              <button className="btn-secondary text-sm">
                📊 Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-serif">{stat.title}</p>
                  <p className="text-2xl font-bold font-sans text-gray-100 mt-1">{stat.value}</p>
                  <p className="text-green-400 text-sm font-sans mt-1">{stat.change}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  value={searchTerm}
                  onChange={(e) => { setCurrentPage(1); setSearchTerm(e.target.value); }}
                  placeholder="Search trainings..."
                  className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  🔍
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={filterStatus}
                onChange={(e) => { setCurrentPage(1); setFilterStatus(e.target.value); }}
                className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="All">All Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => { setCurrentPage(1); setFilterCategory(e.target.value); }}
                className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="All">All Categories</option>
                <option value="Finance">Finance</option>
                <option value="Technology">Technology</option>
                <option value="Insurance">Insurance</option>
                <option value="Management">Management</option>
                <option value="Business">Business</option>
                <option value="Environment">Environment</option>
                <option value="Education">Education</option>
                <option value="Marketing">Marketing</option>
                <option value="Processing">Processing</option>
                <option value="Leadership">Leadership</option>
              </select>
            </div>
          </div>
        </div>

        {/* Training Programs List */}
        <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-2 sm:mb-0">Training Programs</h3>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSelectAll}
                className="btn-secondary text-sm"
              >
                {selectedTrainings.length === paginatedTrainings.length ? '☐ Deselect All' : '☑ Select All'}
              </button>
              {selectedTrainings.length > 0 && (
                <button className="btn-primary text-sm">
                  📧 Send Notifications ({selectedTrainings.length})
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {paginatedTrainings.map((training) => (
              <div key={training.id} className="bg-primary-700 rounded-lg p-4 sm:p-6 border border-primary-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedTrainings.includes(training.id)}
                      onChange={() => handleSelectTraining(training.id)}
                      className="w-4 h-4 text-accent-600 bg-primary-600 border-primary-500 rounded focus:ring-accent-500"
                    />
                    <div>
                      <h4 className="text-lg font-semibold font-sans text-gray-100">{training.title}</h4>
                      <p className="text-sm text-gray-400 font-serif">{training.category} • {training.duration}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-sans ${
                    training.status === 'Ongoing' ? 'bg-green-600 text-green-100' :
                    training.status === 'Scheduled' ? 'bg-blue-600 text-blue-100' :
                    'bg-gray-600 text-gray-100'
                  }`}>
                    {training.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span>👨‍🏫</span>
                    <span>{training.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span>📍</span>
                    <span>{training.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span>📅</span>
                    <span>{training.startDate} - {training.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span>👥</span>
                    <span>{training.participants}/{training.maxParticipants} participants</span>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mb-4 font-serif">{training.description}</p>

                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-300 mb-2">Modules:</h5>
                  <div className="flex flex-wrap gap-1">
                    {training.modules.map((module, index) => (
                      <span key={index} className="px-2 py-1 bg-primary-600 text-gray-300 text-xs rounded">
                        {module}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="btn-primary text-sm flex-1">
                    📋 View Details
                  </button>
                  <button className="btn-secondary text-sm flex-1">
                    ✏️ Edit
                  </button>
                  <button className="btn-secondary text-sm flex-1">
                    📊 Report
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-primary-700">
              <div className="text-sm text-gray-400 mb-2 sm:mb-0">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTrainings.length)} of {filteredTrainings.length} trainings
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-primary-700 text-gray-300 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                <span className="px-3 py-1 text-sm text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-primary-700 text-gray-300 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button className="btn-primary text-sm">
              📚 Schedule New Training
            </button>
            <button className="btn-secondary text-sm">
              📊 Generate Report
            </button>
            <button className="btn-secondary text-sm">
              📧 Send Notifications
            </button>
            <button className="btn-secondary text-sm">
              📋 Export Data
            </button>
          </div>
        </div>

        {/* Powered by Mc. George */}
        <div className="text-center text-gray-500 text-sm font-serif">
          Powered by Mc. George
        </div>
      </div>
    </PortalLayout>
  );
};

export default Trainings;
