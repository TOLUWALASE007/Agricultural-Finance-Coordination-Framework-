import React from 'react';
import PortalLayout from '../../components/PortalLayout';

const CoordinatingAgencyPortal: React.FC = () => {
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
        { id: 'finance', name: 'Finance and Accounting Department', icon: '💰', href: '/portal/coordinating-agency/stakeholders/finance' },
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

  const stats = [
    { title: 'Active Programs', value: '12', change: '+2', icon: '🏛️' },
    { title: 'Stakeholders', value: '2,847', change: '+45', icon: '🤝' },
    { title: 'Funds Managed', value: '₦15.2B', change: '+₦2.1B', icon: '💼' },
    { title: 'Compliance Rate', value: '94.5%', change: '+2.1%', icon: '✅' }
  ];

  return (
    <PortalLayout role="Coordinating Agency (Super Admin)" roleIcon="🏛️" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-8 text-white">
          <h1 className="text-3xl font-bold font-sans mb-3">Welcome to Coordinating Agency Portal</h1>
          <p className="text-gray-200 font-serif text-lg mb-6">
            Oversee agricultural finance programs, coordinate stakeholder activities, monitor compliance, and ensure effective implementation of national agricultural policies.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <a href="/portal/coordinating-agency/activities" className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold font-sans mb-1">Activities</h3>
              <p className="text-sm text-gray-200 font-serif">Monitor platform activities and manage user access</p>
            </a>
            <a href="/portal/coordinating-agency/fund-schemes" className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors">
              <div className="text-2xl mb-2">💼</div>
              <h3 className="font-semibold font-sans mb-1">Fund Schemes</h3>
              <p className="text-sm text-gray-200 font-serif">Oversee fund deployment and scheme performance</p>
            </a>
            <a href="/portal/coordinating-agency/reportings" className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors">
              <div className="text-2xl mb-2">📑</div>
              <h3 className="font-semibold font-sans mb-1">Reportings</h3>
              <p className="text-sm text-gray-200 font-serif">Generate and view comprehensive reports</p>
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-serif">{stat.title}</p>
                  <p className="text-2xl font-bold font-sans text-gray-100">{stat.value}</p>
                  <p className="text-sm text-accent-400 font-serif">{stat.change}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Stakeholder Management</h3>
            <p className="text-gray-300 font-serif mb-4">
              Manage stakeholder schemes, review applications, and coordinate activities across all agricultural finance participants.
            </p>
            <a href="/portal/coordinating-agency/stakeholders" className="btn-primary inline-block">
              🤝 View Stakeholder Schemes
            </a>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Monitoring Teams</h3>
            <p className="text-gray-300 font-serif mb-4">
              Access reports from Central, State, Local, and Ward monitoring teams to ensure program effectiveness at all levels.
            </p>
            <div className="flex flex-wrap gap-2">
              <a href="/portal/coordinating-agency/monitoring/central" className="btn-secondary text-sm">
                🏛️ Central
              </a>
              <a href="/portal/coordinating-agency/monitoring/state" className="btn-secondary text-sm">
                🗺️ State
              </a>
              <a href="/portal/coordinating-agency/monitoring/local" className="btn-secondary text-sm">
                🏘️ Local
              </a>
              <a href="/portal/coordinating-agency/monitoring/ward" className="btn-secondary text-sm">
                🏡 Ward
              </a>
            </div>
          </div>
        </div>

        {/* Program Performance Overview */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Program Performance Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-2xl font-bold font-sans text-gray-100">87%</p>
              <p className="text-sm text-gray-400 font-serif">Target Achievement</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-2xl font-bold font-sans text-gray-100">+15%</p>
              <p className="text-sm text-gray-400 font-serif">Growth Rate</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">⭐</div>
              <p className="text-2xl font-bold font-sans text-gray-100">4.2/5</p>
              <p className="text-sm text-gray-400 font-serif">Satisfaction Score</p>
            </div>
          </div>
        </div>

        {/* Powered by */}
        <div className="mt-2 text-center text-xs text-gray-400 font-serif opacity-80">
          Powered by Mc. George
        </div>
      </div>
    </PortalLayout>
  );
};

export default CoordinatingAgencyPortal;
