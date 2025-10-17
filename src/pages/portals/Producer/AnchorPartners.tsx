import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { addNewRecord, processAction, viewDetails, contactPerson } from '../../../utils/quickActions';

const AnchorPartners: React.FC = () => {
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

  const anchorStats = [
    { title: 'Active Contracts', value: '3', change: '+1', icon: '📋' },
    { title: 'Total Volume', value: '35 Tons', change: '+5 Tons', icon: '📦' },
    { title: 'Expected Revenue', value: '₦980K', change: '+₦120K', icon: '💰' },
    { title: 'Quality Score', value: '9.2/10', change: '+0.3', icon: '⭐' }
  ];

  const activeContracts = [
    {
      contractId: 'CNT-2024-001',
      anchorCompany: 'Dangote Farms Ltd',
      cropType: 'Maize',
      quantity: '20 Tons',
      pricePerTon: '₦28,000',
      totalValue: '₦560,000',
      contractDate: '2024-01-15',
      deliveryDate: '2024-06-15',
      status: 'Active',
      qualityRequirements: 'Grade A, Moisture < 14%',
      paymentTerms: 'Net 30 days',
      deliveryLocation: 'Dangote Farms, Kano',
      contactPerson: 'Mr. Ahmed Dangote',
      phone: '+234 803 123 4567',
      email: 'ahmed.dangote@dangote.com',
      bankDetails: 'First Bank - 1234567890',
      insuranceCoverage: 'Full Coverage',
      extensionSupport: 'Mr. Ibrahim Musa'
    },
    {
      contractId: 'CNT-2024-002',
      anchorCompany: 'Olam Nigeria',
      cropType: 'Rice',
      quantity: '15 Tons',
      pricePerTon: '₦32,000',
      totalValue: '₦480,000',
      contractDate: '2024-01-20',
      deliveryDate: '2024-07-20',
      status: 'Active',
      qualityRequirements: 'Premium Grade, Purity > 95%',
      paymentTerms: 'Net 15 days',
      deliveryLocation: 'Olam Processing Plant, Lagos',
      contactPerson: 'Mrs. Sarah Johnson',
      phone: '+234 802 987 6543',
      email: 'sarah.johnson@olam.com',
      bankDetails: 'Zenith Bank - 0987654321',
      insuranceCoverage: 'Full Coverage',
      extensionSupport: 'Mrs. Fatima Ahmed'
    }
  ];

  const availableAnchors = [
    {
      company: 'Flour Mills Nigeria',
      crops: ['Wheat', 'Maize'],
      priceRange: '₦25,000 - ₦28,000/Ton',
      contractType: 'Seasonal',
      paymentTerms: 'Net 30 days',
      qualityStandards: 'High Grade',
      deliveryRegions: ['North Central', 'South West'],
      contactPerson: 'Mr. David Okafor',
      phone: '+234 805 321 0987',
      specialOffers: 'Premium rates for quality produce'
    },
    {
      company: 'Fresh Direct Nigeria',
      crops: ['Vegetables', 'Fruits'],
      priceRange: '₦35,000 - ₦45,000/Ton',
      contractType: 'Monthly',
      paymentTerms: 'Net 7 days',
      qualityStandards: 'Fresh Grade A',
      deliveryRegions: ['South West', 'South East'],
      contactPerson: 'Mrs. Grace Okonkwo',
      phone: '+234 807 654 3210',
      specialOffers: 'Quick payment for fresh produce'
    },
    {
      company: 'Nestle Nigeria',
      crops: ['Maize', 'Cassava', 'Soybeans'],
      priceRange: '₦30,000 - ₦35,000/Ton',
      contractType: 'Annual',
      paymentTerms: 'Net 21 days',
      qualityStandards: 'Food Grade',
      deliveryRegions: ['National'],
      contactPerson: 'Mr. Michael Adebayo',
      phone: '+234 801 234 5678',
      specialOffers: 'Long-term partnership benefits'
    }
  ];

  const deliverySchedule = [
    { date: '2024-02-15', crop: 'Maize', quantity: '5 Tons', destination: 'Dangote Farms, Kano', status: 'Scheduled' },
    { date: '2024-03-01', crop: 'Rice', quantity: '3 Tons', destination: 'Olam Plant, Lagos', status: 'Scheduled' },
    { date: '2024-04-15', crop: 'Maize', quantity: '8 Tons', destination: 'Dangote Farms, Kano', status: 'Scheduled' },
    { date: '2024-05-20', crop: 'Rice', quantity: '6 Tons', destination: 'Olam Plant, Lagos', status: 'Scheduled' }
  ];

  return (
    <PortalLayout role="Producer/Farmer" roleIcon="🌾" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Anchor Partners & Contracts</h1>
          <p className="text-gray-200 font-serif">
            Manage your supply contracts with anchor companies, track deliveries, and explore new partnership opportunities.
          </p>
        </div>

        {/* Anchor Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {anchorStats.map((stat, index) => (
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

        {/* Active Contracts */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Active Supply Contracts</h3>
          <div className="space-y-6">
            {activeContracts.map((contract, index) => (
              <div key={index} className="p-4 bg-primary-700 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold font-sans text-gray-100">{contract.contractId}</h4>
                    <p className="text-sm text-gray-300 font-serif">{contract.anchorCompany}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    contract.status === 'Active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                  }`}>
                    {contract.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 font-serif text-sm">Crop & Quantity</p>
                    <p className="font-semibold font-sans text-gray-100">{contract.cropType} • {contract.quantity}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-serif text-sm">Price & Total Value</p>
                    <p className="font-semibold font-sans text-gray-100">{contract.pricePerTon} • {contract.totalValue}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-serif text-sm">Delivery Date</p>
                    <p className="font-semibold font-sans text-gray-100">{contract.deliveryDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 font-serif text-sm">Quality Requirements</p>
                    <p className="text-gray-100 font-sans text-sm">{contract.qualityRequirements}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-serif text-sm">Payment Terms</p>
                    <p className="text-gray-100 font-sans text-sm">{contract.paymentTerms}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-primary-600">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 font-serif">Contact Person</p>
                      <p className="text-gray-100 font-sans">{contract.contactPerson}</p>
                      <p className="text-gray-300 font-serif">{contract.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-serif">Delivery Location</p>
                      <p className="text-gray-100 font-sans">{contract.deliveryLocation}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-serif">Extension Support</p>
                      <p className="text-gray-100 font-sans">{contract.extensionSupport}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button className="btn-primary text-sm">
                    📋 View Full Contract
                  </button>
                  <button className="btn-secondary text-sm">
                    📞 Contact Anchor
                  </button>
                  <button className="btn-secondary text-sm">
                    📊 Track Delivery
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Anchor Partners */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Available Anchor Partners</h3>
            <div className="space-y-4">
              {availableAnchors.map((anchor, index) => (
                <div key={index} className="p-4 bg-primary-700 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold font-sans text-gray-100">{anchor.company}</h4>
                    <span className="text-sm text-accent-400 font-sans">{anchor.contractType}</span>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-serif">Crops:</span>
                      <span className="text-gray-100 font-sans">{anchor.crops.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-serif">Price Range:</span>
                      <span className="text-gray-100 font-sans">{anchor.priceRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-serif">Payment Terms:</span>
                      <span className="text-gray-100 font-sans">{anchor.paymentTerms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-serif">Regions:</span>
                      <span className="text-gray-100 font-sans">{anchor.deliveryRegions.join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-primary-600">
                    <p className="text-xs text-gray-400 font-serif mb-1">Special Offers:</p>
                    <p className="text-sm text-accent-400 font-sans">{anchor.specialOffers}</p>
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    <button className="btn-primary text-sm flex-1">
                      📋 Request Contract
                    </button>
                    <button className="btn-secondary text-sm">
                      📞 Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Schedule */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Delivery Schedule</h3>
            <div className="space-y-3">
              {deliverySchedule.map((delivery, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                  <div>
                    <p className="font-medium font-sans text-gray-100">{delivery.crop} • {delivery.quantity}</p>
                    <p className="text-sm text-gray-300 font-serif">{delivery.destination}</p>
                    <p className="text-xs text-gray-400 font-serif">{delivery.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    delivery.status === 'Scheduled' ? 'bg-blue-500 text-white' :
                    delivery.status === 'Delivered' ? 'bg-green-500 text-white' :
                    'bg-yellow-500 text-white'
                  }`}>
                    {delivery.status}
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
              onClick={() => addNewRecord('Supply Contract Request')}
            >
              📋 New Contract Request
            </button>
            <button 
              className="btn-secondary"
              onClick={() => viewDetails('Contract History', 'ALL')}
            >
              📊 Contract History
            </button>
            <button 
              className="btn-secondary"
              onClick={() => contactPerson('Anchor Partners', 'Multiple contacts available', 'anchors@afcf.com')}
            >
              📞 Contact Anchors
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Market Price Update')}
            >
              📈 Market Prices
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default AnchorPartners;
