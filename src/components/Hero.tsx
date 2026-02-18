

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



            </div>

        </main>
    );
}

