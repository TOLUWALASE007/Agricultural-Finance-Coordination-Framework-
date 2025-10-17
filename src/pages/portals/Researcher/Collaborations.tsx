import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails, contactPerson } from '../../../utils/quickActions';

const ResearcherCollaborations: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/researcher' },
    { id: 'research', name: 'Research Projects', icon: '🔬', href: '/portal/researcher/projects' },
    { id: 'data', name: 'Data Collection', icon: '📊', href: '/portal/researcher/data' },
    { id: 'publications', name: 'Publications', icon: '📚', href: '/portal/researcher/publications' },
    { id: 'collaborations', name: 'Collaborations', icon: '🤝', href: '/portal/researcher/collaborations' },
    { id: 'funding', name: 'Funding', icon: '💰', href: '/portal/researcher/funding' },
    { id: 'conferences', name: 'Conferences', icon: '🎓', href: '/portal/researcher/conferences' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/researcher/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/researcher/settings' }
  ];

  const collaborations = [
    {
      id: 'COL-001',
      collaborator: 'Dr. Fatima Usman',
      institution: 'Ahmadu Bello University',
      department: 'Agricultural Economics',
      project: 'Climate-Smart Agriculture Impact Assessment',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      status: 'Active',
      role: 'Co-Principal Investigator',
      contribution: 'Data analysis and methodology development',
      contact: 'fatima.usman@abu.edu.ng'
    },
    {
      id: 'COL-002',
      collaborator: 'Prof. John Okafor',
      institution: 'University of Ibadan',
      department: 'Agricultural Extension',
      project: 'Digital Financial Inclusion in Agriculture',
      startDate: '2023-09-01',
      endDate: '2024-08-31',
      status: 'Active',
      role: 'Principal Investigator',
      contribution: 'Project coordination and supervision',
      contact: 'john.okafor@ui.edu.ng'
    },
    {
      id: 'COL-003',
      collaborator: 'Dr. Amina Hassan',
      institution: 'Bayero University Kano',
      department: 'Crop Science',
      project: 'Rice Yield Improvement Technologies',
      startDate: '2023-06-01',
      endDate: '2024-05-31',
      status: 'Completed',
      role: 'Research Associate',
      contribution: 'Field experiments and data collection',
      contact: 'amina.hassan@buk.edu.ng'
    }
  ];

  const collaborationStats = [
    { label: 'Active Collaborations', value: '8', change: '+2', trend: 'up' },
    { label: 'Total Partners', value: '15', change: '+3', trend: 'up' },
    { label: 'Institutions', value: '12', change: '+2', trend: 'up' },
    { label: 'Success Rate', value: '92%', change: '+5%', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="Researcher/Student" 
      roleIcon="🔬" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Collaborations</h1>
            <p className="text-gray-400 font-serif mt-2">Manage research collaborations and partnerships</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Collaborations Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Collaboration')}
            >
              ➕ New Collaboration
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {collaborationStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Research Collaborations</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Institutions</option>
                <option>Ahmadu Bello University</option>
                <option>University of Ibadan</option>
                <option>Bayero University Kano</option>
                <option>University of Nigeria</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Terminated</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Collaborations', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Collaborator</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Institution</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Project</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Role</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Duration</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {collaborations.map((collaboration) => (
                  <tr key={collaboration.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{collaboration.collaborator}</p>
                        <p className="text-sm text-gray-400 font-serif">{collaboration.department}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{collaboration.institution}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{collaboration.project}</p>
                        <p className="text-sm text-gray-400 font-serif">{collaboration.contribution}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{collaboration.role}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">{collaboration.startDate}</p>
                        <p className="text-sm text-gray-400 font-serif">to {collaboration.endDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        collaboration.status === 'Active' ? 'bg-green-500 text-white' :
                        collaboration.status === 'Completed' ? 'bg-blue-500 text-white' :
                        collaboration.status === 'Pending' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {collaboration.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Collaboration Details', collaboration.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => contactPerson(collaboration.collaborator, 'Collaborator', collaboration.contact)}
                        >
                          Contact
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Update Collaboration')}
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
              onClick={() => addNewRecord('New Collaboration')}
            >
              🤝 New Collaboration
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Find Collaborators')}
            >
              🔍 Find Partners
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Manage Projects')}
            >
              📋 Manage Projects
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Collaboration Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ResearcherCollaborations;
