import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Credits } from "@/components/Credits";

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Credits />
    </main>
  );
}
