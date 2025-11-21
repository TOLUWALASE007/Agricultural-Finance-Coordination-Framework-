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

const STORAGE_KEY = 'afcf_notifications';

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    // Load from localStorage on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: NotificationItem[] = JSON.parse(stored);
        return parsed.map((notif) => ({
          ...notif,
          isViewed: Boolean((notif as any).isViewed),
        }));
      }
    } catch (error) {
      console.error('Error loading notifications from localStorage:', error);
    }
    return [];
  });

  // Save to localStorage whenever notifications change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error);
    }
  }, [notifications]);

  const addNotification = useCallback((notificationData: Omit<NotificationItem, 'id' | 'receivedAt' | 'status' | 'isViewed'>) => {
    const newNotification: NotificationItem = {
      ...notificationData,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      receivedAt: new Date().toISOString(),
      status: 'pending',
      isViewed: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
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
    localStorage.removeItem(STORAGE_KEY);
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

