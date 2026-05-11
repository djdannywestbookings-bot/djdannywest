import { SiteNav } from "@/components/SiteNav";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Credits } from "@/components/Credits";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <SiteNav solid={false} />
      <Hero />
      <Manifesto />
      <Credits />
      <Footer />
    </main>
  );
}
