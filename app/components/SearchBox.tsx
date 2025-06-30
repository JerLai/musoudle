'use client';

import React, { useState, useRef } from 'react';
import characters from '../../public/data/characters-lite.json';
import Image from 'next/image';

type SearchBoxProps = {
  onSelect: (_name: string) => void;
  correct: boolean;
};

const SearchBox: React.FC<SearchBoxProps> = ({ onSelect, correct }) => {
  const [input, setInput] = useState("");
  // Get all character names (keys)
  const characterNames = Object.keys(characters);

  // Audio ref for hover sound
  const hoverRef = useRef<HTMLAudioElement>(null);
  const selectRef = useRef<HTMLAudioElement>(null);
  // Filter for prefix match (case-insensitive)
  const filtered =
    input.length > 0
      ? characterNames.filter(name =>
          name.toLowerCase().startsWith(input.toLowerCase())
        )
      : [];

  // Play audio on hover
  const playHoverSound = () => {
    const audio = hoverRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };

  // Play audio on select
  const playSelectSound = () => {
    const audio = selectRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };

return (
  <div
    className="
      relative
      max-w-[95vw] sm:max-w-[879px]s
      aspect-[879/288]
      min-h-[120px] sm:min-h-[288px]
      mb-8
      flex flex-col items-center justify-center
      px-2 sm:px-6
      box-border
    "
  >
    {/* Semi-transparent background */}
    <div className="absolute inset-0 bg-gray-800 bg-opacity-60 rounded-lg z-0" />

    {/* Frame image overlay */}
    <Image
      src="/Search_Frame.png"
      alt="search frame"
      fill
      className="z-10 pointer-events-none"
      style={{ objectFit: "cover" }}
      unoptimized
    />

    {/* Content */}
    <div className="relative z-20 w-full h-full flex flex-col items-center justify-between px-2 sm:px-6 pt-2 sm:pt-4 pb-6 sm:pb-12">
      <div className="w-full flex flex-col items-center">
        <span className="uppercase-first-big text-xs sm:text-xl md:text-2xl font-bold text-center text-gray-100 drop-shadow">
          Guess the Dynasty Warriors officer!
        </span>
        <span className="uppercase-first-big mt-1 sm:mt-2 text-[11px] sm:text-sm md:text-base text-gray-200 text-center drop-shadow">
          Type any officer to begin.
        </span>
      </div>
      <audio ref={hoverRef} src="/option_move.mp3" preload="auto" />
      <audio ref={selectRef} src="/option_select.mp3" preload="auto" />
      {!correct && (
        <>
          <div className="relative w-full flex justify-center">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Search for an officer..."
              className="uppercase-first-big w-full max-w-xs sm:max-w-md px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white/80"
            />
            {input && filtered.length > 0 && (
              <div 
                className="
                  absolute left-1/2 top-full
                  -translate-x-1/2
                  z-50
                  bg-white dark:bg-black/90
                  border border-gray-300 dark:border-gray-600
                  rounded
                  w-full max-w-xs sm:max-w-md
                  max-h-60 overflow-y-auto mt-1 shadow-lg
                  text-sm sm:text-base
                "
              >
                {filtered.map((item, idx) => (
                  <div
                    key={idx}
                    className="uppercase-first-big px-2 sm:px-4 py-1 sm:py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
                    onClick={() => {
                      onSelect(item);
                      playSelectSound();
                      setInput("");
                    }}
                    onMouseEnter={playHoverSound}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  </div>
);
};

export default SearchBox