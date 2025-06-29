'use client';
import React, { useContext, useState, useRef, useEffect } from 'react';
import SearchBox from '../components/SearchBox';
import GuessContainer from '../components/GuessContainer';
import PuzzleContext from '../context-providers/PuzzleContext';
import { Guess } from '../types-interfaces/Guess';
import SolvedFrame from '../components/SolvedFrame';

const ClassicPage = () => {
  const { state, submitGuess, currentDay } = useContext(PuzzleContext)!;
  const [showModal, setShowModal] = useState(false);
  const [animateOff, setAnimateOff] = useState(false);
  const [prevCharacter, setPrevCharacter] = useState<string | null>(null);
  const [lastAnimatedGuess, setLastAnimatedGuess] = useState<number | null>(null);
  const victoryRef = useRef<HTMLAudioElement>(null);

  const handleGuess = async (name: string) => {
    const result: Guess = await submitGuess(name);
    if (result) {
      setLastAnimatedGuess(0);
      setTimeout(() => setLastAnimatedGuess(null), 600);
    }
    if (result.correct) {
      setShowModal(true);
      victoryRef.current?.play();
      setTimeout(() => {
        setAnimateOff(true);
        setTimeout(() => {
          setShowModal(false);
          setAnimateOff(false);
        }, 700);
      }, 6300);
    }
  };

  // Fetch previous day's character on mount
  useEffect(() => {
    fetch('/api/classic')
      .then(res => res.json() as Promise<{ name: string }>)
      .then((data) => {
        if (data && data.name) setPrevCharacter(data.name);
      });
  }, [currentDay]);

  return (
    <div className="flex flex-col items-center min-h-screen uppercase-first-big">
      { state.solved ? (
        <SolvedFrame character={state.guesses[0]?.comparisonResult.Name} />
      ) : (
        <SearchBox onSelect={handleGuess} correct={state.guesses[0]?.correct} />
      )}

      <GuessContainer guessesData={state.guesses} animateIdx={lastAnimatedGuess} />
      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0, 0, 0, 0.10)" }} // 10% opacity black
        >
          <div
            className={`rounded-lg shadow-lg p-8 animate-bounce-in flex flex-col items-center ${animateOff ? "animate-tv-off" : "animate-tv-on"}`}
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
      {/* Previous day's character */}
      <div className="mt-8 text-center text-lg font-semibold text-gray-700 bg-white/80 px-4 py-2 rounded shadow">
        {prevCharacter
          ? <>Yesterday&apos;s character: <span className="font-bold">{prevCharacter}</span></>
          : "Loading yesterday's character..."}
      </div>
    </div>
  );
};

export default ClassicPage;
