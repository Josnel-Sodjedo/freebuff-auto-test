import { useState } from 'react';
import Preloader from './components/Preloader';
import Grain from './components/Grain';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Intro from './components/Intro';
import Projects from './components/Projects';
import Featured from './components/Featured';
import Experiments from './components/Experiments';
import About from './components/About';
import Services from './components/Services';
import Process from './components/Process';
import Testimonial from './components/Testimonial';
import Marquee from './components/Marquee';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useLenis, useScrollTriggerRefresh } from './hooks/useLenis';

export default function App() {
  const [ready, setReady] = useState(false);
  useLenis();
  useScrollTriggerRefresh();

  return (
    <>
      {!ready && <Preloader onDone={() => setReady(true)} />}

      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>

      <Grain />
      <Cursor />
      <Nav />

      <main id="contenu">
        <Hero started={ready} />
        <Intro />
        <Projects />
        <Featured />
        <Experiments />
        <About />
        <Services />
        <Process />
        <Testimonial />
        <Marquee
          items={[
            'Direction artistique',
            'Identité visuelle',
            'Design digital',
            'Expérience utilisateur',
            'Code créatif',
          ]}
          duration={30}
        />
        <Faq />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
