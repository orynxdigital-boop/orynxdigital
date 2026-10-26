import React from 'react';

export default function OrynxLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      {/* Geometric background shape */}
      <path 
        d="M30 15L70 20L90 45L85 75L50 90L15 70L10 40L30 15Z" 
        fill="url(#logoGradient)" 
      />
      {/* White square outline */}
      <rect 
        x="25" 
        y="25" 
        width="50" 
        height="50" 
        stroke="white" 
        strokeWidth="4" 
        transform="rotate(15 50 50)"
      />
      {/* Solid white diamond inside */}
      <rect 
        x="38" 
        y="38" 
        width="24" 
        height="24" 
        fill="white" 
        transform="rotate(45 50 50)"
      />
    </svg>
  );
}
