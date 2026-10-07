import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import Process from "@/components/sections/Process";
import Stack from "@/components/sections/Stack";
import Deliver from "@/components/sections/Deliver";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Services />
      <Work />
      <Process />
      <Stack />
      <Deliver />
      <Testimonials />
      <Contact />
    </main>
  );
}
