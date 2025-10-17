import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails, contactPerson } from '../../../utils/quickActions';

const Stakeholders: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/coordinating-agency' },
    { id: 'programs', name: 'Programs', icon: '🏛️', href: '/portal/coordinating-agency/programs' },
    { id: 'stakeholders', name: 'Stakeholders', icon: '🤝', href: '/portal/coordinating-agency/stakeholders' },
    { id: 'compliance', name: 'Compliance', icon: '✅', href: '/portal/coordinating-agency/compliance' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/coordinating-agency/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/coordinating-agency/settings' }
  ];

  const stakeholders = [
    {
      id: 'STK-001',
      name: 'First Bank of Nigeria',
      type: 'PFI',
      category: 'Participating Bank',
      status: 'Active',
      joinDate: '2023-01-15',
      programs: 3,
      totalValue: 2500000000,
      performance: 'Excellent',
      contactPerson: 'Dr. Sarah Johnson',
      phone: '+234-801-234-5678',
      email: 'sarah.johnson@firstbank.com'
    },
    {
      id: 'STK-002',
      name: 'Nigerian Agribusiness Ltd',
      type: 'Anchor',
      category: 'Anchor Company',
      status: 'Active',
      joinDate: '2023-02-20',
      programs: 2,
      totalValue: 1800000000,
      performance: 'Good',
      contactPerson: 'Alhaji Ibrahim Musa',
      phone: '+234-803-456-7890',
      email: 'ibrahim@nigerianagri.com'
    },
    {
      id: 'STK-003',
      name: 'Agricultural Development Fund',
      type: 'Fund Provider',
      category: 'Development Bank',
      status: 'Active',
      joinDate: '2023-01-10',
      programs: 3,
      totalValue: 5000000000,
      performance: 'Excellent',
      contactPerson: 'Mrs. Grace Okonkwo',
      phone: '+234-805-678-9012',
      email: 'grace@adf.gov.ng'
    }
  ];

  const stakeholderStats = [
    { label: 'Total Stakeholders', value: '47', change: '+5', trend: 'up' },
    { label: 'Active Partners', value: '42', change: '+3', trend: 'up' },
    { label: 'PFIs', value: '15', change: '+2', trend: 'up' },
    { label: 'Anchor Companies', value: '25', change: '+4', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="Coordinating Agency" 
      roleIcon="🏛️" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Stakeholders</h1>
            <p className="text-gray-400 font-serif mt-2">Manage stakeholder relationships and partnerships</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Stakeholders Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Stakeholder')}
            >
              ➕ Add Stakeholder
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stakeholderStats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-serif">{stat.label}</p>
                  <p className="text-2xl font-bold font-sans text-gray-100">{stat.value}</p>
                </div>
                <div className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold font-sans text-gray-100">Stakeholder Directory</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Types</option>
                <option>PFI</option>
                <option>Anchor</option>
                <option>Fund Provider</option>
                <option>Insurance</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Pending</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Stakeholders', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Stakeholder ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Name</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Programs</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Performance</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stakeholders.map((stakeholder) => (
                  <tr key={stakeholder.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{stakeholder.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{stakeholder.name}</p>
                        <p className="text-sm text-gray-400 font-serif">{stakeholder.category}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{stakeholder.type}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        stakeholder.status === 'Active' ? 'bg-green-500 text-white' :
                        stakeholder.status === 'Inactive' ? 'bg-gray-500 text-white' :
                        'bg-yellow-500 text-white'
                      }`}>
                        {stakeholder.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{stakeholder.programs}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        stakeholder.performance === 'Excellent' ? 'bg-green-500 text-white' :
                        stakeholder.performance === 'Good' ? 'bg-blue-500 text-white' :
                        stakeholder.performance === 'Average' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {stakeholder.performance}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Stakeholder Profile', stakeholder.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => contactPerson(stakeholder.contactPerson, stakeholder.phone, stakeholder.email)}
                        >
                          Contact
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Performance Review')}
                        >
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Stakeholder Registration')}
            >
              🤝 Add Stakeholder
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Stakeholder Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Stakeholder Meeting')}
            >
              📅 Schedule Meeting
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Performance Assessment')}
            >
              📈 Assessment
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Stakeholders;
