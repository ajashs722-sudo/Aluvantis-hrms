import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface OrgCanvasToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen?: () => void;
  onReset: () => void;
  onAutoLayout?: () => void;
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
}

export const OrgCanvasToolbar: React.FC<OrgCanvasToolbarProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  isFullScreen,
  onToggleFullScreen,
}) => {
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30 flex items-center pointer-events-none select-none">
      {/* Floating Canvas Controls Pill */}
      <div className="flex items-center gap-0.5 sm:gap-1 p-1 rounded-2xl bg-card border border-border shadow-xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10">
        {/* Zoom Out (-) */}
        <button
          type="button"
          onClick={onZoomOut}
          disabled={zoom <= 0.25}
          title="Kichraytirish (-)"
          className="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/15 text-foreground disabled:opacity-30 flex items-center justify-center cursor-pointer transition active:scale-95"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Live Zoom % Badge */}
        <button
          type="button"
          onClick={onReset}
          title="100% masshtabga qaytish"
          className="h-8 px-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center cursor-pointer transition"
        >
          <span className="text-xs font-mono font-extrabold text-foreground min-w-[38px] text-center">
            {zoomPercent}%
          </span>
        </button>

        {/* Zoom In (+) */}
        <button
          type="button"
          onClick={onZoomIn}
          disabled={zoom >= 3.0}
          title="Kattalashtirish (+)"
          className="w-8 h-8 rounded-xl bg-[#C6A15B] hover:bg-[#d6b36e] text-[#14201F] disabled:opacity-30 flex items-center justify-center cursor-pointer font-bold shadow-xs transition active:scale-95"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-border mx-0.5" />

        {/* Reset View */}
        <button
          type="button"
          onClick={onReset}
          title="Dastlabki holatga qaytarish"
          className="w-8 h-8 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={onToggleFullScreen}
          title={isFullScreen ? 'Kichik ekran' : 'To‘liq ekran'}
          className="w-8 h-8 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer transition"
        >
          {isFullScreen ? (
            <Minimize2 className="w-3.5 h-3.5 text-[#C6A15B]" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};
