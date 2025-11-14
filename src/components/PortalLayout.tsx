import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNotifications, type NotificationItem } from '../context/NotificationContext';
import { updateFundProviderStatus, getActiveFundProviderRecord } from '../utils/localDatabase';

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
  const [showFullApplication, setShowFullApplication] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread' | 'viewed'>('all');
  const [documentModal, setDocumentModal] = useState<{
    title: string;
    documents: { label: string; name: string; type: string }[];
  } | null>(null);
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

  React.useEffect(() => {
    if (notificationDropdownOpen) {
      setNotificationFilter('all');
    }
  }, [notificationDropdownOpen]);

  const toggleDropdown = (itemId: string) => {
    setOpenDropdowns(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href: string) => location.pathname === href;

  const isCoordinatingAgencyRoute = location.pathname.startsWith('/portal/coordinating-agency');
  const isFundProviderRoute = location.pathname.startsWith('/portal/fund-provider');
  const isAnchorRoute = location.pathname.startsWith('/portal/anchor');
  const isProducerRoute = location.pathname.startsWith('/portal/producer');
  const isPFIRoute = location.pathname.startsWith('/portal/pfi');
  const isLeadFirmRoute = location.pathname.startsWith('/portal/lead-firm');
  const shouldShowNotifications = isCoordinatingAgencyRoute || isFundProviderRoute || isAnchorRoute || isProducerRoute || isPFIRoute || isLeadFirmRoute;

  // Determine current user role from route
  const getCurrentUserRole = (): 'coordinating-agency' | 'fund-provider' | 'anchor' | 'producer' | 'pfi' | 'lead-firm' | null => {
    if (isCoordinatingAgencyRoute) return 'coordinating-agency';
    if (isFundProviderRoute) return 'fund-provider';
    if (isAnchorRoute) return 'anchor';
    if (isProducerRoute) return 'producer';
    if (isPFIRoute) return 'pfi';
    if (isLeadFirmRoute) return 'lead-firm';
    return null;
  };

  const currentUserRole = getCurrentUserRole();

  // Get notifications from context
  const {
    getNotificationsByRole,
    addNotification,
    getApprovedApplicationForScheme,
    updateNotificationStatus,
    setNotificationViewed,
  } = useNotifications();

  // Filter notifications based on current user role
  const activeFundProviderRecord = useMemo(() => {
    if (currentUserRole !== 'fund-provider') return null;
    return getActiveFundProviderRecord();
  }, [currentUserRole]);

  const notifications = useMemo<NotificationItem[]>(() => {
    if (!currentUserRole) return [];
    if (currentUserRole === 'coordinating-agency') {
      return getNotificationsByRole('coordinating-agency');
    }
    if (currentUserRole === 'fund-provider') {
      const fundProviderId = activeFundProviderRecord?.id;
      if (!fundProviderId) return [];
      return getNotificationsByRole('fund-provider').filter(
        (notif) => notif.metadata?.fundProviderId === fundProviderId
      );
    }
    return getNotificationsByRole(currentUserRole);
  }, [currentUserRole, getNotificationsByRole, activeFundProviderRecord]);

  const sortedNotifications = useMemo(() => {
    const sorted = [...notifications].sort((a, b) => {
      if (a.isViewed === b.isViewed) {
        return new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime();
      }
      return a.isViewed ? 1 : -1;
    });
    return sorted;
  }, [notifications]);

  const unreadNotifications = useMemo(
    () => sortedNotifications.filter((n) => !n.isViewed),
    [sortedNotifications]
  );

  const viewedNotifications = useMemo(
    () => sortedNotifications.filter((n) => n.isViewed),
    [sortedNotifications]
  );

  const filteredNotifications = useMemo(() => {
    switch (notificationFilter) {
      case 'unread':
        return unreadNotifications;
      case 'viewed':
        return viewedNotifications;
      default:
        return sortedNotifications;
    }
  }, [notificationFilter, sortedNotifications, unreadNotifications, viewedNotifications]);

  const unreadCount = unreadNotifications.length;
  const notificationTabs = [
    { id: 'all' as const, label: 'All', count: sortedNotifications.length },
    { id: 'unread' as const, label: 'Unread', count: unreadNotifications.length },
    { id: 'viewed' as const, label: 'Viewed', count: viewedNotifications.length },
  ];

  const handleNotificationClick = (notificationId: string) => {
    setNotificationDropdownOpen(false);
    setShowApprovalModal(notificationId);
    setApprovalDecision('');
    setApprovalRemarks('');
    setNotificationViewed(notificationId, true);
    updateNotificationStatus(notificationId, 'read');
  };

  const renderNotificationItem = (notification: NotificationItem) => (
    <div
      key={notification.id}
      onClick={() => handleNotificationClick(notification.id)}
      className={`p-4 cursor-pointer transition-colors ${
        notification.isViewed
          ? 'text-gray-300 hover:bg-primary-800/60'
          : 'bg-primary-800/60 hover:bg-primary-700 text-gray-100'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 pt-1">
          <span
            className={`inline-flex h-2.5 w-2.5 rounded-full ${
              notification.isViewed ? 'bg-primary-500' : 'bg-accent-400'
            }`}
          ></span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <p className={`text-xs font-sans font-medium ${notification.isViewed ? 'text-gray-400' : 'text-accent-300'}`}>
              {notification.role}
            </p>
            <p className="text-[11px] text-gray-500 font-serif">
              {new Date(notification.receivedAt).toLocaleString()}
            </p>
          </div>
          <p className={`mt-1 text-sm font-sans ${notification.isViewed ? 'text-gray-300' : 'text-gray-100 font-semibold'}`}>
            {notification.message}
          </p>
          {notification.metadata?.type === 'fundProviderRegistration' && (
            <p className="mt-1 text-[11px] text-gray-400 font-serif">
              Registration update awaiting your review.
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const handleApprovalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showApprovalModal || !approvalDecision) return;

    const notification = notifications.find(n => n.id === showApprovalModal);
    if (!notification) return;

    const trimmedRemarks = approvalRemarks.trim();

    if (currentUserRole === 'coordinating-agency') {
      // Handle Fund Provider registration approvals/rejections
      if (notification.metadata?.type === 'fundProviderRegistration') {
        const isApproved = approvalDecision === 'approve';
        const fundProviderId = notification.metadata?.fundProviderId as string | undefined;

        if (!isApproved && !trimmedRemarks) {
          alert('Please provide a reason for rejecting this Fund Provider.');
          return;
        }

        updateNotificationStatus(showApprovalModal, isApproved ? 'approved' : 'rejected');

        if (fundProviderId) {
          updateFundProviderStatus(fundProviderId, isApproved ? 'verified' : 'unverified', {
            rejectionReason: isApproved ? undefined : trimmedRemarks,
            pendingNotificationId: null,
          });
        }

        if (fundProviderId) {
          const message = isApproved
            ? 'Your registration has been approved. You now have full access.'
            : `Your registration has been rejected due to ${trimmedRemarks}. Please update your details and resubmit for approval.`;

          addNotification({
            role: '🏛️ Coordinating Agency',
            targetRole: 'fund-provider',
            message,
            metadata: {
              type: 'fundProviderRegistrationResponse',
              fundProviderId,
              relatedNotificationId: notification.id,
            },
          });
        }
      }
      // Handle scheme application approvals/rejections
      else if (notification.applicationData) {
        const isApproved = approvalDecision === 'approve';
        const status = isApproved ? 'approved' : 'rejected';

        updateNotificationStatus(showApprovalModal, status);

        const roleMap: Record<string, 'fund-provider' | 'anchor' | 'producer' | 'pfi' | 'lead-firm'> = {
          '💼 Fund Provider': 'fund-provider',
          '🏦 PFI': 'pfi',
          '⚓ Anchor': 'anchor',
          '🌱 Lead Firm': 'lead-firm',
          '🌾 Producer': 'producer',
          '🌾 Producer/Farmer': 'producer'
        };

        const applicantRole = roleMap[notification.role];

        if (isApproved && applicantRole && ['pfi', 'anchor', 'lead-firm', 'producer'].includes(applicantRole)) {
          const existingApproval = getApprovedApplicationForScheme(notification.schemeId || '', applicantRole as 'pfi' | 'anchor' | 'lead-firm' | 'producer');
          if (existingApproval && existingApproval.id !== notification.id) {
            alert(`Only one ${applicantRole} can be approved per scheme. Another application has already been approved.`);
            setShowApprovalModal(null);
            setApprovalDecision('');
            setApprovalRemarks('');
            return;
          }
        }

        const instructions: Record<string, string> = {
          'fund-provider': 'Go ahead and make payments to the nearest approved PFI\'s branch.',
          'pfi': 'Receive payments from approved Fund Providers and disburse funds to approved beneficiaries.',
          'anchor': 'Receive payments from approved PFIs.',
          'lead-firm': 'Receive payments from approved PFIs.',
          'producer': 'Receive payments from approved PFIs.'
        };

        if (applicantRole) {
          const message = isApproved
            ? `Your application for scheme "${notification.schemeName}" has been approved. ${instructions[applicantRole]}`
            : `Your application for scheme "${notification.schemeName}" has been rejected. ${trimmedRemarks ? `Reason: ${trimmedRemarks}` : ''}`;

          const metadata =
            applicantRole === 'fund-provider'
              ? {
                  type: 'fundProviderRegistrationResponse',
                  fundProviderId: notification.metadata?.fundProviderId,
                  relatedNotificationId: notification.id,
                }
              : undefined;

          addNotification({
            role: '🏛️ Coordinating Agency',
            targetRole: applicantRole,
            message,
            schemeId: notification.schemeId,
            schemeName: notification.schemeName,
            applicationStatus: status,
            metadata,
          });
        }
      } else {
        updateNotificationStatus(showApprovalModal, approvalDecision === 'approve' ? 'approved' : 'ignored');
      }
    } else {
      updateNotificationStatus(showApprovalModal, approvalDecision === 'approve' ? 'approved' : 'ignored');
    }

    setNotificationViewed(showApprovalModal, true);
    setShowApprovalModal(null);
    setApprovalDecision('');
    setApprovalRemarks('');
    setShowFullApplication(false);
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
              <h2 className="text-lg font-semibold font-sans text-gray-100">{isCoordinatingAgencyRoute ? 'Coordinating Agency' : role}</h2>
              {isCoordinatingAgencyRoute && (
                <p className="text-sm text-gray-500 font-serif">Super Admin</p>
              )}
              <p className="text-sm text-gray-400 font-serif">{!isCoordinatingAgencyRoute ? 'Portal Dashboard' : ''}</p>
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
              {shouldShowNotifications && currentUserRole && (
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
                      <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-primary-900 rounded-lg shadow-xl border border-primary-700 z-50 overflow-hidden">
                        <div className="p-4 border-b border-primary-700">
                          <h3 className="text-lg font-semibold text-gray-100">Notifications</h3>
                        </div>
                        <div className="px-4 py-2 border-b border-primary-700 flex items-center gap-2">
                          {notificationTabs.map((tab) => (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setNotificationFilter(tab.id)}
                              className={`flex-1 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                                notificationFilter === tab.id
                                  ? 'bg-accent-600 text-white'
                                  : 'bg-primary-800 text-gray-300 hover:bg-primary-700 hover:text-white'
                              }`}
                            >
                              {tab.label}
                              <span className="ml-1 text-[10px] font-normal text-gray-300">
                                {tab.count}
                              </span>
                            </button>
                          ))}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notificationFilter === 'all' ? (
                            <>
                              {unreadNotifications.length > 0 && (
                                <>
                                  <div className="px-4 py-2 text-xs font-semibold text-accent-400 uppercase tracking-wide">
                                    New / Unread
                                  </div>
                                  <div className="divide-y divide-primary-700">
                                    {unreadNotifications.map(renderNotificationItem)}
                                  </div>
                                </>
                              )}
                              {viewedNotifications.length > 0 && (
                                <>
                                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Viewed / Previous
                                  </div>
                                  <div className="divide-y divide-primary-700">
                                    {viewedNotifications.map(renderNotificationItem)}
                                  </div>
                                </>
                              )}
                              {unreadNotifications.length === 0 && viewedNotifications.length === 0 && (
                                <div className="p-4 text-center text-gray-400 font-serif">
                                  <p>No notifications yet</p>
                                </div>
                              )}
                            </>
                          ) : filteredNotifications.length > 0 ? (
                            <div className="divide-y divide-primary-700">
                              {filteredNotifications.map(renderNotificationItem)}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-gray-400 font-serif">
                              <p>
                                {notificationFilter === 'unread'
                                  ? 'No unread notifications'
                                  : 'No viewed notifications yet'}
                              </p>
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
                    <h3 className="text-lg font-semibold font-sans text-gray-100">Notification</h3>
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

                    {/* Scheme Information */}
                    {notification.schemeId && notification.schemeName && (
                      <div className="bg-primary-800 rounded-md p-4">
                        <h4 className="text-sm font-semibold text-accent-400 font-sans mb-3">Scheme Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Scheme ID</p>
                            <p className="text-sm text-gray-100 font-sans">{notification.schemeId}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-serif mb-1">Scheme Name</p>
                            <p className="text-sm text-gray-100 font-sans">{notification.schemeName}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Link
                            to={currentUserRole ? `/portal/${currentUserRole}/scheme-application` : '#'}
                            onClick={() => setShowApprovalModal(null)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-md text-sm font-sans transition-colors"
                          >
                            📝 View Scheme & Apply
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* View Full Application Section - For CA viewing applications */}
                {currentUserRole === 'coordinating-agency' && notification.applicationData && (
                  <div className="mb-6 border-t border-primary-700 pt-4">
                    <button
                      onClick={() => setShowFullApplication(!showFullApplication)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-primary-800 hover:bg-primary-700 rounded-md transition-colors"
                    >
                      <span className="text-sm font-semibold text-accent-400 font-sans">
                        {showFullApplication ? '▼' : '▶'} View Full Application
                      </span>
                      <span className="text-xs text-gray-400 font-serif">
                        {showFullApplication ? 'Hide detailed view' : 'Show detailed view'}
                      </span>
                    </button>

                    {showFullApplication && (() => {
                      const applicationData = notification.applicationData;
                      const step1 = applicationData.step1 ?? {};
                      const step2 = applicationData.step2 ?? {};
                      const step3 = applicationData.step3 ?? {};
                      const step4 = applicationData.step4 ?? {};
                      const step5 = applicationData.step5 ?? {};

                      const buildEntries = (source: Record<string, any>, labels: Record<string, string>) =>
                        Object.entries(labels)
                          .map(([key, label]) => {
                            const rawValue = source?.[key];
                            if (rawValue === undefined || rawValue === null) return null;
                            const value = Array.isArray(rawValue) ? rawValue.join(', ') : String(rawValue);
                            const trimmed = value.trim();
                            if (!trimmed || trimmed === 'Not provided') return null;
                            return { label, value: trimmed };
                          })
                          .filter(Boolean) as { label: string; value: string }[];

                      const personalDetailsEntries = buildEntries(step1, {
                        fullName: 'Full Name',
                        position: 'Position / Role in Organization',
                        gender: 'Gender',
                        birthDate: 'Date of Birth',
                      });

                      const contactInformationEntries = buildEntries(step2, {
                        email: 'Email Address',
                        phone: 'Phone Number',
                        whatsapp: 'WhatsApp (Optional)',
                        address: 'Residential / Office Address',
                        city: 'City',
                        state: 'State',
                        country: 'Country',
                      });

                      const verificationEntries = buildEntries(step3, {
                        idType: 'ID Type',
                        idNumber: 'ID Number',
                        emergencyContactName: 'Emergency Contact Name',
                        emergencyContactPhone: 'Emergency Contact Phone',
                        emergencyRelationship: 'Relationship with Emergency Contact',
                        idDocument: 'Uploaded ID Document',
                      });

                      const basicInformationEntries = buildEntries(step4, {
                        organizationName: 'Organization Name',
                        registrationNumber: 'Registration Number / CAC Number',
                        organizationType: 'Type of Organization',
                        yearEstablished: 'Year Established',
                        industry: 'Industry / Sector',
                        missionStatement: 'Short Description / Mission Statement',
                      });

                      const addressInformationEntries = buildEntries(step4, {
                        headquartersAddress: 'Headquarters Address',
                        hqCity: 'Headquarters City',
                        hqState: 'Headquarters State',
                        hqCountry: 'Headquarters Country',
                        officePhone: 'Office Phone Number',
                        officialEmail: 'Official Email Address',
                        website: 'Website URL',
                        facebook: 'Facebook Handle',
                        linkedin: 'LinkedIn Handle',
                        twitter: 'X Handle',
                        instagram: 'Instagram Handle',
                      });

                      const operationsEntries = buildEntries(
                        {
                          numEmployees: step5.numEmployees,
                          areasOfOperation: step5.areasOfOperation,
                          hasPartnership: step5.hasPartnership,
                          partnershipDetails: step5.partnershipDetails,
                        },
                        {
                          numEmployees: 'Number of Employees / Volunteers',
                          areasOfOperation: 'Areas of Operation / Coverage',
                          hasPartnership: 'Has Partnership or Affiliation',
                          partnershipDetails: 'Partnership Details',
                        }
                      );

                      const deriveDocumentType = (fileName: string) => {
                        if (!fileName) return 'Unknown';
                        const extension = fileName.split('.').pop();
                        return extension ? extension.toUpperCase() : 'Unknown';
                      };

                      const openDocuments = (title: string, docs: { label: string; name: string }[]) => {
                        if (!docs.length) return;
                        setDocumentModal({
                          title,
                          documents: docs.map((doc) => ({
                            ...doc,
                            type: deriveDocumentType(doc.name),
                          })),
                        });
                      };

                      const verificationDocuments =
                        step3?.idDocument && step3.idDocument !== 'Not provided'
                          ? [{ label: 'Government-issued ID', name: String(step3.idDocument) }]
                          : [];

                      const operationsDocuments = [
                        step5?.organizationLogo && step5.organizationLogo !== 'Not provided'
                          ? { label: 'Organization Logo', name: String(step5.organizationLogo) }
                          : null,
                        step5?.certificateOfIncorporation && step5.certificateOfIncorporation !== 'Not provided'
                          ? {
                              label: 'Certificate of Incorporation / Registration',
                              name: String(step5.certificateOfIncorporation),
                            }
                          : null,
                      ].filter(Boolean) as { label: string; name: string }[];

                      const renderGroup = (
                        title: string,
                        entries: { label: string; value: string }[],
                        action?: React.ReactNode
                      ) => (
                        <div key={title} className="bg-primary-900/60 rounded-md border border-primary-700 p-4 space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <h6 className="text-sm font-semibold text-accent-300 font-sans">{title}</h6>
                            {action}
                          </div>
                          {entries.length > 0 ? (
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                              {entries.map(({ label, value }) => (
                                <div key={label}>
                                  <dt className="text-xs uppercase tracking-wide text-gray-400 font-serif">{label}</dt>
                                  <dd className="text-sm text-gray-100 font-sans mt-1 whitespace-pre-line break-words">{value}</dd>
                                </div>
                              ))}
                            </dl>
                          ) : (
                            <p className="text-xs text-gray-500 font-serif">No data provided.</p>
                          )}
                        </div>
                      );

                      return (
                        <div className="mt-4 space-y-6 bg-primary-800 rounded-md p-4">
                          <div className="space-y-4">
                            <h5 className="text-sm font-semibold text-accent-400 font-sans uppercase tracking-wide">Contact Info</h5>
                            {renderGroup('Personal Details', personalDetailsEntries)}
                            {renderGroup('Contact Information', contactInformationEntries)}
                            {renderGroup(
                              'Verification & Emergency',
                              verificationEntries,
                              verificationDocuments.length > 0 ? (
                                <button
                                  type="button"
                                  onClick={() => openDocuments('Verification Documents', verificationDocuments)}
                                  className="text-xs text-accent-400 hover:text-accent-300 font-semibold transition-colors"
                                >
                                  View Documents
                                </button>
                              ) : undefined
                            )}
                          </div>
                          <div className="space-y-4">
                            <h5 className="text-sm font-semibold text-accent-400 font-sans uppercase tracking-wide">Organization Info</h5>
                            {renderGroup('Basic Information', basicInformationEntries)}
                            {renderGroup('Address & Contact Info', addressInformationEntries)}
                            {renderGroup(
                              'Operations & Documentation',
                              operationsEntries,
                              operationsDocuments.length > 0 ? (
                                <button
                                  type="button"
                                  onClick={() => openDocuments('Operations & Documentation Documents', operationsDocuments)}
                                  className="text-xs text-accent-400 hover:text-accent-300 font-semibold transition-colors"
                                >
                                  View Documents
                                </button>
                              ) : undefined
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Approval Form - Show for CA when viewing application notifications, or for other roles */}
                {((currentUserRole === 'coordinating-agency' && notification.applicationData) || 
                  (currentUserRole !== 'coordinating-agency' && notification.role !== '🏛️ Coordinating Agency')) && (
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
                      <label className="block text-sm text-gray-300 font-serif mb-1">
                        {notification.metadata?.type === 'fundProviderRegistration' && approvalDecision === 'reject'
                          ? 'Reason for Rejection'
                          : 'Remarks'}
                      </label>
                      <textarea 
                        value={approvalRemarks} 
                        onChange={(e) => setApprovalRemarks(e.target.value)} 
                        rows={3} 
                        className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600" 
                        placeholder={notification.metadata?.type === 'fundProviderRegistration' && approvalDecision === 'reject'
                          ? 'Provide the reason for rejection'
                          : 'Add remarks (optional)'} 
                        required={notification.metadata?.type === 'fundProviderRegistration' && approvalDecision === 'reject'}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => {
                        setShowApprovalModal(null);
                        setShowFullApplication(false);
                      }} className="btn-secondary">Cancel</button>
                      <button type="submit" className="btn-primary">Submit Decision</button>
                    </div>
                  </form>
                )}

                {/* For Coordinating Agency scheme notifications (not applications), show acknowledge button */}
                {currentUserRole === 'coordinating-agency' && notification.role === '🏛️ Coordinating Agency' && !notification.applicationData && (
                  <div className="border-t border-primary-700 pt-4 flex justify-end gap-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        updateNotificationStatus(notification.id, 'read');
                        setShowApprovalModal(null);
                      }} 
                      className="btn-primary"
                    >
                      Acknowledge
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null;
      })()}

      {/* Document Viewer Modal */}
      {documentModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center"
          onClick={() => setDocumentModal(null)}
        >
          <div
            className="w-full max-w-md bg-primary-900 border border-primary-700 rounded-lg p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-100">{documentModal.title}</h3>
                <p className="text-xs text-gray-400 font-serif mt-1">
                  Document preview and downloads are not available in this demo environment.
                </p>
              </div>
              <button
                className="text-gray-400 hover:text-gray-200 transition-colors"
                onClick={() => setDocumentModal(null)}
              >
                ✖
              </button>
            </div>
            <div className="space-y-3">
              {documentModal.documents.map((doc) => (
                <div key={`${doc.label}-${doc.name}`} className="border border-primary-700 rounded-md p-3 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-100">{doc.label}</p>
                      <p className="text-xs text-gray-400 font-serif break-all">{doc.name}</p>
                    </div>
                    <span className="text-xs font-semibold text-accent-400">{doc.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => alert('Document preview is not available in the demo environment.')}
                      className="px-3 py-1.5 text-xs rounded-md bg-primary-700 hover:bg-primary-600 text-gray-100 transition-colors"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => alert('Download is not available in the demo environment.')}
                      className="px-3 py-1.5 text-xs rounded-md bg-accent-600 hover:bg-accent-700 text-white transition-colors"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalLayout;
