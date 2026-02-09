import { Icon } from '@iconify/react';


export default function Integrations() {
    return (
        <section className="py-24 border-t border-white/5 bg-[#0f172a]/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-12 gap-16 items-center">

                    {/* Visual (CRM Dashboard) */}
                    <div className="lg:col-span-7 order-2 lg:order-1">
                        <div className="relative rounded-xl bg-[#0b101b] border border-white/10 shadow-2xl p-1 overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                            {/* Header */}
                            <div className="bg-[#1e293b]/50 border-b border-white/5 p-4 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">SF</div>
                                    <span className="text-sm font-medium text-slate-300">Salesforce Integration</span>
                                </div>
                                <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">Conectado</span>
                            </div>

                            {/* Content */}
                            <div className="p-6 bg-slate-900/50 min-h-[300px] space-y-4">
                                {/* CRM Entry */}
                                <div className="bg-[#0f172a] border border-white/5 rounded-lg p-4 hover:border-blue-500/30 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">JD</div>
                                            <div>
                                                <div className="text-sm font-medium text-white">Juan Domínguez</div>
                                                <div className="text-xs text-slate-500">juan.d@empresa.com</div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-1 rounded">Hoy, 02:30 AM</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex gap-2 items-center">
                                            <Icon icon="solar:record-circle-linear" className="text-red-400" width="12" />
                                            <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="w-3/4 h-full bg-slate-600"></div>
                                            </div>
                                            <span className="text-[10px] text-slate-500">04:12</span>
                                        </div>
                                        <div className="bg-blue-900/10 border border-blue-500/10 rounded p-2">
                                            <p className="text-xs text-slate-300"><span className="text-blue-400 font-semibold">Resumen AI:</span> Cliente solicitó precio del servicio. Se le explicó la oferta actual. Confirmó la compra y se enviaron los datos de pago al email.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="lg:col-span-5 order-1 lg:order-2">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                            <Icon icon="solar:layers-minimalistic-linear" width="24" strokeWidth="1.5" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight mb-6">
                            Ventas sincronizadas con tu CRM.
                        </h2>
                        <p className="text-lg text-slate-400 leading-relaxed mb-8">
                            Cada venta realizada por la voz IA se registra automáticamente en tu CRM, actualiza el inventario y envía correos de confirmación al instante.
                        </p>
                        <button className="text-white font-medium text-sm flex items-center gap-2 hover:gap-3 transition-all">
                            Ver todas las integraciones
                            <Icon icon="solar:arrow-right-linear" width="16" />
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}
