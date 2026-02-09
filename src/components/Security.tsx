import { Icon } from '@iconify/react';


export default function Security() {
    return (
        <section className="py-32 border-t border-white/5 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">

                {/* Security Toggle UI */}
                <div className="flex justify-center mb-12">
                    <div className="bg-[#1e293b] p-1.5 rounded-full inline-flex items-center border border-white/10 shadow-2xl">
                        <div className="flex items-center gap-3 px-4 py-2 bg-[#0f172a] rounded-full border border-white/5">
                            <Icon icon="solar:shield-check-linear" className="text-green-400" width="18" />
                            <span className="text-xs font-semibold text-white">Encriptación E2E</span>
                        </div>
                        <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
                        <div className="flex items-center gap-2 px-3">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-xs font-medium text-slate-400">SOC2 Compliant</span>
                        </div>
                    </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-6">
                    Datos seguros, ventas seguras.
                </h2>
                <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
                    La privacidad es nuestra prioridad. Todas las conversaciones de venta y datos de clientes están encriptados bajo los más altos estándares.
                </p>

                <button className="bg-white hover:bg-slate-200 text-[#0f172a] text-sm font-bold px-8 py-3 rounded-full transition-colors inline-flex items-center gap-2">
                    Leer política de seguridad
                    <Icon icon="solar:arrow-right-linear" width="16" />
                </button>
            </div>

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>
        </section>
    );
}
