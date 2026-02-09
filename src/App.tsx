import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Integrations from './components/Integrations';
import GridFeatures from './components/GridFeatures';
import Security from './components/Security';
import Footer from './components/Footer';
import ConnectCalendar from './components/ConnectCalendar';
import VoiceAgent from './components/VoiceAgent';

function App() {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b101b] text-slate-300 overflow-x-hidden selection:bg-blue-500/30 selection:text-white font-sans">
      <Navbar onConnectCalendar={() => setCalendarOpen(true)} />
      <Hero />
      <Features />
      <Integrations />
      <GridFeatures />
      <Security />
      <Footer />
      <ConnectCalendar open={calendarOpen} onClose={() => setCalendarOpen(false)} />
      <VoiceAgent />
    </div>
  );
}

export default App;
