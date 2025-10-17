import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const GroupLoans: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/cooperative' },
    { id: 'members', name: 'Members', icon: '👥', href: '/portal/cooperative/members' },
    { id: 'loans', name: 'Group Loans', icon: '💰', href: '/portal/cooperative/loans' },
    { id: 'savings', name: 'Savings', icon: '🏦', href: '/portal/cooperative/savings' },
    { id: 'markets', name: 'Market Access', icon: '📈', href: '/portal/cooperative/markets' },
    { id: 'training', name: 'Training', icon: '🎓', href: '/portal/cooperative/training' },
    { id: 'extension', name: 'Extension Services', icon: '🌾', href: '/portal/cooperative/extension' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/cooperative/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/cooperative/settings' }
  ];

  const groupLoans = [
    {
      id: 'GL-001',
      groupName: 'Rice Farmers Group A',
      members: 15,
      loanAmount: 5000000,
      disbursedAmount: 5000000,
      repaidAmount: 2000000,
      outstandingAmount: 3000000,
      interestRate: 10,
      status: 'Active',
      applicationDate: '2023-01-15',
      disbursementDate: '2023-02-01',
      maturityDate: '2024-02-01',
      lastPayment: '2023-12-15'
    },
    {
      id: 'GL-002',
      groupName: 'Maize Farmers Group B',
      members: 12,
      loanAmount: 3000000,
      disbursedAmount: 0,
      repaidAmount: 0,
      outstandingAmount: 3000000,
      interestRate: 12,
      status: 'Pending',
      applicationDate: '2024-01-10',
      disbursementDate: 'TBD',
      maturityDate: 'TBD',
      lastPayment: 'N/A'
    }
  ];

  const loanStats = [
    { label: 'Total Group Loans', value: '₦8.7M', change: '+₦2.1M', trend: 'up' },
    { label: 'Active Loans', value: '12', change: '+3', trend: 'up' },
    { label: 'Repayment Rate', value: '85%', change: '+5%', trend: 'up' },
    { label: 'Outstanding Amount', value: '₦5.2M', change: '+₦800K', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="Cooperative Group" 
      roleIcon="👥" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Group Loans</h1>
            <p className="text-gray-400 font-serif mt-2">Manage group loans and repayment tracking</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Group Loans Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Group Loan')}
            >
              ➕ New Group Loan
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {loanStats.map((stat, index) => (
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
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Group Loan Management</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Loan ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Group Name</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Members</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Loan Amount</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Outstanding</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupLoans.map((loan) => (
                  <tr key={loan.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{loan.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{loan.groupName}</p>
                        <p className="text-sm text-gray-400 font-serif">Applied: {loan.applicationDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{loan.members} members</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">₦{(loan.loanAmount / 1000000).toFixed(1)}M</p>
                        <p className="text-sm text-gray-400 font-serif">{loan.interestRate}% interest</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">₦{(loan.outstandingAmount / 1000000).toFixed(1)}M</p>
                        <p className="text-sm text-gray-400 font-serif">Repaid: ₦{(loan.repaidAmount / 1000000).toFixed(1)}M</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        loan.status === 'Active' ? 'bg-green-500 text-white' :
                        loan.status === 'Pending' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {loan.status}
                      </span>
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
                          onClick={() => processAction('Loan Review')}
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
              onClick={() => addNewRecord('Group Loan Application')}
            >
              💰 New Group Loan
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Payment Collection')}
            >
              💳 Collect Payment
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Loan Assessment')}
            >
              📊 Assessment
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Loan Analytics', 'Excel')}
            >
              📈 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default GroupLoans;
