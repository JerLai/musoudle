'use client';
import React from "react";

type Guess = {
  categories: string[];
  // Add other fields as needed, e.g. name: string;
};

type GuessContainerProps = {
  guesses: Guess[];
};

const GuessContainer: React.FC<GuessContainerProps> = ({ guesses }) => (
  <div className="guess-container">
    {guesses.map((guess, idx) => (
      <div className="guess-row" key={idx}>
        {/* Render guess details here */}
        {guess.categories.map((cat, i) => (
          <div className="guess-cell" key={i}>{cat}</div>
        ))}
      </div>
    ))}
  </div>
);

export default GuessContainer;