'use client';

import React, { useState } from 'react';

const placeholderItems = [
  "Zhao Yun",
  "Lu Bu",
  "Zhuge Liang",
  "Sun Shangxiang",
  "Diao Chan"
];
const SearchBox = () => {
  const [input, setInput] = useState("");
  return (
    <div className="w-full max-w-xl px-4 py-6 bg-white/80 dark:bg-black/40 rounded-lg shadow-md flex flex-col items-center mb-8">
      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
        Guess the Dynasty Warriors officer!
      </span>
      <span className="mt-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 text-center">
        Type any officer to begin.
      </span>
      <div className="relative w-full">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Search for an officer..."
          className="mt-4 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        {input && (
          <div className="absolute left-0 right-0 z-50 bg-white dark:bg-black/90 border border-gray-300 dark:border-gray-600 rounded w-full max-h-60 overflow-y-auto mt-1 shadow-lg">
            {placeholderItems.map((item, idx) => (
              <div
                key={idx}
                className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBox