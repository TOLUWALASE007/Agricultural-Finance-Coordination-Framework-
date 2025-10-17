import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails, contactPerson } from '../../../utils/quickActions';

const AnchorPartners: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/pfi' },
    { id: 'loans', name: 'Loan Processing', icon: '💰', href: '/portal/pfi/loans' },
    { id: 'applications', name: 'Applications', icon: '📋', href: '/portal/pfi/applications' },
    { id: 'producers', name: 'Producer Network', icon: '🌾', href: '/portal/pfi/producers' },
    { id: 'anchors', name: 'Anchor Partners', icon: '⚓', href: '/portal/pfi/anchors' },
    { id: 'insurance', name: 'Insurance Claims', icon: '🛡️', href: '/portal/pfi/insurance' },
    { id: 'risk', name: 'Risk Assessment', icon: '📈', href: '/portal/pfi/risk' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/pfi/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/pfi/settings' }
  ];

  const anchorPartners = [
    {
      id: 'ANC-001',
      name: 'Nigerian Agribusiness Ltd',
      sector: 'Rice Processing',
      location: 'Lagos State',
      partnershipDate: '2023-06-15',
      totalContracts: 45,
      activeContracts: 12,
      totalValue: 12500000,
      performance: 'Excellent',
      contactPerson: 'Dr. Sarah Johnson',
      phone: '+234-801-234-5678',
      email: 'sarah@nigerianagri.com'
    },
    {
      id: 'ANC-002',
      name: 'Agro-Allied Industries',
      sector: 'Maize Processing',
      location: 'Kano State',
      partnershipDate: '2023-08-20',
      totalContracts: 32,
      activeContracts: 8,
      totalValue: 8900000,
      performance: 'Good',
      contactPerson: 'Alhaji Ibrahim Musa',
      phone: '+234-803-456-7890',
      email: 'ibrahim@agroallied.com'
    },
    {
      id: 'ANC-003',
      name: 'Farm Fresh Ltd',
      sector: 'Vegetable Processing',
      location: 'Ogun State',
      partnershipDate: '2023-09-10',
      totalContracts: 28,
      activeContracts: 15,
      totalValue: 6700000,
      performance: 'Good',
      contactPerson: 'Mrs. Grace Okonkwo',
      phone: '+234-805-678-9012',
      email: 'grace@farmfresh.com'
    }
  ];

  const partnershipStats = [
    { label: 'Total Partners', value: '15', change: '+3', trend: 'up' },
    { label: 'Active Contracts', value: '35', change: '+8', trend: 'up' },
    { label: 'Total Contract Value', value: '₦28.1M', change: '+15%', trend: 'up' },
    { label: 'Average Performance', value: '4.2/5', change: '+0.3', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="Participating Bank (PFI)" 
      roleIcon="🏦" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Anchor Partners</h1>
            <p className="text-gray-400 font-serif mt-2">Manage partnerships with anchor companies</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Anchor Partners Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Anchor Partnership')}
            >
              ➕ Add Partner
            </button>
          </div>
        </div>

        {/* Partnership Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {partnershipStats.map((stat, index) => (
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

        {/* Anchor Partners Table */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold font-sans text-gray-100">Anchor Partners</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Sectors</option>
                <option>Rice Processing</option>
                <option>Maize Processing</option>
                <option>Vegetable Processing</option>
                <option>Livestock</option>
              </select>
              <select className="input-field w-auto">
                <option>All Performance</option>
                <option>Excellent</option>
                <option>Good</option>
                <option>Average</option>
                <option>Poor</option>
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
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Company Name</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Sector</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Location</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Active Contracts</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Total Value</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Performance</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {anchorPartners.map((partner) => (
                  <tr key={partner.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{partner.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{partner.name}</p>
                        <p className="text-sm text-gray-400 font-serif">Partner since {partner.partnershipDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{partner.sector}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{partner.location}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{partner.activeContracts}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">₦{partner.totalValue.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        partner.performance === 'Excellent' ? 'bg-green-500 text-white' :
                        partner.performance === 'Good' ? 'bg-blue-500 text-white' :
                        partner.performance === 'Average' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {partner.performance}
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
                          onClick={() => processAction('New Contract')}
                        >
                          Contract
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Partnership Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Performance Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Excellent</span>
                <div className="flex items-center">
                  <div className="w-24 bg-primary-600 rounded-full h-2 mr-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <span className="text-gray-100 font-sans">40%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Good</span>
                <div className="flex items-center">
                  <div className="w-24 bg-primary-600 rounded-full h-2 mr-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-gray-100 font-sans">45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Average</span>
                <div className="flex items-center">
                  <div className="w-24 bg-primary-600 rounded-full h-2 mr-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                  <span className="text-gray-100 font-sans">10%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Poor</span>
                <div className="flex items-center">
                  <div className="w-24 bg-primary-600 rounded-full h-2 mr-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                  <span className="text-gray-100 font-sans">5%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Recent Activities</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-100 font-sans">New contract signed with Nigerian Agribusiness Ltd</p>
                  <p className="text-xs text-gray-400 font-serif">2 days ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-100 font-sans">Performance review completed</p>
                  <p className="text-xs text-gray-400 font-serif">1 week ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-100 font-sans">Contract renewal pending</p>
                  <p className="text-xs text-gray-400 font-serif">2 weeks ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-100 font-sans">New partnership established</p>
                  <p className="text-xs text-gray-400 font-serif">3 weeks ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Anchor Partnership')}
            >
              ⚓ Add Partner
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Partnership Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Performance Review')}
            >
              📈 Review
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Contract Management')}
            >
              📋 Contracts
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default AnchorPartners;
