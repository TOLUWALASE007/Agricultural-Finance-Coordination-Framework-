import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const SupplyContracts: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/anchor' },
    { id: 'producers', name: 'Producer Network', icon: '🌾', href: '/portal/anchor/producers' },
    { id: 'contracts', name: 'Supply Contracts', icon: '📄', href: '/portal/anchor/contracts' },
    { id: 'loans', name: 'Loan Performance', icon: '💰', href: '/portal/anchor/loans' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/anchor/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/anchor/settings' }
  ];

  const contracts = [
    {
      id: 'CNT-001',
      producer: 'Ibrahim Musa',
      crop: 'Rice',
      quantity: '50 tons',
      price: 250000,
      totalValue: 12500000,
      status: 'Active',
      startDate: '2023-01-15',
      endDate: '2023-12-31',
      deliveryDate: '2023-12-15',
      quality: 'Grade A',
      paymentStatus: 'Paid'
    },
    {
      id: 'CNT-002',
      producer: 'Fatima Ahmed',
      crop: 'Wheat',
      quantity: '30 tons',
      price: 180000,
      totalValue: 5400000,
      status: 'Active',
      startDate: '2023-02-20',
      endDate: '2024-02-20',
      deliveryDate: '2024-01-15',
      quality: 'Grade A',
      paymentStatus: 'Pending'
    },
    {
      id: 'CNT-003',
      producer: 'John Okafor',
      crop: 'Cassava',
      quantity: '25 tons',
      price: 120000,
      totalValue: 3000000,
      status: 'Draft',
      startDate: '2024-01-10',
      endDate: '2024-12-10',
      deliveryDate: 'TBD',
      quality: 'TBD',
      paymentStatus: 'Not Applicable'
    }
  ];

  const contractStats = [
    { label: 'Total Contracts', value: '89', change: '+12', trend: 'up' },
    { label: 'Active Contracts', value: '67', change: '+8', trend: 'up' },
    { label: 'Total Value', value: '₦2.1B', change: '+18%', trend: 'up' },
    { label: 'Pending Payments', value: '₦450M', change: '+5%', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="Anchor" 
      roleIcon="🏢" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Supply Contracts</h1>
            <p className="text-gray-400 font-serif mt-2">Manage supply contracts with producers</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Contracts Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Contract')}
            >
              ➕ New Contract
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {contractStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Contract Management</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Draft</option>
                <option>Completed</option>
                <option>Terminated</option>
              </select>
              <select className="input-field w-auto">
                <option>All Crops</option>
                <option>Rice</option>
                <option>Wheat</option>
                <option>Cassava</option>
                <option>Maize</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Contracts', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Contract ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Producer</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Crop</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Quantity</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Total Value</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr key={contract.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{contract.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{contract.producer}</p>
                        <p className="text-sm text-gray-400 font-serif">{contract.startDate} - {contract.endDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{contract.crop}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">{contract.quantity}</p>
                        <p className="text-sm text-gray-400 font-serif">₦{contract.price.toLocaleString()}/ton</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">₦{(contract.totalValue / 1000000).toFixed(1)}M</p>
                        <p className="text-sm text-gray-400 font-serif">Payment: {contract.paymentStatus}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        contract.status === 'Active' ? 'bg-green-500 text-white' :
                        contract.status === 'Draft' ? 'bg-yellow-500 text-white' :
                        contract.status === 'Completed' ? 'bg-blue-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Contract Details', contract.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Edit Contract')}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Process Payment')}
                        >
                          Payment
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
              onClick={() => addNewRecord('Supply Contract')}
            >
              📄 New Contract
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Contract Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Payment Processing')}
            >
              💰 Process Payment
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Quality Assessment')}
            >
              🔍 Quality Check
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default SupplyContracts;
