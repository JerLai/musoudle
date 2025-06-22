'use client';
import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';

type MainMenuButtonProps = {
  name: string;
};

const MainMenuButton: React.FC<MainMenuButtonProps> = ({ name }) => {
  const buttonHoverRef = useRef<HTMLAudioElement>(null);
  const buttonSelectRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  const playSelectSoundAndNavigate = () => {
    const audio = buttonSelectRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().then(() => {
        setTimeout(() => {
          router.push(`/${name}`);
        }, 1200);
      }).catch(() => {
        router.push(`/${name}`);
      });
    } else {
      router.push(`/${name}`);
    }
  };

  const playHoverSound = () => {
    const audio = buttonHoverRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };

  return (
    <div>
      <button
        className="main-button"
        onClick={playSelectSoundAndNavigate}
        onMouseEnter={playHoverSound}
        aria-label={`Go to ${name} mode`}
        type="button"
      >
        {name.toUpperCase()}
      </button>
      <audio ref={buttonHoverRef} src="/main_menu_option.mp3" preload="auto" />
      <audio ref={buttonSelectRef} src="/main_menu_option_select.mp3" preload="auto" />
    </div>
  );
};

export default MainMenuButton;
