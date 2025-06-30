import MainMenuButton from "./components/MainMenuButton";
import Coundown from "./components/Countdown";
import MetaIconBox from "./components/MetaIconBox";
export default function Home() {
  return (
    <main className="flex flex-col items-center pt-8">
      <MetaIconBox />
      <Coundown />
      <MainMenuButton name="classic" />
    </main>
  );
}
