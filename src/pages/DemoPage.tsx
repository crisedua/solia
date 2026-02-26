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
    websiteUrl: string | null;
}

export default function DemoPage() {
    const { demoId } = useParams<{ demoId: string }>();
    const [demo, setDemo] = useState<DemoData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
    const [screenshotLoading, setScreenshotLoading] = useState(false);

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
            .then(data => {
                setDemo(data);
                setLoading(false);
                // Fetch screenshot if websiteUrl exists
                if (data.websiteUrl) {
                    setScreenshotLoading(true);
                    const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(data.websiteUrl)}&screenshot=true&meta=false`;
                    fetch(apiUrl)
                        .then(r => r.json())
                        .then(result => {
                            if (result.status === 'success' && result.data?.screenshot?.url) {
                                setScreenshotUrl(result.data.screenshot.url);
                            }
                        })
                        .catch(() => { /* screenshot failed silently */ })
                        .finally(() => setScreenshotLoading(false));
                }
            })
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

            <main className="flex-1 pt-20 pb-16">

                {/* Hero section with screenshot */}
                {(demo.websiteUrl || screenshotLoading) && (
                    <div className="relative w-full overflow-hidden bg-[#0f172a]" style={{ height: '420px' }}>
                        {/* Screenshot background */}
                        {screenshotLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                    <Icon icon="solar:refresh-linear" width={28} className="text-slate-400 animate-spin" />
                                    <p className="text-slate-500 text-sm">Cargando vista del sitio...</p>
                                </div>
                            </div>
                        )}
                        {screenshotUrl && (
                            <>
                                <img
                                    src={screenshotUrl}
                                    alt={`Vista del sitio web de ${demo.name}`}
                                    className="w-full h-full object-cover object-top opacity-40"
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/30 via-[#0f172a]/50 to-[#f8f8fc]" />
                            </>
                        )}

                        {/* Centered text over screenshot */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5B5BD6]/20 border border-[#5B5BD6]/30 text-[#a5b4fc] text-xs font-semibold mb-4">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5B5BD6] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5B5BD6]"></span>
                                </span>
                                Demostración en Vivo
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3 drop-shadow-lg">
                                {demo.name}
                            </h1>
                            {demo.websiteUrl && (
                                <a
                                    href={demo.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-400 text-sm hover:text-white transition-colors flex items-center gap-1"
                                >
                                    <Icon icon="solar:global-linear" width={14} />
                                    {demo.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* No screenshot: simple header */}
                {!demo.websiteUrl && !screenshotLoading && (
                    <div className="text-center pt-12 pb-6 px-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5B5BD6]/10 text-[#5B5BD6] text-xs font-semibold mb-5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5B5BD6] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5B5BD6]"></span>
                            </span>
                            Demostración en Vivo
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#1a1a2e]">
                            {demo.name}
                        </h1>
                    </div>
                )}

                <div className="max-w-2xl mx-auto px-6 mt-8 text-center">
                    <p className="text-lg text-[#6b7280]">
                        Prueba cómo nuestro agente de voz atiende llamadas, responde preguntas y agenda reuniones. Haz clic en el botón de la esquina inferior derecha para comenzar.
                    </p>
                </div>
            </main>

            <Footer />
            <ElevenLabsWidget agent-id={demo.agentId} variant="compact" />
        </div>
    );
}
