'use client';

import React, { useState, useRef } from 'react';
import characters from '../../public/data/characters-lite.json'; // Adjust the path as necessary

type SearchBoxProps = {
  onSelect: (_name: string) => void;
};

const SearchBox: React.FC<SearchBoxProps> = ({ onSelect }) => {
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
        w-full
        max-w-2xl
        aspect-[807/239]
        min-h-[250px]
        bg-cover
        bg-center
        rounded-lg
        shadow-md
        flex flex-col items-center mb-8
        relative
      "
      style={{ backgroundImage: "url('/Search_Box.png')" }}
    >
      <div className="w-full h-full flex flex-col items-center justify-between px-6 pt-4 pb-12">
        <div className="w-full flex flex-col items-center">
          <span className="uppercase-first-big text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-100 drop-shadow">
            Guess the Dynasty Warriors officer!
          </span>
          <span className="uppercase-first-big mt-2 text-sm sm:text-base text-gray-200 text-center drop-shadow">
            Type any officer to begin.
          </span>
        </div>
        <audio ref={hoverRef} src="/option_move.mp3" preload="auto" />
        <audio ref={selectRef} src="/option_select.mp3" preload="auto" />
        <div className="relative w-full">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Search for an officer..."
            className="uppercase-first-big w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white/80"
          />
          {input && filtered.length > 0 && (
            <div className="absolute left-0 right-0 z-50 bg-white dark:bg-black/90 border border-gray-300 dark:border-gray-600 rounded w-full max-h-60 overflow-y-auto mt-1 shadow-lg">
              {filtered.map((item, idx) => (
                <div
                  key={idx}
                  className="uppercase-first-big px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
                  onClick={() => {
                    console.log(`Selected: ${item}`);
                    onSelect(item);
                    playSelectSound();
                  }}
                  onMouseEnter={playHoverSound}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBox