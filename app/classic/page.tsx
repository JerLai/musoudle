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
//
// async function getPreviousCharacter() {
//   'use cache';
//   const data = await fetch('/api/classic');
//   return data.json();
// }

const ClassicPage = () => {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [animateOff, setAnimateOff] = useState(false);
  const victoryRef = useRef<HTMLAudioElement>(null);
  // This function will call your API/worker and update guesses
  const handleGuess = async (name: string) => {

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guess: name }),
    });
    const result: Guess = await res.json();
    // Ensure result contains categories, or adjust as needed
    setGuesses(prev => [result, ...prev]);

    // Check if correct guess
    if (result.correct) {
      setShowModal(true);
      victoryRef.current?.play();
      setTimeout(() => {
        setAnimateOff(true);
        setTimeout(() => {
          setShowModal(false);
          setAnimateOff(false);
        }, 700); // match animation duration
      }, 6300); // show for 7s minus animation duration
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen uppercase-first-big">
      <SearchBox onSelect={handleGuess} correct={guesses[0]?.correct} />
      <GuessContainer guessesData={guesses}/>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div
            className={`rounded-lg shadow-lg p-8 animate-bounce-in flex flex-col items-center ${animateOff ? "animate-tv-off" : ""}`}
            style={{ background: "rgba(245, 235, 220, 0.7)" }}
          >
            <span className="uppercase-first-big text-3xl font-bold text-green-600 animate-pulse animate-stretch-in">
              Victory!
            </span>
            <span
              className="uppercase-first-big w-screen text-center font-bold animate-stretch-in"
              style={{
                display: "block",
                left: 0,
                right: 0,
                margin: "0 auto",
                position: "relative",
                fontSize: "2rem",
                maxWidth: "100vw",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              User&apos;s Forces Victorious!
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
