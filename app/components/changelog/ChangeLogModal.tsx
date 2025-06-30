'use client';
import React from 'react';

type ChangelogEntry = {
  version: string;
  date?: string;
  changes: string[];
};

const changelog: ChangelogEntry[] = [
  {
    version: "v1.0.5",
    date: "2025-06-29",
    changes: [
      "Added changelog modal",
      "Improved mobile responsiveness",
      "Adjusted styling for dark mode users",
      "Added disabled buttons for future modes",
    ],
  },
  {
    version: "v1.0.0",
    date: "2025-06-29",
    changes: [
      "Initial release 🎉",
    ],
  },
];

export default function ChangelogModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        className="rounded-lg shadow-lg max-w-lg w-full p-6 relative"
        style={{
          background: "var(--background)",
          color: "var(--foreground)"
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-2xl font-bold cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Changelog</h2>
        <div className="space-y-6">
          {changelog.map(entry => (
            <div key={entry.version}>
              <div className="font-semibold text-lg">
                {entry.version} {entry.date && <span className="text-sm text-gray-500">({entry.date})</span>}
              </div>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                {entry.changes.map((change, idx) => (
                  <li key={idx}>{change}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}