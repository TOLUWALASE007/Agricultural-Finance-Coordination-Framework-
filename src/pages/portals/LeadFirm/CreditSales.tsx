import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const CreditSales: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/lead-firm' },
    { id: 'products', name: 'Product Catalog', icon: '🌱', href: '/portal/lead-firm/products' },
    { id: 'orders', name: 'Orders', icon: '📦', href: '/portal/lead-firm/orders' },
    { id: 'producers', name: 'Producer Network', icon: '🌾', href: '/portal/lead-firm/producers' },
    { id: 'credit', name: 'Credit Sales', icon: '💰', href: '/portal/lead-firm/credit' },
    { id: 'delivery', name: 'Delivery', icon: '🚚', href: '/portal/lead-firm/delivery' },
    { id: 'quality', name: 'Quality Control', icon: '✅', href: '/portal/lead-firm/quality' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/lead-firm/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/lead-firm/settings' }
  ];

  const creditSales = [
    {
      id: 'CS-001',
      customer: 'Ibrahim Musa',
      product: 'Premium Rice Seeds',
      quantity: 50,
      unitPrice: 2500,
      totalAmount: 125000,
      creditLimit: 500000,
      creditUsed: 150000,
      status: 'Approved',
      applicationDate: '2024-01-15',
      approvalDate: '2024-01-16',
      repaymentDate: '2024-04-15',
      interestRate: 12
    },
    {
      id: 'CS-002',
      customer: 'Fatima Ahmed',
      product: 'NPK Fertilizer',
      quantity: 25,
      unitPrice: 1800,
      totalAmount: 45000,
      creditLimit: 300000,
      creditUsed: 200000,
      status: 'Pending',
      applicationDate: '2024-01-12',
      approvalDate: 'TBD',
      repaymentDate: 'TBD',
      interestRate: 15
    }
  ];

  const creditStats = [
    { label: 'Total Credit Sales', value: '₦45.2M', change: '+5.2M', trend: 'up' },
    { label: 'Active Credits', value: '1,247', change: '+89', trend: 'up' },
    { label: 'Approved Applications', value: '89%', change: '+3%', trend: 'up' },
    { label: 'Default Rate', value: '2.3%', change: '-0.5%', trend: 'down' }
  ];

  return (
    <PortalLayout 
      role="Lead Firm" 
      roleIcon="🏭" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Credit Sales</h1>
            <p className="text-gray-400 font-serif mt-2">Manage credit sales and payment terms</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Credit Sales Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Credit Sale')}
            >
              ➕ New Credit Sale
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {creditStats.map((stat, index) => (
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
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Credit Sales Management</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Credit ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Product</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {creditSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{sale.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{sale.customer}</p>
                        <p className="text-sm text-gray-400 font-serif">Limit: ₦{(sale.creditLimit / 1000).toFixed(0)}K</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">{sale.product}</p>
                        <p className="text-sm text-gray-400 font-serif">Qty: {sale.quantity}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">₦{sale.totalAmount.toLocaleString()}</p>
                        <p className="text-sm text-gray-400 font-serif">{sale.interestRate}% interest</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sale.status === 'Approved' ? 'bg-green-500 text-white' :
                        sale.status === 'Pending' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Credit Details', sale.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Approve Credit')}
                        >
                          Approve
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Payment Tracking')}
                        >
                          Track
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
              onClick={() => addNewRecord('Credit Application')}
            >
              💰 New Credit
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Credit Assessment')}
            >
              📊 Assessment
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Payment Collection')}
            >
              💳 Collect Payment
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Credit Analytics', 'Excel')}
            >
              📈 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default CreditSales;
