import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface PortalLayoutProps {
  role: string;
  roleIcon: string;
  sidebarItems: Array<{
    id: string;
    name: string;
    icon: string;
    href?: string;
    onClick?: () => void;
    hasDropdown?: boolean;
    dropdownItems?: Array<{
      id: string;
      name: string;
      icon: string;
      href: string;
      hasDropdown?: boolean;
      dropdownItems?: Array<{
        id: string;
        name: string;
        icon: string;
        href: string;
      }>;
    }>;
  }>;
  children: React.ReactNode;
}

type NotificationItem = {
  id: string;
  role: string;
  message: string;
  status: 'pending' | 'approved' | 'ignored';
  receivedAt: string;
  applicantName?: string;
  applicantType?: 'Individual' | 'Company';
  companyName?: string;
  companyId?: string;
  organization?: string;
  organizationProfile?: string;
  fullAddress?: string;
  contactPersonName?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
  companyEmail?: string;
  documentUrl?: string;
};

const PortalLayout: React.FC<PortalLayoutProps> = ({
  role,
  roleIcon,
  sidebarItems,
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState<string | null>(null);
  const [approvalDecision, setApprovalDecision] = useState('');
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const location = useLocation();

  // Auto-open dropdowns that contain the active page
  const [openDropdowns, setOpenDropdowns] = useState<string[]>(() => {
    const initialOpenDropdowns: string[] = [];
    
    const checkDropdowns = (items: any[], parentId?: string) => {
      items.forEach(item => {
        if (item.hasDropdown && item.dropdownItems) {
          const hasActiveSubItem = item.dropdownItems.some((subItem: any) => {
            if (subItem.href === location.pathname) return true;
            if (subItem.hasDropdown && subItem.dropdownItems) {
              return subItem.dropdownItems.some((nestedItem: any) => 
                nestedItem.href === location.pathname
              );
            }
            return false;
          });
          
          if (hasActiveSubItem) {
            initialOpenDropdowns.push(item.id);
            if (parentId) {
              initialOpenDropdowns.push(parentId);
            }
          }
          
          // Check nested dropdowns
          if (item.hasDropdown && item.dropdownItems) {
            checkDropdowns(item.dropdownItems, item.id);
          }
        }
      });
    };
    
    checkDropdowns(sidebarItems);
    return initialOpenDropdowns;
  });

  // Update open dropdowns when location changes
  React.useEffect(() => {
    const newOpenDropdowns: string[] = [];
    
    const checkDropdowns = (items: any[], parentId?: string) => {
      items.forEach(item => {
        if (item.hasDropdown && item.dropdownItems) {
          const hasActiveSubItem = item.dropdownItems.some((subItem: any) => {
            if (subItem.href === location.pathname) return true;
            if (subItem.hasDropdown && subItem.dropdownItems) {
              return subItem.dropdownItems.some((nestedItem: any) => 
                nestedItem.href === location.pathname
              );
            }
            return false;
          });
          
          if (hasActiveSubItem) {
            newOpenDropdowns.push(item.id);
            if (parentId) {
              newOpenDropdowns.push(parentId);
            }
          }
          
          // Check nested dropdowns
          if (item.hasDropdown && item.dropdownItems) {
            checkDropdowns(item.dropdownItems, item.id);
          }
        }
      });
    };
    
    checkDropdowns(sidebarItems);
    
    if (newOpenDropdowns.length > 0) {
      setOpenDropdowns(prev => {
        // Merge with existing open dropdowns (keep manually opened ones)
        const combined = [...prev, ...newOpenDropdowns];
        const uniqueSet = new Set(combined);
        const merged = Array.from(uniqueSet);
        return merged;
      });
    }
  }, [location.pathname, sidebarItems]);

  const toggleDropdown = (itemId: string) => {
    setOpenDropdowns(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href: string) => location.pathname === href;

  const isCoordinatingAgencyRoute = location.pathname.startsWith('/portal/coordinating-agency');

  // Notifications data
  const notifications = useMemo<NotificationItem[]>(() => [
    { 
      id: 'n1', 
      role: '🏦 PFI', 
      message: 'Zenith Bank submitted 25 new SME agro-loan applications for review.', 
      status: 'pending', 
      receivedAt: new Date().toISOString(),
      applicantName: 'Zenith Bank',
      applicantType: 'Company',
      companyName: 'Zenith Bank PLC',
      companyId: 'PFI-001',
      organization: 'Zenith Bank PLC',
      organizationProfile: 'Leading financial institution providing agricultural financing solutions',
      fullAddress: 'Plot 84, Ajose Adeogun Street, Victoria Island, Lagos, Nigeria',
      contactPersonName: 'Mr. John Okonkwo',
      contactPersonEmail: 'j.okonkwo@zenithbank.com',
      contactPersonPhone: '+234-802-123-4567',
      companyEmail: 'info@zenithbank.com',
      documentUrl: '#'
    },
    { 
      id: 'n2', 
      role: '👩🏾‍🌾 Producer Group', 
      message: 'Kaduna Maize Farmers Cooperative applied for ₦85M seasonal input financing.', 
      status: 'pending', 
      receivedAt: new Date().toISOString(),
      applicantName: 'Kaduna Maize Farmers Cooperative',
      applicantType: 'Company',
      companyName: 'Kaduna Maize Farmers Cooperative',
      companyId: 'COOP-042',
      organization: 'Kaduna Maize Farmers Cooperative',
      organizationProfile: 'Cooperative of maize farmers seeking seasonal input financing',
      fullAddress: 'Zaria Road, Kaduna, Kaduna State, Nigeria',
      contactPersonName: 'Alhaji Musa Ibrahim',
      contactPersonEmail: 'm.ibrahim@kadunamaize.com',
      contactPersonPhone: '+234-803-234-5678',
      companyEmail: 'info@kadunamaize.com',
      documentUrl: '#'
    },
    { 
      id: 'n3', 
      role: '🛡️ Insurance', 
      message: 'Leadway Assurance reported 12 new crop insurance claims due to flood.', 
      status: 'pending', 
      receivedAt: new Date().toISOString(),
      applicantName: 'Leadway Assurance',
      applicantType: 'Company',
      companyName: 'Leadway Assurance Company Limited',
      companyId: 'INS-015',
      organization: 'Leadway Assurance Company Limited',
      organizationProfile: 'Insurance provider specializing in agricultural risk coverage',
      fullAddress: 'Leadway Assurance House, 117, Awolowo Road, Ikoyi, Lagos, Nigeria',
      contactPersonName: 'Mrs. Adaora Nwosu',
      contactPersonEmail: 'a.nwosu@leadwayassurance.com',
      contactPersonPhone: '+234-804-345-6789',
      companyEmail: 'info@leadwayassurance.com',
      documentUrl: '#'
    },
    { 
      id: 'n4', 
      role: '⚓ Anchor', 
      message: 'Dangote Rice seeks supply contracts with 1,200 smallholders in Kebbi.', 
      status: 'pending', 
      receivedAt: new Date().toISOString(),
      applicantName: 'Dangote Rice',
      applicantType: 'Company',
      companyName: 'Dangote Rice Limited',
      companyId: 'ANC-008',
      organization: 'Dangote Rice Limited',
      organizationProfile: 'Leading rice processing company seeking supply chain partnerships',
      fullAddress: 'Dangote Business Complex, Kano, Kano State, Nigeria',
      contactPersonName: 'Mr. Abubakar Sani',
      contactPersonEmail: 'a.sani@dangote.com',
      contactPersonPhone: '+234-805-456-7890',
      companyEmail: 'rice@dangote.com',
      documentUrl: '#'
    },
    { 
      id: 'n5', 
      role: '🌱 Input Supplier', 
      message: 'Flour Mills seeds division offered 8% discount for early-season bulk purchase.', 
      status: 'pending', 
      receivedAt: new Date().toISOString(),
      applicantName: 'Flour Mills of Nigeria',
      applicantType: 'Company',
      companyName: 'Flour Mills of Nigeria PLC',
      companyId: 'SUP-012',
      organization: 'Flour Mills of Nigeria PLC',
      organizationProfile: 'Leading agricultural input supplier offering quality seeds and fertilizers',
      fullAddress: '1 Golden Penny Place, Wharf Road, Apapa, Lagos, Nigeria',
      contactPersonName: 'Dr. Fatima Usman',
      contactPersonEmail: 'f.usman@flourmillsng.com',
      contactPersonPhone: '+234-806-567-8901',
      companyEmail: 'seeds@flourmillsng.com',
      documentUrl: '#'
    },
  ], []);

  const pendingNotifications = notifications.filter(n => n.status === 'pending');
  const unreadCount = pendingNotifications.length;

  const handleNotificationClick = (notificationId: string) => {
    setNotificationDropdownOpen(false);
    setShowApprovalModal(notificationId);
    setApprovalDecision('');
    setApprovalRemarks('');
  };

  const handleApprovalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showApprovalModal && approvalDecision) {
      // Here you would typically update the notification status and send the decision
      setShowApprovalModal(null);
      setApprovalDecision('');
      setApprovalRemarks('');
      alert(`Decision submitted: ${approvalDecision}`);
    }
  };

  return (
    <div className="min-h-screen bg-primary-900 flex items-stretch">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-primary-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 h-full lg:h-auto flex flex-col`}>
        <div className="sticky top-0 z-10 bg-primary-800 flex items-center justify-between h-16 px-4 border-b border-primary-700">
          <div className="flex items-center">
            <img 
              src={`${process.env.PUBLIC_URL}/images/logo/LOGO.svg`} 
              alt="AFCF Logo" 
              className="h-8 w-auto"
            />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Role Header */}
        <div className="px-4 py-6 border-b border-primary-700">
          <div className="flex items-center">
            <div className="text-2xl mr-3">{isCoordinatingAgencyRoute ? '🏛️' : roleIcon}</div>
            <div>
              <h2 className="text-lg font-semibold font-sans text-gray-100">{isCoordinatingAgencyRoute ? 'Coordinating Agency (Super Admin)' : role}</h2>
              <p className="text-sm text-gray-400 font-serif">Portal Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4 flex-1 overflow-y-auto pb-24">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                {item.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.id)}
                      className="flex items-center justify-between w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-primary-700 rounded-lg transition-colors duration-200"
                    >
                      <div className="flex items-start flex-1 min-w-0">
                        <span className="text-lg mr-3">{item.icon}</span>
                        <span className="font-sans font-semibold whitespace-normal break-words leading-tight text-left">{item.name}</span>
                      </div>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          openDropdowns.includes(item.id) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {item.dropdownItems && openDropdowns.includes(item.id) && (
                      <ul className="mt-1 ml-6 space-y-1 overflow-hidden transition-all duration-200">
                        {item.dropdownItems.map((subItem) => (
                          <li key={subItem.id}>
                            {subItem.hasDropdown ? (
                              <div>
                                <button
                                  onClick={() => toggleDropdown(subItem.id)}
                                  className="flex items-center justify-between w-full px-3 py-2 text-gray-400 hover:text-white hover:bg-primary-700 rounded-lg transition-colors duration-200"
                                >
                                  <div className="flex items-start flex-1 min-w-0">
                                    <span className="text-base mr-2">{subItem.icon}</span>
                                    <span className="font-sans whitespace-normal break-words leading-tight text-left">{subItem.name}</span>
                                  </div>
                                  <svg
                                    className={`w-3 h-3 transition-transform duration-200 ${
                                      openDropdowns.includes(subItem.id) ? 'rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                                {subItem.dropdownItems && openDropdowns.includes(subItem.id) && (
                                  <ul className="mt-1 ml-4 space-y-1 overflow-hidden transition-all duration-200">
                                    {subItem.dropdownItems.map((nestedItem) => (
                                      <li key={nestedItem.id}>
                                        <Link
                                          to={nestedItem.href}
                                          className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                                            isActive(nestedItem.href)
                                              ? 'bg-accent-600 text-white font-semibold'
                                              : 'text-gray-400 hover:text-white hover:bg-primary-700'
                                          }`}
                                        >
                                          <div className="flex items-start flex-1 min-w-0">
                                            <span className="text-sm mr-2">{nestedItem.icon}</span>
                                            <span className="font-sans whitespace-normal break-words leading-tight text-left">{nestedItem.name}</span>
                                          </div>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ) : (
                              <Link
                                to={subItem.href}
                                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                                  isActive(subItem.href)
                                    ? 'bg-accent-600 text-white font-semibold'
                                    : 'text-gray-400 hover:text-white hover:bg-primary-700'
                                }`}
                              >
                                <div className="flex items-start flex-1 min-w-0">
                                  <span className="text-base mr-2">{subItem.icon}</span>
                                  <span className="font-sans whitespace-normal break-words leading-tight text-left">{subItem.name}</span>
                                </div>
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : item.href ? (
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-accent-600 text-white font-semibold'
                        : 'text-gray-300 hover:text-white hover:bg-primary-700'
                    }`}
                  >
                    <span className="text-lg mr-3">{item.icon}</span>
                    <span className="font-sans">{item.name}</span>
                  </Link>
                ) : (
                  <button
                    onClick={item.onClick}
                    className="flex items-center w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-primary-700 rounded-lg transition-colors duration-200 text-left"
                  >
                    <span className="text-lg mr-3">{item.icon}</span>
                    <span className="font-sans">{item.name}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-primary-700 mt-auto">
          <Link
            to="/"
            className="flex items-center px-3 py-2 text-gray-400 hover:text-white hover:bg-primary-700 rounded-lg transition-colors duration-200"
          >
            <span className="text-lg mr-3">🚪</span>
            <span className="font-sans">Logout</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-primary-800 border-b border-primary-700 px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center gap-3 flex-1 ml-4">
              {/* Welcome back and Profile icon grouped together */}
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <p className="text-sm font-medium font-sans text-gray-100">Welcome back</p>
                  <p className="text-xs text-gray-400 font-serif">Last login: Today</p>
                </div>
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{role.charAt(0)}</span>
                </div>
              </div>
              
              {/* Notification icon at the far right */}
              {isCoordinatingAgencyRoute && (
                <div className="relative ml-auto">
                  <button
                    onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                    className="relative p-2 text-gray-400 hover:text-white hover:bg-primary-700 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {notificationDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setNotificationDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-primary-900 rounded-lg shadow-xl border border-primary-700 z-50 max-h-96 overflow-y-auto">
                        <div className="p-4 border-b border-primary-700">
                          <h3 className="text-lg font-semibold text-gray-100">Notifications</h3>
                        </div>
                        <div className="divide-y divide-primary-700">
                          {pendingNotifications.length > 0 ? (
                            pendingNotifications.map((notification) => (
                              <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification.id)}
                                className="p-4 hover:bg-primary-800 cursor-pointer transition-colors"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="text-xl flex-shrink-0">🔔</div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs text-accent-400 font-sans font-medium mb-1">{notification.role}</p>
                                    <p className="text-sm text-gray-100 font-sans leading-relaxed">{notification.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(notification.receivedAt).toLocaleString()}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-400">
                              <p>No pending notifications</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Approval Form Modal */}
      {showApprovalModal && (() => {
        const notification = notifications.find(n => n.id === showApprovalModal);
        return notification ? (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowApprovalModal(null)}>
            <div className="min-h-screen flex items-center justify-center py-8">
              <div className="w-full max-w-3xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold font-sans text-gray-100">Final Approval</h3>
                    <div className="mt-2 p-3 bg-primary-800 rounded-md">
                      <p className="text-xs text-accent-400 font-sans font-medium mb-1">{notification.role}</p>
                      <p className="text-sm text-gray-200">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">Received: {new Date(notification.receivedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowApprovalModal(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                </div>

                {/* Application Details Section */}
                {notification.applicantName && (
                  <div className="space-y-4 mb-6">
                    <div className="bg-primary-800 rounded-md p-4">
                      <h4 className="text-sm font-semibold text-accent-400 font-sans mb-3">
                        {notification.applicantType === 'Company' ? 'Company Details' : 'Applicant Details'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-400 font-serif mb-1">Applicant Name</p>
                          <p className="text-sm text-gray-100 font-sans">{notification.applicantName}</p>
                        </div>
                        {notification.companyName && (
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Company Name</p>
                            <p className="text-sm text-gray-100 font-sans">{notification.companyName}</p>
                          </div>
                        )}
                        {notification.companyId && (
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Company ID</p>
                            <p className="text-sm text-gray-100 font-sans">{notification.companyId}</p>
                          </div>
                        )}
                        {notification.organization && (
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Organization</p>
                            <p className="text-sm text-gray-100 font-sans">{notification.organization}</p>
                          </div>
                        )}
                        {notification.fullAddress && (
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-400 font-serif mb-1">Address</p>
                            <p className="text-sm text-gray-100 font-sans">{notification.fullAddress}</p>
                          </div>
                        )}
                        {notification.organizationProfile && (
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-400 font-serif mb-1">Organization Profile</p>
                            <p className="text-sm text-gray-100 font-sans">{notification.organizationProfile}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Person Information */}
                    {(notification.contactPersonName || notification.contactPersonEmail || notification.contactPersonPhone) && (
                      <div className="bg-primary-800 rounded-md p-4">
                        <h4 className="text-sm font-semibold text-accent-400 font-sans mb-3">Contact Person Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {notification.contactPersonName && (
                            <div>
                              <p className="text-xs text-gray-400 font-serif mb-1">Name</p>
                              <p className="text-sm text-gray-100 font-sans">{notification.contactPersonName}</p>
                            </div>
                          )}
                          {notification.contactPersonEmail && (
                            <div>
                              <p className="text-xs text-gray-400 font-serif mb-1">Email</p>
                              <p className="text-sm text-gray-100 font-sans">{notification.contactPersonEmail}</p>
                            </div>
                          )}
                          {notification.contactPersonPhone && (
                            <div>
                              <p className="text-xs text-gray-400 font-serif mb-1">Phone</p>
                              <p className="text-sm text-gray-100 font-sans">{notification.contactPersonPhone}</p>
                            </div>
                          )}
                          {notification.companyEmail && (
                            <div>
                              <p className="text-xs text-gray-400 font-serif mb-1">Company Email</p>
                              <p className="text-sm text-gray-100 font-sans">{notification.companyEmail}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Supporting Documents */}
                    {notification.documentUrl && notification.documentUrl !== '#' && (
                      <div className="bg-primary-800 rounded-md p-4">
                        <h4 className="text-sm font-semibold text-accent-400 font-sans mb-2">Supporting Documents</h4>
                        <a
                          href={notification.documentUrl}
                          download
                          className="inline-flex items-center gap-2 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-md text-sm font-sans transition-colors"
                        >
                          📄 Download Application Documents
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Approval Form */}
                <form onSubmit={handleApprovalSubmit} className="space-y-4 border-t border-primary-700 pt-4">
                  <div>
                    <label className="block text-sm text-gray-300 font-serif mb-1">Decision</label>
                    <select 
                      value={approvalDecision} 
                      onChange={(e) => setApprovalDecision(e.target.value)} 
                      className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600"
                      required
                    >
                      <option value="">Select decision</option>
                      <option value="approve">Approve</option>
                      <option value="reject">Reject</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 font-serif mb-1">Remarks</label>
                    <textarea 
                      value={approvalRemarks} 
                      onChange={(e) => setApprovalRemarks(e.target.value)} 
                      rows={3} 
                      className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600" 
                      placeholder="Add remarks (optional)" 
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowApprovalModal(null)} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary">Submit Decision</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : null;
      })()}
    </div>
  );
};

export default PortalLayout;
