import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ElevenLabsWidget = 'elevenlabs-convai' as any;

interface DemoData {
    id: string;
    name: string;
    agentId: string;
}

export default function DemoPage() {
    const { demoId } = useParams<{ demoId: string }>();
    const [demo, setDemo] = useState<DemoData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
        script.async = true;
        script.type = "text/javascript";
        document.body.appendChild(script);
        return () => { document.body.removeChild(script); };
    }, []);

    useEffect(() => {
        if (!demoId) return;
        fetch(`/api/demos?action=get&id=${demoId}`)
            .then(res => {
                if (!res.ok) throw new Error('Demo no encontrada');
                return res.json();
            })
            .then(data => { setDemo(data); setLoading(false); })
            .catch(err => { setError(err.message); setLoading(false); });
    }, [demoId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f8fc] flex items-center justify-center">
                <Icon icon="solar:refresh-linear" width={28} className="text-[#5B5BD6] animate-spin" />
            </div>
        );
    }

    if (error || !demo) {
        return (
            <div className="min-h-screen bg-[#f8f8fc] text-[#1a1a2e] font-sans flex flex-col">
                <Navbar />
                <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-6">
                    <div className="max-w-md text-center">
                        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <Icon icon="solar:danger-triangle-linear" width={32} className="text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Demo no disponible</h1>
                        <p className="text-[#6b7280]">Este enlace de demostración no existe o ya no está disponible.</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f8fc] text-[#1a1a2e] overflow-x-hidden font-sans flex flex-col">
            <Navbar />

            <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-6">
                <div className="max-w-2xl text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5B5BD6]/10 text-[#5B5BD6] text-xs font-semibold mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5B5BD6] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5B5BD6]"></span>
                        </span>
                        Demostración en Vivo
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#1a1a2e]">
                        {demo.name}
                    </h1>

                    <p className="text-lg text-[#6b7280] mb-12">
                        Prueba cómo nuestro agente de voz atiende llamadas, responde preguntas y agenda reuniones. Haz clic en el botón de la esquina inferior derecha para comenzar.
                    </p>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#e8e8f0] text-left">
                        <h3 className="font-semibold text-xl mb-4 text-[#1a1a2e]">Qué probar:</h3>
                        <ul className="space-y-3 text-[#374151]">
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#ededfc] flex items-center justify-center text-[#5B5BD6] shrink-0 mt-0.5 text-sm font-semibold">1</div>
                                <span>Pide información sobre los servicios y planes.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#ededfc] flex items-center justify-center text-[#5B5BD6] shrink-0 mt-0.5 text-sm font-semibold">2</div>
                                <span>Haz preguntas frecuentes como horario de atención o precios.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#ededfc] flex items-center justify-center text-[#5B5BD6] shrink-0 mt-0.5 text-sm font-semibold">3</div>
                                <span>Intenta agendar una cita o reunión.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>

            <Footer />
            <ElevenLabsWidget agent-id={demo.agentId} variant="compact" />
        </div>
    );
}
