import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl bg-amber-600 dark:bg-amber-700 px-4 py-2.5 text-xs font-bold text-white shadow-2xl border border-amber-400/50 animate-bounce dir-rtl">
      <WifiOff className="w-4 h-4 text-amber-200" />
      <span>وضع عدم الاتصال بالإنترنت — يتم استعراض البيانات المحفوظة مؤقتاً</span>
    </div>
  );
};
