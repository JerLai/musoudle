'use client';
import React from "react";

export default function InfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      className="uppercase-first-big fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-2">About Musoudle</h2>
        <p className="mb-4 text-sm">
          Musoudle is a fan-made project inspired by many of the other fan-affiliated versions of Wordle, dedicated to the Dynasty Warriors franchise.
        </p>
        <h3 className="font-semibold mb-1">Privacy Policy</h3>
        <p className="mb-4 text-sm">
          This site uses only necessary cookies to manage and store gamestate data such as guesses. They are necessary to restoring game progress and functionality of the site. This site does not collect personal data. No cookies for analytics, tracking or advertising are used, and no data is shared with third parties.
        </p>
        <h3 className="font-semibold mb-1">Disclaimer</h3>
        <p className="text-xs">
          This project is not affiliated with or endorsed by Tecmo Koei. All Dynasty Warriors assets, names, and trademarks belong to Tecmo Koei.
        </p>
        <h3 className="font-semibold mb-1">Contact</h3>
        <p className="mb-4 text-sm">
          For any questions, feedback, or issues, please contact us at <a href="mailto:kamito14321@gmail.com" className="text-blue-600 hover:underline">kamito14321@gmail.com</a>
        </p>
      </div>
    </div>
  );
}