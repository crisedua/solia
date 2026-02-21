

export default function Hero() {


    return (
        <main className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-[#5B5BD6]/10 blur-[120px] rounded-full pointer-events-none opacity-60"></div>
            <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-purple-300/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">

                {/* Badge */}


                {/* Headline */}
                <h1 className="text-5xl md:text-7xl font-semibold text-[#1a1a2e] tracking-tight leading-[1.1] mb-6 max-w-4xl">
                    Agentes de voz para tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B5BD6] to-[#7c7ce8]">teléfono y sitio web.</span>
                </h1>

                {/* Subhead */}
                <p className="text-lg md:text-xl text-[#6b7280] max-w-2xl mb-10 leading-relaxed font-normal">
                    Atiende llamadas y visitas 24/7. Genera leads, agenda citas y resuelve dudas de forma natural. Sin esperas, sin perder clientes.
                </p>

                {/* CTA - Demo Call */}
                <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-[#5B5BD6]/5 to-purple-500/5 border border-[#5B5BD6]/20 max-w-2xl">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5B5BD6] to-[#7c7ce8] flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <p className="text-sm text-[#6b7280] font-medium">¿Quieres escuchar un agente en acción?</p>
                            <a href="tel:+56600914386" className="text-2xl font-bold text-[#5B5BD6] hover:text-[#7c7ce8] transition-colors">
                                600 914 3865
                            </a>
                        </div>
                    </div>
                    <p className="text-sm text-[#6b7280]">
                        Llama ahora y experimenta cómo nuestro agente de IA atiende como un profesional real
                    </p>
                </div>



            </div>

        </main>
    );
}

