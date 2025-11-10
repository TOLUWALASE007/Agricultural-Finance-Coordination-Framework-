import React, { useMemo, useState } from 'react';
import PortalLayout from '../../components/PortalLayout';

const ProducerPortal: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/producer' },
    { id: 'scheme-application', name: 'Schemes Application', icon: '📝', href: '/portal/producer/scheme-application' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/producer/settings' }
  ];

  const stats = [
    { title: 'Active Loans', value: '₦2.4M', change: '+₦800K', icon: '💼' },
    { title: 'Crop Insurance', value: '₦150K', change: 'Covered', icon: '🛡️' },
    { title: 'Yield This Season', value: '45 Tons', change: '+12%', icon: '🌾' },
    { title: 'Market Price', value: '₦28K/Ton', change: '+5%', icon: '📈' }
  ];

  const recentActivities = useMemo(() => ([
    { id: 'SCHEME-001', type: 'Scheme', description: '₦50M Climate Smart Agriculture Scheme', time: '2 hours ago', status: 'performing', startDate: '2024-01-15', endDate: '2024-12-31', details: 'This scheme focuses on promoting climate-resilient agricultural practices among smallholder farmers. It includes training programs, seed distribution, and access to modern irrigation systems. The scheme targets 5,000 farmers across 10 states and aims to improve crop yields by 30% while reducing water usage by 25%.' },
    { id: 'SCHEME-002', type: 'Scheme', description: '₦25M Anchor Company Partnership Scheme', time: '3 days ago', status: 'performing', startDate: '2024-02-01', endDate: '2024-11-30', details: 'A partnership program linking smallholder farmers with established anchor companies for guaranteed market access. This scheme provides farmers with technical support, quality inputs, and assured pricing. Over 200 anchor companies are participating, benefiting approximately 3,000 farmers nationwide.' },
    { id: 'SCHEME-003', type: 'Scheme', description: '₦120M Youth Agriculture Fund Scheme', time: '5 hours ago', status: 'performing', startDate: '2024-01-10', endDate: '2025-01-09', details: 'Designed to engage young people aged 18-35 in sustainable agriculture. The scheme provides start-up capital, mentorship, and access to modern farming technologies. It includes special incentives for agri-tech innovations and digital farming solutions. Expected to create 1,500 jobs and support 800 youth-led agribusinesses.' },
    { id: 'SCHEME-004', type: 'Scheme', description: '₦8M Women Farmers Association Scheme', time: '8 hours ago', status: 'non-performing', startDate: '2024-03-01', endDate: '2024-12-31', details: 'Empowerment program specifically targeting women farmers and women-led agricultural cooperatives. The scheme provides soft loans, training in financial management, and market linkage support. Currently facing challenges with repayment rates due to seasonal income fluctuations.' },
    { id: 'SCHEME-005', type: 'Scheme', description: '₦12M Approved Scheme Tranche', time: '1 day ago', status: 'performing', startDate: '2024-04-01', endDate: '2024-10-31', details: 'Second tranche release for the approved agricultural development program. This tranche focuses on equipment procurement and infrastructure development. All milestones from the first tranche have been met, leading to timely approval and disbursement.' },
    { id: 'SCHEME-006', type: 'Scheme', description: '₦3.5M Youth Agri Group Scheme', time: '2 days ago', status: 'non-performing', startDate: '2024-02-15', endDate: '2024-11-15', details: 'Small-scale funding for youth agricultural groups focusing on vegetable production. The scheme provides input financing and technical support. Currently experiencing delays in implementation due to coordination challenges among group members.' },
    { id: 'SCHEME-007', type: 'Scheme', description: '₦200M Tech Innovation Fund Scheme', time: '2 days ago', status: 'performing', startDate: '2024-01-05', endDate: '2025-06-30', details: 'Major innovation fund supporting agricultural technology startups and research institutions. The scheme funds projects in precision farming, farm management software, IoT applications, and AI-driven crop monitoring. Already showing strong results with 15 active projects and 3 successful product launches.' },
    { id: 'SCHEME-008', type: 'Scheme', description: '₦1.2M Scheme Adjustment Request', time: '3 days ago', status: 'bad schemes', startDate: '2023-11-01', endDate: '2024-08-31', details: 'This scheme has been flagged for review due to significant deviations from the original plan. Multiple adjustment requests have been made, indicating poor initial planning or changing circumstances. Recovery rates have dropped below acceptable thresholds, requiring intervention and restructuring.' },
    { id: 'SCHEME-009', type: 'Scheme', description: '₦75M Agro Processing Initiative', time: '4 days ago', status: 'performing', startDate: '2024-01-20', endDate: '2024-12-20', details: 'Initiative to support agro-processing businesses with modern equipment and capacity building. The scheme targets processors of cassava, rice, maize, and oil palm. It includes grants for machinery, training in food safety standards, and market access facilitation.' },
    { id: 'SCHEME-010', type: 'Scheme', description: '₦9.8M Cassava Growers Union Scheme', time: '5 days ago', status: 'non-performing', startDate: '2024-03-10', endDate: '2024-11-10', details: 'Funding scheme for cassava growers union with focus on improving yield and processing capacity. The scheme faces challenges with delayed repayments and lower-than-expected adoption rates. Regular monitoring and support visits are being conducted to improve performance.' },
    { id: 'SCHEME-011', type: 'Scheme', description: '₦6.4M Women Farmer Fund Scheme', time: '6 days ago', status: 'bad schemes', startDate: '2023-09-01', endDate: '2024-07-31', details: 'This scheme has been classified as bad due to extremely high default rates and evidence of mismanagement. Multiple attempts at restructuring have failed. The scheme is now under review for potential write-off and lessons learned documentation.' },
    { id: 'SCHEME-012', type: 'Scheme', description: '₦4.2M Rice Cooperative Scheme', time: '7 days ago', status: 'performing', startDate: '2024-02-20', endDate: '2024-11-20', details: 'Support program for rice farming cooperatives, providing access to improved seeds, fertilizers, and post-harvest equipment. The scheme includes training in cooperative management and collective marketing strategies. All cooperatives are meeting their repayment obligations on time.' },
    { id: 'SCHEME-013', type: 'Scheme', description: '₦30M Agri-Tech Pilot Program', time: '1 week ago', status: 'performing', startDate: '2024-01-08', endDate: '2024-12-08', details: 'Pilot program testing innovative agricultural technologies across 50 demonstration farms. Technologies include drone-based crop monitoring, automated irrigation systems, and soil health sensors. Initial results show 40% improvement in resource efficiency and positive farmer feedback.' },
    { id: 'SCHEME-014', type: 'Scheme', description: '₦15M Livestock Development Scheme', time: '1 week ago', status: 'non-performing', startDate: '2024-02-25', endDate: '2024-11-25', details: 'Livestock development program supporting cattle, goat, and poultry farmers. The scheme provides veterinary services, feed subsidies, and breeding stock. Currently experiencing delays in service delivery and some farmers reporting challenges with feed quality and availability.' },
    { id: 'SCHEME-015', type: 'Scheme', description: '₦22M Irrigation Infrastructure Scheme', time: '2 weeks ago', status: 'bad schemes', startDate: '2023-08-15', endDate: '2024-06-15', details: 'Infrastructure development scheme that has been classified as bad due to project abandonment and contractor disputes. The irrigation infrastructure was never completed, leaving farmers without the promised support. Recovery efforts are ongoing but prospects are limited.' }
  ]), []);

  // Past schemes data
  const pastSchemes = useMemo(() => ([
    { id: 'PAST-001', type: 'Scheme', description: '₦45M Smallholder Farmer Support Scheme', time: '3 months ago', startDate: '2023-01-15', endDate: '2023-12-31', details: 'Completed scheme that successfully supported 4,200 smallholder farmers across 8 states. The scheme provided access to improved seeds, fertilizers, and extension services. Final recovery rate was 94%, exceeding the target of 90%.' },
    { id: 'PAST-002', type: 'Scheme', description: '₦18M Cooperative Development Program', time: '4 months ago', startDate: '2023-02-01', endDate: '2023-11-30', details: 'Program focused on strengthening agricultural cooperatives through capacity building and financial support. Successfully established 120 new cooperatives and trained over 2,000 members in cooperative management and modern farming techniques.' },
    { id: 'PAST-003', type: 'Scheme', description: '₦95M Market Linkage Initiative', time: '5 months ago', startDate: '2023-01-10', endDate: '2023-10-09', details: 'Initiative that connected farmers directly with buyers, eliminating middlemen and improving profit margins. The scheme facilitated over 1,500 direct contracts and improved farmer incomes by an average of 35%. All repayments were completed on schedule.' },
    { id: 'PAST-004', type: 'Scheme', description: '₦12M Post-Harvest Loss Reduction', time: '6 months ago', startDate: '2023-03-01', endDate: '2023-09-30', details: 'Scheme providing farmers with post-harvest storage facilities and training in preservation techniques. Reduced post-harvest losses from 25% to 12% among participating farmers. The scheme achieved its targets and was completed successfully.' },
    { id: 'PAST-005', type: 'Scheme', description: '₦35M Organic Farming Promotion', time: '7 months ago', startDate: '2022-12-01', endDate: '2023-08-31', details: 'Promotion of organic farming practices among farmers interested in sustainable agriculture. The scheme provided certification support, training, and market access for organic produce. Over 800 farmers transitioned to organic farming methods.' },
    { id: 'PAST-006', type: 'Scheme', description: '₦28M Livestock Feed Subsidy Program', time: '8 months ago', startDate: '2022-11-15', endDate: '2023-07-15', details: 'Program that subsidized livestock feed costs for small-scale livestock farmers. The scheme supported 1,200 farmers and helped maintain livestock productivity during periods of high feed prices. Recovery rate was 91%.' },
    { id: 'PAST-007', type: 'Scheme', description: '₦60M Mechanization Support Scheme', time: '9 months ago', startDate: '2022-10-05', endDate: '2023-06-05', details: 'Scheme providing access to farm machinery through rental services and cooperative ownership models. Successfully mechanized operations on over 15,000 hectares of farmland, significantly improving efficiency and reducing labor costs.' },
    { id: 'PAST-008', type: 'Scheme', description: '₦8M Seed Multiplication Program', time: '10 months ago', startDate: '2022-09-01', endDate: '2023-05-31', details: 'Program supporting local seed production and multiplication to reduce dependency on imported seeds. Established 50 seed multiplication centers and trained 300 seed producers. Program completed successfully with all targets met.' },
    { id: 'PAST-009', type: 'Scheme', description: '₦22M Fisheries Development Scheme', time: '11 months ago', startDate: '2022-08-20', endDate: '2023-04-20', details: 'Development program for small-scale fish farmers, providing fingerlings, feed, and technical support. The scheme supported 450 fish farmers and established 120 fish ponds. Recovery rate was 88%.' },
    { id: 'PAST-010', type: 'Scheme', description: '₦15M Rural Women Empowerment', time: '1 year ago', startDate: '2022-07-10', endDate: '2023-03-10', details: 'Empowerment scheme specifically targeting rural women in agriculture. Provided training, financial support, and market linkages. Over 600 women participated, with 85% reporting improved household income and food security.' }
  ]), []);

  // Recent activities search and pagination
  const [activitySearch, setActivitySearch] = useState('');
  const [activityPage, setActivityPage] = useState(1);
  const activityPageSize = 3;
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [showForwardModal, setShowForwardModal] = useState(false);

  // Past schemes search and pagination
  const [pastSearch, setPastSearch] = useState('');
  const [pastPage, setPastPage] = useState(1);
  const pastPageSize = 3;

  const filteredActivities = useMemo(() => {
    const q = activitySearch.trim().toLowerCase();
    if (!q) return recentActivities;
    return recentActivities.filter(a =>
      a.type.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.time.toLowerCase().includes(q)
    );
  }, [activitySearch, recentActivities]);

  const totalActivityPages = Math.max(1, Math.ceil(filteredActivities.length / activityPageSize));
  const currentActivityPage = Math.min(activityPage, totalActivityPages);
  const startIndex = (currentActivityPage - 1) * activityPageSize;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + activityPageSize);

  const filteredPastSchemes = useMemo(() => {
    const q = pastSearch.trim().toLowerCase();
    if (!q) return pastSchemes;
    return pastSchemes.filter(s =>
      s.type.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.time.toLowerCase().includes(q)
    );
  }, [pastSearch, pastSchemes]);

  const totalPastPages = Math.max(1, Math.ceil(filteredPastSchemes.length / pastPageSize));
  const currentPastPage = Math.min(pastPage, totalPastPages);
  const pastStartIndex = (currentPastPage - 1) * pastPageSize;
  const paginatedPastSchemes = filteredPastSchemes.slice(pastStartIndex, pastStartIndex + pastPageSize);

  return (
    <PortalLayout role="Producer/Farmer" roleIcon="🌾" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Welcome to Producer Portal</h1>
          <p className="text-gray-200 font-serif">
            Manage your agricultural loans, track crop insurance, connect with anchor partners, and access farming resources.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
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

        <div className="grid grid-cols-1 gap-6">
          {/* Active Schemes */}
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <h3 className="text-lg font-semibold font-sans text-gray-100">Active Schemes</h3>
              <div className="relative w-full sm:w-auto">
                <input
                  value={activitySearch}
                  onChange={(e) => { setActivityPage(1); setActivitySearch(e.target.value); }}
                  placeholder="Search schemes..."
                  className="w-full sm:w-64 px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  🔍
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {paginatedActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-primary-700 rounded-lg">
                  <div className="w-2 h-2 bg-accent-500 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium font-sans text-gray-100">{activity.type}</p>
                    <p className="text-sm text-gray-300 font-serif">{activity.description}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <p className="text-xs text-gray-400 font-serif">
                        <span className="font-medium">Start:</span> {new Date(activity.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      activity.status === 'performing' ? 'bg-green-500 text-white' :
                      activity.status === 'non-performing' ? 'bg-yellow-500 text-white' :
                      activity.status === 'bad schemes' ? 'bg-red-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {activity.status}
                    </span>
                    <button
                      onClick={() => setSelectedScheme(activity)}
                      className="px-3 py-1 text-xs bg-accent-500 hover:bg-accent-600 text-white rounded-md font-medium whitespace-nowrap"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
              {paginatedActivities.length === 0 && (
                <div className="text-sm text-gray-400 font-serif">No activities found.</div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center mt-4 gap-3">
              <button
                onClick={() => setActivityPage(p => Math.max(1, p - 1))}
                className="px-3 py-2 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md border border-primary-600"
                aria-label="Previous page"
              >
                ←
              </button>
              <div className="text-sm text-gray-300 font-sans">
                Page <span className="font-semibold">{currentActivityPage}</span> of <span className="font-semibold">{totalActivityPages}</span>
              </div>
              <button
                onClick={() => setActivityPage(p => Math.min(totalActivityPages, p + 1))}
                className="px-3 py-2 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md border border-primary-600"
                aria-label="Next page"
              >
                →
              </button>
            </div>
          </div>

          {/* Past Schemes */}
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <h3 className="text-lg font-semibold font-sans text-gray-100">Past Schemes</h3>
              <div className="relative w-full sm:w-auto">
                <input
                  value={pastSearch}
                  onChange={(e) => { setPastPage(1); setPastSearch(e.target.value); }}
                  placeholder="Search past schemes..."
                  className="w-full sm:w-64 px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  🔍
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {paginatedPastSchemes.map((scheme, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-primary-700 rounded-lg">
                  <div className="w-2 h-2 bg-accent-500 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium font-sans text-gray-100">{scheme.type}</p>
                    <p className="text-sm text-gray-300 font-serif">{scheme.description}</p>
                    <div className="flex flex-wrap gap-2 mt-1 mb-1">
                      <p className="text-xs text-gray-400 font-serif">
                        <span className="font-medium">Start:</span> {new Date(scheme.startDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400 font-serif">
                        <span className="font-medium">End:</span> {new Date(scheme.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 font-serif">{scheme.time}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => setSelectedScheme(scheme)}
                      className="px-3 py-1 text-xs bg-accent-500 hover:bg-accent-600 text-white rounded-md font-medium whitespace-nowrap"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
              {paginatedPastSchemes.length === 0 && (
                <div className="text-sm text-gray-400 font-serif">No past schemes found.</div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center mt-4 gap-3">
              <button
                onClick={() => setPastPage(p => Math.max(1, p - 1))}
                className="px-3 py-2 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md border border-primary-600"
                aria-label="Previous page"
              >
                ←
              </button>
              <div className="text-sm text-gray-300 font-sans">
                Page <span className="font-semibold">{currentPastPage}</span> of <span className="font-semibold">{totalPastPages}</span>
              </div>
              <button
                onClick={() => setPastPage(p => Math.min(totalPastPages, p + 1))}
                className="px-3 py-2 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md border border-primary-600"
                aria-label="Next page"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Weather & Market Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Weather Forecast</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Today</span>
                <span className="text-accent-400 font-sans">☀️ 28°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Tomorrow</span>
                <span className="text-accent-400 font-sans">⛅ 26°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Next 3 days</span>
                <span className="text-accent-400 font-sans">🌧️ 24°C</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Market Prices</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Maize</span>
                <span className="text-accent-400 font-sans">₦28,000/Ton</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Rice</span>
                <span className="text-accent-400 font-sans">₦32,000/Ton</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Wheat</span>
                <span className="text-accent-400 font-sans">₦25,000/Ton</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="btn-primary">
              💼 Apply for Loan
            </button>
            <button className="btn-secondary">
              🛡️ Claim Insurance
            </button>
            <button className="btn-secondary">
              🌱 Order Inputs
            </button>
            <button className="btn-secondary">
              📊 View Market Prices
            </button>
          </div>
        </div>
        <div className="mt-2 text-center text-xs text-gray-400 font-serif opacity-80">
          Powered by Mc. George
        </div>
      </div>

      {/* Scheme Details Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-primary-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-primary-600">
            <div className="sticky top-0 bg-primary-800 border-b border-primary-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold font-sans text-gray-100">Scheme Details</h2>
              <button
                onClick={() => setSelectedScheme(null)}
                className="text-gray-400 hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-2">{selectedScheme.description}</h3>
                <div className="flex flex-wrap gap-4 mb-3">
                  {selectedScheme.status && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedScheme.status === 'performing' ? 'bg-green-500 text-white' :
                      selectedScheme.status === 'non-performing' ? 'bg-yellow-500 text-white' :
                      selectedScheme.status === 'bad schemes' ? 'bg-red-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {selectedScheme.status}
                    </span>
                  )}
                  <p className="text-sm text-gray-300 font-serif">
                    <span className="font-medium">Start Date:</span> {new Date(selectedScheme.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-300 font-serif">
                    <span className="font-medium">End Date:</span> {new Date(selectedScheme.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="bg-primary-700 rounded-lg p-4">
                <h4 className="text-md font-semibold font-sans text-gray-100 mb-2">Scheme Overview</h4>
                <p className="text-sm text-gray-300 font-serif leading-relaxed whitespace-pre-line">
                  {selectedScheme.details}
                </p>
              </div>

              <div className="pt-4 border-t border-primary-600 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={() => {
                    // Download report functionality
                    alert(`Downloading report for ${selectedScheme.description}`);
                  }}
                  className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-md font-medium"
                >
                  ⬇️ Download Report
                </button>
                <button
                  onClick={() => {
                    setShowForwardModal(true);
                  }}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-md font-medium"
                >
                  ➡️ Forward Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forward Report Modal */}
      {showForwardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-primary-800 rounded-lg max-w-md w-full border border-primary-600">
            <div className="px-6 py-4 border-b border-primary-600 flex justify-between items-center">
              <h2 className="text-lg font-bold font-sans text-gray-100">Forward Report</h2>
              <button
                onClick={() => setShowForwardModal(false)}
                className="text-gray-400 hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Recipient Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Add a message..."
                  className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setShowForwardModal(false)}
                  className="px-4 py-2 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Report forwarded successfully');
                    setShowForwardModal(false);
                  }}
                  className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-md font-medium"
                >
                  Forward
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};

export default ProducerPortal;
