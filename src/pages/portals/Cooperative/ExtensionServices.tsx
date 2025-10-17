import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails, contactPerson } from '../../../utils/quickActions';

const CooperativeExtensionServices: React.FC = () => {
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

  const extensionServices = [
    {
      id: 'EXT-001',
      serviceName: 'Group Training on Modern Farming Techniques',
      serviceType: 'Training',
      provider: 'NAERLS Extension Officer',
      date: '2024-01-20',
      status: 'Completed',
      participants: 45,
      description: 'Training on improved rice cultivation methods and pest management',
      cost: 0,
      location: 'Cooperative Hall, Kaduna'
    },
    {
      id: 'EXT-002',
      serviceName: 'Soil Testing and Analysis',
      serviceType: 'Technical Support',
      provider: 'Agricultural Development Officer',
      date: '2024-01-25',
      status: 'Scheduled',
      participants: 30,
      description: 'Soil sampling and analysis for all cooperative members',
      cost: 5000,
      location: 'Member Farms'
    },
    {
      id: 'EXT-003',
      serviceName: 'Group Advisory on Market Access',
      serviceType: 'Advisory',
      provider: 'Market Development Specialist',
      date: '2024-01-15',
      status: 'Completed',
      participants: 60,
      description: 'Guidance on accessing better markets and pricing strategies',
      cost: 0,
      location: 'Cooperative Office'
    }
  ];

  const serviceStats = [
    { label: 'Services Received', value: '12', change: '+3', trend: 'up' },
    { label: 'Members Trained', value: '180', change: '+25', trend: 'up' },
    { label: 'Training Sessions', value: '8', change: '+2', trend: 'up' },
    { label: 'Satisfaction Rate', value: '92%', change: '+5%', trend: 'up' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Extension Services</h1>
            <p className="text-gray-400 font-serif mt-2">Access agricultural extension services for cooperative members</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Extension Services Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Request Service')}
            >
              ➕ Request Service
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {serviceStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Extension Services</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Types</option>
                <option>Training</option>
                <option>Technical Support</option>
                <option>Advisory</option>
                <option>Consultation</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Completed</option>
                <option>Scheduled</option>
                <option>Pending</option>
                <option>Cancelled</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Services', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Service Name</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Provider</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Date</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Participants</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Cost</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {extensionServices.map((service) => (
                  <tr key={service.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{service.serviceName}</p>
                        <p className="text-sm text-gray-400 font-serif">{service.description}</p>
                        <p className="text-xs text-gray-500 font-serif">📍 {service.location}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{service.serviceType}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{service.provider}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{service.date}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{service.participants}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">₦{service.cost.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        service.status === 'Completed' ? 'bg-green-500 text-white' :
                        service.status === 'Scheduled' ? 'bg-blue-500 text-white' :
                        service.status === 'Pending' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Service Details', service.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => contactPerson(service.provider, 'Extension Office', 'extension@naerls.gov.ng')}
                        >
                          Contact
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Schedule Follow-up')}
                        >
                          Follow-up
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
              onClick={() => addNewRecord('Group Training Request')}
            >
              🎓 Group Training
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Technical Support')}
            >
              🔧 Technical Support
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Advisory Services')}
            >
              💡 Advisory
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Services Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default CooperativeExtensionServices;
