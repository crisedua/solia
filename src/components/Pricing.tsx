export default function Pricing() {
    return (
        <section id="precios" className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-4">
                        Precios
                    </h2>
                    <p className="text-lg text-[#6b7280] max-w-2xl mx-auto">
                        Elige el plan que mejor se adapte a tu negocio
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    
                    {/* Plan Pro */}
                    <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-[#1a1a2e] mb-2">Plan Pro</h3>
                            <p className="text-[#6b7280] text-sm">Perfecto para empezar</p>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-4xl font-bold text-[#5B5BD6]">$25.000</span>
                                <span className="text-[#6b7280]">/mes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-[#6b7280] line-through">Instalación: $150.000</span>
                                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">¡SIN COSTO!</span>
                            </div>
                        </div>

                        {/* Features */}
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-[#5B5BD6] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-[#1a1a2e]">Agente de voz para sitio web</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-[#5B5BD6] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-[#1a1a2e]">Entrenamiento con tu información</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-[#5B5BD6] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-[#1a1a2e]">Registro de leads en Google Sheets</span>
                            </li>
                        </ul>

                        <button className="w-full py-3 px-6 rounded-lg bg-white border-2 border-[#5B5BD6] text-[#5B5BD6] font-semibold hover:bg-[#5B5BD6] hover:text-white transition-colors">
                            Comenzar
                        </button>
                    </div>

                    {/* Plan Elite */}
                    <div className="relative rounded-2xl border-2 border-[#5B5BD6] bg-gradient-to-br from-[#5B5BD6]/5 to-purple-500/5 p-8 shadow-lg">
                        {/* Popular Badge */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <span className="bg-gradient-to-r from-[#5B5BD6] to-[#7c7ce8] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                MÁS POPULAR
                            </span>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-[#1a1a2e] mb-2">Plan Elite</h3>
                            <p className="text-[#6b7280] text-sm">Solución completa para tu negocio</p>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-4xl font-bold text-[#5B5BD6]">$45.000</span>
                                <span className="text-[#6b7280]">/mes</span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-[#6b7280] line-through">Instalación: $250.000</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-green-600">Oferta: $150.000</span>
                                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">AHORRA $100K</span>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-[#5B5BD6] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-[#1a1a2e] font-medium">Número 600 exclusivo (gestionamos todo)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-[#5B5BD6] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-[#1a1a2e]">Agente de voz para sitio web</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-[#5B5BD6] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-[#1a1a2e]">Entrenamiento con tu información</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-[#5B5BD6] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-[#1a1a2e]">Registro de leads en Google Sheets</span>
                            </li>
                        </ul>

                        <button className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-[#5B5BD6] to-[#7c7ce8] text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all">
                            Comenzar Ahora
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}
