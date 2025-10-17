import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const Savings: React.FC = () => {
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

  const savingsData = [
    {
      id: 'SAV-001',
      memberName: 'Ibrahim Musa',
      totalSavings: 150000,
      monthlyContribution: 5000,
      lastContribution: '2024-01-15',
      contributionCount: 30,
      interestEarned: 15000,
      status: 'Active'
    },
    {
      id: 'SAV-002',
      memberName: 'Fatima Ahmed',
      totalSavings: 120000,
      monthlyContribution: 5000,
      lastContribution: '2024-01-12',
      contributionCount: 24,
      interestEarned: 12000,
      status: 'Active'
    }
  ];

  const savingsStats = [
    { label: 'Total Savings', value: '₦12.4M', change: '+₦1.2M', trend: 'up' },
    { label: 'Active Savers', value: '234', change: '+8', trend: 'up' },
    { label: 'Monthly Contributions', value: '₦1.2M', change: '+₦150K', trend: 'up' },
    { label: 'Interest Paid', value: '₦1.5M', change: '+₦200K', trend: 'up' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Savings Management</h1>
            <p className="text-gray-400 font-serif mt-2">Track member savings and contributions</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Savings Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Contribution')}
            >
              ➕ Record Contribution
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {savingsStats.map((stat, index) => (
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
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Member Savings</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Member</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Total Savings</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Monthly Contribution</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Contributions</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Interest Earned</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {savingsData.map((saving) => (
                  <tr key={saving.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{saving.memberName}</p>
                        <p className="text-sm text-gray-400 font-serif">Last: {saving.lastContribution}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">₦{saving.totalSavings.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">₦{saving.monthlyContribution.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{saving.contributionCount}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans">₦{saving.interestEarned.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Savings Details', saving.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Record Contribution')}
                        >
                          Record
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Calculate Interest')}
                        >
                          Interest
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
              onClick={() => addNewRecord('Contribution Collection')}
            >
              💰 Collect Contributions
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Interest Calculation')}
            >
              📊 Calculate Interest
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Savings Withdrawal')}
            >
              💳 Process Withdrawal
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Savings Analytics', 'Excel')}
            >
              📈 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Savings;
