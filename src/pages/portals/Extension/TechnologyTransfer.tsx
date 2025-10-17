import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails, contactPerson } from '../../../utils/quickActions';

const ExtensionTechnologyTransfer: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/extension' },
    { id: 'farmers', name: 'Farmers', icon: '🌾', href: '/portal/extension/farmers' },
    { id: 'training', name: 'Training Programs', icon: '🎓', href: '/portal/extension/training' },
    { id: 'advisory', name: 'Advisory Services', icon: '💡', href: '/portal/extension/advisory' },
    { id: 'tech', name: 'Technology Transfer', icon: '🔬', href: '/portal/extension/tech' },
    { id: 'monitoring', name: 'Field Monitoring', icon: '📱', href: '/portal/extension/monitoring' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/extension/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/extension/settings' }
  ];

  const technologyProjects = [
    {
      id: 'TECH-001',
      technology: 'Precision Agriculture',
      category: 'Digital Farming',
      farmers: 45,
      location: 'Kaduna State',
      startDate: '2024-01-15',
      status: 'Active',
      description: 'Introduction of GPS-guided farming and soil sensors',
      impact: '25% yield increase',
      cost: 500000,
      funding: 'Government Grant'
    },
    {
      id: 'TECH-002',
      technology: 'Drip Irrigation System',
      category: 'Water Management',
      farmers: 30,
      location: 'Kano State',
      startDate: '2024-01-20',
      status: 'Active',
      description: 'Water-efficient irrigation technology for smallholder farmers',
      impact: '40% water savings',
      cost: 300000,
      funding: 'Private Partnership'
    },
    {
      id: 'TECH-003',
      technology: 'Mobile App for Market Prices',
      category: 'Digital Tools',
      farmers: 120,
      location: 'Multiple States',
      startDate: '2024-01-10',
      status: 'Completed',
      description: 'Real-time market price information for farmers',
      impact: '30% better pricing',
      cost: 200000,
      funding: 'NGO Support'
    }
  ];

  const techStats = [
    { label: 'Active Projects', value: '8', change: '+2', trend: 'up' },
    { label: 'Farmers Reached', value: '450', change: '+75', trend: 'up' },
    { label: 'Technologies', value: '12', change: '+3', trend: 'up' },
    { label: 'Success Rate', value: '88%', change: '+5%', trend: 'up' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Technology Transfer</h1>
            <p className="text-gray-400 font-serif mt-2">Facilitate the transfer of agricultural technologies to farmers</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Technology Transfer Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Technology Project')}
            >
              ➕ New Project
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {techStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Technology Projects</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Categories</option>
                <option>Digital Farming</option>
                <option>Water Management</option>
                <option>Digital Tools</option>
                <option>Mechanization</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Completed</option>
                <option>Planning</option>
                <option>Paused</option>
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
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Technology</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Category</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Farmers</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Location</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Impact</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Cost</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {technologyProjects.map((project) => (
                  <tr key={project.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{project.technology}</p>
                        <p className="text-sm text-gray-400 font-serif">{project.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{project.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{project.farmers}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{project.location}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{project.impact}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">₦{project.cost.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'Active' ? 'bg-green-500 text-white' :
                        project.status === 'Completed' ? 'bg-blue-500 text-white' :
                        project.status === 'Planning' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
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
                          onClick={() => processAction('Update Project')}
                        >
                          Update
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
              onClick={() => addNewRecord('Technology Project')}
            >
              🔬 New Project
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Technology Assessment')}
            >
              📊 Assessment
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Farmer Training')}
            >
              🎓 Training
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Technology Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ExtensionTechnologyTransfer;
