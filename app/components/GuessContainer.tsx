'use client';
import React from "react";
import { CharacterData } from "../types-interfaces/CharacterData";
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
  "WeaponType",
  "Born",
  "Died",
  "Gender",
  "Height",
];

const getBoxStyle = (match: number) => {
  // You can adjust these styles for Wordle-like coloring
  switch (match) {
    case 2: return "bg-green-400 text-white";
    case 1: return "bg-yellow-300 text-black";
    default: return "bg-gray-200 text-black";
  }
};
const GuessContainer: React.FC<GuessContainerProps> = ({ guessesData }) => (
  <div className="guess-container">
    {/* Header Row */}
    <div className="guess-row font-bold flex">
      {columns.map((col) => (
        <div key={col} className="guess-box px-2 py-1 border flex-1 text-center">
          {col}
        </div>
      ))}
    </div>
    {/* Guess Rows */}
    {guessesData.map((guess, idx) => (
      <div className="guess-row flex" key={idx}>
        {columns.map((col) => {
          const prop = guess.characterData[col];
          // For Name, just display the string; for others, display value and color by match
          if (col === "Name" && typeof prop === "string") {
            return (
              <div key={col} className="guess-box px-2 py-1 border flex-1 text-center">
                {prop}
              </div>
            );
          }
          if (typeof prop === "object" && prop !== null && "value" in prop && "match" in prop) {
            return (
              <div
                key={col}
                className={`guess-box px-2 py-1 border flex-1 text-center ${getBoxStyle(prop.match)}`}
              >
                {prop.value}
              </div>
            );
          }
          // fallback
          return (
            <div key={col} className="guess-box px-2 py-1 border flex-1 text-center">
              {/* empty */}
            </div>
          );
        })}
      </div>
    ))}
  </div>
);

export default GuessContainer;