import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const ResearchProjects: React.FC = () => {
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

  const researchProjects = [
    {
      id: 'RES-001',
      projectTitle: 'Climate-Smart Agriculture for Smallholder Farmers',
      researchArea: 'Climate Adaptation',
      fundingAgency: 'World Bank',
      budget: 25000000,
      startDate: '2023-01-15',
      endDate: '2025-12-31',
      status: 'Active',
      progress: 65,
      principalInvestigator: 'Dr. Sarah Johnson',
      collaborators: ['IITA', 'ICRISAT', 'Local Farmers'],
      objectives: ['Develop drought-resistant varieties', 'Improve water management', 'Enhance soil health'],
      deliverables: ['Research Report', 'Technology Package', 'Training Manual'],
      publications: 3,
      fieldSites: 5
    },
    {
      id: 'RES-002',
      projectTitle: 'Digital Agriculture for Youth Employment',
      researchArea: 'Digital Innovation',
      fundingAgency: 'African Development Bank',
      budget: 18000000,
      startDate: '2023-06-01',
      endDate: '2024-11-30',
      status: 'Active',
      progress: 45,
      principalInvestigator: 'Prof. Ahmed Ibrahim',
      collaborators: ['Microsoft', 'Local Tech Startups', 'Youth Groups'],
      objectives: ['Develop mobile apps', 'Create digital platforms', 'Train youth in agri-tech'],
      deliverables: ['Mobile Application', 'Digital Platform', 'Training Program'],
      publications: 2,
      fieldSites: 3
    },
    {
      id: 'RES-003',
      projectTitle: 'Post-Harvest Loss Reduction Strategies',
      researchArea: 'Food Security',
      fundingAgency: 'Bill & Melinda Gates Foundation',
      budget: 32000000,
      startDate: '2024-01-01',
      endDate: '2026-12-31',
      status: 'Planning',
      progress: 15,
      principalInvestigator: 'Dr. Fatima Usman',
      collaborators: ['FAO', 'Local Processors', 'Transport Companies'],
      objectives: ['Reduce post-harvest losses', 'Improve storage methods', 'Enhance value chains'],
      deliverables: ['Storage Technology', 'Processing Methods', 'Value Chain Analysis'],
      publications: 0,
      fieldSites: 8
    }
  ];

  const projectStats = [
    { label: 'Active Projects', value: '8', change: '+2', trend: 'up' },
    { label: 'Total Budget', value: '₦75M', change: '+₦12M', trend: 'up' },
    { label: 'Publications', value: '23', change: '+5', trend: 'up' },
    { label: 'Field Sites', value: '16', change: '+3', trend: 'up' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Research Projects</h1>
            <p className="text-gray-400 font-serif mt-2">Manage research projects and academic activities</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Research Projects Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Research Project')}
            >
              ➕ New Project
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {projectStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Research Project Management</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Research Areas</option>
                <option>Climate Adaptation</option>
                <option>Digital Innovation</option>
                <option>Food Security</option>
                <option>Soil Science</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Planning</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Projects', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Project ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Project Title</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Research Area</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Funding Agency</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Budget</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Progress</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {researchProjects.map((project) => (
                  <tr key={project.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{project.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{project.projectTitle}</p>
                        <p className="text-sm text-gray-400 font-serif">PI: {project.principalInvestigator}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{project.researchArea}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{project.fundingAgency}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">₦{(project.budget / 1000000).toFixed(1)}M</p>
                        <p className="text-sm text-gray-400 font-serif">{project.startDate} - {project.endDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="w-full bg-primary-700 rounded-full h-2 mb-1">
                          <div 
                            className="bg-accent-400 h-2 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-400 font-serif">{project.progress}%</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'Active' ? 'bg-green-500 text-white' :
                        project.status === 'Planning' ? 'bg-yellow-500 text-white' :
                        project.status === 'Completed' ? 'bg-blue-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Project Details', project.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Update Progress')}
                        >
                          Update
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Manage Collaborators')}
                        >
                          Collaborate
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
              onClick={() => addNewRecord('Research Project')}
            >
              🔬 New Project
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Data Collection')}
            >
              📊 Data Collection
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Paper Publication')}
            >
              📚 Publish Paper
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Research Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ResearchProjects;
