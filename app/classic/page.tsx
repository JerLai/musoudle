'use client';
import React, { useState } from 'react';
import SearchBox from '../components/SearchBox';
import GuessContainer from '../components/GuessContainer';

type Guess = {
  categories: string[];
  name: string;
  //result: any;
};

const ClassicPage = () => {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  // This function will call your API/worker and update guesses
  const handleGuess = async (name: string) => {
    // Example: call your API route or worker
    const res = await fetch('/api/check-guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guess: name }),
    });
    const result = await res.json();
    // Ensure result contains categories, or adjust as needed
    setGuesses(prev => [
      ...prev,
      { name, result, categories: result.categories || [] }
    ]);
  };

  return (
    <div>
      <SearchBox onSelect={handleGuess}/>
      <GuessContainer guesses={guesses} />
    </div>
  );
};


export default ClassicPage