
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Integrations from './components/Integrations';
import GridFeatures from './components/GridFeatures';
import Security from './components/Security';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#0b101b] text-slate-300 overflow-x-hidden selection:bg-blue-500/30 selection:text-white font-sans">
      <Navbar />
      <Hero />
      <Features />
      <Integrations />
      <GridFeatures />
      <Security />
      <Footer />
    </div>
  );
}

export default App;
