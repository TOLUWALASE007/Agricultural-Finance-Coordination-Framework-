import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { addNewRecord, processAction, exportData, viewDetails } from '../../../utils/quickActions';

const LoanApplications: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/producer' },
    { id: 'loans', name: 'Loan Applications', icon: '💰', href: '/portal/producer/loans' },
    { id: 'anchor', name: 'Anchor Partners', icon: '⚓', href: '/portal/producer/anchors' },
    { id: 'insurance', name: 'Crop Insurance', icon: '🛡️', href: '/portal/producer/insurance' },
    { id: 'inputs', name: 'Input Suppliers', icon: '🌱', href: '/portal/producer/inputs' },
    { id: 'extension', name: 'Extension Services', icon: '🌾', href: '/portal/producer/extension' },
    { id: 'market', name: 'Market Prices', icon: '📈', href: '/portal/producer/market' },
    { id: 'cooperative', name: 'Cooperative', icon: '🤝', href: '/portal/producer/cooperative' }
  ];

  const loanStats = [
    { title: 'Active Loans', value: '₦2.4M', change: '+₦800K', icon: '💰' },
    { title: 'Pending Applications', value: '2', change: '+1', icon: '⏳' },
    { title: 'Repayment Rate', value: '96%', change: '+2%', icon: '✅' },
    { title: 'Next Payment', value: '₦150K', change: 'Due in 15 days', icon: '📅' }
  ];

  const myLoans = [
    {
      loanId: 'LOAN-2024-001',
      amount: '₦800K',
      purpose: 'Maize Farming Season',
      bank: 'First Bank of Nigeria',
      status: 'Active',
      disbursedDate: '2024-01-15',
      maturityDate: '2024-12-15',
      interestRate: '12%',
      remainingBalance: '₦650K',
      nextPayment: '₦75K',
      nextPaymentDate: '2024-02-15',
      anchorPartner: 'Dangote Farms Ltd',
      insuranceCovered: 'Yes',
      extensionOfficer: 'Mr. Ibrahim Musa'
    },
    {
      loanId: 'LOAN-2023-045',
      amount: '₦1.2M',
      purpose: 'Rice Production',
      bank: 'Zenith Bank',
      status: 'Active',
      disbursedDate: '2023-08-20',
      maturityDate: '2024-08-20',
      interestRate: '11%',
      remainingBalance: '₦400K',
      nextPayment: '₦100K',
      nextPaymentDate: '2024-02-20',
      anchorPartner: 'Olam Nigeria',
      insuranceCovered: 'Yes',
      extensionOfficer: 'Mrs. Fatima Ahmed'
    },
    {
      loanId: 'LOAN-2023-023',
      amount: '₦400K',
      purpose: 'Vegetable Farming',
      bank: 'Access Bank',
      status: 'Completed',
      disbursedDate: '2023-03-10',
      maturityDate: '2023-12-10',
      interestRate: '10%',
      remainingBalance: '₦0',
      nextPayment: '₦0',
      nextPaymentDate: 'N/A',
      anchorPartner: 'Fresh Direct',
      insuranceCovered: 'Yes',
      extensionOfficer: 'Mr. John Okafor'
    }
  ];

  const availableLoans = [
    {
      bank: 'First Bank of Nigeria',
      amount: '₦500K - ₦2M',
      interestRate: '10-12%',
      tenure: '6-12 months',
      purpose: 'Seasonal Farming',
      requirements: 'Anchor Contract, Insurance',
      processingTime: '5-7 days',
      specialOffers: 'No collateral required'
    },
    {
      bank: 'Zenith Bank',
      amount: '₦300K - ₦1.5M',
      interestRate: '9-11%',
      tenure: '6-18 months',
      purpose: 'Climate Smart Agriculture',
      requirements: 'Extension Support, Insurance',
      processingTime: '3-5 days',
      specialOffers: 'Quick approval for cooperatives'
    },
    {
      bank: 'Access Bank',
      amount: '₦200K - ₦1M',
      interestRate: '8-10%',
      purpose: 'Women Farmer Support',
      tenure: '6-12 months',
      requirements: 'Women Cooperative Membership',
      processingTime: '7-10 days',
      specialOffers: 'Lower rates for women farmers'
    }
  ];

  return (
    <PortalLayout role="Producer/Farmer" roleIcon="🌾" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Loan Applications & Management</h1>
          <p className="text-gray-200 font-serif">
            Apply for agricultural loans, manage existing loans, and track your farming financing needs with PFI partners.
          </p>
        </div>

        {/* Loan Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {loanStats.map((stat, index) => (
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

        {/* My Loans */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">My Active Loans</h3>
          <div className="space-y-4">
            {myLoans.map((loan, index) => (
              <div key={index} className="p-4 bg-primary-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold font-sans text-gray-100">{loan.loanId}</h4>
                    <p className="text-sm text-gray-300 font-serif">{loan.purpose}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      loan.status === 'Active' ? 'bg-green-500 text-white' :
                      loan.status === 'Completed' ? 'bg-blue-500 text-white' :
                      'bg-yellow-500 text-white'
                    }`}>
                      {loan.status}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 font-serif">Amount</p>
                    <p className="font-semibold font-sans text-gray-100">{loan.amount}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-serif">Bank</p>
                    <p className="font-semibold font-sans text-gray-100">{loan.bank}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-serif">Remaining Balance</p>
                    <p className="font-semibold font-sans text-gray-100">{loan.remainingBalance}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-serif">Next Payment</p>
                    <p className="font-semibold font-sans text-gray-100">{loan.nextPayment}</p>
                    <p className="text-xs text-gray-400">{loan.nextPaymentDate}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-primary-600">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 font-serif">Anchor Partner</p>
                      <p className="font-semibold font-sans text-gray-100">{loan.anchorPartner}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-serif">Insurance</p>
                      <p className="font-semibold font-sans text-gray-100">{loan.insuranceCovered}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-serif">Extension Officer</p>
                      <p className="font-semibold font-sans text-gray-100">{loan.extensionOfficer}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Loan Products */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Available Loan Products</h3>
            <div className="space-y-4">
              {availableLoans.map((product, index) => (
                <div key={index} className="p-4 bg-primary-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold font-sans text-gray-100">{product.bank}</h4>
                    <span className="text-sm text-accent-400 font-sans">{product.interestRate}</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-serif">Amount Range:</span>
                      <span className="text-gray-100 font-sans">{product.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-serif">Tenure:</span>
                      <span className="text-gray-100 font-sans">{product.tenure}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-serif">Processing Time:</span>
                      <span className="text-gray-100 font-sans">{product.processingTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-serif">Purpose:</span>
                      <span className="text-gray-100 font-sans">{product.purpose}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-primary-600">
                    <p className="text-xs text-gray-400 font-serif mb-1">Special Offers:</p>
                    <p className="text-sm text-accent-400 font-sans">{product.specialOffers}</p>
                  </div>
                  
                  <button className="btn-primary w-full mt-3">
                    Apply for Loan
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Loan Application Status */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Recent Applications</h3>
            <div className="space-y-3">
              {[
                { id: 'APP-2024-001', amount: '₦1.5M', bank: 'First Bank', status: 'Approved', date: '2024-01-15' },
                { id: 'APP-2024-002', amount: '₦800K', bank: 'Zenith Bank', status: 'Under Review', date: '2024-01-12' },
                { id: 'APP-2023-045', amount: '₦1.2M', bank: 'Access Bank', status: 'Disbursed', date: '2023-12-20' }
              ].map((app, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                  <div>
                    <p className="font-medium font-sans text-gray-100">{app.id}</p>
                    <p className="text-sm text-gray-300 font-serif">{app.amount} • {app.bank}</p>
                    <p className="text-xs text-gray-400 font-serif">{app.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    app.status === 'Approved' || app.status === 'Disbursed' ? 'bg-green-500 text-white' :
                    app.status === 'Under Review' ? 'bg-blue-500 text-white' :
                    'bg-yellow-500 text-white'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Loan Application')}
            >
              💰 Apply for New Loan
            </button>
            <button 
              className="btn-secondary"
              onClick={() => viewDetails('Loan History', 'ALL')}
            >
              📊 View Loan History
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Loan Payment')}
            >
              💳 Make Payment
            </button>
            <button 
              className="btn-secondary"
              onClick={() => exportData('Loan Statement', 'PDF')}
            >
              📋 Download Statement
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default LoanApplications;
