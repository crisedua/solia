import { Icon } from '@iconify/react';


export default function Features() {
    return (
        <section id="features" className="py-24 border-t border-[#e8e8f0] relative bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <div>
                        <div className="w-12 h-12 rounded-xl bg-[#ededfc] border border-[#5B5BD6]/20 flex items-center justify-center text-[#5B5BD6] mb-6">
                            <Icon icon="solar:cart-large-linear" width="24" strokeWidth="1.5" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-semibold text-[#1a1a2e] tracking-tight mb-6">
                            Dos agentes, un objetivo: <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B5BD6] to-[#7c7ce8]">Más Clientes.</span>
                        </h2>
                        <p className="text-lg text-[#6b7280] leading-relaxed mb-8">
                            Tanto en tu línea telefónica como en tu página web, asegúrate de que cada interesado reciba la atención que necesita para convertirse en cliente.
                        </p>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-medium text-[#1a1a2e] mb-2 flex items-center gap-2">
                                    <Icon icon="solar:phone-calling-linear" className="text-[#5B5BD6]" width="24" />
                                    Agente Telefónico
                                </h3>
                                <p className="text-[#6b7280] leading-relaxed text-sm">
                                    Se te asigna un número 600 para atender a tus clientes 24/7. Contesta llamadas simultáneas, filtra spam y agenda reuniones automáticamente.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-medium text-[#1a1a2e] mb-2 flex items-center gap-2">
                                    <Icon icon="solar:laptop-minimalistic-linear" className="text-purple-500" width="24" />
                                    Agente Web
                                </h3>
                                <p className="text-[#6b7280] leading-relaxed text-sm">
                                    Conversa con los visitantes de tu sitio. Resuelve dudas y captura datos de contacto 24/7, directo a tu CRM.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Visual (Phone Interface) */}
                    <div className="relative group perspective-1000">
                        <div className="absolute inset-0 bg-[#5B5BD6]/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-700"></div>

                        <div className="relative rounded-[2.5rem] bg-[#1a1a2e] border-4 border-[#e8e8f0] p-2 shadow-2xl shadow-[#5B5BD6]/10 transform rotate-[-2deg] group-hover:rotate-0 transition-transform duration-500 max-w-xs mx-auto">
                            {/* Screen */}
                            <div className="bg-[#f8f8fc] rounded-[2rem] overflow-hidden h-[560px] relative flex flex-col">
                                {/* Status Bar */}
                                <div className="h-12 flex justify-between items-center px-6 text-[#1a1a2e] text-xs pt-2">
                                    <span>03:20</span>
                                    <div className="flex gap-1.5">
                                        <Icon icon="solar:signal-linear" width="14" />
                                        <Icon icon="solar:wifi-linear" width="14" />
                                        <Icon icon="solar:battery-charge-linear" width="14" />
                                    </div>
                                </div>

                                {/* Incoming Call UI */}
                                <div className="flex-1 flex flex-col items-center pt-12 relative z-10">
                                    <div className="text-lg text-[#6b7280] font-medium mb-2">Llamada entrante...</div>
                                    <h3 className="text-3xl font-semibold text-[#1a1a2e] mb-8">Cliente Nuevo</h3>

                                    <div className="w-32 h-32 rounded-full bg-[#ededfc] flex items-center justify-center mb-auto relative">
                                        <Icon icon="solar:user-rounded-linear" width="64" className="text-[#5B5BD6]" />
                                        <div className="absolute -right-2 -bottom-2 bg-[#5B5BD6] rounded-full p-2 border-4 border-[#f8f8fc]">
                                            <Icon icon="solar:microphone-3-bold" width="16" className="text-white" />
                                        </div>
                                    </div>

                                    {/* AI Processing Indicator */}
                                    <div className="w-full px-6 mb-8">
                                        <div className="bg-white rounded-2xl p-4 border border-[#e8e8f0] shadow-sm">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-2 h-2 rounded-full bg-[#5B5BD6] animate-pulse"></div>
                                                <span className="text-[10px] uppercase font-bold text-[#5B5BD6] tracking-wider">Sol-IA</span>
                                            </div>
                                            <p className="text-xs text-[#374151] leading-relaxed">
                                                "Detectando intención de cita. Verificando disponibilidad..."
                                            </p>
                                        </div>
                                    </div>

                                    {/* Call Controls */}
                                    <div className="w-full pb-12 px-8 flex justify-between items-center mt-auto">
                                        <div className="flex flex-col items-center gap-2">
                                            <button className="w-14 h-14 rounded-full bg-[#f0f0fa] flex items-center justify-center text-[#6b7280] hover:bg-[#ededfc] transition-colors">
                                                <Icon icon="solar:clock-circle-linear" width="24" />
                                            </button>
                                            <span className="text-[10px] text-[#9ca3af]">Recordar</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <button className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors">
                                                <Icon icon="solar:phone-hang-up-linear" width="28" />
                                            </button>
                                            <span className="text-[10px] text-[#9ca3af]">Colgar</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <button className="w-14 h-14 rounded-full bg-[#f0f0fa] flex items-center justify-center text-[#6b7280] hover:bg-[#ededfc] transition-colors">
                                                <Icon icon="solar:keyboard-linear" width="24" />
                                            </button>
                                            <span className="text-[10px] text-[#9ca3af]">Teclado</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-1/2 left-0 w-full h-full bg-gradient-to-t from-[#5B5BD6]/5 to-transparent pointer-events-none"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
