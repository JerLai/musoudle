'use client';
import React from 'react';

export default function ChangelogIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="fixed top-4 right-16 z-50 rounded-full p-2 shadow transition cursor-pointer"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        opacity: 0.85,
      }}
      onClick={onClick}
      aria-label="Changelog"
    >
      {/* Simple changelog/history icon (SVG) */}
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}