import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const QualityControl: React.FC = () => {
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

  const qualityChecks = [
    {
      id: 'QC-001',
      product: 'Premium Rice Seeds',
      batchNumber: 'BATCH-2024-001',
      supplier: 'National Seed Company',
      testDate: '2024-01-15',
      inspector: 'Dr. Sarah Johnson',
      germinationRate: 95,
      purity: 98,
      moisture: 12,
      status: 'Passed',
      certificate: 'QC-CERT-001'
    },
    {
      id: 'QC-002',
      product: 'NPK Fertilizer',
      batchNumber: 'BATCH-2024-002',
      supplier: 'Notore Chemical',
      testDate: '2024-01-14',
      inspector: 'Eng. Mike Wilson',
      germinationRate: 'N/A',
      purity: 99,
      moisture: 8,
      status: 'Passed',
      certificate: 'QC-CERT-002'
    },
    {
      id: 'QC-003',
      product: 'Herbicide Roundup',
      batchNumber: 'BATCH-2024-003',
      supplier: 'Bayer CropScience',
      testDate: '2024-01-13',
      inspector: 'Dr. Grace Okonkwo',
      germinationRate: 'N/A',
      purity: 97,
      moisture: 5,
      status: 'Failed',
      certificate: 'QC-CERT-003'
    }
  ];

  const qualityStats = [
    { label: 'Total Tests', value: '1,247', change: '+89', trend: 'up' },
    { label: 'Passed', value: '1,156', change: '+78', trend: 'up' },
    { label: 'Failed', value: '91', change: '+11', trend: 'up' },
    { label: 'Pass Rate', value: '92.7%', change: '+1.2%', trend: 'up' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Quality Control</h1>
            <p className="text-gray-400 font-serif mt-2">Monitor product quality and compliance standards</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Quality Control Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Quality Test')}
            >
              ➕ New Test
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {qualityStats.map((stat, index) => (
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
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quality Test Results</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Test ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Product</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Batch</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Supplier</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Test Results</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {qualityChecks.map((check) => (
                  <tr key={check.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{check.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{check.product}</p>
                        <p className="text-sm text-gray-400 font-serif">Inspector: {check.inspector}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{check.batchNumber}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{check.supplier}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {check.germinationRate !== 'N/A' && (
                          <p className="text-gray-300 font-serif">Germination: {check.germinationRate}%</p>
                        )}
                        <p className="text-gray-300 font-serif">Purity: {check.purity}%</p>
                        <p className="text-gray-300 font-serif">Moisture: {check.moisture}%</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        check.status === 'Passed' ? 'bg-green-500 text-white' :
                        check.status === 'Failed' ? 'bg-red-500 text-white' :
                        'bg-yellow-500 text-white'
                      }`}>
                        {check.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Quality Test Details', check.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Download Certificate')}
                        >
                          Certificate
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Retest Product')}
                        >
                          Retest
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
              onClick={() => addNewRecord('Quality Test')}
            >
              ✅ New Test
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Supplier Audit')}
            >
              🔍 Supplier Audit
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Certificate Generation')}
            >
              📜 Certificates
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Quality Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default QualityControl;
