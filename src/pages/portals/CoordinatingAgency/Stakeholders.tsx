import React, { useState, useMemo } from 'react';
import PortalLayout from '../../../components/PortalLayout';

const Stakeholders: React.FC = () => {
  const sidebarItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: '🏠', 
      href: '/portal/coordinating-agency',
      hasDropdown: true,
      dropdownItems: [
        { id: 'activities', name: 'Activities', icon: '⚡', href: '/portal/coordinating-agency/activities' },
        { id: 'fund-schemes', name: 'Fund Schemes', icon: '💼', href: '/portal/coordinating-agency/fund-schemes' },
        { id: 'reportings', name: 'Reports', icon: '📑', href: '/portal/coordinating-agency/reportings' },
        { id: 'trainings', name: 'Trainings', icon: '📚', href: '/portal/coordinating-agency/trainings' }
      ]
    },
    { 
      id: 'state-monitoring', 
      name: 'State Monitoring Team', 
      icon: '🗺️', 
      href: '/portal/coordinating-agency/monitoring/state'
    },
    { 
      id: 'applicants', 
      name: 'Applicants', 
      icon: '📝', 
      href: '/portal/coordinating-agency/applicants',
      hasDropdown: true,
      dropdownItems: [
        { id: 'fund-provider', name: 'Fund Provider', icon: '💼', href: '/portal/coordinating-agency/applicants/fund-provider' },
        { id: 'pfis', name: 'PFIs', icon: '🏦', href: '/portal/coordinating-agency/applicants/pfis' },
        { id: 'insurance-companies', name: 'Insurance Companies', icon: '🛡️', href: '/portal/coordinating-agency/applicants/insurance-companies' },
        { 
          id: 'fund-beneficiaries', 
          name: 'Fund Beneficiaries', 
          icon: '👥', 
          href: '/portal/coordinating-agency/fund-beneficiaries',
          hasDropdown: true,
          dropdownItems: [
            { id: 'lead-firms', name: 'Lead Firms', icon: '🏢', href: '/portal/coordinating-agency/fund-beneficiaries/lead-firms' },
            { id: 'anchors', name: 'Anchors', icon: '⚓', href: '/portal/coordinating-agency/fund-beneficiaries/anchors' },
            { id: 'cooperative-groups', name: 'Cooperative Groups', icon: '🤝', href: '/portal/coordinating-agency/fund-beneficiaries/cooperative-groups' },
            { id: 'producers-farmers', name: 'Producers/Farmers', icon: '🌾', href: '/portal/coordinating-agency/fund-beneficiaries/producers-farmers' }
          ]
        }
      ]
    },
    { 
      id: 'stakeholders', 
      name: 'Department', 
      icon: '🤝', 
      href: '/portal/coordinating-agency/stakeholders',
      hasDropdown: true,
      dropdownItems: [
        { id: 'fund-management', name: 'Fund Management Department', icon: '💼', href: '/portal/coordinating-agency/stakeholders/fund-management' },
        { id: 'credit-risk', name: 'Agricultural Credit Risk Management Department', icon: '📊', href: '/portal/coordinating-agency/stakeholders/credit-risk' },
        { id: 'insurance', name: 'Agricultural Insurance Management Department', icon: '🛡️', href: '/portal/coordinating-agency/stakeholders/insurance' },
        { id: 'finance', name: 'Finance and Accounting Department', icon: '🪙', href: '/portal/coordinating-agency/stakeholders/finance' },
        { id: 'legal', name: 'Legal Department', icon: '⚖️', href: '/portal/coordinating-agency/stakeholders/legal' },
        { id: 'it', name: 'IT Department', icon: '💻', href: '/portal/coordinating-agency/stakeholders/it' },
        { id: 'training', name: 'Training Department', icon: '📚', href: '/portal/coordinating-agency/stakeholders/training' }
      ]
    },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/coordinating-agency/settings' }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Comprehensive schemes data
  const schemes = [
    { id: 'SCH001', name: 'Rice Production Scheme', fundProvider: 'CBN Agricultural Finance', pfi: 'First Bank Agric', anchor: 'Olam Nigeria', producer: 'Kebbi Rice Farmers Coop', insurance: 'AIICO Insurance', amount: '₦125M', status: 'Pending Approval' },
    { id: 'SCH002', name: 'Cassava Value Chain', fundProvider: 'BOA Nigeria', pfi: 'Access Bank Agric', anchor: 'Nestlé Nigeria', producer: 'Benue Cassava Farmers', insurance: 'NAIC', amount: '₦85M', status: 'Approved' },
    { id: 'SCH003', name: 'Maize Outgrower Scheme', fundProvider: 'NIRSAL Microfinance', pfi: 'Sterling Bank Agric', anchor: 'Flour Mills Nigeria', producer: 'Kaduna Maize Growers', insurance: 'Leadway Assurance', amount: '₦95M', status: 'Pending Approval' },
    { id: 'SCH004', name: 'Poultry Production', fundProvider: 'CBN Anchor Borrowers', pfi: 'Zenith Bank Agric', anchor: 'CHI Farms', producer: 'Ogun Poultry Farmers', insurance: 'Custodian Insurance', amount: '₦150M', status: 'Disapproved' },
    { id: 'SCH005', name: 'Tomato Processing Scheme', fundProvider: 'BOI Agric Fund', pfi: 'UBA Agric Finance', anchor: 'Dangote Tomato', producer: 'Kano Tomato Farmers', insurance: 'Cornerstone Insurance', amount: '₦200M', status: 'Approved' },
    { id: 'SCH006', name: 'Soybean Production', fundProvider: 'AFCF Fund Provider', pfi: 'GTBank Agric', anchor: 'Grand Cereals', producer: 'Niger State Soy Farmers', insurance: 'AXA Mansard', amount: '₦110M', status: 'Pending Approval' },
    { id: 'SCH007', name: 'Fish Farming Scheme', fundProvider: 'CBN Agricultural Finance', pfi: 'Fidelity Bank Agric', anchor: 'Chi Limited', producer: 'Lagos Fish Farmers Coop', insurance: 'AIICO Insurance', amount: '₦75M', status: 'Approved' },
    { id: 'SCH008', name: 'Cocoa Export Scheme', fundProvider: 'NIRSAL Plc', pfi: 'Stanbic IBTC Agric', anchor: 'Cadbury Nigeria', producer: 'Ondo Cocoa Farmers', insurance: 'NAIC', amount: '₦180M', status: 'Pending Approval' },
    { id: 'SCH009', name: 'Oil Palm Production', fundProvider: 'BOA Nigeria', pfi: 'Ecobank Agric', anchor: 'PZ Wilmar', producer: 'Cross River Palm Growers', insurance: 'Leadway Assurance', amount: '₦220M', status: 'Approved' },
    { id: 'SCH010', name: 'Groundnut Value Chain', fundProvider: 'CBN Anchor Borrowers', pfi: 'Wema Bank Agric', anchor: 'Grand Cereals', producer: 'Katsina Groundnut Farmers', insurance: 'Custodian Insurance', amount: '₦90M', status: 'Disapproved' },
    { id: 'SCH011', name: 'Yam Production Scheme', fundProvider: 'AFCF Fund Provider', pfi: 'Union Bank Agric', anchor: 'Shoprite Farms', producer: 'Benue Yam Farmers', insurance: 'Cornerstone Insurance', amount: '₦65M', status: 'Pending Approval' },
    { id: 'SCH012', name: 'Cotton Ginning Scheme', fundProvider: 'BOI Agric Fund', pfi: 'First Bank Agric', anchor: 'Dangote Cotton', producer: 'Zamfara Cotton Growers', insurance: 'AXA Mansard', amount: '₦140M', status: 'Approved' },
    { id: 'SCH013', name: 'Dairy Production', fundProvider: 'CBN Agricultural Finance', pfi: 'Access Bank Agric', anchor: 'FrieslandCampina', producer: 'Plateau Dairy Farmers', insurance: 'AIICO Insurance', amount: '₦105M', status: 'Pending Approval' },
    { id: 'SCH014', name: 'Ginger Export Scheme', fundProvider: 'NIRSAL Microfinance', pfi: 'Sterling Bank Agric', anchor: 'Export Trading Group', producer: 'Kaduna Ginger Farmers', insurance: 'NAIC', amount: '₦80M', status: 'Approved' },
    { id: 'SCH015', name: 'Wheat Production', fundProvider: 'BOA Nigeria', pfi: 'Zenith Bank Agric', anchor: 'Flour Mills Nigeria', producer: 'Kano Wheat Growers', insurance: 'Leadway Assurance', amount: '₦130M', status: 'Pending Approval' },
    { id: 'SCH016', name: 'Sesame Seed Scheme', fundProvider: 'CBN Anchor Borrowers', pfi: 'UBA Agric Finance', anchor: 'Olam Nigeria', producer: 'Benue Sesame Farmers', insurance: 'Custodian Insurance', amount: '₦70M', status: 'Disapproved' },
    { id: 'SCH017', name: 'Cashew Processing', fundProvider: 'AFCF Fund Provider', pfi: 'GTBank Agric', anchor: 'Tropical General', producer: 'Kogi Cashew Farmers', insurance: 'Cornerstone Insurance', amount: '₦115M', status: 'Approved' },
    { id: 'SCH018', name: 'Shrimp Aquaculture', fundProvider: 'BOI Agric Fund', pfi: 'Fidelity Bank Agric', anchor: 'Seafood International', producer: 'Delta Shrimp Farmers', insurance: 'AXA Mansard', amount: '₦95M', status: 'Pending Approval' },
    { id: 'SCH019', name: 'Banana Plantation', fundProvider: 'CBN Agricultural Finance', pfi: 'Stanbic IBTC Agric', anchor: 'Dole Foods', producer: 'Ogun Banana Growers', insurance: 'AIICO Insurance', amount: '₦85M', status: 'Approved' },
    { id: 'SCH020', name: 'Sunflower Production', fundProvider: 'NIRSAL Plc', pfi: 'Ecobank Agric', anchor: 'Grand Cereals', producer: 'Taraba Sunflower Farmers', insurance: 'NAIC', amount: '₦100M', status: 'Pending Approval' }
  ];

  const [schemeStatuses, setSchemeStatuses] = useState<{ [key: string]: string }>(
    schemes.reduce((acc, scheme) => ({ ...acc, [scheme.id]: scheme.status }), {})
  );

  const handleApprove = (schemeId: string) => {
    setSchemeStatuses(prev => ({ ...prev, [schemeId]: 'Approved' }));
  };

  const handleDisapprove = (schemeId: string) => {
    setSchemeStatuses(prev => ({ ...prev, [schemeId]: 'Disapproved' }));
  };

  const filteredSchemes = useMemo(() => {
    return schemes.filter(scheme =>
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.fundProvider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.pfi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.anchor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const paginatedSchemes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSchemes.slice(start, start + itemsPerPage);
  }, [filteredSchemes, currentPage]);

  const totalPages = Math.ceil(filteredSchemes.length / itemsPerPage);

  const stats = [
    { 
      title: 'Total Schemes', 
      value: schemes.length.toString(), 
      icon: '📊' 
    },
    { 
      title: 'Pending Approval', 
      value: Object.values(schemeStatuses).filter(s => s === 'Pending Approval').length.toString(), 
      icon: '⏳' 
    },
    { 
      title: 'Approved', 
      value: Object.values(schemeStatuses).filter(s => s === 'Approved').length.toString(), 
      icon: '✅' 
    },
    { 
      title: 'Disapproved', 
      value: Object.values(schemeStatuses).filter(s => s === 'Disapproved').length.toString(), 
      icon: '❌' 
    }
  ];

  return (
    <PortalLayout role="Coordinating Agency" roleIcon="🏛️" sidebarItems={sidebarItems}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold font-sans text-gray-100 mb-2">
            Stakeholder Schemes
          </h1>
          <p className="text-gray-400 font-serif">
            Review and approve schemes involving fund providers, PFIs, anchors, producers, and insurance providers
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-serif">{stat.title}</p>
                  <p className="text-2xl font-bold font-sans text-gray-100 mt-1">{stat.value}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Schemes Table */}
        <div className="bg-primary-800 rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold font-sans text-gray-100">All Schemes</h2>
            <div className="relative w-full sm:w-auto">
              <input
                value={searchTerm}
                onChange={(e) => { setCurrentPage(1); setSearchTerm(e.target.value); }}
                placeholder="Search schemes..."
                className="w-full sm:w-64 px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                🔍
              </button>
            </div>
          </div>

          {/* Schemes List */}
          <div className="space-y-4 mb-6">
            {paginatedSchemes.map((scheme) => {
              const currentStatus = schemeStatuses[scheme.id];
              return (
                <div key={scheme.id} className="bg-primary-700 rounded-lg p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold font-sans text-gray-100">{scheme.name}</h3>
                          <p className="text-sm text-gray-400 font-serif">ID: {scheme.id}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          currentStatus === 'Approved' ? 'bg-green-500 text-white' :
                          currentStatus === 'Disapproved' ? 'bg-red-500 text-white' :
                          'bg-yellow-500 text-gray-900'
                        }`}>
                          {currentStatus}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-300 font-serif">
                        <div>
                          <span className="text-gray-500">Fund Provider:</span>
                          <p className="font-medium">{scheme.fundProvider}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">PFI:</span>
                          <p className="font-medium">{scheme.pfi}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Anchor:</span>
                          <p className="font-medium">{scheme.anchor}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Producer:</span>
                          <p className="font-medium">{scheme.producer}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Insurance:</span>
                          <p className="font-medium">{scheme.insurance}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Amount:</span>
                          <p className="font-medium text-accent-400">{scheme.amount}</p>
                        </div>
                      </div>
                    </div>
                    {currentStatus === 'Pending Approval' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(scheme.id)}
                          className="btn-primary text-sm whitespace-nowrap"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleDisapprove(scheme.id)}
                          className="btn-secondary text-sm whitespace-nowrap"
                        >
                          ❌ Disapprove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination - Always at bottom */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-4 border-t border-primary-600">
              <button 
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} 
                disabled={currentPage === 1}
                className="btn-secondary text-sm p-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              <span className="text-gray-300 text-sm font-sans">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} 
                disabled={currentPage === totalPages}
                className="btn-secondary text-sm p-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-gray-400 font-serif opacity-80">
          Powered by Mc. George
        </div>
      </div>
    </PortalLayout>
  );
};

export default Stakeholders;

