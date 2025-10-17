import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const LoanPerformance: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/anchor' },
    { id: 'producers', name: 'Producer Network', icon: '🌾', href: '/portal/anchor/producers' },
    { id: 'contracts', name: 'Supply Contracts', icon: '📄', href: '/portal/anchor/contracts' },
    { id: 'loans', name: 'Loan Performance', icon: '💰', href: '/portal/anchor/loans' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/anchor/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/anchor/settings' }
  ];

  const loanPerformance = [
    {
      id: 'LOAN-001',
      producer: 'Ibrahim Musa',
      loanAmount: 5000000,
      disbursedAmount: 5000000,
      repaidAmount: 3000000,
      outstandingAmount: 2000000,
      interestRate: 12,
      status: 'Active',
      disbursementDate: '2023-01-15',
      maturityDate: '2024-01-15',
      lastPayment: '2023-12-15',
      performance: 'Good'
    },
    {
      id: 'LOAN-002',
      producer: 'Fatima Ahmed',
      loanAmount: 3000000,
      disbursedAmount: 3000000,
      repaidAmount: 1500000,
      outstandingAmount: 1500000,
      interestRate: 10,
      status: 'Active',
      disbursementDate: '2023-02-20',
      maturityDate: '2024-02-20',
      lastPayment: '2023-11-20',
      performance: 'Good'
    },
    {
      id: 'LOAN-003',
      producer: 'John Okafor',
      loanAmount: 2000000,
      disbursedAmount: 0,
      repaidAmount: 0,
      outstandingAmount: 2000000,
      interestRate: 15,
      status: 'Pending',
      disbursementDate: 'TBD',
      maturityDate: 'TBD',
      lastPayment: 'N/A',
      performance: 'N/A'
    }
  ];

  const performanceStats = [
    { label: 'Total Loans', value: '156', change: '+12', trend: 'up' },
    { label: 'Active Loans', value: '89', change: '+8', trend: 'up' },
    { label: 'Total Disbursed', value: '₦2.1B', change: '+18%', trend: 'up' },
    { label: 'Repayment Rate', value: '85%', change: '+5%', trend: 'up' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Loan Performance</h1>
            <p className="text-gray-400 font-serif mt-2">Monitor loan performance and repayment status</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Loan Performance Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Loan')}
            >
              ➕ New Loan
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {performanceStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Loan Portfolio</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Completed</option>
                <option>Defaulted</option>
              </select>
              <select className="input-field w-auto">
                <option>All Performance</option>
                <option>Good</option>
                <option>Average</option>
                <option>Poor</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Loans', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Loan ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Producer</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Loan Amount</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Outstanding</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Interest Rate</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loanPerformance.map((loan) => (
                  <tr key={loan.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{loan.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{loan.producer}</p>
                        <p className="text-sm text-gray-400 font-serif">Last Payment: {loan.lastPayment}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">₦{(loan.loanAmount / 1000000).toFixed(1)}M</p>
                        <p className="text-sm text-gray-400 font-serif">Disbursed: ₦{(loan.disbursedAmount / 1000000).toFixed(1)}M</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">₦{(loan.outstandingAmount / 1000000).toFixed(1)}M</p>
                        <p className="text-sm text-gray-400 font-serif">Repaid: ₦{(loan.repaidAmount / 1000000).toFixed(1)}M</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{loan.interestRate}%</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col space-y-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          loan.status === 'Active' ? 'bg-green-500 text-white' :
                          loan.status === 'Pending' ? 'bg-yellow-500 text-white' :
                          loan.status === 'Completed' ? 'bg-blue-500 text-white' :
                          'bg-red-500 text-white'
                        }`}>
                          {loan.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          loan.performance === 'Good' ? 'bg-green-500 text-white' :
                          loan.performance === 'Average' ? 'bg-yellow-500 text-white' :
                          loan.performance === 'Poor' ? 'bg-red-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}>
                          {loan.performance}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Loan Details', loan.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Process Payment')}
                        >
                          Payment
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
              onClick={() => addNewRecord('Loan Application')}
            >
              💰 New Loan
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Loan Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Payment Collection')}
            >
              💳 Collect Payment
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Risk Assessment')}
            >
              📈 Risk Assessment
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default LoanPerformance;
