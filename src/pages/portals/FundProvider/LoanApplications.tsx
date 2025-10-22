import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, scheduleAction, exportData } from '../../../utils/quickActions';

const LoanApplications: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/fund-provider' },
    { id: 'funds', name: 'Fund Management', icon: '₦', href: '/portal/fund-provider/funds' },
    { id: 'applications', name: 'Loan Applications', icon: '📋', href: '/portal/fund-provider/applications' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/fund-provider/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/fund-provider/settings' }
  ];

  const applicationStats = [
    { title: 'Total Applications', value: '1,847', change: '+89', icon: '📋' },
    { title: 'Pending Review', value: '234', change: '-12', icon: '⏳' },
    { title: 'Approved', value: '1,456', change: '+67', icon: '✅' },
    { title: 'Total Amount', value: '₦12.3B', change: '+₦1.2B', icon: '₦' }
  ];

  const recentApplications = [
    { 
      id: 'APP-2024-001', 
      applicant: 'John Doe Farms', 
      amount: '₦2.5M', 
      purpose: 'Maize Farming', 
      pfis: 'First Bank', 
      status: 'Approved',
      date: '2024-01-15',
      producer: 'Producer/Farmer',
      anchor: 'Dangote Farms Ltd',
      insurance: 'Covered'
    },
    { 
      id: 'APP-2024-002', 
      applicant: 'Sarah Agricultural Coop', 
      amount: '₦5.2M', 
      purpose: 'Rice Production', 
      pfis: 'Zenith Bank', 
      status: 'Under Review',
      date: '2024-01-14',
      producer: 'Cooperative Group',
      anchor: 'Olam Nigeria',
      insurance: 'Pending'
    },
    { 
      id: 'APP-2024-003', 
      applicant: 'Kano Youth Farmers', 
      amount: '₦1.8M', 
      purpose: 'Vegetable Farming', 
      pfis: 'Access Bank', 
      status: 'Approved',
      date: '2024-01-13',
      producer: 'Producer/Farmer',
      anchor: 'Fresh Direct',
      insurance: 'Covered'
    },
    { 
      id: 'APP-2024-004', 
      applicant: 'Women Farmers Association', 
      amount: '₦3.7M', 
      purpose: 'Cassava Processing', 
      pfis: 'GTBank', 
      status: 'Pending',
      date: '2024-01-12',
      producer: 'Cooperative Group',
      anchor: 'Flour Mills Nigeria',
      insurance: 'Under Review'
    }
  ];

  const applicationByRegion = [
    { region: 'North Central', applications: '456', amount: '₦3.2B', approval: '89%' },
    { region: 'South West', applications: '389', amount: '₦2.8B', approval: '92%' },
    { region: 'North West', applications: '567', amount: '₦4.1B', approval: '87%' },
    { region: 'South East', applications: '234', amount: '₦1.5B', approval: '94%' },
    { region: 'North East', applications: '201', amount: '₦0.7B', approval: '85%' }
  ];

  const applicationByStakeholder = [
    { stakeholder: 'Producer/Farmer', applications: '1,247', amount: '₦8.9B', percentage: '67%' },
    { stakeholder: 'Cooperative Group', applications: '345', amount: '₦2.1B', percentage: '19%' },
    { stakeholder: 'Anchor Companies', applications: '156', amount: '₦1.2B', percentage: '9%' },
    { stakeholder: 'Lead Firms', applications: '99', amount: '₦0.1B', percentage: '5%' }
  ];

  return (
    <PortalLayout role="Fund Provider" roleIcon="₦" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Loan Applications Overview</h1>
          <p className="text-gray-200 font-serif">
            Monitor loan applications across all PFI partners and track the flow of agricultural financing to end beneficiaries.
          </p>
        </div>

        {/* Application Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {applicationStats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-serif">{stat.title}</p>
                  <p className="text-2xl font-bold font-sans text-gray-100">{stat.value}</p>
                  <p className="text-sm text-accent-400 font-serif">{stat.change}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Applications */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Recent Applications</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-600">
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Application ID</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Applicant</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Purpose</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">PFI</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Status</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app, index) => (
                  <tr key={index} className="border-b border-primary-700">
                    <td className="py-3 px-4 font-medium font-sans text-accent-400">{app.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium font-sans text-gray-100">{app.applicant}</p>
                        <p className="text-xs text-gray-400 font-serif">{app.producer}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold font-sans text-gray-100">{app.amount}</td>
                    <td className="py-3 px-4 text-gray-300 font-serif">{app.purpose}</td>
                    <td className="py-3 px-4 text-gray-300 font-serif">{app.pfis}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === 'Approved' ? 'bg-green-500 text-white' :
                        app.status === 'Under Review' ? 'bg-blue-500 text-white' :
                        'bg-yellow-500 text-white'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300 font-serif">{app.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Applications by Region */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Applications by Region</h3>
            <div className="space-y-3">
              {applicationByRegion.map((region, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                  <div>
                    <p className="font-medium font-sans text-gray-100">{region.region}</p>
                    <p className="text-sm text-gray-300 font-serif">{region.applications} applications</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold font-sans text-accent-400">{region.amount}</p>
                    <p className="text-xs text-gray-400 font-serif">{region.approval} approval</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Applications by Stakeholder Type */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Applications by Stakeholder</h3>
            <div className="space-y-3">
              {applicationByStakeholder.map((stakeholder, index) => (
                <div key={index} className="p-3 bg-primary-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium font-sans text-gray-100">{stakeholder.stakeholder}</p>
                    <span className="text-sm text-accent-400 font-sans">{stakeholder.percentage}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300 font-serif">{stakeholder.applications} applications</span>
                    <span className="text-gray-300 font-serif">{stakeholder.amount}</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-primary-600 rounded-full h-2">
                      <div 
                        className="bg-accent-500 h-2 rounded-full" 
                        style={{ width: stakeholder.percentage }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Application Flow Analysis */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Application Flow Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">📝</div>
              <p className="text-2xl font-bold font-sans text-gray-100">1,847</p>
              <p className="text-sm text-gray-400 font-serif">Applications Received</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🔍</div>
              <p className="text-2xl font-bold font-sans text-gray-100">234</p>
              <p className="text-sm text-gray-400 font-serif">Under Review</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">✅</div>
              <p className="text-2xl font-bold font-sans text-gray-100">1,456</p>
              <p className="text-sm text-gray-400 font-serif">Approved</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">₦</div>
              <p className="text-2xl font-bold font-sans text-gray-100">1,234</p>
              <p className="text-sm text-gray-400 font-serif">Disbursed</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">❌</div>
              <p className="text-2xl font-bold font-sans text-gray-100">157</p>
              <p className="text-sm text-gray-400 font-serif">Rejected</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => generateReport('Loan Applications Analysis', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Application Review')}
            >
              🔍 Review Applications
            </button>
            <button 
              className="btn-secondary"
              onClick={() => exportData('Application Analytics', 'Excel')}
            >
              📈 Analytics Dashboard
            </button>
            <button 
              className="btn-secondary"
              onClick={() => scheduleAction('PFI Performance Meeting', 'Next Week')}
            >
              🏦 PFI Performance
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default LoanApplications;
