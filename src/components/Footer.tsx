import { Icon } from '@iconify/react';


export default function Footer() {
    return (
        <footer className="bg-[#0f172a] border-t border-white/5 pt-20 pb-10 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 mb-20">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12">

                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white">
                            <Icon icon="solar:voice-scan-linear" width="14" />
                        </div>
                        <span className="text-sm font-semibold text-white">VoiceFlow</span>
                    </div>

                    <div className="flex gap-12 md:gap-24">
                        <div className="flex flex-col gap-4">
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Producto</h4>
                            <a href="#" className="text-xs text-slate-300 hover:text-white transition-colors">Características</a>
                            <a href="#" className="text-xs text-slate-300 hover:text-white transition-colors">Integraciones</a>
                            <a href="#" className="text-xs text-slate-300 hover:text-white transition-colors">Precios</a>
                            <a href="#" className="text-xs text-slate-300 hover:text-white transition-colors">API Docs</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Compañía</h4>
                            <a href="#" className="text-xs text-slate-300 hover:text-white transition-colors">Nosotros</a>
                            <a href="#" className="text-xs text-slate-300 hover:text-white transition-colors">Blog</a>
                            <a href="#" className="text-xs text-slate-300 hover:text-white transition-colors">Carreras</a>
                            <a href="#" className="text-xs text-slate-300 hover:text-white transition-colors">Contacto</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Giant Typography Effect */}
            <div className="w-full flex justify-center items-end leading-none select-none pointer-events-none opacity-5">
                <h1 className="text-[18vw] font-bold tracking-tighter text-white whitespace-nowrap translate-y-[20%]">
                    VOICE AI
                </h1>
            </div>

            <div className="border-t border-white/5 pt-8 mt-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <span className="text-[10px] text-slate-500">© 2024 VoiceFlow AI Inc. Todos los derechos reservados.</span>
                    <div className="flex gap-4 text-slate-500">
                        <a href="#" className="hover:text-white transition-colors"><Icon icon="solar:brand-twitter-linear" width="16" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Icon icon="solar:brand-linkedin-linear" width="16" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Icon icon="solar:brand-github-linear" width="16" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
