import { Icon } from '@iconify/react';


export default function Integrations() {
    return (
        <section id="integrations" className="py-24 border-t border-[#e8e8f0] bg-[#f8f8fc]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-12 gap-16 items-center">

                    {/* Visual (CRM Dashboard) */}
                    <div className="lg:col-span-7 order-2 lg:order-1">
                        <div className="relative rounded-xl bg-white border border-[#e8e8f0] shadow-lg shadow-[#5B5BD6]/5 p-1 overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5B5BD6] via-purple-400 to-pink-400"></div>

                            {/* Header */}
                            <div className="bg-[#f8f8fc] border-b border-[#e8e8f0] p-4 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-[#5B5BD6] text-white flex items-center justify-center font-bold text-xs">GS</div>
                                    <span className="text-sm font-medium text-[#374151]">Google Sheets / CRM</span>
                                </div>
                                <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded border border-green-200">Conectado</span>
                            </div>

                            {/* Content */}
                            <div className="p-6 bg-white min-h-[300px] space-y-4">
                                {/* CRM Entry */}
                                <div className="bg-[#f8f8fc] border border-[#e8e8f0] rounded-lg p-4 hover:border-[#5B5BD6]/30 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#ededfc] flex items-center justify-center text-[#5B5BD6] font-semibold text-sm">JD</div>
                                            <div>
                                                <div className="text-sm font-medium text-[#1a1a2e]">Juan Domínguez</div>
                                                <div className="text-xs text-[#9ca3af]">juan.d@empresa.com</div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-[#9ca3af] bg-[#f0f0fa] px-2 py-1 rounded">Hoy, 02:30 AM</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex gap-2 items-center">
                                            <Icon icon="solar:record-circle-linear" className="text-[#5B5BD6]" width="12" />
                                            <div className="h-1 flex-1 bg-[#e8e8f0] rounded-full overflow-hidden">
                                                <div className="w-3/4 h-full bg-[#5B5BD6]/40"></div>
                                            </div>
                                            <span className="text-[10px] text-[#9ca3af]">04:12</span>
                                        </div>
                                        <div className="bg-[#ededfc] border border-[#5B5BD6]/10 rounded p-2">
                                            <p className="text-xs text-[#374151]"><span className="text-[#5B5BD6] font-semibold">Resumen AI:</span> Cliente consultó horarios disponibles. Se confirmó cita para el jueves a las 4 PM. Datos guardados en hoja de cálculo.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="lg:col-span-5 order-1 lg:order-2">
                        <div className="w-12 h-12 rounded-xl bg-[#ededfc] border border-[#5B5BD6]/20 flex items-center justify-center text-[#5B5BD6] mb-6">
                            <Icon icon="solar:layers-minimalistic-linear" width="24" strokeWidth="1.5" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-semibold text-[#1a1a2e] tracking-tight mb-6">
                            Tu información donde la necesitas.
                        </h2>
                        <p className="text-lg text-[#6b7280] leading-relaxed mb-8">
                            Cada conversación se transcribe y se guardan los datos clave (nombre, intención, contacto) directamente en tu Google Sheets, HubSpot, Salesforce o cualquier CRM que uses.
                        </p>
                        <button className="text-[#5B5BD6] font-medium text-sm">
                            Ver todas las integraciones
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}
