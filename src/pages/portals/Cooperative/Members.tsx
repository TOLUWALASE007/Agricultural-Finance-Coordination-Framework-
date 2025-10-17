import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails, contactPerson } from '../../../utils/quickActions';

const Members: React.FC = () => {
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

  const members = [
    {
      id: 'MEM-001',
      name: 'Ibrahim Musa',
      location: 'Kaduna State',
      farmSize: '5 hectares',
      crops: ['Rice', 'Maize'],
      status: 'Active',
      joinDate: '2023-01-15',
      savings: 150000,
      loans: 200000,
      phone: '+234-803-456-7890',
      email: 'ibrahim@coop.com',
      role: 'Member',
      contribution: 5000
    },
    {
      id: 'MEM-002',
      name: 'Fatima Ahmed',
      location: 'Kano State',
      farmSize: '3 hectares',
      crops: ['Wheat', 'Sorghum'],
      status: 'Active',
      joinDate: '2023-02-20',
      savings: 120000,
      loans: 150000,
      phone: '+234-805-678-9012',
      email: 'fatima@coop.com',
      role: 'Treasurer',
      contribution: 5000
    },
    {
      id: 'MEM-003',
      name: 'John Okafor',
      location: 'Enugu State',
      farmSize: '7 hectares',
      crops: ['Cassava', 'Yam'],
      status: 'Pending',
      joinDate: '2024-01-10',
      savings: 0,
      loans: 0,
      phone: '+234-807-890-1234',
      email: 'john@coop.com',
      role: 'Member',
      contribution: 0
    }
  ];

  const memberStats = [
    { label: 'Total Members', value: '247', change: '+12', trend: 'up' },
    { label: 'Active Members', value: '234', change: '+8', trend: 'up' },
    { label: 'Total Savings', value: '₦12.4M', change: '+₦1.2M', trend: 'up' },
    { label: 'Average Contribution', value: '₦5,200', change: '+₦300', trend: 'up' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Members</h1>
            <p className="text-gray-400 font-serif mt-2">Manage cooperative members and their contributions</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Members Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Member')}
            >
              ➕ Add Member
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {memberStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Member Directory</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Inactive</option>
              </select>
              <select className="input-field w-auto">
                <option>All Roles</option>
                <option>Member</option>
                <option>Chairman</option>
                <option>Secretary</option>
                <option>Treasurer</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Members', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Member ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Name</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Location</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Farm Size</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Savings</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{member.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{member.name}</p>
                        <p className="text-sm text-gray-400 font-serif">{member.role} - Joined: {member.joinDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{member.location}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">{member.farmSize}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {member.crops.map((crop, index) => (
                            <span key={index} className="px-1 py-0.5 bg-primary-600 text-white text-xs rounded">
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">₦{member.savings.toLocaleString()}</p>
                        <p className="text-sm text-gray-400 font-serif">Monthly: ₦{member.contribution.toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.status === 'Active' ? 'bg-green-500 text-white' :
                        member.status === 'Pending' ? 'bg-yellow-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Member Profile', member.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => contactPerson(member.name, member.phone, member.email)}
                        >
                          Contact
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Update Contribution')}
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
              onClick={() => addNewRecord('Member Registration')}
            >
              👥 Add Member
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Contribution Collection')}
            >
              💰 Collect Contributions
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Member Training')}
            >
              🎓 Training
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Member Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Members;
