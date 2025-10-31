import React, { useEffect, useMemo, useState } from 'react';

type NotificationItem = {
  id: string;
  role: string;
  message: string;
  status: 'pending' | 'approved' | 'ignored';
  receivedAt: string;
};

const CoordinatingAgencyNotifications: React.FC = () => {
  const initialNotifications = useMemo<NotificationItem[]>(() => ([
    { id: 'n1', role: '🏦 PFI', message: 'Zenith Bank submitted 25 new SME agro-loan applications for review.', status: 'pending', receivedAt: new Date().toISOString() },
    { id: 'n2', role: '👩🏾‍🌾 Producer Group', message: 'Kaduna Maize Farmers Cooperative applied for ₦85M seasonal input financing.', status: 'pending', receivedAt: new Date().toISOString() },
    { id: 'n3', role: '🛡️ Insurance', message: 'Leadway Assurance reported 12 new crop insurance claims due to flood.', status: 'pending', receivedAt: new Date().toISOString() },
    { id: 'n4', role: '⚓ Anchor', message: 'Dangote Rice seeks supply contracts with 1,200 smallholders in Kebbi.', status: 'pending', receivedAt: new Date().toISOString() },
    { id: 'n5', role: '🌱 Input Supplier', message: 'Flour Mills seeds division offered 8% discount for early-season bulk purchase.', status: 'pending', receivedAt: new Date().toISOString() },
  ]), []);

  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [showToast, setShowToast] = useState<boolean>(true);

  const getNextIdx = (start: number, list: NotificationItem[]) => {
    if (list.length === 0) return 0;
    let idx = start % list.length;
    let loopCount = 0;
    while (list[idx].status === 'approved' && loopCount < list.length) {
      idx = (idx + 1) % list.length;
      loopCount++;
    }
    return idx;
  };

  useEffect(() => {
    setShowToast(true);
    const timer = setTimeout(() => {
      setShowToast(false);
      setNotifications(prev => {
        if (prev.length === 0) return prev;
        const idx = getNextIdx(currentIdx, prev);
        const current = prev[idx];
        if (!current || current.status === 'approved') return prev;
        const updated = [...prev];
        updated.splice(idx, 1);
        const ignored = { ...current, status: 'ignored' } as NotificationItem;
        updated.push(ignored);
        return updated;
      });
      setCurrentIdx(prev => prev + 1);
    }, 4000);
    return () => clearTimeout(timer);
  }, [currentIdx]);

  const currentNotification = notifications.length > 0 ? notifications[getNextIdx(currentIdx, notifications)] : null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentNotification) return;
    setShowToast(false);
    setNotifications(prev => {
      const idx = getNextIdx(currentIdx, prev);
      const current = prev[idx];
      if (!current) return prev;
      const updated = [...prev];
      updated.splice(idx, 1);
      updated.push({ ...current, status: 'ignored' });
      return updated;
    });
  };

  if (!currentNotification) return null;

  return (
    <div
      className={`fixed top-6 right-4 z-50 w-80 max-w-[90vw] select-none bg-primary-800 border-l-4 border-accent-500 shadow-lg rounded-md p-3 transition-all duration-300 ${
        showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start gap-3">
        <div className="text-xl flex-shrink-0">🔔</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-accent-400 font-sans font-medium mb-1">{currentNotification.role}</p>
          <p className="text-sm text-gray-100 font-sans leading-relaxed line-clamp-3">
            {currentNotification.message}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-200 text-base flex-shrink-0 -mt-1"
          aria-label="Dismiss notification"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default CoordinatingAgencyNotifications;


