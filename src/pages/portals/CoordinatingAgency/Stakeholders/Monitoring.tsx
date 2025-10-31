import React from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../../../components/PortalLayout';

const Monitoring: React.FC = () => {
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
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/coordinating-agency/settings' }
  ];

  const monitoringTeams = [
    {
      id: 'central',
      name: 'Central Monitoring Team',
      icon: '🏛️',
      description: 'National-level monitoring and oversight of all agricultural finance programs',
      href: '/portal/coordinating-agency/monitoring/central',
      stats: { reports: '156', coverage: 'National', status: 'Active' }
    },
    {
      id: 'state',
      name: 'State Monitoring Team',
      icon: '🗺️',
      description: 'State-level monitoring across all 36 states and FCT',
      href: '/portal/coordinating-agency/monitoring/state',
      stats: { reports: '847', coverage: '37 States', status: 'Active' }
    },
    {
      id: 'local',
      name: 'Local Monitoring Team',
      icon: '🏘️',
      description: 'LGA-level monitoring and field operations',
      href: '/portal/coordinating-agency/monitoring/local',
      stats: { reports: '2,341', coverage: '774 LGAs', status: 'Active' }
    },
    {
      id: 'ward',
      name: 'Ward Monitoring Team',
      icon: '🏡',
      description: 'Ward-level grassroots monitoring and community engagement',
      href: '/portal/coordinating-agency/monitoring/ward',
      stats: { reports: '5,678', coverage: '8,809 Wards', status: 'Active' }
    }
  ];

  return (
    <PortalLayout role="Coordinating Agency" roleIcon="🏛️" sidebarItems={sidebarItems}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold font-sans text-gray-100 mb-2">
            Monitoring Department
          </h1>
          <p className="text-gray-400 font-serif">
            Oversee field monitoring, compliance verification, and performance tracking across all levels of agricultural finance operations
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-serif">Monitoring Teams</p>
                <p className="text-2xl font-bold font-sans text-gray-100 mt-1">4</p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </div>
          <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-serif">Total Reports</p>
                <p className="text-2xl font-bold font-sans text-gray-100 mt-1">9,022</p>
              </div>
              <div className="text-3xl">📋</div>
            </div>
          </div>
          <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-serif">Field Officers</p>
                <p className="text-2xl font-bold font-sans text-gray-100 mt-1">1,247</p>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </div>
          <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-serif">Compliance Rate</p>
                <p className="text-2xl font-bold font-sans text-green-400 mt-1">94.5%</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>
        </div>

        {/* Monitoring Teams Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {monitoringTeams.map((team) => (
            <Link
              key={team.id}
              to={team.href}
              className="bg-primary-800 rounded-lg shadow-lg p-6 hover:bg-primary-700 transition-colors duration-200 border border-primary-700 hover:border-accent-500"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-4xl mr-4">{team.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold font-sans text-gray-100">{team.name}</h3>
                    <p className="text-sm text-gray-400 font-serif mt-1">{team.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-primary-600">
                <div>
                  <p className="text-xs text-gray-400 font-serif">Reports</p>
                  <p className="text-lg font-semibold font-sans text-gray-100 mt-1">{team.stats.reports}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-serif">Coverage</p>
                  <p className="text-lg font-semibold font-sans text-gray-100 mt-1">{team.stats.coverage}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-serif">Status</p>
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white mt-1">
                    {team.stats.status}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center text-accent-400 text-sm font-sans">
                View Reports →
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button className="btn-primary text-sm">
              📊 Generate Consolidated Report
            </button>
            <button className="btn-secondary text-sm">
              ✏️ Edit Team Access
            </button>
            <button className="btn-secondary text-sm">
              👥 Manage Field Officers
            </button>
            <button className="btn-secondary text-sm">
              📚 Schedule Training
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400 font-serif opacity-80">
          Powered by Mc. George
        </div>
      </div>
    </PortalLayout>
  );
};

export default Monitoring;

