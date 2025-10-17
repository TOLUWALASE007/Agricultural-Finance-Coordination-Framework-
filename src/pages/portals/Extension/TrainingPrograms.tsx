import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const TrainingPrograms: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/extension' },
    { id: 'farmers', name: 'Farmers', icon: '🌾', href: '/portal/extension/farmers' },
    { id: 'training', name: 'Training Programs', icon: '🎓', href: '/portal/extension/training' },
    { id: 'advisory', name: 'Advisory Services', icon: '💡', href: '/portal/extension/advisory' },
    { id: 'technology', name: 'Technology Transfer', icon: '🔬', href: '/portal/extension/technology' },
    { id: 'monitoring', name: 'Field Monitoring', icon: '📱', href: '/portal/extension/monitoring' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/extension/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/extension/settings' }
  ];

  const trainingPrograms = [
    {
      id: 'TRN-001',
      programName: 'Sustainable Rice Farming Techniques',
      category: 'Crop Production',
      duration: '3 days',
      participants: 45,
      maxParticipants: 50,
      startDate: '2024-02-15',
      endDate: '2024-02-17',
      location: 'Kaduna Agricultural Training Center',
      instructor: 'Dr. Ahmed Ibrahim',
      status: 'Scheduled',
      cost: 15000,
      materials: ['Training Manual', 'Seed Samples', 'Fertilizer Guide'],
      objectives: ['Increase yield by 30%', 'Reduce input costs', 'Improve soil health']
    },
    {
      id: 'TRN-002',
      programName: 'Modern Irrigation Methods',
      category: 'Water Management',
      duration: '2 days',
      participants: 32,
      maxParticipants: 40,
      startDate: '2024-01-20',
      endDate: '2024-01-21',
      location: 'Kano Extension Office',
      instructor: 'Eng. Fatima Usman',
      status: 'Completed',
      cost: 12000,
      materials: ['Irrigation Guide', 'Water Testing Kit', 'Drip System Demo'],
      objectives: ['Water conservation', 'Efficient irrigation', 'Cost reduction']
    },
    {
      id: 'TRN-003',
      programName: 'Integrated Pest Management',
      category: 'Pest Control',
      duration: '4 days',
      participants: 0,
      maxParticipants: 35,
      startDate: '2024-03-01',
      endDate: '2024-03-04',
      location: 'Enugu State University',
      instructor: 'Prof. John Okafor',
      status: 'Planning',
      cost: 18000,
      materials: ['Pest Identification Guide', 'Biological Control Kit', 'Safety Equipment'],
      objectives: ['Reduce pesticide use', 'Increase beneficial insects', 'Improve crop quality']
    }
  ];

  const trainingStats = [
    { label: 'Total Programs', value: '45', change: '+8', trend: 'up' },
    { label: 'Active Programs', value: '12', change: '+3', trend: 'up' },
    { label: 'Participants Trained', value: '1,247', change: '+89', trend: 'up' },
    { label: 'Completion Rate', value: '92%', change: '+5%', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="Extension Organization" 
      roleIcon="🌾" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Training Programs</h1>
            <p className="text-gray-400 font-serif mt-2">Manage agricultural training programs and capacity building</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Training Programs Report', 'PDF')}
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Training Program Management</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Categories</option>
                <option>Crop Production</option>
                <option>Water Management</option>
                <option>Pest Control</option>
                <option>Post-Harvest</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Scheduled</option>
                <option>Completed</option>
                <option>Planning</option>
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
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Program ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Program Name</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Category</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Duration</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Participants</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Instructor</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trainingPrograms.map((program) => (
                  <tr key={program.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{program.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{program.programName}</p>
                        <p className="text-sm text-gray-400 font-serif">{program.location}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{program.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">{program.duration}</p>
                        <p className="text-sm text-gray-400 font-serif">{program.startDate} - {program.endDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">{program.participants}/{program.maxParticipants}</p>
                        <p className="text-sm text-gray-400 font-serif">Cost: ₦{program.cost.toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{program.instructor}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        program.status === 'Scheduled' ? 'bg-blue-500 text-white' :
                        program.status === 'Completed' ? 'bg-green-500 text-white' :
                        program.status === 'Planning' ? 'bg-yellow-500 text-white' :
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
                          onClick={() => processAction('Enroll Participants')}
                        >
                          Enroll
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Update Program')}
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
              onClick={() => addNewRecord('Training Program')}
            >
              🎓 New Program
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Schedule Training')}
            >
              📅 Schedule Training
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Enroll Participants')}
            >
              👥 Enroll Participants
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

export default TrainingPrograms;
