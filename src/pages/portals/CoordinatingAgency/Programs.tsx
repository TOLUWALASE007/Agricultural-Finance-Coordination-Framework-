import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const Programs: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/coordinating-agency' },
    { id: 'programs', name: 'Programs', icon: '🏛️', href: '/portal/coordinating-agency/programs' },
    { id: 'stakeholders', name: 'Stakeholders', icon: '🤝', href: '/portal/coordinating-agency/stakeholders' },
    { id: 'compliance', name: 'Compliance', icon: '✅', href: '/portal/coordinating-agency/compliance' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/coordinating-agency/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/coordinating-agency/settings' }
  ];

  const programs = [
    {
      id: 'PROG-001',
      name: 'Agricultural Finance Enhancement Program',
      status: 'Active',
      startDate: '2023-01-15',
      endDate: '2025-12-31',
      budget: 5000000000,
      allocated: 3200000000,
      beneficiaries: 1250,
      progress: 64,
      fundProviders: 8,
      pfis: 15,
      anchors: 25
    },
    {
      id: 'PROG-002',
      name: 'Smallholder Farmer Support Initiative',
      status: 'Planning',
      startDate: '2024-06-01',
      endDate: '2026-05-31',
      budget: 2000000000,
      allocated: 0,
      beneficiaries: 0,
      progress: 0,
      fundProviders: 5,
      pfis: 12,
      anchors: 18
    },
    {
      id: 'PROG-003',
      name: 'Rural Development Acceleration',
      status: 'Completed',
      startDate: '2022-03-01',
      endDate: '2023-12-31',
      budget: 1500000000,
      allocated: 1500000000,
      beneficiaries: 850,
      progress: 100,
      fundProviders: 6,
      pfis: 10,
      anchors: 15
    }
  ];

  const programStats = [
    { label: 'Active Programs', value: '3', change: '+1', trend: 'up' },
    { label: 'Total Budget', value: '₦8.5B', change: '+15%', trend: 'up' },
    { label: 'Beneficiaries', value: '2,100', change: '+8%', trend: 'up' },
    { label: 'Average Progress', value: '55%', change: '+12%', trend: 'up' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Programs</h1>
            <p className="text-gray-400 font-serif mt-2">Manage and monitor AFCF programs</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Programs Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Program')}
            >
              ➕ New Program
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {programStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Program Overview</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Planning</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Programs', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Program ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Program Name</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Budget</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Progress</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Beneficiaries</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((program) => (
                  <tr key={program.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{program.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{program.name}</p>
                        <p className="text-sm text-gray-400 font-serif">{program.startDate} - {program.endDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        program.status === 'Active' ? 'bg-green-500 text-white' :
                        program.status === 'Planning' ? 'bg-blue-500 text-white' :
                        program.status === 'Completed' ? 'bg-gray-500 text-white' :
                        'bg-yellow-500 text-white'
                      }`}>
                        {program.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">₦{(program.budget / 1000000000).toFixed(1)}B</p>
                        <p className="text-sm text-gray-400 font-serif">Allocated: ₦{(program.allocated / 1000000000).toFixed(1)}B</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-primary-600 rounded-full h-2 mr-2">
                          <div 
                            className="bg-accent-500 h-2 rounded-full"
                            style={{ width: `${program.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-300 font-serif text-sm">{program.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{program.beneficiaries.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Program Details', program.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Edit Program')}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Monitor Progress')}
                        >
                          Monitor
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
              onClick={() => addNewRecord('Program Launch')}
            >
              🏛️ Launch Program
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Program Progress Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Stakeholder Meeting')}
            >
              🤝 Stakeholder Meeting
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Compliance Check')}
            >
              ✅ Compliance Check
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Programs;
