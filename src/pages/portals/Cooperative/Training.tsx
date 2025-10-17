import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails, contactPerson } from '../../../utils/quickActions';

const CooperativeTraining: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/cooperative' },
    { id: 'members', name: 'Members', icon: '👥', href: '/portal/cooperative/members' },
    { id: 'loans', name: 'Group Loans', icon: '💰', href: '/portal/cooperative/loans' },
    { id: 'savings', name: 'Savings', icon: '🏦', href: '/portal/cooperative/savings' },
    { id: 'training', name: 'Training & Extension', icon: '🎓', href: '/portal/cooperative/training' },
    { id: 'extension', name: 'Extension Services', icon: '🌾', href: '/portal/cooperative/extension' },
    { id: 'market', name: 'Market Access', icon: '🏪', href: '/portal/cooperative/market' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/cooperative/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/cooperative/settings' }
  ];

  const trainingPrograms = [
    {
      id: 'TRN-001',
      title: 'Modern Rice Cultivation Techniques',
      type: 'Agricultural',
      instructor: 'Dr. Amina Ibrahim',
      date: '2024-02-15',
      duration: '2 days',
      participants: 45,
      status: 'Scheduled',
      location: 'Cooperative Training Center',
      cost: 0,
      description: 'Training on improved rice farming methods, pest management, and post-harvest handling'
    },
    {
      id: 'TRN-002',
      title: 'Financial Management for Cooperatives',
      type: 'Business',
      instructor: 'Mr. John Okafor',
      date: '2024-02-20',
      duration: '1 day',
      participants: 30,
      status: 'Scheduled',
      location: 'Cooperative Office',
      cost: 0,
      description: 'Training on cooperative financial management, record keeping, and loan administration'
    },
    {
      id: 'TRN-003',
      title: 'Market Access and Pricing Strategies',
      type: 'Marketing',
      instructor: 'Ms. Fatima Usman',
      date: '2024-01-25',
      duration: '1 day',
      participants: 40,
      status: 'Completed',
      location: 'Cooperative Hall',
      cost: 0,
      description: 'Training on accessing better markets, pricing strategies, and buyer negotiations'
    }
  ];

  const trainingStats = [
    { label: 'Total Programs', value: '15', change: '+3', trend: 'up' },
    { label: 'Members Trained', value: '180', change: '+25', trend: 'up' },
    { label: 'Completion Rate', value: '92%', change: '+5%', trend: 'up' },
    { label: 'Satisfaction Score', value: '4.8/5', change: '+0.2', trend: 'up' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Training & Extension</h1>
            <p className="text-gray-400 font-serif mt-2">Organize and manage training programs for cooperative members</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Training Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Training Program')}
            >
              ➕ New Program
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {trainingStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Training Programs</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Types</option>
                <option>Agricultural</option>
                <option>Business</option>
                <option>Marketing</option>
                <option>Technical</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Scheduled</option>
                <option>Completed</option>
                <option>Ongoing</option>
                <option>Cancelled</option>
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
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Program Title</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Instructor</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Date</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Duration</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Participants</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trainingPrograms.map((program) => (
                  <tr key={program.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{program.title}</p>
                        <p className="text-sm text-gray-400 font-serif">{program.description}</p>
                        <p className="text-xs text-gray-500 font-serif">📍 {program.location}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{program.type}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{program.instructor}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{program.date}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{program.duration}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{program.participants}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        program.status === 'Completed' ? 'bg-green-500 text-white' :
                        program.status === 'Scheduled' ? 'bg-blue-500 text-white' :
                        program.status === 'Ongoing' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {program.status}
                      </span>
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
                          onClick={() => contactPerson(program.instructor, 'Instructor', 'instructor@coop.ng')}
                        >
                          Contact
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Register Members')}
                        >
                          Register
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
              onClick={() => addNewRecord('Training Program')}
            >
              🎓 New Program
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Schedule Training')}
            >
              📅 Schedule
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Member Registration')}
            >
              👥 Register Members
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Training Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default CooperativeTraining;
