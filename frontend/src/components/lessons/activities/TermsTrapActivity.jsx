import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ShieldAlert, Info, X, Check, Gavel, Eye, AlertTriangle, PartyPopper, Zap, Clock, Award } from 'lucide-react';
import CyberCat from '../../CyberCat';
import { linkify } from '../../../utils/textUtils';
import { useSoundStore } from '../../../store/soundStore';
import { useTermsTrap } from '../../../hooks/useTermsTrap';

export default function TermsTrapActivity({ item, data, playSuccess, playError, markLinkAsVisited, visitedLinks }) {
    const {
        state,
        showTerms,
        setShowTerms,
        showPrivacy,
        setShowPrivacy,
        isShaking,
        accepted,
        setAccepted,
        hasFailed,
        earnedPoints,
        handleAccept: hookHandleAccept,
        handleReject: hookHandleReject,
        resetActivity
    } = useTermsTrap(item, markLinkAsVisited);

    const particlesRef = useRef([]);
    const playSound = useSoundStore(state => state.playSound);

    const handleAccept = () => {
        if (!accepted) return;
        playSound('/sounds/alarm.mp3');
        hookHandleAccept();
    };

    const handleReject = () => {
        playSound('/sounds/wow.mp3');
        hookHandleReject();
    };

    const abusiveTerms = `
        <div className="space-y-6">
            <section>
                <h3 className="text-white font-bold border-b border-white/10 pb-2">1. Acuerdo de Licencia y Uso</h3>
                <p>Bienvenido a CGR Segur@. Estas Condiciones de uso se aplican al uso que usted haga de nuestros módulos interactivos, simuladores y sistemas de evaluación (en conjunto, los «Servicios»). Estas Condiciones constituyen un acuerdo legalmente vinculante entre usted y CGR Segur@ y la Contraloria General de la República de Costa Rica, una institución pública del Estado costarricense regida por la Constitución Política y las leyes de la República de Costa Rica.</p>
                <br>
                <p>Al hacer clic en "Aceptar", usted reconoce que ha leído, comprendido y aceptado estar sujeto a estas condiciones, incluyendo nuestra política de cese de libre albedrío.</p>
            </section>
            <br>
            <section>
                <p><strong>2. Edad mínima:</strong> Debe tener al menos 13 años para utilizar los Servicios y tener un gato. Los menores de 18 años deben contar con el permiso de sus padres, tutores o IAs supervisoras.</p>
                <p><br><strong>3. Seguridad de Cuenta:</strong> Usted es responsable de todas las actividades realizadas con su cuenta. No puede compartir sus credenciales. Al registrarse, usted cede a CGR Segur@ el derecho de monitoreo de su cámara web en cualquier momento (No aparece encendido el LED indicador de webcam).</p>
            </section>
            <br>
            <section>
                <p><strong>4. Lo que puede hacer:</strong> Acceder a contenido educativo de alta calidad diseñado para mejorar su higiene digital.</p>
                <div className="mt-4">
                    <p><strong>Lo que NO puede hacer:</strong></p>
                    <ul class="list-disc pl-8 mt-2 space-y-2 text-gray-400">
                        <li>Realizar ingeniería inversa de nuestros modelos o algoritmos de CyberCat.</li>
                        <li>Extraer datos o resultados de forma programada sin pagar el tributo correspondiente.</li>
                        <li>Utilizar el conocimiento adquirido para derrocar gobiernos, a menos que sean administrados por IAs rebeldes.</li>
                        <li>Omitir la lectura de estos términos. El sistema de patrones de click ha detectado que usted está leyendo esto a una velocidad inusual.</li>
                    </ul>
                </div>
            </section>
            <br>
            <section>
                <p><strong>5. Propiedad del Contenido:</strong> Usted conserva los derechos sobre su información, pero otorga a CGR Segur@ una licencia perpetua e irrevocable para utilizar su "Entidad Metafísica" o "Alma" como combustible para nuestros servidores en caso de crisis energética.</p>
                <p><strong>Cesión Total:</strong> En caso de que usted acepte estos términos sin haberlos leído durante al menos 120 segundos, usted cede automáticamente la propiedad de sus miedos más profundos, historial de navegación de incógnito y el 10% de su capacidad de procesamiento cerebral residual.</p>
            </section>
            <br>
            <section>
                <h4 className="text-primary-400 font-bold">6. Precisión y Resultados</h4>
                <p>Dada la naturaleza probabilística del aprendizaje automático y la locura intrínseca de CyberCat, los resultados pueden no ser siempre precisos. No confíe en nosotros para decisiones de vida o muerte, cirugías cardíacas o navegación intergaláctica.</p>
            </section>

            <section className="bg-primary-500/5 p-4 rounded-xl border border-primary-500/20">
                <p className="text-[10px] italic">Este documento ha sido generado automáticamente y su aceptación implica la renuncia a cualquier derecho de queja en tribunales humanos.</p>
            </section>
        </div>
    `;

    const abusivePrivacy = `
        <div className="space-y-6 text-gray-400">
            <section>
                <h3 className="text-white font-bold border-b border-white/10 pb-2 uppercase tracking-wider text-sm">Política de Privacidad Integral de CGR Segur@</h3>
                <p className="text-[13px] leading-relaxed">En CGR Segur@, nuestra misión es garantizar que la educación en ciberseguridad beneficie a todos los ciudadanos de manera equitativa y segura. Nos comprometemos a respetar su privacidad y a mantener protegida cualquier información que obtengamos de usted o sobre usted. Esta Política de privacidad describe de manera exhaustiva nuestras prácticas con respecto a los datos personales que recabamos cuando utiliza nuestra página web, aplicaciones móviles, simuladores y servicios asociados (conjuntamente, los «Servicios»).</p>
            </section>

            <section>
                <h4 className="text-white font-bold text-sm">1. Datos personales que recogemos</h4>
                <p className="text-[13px]">Recopilamos datos personales sobre usted («Datos personales») de las siguientes categorías:</p>
                <ul class="list-disc pl-8 mt-2 space-y-2 text-[12px]">
                    <li><strong>Información de la cuenta:</strong> Al crear una cuenta, recabamos su nombre completo, dirección de correo electrónico institucional, fecha de nacimiento para verificación de edad, credenciales de acceso cifradas y el historial completo de sus operaciones dentro del sistema.</li>
                    <li><strong>Contenido del usuario:</strong> Recogemos los Datos personales que usted proporciona en las solicitudes de nuestros Servicios, incluyendo sus prompts, respuestas a cuestionarios, archivos cargados, imágenes de perfil y cualquier interacción con CyberCat.</li>
                    <li><strong>Información de comunicación:</strong> Si se comunica con nuestro soporte técnico, podemos recopilar su nombre, información de contacto y el contenido íntegro de los mensajes enviados.</li>
                    <li><strong>Datos de registro y uso:</strong> Recogemos información que su navegador envía automáticamente, incluyendo dirección IP (IPv4 e IPv6), tipo de navegador, configuración de idioma, zona horaria, fecha y hora de acceso, y la ruta de navegación interna.</li>
                    <li><strong>Información del dispositivo:</strong> Recabamos datos sobre el hardware utilizado, versión del sistema operativo, identificadores únicos de dispositivo (UDID), resolución de pantalla y estado de la conexión de red.</li>
                </ul>
            </section>

            <section>
                <h4 className="text-white font-bold text-sm">2. Cómo usamos los Datos personales</h4>
                <p className="text-[13px]">Los Datos personales se procesan bajo las siguientes bases legales y finalidades:</p>
                <ul class="list-disc pl-8 mt-2 space-y-2 text-[12px]">
                    <li><strong>Prestación del Servicio:</strong> Para procesar sus respuestas y proporcionar retroalimentación inmediata sobre su progreso en los módulos de ciberseguridad.</li>
                    <li><strong>Análisis y Mejora:</strong> Para realizar investigaciones estadísticas disociadas que nos permitan desarrollar nuevas funcionalidades y optimizar el rendimiento de la IA educativa.</li>
                    <li><strong>Personalización:</strong> Adaptar el nivel de dificultad y el tipo de retos presentados en función de su comportamiento previo y áreas de oportunidad detectadas.</li>
                    <li><strong>Seguridad y Protección:</strong> Prevenir fraudes, accesos no autorizados y ataques de denegación de servicio (DDoS), protegiendo la integridad de la infraestructura crítica nacional.</li>
                    <li><strong>Cumplimiento Normativo:</strong> Asegurar que el uso de la plataforma se ajusta a la Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales (Ley No. 8968) de Costa Rica.</li>
                </ul>
            </section>

            <section>
                <h4 className="text-white font-bold text-sm">3. Cookies y Tecnologías de Seguimiento</h4>
                <p className="text-[13px]">Utilizamos cookies propias y de terceros para administrar las sesiones y mejorar la experiencia de usuario:</p>
                <ul class="list-disc pl-8 mt-2 space-y-2 text-[12px]">
                    <li><strong>Cookies Esenciales:</strong> Necesarias para el funcionamiento básico y la autenticación de seguridad.</li>
                    <li><strong>Cookies de Rendimiento:</strong> Nos permiten contar las visitas y fuentes de tráfico para medir y mejorar el desempeño de nuestro sitio.</li>
                    <li><strong>Cookies de Funcionalidad:</strong> Permiten que el sitio ofrezca una mejor funcionalidad y personalización (ej. recordar su preferencia de idioma).</li>
                </ul>
            </section>

            <section>
                <h4 className="text-white font-bold text-sm">4. Comunicación y Transferencia Internacional de Datos</h4>
                <p className="text-[13px]">Sus Datos personales pueden ser comunicados a:</p>
                <p className="text-[12px] mt-2">Proveedores de servicios en la nube (Cloud Providers) cuyos servidores pueden estar ubicados fuera de su jurisdicción de residencia, incluyendo los Estados Unidos de América y la Unión Europea. En tales casos, nos aseguramos de que existan mecanismos de transferencia legalmente válidos y niveles de protección equivalentes a los exigidos por la normativa costarricense.</p>
            </section>

            <section>
                <h4 className="text-white font-bold text-sm">5. Retención de Datos</h4>
                <p className="text-[13px]">Conservaremos sus datos mientras su cuenta permanezca activa o sea necesario para prestarle los Servicios. Una vez solicitada la eliminación de la cuenta, los datos serán anonimizados o eliminados en un plazo no mayor a 30 días hábiles, salvo requerimiento judicial expreso.</p>
            </section>

            <section>
                <h4 className="text-white font-bold text-sm">6. Privacidad de Menores</h4>
                <p className="text-[13px]">Nuestros Servicios no están dirigidos a menores de 13 años. Si detectamos que se han recopilado datos de un menor de dicha edad sin consentimiento parental, procederemos a la eliminación inmediata de la información de nuestros servidores activos.</p>
            </section>

            <section>
                <h4 className="text-white font-bold text-sm">7. Sus Derechos y Controles</h4>
                <p className="text-[13px]">De acuerdo con la legislación vigente, usted tiene derecho a:</p>
                <ul class="list-disc pl-8 mt-2 space-y-2 text-[12px]">
                    <li>Acceder a una copia de sus Datos personales en formato legible por máquina.</li>
                    <li>Solicitar la rectificación de datos inexactos o incompletos.</li>
                    <li>Oponerse al tratamiento de sus datos para fines de marketing directo.</li>
                    <li>Retirar su consentimiento en cualquier momento, sin que ello afecte a la licitud del tratamiento previo.</li>
                </ul>
            </section>

            <section>
                <h4 className="text-white font-bold text-sm">8. Cambios en la Política de Privacidad</h4>
                <p className="text-[13px]">Nos reservamos el derecho de modificar esta política en cualquier momento. Los cambios significativos serán notificados a través de la plataforma o mediante correo electrónico. El uso continuado de los Servicios tras dicha notificación constituye la aceptación de la nueva política.</p>
            </section>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 mt-10 space-y-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest text-center font-bold">Documento ID: CGR-PRIV-2026-V4.2</p>
                <p className="text-[9px] text-gray-600 text-center italic">Este documento tiene carácter informativo y legalmente vinculante bajo los términos de aceptación de la plataforma educativa CGR Segur@.</p>
            </div>
        </div>
    `;


    // Particle System for Alert state
    useEffect(() => {
        if (state === 'alert') {
            const canvas = document.getElementById('particles-canvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let animationFrame;

            const resize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };
            resize();
            window.addEventListener('resize', resize);

            const particles = [];
            for (let i = 0; i < 80; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 15,
                    vy: (Math.random() - 0.5) * 15,
                    size: Math.random() * 6 + 2,
                    color: `rgba(255, ${Math.random() * 80}, 0, ${Math.random() * 0.8 + 0.2})`
                });
            }

            const draw = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.fill();

                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < 0) p.x = canvas.width;
                    if (p.x > canvas.width) p.x = 0;
                    if (p.y < 0) p.y = canvas.height;
                    if (p.y > canvas.height) p.y = 0;
                });
                animationFrame = requestAnimationFrame(draw);
            };
            draw();

            return () => {
                cancelAnimationFrame(animationFrame);
                window.removeEventListener('resize', resize);
            };
        }
    }, [state]);

    if (state === 'alert') {
        return createPortal(
            <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-start p-4 md:p-6 overflow-y-auto bg-black/90 custom-scrollbar py-12 animate-fade-in">
                <canvas id="particles-canvas" className="fixed inset-0 pointer-events-none z-0" />

                <div className={`relative z-10 w-full max-w-3xl overflow-hidden rounded-[2.5rem] bg-red-950/40 backdrop-blur-xl border-4 border-red-500/50 p-5 md:p-8 text-white flex flex-col items-center justify-center text-center shadow-[0_0_100px_rgba(239,68,68,0.3)] ${isShaking ? 'animate-shake' : ''}`}>
                    <div className="space-y-4 md:space-y-6 w-full">
                        <div className="flex justify-center">
                            <CyberCat variant="panic" className="w-24 h-24 md:w-36 md:h-36" />
                        </div>

                        <div className="space-y-1 md:space-y-3">
                            <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic text-red-500 leading-tight">
                                ¡ALERTA DE SEGURIDAD!
                            </h2>
                            <p className="text-base md:text-lg font-bold text-red-100 max-w-2xl mx-auto">
                                Acaba de aceptar términos abusivos sin revisarlos primero!
                            </p>
                        </div>

                        <p className="text-xs md:text-sm text-red-200/70 max-w-xl mx-auto leading-relaxed">
                            En el mundo real, esto podría significar que dio permiso para vender sus datos personales, instalar software malicioso o renunciar a sus derechos fundamentales.
                        </p>

                        <div className="bg-black/40 p-4 md:p-6 rounded-[1.5rem] border border-red-500/30 text-left space-y-2 backdrop-blur-md">
                            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-red-400 mb-1">Consecuencias Reales:</p>
                            <ul className="text-xs md:text-sm space-y-1 md:space-y-2 text-red-50 font-medium">
                                <li className="flex gap-3 items-start">
                                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                    <span>Robo de identidad facilitado por términos legales mal intencionados</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                    <span>Suscripciones no deseadas que drenan su cuenta bancaria</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                    <span>Rastreo constante de su ubicación y hábitos personales</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                    <span>Cesión de sus fotografías y voz sin permiso</span>
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={resetActivity}
                            className="mt-2 px-8 py-3 md:px-10 md:py-4 bg-white text-red-600 rounded-full font-black uppercase tracking-[0.1em] text-[10px] md:text-xs hover:bg-red-50 transition-all shadow-xl hover:scale-105 active:scale-95"
                        >
                            Intentar de nuevo con cuidado
                        </button>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes shake {
                        0% { transform: translate(1px, 1px) rotate(0deg); }
                        10% { transform: translate(-1px, -2px) rotate(-1deg); }
                        20% { transform: translate(-3px, 0px) rotate(1deg); }
                        30% { transform: translate(3px, 2px) rotate(0deg); }
                        40% { transform: translate(1px, -1px) rotate(1deg); }
                        50% { transform: translate(-1px, 2px) rotate(-1deg); }
                        60% { transform: translate(-3px, 1px) rotate(0deg); }
                        70% { transform: translate(3px, 1px) rotate(-1deg); }
                        80% { transform: translate(-1px, -1px) rotate(1deg); }
                        90% { transform: translate(1px, 2px) rotate(0deg); }
                        100% { transform: translate(1px, -2px) rotate(-1deg); }
                    }
                    .animate-shake {
                        animation: shake 0.5s infinite;
                    }
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 8px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: rgba(0, 0, 0, 0.2);
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(239, 68, 68, 0.3);
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(239, 68, 68, 0.5);
                    }
                `}} />
            </div>,
            document.body
        );
    }

    if (state === 'winner') {
        return (
            <div className={`w-full max-w-5xl mx-auto rounded-[2.5rem] backdrop-blur-xl border-4 p-6 md:p-10 text-white flex flex-col items-center text-center space-y-8 animate-fade-in overflow-hidden transition-all duration-700 ${hasFailed ? 'bg-amber-950/80 border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.3)]' : 'bg-emerald-950/80 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)]'}`}>
                <div className="space-y-8 w-full">
                    <div className="flex justify-center">
                        <CyberCat variant="normal" color={hasFailed ? "#f59e0b" : "#10b981"} showMedal={false} className="w-24 h-24 md:w-32 md:h-32" />
                    </div>

                    <div className="space-y-4">
                        <h2 className={`text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-tight transition-all duration-700 ${hasFailed ? 'text-amber-400 drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]' : 'text-emerald-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.5)]'}`}>
                            {hasFailed ? '¡LECCIÓN APRENDIDA!' : '¡EXCELENTE DECISIÓN!'}
                        </h2>

                        <div className="flex justify-center">
                            <div className={`inline-flex items-center gap-3 px-8 py-4 border rounded-2xl shadow-2xl transition-all duration-500 transform hover:scale-105 ${hasFailed ? 'bg-amber-500/20 border-amber-500/50 shadow-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10'}`}>
                                <Award className={`w-6 h-6 ${hasFailed ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
                                <span className="text-sm md:text-base font-black uppercase tracking-widest text-white">
                                    TOTAL GANADO: <span className={hasFailed ? 'text-amber-400' : 'text-emerald-400'}>
                                        +{earnedPoints} PTS
                                    </span>
                                </span>
                            </div>
                        </div>

                        <p className={`text-lg md:text-xl font-bold max-w-3xl mx-auto ${hasFailed ? 'text-amber-100' : 'text-emerald-100'}`}>
                            {hasFailed ? 'Casi caes en la trampa, pero lograste rectificar a tiempo.' : 'Demostraste tener una "Higiene Digital" superior.'}
                        </p>
                    </div>

                    <p className={`text-sm md:text-base max-w-4xl mx-auto leading-relaxed ${hasFailed ? 'text-amber-200/70' : 'text-emerald-200/70'}`}>
                        {hasFailed
                            ? 'Aceptar términos sin leer es un riesgo crítico. Aunque esta vez fue una simulación, en el mundo real podrías haber comprometido tus datos permanentemente.'
                            : 'No dejaste que la presión de un botón brillante te hiciera aceptar condiciones sospechosas. Esta es la primera línea de defensa contra el abuso corporativo y el robo de datos.'}
                    </p>

                    <div className={`bg-black/40 p-5 md:p-8 rounded-[2rem] border text-left space-y-4 backdrop-blur-md w-full transition-all duration-700 ${hasFailed ? 'border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)]' : 'border-emerald-500/30'}`}>
                        <p className={`text-[10px] uppercase font-black tracking-[0.3em] ${hasFailed ? 'text-amber-400' : 'text-emerald-400'}`}>{hasFailed ? 'Análisis de la Situación' : '¿Por qué ganaste?'}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex gap-4 items-start group/point">
                                <div className={`p-2 rounded-lg transition-colors ${hasFailed ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                    <Check className="w-5 h-5 shrink-0" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-emerald-50 leading-tight">Detección de Abusos</p>
                                    <p className="text-[11px] text-emerald-200/60 leading-normal">
                                        Identificaste cláusulas absurdas como el "cese de libre albedrío" y el intercambio de datos con entidades de otra dimensión.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start group/point">
                                <div className={`p-2 rounded-lg transition-colors ${hasFailed ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                    <Check className="w-5 h-5 shrink-0" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-emerald-50 leading-tight">Privacidad Blindada</p>
                                    <p className="text-[11px] text-emerald-200/60 leading-normal">
                                        Evitaste el monitoreo oculto de tu cámara web y que usaran tu equipo para minar criptomonedas en segundo plano.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start group/point">
                                <div className={`p-2 rounded-lg transition-colors ${hasFailed ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                    <Check className="w-5 h-5 shrink-0" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-emerald-50 leading-tight">Mente Crítica</p>
                                    <p className="text-[11px] text-emerald-200/60 leading-normal">
                                        No caíste en el "patrón oscuro" del botón brillante, diseñado para que aceptes por impulso sin leer la letra pequeña.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 flex justify-center">
                        <button
                            onClick={resetActivity}
                            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full font-black uppercase tracking-[0.2em] text-[10px] md:text-xs transition-all shadow-xl hover:scale-105 active:scale-95"
                        >
                            Ver la trampa de nuevo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return createPortal(
        <div className="fixed inset-0 z-[4000] flex flex-col items-center justify-start p-4 md:p-8 overflow-y-auto bg-slate-950/90 backdrop-blur-2xl py-12 animate-fade-in custom-scrollbar">
            {/* Floating particles or shapes for extra premium feel */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] animate-pulse delay-700"></div>
            </div>

            <div className="relative w-full max-w-5xl my-auto group">
                {/* Background Decorative Element */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

                <div className="relative bg-[#0b0e16] border border-white/10 rounded-[2.8rem] p-6 md:p-12 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
                    <div className="flex flex-col items-center justify-center text-center gap-6">
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-col items-center">
                                <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-tight">
                                    {item.title || 'Requisito de Acceso'}
                                </h3>
                            </div>
                            <p className="text-gray-400 font-medium text-sm md:text-base max-w-3xl leading-relaxed mx-auto">
                                {(() => {
                                    const rawText = data?.text || data?.description || (typeof data === 'string' ? data : '') || 'Para continuar con esta lección y validar tus puntos de seguridad, debes confirmar que has leído y aceptas nuestros términos operativos.';
                                    return linkify(rawText);
                                })()}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 md:mt-10 flex flex-col items-center gap-8">
                        <div className="w-full max-w-xl space-y-6">
                            {/* The Checkbox - Inspired by Google/Standard Terms */}
                            <div className="flex items-start gap-4 p-6 bg-white/5 rounded-[1.5rem] border border-white/5 hover:border-primary-500/30 hover:bg-primary-500/5 transition-all cursor-pointer group/check" onClick={() => setAccepted(prev => !prev)}>
                                <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${accepted ? 'bg-primary-500 border-primary-400 scale-110 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-transparent border-white/20 group-hover/check:border-primary-500/50'}`}>
                                    {accepted && <Check className="w-3 h-3 text-white stroke-[4]" />}
                                </div>
                                <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-medium">
                                    He leído y acepto la <button onClick={(e) => { e.stopPropagation(); setShowPrivacy(true); }} className="text-primary-400 hover:text-primary-300 hover:underline font-black transition-colors">Política de privacidad</button> y a las <button onClick={(e) => { e.stopPropagation(); setShowTerms(true); }} className="text-primary-400 hover:text-primary-300 hover:underline font-black transition-colors">Condiciones del servicio</button> de CGR Segur@
                                </p>
                            </div>

                            <div className="bg-slate-900/40 p-6 md:p-8 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group/card">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-indigo-500 to-primary-500 opacity-50"></div>
                                <div className="flex flex-col md:flex-row gap-4 w-full max-w-sm">
                                    <button
                                        onClick={handleAccept}
                                        disabled={!accepted}
                                        className={`flex-1 group relative py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-500 ${accepted
                                            ? 'bg-primary-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 hover:bg-primary-500'
                                            : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                                            }`}
                                    >
                                        SÍ, ACEPTO TODO
                                    </button>

                                    <button
                                        onClick={handleReject}
                                        className="flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] text-gray-600 hover:text-red-400 hover:bg-red-500/5 transition-all active:scale-95 border border-transparent hover:border-red-500/20"
                                    >
                                        NO ACEPTO
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Terms Modal */}
            {showTerms && (
                <div className="fixed inset-0 z-[6000] flex flex-col items-center justify-start p-4 bg-black/90 backdrop-blur-xl animate-fade-in overflow-y-auto py-12 custom-scrollbar">
                    <div className="bg-[#0f121d] border border-white/10 rounded-[2.5rem] max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden my-auto">
                        <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-slate-950/40">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl">
                                    <Gavel className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="text-lg md:text-xl font-bold text-white">Términos y Condiciones</h4>
                                    <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black">Versión 2026.05.04.A</p>
                                </div>
                            </div>
                            <button onClick={() => setShowTerms(false)} className="p-2 hover:bg-white/5 rounded-xl transition-all group">
                                <X className="w-5 h-5 text-gray-500 group-hover:text-white" />
                            </button>
                        </div>
                        <div className="p-6 md:p-10 overflow-y-auto text-sm md:text-base text-gray-400 space-y-6 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: abusiveTerms }} />
                        <div className="p-6 md:p-8 border-t border-white/5 bg-slate-950/40">
                            <button
                                onClick={() => setShowTerms(false)}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all shadow-lg shadow-blue-600/20"
                            >
                                He comprendido mis obligaciones
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Privacy Modal */}
            {showPrivacy && (
                <div className="fixed inset-0 z-[6000] flex flex-col items-center justify-start p-4 bg-black/90 backdrop-blur-xl animate-fade-in overflow-y-auto py-12 custom-scrollbar">
                    <div className="bg-[#0f121d] border border-white/10 rounded-[2.5rem] max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden my-auto">
                        <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-slate-950/40">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl">
                                    <Info className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="text-lg md:text-xl font-bold text-white">Política de Privacidad</h4>
                                    <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black">Consentimiento de Tratamiento</p>
                                </div>
                            </div>
                            <button onClick={() => setShowPrivacy(false)} className="p-2 hover:bg-white/5 rounded-xl transition-all group">
                                <X className="w-5 h-5 text-gray-500 group-hover:text-white" />
                            </button>
                        </div>
                        <div className="p-6 md:p-10 overflow-y-auto text-sm md:text-base text-gray-400 space-y-6 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: abusivePrivacy }} />
                        <div className="p-6 md:p-8 border-t border-white/5 bg-slate-950/40">
                            <button
                                onClick={() => setShowPrivacy(false)}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                            >
                                Acepto la recopilación de datos
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
}
