import { Icon } from '@iconify/react';

interface NavbarProps {
  onConnectCalendar?: () => void;
}

export default function Navbar({ onConnectCalendar }: NavbarProps) {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0b101b]/80 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
            <Icon icon="solar:voice-scan-linear" width="20" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">VoiceFlow</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Características</a>
          <a href="#demo" className="hover:text-white transition-colors">Demo en vivo</a>
          <a href="#pricing" className="hover:text-white transition-colors">Precios</a>
          <a href="#enterprise" className="hover:text-white transition-colors">Empresas</a>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onConnectCalendar}
            className="hidden md:flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <Icon icon="solar:calendar-linear" width="14" />
            Calendar
          </button>
          <a href="#" className="hidden md:block text-xs font-medium hover:text-white transition-colors">Iniciar sesión</a>
          <button className="bg-white hover:bg-slate-200 text-[#0f172a] text-xs font-semibold px-4 py-2 rounded-full transition-colors flex items-center gap-2">
            Agendar demo
            <Icon icon="solar:arrow-right-linear" width="14" />
          </button>
        </div>
      </div>
    </nav>
  );
}
