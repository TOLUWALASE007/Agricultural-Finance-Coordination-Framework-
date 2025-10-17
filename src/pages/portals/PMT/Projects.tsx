import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const Projects: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/pmt' },
    { id: 'projects', name: 'Projects', icon: '📋', href: '/portal/pmt/projects' },
    { id: 'stakeholders', name: 'Stakeholders', icon: '👥', href: '/portal/pmt/stakeholders' },
    { id: 'monitoring', name: 'Monitoring & Evaluation', icon: '📈', href: '/portal/pmt/monitoring' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📊', href: '/portal/pmt/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/pmt/settings' }
  ];

  const projects = [
    {
      id: 'PROJ-001',
      name: 'Agricultural Finance Enhancement Initiative',
      status: 'Active',
      startDate: '2023-01-15',
      endDate: '2025-12-31',
      budget: 5000000000,
      spent: 3200000000,
      progress: 64,
      stakeholders: 25,
      deliverables: 12,
      completed: 8,
      projectManager: 'Dr. Sarah Johnson',
      priority: 'High'
    },
    {
      id: 'PROJ-002',
      name: 'Smallholder Farmer Support Program',
      status: 'Planning',
      startDate: '2024-06-01',
      endDate: '2026-05-31',
      budget: 2000000000,
      spent: 0,
      progress: 0,
      stakeholders: 15,
      deliverables: 8,
      completed: 0,
      projectManager: 'Mike Wilson',
      priority: 'Medium'
    },
    {
      id: 'PROJ-003',
      name: 'Rural Development Acceleration',
      status: 'Completed',
      startDate: '2022-03-01',
      endDate: '2023-12-31',
      budget: 1500000000,
      spent: 1500000000,
      progress: 100,
      stakeholders: 20,
      deliverables: 10,
      completed: 10,
      projectManager: 'Grace Okonkwo',
      priority: 'High'
    }
  ];

  const projectStats = [
    { label: 'Active Projects', value: '8', change: '+2', trend: 'up' },
    { label: 'Total Budget', value: '₦12.5B', change: '+18%', trend: 'up' },
    { label: 'Average Progress', value: '68%', change: '+12%', trend: 'up' },
    { label: 'Stakeholders', value: '47', change: '+5', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="Project Management Team (PMT)" 
      roleIcon="📋" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Projects</h1>
            <p className="text-gray-400 font-serif mt-2">Manage and monitor AFCF projects</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Projects Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Project')}
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Project Portfolio</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Planning</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>
              <select className="input-field w-auto">
                <option>All Priority</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
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
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Project Name</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Budget</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Progress</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Manager</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Priority</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{project.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{project.name}</p>
                        <p className="text-sm text-gray-400 font-serif">{project.startDate} - {project.endDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'Active' ? 'bg-green-500 text-white' :
                        project.status === 'Planning' ? 'bg-blue-500 text-white' :
                        project.status === 'Completed' ? 'bg-gray-500 text-white' :
                        'bg-yellow-500 text-white'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">₦{(project.budget / 1000000000).toFixed(1)}B</p>
                        <p className="text-sm text-gray-400 font-serif">Spent: ₦{(project.spent / 1000000000).toFixed(1)}B</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-primary-600 rounded-full h-2 mr-2">
                          <div 
                            className="bg-accent-500 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-300 font-serif text-sm">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{project.projectManager}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.priority === 'High' ? 'bg-red-500 text-white' :
                        project.priority === 'Medium' ? 'bg-yellow-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        {project.priority}
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
                          onClick={() => processAction('Edit Project')}
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
              onClick={() => addNewRecord('Project Launch')}
            >
              📋 Launch Project
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Project Progress Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Stakeholder Meeting')}
            >
              👥 Stakeholder Meeting
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

export default Projects;
