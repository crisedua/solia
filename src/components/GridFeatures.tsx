import { Icon } from '@iconify/react';


export default function GridFeatures() {
    return (
        <section className="py-24 border-t border-white/5 bg-[#0b101b]">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-semibold text-white text-center mb-16 tracking-tight">Más ventas para tu negocio</h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="p-8 rounded-2xl bg-[#0f172a] border border-white/5 hover:border-white/10 transition-colors group">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                            <Icon icon="solar:globe-linear" width="24" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-3">Venta Global</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Vende a clientes de todo el mundo. Tus agentes hablan español, inglés, portugués y francés con fluidez comercial.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="p-8 rounded-2xl bg-[#0f172a] border border-white/5 hover:border-white/10 transition-colors group">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 mb-6 group-hover:scale-110 transition-transform">
                            <Icon icon="solar:user-hand-up-linear" width="24" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-3">Cierre de Ventas</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            La IA está entrenada para detectar señales de compra, manejar objeciones y cerrar el trato en la misma llamada.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="p-8 rounded-2xl bg-[#0f172a] border border-white/5 hover:border-white/10 transition-colors group">
                        <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
                            <Icon icon="solar:chart-2-linear" width="24" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-3">Analíticas de Conversión</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Panel de control para ver tasas de conversión, productos más vendidos y retorno de inversión en tiempo real.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
