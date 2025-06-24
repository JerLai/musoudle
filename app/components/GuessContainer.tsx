'use client';
import React from "react";
import { CharacterData } from "../types-interfaces/CharacterData";
import Image from "next/image";

type Guess = {
  correct: boolean;
  characterData: CharacterData;
};

type GuessContainerProps = {
  guessesData: Guess[];
};
// List the properties you want to display as columns
const columns: Array<keyof CharacterData> = [
  "Name",
  "Faction(s)",
  "Playable Debut",
  "Weapon Type",
  "Born",
  "Died",
  "Gender",
  "Height",
];

const FRAME_WIDTH = 213; // default 213
const FRAME_HEIGHT = 129; // default 129
const GUESS_HEIGHT = 194; // default 213

// const dummyData: CharacterData = {
//   Name: "Dummy Character",
//   "Faction(s)": { value: "Dummy Faction", match: 2 },
//   "Playable Debut": { value: "Dummy Debut", match: 1 },
//   "Weapon Type": { value: "Dummy Weapon", match: 0 },
//   Born: { value: "Dummy Year", match: 1 },
//   Died: { value: "Dummy Year", match: 0 },
//   Gender: { value: "Dummy Gender", match: 0 },
//   Height: { value: "Dummy Height", match: 1 },
//   Hint: { value: "Dummy Hint", match: 0 },
// };

const getBoxColor = (match: number) => {
  // You can adjust these styles for Wordle-like coloring
  switch (match) {
    case 2: return "color-green";
    case 1: return "color-yellow";
    default: return "color-red";
  }
};
const GuessContainer: React.FC<GuessContainerProps> = ({ guessesData }) => (
  <div className="guess-container">
    {guessesData.length > 0 && (
      <>
        {/* Header Row */}
        <div className="guess-row flex mb-2 items-center justify-center">
          {columns.map((col) => (
            <div
              key={col}
              className="relative flex items-center justify-center mx-1"
              style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT }}
            >
              {/* Semi-transparent grey background */}
              <div className="absolute inset-0 bg-gray-700 bg-opacity-60 rounded" />
              {/* Frame image overlay */}
              <Image
                src="/Guess_Category_Box.png" // Use your provided image
                alt="header frame"
                fill
                style={{ objectFit: "cover", pointerEvents: "none" }}
                unoptimized
              />
              {/* Centered header text */}
              <span className="relative z-10 text-white font-bold uppercase text-center text-base select-none">
                {col}
              </span>
            </div>
          ))}
        </div>
        {/* Guess Rows */}
        {guessesData.map((guess, idx) => (
          <div className="guess-row flex items-center justify-center m-2" key={idx}>
            {/* Display each column's data */}
            {columns.map((col) => {
              const prop = guess.characterData[col];
              // For Name, just display the string; for others, display value and color by match
              if (col === "Name" && typeof prop === "string") {
                return (
                  <div
                    key={col}
                    className="guess-box bg-gray-700 flex items-center justify-center text-center mx-1 text-xs border"
                    style={{ width: FRAME_WIDTH, height: GUESS_HEIGHT }}
                  >
                    {prop}
                  </div>
                );
              }
              if (typeof prop === "object" && prop !== null && "value" in prop && "match" in prop) {
                return (
                  <div
                    key={col}
                    className={`frame-wrapper ${getBoxColor(prop.match)} flex items-center justify-center text-center relative mx-1 border h-full`}
                    style={{ width: FRAME_WIDTH, height: GUESS_HEIGHT }}
                  >
                    <div className="flex items-center justify-center h-full w-full">
                      <span className="relative z-10 font-bold uppercase">
                        {prop.value}
                      </span>
                    </div>
                  </div>
                );
              }
              // fallback
              return (
                <div key={col} className="guess-box px-2 py-1 border flex-1 text-center mx-1 text-xs">
                  {/* empty */}
                </div>
              );
            })}
          </div>
        ))}
      </>
    )}
  </div>
);

export default GuessContainer;