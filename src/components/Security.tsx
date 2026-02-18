import { Icon } from '@iconify/react';


export default function Security() {
    return (
        <section className="py-32 border-t border-[#e8e8f0] relative overflow-hidden bg-[#f8f8fc]">
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">

                {/* Security Toggle UI */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white p-1.5 rounded-full inline-flex items-center border border-[#e8e8f0] shadow-sm">
                        <div className="flex items-center gap-3 px-4 py-2 bg-[#ededfc] rounded-full border border-[#5B5BD6]/20">
                            <Icon icon="solar:shield-check-linear" className="text-[#5B5BD6]" width="18" />
                            <span className="text-xs font-semibold text-[#5B5BD6]">Encriptación E2E</span>
                        </div>
                        <div className="h-4 w-[1px] bg-[#e8e8f0] mx-2"></div>
                        <div className="flex items-center gap-2 px-3">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-xs font-medium text-[#6b7280]">SOC2 Compliant</span>
                        </div>
                    </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-semibold text-[#1a1a2e] tracking-tight mb-6">
                    Datos seguros, siempre.
                </h2>
                <p className="text-lg text-[#6b7280] mb-10 max-w-2xl mx-auto">
                    La privacidad es nuestra prioridad. Todas las conversaciones y datos de clientes están encriptados bajo los más altos estándares.
                </p>

                <button className="bg-[#5B5BD6] hover:bg-[#4a4ac4] text-white text-sm font-bold px-8 py-3 rounded-full transition-colors inline-flex items-center gap-2 shadow-md shadow-[#5B5BD6]/20">
                    Leer política de seguridad
                    <Icon icon="solar:arrow-right-linear" width="16" />
                </button>
            </div>

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#5B5BD6]/5 blur-[100px] rounded-full pointer-events-none"></div>
        </section>
    );
}
