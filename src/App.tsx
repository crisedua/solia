import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Integrations from './components/Integrations';
import GridFeatures from './components/GridFeatures';
import Security from './components/Security';
import Footer from './components/Footer';

import { useEffect } from 'react';

const ElevenLabsWidget = 'elevenlabs-convai' as any;

function App() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f8fc] text-[#1a1a2e] overflow-x-hidden font-sans">
      <Navbar />
      <Hero />
      <Features />
      <Integrations />
      <GridFeatures />
      <Security />
      <Footer />
      <ElevenLabsWidget agent-id="agent_0701khrvqrkbetnv0jfpc9tx6a9j" variant="compact" />
    </div>
  );
}

export default App;
