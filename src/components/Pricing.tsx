import { useState } from 'react';

export default function Pricing() {
    const [showForm, setShowForm] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        company: '',
        email: '',
        phone: '',
        plan: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const openForm = (plan: string) => {
        setSelectedPlan(plan);
        setFormData({ ...formData, plan });
        setShowForm(true);
        setSubmitted(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setSubmitted(true);
        setSubmitting(false);
        
        // Reset form after 3 seconds
        setTimeout(() => {
            setShowForm(false);
            setFormData({ fullName: '', company: '', email: '', phone: '', plan: '' });
            setSubmitted(false);
        }, 3000);
    };

    return (
        <>
        <section id="precios" className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-bold text-[#1a1a2e] mb-6">
                        Precios
                    </h2>
                    <p className="text-xl text-[#6b7280] max-w-2xl mx-auto">
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

                        <button 
                            onClick={() => openForm('Plan Pro')}
                            className="w-full py-3 px-6 rounded-lg bg-white border-2 border-[#5B5BD6] text-[#5B5BD6] font-semibold hover:bg-[#5B5BD6] hover:text-white transition-colors">
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

                        <button 
                            onClick={() => openForm('Plan Elite')}
                            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-[#5B5BD6] to-[#7c7ce8] text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all">
                            Comenzar Ahora
                        </button>
                    </div>

                </div>
            </div>
        </section>

        {/* Contact Form Modal */}
        {showForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !submitted && setShowForm(false)}></div>
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in-up">
                    {!submitted ? (
                        <>
                            <button
                                onClick={() => setShowForm(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="text-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5B5BD6] to-[#7c7ce8] flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-2">{selectedPlan}</h3>
                                <p className="text-sm text-[#6b7280]">Completa tus datos y te contactaremos pronto</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">Nombre Completo *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#5B5BD6] focus:ring-2 focus:ring-[#5B5BD6]/20 outline-none transition-all"
                                        placeholder="Juan Pérez"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">Empresa *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#5B5BD6] focus:ring-2 focus:ring-[#5B5BD6]/20 outline-none transition-all"
                                        placeholder="Mi Empresa S.A."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#5B5BD6] focus:ring-2 focus:ring-[#5B5BD6]/20 outline-none transition-all"
                                        placeholder="juan@empresa.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">Teléfono *</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#5B5BD6] focus:ring-2 focus:ring-[#5B5BD6]/20 outline-none transition-all"
                                        placeholder="+56 9 1234 5678"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">Plan *</label>
                                    <select
                                        required
                                        value={formData.plan}
                                        onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#5B5BD6] focus:ring-2 focus:ring-[#5B5BD6]/20 outline-none transition-all"
                                    >
                                        <option value="">Seleccionar plan</option>
                                        <option value="Plan Pro">Plan Pro - $25.000/mes</option>
                                        <option value="Plan Elite">Plan Elite - $45.000/mes</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-[#5B5BD6] to-[#7c7ce8] text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Enviando...' : 'Enviar Solicitud'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-[#1a1a2e] mb-2">¡Solicitud Enviada!</h3>
                            <p className="text-[#6b7280] mb-4">
                                Gracias por tu interés. Te contactaremos en las próximas 24 horas.
                            </p>
                            <p className="text-sm text-[#6b7280]">
                                Revisa tu email para más información.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        )}
        </>
    );
}
