import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

export type ApplicationData = {
  step1?: Record<string, any>;
  step2?: Record<string, any>;
  step3?: Record<string, any>;
  step4?: Record<string, any>;
  step5?: Record<string, any>;
  [key: string]: any;
};

export type NotificationItem = {
  id: string;
  role: string;
  targetRole: 'fund-provider' | 'anchor' | 'producer' | 'researcher' | 'pfi' | 'lead-firm' | 'coordinating-agency' | 'insurance' | 'cooperative' | 'extension';
  message: string;
  status: 'pending' | 'approved' | 'ignored' | 'read' | 'rejected';
  receivedAt: string;
  isViewed: boolean;
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
  schemeId?: string;
  schemeName?: string;
  applicationId?: string;
  applicationData?: ApplicationData;
  applicationStatus?: 'pending' | 'approved' | 'rejected';
  // Relationship Management Fields
  relationshipId?: string;
  creationRequestId?: string;
  leaveRequestId?: string;
  anchorId?: string;
  anchorName?: string;
  producerId?: string;
  producerName?: string;
  metadata?: Record<string, any>;
};

interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, 'id' | 'receivedAt' | 'status' | 'isViewed'>) => string;
  updateNotificationStatus: (id: string, status: NotificationItem['status']) => void;
  getNotificationsByRole: (role: 'fund-provider' | 'anchor' | 'producer' | 'researcher' | 'pfi' | 'lead-firm' | 'coordinating-agency' | 'insurance' | 'cooperative' | 'extension') => NotificationItem[];
  getPendingCount: (role: 'fund-provider' | 'anchor' | 'producer' | 'researcher' | 'pfi' | 'lead-firm' | 'coordinating-agency' | 'insurance' | 'cooperative' | 'extension') => number;
  clearNotifications: () => void;
  hasAppliedToScheme: (schemeId: string, userRole: 'fund-provider' | 'anchor' | 'producer' | 'researcher' | 'pfi' | 'lead-firm') => boolean;
  getApplicationsForScheme: (schemeId: string) => NotificationItem[];
  getApprovedApplicationForScheme: (schemeId: string, role: 'pfi' | 'anchor' | 'lead-firm' | 'producer' | 'researcher') => NotificationItem | null;
  setNotificationViewed: (id: string, viewed?: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Fetch notifications from MongoDB backend on mount
  useEffect(() => {
    const fetchNotificationsFromBackend = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
          console.log('[NotificationContext] No auth token');
          return;
        }

        // Get current user's role from sessionStorage
        const rawUser = sessionStorage.getItem('user');
        const user = rawUser ? JSON.parse(rawUser) : null;
        const userRole = user?.role || 'coordinating-agency';

        // Import notificationAPI dynamically to avoid circular dependency
        const { notificationAPI } = await import('../utils/api');

        // Fetch notifications for coordinating agency from MongoDB
        const response = await notificationAPI.getByRole(userRole, { limit: 1000 });

        if (response.success && response.data) {
          console.log('[NotificationContext] Loaded', response.data.length, 'notifications from MongoDB for role:', userRole);

          // Convert MongoDB notifications to NotificationItem format
          const mongoNotifications: NotificationItem[] = response.data.map((n: any) => ({
            id: n.id || n._id,
            role: n.metadata?.role || 'Unknown',
            targetRole: userRole as any,
            message: n.message,
            status: 'pending',
            receivedAt: n.createdAt || new Date().toISOString(),
            isViewed: n.isRead || false,
            applicantName: n.metadata?.applicantName,
            applicantType: 'Company',
            companyName: n.metadata?.organizationName,
            organization: n.metadata?.organizationName,
            contactPersonEmail: n.metadata?.email,
            metadata: n.metadata,
          }));

          setNotifications(mongoNotifications);
        }
      } catch (error) {
        console.error('[NotificationContext] Failed to fetch from MongoDB:', error);
      }
    };

    fetchNotificationsFromBackend();
  }, []);

  const addNotification = useCallback((notificationData: Omit<NotificationItem, 'id' | 'receivedAt' | 'status' | 'isViewed'>) => {
    const newNotification: NotificationItem = {
      ...notificationData,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      receivedAt: new Date().toISOString(),
      status: 'pending',
      isViewed: false,
    };

    console.log('[NotificationContext] Adding notification:', {
      type: newNotification.metadata?.type,
      schemeId: newNotification.schemeId,
      id: newNotification.id
    });

    setNotifications(prev => {
      const icCountBefore = prev.filter(n => n.metadata?.type === 'insuranceCompanySubmission' || n.metadata?.type === 'insuranceCompanySchemeApplication').length;
      const result = [newNotification, ...prev];
      const icCountAfter = result.filter(n => n.metadata?.type === 'insuranceCompanySubmission' || n.metadata?.type === 'insuranceCompanySchemeApplication').length;

      if (icCountBefore !== icCountAfter && newNotification.metadata?.type !== 'insuranceCompanySubmission' && newNotification.metadata?.type !== 'insuranceCompanySchemeApplication') {
        console.error('[NotificationContext] IC COUNT CHANGED when adding non-IC notification!', {
          before: icCountBefore,
          after: icCountAfter,
          addedType: newNotification.metadata?.type
        });
      }

      return result;
    });

    return newNotification.id;
  }, []);

  const updateNotificationStatus = useCallback((id: string, status: NotificationItem['status']) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id
          ? {
            ...notif,
            status,
            isViewed: status !== 'pending' ? true : notif.isViewed,
          }
          : notif
      )
    );
  }, []);

  const setNotificationViewed = useCallback((id: string, viewed: boolean = true) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, isViewed: viewed } : notif))
    );
  }, []);

  const getNotificationsByRole = useCallback((role: 'fund-provider' | 'anchor' | 'producer' | 'researcher' | 'pfi' | 'lead-firm' | 'coordinating-agency' | 'insurance' | 'cooperative' | 'extension') => {
    return notifications.filter(n => n.targetRole === role);
  }, [notifications]);

  const getPendingCount = useCallback((role: 'fund-provider' | 'anchor' | 'producer' | 'researcher' | 'pfi' | 'lead-firm' | 'coordinating-agency' | 'insurance' | 'cooperative' | 'extension') => {
    return notifications.filter(n => n.targetRole === role && !n.isViewed).length;
  }, [notifications]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const hasAppliedToScheme = useCallback((schemeId: string, userRole: 'fund-provider' | 'anchor' | 'producer' | 'researcher' | 'pfi' | 'lead-firm') => {
    return notifications.some(n =>
      n.schemeId === schemeId &&
      n.targetRole === 'coordinating-agency' &&
      n.role.toLowerCase().includes(userRole.replace('-', ' ')) &&
      n.applicationStatus !== 'rejected'
    );
  }, [notifications]);

  const getApplicationsForScheme = useCallback((schemeId: string) => {
    return notifications.filter(n =>
      n.schemeId === schemeId &&
      n.targetRole === 'coordinating-agency' &&
      n.applicationData !== undefined
    );
  }, [notifications]);

  const getApprovedApplicationForScheme = useCallback((schemeId: string, role: 'pfi' | 'anchor' | 'lead-firm' | 'producer' | 'researcher') => {
    const roleMap: Record<string, string[]> = {
      'pfi': ['🏦 PFI'],
      'anchor': ['⚓ Anchor'],
      'lead-firm': ['🌱 Lead Firm'],
      'producer': ['🌾 Producer', '🌾 Producer/Farmer'], // Handle both Producer role variants
      'researcher': ['🎓 Researcher/Student']
    };
    const roleLabels = roleMap[role] || [];
    return notifications.find(n =>
      n.schemeId === schemeId &&
      n.targetRole === 'coordinating-agency' &&
      roleLabels.includes(n.role) &&
      n.applicationStatus === 'approved'
    ) || null;
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        updateNotificationStatus,
        getNotificationsByRole,
        getPendingCount,
        clearNotifications,
        hasAppliedToScheme,
        getApplicationsForScheme,
        getApprovedApplicationForScheme,
        setNotificationViewed,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

