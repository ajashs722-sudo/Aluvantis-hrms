import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

interface Props {
  queueCount?: number;
  onSync?: () => void;
}

export const OfflineBanner: React.FC<Props> = ({ queueCount = 0, onSync }) => {
  const isOnline = useOnlineStatus();

  if (isOnline && queueCount === 0) return null;

  return (
    <div className="bg-[#14201F] text-[#F6F3EC] px-4 py-2 text-xs flex items-center justify-between border-b border-[#C6A15B]/30 z-40 transition-all">
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <>
            <WifiOff className="w-4 h-4 text-[#C6A15B] animate-pulse" />
            <span>
              <strong>Oflayn rejim faol:</strong> Ma’lumotlar qurilmaning IndexedDB xotirasida xavfsiz saqlanmoqda.
            </span>
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4 text-[#C6A15B] animate-spin" />
            <span>Tarmoq tiklandi. {queueCount} ta o‘zgarish server bilan sinxronizatsiya qilinmoqda...</span>
          </>
        )}
      </div>
      {queueCount > 0 && onSync && (
        <button
          onClick={onSync}
          className="flex items-center gap-1 bg-[#C6A15B] text-[#0E4F4F] px-2.5 py-1 rounded-md text-[11px] font-semibold hover:bg-[#b59048]"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Hozir sinxronlash ({queueCount})</span>
        </button>
      )}
    </div>
  );
};
