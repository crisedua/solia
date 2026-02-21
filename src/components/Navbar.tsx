import { useState } from 'react';
import { Icon } from '@iconify/react';

export default function Navbar() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 border-b border-[#e8e8f0] bg-white/90 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#5B5BD6] flex items-center justify-center text-white">
              <Icon icon="solar:lightbulb-bolt-bold-duotone" width="20" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-[#1a1a2e]">Sol-IA</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#precios" className="hidden md:block text-xs font-medium text-[#6b7280] hover:text-[#1a1a2e] transition-colors">Precios</a>
            <a href="/admin/login" className="hidden md:block text-xs font-medium text-[#6b7280] hover:text-[#1a1a2e] transition-colors">Admin</a>
            <button
              onClick={() => setIsContactOpen(true)}
              className="bg-[#5B5BD6] hover:bg-[#4a4ac4] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors shadow-sm shadow-[#5B5BD6]/20"
            >
              Contacto
            </button>
          </div>
        </div>
      </nav>

      {isContactOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsContactOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-fade-in-up border border-[#e8e8f0]">
            <button
              onClick={() => setIsContactOpen(false)}
              className="absolute top-4 right-4 text-[#9ca3af] hover:text-[#1a1a2e] transition-colors"
            >
              <Icon icon="solar:close-circle-linear" width="24" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#ededfc] flex items-center justify-center text-[#5B5BD6] mb-4">
                <Icon icon="solar:user-circle-bold" width="32" />
              </div>

              <h3 className="text-xl font-semibold text-[#1a1a2e] mb-1">Eduardo Escalante</h3>
              <p className="text-sm text-[#6b7280] mb-6">Contacto Directo</p>

              <div className="w-full space-y-3">
                <a href="mailto:eduardo@solia.pro" className="flex items-center gap-3 p-3 rounded-xl bg-[#f8f8fc] hover:bg-[#ededfc] transition-colors group border border-[#e8e8f0] hover:border-[#5B5BD6]/20">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#5B5BD6] shadow-sm">
                    <Icon icon="solar:letter-linear" width="18" />
                  </div>
                  <span className="text-sm text-[#374151] font-medium group-hover:text-[#5B5BD6]">eduardo@solia.pro</span>
                </a>

                <a href="tel:+56975387007" className="flex items-center gap-3 p-3 rounded-xl bg-[#f8f8fc] hover:bg-[#ededfc] transition-colors group border border-[#e8e8f0] hover:border-[#5B5BD6]/20">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#5B5BD6] shadow-sm">
                    <Icon icon="solar:phone-calling-linear" width="18" />
                  </div>
                  <span className="text-sm text-[#374151] font-medium group-hover:text-[#5B5BD6]">+56 9 7538 7007</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
