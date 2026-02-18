import { Icon } from '@iconify/react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-[#e8e8f0] bg-white/90 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#5B5BD6] flex items-center justify-center text-white">
            <Icon icon="solar:voice-scan-linear" width="20" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-[#1a1a2e]">Sol-IA</span>
        </div>



        <div className="flex items-center gap-4">
          <a href="/admin/login" className="hidden md:block text-xs font-medium text-[#6b7280] hover:text-[#1a1a2e] transition-colors">Admin</a>
          <button className="bg-[#5B5BD6] hover:bg-[#4a4ac4] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors shadow-sm shadow-[#5B5BD6]/20">
            Agendar demo
          </button>
        </div>
      </div>
    </nav>
  );
}
