import MainMenuButton from "./components/MainMenuButton";
import Coundown from "./components/Countdown";
export default function Home() {
  return (
    <main className="flex flex-col items-center pt-8">
      <Coundown />
      <MainMenuButton name="classic" />
    </main>
  );
}
