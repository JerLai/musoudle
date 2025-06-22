'use client';
import React, { useState, useRef } from 'react';
import SearchBox from '../components/SearchBox';
import GuessContainer from '../components/GuessContainer';
import { CharacterData } from '../types-interfaces/CharacterData';
type Guess = {
  correct: boolean;
  characterData: CharacterData;
};

const apiUrl = "/api/validate";

const ClassicPage = () => {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [showModal, setShowModal] = useState(false);

  const victoryRef = useRef<HTMLAudioElement>(null);
  // This function will call your API/worker and update guesses
  const handleGuess = async (name: string) => {
    console.log("Guessing:", name);
    console.log(apiUrl);

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guess: name }),
    });
    const result: Guess = await res.json();
    // Ensure result contains categories, or adjust as needed
    setGuesses(prev => [...prev, result]);

    // Check if correct guess
    if (result.correct) {
      setShowModal(true);
      setTimeout(() => setShowModal(false), 4000); // Hide after 4s
      victoryRef.current?.play();
    }
  };

  return (
    <div>
      <SearchBox onSelect={handleGuess}/>
      <GuessContainer guessesData={guesses}/>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 animate-bounce-in flex flex-col items-center">
            <span className="uppercase-first-big text-3xl font-bold text-green-600 animate-pulse">
              🎉 Correct! 🎉
            </span>
            <span className="uppercase-first-big mt-4 text-xl animate-fade-in">
              You guessed the officer!
            </span>
          </div>
        </div>
      )}
      {/* Audio element */}
      <audio ref={victoryRef} src="/victory.mp3" preload="auto" />
    </div>
  );
};

export default ClassicPage;
// Add these animations to your globals.css or use Tailwind plugins
/*
@keyframes bounce-in {
  0% { transform: scale(0.7); opacity: 0; }
  60% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); }
}
.animate-bounce-in { animation: bounce-in 0.6s; }

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in { animation: fade-in 1s; }
*/