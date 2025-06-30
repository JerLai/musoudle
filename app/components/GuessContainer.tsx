'use client';
import React, { useEffect, useState } from "react";
import { Guess }  from "../types-interfaces/Guess";
import Image from "next/image";
import { ComparisonResult } from "../types-interfaces/ComparisonResult";
import characters from '../../public/data/characters-lite.json'; // Adjust the path as necessary

type GuessContainerProps = {
  guessesData: Guess[];
  animateIdx?: number | null; // Optional prop to control animation
};
// List the properties you want to display as columns
const columns: Array<keyof ComparisonResult> = [
  "Name",
  "Faction(s)",
  "Playable Debut",
  "Weapon Type",
  "Born",
  "Died",
  "Gender",
  "Height",
];

// const FRAME_WIDTH = 213; // default 213
// const FRAME_HEIGHT = 129; // default 129
// const GUESS_HEIGHT = 194; // default 213

const getBoxColor = (match: number) => {
  // You can adjust these styles for Wordle-like coloring
  switch (match) {
    case 2: return "color-green";
    case 1: return "color-yellow";
    default: return "color-red";
  }
};
const GuessContainer: React.FC<GuessContainerProps> = ({ guessesData, animateIdx }) => {
  // Track if the latest guess row should animate
  const [rowVisible, setRowVisible] = useState(false);

  useEffect(() => {
    if (animateIdx == null) return;
    setRowVisible(false);
    const timeout = setTimeout(() => setRowVisible(true), 50); // slight delay for effect
    return () => clearTimeout(timeout);
  }, [animateIdx, guessesData.length]);

  return (
    <div className="flex flex-col p-4 m-4 border-4 text-center w-72 xxs:w-80 xs:w-96 sm:w-3/4 lg:w-auto">
      <div className="flex flex-col overflow-x-auto">
        {guessesData.length > 0 && (
          <>
            {/* Header Row */}
            <div className="guess-row flex mb-2 items-center justify-center m-2 w-full min-w-[1040px]">
              {columns.map((col) => (
                <div
                  key={col}
                  className="
                    relative flex items-center justify-center mx-1
                    w-[130px] h-[78px]
                  "
                >
                  <div className="absolute inset-0 bg-gray-700 bg-opacity-60 rounded" />
                  <Image
                    src="/Guess_Category_Box.png"
                    alt="header frame"
                    fill
                    style={{ objectFit: "cover", pointerEvents: "none" }}
                    unoptimized
                  />
                  <span className="relative z-10 flex justify-center items-center w-full h-full text-white font-bold uppercase text-center text-base select-none">
                    {col === "Name" ? "Character" : col}
                  </span>
                </div>
              ))}
            </div>
            {/* Guess Rows */}
            {guessesData.map((guess, idx) => {
              const shouldAnimate = animateIdx === idx;
              return (
                <div
                  className={`guess-row flex items-center justify-center m-2 min-w-[1040px] ${
                    shouldAnimate
                      ? rowVisible
                        ? "animate-slide-in"
                        : "opacity-0"
                      : ""
                  }`}
                  key={idx}
                >
                  {columns.map((col) => {
                    const prop = guess.comparisonResult[col];
                    // For Name, just display the string; for others, display value and color by match
                    if (col === "Name" && typeof prop === "string") {
                      const portraitPath = (characters as Record<string, string>)[prop] || "/portraits/zhao_yun_origins.jpeg";
                      return (
                        <div
                          key={col}
                          className="
                            guess-box bg-gray-700 flex items-center justify-center text-center mx-1 border
                            w-[130px] h-[130px]
                          "
                        >
                          <Image
                            src={portraitPath}
                            alt={prop}
                            width={130}
                            height={130}
                            style={{ objectFit: "cover", width: "100%", height: "100%" }}
                            unoptimized
                          />
                        </div>
                      );
                    }
                    if (typeof prop === "object" && prop !== null && "value" in prop && "match" in prop) {
                      return (
                        <div
                          key={col}
                          className={`
                            frame-wrapper ${getBoxColor(prop.match)} flex items-center justify-center text-center relative mx-1 border
                            w-[130px] h-[130px]
                          `}
                        >
                          <div className="flex items-center justify-center h-full w-full">
                            <span className={`relative z-10 font-bold uppercase ${col === "Weapon Type" && prop.value.length >= 80 ? "text-xs" : "text-sm"}`}>
                              {prop.value}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    // fallback
                    return (
                      <div key={col} className="
                        guess-box px-2 py-1 border text-center mx-1 text-xs
                        w-[130px] h-[130px]
                      ">
                        {/* empty */}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
  // return (
  //   <div className="guess-container w-full overflow-y-hidden overflow-x-auto overscroll-x-contain px-1">
  //     {guessesData.length > 0 && (
  //       <>
  //         {/* Header Row */}
  //         <div className="guess-row flex mb-2 items-center min-w-[560px]">
  //           {columns.map((col) => (
  //             <div
  //               key={col}
  //               className="
  //                 relative flex items-center mx-1
  //                 w-[80px] sm:w-[100px] md:w-[120px] lg:w-[130px] xl:w-[130px] 2xl:w-[130px]
  //                 h-[48px] sm:h-[60px] md:h-[70px] lg:h-[78px] xl:h-[78px] 2xl:h-[78px]
  //               "
  //             >
  //               <div className="absolute inset-0 bg-gray-700 bg-opacity-60 rounded" />
  //               <Image
  //                 src="/Guess_Category_Box.png"
  //                 alt="header frame"
  //                 fill
  //                 style={{ objectFit: "cover", pointerEvents: "none" }}
  //                 unoptimized
  //               />
  //               <span className="relative z-10 text-white font-bold uppercase text-center text-base select-none">
  //                 {col === "Name" ? "Character" : col}
  //               </span>
  //             </div>
  //           ))}
  //         </div>
  //         {/* Guess Rows */}
  //         {guessesData.map((guess, idx) => {
  //           const shouldAnimate = animateIdx === idx;
  //           return (
  //             <div
  //               className={`guess-row flex items-center m-2 min-w-[560px] ${
  //                 shouldAnimate
  //                   ? rowVisible
  //                     ? "animate-slide-in"
  //                     : "opacity-0"
  //                   : ""
  //               }`}
  //               key={idx}
  //             >
  //               {columns.map((col) => {
  //                 const prop = guess.comparisonResult[col];
  //                 // For Name, just display the string; for others, display value and color by match
  //                 if (col === "Name" && typeof prop === "string") {
  //                   const portraitPath = (characters as Record<string, string>)[prop] || "/portraits/zhao_yun_origins.jpeg";
  //                   return (
  //                     <div
  //                       key={col}
  //                       className="
  //                         guess-box bg-gray-700 flex items-center justify-center text-center mx-1 border
  //                         w-[80px] sm:w-[100px] md:w-[120px] lg:w-[130px] xl:w-[130px] 2xl:w-[130px]
  //                         h-[70px] sm:h-[90px] md:h-[100px] lg:h-[130px] xl:h-[130px] 2xl:h-[130px]
  //                       "
  //                     >
  //                       <Image
  //                         src={portraitPath}
  //                         alt={prop}
  //                         width={130}
  //                         height={130}
  //                         style={{ objectFit: "cover", width: "100%", height: "100%" }}
  //                         unoptimized
  //                       />
  //                     </div>
  //                   );
  //                 }
  //                 if (typeof prop === "object" && prop !== null && "value" in prop && "match" in prop) {
  //                   return (
  //                     <div
  //                       key={col}
  //                       className={`
  //                         frame-wrapper ${getBoxColor(prop.match)} flex items-center justify-center text-center relative mx-1 border
  //                         w-[80px] sm:w-[100px] md:w-[120px] lg:w-[130px] xl:w-[130px] 2xl:w-[130px]
  //                         h-[70px] sm:h-[90px] md:h-[100px] lg:h-[130px] xl:h-[130px] 2xl:h-[130px]
  //                       `}
  //                     >
  //                       <div className="flex items-center justify-center h-full w-full">
  //                         <span className={`relative z-10 font-bold uppercase ${col === "Weapon Type" && prop.value.length >= 80 ? "text-xs" : "text-sm"}`}>
  //                           {prop.value}
  //                         </span>
  //                       </div>
  //                     </div>
  //                   );
  //                 }
  //                 // fallback
  //                 return (
  //                   <div key={col} className="
  //                     guess-box px-2 py-1 border flex-1 text-center mx-1 text-xs
  //                     w-[80px] sm:w-[100px] md:w-[120px] lg:w-[130px] xl:w-[130px]
  //                     h-[70px] sm:h-[90px] md:h-[100px] lg:h-[130px] xl:h-[130px]
  //                   ">
  //                     {/* empty */}
  //                   </div>
  //                 );
  //               })}
  //             </div>
  //           );
  //         })}
  //       </>
  //     )}
  //   </div>
  // );
};

export default GuessContainer;