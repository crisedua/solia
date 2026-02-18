import React from 'react';

export default function Hero() {
    React.useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://elevenlabs.io/convai-widget/index.js";
        script.async = true;
        script.type = "text/javascript";
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);

    const startConversation = () => {
        const existingWidget = document.querySelector('elevenlabs-convai');
        if (existingWidget) return;

        const widget = document.createElement('elevenlabs-convai');
        widget.setAttribute('agent-id', 'agent_5801kh1zs5kbfpkrk059x3hqet8v'); // Updated ID with tools
        document.body.appendChild(widget);

        // Client-side tool handling
        widget.addEventListener('elevenlabs-convai:call', async (event: any) => {
            const { name, parameters, request_id } = event.detail;
            console.log('Tool called:', name, parameters);

            try {
                let result = {};
                if (name === 'checkAvailability') {
                    const response = await fetch('/api/check-availability', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(parameters)
                    });
                    result = await response.json();
                } else if (name === 'scheduleMeeting') {
                    const response = await fetch('/api/schedule-meeting', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(parameters)
                    });
                    result = await response.json();
                } else if (name === 'createLead') {
                    const response = await fetch('/api/create-lead', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(parameters)
                    });
                    result = await response.json();
                } else {
                    console.warn(`Unknown tool called: ${name}`);
                    return;
                }

                // Send response back to agent
                // Note: The widget automatically handles the response if we return it? 
                // Or do we need to call a method? Documentation for client tools says:
                // "The widget will emit a 'elevenlabs-convai:call' event... 
                // You must respond by calling the .reply() method on the widget."

                // Let's try sending the response back via the element method if it exists
                // Based on standard ElevenLabs widget behavior for client tools:
                if (widget && (widget as any).reply) {
                    (widget as any).reply(request_id, result);
                } else {
                    // Start a custom event dispatch if method not found (fallback)
                    console.log('Tool Result:', result);
                }

            } catch (error) {
                console.error('Error executing tool:', error);
                if (widget && (widget as any).reply) {
                    (widget as any).reply(request_id, { error: 'Failed to execute tool' });
                }
            }
        });
    };

    return (
        <main className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-[#5B5BD6]/10 blur-[120px] rounded-full pointer-events-none opacity-60"></div>
            <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-purple-300/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ededfc] border border-[#5B5BD6]/20 text-[#5B5BD6] text-xs font-medium mb-8 cursor-default animate-fade-in-up">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5B5BD6] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5B5BD6]"></span>
                    </span>
                    Disponible en Español, Inglés y Portugués
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl font-semibold text-[#1a1a2e] tracking-tight leading-[1.1] mb-6 max-w-4xl">
                    Agentes de voz para tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B5BD6] to-[#7c7ce8]">teléfono y sitio web.</span>
                </h1>

                {/* Subhead */}
                <p className="text-lg md:text-xl text-[#6b7280] max-w-2xl mb-10 leading-relaxed font-normal">
                    Atiende llamadas y visitas 24/7. Genera leads, agenda citas y resuelve dudas de forma natural. Sin esperas, sin perder clientes.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col md:flex-row items-center gap-4 mb-20">
                    <button
                        onClick={startConversation}
                        className="h-12 px-8 rounded-full bg-[#5B5BD6] text-white text-sm font-semibold hover:bg-[#4a4ac4] transition-colors duration-200 shadow-md shadow-[#5B5BD6]/30">
                        Escuchar Demo
                    </button>
                    <button className="h-12 px-8 rounded-full bg-white border border-[#e8e8f0] text-[#1a1a2e] text-sm font-medium hover:border-[#5B5BD6]/30 transition-colors">
                        Ver integraciones
                    </button>
                </div>

            </div>

        </main>
    );
}

