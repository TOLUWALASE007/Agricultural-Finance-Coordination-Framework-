import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails, contactPerson } from '../../../utils/quickActions';

const Partners: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/de-risking' },
    { id: 'funds', name: 'De-risking Funds', icon: '💰', href: '/portal/de-risking/funds' },
    { id: 'risk', name: 'Risk Assessment', icon: '📈', href: '/portal/de-risking/risk' },
    { id: 'guarantees', name: 'Guarantees', icon: '🛡️', href: '/portal/de-risking/guarantees' },
    { id: 'partners', name: 'Partners', icon: '🤝', href: '/portal/de-risking/partners' },
    { id: 'monitoring', name: 'Monitoring', icon: '📱', href: '/portal/de-risking/monitoring' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/de-risking/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/de-risking/settings' }
  ];

  const partners = [
    {
      id: 'PAR-001',
      name: 'Access Bank PLC',
      type: 'Commercial Bank',
      partnershipType: 'Guarantee Partner',
      agreementDate: '2023-01-15',
      status: 'Active',
      totalGuarantees: 500000000,
      activeGuarantees: 350000000,
      claimsPaid: 25000000,
      contactPerson: 'Mr. John Adebayo',
      email: 'john.adebayo@accessbankplc.com',
      phone: '+234-803-456-7890',
      performance: 'Excellent'
    },
    {
      id: 'PAR-002',
      name: 'First Bank of Nigeria',
      type: 'Commercial Bank',
      partnershipType: 'Credit Guarantee',
      agreementDate: '2023-03-20',
      status: 'Active',
      totalGuarantees: 300000000,
      activeGuarantees: 200000000,
      claimsPaid: 15000000,
      contactPerson: 'Dr. Sarah Ibrahim',
      email: 'sarah.ibrahim@firstbanknigeria.com',
      phone: '+234-805-678-9012',
      performance: 'Good'
    },
    {
      id: 'PAR-003',
      name: 'Leadway Assurance',
      type: 'Insurance Company',
      partnershipType: 'Insurance Guarantee',
      agreementDate: '2024-01-01',
      status: 'Planning',
      totalGuarantees: 200000000,
      activeGuarantees: 0,
      claimsPaid: 0,
      contactPerson: 'Mr. Michael Okafor',
      email: 'michael.okafor@leadway.com',
      phone: '+234-807-890-1234',
      performance: 'New'
    }
  ];

  const partnerStats = [
    { label: 'Total Partners', value: '24', change: '+2', trend: 'up' },
    { label: 'Active Partners', value: '22', change: '+1', trend: 'up' },
    { label: 'Total Guarantees', value: '₦1.0B', change: '+₦150M', trend: 'up' },
    { label: 'Claims Paid', value: '₦40M', change: '+₦5M', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="De-risking Institution" 
      roleIcon="🛡️" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Partners</h1>
            <p className="text-gray-400 font-serif mt-2">Manage partner institutions and guarantee relationships</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Partners Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Partner')}
            >
              ➕ Add Partner
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {partnerStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Partner Directory</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Types</option>
                <option>Commercial Bank</option>
                <option>Insurance Company</option>
                <option>Development Bank</option>
                <option>Microfinance Bank</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Planning</option>
                <option>Inactive</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Partners', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Partner ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Partner Name</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Partnership</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Total Guarantees</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Performance</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner) => (
                  <tr key={partner.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{partner.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{partner.name}</p>
                        <p className="text-sm text-gray-400 font-serif">Agreement: {partner.agreementDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{partner.type}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{partner.partnershipType}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">₦{(partner.totalGuarantees / 100000000).toFixed(1)}M</p>
                        <p className="text-sm text-gray-400 font-serif">Active: ₦{(partner.activeGuarantees / 100000000).toFixed(1)}M</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        partner.performance === 'Excellent' ? 'bg-green-500 text-white' :
                        partner.performance === 'Good' ? 'bg-blue-500 text-white' :
                        'bg-yellow-500 text-white'
                      }`}>
                        {partner.performance}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        partner.status === 'Active' ? 'bg-green-500 text-white' :
                        partner.status === 'Planning' ? 'bg-yellow-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {partner.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Partner Details', partner.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => contactPerson(partner.contactPerson, partner.phone, partner.email)}
                        >
                          Contact
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Update Agreement')}
                        >
                          Update
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
              onClick={() => addNewRecord('Partner Registration')}
            >
              🤝 Add Partner
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Partnership Agreement')}
            >
              📋 Agreement
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Performance Review')}
            >
              📊 Review
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Partner Analytics', 'Excel')}
            >
              📈 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Partners;
