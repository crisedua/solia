import { Icon } from '@iconify/react';


export default function GridFeatures() {
    return (
        <section className="py-24 border-t border-[#e8e8f0] bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a2e] text-center mb-16 tracking-tight">Lo que obtienes en la práctica</h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="p-8 rounded-2xl bg-[#f8f8fc] border border-[#e8e8f0] hover:border-[#5B5BD6]/30 hover:shadow-md hover:shadow-[#5B5BD6]/5 transition-all group">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                            <Icon icon="solar:clock-circle-linear" width="24" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#1a1a2e] mb-3">Disponibilidad Real 24/7</h3>
                        <p className="text-sm text-[#6b7280] leading-relaxed">
                            No es un slogan. El software no duerme ni se enferma. Tus clientes reciben respuesta inmediata, sea la hora que sea.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="p-8 rounded-2xl bg-[#f8f8fc] border border-[#e8e8f0] hover:border-[#5B5BD6]/30 hover:shadow-md hover:shadow-[#5B5BD6]/5 transition-all group">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                            <Icon icon="solar:user-hand-up-linear" width="24" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#1a1a2e] mb-3">Captura de Leads</h3>
                        <p className="text-sm text-[#6b7280] leading-relaxed">
                            Convierte visitantes y llamadas en oportunidades reales. El agente califica el interés y obtiene los datos de contacto.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="p-8 rounded-2xl bg-[#f8f8fc] border border-[#e8e8f0] hover:border-[#5B5BD6]/30 hover:shadow-md hover:shadow-[#5B5BD6]/5 transition-all group">
                        <div className="w-10 h-10 rounded-lg bg-[#ededfc] flex items-center justify-center text-[#5B5BD6] mb-6 group-hover:scale-110 transition-transform">
                            <Icon icon="solar:database-linear" width="24" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#1a1a2e] mb-3">Datos Organizados</h3>
                        <p className="text-sm text-[#6b7280] leading-relaxed">
                            Olvídate de tomar notas. Todo queda registrado y organizado en tu Excel o CRM de confianza automáticamente.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
