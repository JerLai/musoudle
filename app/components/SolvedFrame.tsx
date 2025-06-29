import React from 'react'
import Image from 'next/image'
interface SolvedFrameProps {
  character: string;
}

const SolvedFrame: React.FC<SolvedFrameProps> = ({ character }) => {
  return (
    <div
      className="relative flex flex-col items-center justify-center mb-4"
      style={{
        width: '432px',   // 80% of 540px
        height: '247px',  // 80% of 309px
        background: 'linear-gradient(135deg, #e0ffe0 0%, #b2f5ea 100%)', // example colored background
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        overflow: 'hidden',
      }}
    >
      <Image
        src="/Solved_Frame.png" // replace with your frame image path
        alt=""
        fill
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ objectFit: 'fill', zIndex: 1 }}
        draggable={false}
        unoptimized
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
        <h2 className="text-2xl font-bold text-green-700">Congratulations!</h2>
        <p className="mt-2 text-base text-gray-800">You&apos;ve solved the puzzle.</p>
        <p className="mt-2 text-base text-gray-900">
          Today&apos;s character was: <span className="font-bold">{character}</span>
        </p>
      </div>
    </div>
  )
}

export default SolvedFrame