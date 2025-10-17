import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails, contactPerson } from '../../../utils/quickActions';

const ResearcherConferences: React.FC = () => {
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

  const conferences = [
    {
      id: 'CONF-001',
      title: 'International Conference on Agricultural Economics',
      organizer: 'International Association of Agricultural Economists',
      location: 'Cape Town, South Africa',
      date: '2024-08-15',
      endDate: '2024-08-18',
      type: 'International',
      status: 'Registered',
      presentation: 'Climate-Smart Agriculture Impact Assessment in Northern Nigeria',
      authors: 'Dr. Ahmadu Ibrahim, Dr. Fatima Usman',
      registrationFee: 500,
      currency: 'USD',
      accommodation: 'Included'
    },
    {
      id: 'CONF-002',
      title: 'African Agricultural Research Conference',
      organizer: 'Forum for Agricultural Research in Africa (FARA)',
      location: 'Accra, Ghana',
      date: '2024-06-20',
      endDate: '2024-06-23',
      type: 'Regional',
      status: 'Accepted',
      presentation: 'Digital Financial Inclusion in Agricultural Value Chains',
      authors: 'Dr. Maryam Abdullahi, Dr. Ibrahim Musa',
      registrationFee: 300,
      currency: 'USD',
      accommodation: 'Not Included'
    },
    {
      id: 'CONF-003',
      title: 'Nigerian Agricultural Economics Association Annual Conference',
      organizer: 'Nigerian Agricultural Economics Association',
      location: 'Abuja, Nigeria',
      date: '2024-03-10',
      endDate: '2024-03-12',
      type: 'National',
      status: 'Completed',
      presentation: 'Technology Adoption and Yield Improvement in Rice Farming',
      authors: 'Dr. Amina Hassan, Dr. Usman Garba',
      registrationFee: 50000,
      currency: 'NGN',
      accommodation: 'Included'
    }
  ];

  const conferenceStats = [
    { label: 'Total Conferences', value: '12', change: '+2', trend: 'up' },
    { label: 'This Year', value: '5', change: '+1', trend: 'up' },
    { label: 'Presentations', value: '8', change: '+2', trend: 'up' },
    { label: 'Networking', value: '45', change: '+8', trend: 'up' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Conferences</h1>
            <p className="text-gray-400 font-serif mt-2">Manage conference participation and academic networking</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Conferences Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Conference')}
            >
              ➕ New Conference
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {conferenceStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Conference Participation</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Types</option>
                <option>International</option>
                <option>Regional</option>
                <option>National</option>
                <option>Local</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Registered</option>
                <option>Accepted</option>
                <option>Completed</option>
                <option>Pending</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Conferences', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Conference</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Organizer</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Location</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Date</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Fee</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {conferences.map((conference) => (
                  <tr key={conference.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{conference.title}</p>
                        <p className="text-sm text-gray-400 font-serif">{conference.presentation}</p>
                        <p className="text-xs text-gray-500 font-serif">Authors: {conference.authors}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{conference.organizer}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">{conference.location}</p>
                        <p className="text-sm text-gray-400 font-serif">📍 {conference.location}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">{conference.date}</p>
                        <p className="text-sm text-gray-400 font-serif">to {conference.endDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{conference.type}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">
                          {conference.currency === 'NGN' ? '₦' : '$'}{conference.registrationFee.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-400 font-serif">{conference.accommodation}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        conference.status === 'Registered' ? 'bg-blue-500 text-white' :
                        conference.status === 'Accepted' ? 'bg-green-500 text-white' :
                        conference.status === 'Completed' ? 'bg-gray-500 text-white' :
                        'bg-yellow-500 text-white'
                      }`}>
                        {conference.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Conference Details', conference.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Register')}
                        >
                          Register
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Submit Abstract')}
                        >
                          Abstract
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
              onClick={() => addNewRecord('Conference Registration')}
            >
              🎓 Register Conference
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Submit Abstract')}
            >
              📝 Submit Abstract
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Find Conferences')}
            >
              🔍 Find Conferences
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Conference Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ResearcherConferences;
