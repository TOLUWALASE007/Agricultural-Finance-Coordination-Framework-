import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const RiskAssessment: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/insurance' },
    { id: 'policies', name: 'Policies', icon: '🛡️', href: '/portal/insurance/policies' },
    { id: 'claims', name: 'Claims', icon: '📋', href: '/portal/insurance/claims' },
    { id: 'risk', name: 'Risk Assessment', icon: '📈', href: '/portal/insurance/risk' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📊', href: '/portal/insurance/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/insurance/settings' }
  ];

  const riskAssessments = [
    {
      id: 'RISK-001',
      policyholder: 'Adebayo Ogunlesi',
      farm: 'Green Valley Farms',
      location: 'Ogun State',
      riskScore: 65,
      riskLevel: 'Medium',
      factors: ['Weather Risk', 'Market Risk', 'Pest Risk'],
      mitigation: 'Diversified Crops',
      lastAssessment: '2024-01-15',
      nextReview: '2024-04-15',
      premiumAdjustment: '+5%'
    },
    {
      id: 'RISK-002',
      policyholder: 'Fatima Ibrahim',
      farm: 'Ibrahim Farms',
      location: 'Kano State',
      riskScore: 35,
      riskLevel: 'Low',
      factors: ['Market Risk'],
      mitigation: 'Insurance Coverage',
      lastAssessment: '2024-01-12',
      nextReview: '2024-04-12',
      premiumAdjustment: '-10%'
    },
    {
      id: 'RISK-003',
      policyholder: 'Chinedu Okonkwo',
      farm: 'Okonkwo Enterprises',
      location: 'Anambra State',
      riskScore: 80,
      riskLevel: 'High',
      factors: ['Weather Risk', 'Flood Risk', 'Disease Risk'],
      mitigation: 'Enhanced Coverage',
      lastAssessment: '2024-01-18',
      nextReview: '2024-04-18',
      premiumAdjustment: '+15%'
    }
  ];

  const riskStats = [
    { label: 'Total Assessments', value: '156', change: '+18', trend: 'up' },
    { label: 'High Risk', value: '23', change: '+3', trend: 'up' },
    { label: 'Medium Risk', value: '89', change: '+8', trend: 'up' },
    { label: 'Low Risk', value: '44', change: '+7', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="Insurance Company" 
      roleIcon="🛡️" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Risk Assessment</h1>
            <p className="text-gray-400 font-serif mt-2">Assess and monitor insurance risk factors</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Risk Assessment Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Risk Assessment')}
            >
              ➕ New Assessment
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {riskStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Risk Assessments</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Risk Levels</option>
                <option>High Risk</option>
                <option>Medium Risk</option>
                <option>Low Risk</option>
              </select>
              <select className="input-field w-auto">
                <option>All Locations</option>
                <option>Ogun State</option>
                <option>Kano State</option>
                <option>Anambra State</option>
                <option>Kaduna State</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Assessments', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Assessment ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Policyholder</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Location</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Risk Score</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Risk Level</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Premium Adjustment</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {riskAssessments.map((assessment) => (
                  <tr key={assessment.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{assessment.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{assessment.policyholder}</p>
                        <p className="text-sm text-gray-400 font-serif">{assessment.farm}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{assessment.location}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-primary-600 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              assessment.riskScore < 40 ? 'bg-green-500' :
                              assessment.riskScore < 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${assessment.riskScore}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-300 font-serif text-sm">{assessment.riskScore}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        assessment.riskLevel === 'Low' ? 'bg-green-500 text-white' :
                        assessment.riskLevel === 'Medium' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {assessment.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-sans font-medium ${
                        assessment.premiumAdjustment.startsWith('+') ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {assessment.premiumAdjustment}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Risk Assessment Details', assessment.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Update Assessment')}
                        >
                          Update
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Adjust Premium')}
                        >
                          Adjust
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
              onClick={() => addNewRecord('Risk Assessment')}
            >
              📈 New Assessment
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Risk Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Risk Monitoring')}
            >
              🔍 Monitor
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Premium Adjustment')}
            >
              💰 Adjust Premium
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default RiskAssessment;
