import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const DataCollection: React.FC = () => {
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

  const dataCollections = [
    {
      id: 'DAT-001',
      datasetName: 'Climate Data - Northern Region',
      projectId: 'RES-001',
      dataType: 'Climate Data',
      collectionMethod: 'Weather Stations',
      startDate: '2023-01-15',
      endDate: '2024-01-15',
      status: 'Completed',
      records: 8760,
      dataQuality: 'High',
      location: 'Kaduna, Kano, Sokoto',
      variables: ['Temperature', 'Humidity', 'Rainfall', 'Wind Speed'],
      fileSize: '2.3 GB',
      lastUpdated: '2024-01-15',
      accessLevel: 'Restricted'
    },
    {
      id: 'DAT-002',
      datasetName: 'Farm Survey Data - Smallholders',
      projectId: 'RES-001',
      dataType: 'Survey Data',
      collectionMethod: 'Field Surveys',
      startDate: '2023-03-01',
      endDate: '2024-03-01',
      status: 'Active',
      records: 1250,
      dataQuality: 'High',
      location: 'Multiple States',
      variables: ['Farm Size', 'Crop Types', 'Yield', 'Input Usage'],
      fileSize: '850 MB',
      lastUpdated: '2024-01-20',
      accessLevel: 'Internal'
    },
    {
      id: 'DAT-003',
      datasetName: 'Soil Analysis Data',
      projectId: 'RES-003',
      dataType: 'Laboratory Data',
      collectionMethod: 'Soil Sampling',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'Active',
      records: 450,
      dataQuality: 'Medium',
      location: 'Southwest Region',
      variables: ['pH', 'Nutrients', 'Organic Matter', 'Texture'],
      fileSize: '120 MB',
      lastUpdated: '2024-01-18',
      accessLevel: 'Public'
    }
  ];

  const dataStats = [
    { label: 'Total Datasets', value: '24', change: '+3', trend: 'up' },
    { label: 'Active Collections', value: '12', change: '+2', trend: 'up' },
    { label: 'Total Records', value: '15,247', change: '+1,890', trend: 'up' },
    { label: 'Data Quality Score', value: '87%', change: '+5%', trend: 'up' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Data Collection</h1>
            <p className="text-gray-400 font-serif mt-2">Manage research data collection and analysis</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Data Collection Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Data Collection')}
            >
              ➕ New Collection
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {dataStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Data Collection Management</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Data Types</option>
                <option>Climate Data</option>
                <option>Survey Data</option>
                <option>Laboratory Data</option>
                <option>Field Observations</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Completed</option>
                <option>Planning</option>
                <option>On Hold</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Datasets', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Dataset ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Dataset Name</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Project</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Data Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Records</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Quality</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dataCollections.map((dataset) => (
                  <tr key={dataset.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{dataset.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{dataset.datasetName}</p>
                        <p className="text-sm text-gray-400 font-serif">{dataset.location}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{dataset.projectId}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{dataset.dataType}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">{dataset.records.toLocaleString()}</p>
                        <p className="text-sm text-gray-400 font-serif">{dataset.fileSize}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dataset.dataQuality === 'High' ? 'bg-green-500 text-white' :
                        dataset.dataQuality === 'Medium' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {dataset.dataQuality}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dataset.status === 'Active' ? 'bg-green-500 text-white' :
                        dataset.status === 'Completed' ? 'bg-blue-500 text-white' :
                        dataset.status === 'Planning' ? 'bg-yellow-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {dataset.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Dataset Details', dataset.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Analyze Data')}
                        >
                          Analyze
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Export Data')}
                        >
                          Export
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
              onClick={() => addNewRecord('Data Collection')}
            >
              📊 New Collection
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Data Analysis')}
            >
              📈 Analyze Data
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Data Visualization')}
            >
              📊 Visualize
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Data Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default DataCollection;
