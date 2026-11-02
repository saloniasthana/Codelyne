import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import Process from "@/components/sections/Process";
import Stack from "@/components/sections/Stack";
import Deliver from "@/components/sections/Deliver";
import WhyChoose from "@/components/sections/WhyChoose";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <About />
      <Services />
      <Work />
      <Process />
      <Stack />
      <Deliver />
      <WhyChoose />
      <Contact />
    </main>
  );
}
