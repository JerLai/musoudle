import React from 'react'

export default function InfoIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="fixed top-4 right-4 z-50 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        opacity: 0.85,
      }}
      onClick={onClick}
      aria-label="About & Privacy"
    >
      {/* Simple info icon (SVG) */}
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <circle cx="12" cy="16" r="1" />
      </svg>
    </button>
  );
}