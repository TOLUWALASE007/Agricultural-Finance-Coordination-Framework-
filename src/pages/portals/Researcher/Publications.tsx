import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails, contactPerson } from '../../../utils/quickActions';

const ResearcherPublications: React.FC = () => {
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

  const publications = [
    {
      id: 'PUB-001',
      title: 'Impact of Climate-Smart Agriculture on Smallholder Farmer Productivity in Northern Nigeria',
      authors: 'Dr. Ahmadu Ibrahim, Dr. Fatima Usman, Prof. John Okafor',
      journal: 'Agricultural Systems Journal',
      year: 2024,
      status: 'Published',
      impactFactor: 3.2,
      citations: 15,
      doi: '10.1016/j.agsy.2024.103456',
      keywords: 'Climate-smart agriculture, Smallholder farmers, Productivity, Nigeria'
    },
    {
      id: 'PUB-002',
      title: 'Digital Financial Inclusion in Agricultural Value Chains: A Case Study of AFCF',
      authors: 'Dr. Maryam Abdullahi, Dr. Ibrahim Musa',
      journal: 'Journal of Agricultural Economics',
      year: 2024,
      status: 'Under Review',
      impactFactor: 2.8,
      citations: 0,
      doi: '10.1016/j.jage.2024.123456',
      keywords: 'Digital finance, Agricultural value chains, Financial inclusion'
    },
    {
      id: 'PUB-003',
      title: 'Technology Adoption and Yield Improvement in Rice Farming: Evidence from Cooperative Groups',
      authors: 'Dr. Amina Hassan, Dr. Usman Garba',
      journal: 'Food Security Journal',
      year: 2023,
      status: 'Published',
      impactFactor: 4.1,
      citations: 28,
      doi: '10.1007/s12571-2023-12345',
      keywords: 'Technology adoption, Rice farming, Cooperative groups, Yield improvement'
    }
  ];

  const publicationStats = [
    { label: 'Total Publications', value: '24', change: '+3', trend: 'up' },
    { label: 'This Year', value: '8', change: '+2', trend: 'up' },
    { label: 'Total Citations', value: '156', change: '+23', trend: 'up' },
    { label: 'H-Index', value: '12', change: '+2', trend: 'up' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Publications</h1>
            <p className="text-gray-400 font-serif mt-2">Manage your research publications and track academic impact</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Publications Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Publication')}
            >
              ➕ New Publication
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {publicationStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Publications</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Years</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Published</option>
                <option>Under Review</option>
                <option>Submitted</option>
                <option>Draft</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Publications', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Title</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Authors</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Journal</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Year</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Impact Factor</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Citations</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {publications.map((publication) => (
                  <tr key={publication.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{publication.title}</p>
                        <p className="text-sm text-gray-400 font-serif">DOI: {publication.doi}</p>
                        <p className="text-xs text-gray-500 font-serif">Keywords: {publication.keywords}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{publication.authors}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{publication.journal}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{publication.year}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{publication.impactFactor}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{publication.citations}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        publication.status === 'Published' ? 'bg-green-500 text-white' :
                        publication.status === 'Under Review' ? 'bg-yellow-500 text-white' :
                        publication.status === 'Submitted' ? 'bg-blue-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {publication.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Publication Details', publication.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Edit Publication')}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Share Publication')}
                        >
                          Share
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
              onClick={() => addNewRecord('New Publication')}
            >
              📚 New Publication
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Submit Paper')}
            >
              📤 Submit Paper
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Track Citations')}
            >
              📈 Track Citations
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Publication Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ResearcherPublications;
