import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Integrations from './components/Integrations';
import GridFeatures from './components/GridFeatures';
import Security from './components/Security';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#f8f8fc] text-[#1a1a2e] overflow-x-hidden font-sans">
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
