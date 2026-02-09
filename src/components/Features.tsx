import { Icon } from '@iconify/react';


export default function Features() {
    return (
        <section id="features" className="py-24 border-t border-white/5 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <div>
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                            <Icon icon="solar:cart-large-linear" width="24" strokeWidth="1.5" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight mb-6">
                            Vende mientras duermes.
                        </h2>
                        <p className="text-lg text-slate-400 leading-relaxed mb-8">
                            No pierdas clientes por llamar fuera de horario. Nuestra IA atiende dudas, ofrece productos y cierra ventas en cualquier momento del día.
                        </p>

                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-slate-300">
                                <Icon icon="solar:check-circle-bold" className="text-blue-500" width="20" />
                                <span>Atención inmediata para compradores impulsivos.</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <Icon icon="solar:check-circle-bold" className="text-blue-500" width="20" />
                                <span>Información precisa de tu catálogo 24/7.</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <Icon icon="solar:check-circle-bold" className="text-blue-500" width="20" />
                                <span>Procesamiento de pagos seguro y rápido.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Visual (Phone Interface) */}
                    <div className="relative group perspective-1000">
                        <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>

                        <div className="relative rounded-[2.5rem] bg-[#000000] border-4 border-[#1e293b] p-2 shadow-2xl transform rotate-[-2deg] group-hover:rotate-0 transition-transform duration-500 max-w-xs mx-auto">
                            {/* Screen */}
                            <div className="bg-slate-900 rounded-[2rem] overflow-hidden h-[560px] relative flex flex-col">
                                {/* Status Bar */}
                                <div className="h-12 flex justify-between items-center px-6 text-white text-xs pt-2">
                                    <span>03:20</span>
                                    <div className="flex gap-1.5">
                                        <Icon icon="solar:signal-linear" width="14" />
                                        <Icon icon="solar:wifi-linear" width="14" />
                                        <Icon icon="solar:battery-charge-linear" width="14" />
                                    </div>
                                </div>

                                {/* Incoming Call UI */}
                                <div className="flex-1 flex flex-col items-center pt-12 relative z-10">
                                    <div className="text-lg text-slate-400 font-medium mb-2">Llamada entrante...</div>
                                    <h3 className="text-3xl font-semibold text-white mb-8">Cliente Nuevo</h3>

                                    <div className="w-32 h-32 rounded-full bg-gradient-to-b from-slate-700 to-slate-800 flex items-center justify-center mb-auto relative">
                                        <Icon icon="solar:user-rounded-linear" width="64" className="text-slate-400" />
                                        <div className="absolute -right-2 -bottom-2 bg-green-500 rounded-full p-2 border-4 border-slate-900">
                                            <Icon icon="solar:microphone-3-bold" width="16" className="text-white" />
                                        </div>
                                    </div>

                                    {/* AI Processing Indicator */}
                                    <div className="w-full px-6 mb-8">
                                        <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">VoiceFlow AI</span>
                                            </div>
                                            <p className="text-xs text-white leading-relaxed">
                                                "Detecto intención de compra. Ofreciendo descuento por cierre inmediato..."
                                            </p>
                                        </div>
                                    </div>

                                    {/* Call Controls */}
                                    <div className="w-full pb-12 px-8 flex justify-between items-center mt-auto">
                                        <div className="flex flex-col items-center gap-2">
                                            <button className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 transition-colors">
                                                <Icon icon="solar:clock-circle-linear" width="24" />
                                            </button>
                                            <span className="text-[10px] text-slate-400">Recordar</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <button className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors">
                                                <Icon icon="solar:phone-hang-up-linear" width="28" />
                                            </button>
                                            <span className="text-[10px] text-slate-400">Colgar</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <button className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 transition-colors">
                                                <Icon icon="solar:keyboard-linear" width="24" />
                                            </button>
                                            <span className="text-[10px] text-slate-400">Teclado</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Abstract Background Shapes on Phone */}
                                <div className="absolute top-1/2 left-0 w-full h-full bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
