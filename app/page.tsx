import MainMenuButton from "./components/MainMenuButton";
import Coundown from "./components/Countdown";
import MetaIconBox from "./components/MetaIconBox";
export default function Home() {
  return (
    <main className="flex flex-col items-center pt-2">
      <MetaIconBox />
      <Coundown />
      <MainMenuButton name="classic" />
      <MainMenuButton name="musou" type="disabled" />
      <MainMenuButton name="battle" type="disabled" />
      <MainMenuButton name="ambition" type="disabled" />
    </main>
  );
}
