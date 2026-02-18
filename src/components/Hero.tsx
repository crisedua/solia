import { Icon } from '@iconify/react';
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
                        className="h-12 px-8 rounded-full bg-[#5B5BD6] text-white text-sm font-semibold hover:bg-[#4a4ac4] transition-colors duration-200 shadow-md shadow-[#5B5BD6]/30 flex items-center gap-2">
                        <Icon icon="solar:phone-calling-linear" width="18" strokeWidth="1.5" />
                        Escuchar Demo
                    </button>
                    <button className="h-12 px-8 rounded-full bg-white border border-[#e8e8f0] text-[#1a1a2e] text-sm font-medium hover:border-[#5B5BD6]/30 transition-colors flex items-center gap-2">
                        Ver integraciones
                        <Icon icon="solar:alt-arrow-right-linear" width="16" strokeWidth="1.5" />
                    </button>
                </div>

                {/* Hero Visual (Interactive Dashboard Simulation) */}
                <div className="relative w-full max-w-5xl mx-auto perspective-1000">

                    {/* Floating Decorative Elements */}
                    <div className="absolute -left-12 top-1/3 glass-panel p-4 rounded-xl rotate-[-6deg] z-0 hidden lg:block w-64 animate-float">
                        <div className="flex items-center gap-3 mb-3 border-b border-[#e8e8f0] pb-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <Icon icon="solar:check-circle-linear" width="18" />
                            </div>
                            <div>
                                <div className="text-xs font-medium text-[#1a1a2e]">Lead Capturado</div>
                                <div className="text-[10px] text-[#6b7280]">Hace 2 min • Web</div>
                            </div>
                        </div>
                        <div className="text-xs text-[#374151]">"Cliente dejó sus datos para cotización."</div>
                    </div>

                    <div className="absolute -right-12 top-1/4 glass-panel p-4 rounded-xl rotate-[3deg] z-0 hidden lg:block w-64 animate-float-delayed">
                        <div className="flex items-center gap-3 mb-3 border-b border-[#e8e8f0] pb-2">
                            <div className="w-8 h-8 rounded-full bg-[#ededfc] flex items-center justify-center text-[#5B5BD6]">
                                <Icon icon="solar:user-plus-linear" width="18" />
                            </div>
                            <div>
                                <div className="text-xs font-medium text-[#1a1a2e]">Datos Guardados</div>
                                <div className="text-[10px] text-[#6b7280]">Google Sheets / CRM</div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="h-1.5 w-full bg-[#e8e8f0] rounded-full"></div>
                            <div className="h-1.5 w-2/3 bg-[#e8e8f0] rounded-full"></div>
                        </div>
                    </div>

                    {/* Main Interface */}
                    <div className="glass-card-dark rounded-xl overflow-hidden relative z-10">
                        {/* Window Controls */}
                        <div className="h-10 bg-[#f0f0fa] border-b border-[#e8e8f0] flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[#d1d1e0]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#d1d1e0]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#d1d1e0]"></div>
                            </div>
                            <div className="ml-auto flex items-center gap-2 text-[10px] text-[#6b7280] font-medium px-2 py-1 rounded bg-[#ededfc]">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Atención en Vivo
                            </div>
                        </div>

                        <div className="grid md:grid-cols-12 min-h-[500px]">
                            {/* Sidebar */}
                            <div className="md:col-span-3 bg-[#f8f8fc] border-r border-[#e8e8f0] p-4 hidden md:flex flex-col gap-4">
                                <div className="text-[10px] uppercase tracking-wider text-[#9ca3af] font-semibold mb-2">Actividad Reciente</div>

                                {/* Call Item Active */}
                                <div className="p-3 rounded-lg bg-[#ededfc] border border-[#5B5BD6]/20 cursor-pointer">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-medium text-[#1a1a2e]">+34 912 34...</span>
                                        <span className="text-[10px] text-[#5B5BD6]">En curso</span>
                                    </div>
                                    <div className="text-[10px] text-[#6b7280]">Intención: Agendar Cita</div>
                                </div>

                                {/* Call Item */}
                                <div className="p-3 rounded-lg hover:bg-[#f0f0fa] transition-colors cursor-pointer border border-transparent">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-medium text-[#374151]">Web Visitor</span>
                                        <span className="text-[10px] text-[#9ca3af]">2m</span>
                                    </div>
                                    <div className="text-[10px] text-[#9ca3af]">Consulta de Horarios</div>
                                </div>

                                {/* Call Item */}
                                <div className="p-3 rounded-lg hover:bg-[#f0f0fa] transition-colors cursor-pointer border border-transparent">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-medium text-[#374151]">+56 9 980...</span>
                                        <span className="text-[10px] text-[#9ca3af]">15m</span>
                                    </div>
                                    <div className="text-[10px] text-[#9ca3af]">Cita Confirmada (SMS)</div>
                                </div>
                            </div>

                            {/* Main Call Visualization */}
                            <div className="md:col-span-9 bg-white relative flex flex-col">

                                {/* Waveform Visualization Area */}
                                <div className="flex-1 flex flex-col items-center justify-center p-8 border-b border-[#e8e8f0] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#5B5BD6]/5 to-transparent"></div>

                                    {/* Central Avatar */}
                                    <div className="relative w-24 h-24 mb-8">
                                        <div className="absolute inset-0 bg-[#5B5BD6] rounded-full animate-pulse-ring"></div>
                                        <div className="absolute inset-2 bg-[#7c7ce8] rounded-full animate-pulse-ring" style={{ animationDelay: '0.5s' }}></div>
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#5B5BD6] to-[#7c7ce8] flex items-center justify-center shadow-xl shadow-[#5B5BD6]/30 z-10">
                                            <Icon icon="solar:microphone-3-linear" width="32" className="text-white" />
                                        </div>
                                    </div>

                                    {/* Live Transcript */}
                                    <div className="w-full max-w-md space-y-4">
                                        <div className="flex gap-3 animate-fade-in-up">
                                            <div className="text-[10px] font-bold text-[#9ca3af] mt-1 uppercase">Cliente</div>
                                            <p className="text-sm text-[#374151] leading-relaxed bg-[#f8f8fc] p-3 rounded-2xl rounded-tl-none border border-[#e8e8f0]">
                                                Hola, quería saber si tienen disponibilidad para una limpieza dental mañana por la tarde.
                                            </p>
                                        </div>
                                        <div className="flex gap-3 flex-row-reverse animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                                            <div className="text-[10px] font-bold text-[#5B5BD6] mt-1 uppercase">AI</div>
                                            <p className="text-sm text-white leading-relaxed bg-[#5B5BD6] p-3 rounded-2xl rounded-tr-none shadow-lg shadow-[#5B5BD6]/20">
                                                ¡Hola! Sí, tenemos un espacio disponible a las 4:00 PM. ¿Te gustaría que reservemos ese horario para ti? Solo necesito tu nombre.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Bar */}
                                <div className="h-16 bg-[#f8f8fc] border-t border-[#e8e8f0] flex items-center px-6 justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-2 w-24 bg-[#e8e8f0] rounded-full overflow-hidden">
                                            <div className="h-full w-full bg-[#5B5BD6] rounded-full"></div>
                                        </div>
                                        <span className="text-xs text-[#6b7280]">Intencionalidad: Agendar</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="p-2 hover:bg-[#f0f0fa] rounded-full text-[#9ca3af] transition-colors"><Icon icon="solar:pause-linear" width="20" /></button>
                                        <button className="p-2 hover:bg-[#f0f0fa] rounded-full text-[#9ca3af] transition-colors"><Icon icon="solar:settings-linear" width="20" /></button>
                                        <button className="px-3 py-1.5 bg-[#ededfc] text-[#5B5BD6] border border-[#5B5BD6]/20 rounded-md text-xs font-medium hover:bg-[#5B5BD6]/20 transition-colors">Ver Agenda</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#f8f8fc] to-transparent z-20 pointer-events-none"></div>
        </main>
    );
}
