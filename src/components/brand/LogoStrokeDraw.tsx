import React, { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

interface LogoStrokeDrawProps {
  width?: number;
  height?: number;
  className?: string;
  showText?: boolean;
}

export const LogoStrokeDraw: React.FC<LogoStrokeDrawProps> = ({
  width = 52,
  height = 52,
  className = '',
  showText = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    if (svgRef.current) {
      const paths = Array.from(svgRef.current.querySelectorAll('path, polygon, circle'));
      
      paths.forEach((el) => {
        const geom = el as SVGGeometryElement;
        if (geom.getTotalLength) {
          const length = geom.getTotalLength();
          geom.style.strokeDasharray = `${length}`;
          geom.style.strokeDashoffset = `${length}`;
        }
      });

      // Anime.js v4 stroke-dashoffset animation
      animate(paths, {
        strokeDashoffset: 0,
        ease: 'inOutCubic',
        duration: 1800,
        delay: stagger(150),
      });
    }

    if (textRef.current && showText) {
      animate(textRef.current, {
        opacity: [0, 1],
        translateY: [8, 0],
        ease: 'outQuart',
        duration: 800,
        delay: 1100,
      });
    }
  }, [showText]);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 overflow-visible"
      >
        {/* Rounded Shield/Prism Container Outline */}
        <polygon
          points="50,6 92,28 92,72 50,94 8,72 8,28"
          stroke="#C6A15B"
          strokeWidth="3.5"
          strokeLinejoin="round"
          data-fill="rgba(14, 79, 79, 0.95)"
        />

        {/* Inner Aluvantis Emblem 'A' Structure */}
        <path
          d="M50 18 L76 72 H62 L50 46 L38 72 H24 Z"
          stroke="#C6A15B"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-fill="#C6A15B"
        />

        {/* Central Hex Crossbar / Prism Core */}
        <polygon
          points="50,38 58,54 42,54"
          stroke="#F6F3EC"
          strokeWidth="2"
          data-fill="#0E4F4F"
        />

        {/* Top Apex Node */}
        <circle
          cx="50"
          cy="18"
          r="4"
          stroke="#F6F3EC"
          strokeWidth="2"
          data-fill="#C6A15B"
        />
      </svg>

      {showText && (
        <div ref={textRef} className="flex flex-col opacity-0">
          <span className="font-display font-bold text-xl tracking-tight text-[#0E4F4F]">
            Aluvantis<span className="text-[#C6A15B]">.</span>HR
          </span>
          <span className="text-[11px] font-sans font-medium text-[#0E4F4F]/70 tracking-wide">
            O‘zbekiston HRMS
          </span>
        </div>
      )}
    </div>
  );
};
