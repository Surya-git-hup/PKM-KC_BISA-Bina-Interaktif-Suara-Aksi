import React from 'react';

interface BisaAvatarProps {
  className?: string;
  size?: number | string;
  showShadow?: boolean;
}

export const BisaAvatar: React.FC<BisaAvatarProps> = ({
  className = '',
  size,
  showShadow = true
}) => {
  const style = size
    ? {
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
      }
    : undefined;

  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={style}
    >
      <svg
        viewBox="0 0 280 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${showShadow ? 'drop-shadow-[0_14px_34px_rgba(245,158,11,0.24)] drop-shadow-[0_4px_14px_rgba(0,0,0,0.06)]' : ''}`}
      >
        <defs>
          {/* Subtle top warm glow matching the image.png upper halo */}
          <radialGradient id="topGlow" cx="50%" cy="10%" r="50%">
            <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          {/* Golden glow for antenna beacon */}
          <radialGradient id="beaconGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="70%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#FBBF24" />
          </radialGradient>
        </defs>

        {/* 1. White Circular Badge Base */}
        <circle 
          cx="140" 
          cy="140" 
          r="132" 
          fill="#FFFFFF"
          stroke="#F1F5F9" 
          strokeWidth="1.5"
        />

        {/* Top ambient warm light overlay */}
        <circle 
          cx="140" 
          cy="140" 
          r="132" 
          fill="url(#topGlow)" 
        />

        {/* 2. Dotted Concentric Light Blue Ring */}
        <circle
          cx="140"
          cy="140"
          r="109"
          stroke="#93C5FD"
          strokeWidth="2.5"
          strokeDasharray="4 7"
          fill="none"
          opacity="0.85"
        />

        {/* 3. Sound Wave Arcs on Left and Right */}
        {/* Left sound wave */}
        <path
          d="M 45 147 C 42 153 42 161 45 167"
          stroke="#2563EB"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right sound wave */}
        <path
          d="M 235 147 C 238 153 238 161 235 167"
          stroke="#2563EB"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* 4. Headset Arch (Light Sky Blue curve arching over head) */}
        <path
          d="M 94 142 A 52 52 0 0 1 186 142"
          stroke="#93C5FD"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />

        {/* 5. Antenna on Top */}
        {/* Blue vertical stem */}
        <line
          x1="140"
          y1="102"
          x2="140"
          y2="82"
          stroke="#2563EB"
          strokeWidth="5"
          strokeLinecap="round"
        />
        
        {/* Golden ring beacon */}
        <circle
          cx="140"
          cy="74"
          r="10.5"
          fill="url(#beaconGlow)"
          stroke="#F59E0B"
          strokeWidth="4"
        />
        {/* Golden center core */}
        <circle
          cx="140"
          cy="74"
          r="3.5"
          fill="#D97706"
        />
        {/* Pointed flame/crown peak on top */}
        <path
          d="M 137.5 63.5 Q 140 58 140 56 Q 140 58 142.5 63.5 Z"
          fill="#D97706"
        />

        {/* 6. Robot Head Squircle (Vibrant Blue outline with rounded corners) */}
        <rect
          x="86"
          y="100"
          width="108"
          height="96"
          rx="28"
          fill="#FFFFFF"
          stroke="#2563EB"
          strokeWidth="7.5"
        />

        {/* 7. Headphones / Earcups on Left & Right */}
        {/* Left Earcup */}
        <rect
          x="74"
          y="131"
          width="16"
          height="38"
          rx="8"
          fill="#FBBF24"
          stroke="#D97706"
          strokeWidth="3"
        />
        <line
          x1="82"
          y1="137"
          x2="82"
          y2="163"
          stroke="#F59E0B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Right Earcup */}
        <rect
          x="190"
          y="131"
          width="16"
          height="38"
          rx="8"
          fill="#FBBF24"
          stroke="#D97706"
          strokeWidth="3"
        />
        <line
          x1="198"
          y1="137"
          x2="198"
          y2="163"
          stroke="#F59E0B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* 8. Happy Eyes (Inverted U curves) */}
        {/* Left eye */}
        <path
          d="M 112 147 Q 119 138 126 147"
          stroke="#1E3A8A"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right eye */}
        <path
          d="M 154 147 Q 161 138 168 147"
          stroke="#1E3A8A"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* 9. Soft Pink Cheeks (Blush) */}
        <ellipse
          cx="109"
          cy="158"
          rx="8.5"
          ry="7"
          fill="#FDA4AF"
          opacity="0.85"
        />
        <ellipse
          cx="171"
          cy="158"
          rx="8.5"
          ry="7"
          fill="#FDA4AF"
          opacity="0.85"
        />

        {/* 10. Happy Open Mouth */}
        <path
          d="M 132 163 Q 140 161 148 163 Q 140 178 132 163 Z"
          fill="#E11D48"
          stroke="#1E3A8A"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Tongue inside mouth */}
        <path
          d="M 135 169 Q 140 165.5 145 169 Q 140 177 135 169 Z"
          fill="#FB7185"
        />

        {/* 11. Golden Round Microphone on Bottom-Right */}
        <circle
          cx="195"
          cy="187"
          r="14.5"
          fill="#FBBF24"
          stroke="#D97706"
          strokeWidth="3.5"
        />
        {/* Microphone curved slit arc */}
        <path
          d="M 190 186 Q 195 181 200 186"
          stroke="#92400E"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};
