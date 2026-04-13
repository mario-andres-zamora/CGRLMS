import { useState, useEffect, useMemo } from 'react';
import DOMPurify from 'dompurify';
import { PlayCircle, CheckCircle, CheckCircle2, XCircle, Download, FileText, Link as LinkIcon, Shield, Award, HelpCircle, ClipboardList, Upload, Zap, Eye, RotateCcw, Clock, AlertTriangle, Type, Lock, Unlock, CheckSquare, Smartphone, ShieldAlert, Terminal, Heart, MessageCircle, Share2, Camera, Calendar, Briefcase, Users, AtSign, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSoundStore } from '../../store/soundStore';
import YouTubePlayer from './YouTubePlayer';
import { HACK_PROFILES } from '../../utils/gamesData';

const API_URL = import.meta.env.VITE_API_URL;

const ensureDataObject = (data) => {
    if (!data) return {};
    if (typeof data === 'object') return data;
    try {
        return JSON.parse(data);
    } catch (e) {
        return {};
    }
};

export default function LessonContentItem({
    item,
    ytApiLoaded,
    markVideoAsWatched,
    markLinkAsVisited,
    handleResourceDownload,
    handleAssignmentUpload,
    uploadingAssignment,
    watchedVideos,
    visitedLinks,
    navigate
}) {
    const [isIncorrect, setIsIncorrect] = useState(null);
    const [revealing, setRevealing] = useState(false);
    const { playSound } = useSoundStore();

    const playSuccess = () => playSound('/sounds/success.mp3');
    const playError = () => playSound('/sounds/error.mp3');

    let data = item.data || {};

    // Safety check: if data is a string, try to parse it
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch (e) {
            console.error("Error parsing content data:", e);
        }
    }

    // Deep safety check: if data.text is also stringified JSON
    if (data.text && typeof data.text === 'string' && data.text.startsWith('{"')) {
        try {
            const inner = JSON.parse(data.text);
            if (inner.text) data.text = inner.text;
        } catch (e) { }
    }

    const commonProps = { item, data, playSuccess, playError, markLinkAsVisited, visitedLinks };

    switch (item.content_type) {
        case 'text':
            let textContent = data.text || '';
            if (typeof textContent === 'string') {
                textContent = textContent.replace(/\\n/g, '\n');
            }
            const isHtml = /<[a-z][\s\S]*>/i.test(textContent);

            return (
                <div className="card p-5 md:p-7 prose prose-invert prose-slate max-w-none bg-slate-800/30 border-white/5 shadow-inner">
                    {isHtml ? (
                        <div
                            className="whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(textContent) }}
                        />
                    ) : (
                        <div className="text-gray-300">
                            {textContent.split('\n').map((paragraph, idx) => (
                                <p key={idx} className={paragraph.trim() === '' ? 'h-4 m-0' : 'mb-4 leading-relaxed'}>
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            );

        case 'video':
            const isYT = !!data.url?.includes('youtube.com') || !!data.url?.includes('youtu.be');
            const ytId = isYT ? (data.url.split('v=')[1]?.split('&')[0] || data.url.split('/').pop()) : null;
            const videoSrc = data.file_url ? `${API_URL.replace('/api', '')}${data.file_url}` : null;
            const isWatched = watchedVideos.has(item.id);

            return (
                <div className={`space-y-4 p-4 rounded-3xl transition-all duration-700 ${isWatched ? 'bg-green-500/5 border border-green-500/20 shadow-lg shadow-green-500/10' : 'bg-slate-800/10 border border-white/5'}`}>
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/5 ring-1 ring-white/10 group">
                        {isYT ? (
                            <YouTubePlayer
                                id={item.id}
                                videoId={ytId}
                                ytApiLoaded={ytApiLoaded}
                                onEnded={() => markVideoAsWatched(item.id)}
                            />
                        ) : videoSrc ? (
                            <video
                                src={videoSrc}
                                className="w-full h-full"
                                controls
                                onEnded={() => markVideoAsWatched(item.id)}
                                controlsList="nodownload"
                            ></video>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-900">
                                <PlayCircle className="w-20 h-20 text-gray-700" />
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Video no disponible</p>
                            </div>
                        )}

                        {/* Overlays for watched state */}
                        {isWatched && (
                            <div className="absolute top-4 right-4 z-10 animate-fade-in">
                                <div className="bg-green-500 text-white p-2.5 rounded-2xl shadow-xl shadow-green-500/40 border-2 border-green-400 scale-110 drop-shadow-lg">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center px-2">
                        <div className="flex flex-col gap-2">
                            <h3 className={`text-lg font-bold flex items-center gap-3 transition-all duration-500 ${isWatched ? 'text-green-400' : 'text-white'}`}>
                                <div className={`p-2.5 rounded-xl transition-all duration-500 ${isWatched ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-blue-500/20 text-blue-400'}`}>
                                    <PlayCircle className="w-5 h-5" />
                                </div>
                                {item.title}
                            </h3>

                            <div className="flex items-center gap-2">
                                {!!item.is_required && !isWatched && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-500/10 text-orange-400 text-[10px] font-black uppercase tracking-widest border border-orange-500/20">
                                        <Clock className="w-3.5 h-3.5" /> Requerido
                                    </span>
                                )}

                                {isWatched ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest border border-green-500/30 animate-fade-in">
                                        <CheckCircle className="w-3.5 h-3.5" /> ¡Video Completado!
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-widest border border-white/5">
                                        <Eye className="w-3.5 h-3.5" /> Pendiente
                                    </span>
                                )}
                            </div>
                        </div>

                        {item.points > 0 && (
                            <div className="flex flex-col items-end gap-1.5">
                                <div className={`relative px-5 py-2.5 rounded-2xl font-black text-sm transition-all duration-500 transform ${isWatched ? 'bg-yellow-500 text-slate-950 scale-110 shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                                    +{item.points} PTS
                                    {isWatched && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>
                                    )}
                                </div>
                                {isWatched && (
                                    <span className="text-[10px] text-yellow-500 font-black uppercase tracking-widest animate-pulse flex items-center gap-1">
                                        <Award className="w-3 h-3" /> ¡Ganados!
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            );

        case 'image':
            const imgSrc = data.file_url ? `${API_URL.replace('/api', '')}${data.file_url}` : data.url;
            return (
                <div className="space-y-4">
                    <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/20">
                        <img src={imgSrc} alt={item.title} className="w-full h-auto max-h-[600px] object-contain mx-auto" />
                    </div>
                </div>
            );

        case 'file':
            const fileLink = data.file_url ? `${API_URL.replace('/api', '')}${data.file_url}` : '#';
            return (
                <a
                    href={fileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                    onClick={() => handleResourceDownload(item.id, item.title)}
                >
                    <div className="flex items-center gap-6 p-6 rounded-2xl bg-slate-800/40 border border-white/5 hover:bg-slate-800 hover:border-red-500/40 transition-all">
                        <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)] group-hover:scale-110 transition-transform border border-red-500/20">
                            <FileText className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">{item.title}</h4>
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                {data.original_name || 'Documento adjunto'}
                                {data.size && <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400">{(data.size / 1024 / 1024).toFixed(2)} MB</span>}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-primary-500 group-hover:text-white transition-all">
                            <Download className="w-5 h-5" />
                        </div>
                    </div>
                </a>
            );

        case 'link':
            const isVisited = visitedLinks.has(item.id);
            return (
                <a
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                    onClick={() => markLinkAsVisited(item.id)}
                >
                    <div className={`flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl transition-all duration-500 border ${isVisited ? 'bg-green-500/5 border-green-500/30 shadow-lg shadow-green-500/10' : 'bg-slate-800/20 border-white/5 hover:border-green-500/30'}`}>
                        <div className={`w-16 h-16 rounded-2xl transition-all duration-500 flex items-center justify-center flex-shrink-0 ${isVisited ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 rotate-0' : 'bg-green-500/10 text-green-400 group-hover:scale-110'}`}>
                            <LinkIcon className="w-8 h-8" />
                        </div>

                        <div className="flex-1 min-w-0 text-center md:text-left">
                            <h4 className={`text-lg font-bold flex items-center justify-center md:justify-start gap-2 transition-colors ${isVisited ? 'text-green-400' : 'text-white'}`}>
                                {item.title}
                                {isVisited && <CheckCircle className="w-4 h-4 text-green-400 animate-pulse" />}
                            </h4>
                            <p className="text-sm text-gray-500 truncate mt-1">{data.url}</p>

                            <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                                {!!item.is_required && !isVisited && (
                                    <span className="px-3 py-1 rounded-lg bg-orange-500/10 text-orange-400 text-[10px] font-black uppercase tracking-widest border border-orange-500/20">
                                        <Clock className="w-3.5 h-3.5 mr-1 inline" /> Requerido
                                    </span>
                                )}
                                {isVisited ? (
                                    <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest border border-green-500/30">
                                        <CheckCircle className="w-3.5 h-3.5 mr-1 inline" /> Visitado
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 rounded-lg bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-widest border border-white/5">
                                        <Eye className="w-3.5 h-3.5 mr-1 inline" /> Pendiente
                                    </span>
                                )}
                            </div>
                        </div>

                        {item.points > 0 && (
                            <div className="flex flex-col items-center md:items-end gap-1.5">
                                <div className={`relative px-5 py-2.5 rounded-2xl font-black text-sm transition-all duration-500 transform ${isVisited ? 'bg-yellow-500 text-slate-950 scale-110 shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                                    +{item.points} PTS
                                </div>
                                {isVisited && (
                                    <span className="text-[10px] text-yellow-500 font-black uppercase tracking-widest animate-pulse flex items-center gap-1">
                                        <Award className="w-3 h-3" /> ¡Ganados!
                                    </span>
                                )}
                            </div>
                        )}

                        <div className={`w-12 h-12 rounded-full hidden md:flex items-center justify-center transition-all ${isVisited ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-400 group-hover:bg-green-500 group-hover:text-white'}`}>
                            {isVisited ? <CheckCircle className="w-6 h-6" /> : <Zap className="w-6 h-6 animate-pulse" />}
                        </div>
                    </div>
                </a>
            );

        case 'heading':
            return (
                <div className="py-8 border-b border-white/5 mb-6">
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-4">
                        <span className="w-8 h-1 bg-primary-500 rounded-full"></span>
                        {data.text || 'Sin Título'}
                        <span className="flex-1 h-px bg-white/5"></span>
                    </h2>
                </div>
            );

        case 'bullets':
            return (
                <div className="card p-5 md:p-7 prose prose-invert prose-slate max-w-none bg-slate-800/30 border-white/5 shadow-inner">
                    <ul className="list-disc pl-5 space-y-3 text-gray-300 marker:text-primary-500 marker:text-xl">
                        {(data.items || []).map((bullet, idx) => (
                            <li key={idx} className="leading-relaxed pl-1">
                                {bullet.title && <strong className="text-white font-bold mr-1">{bullet.title}:</strong>}
                                <span>{typeof bullet.text === 'string' ? bullet.text.split('\n').map((line, i) => <span key={i}>{line}<br /></span>) : bullet.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            );

        case 'note':
            return (
                <div className="p-6 rounded-2xl bg-primary-500/5 border border-primary-500/10 flex gap-5 items-start animate-fade-in shadow-[inset_0_0_20px_rgba(59,130,246,0.02)]">
                    <div className="p-3 bg-primary-500/10 rounded-xl text-primary-400 flex-shrink-0 shadow-lg border border-primary-500/20">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-primary-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1.5">{item.title || 'Nota de Aprendizaje'}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed font-medium">
                            {data.text || 'Recuerda tomar apuntes de los conceptos clave de esta sección.'}
                        </p>
                    </div>
                </div>
            );

        case 'quiz':
        case 'survey':
        case 'assignment':
            const iconMap = {
                quiz: item.isCompleted ? <CheckCircle className="w-8 h-8 text-green-400" /> : <HelpCircle className="w-8 h-8 text-red-400" />,
                survey: item.isCompleted ? <CheckCircle className="w-8 h-8 text-green-400" /> : <ClipboardList className="w-8 h-8 text-yellow-400" />,
                assignment: item.isCompleted ? <CheckCircle className="w-8 h-8 text-green-400" /> : <Upload className="w-8 h-8 text-pink-400" />
            };
            const colorMap = {
                quiz: 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10',
                survey: 'border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10',
                assignment: 'border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/10'
            };
            return (
                <div className={`p-8 rounded-2xl border transition-all flex flex-col md:flex-row items-center gap-6 text-center md:text-left ${item.isCompleted ? 'border-green-500/30 bg-green-500/10 hover:bg-green-500/15' : colorMap[item.content_type]}`}>
                    <div className="p-4 bg-slate-900/50 rounded-2xl shadow-lg">
                        {iconMap[item.content_type]}
                    </div>
                    <div className="flex-1 space-y-2">
                        <h3 className="text-xl font-bold text-white">{item.title}</h3>
                        <p className="text-gray-400">{data.description || 'Completa esta actividad para continuar.'}</p>

                        {item.content_type === 'assignment' && item.submission && (
                            <div className="mt-3 inline-flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-white/5 text-xs font-medium">
                                <span className={`px-2 py-0.5 rounded uppercase tracking-wider font-black ${item.submission.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : item.submission.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                                    {item.submission.status === 'approved' ? 'Aprobada' : item.submission.status === 'rejected' ? 'Rechazada' : 'Enviada / Pendiente'}
                                </span>
                                <a href={`${API_URL.replace('/api', '')}${item.submission.file_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline ml-2">Ver archivo enviado</a>
                            </div>
                        )}

                        {item.content_type === 'assignment' && item.submission?.feedback && (
                            <p className="text-sm text-yellow-500 mt-2 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                                <strong>Comentario del instructor:</strong> {item.submission.feedback}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-2 mt-2">
                            {item.points > 0 && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 rounded-lg text-xs font-bold text-gray-300 border border-white/10">
                                    <Award className="w-3 h-3 text-yellow-500" />
                                    <span>Valor: <span className="text-white">{item.points} PTS</span></span>
                                </div>
                            )}

                            {item.content_type === 'quiz' && (
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${item.attemptsMade >= item.maxAttempts ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-slate-900 border-white/10 text-gray-300'}`}>
                                    <Clock className="w-3 h-3" />
                                    <span>Intentos: <span className={item.attemptsMade >= item.maxAttempts ? 'text-red-400' : 'text-white'}>{item.attemptsMade} / {item.maxAttempts}</span></span>
                                </div>
                            )}
                        </div>
                    </div>

                    {item.content_type === 'assignment' ? (
                        <div className="relative">
                            <input
                                type="file"
                                id={`assign-${item.id}`}
                                className="hidden"
                                onChange={(e) => handleAssignmentUpload(item.id, e)}
                                disabled={uploadingAssignment === item.id || item.submission?.status === 'approved'}
                            />
                            <label
                                htmlFor={`assign-${item.id}`}
                                className={`btn-secondary px-8 cursor-pointer inline-flex items-center justify-center gap-2 ${item.submission?.status === 'approved' ? 'opacity-50 cursor-not-allowed hidden' : ''}`}
                            >
                                {uploadingAssignment === item.id ? (
                                    <><div className="w-4 h-4 border-[3px] border-white/20 border-t-white rounded-full animate-spin"></div> Subiendo...</>
                                ) : (
                                    <><Upload className="w-4 h-4" /> {item.submission ? 'Reemplazar Entrega' : 'Subir Tarea'}</>
                                )}
                            </label>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                if (item.content_type === 'quiz') {
                                    const quizId = data.quiz_id;
                                    if (quizId) {
                                        const url = (item.isCompleted || (item.attemptsMade >= item.maxAttempts)) ? `/quizzes/${quizId}?review=true` : `/quizzes/${quizId}`;
                                        navigate(url);
                                    }
                                } else if (item.content_type === 'survey') {
                                    if (item.isCompleted) return;
                                    const surveyId = data.survey_id;
                                    if (surveyId) navigate(`/surveys/${surveyId}`);
                                }
                            }}
                            disabled={item.isCompleted && item.content_type === 'survey'}
                            className={`px-8 font-black uppercase tracking-widest transition-all rounded-xl h-12 flex items-center justify-center border-2 ${item.isCompleted ? (item.content_type === 'survey' ? 'bg-green-600/20 border-green-600/30 text-green-400 cursor-not-allowed shadow-none' : 'bg-green-600 hover:bg-green-700 border-green-600 text-white shadow-lg shadow-green-500/20') : (item.attemptsMade >= item.maxAttempts) ? 'bg-red-600 hover:bg-red-700 border-red-600 text-white shadow-lg shadow-red-500/20' : 'btn-secondary'}`}
                        >
                            {item.isCompleted ? (item.content_type === 'survey' ? <><CheckCircle className="w-4 h-4 mr-2" /> Encuesta Completada</> : <><Eye className="w-4 h-4 mr-2" /> Repasar Actividad</>) : (item.attemptsMade >= item.maxAttempts) ? <><RotateCcw className="w-4 h-4 mr-2" /> Ver Resultados</> : <><Zap className="w-4 h-4 mr-2" /> Iniciar Actividad</>}
                        </button>
                    )}
                </div>
            );

        case 'confirmation':
            const isConfirmed = visitedLinks.has(item.id);
            const handleConfirmation = (optNum) => {
                if (isConfirmed || revealing) return;

                if (optNum === data.correctOption) {
                    setRevealing(true);
                    playSuccess();
                    markLinkAsVisited(item.id, { selectedOption: optNum, answeredAt: new Date().toISOString() });
                    setTimeout(() => setRevealing(false), 1000);
                } else {
                    setIsIncorrect(optNum);
                    playError();
                    setTimeout(() => setIsIncorrect(null), 1000);
                }
            };

            return (
                <div className={`p-8 rounded-[2.5rem] transition-all duration-700 border-2 ${isConfirmed
                    ? 'bg-emerald-500/5 border-emerald-500/30'
                    : 'bg-slate-800/20 border-white/5'
                    }`}>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isConfirmed ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-emerald-500/10 text-emerald-400'
                            }`}>
                            {isConfirmed ? <CheckCircle2 className="w-10 h-10" /> : <HelpCircle className="w-10 h-10" />}
                        </div>

                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div>

                                <h3 className="text-xl font-bold text-white leading-tight">
                                    {data.description || 'Por favor confirma la siguiente información:'}
                                </h3>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                {[1, 2].map((num) => {
                                    const optionText = num === 1 ? data.option1 : data.option2;
                                    const isThisCorrect = num === data.correctOption;
                                    const isSelectedIncorrect = isIncorrect === num;

                                    return (
                                        <button
                                            key={num}
                                            onClick={() => handleConfirmation(num)}
                                            disabled={isConfirmed || revealing}
                                            className={`flex-1 group relative p-5 rounded-2xl border-2 transition-all duration-300 transform active:scale-95 ${isConfirmed
                                                ? (isThisCorrect ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg' : 'bg-slate-900/50 border-white/5 text-gray-600 opacity-60')
                                                : isSelectedIncorrect
                                                    ? 'bg-red-500 border-red-400 text-white animate-shake shadow-lg shadow-red-500/20'
                                                    : 'bg-slate-900/40 border-white/10 text-gray-300 hover:border-emerald-500/50 hover:bg-slate-800'
                                                }`}
                                        >
                                            <div className="flex items-center justify-center gap-3">
                                                {isConfirmed && isThisCorrect && <CheckCircle2 className="w-5 h-5 animate-bounce" />}
                                                {isSelectedIncorrect && <XCircle className="w-5 h-5" />}
                                                <span className="font-bold uppercase tracking-widest text-[11px]">
                                                    {optionText || `Opción ${num}`}
                                                </span>
                                            </div>

                                            {!isConfirmed && !isSelectedIncorrect && (
                                                <div className="absolute inset-0 rounded-2xl bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex items-center justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-[0.1em]">
                                {isConfirmed ? (
                                    <span className="text-emerald-400 flex items-center gap-2">
                                        <Zap className="w-4 h-4 fill-emerald-400" /> ¡Completado Correctamente!
                                    </span>
                                ) : (
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Selecciona la respuesta adecuada
                                    </span>
                                )}

                                {item.points > 0 && (
                                    <span className={`px-3 py-1 rounded-full border transition-all ${isConfirmed ? 'bg-yellow-500 border-yellow-400 text-slate-950 px-4 scale-110 shadow-lg shadow-yellow-500/20' : 'bg-slate-950 border-white/5 text-yellow-500'
                                        }`}>
                                        +{item.points} PTS {isConfirmed ? 'GANADOS' : ''}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );

        case 'interactive_input':
            const [inputValue, setInputValue] = useState('');
            const [localFeedback, setLocalFeedback] = useState(null); // 'correct', 'incorrect'
            const isInputCompleted = visitedLinks.has(item.id);

            const validateAnswer = () => {
                if (isInputCompleted || revealing) return;

                const vType = data.validation_type || 'free';
                let isValid = true;

                if (vType === 'exact') {
                    isValid = inputValue.trim().toLowerCase() === (data.correct_answer || '').trim().toLowerCase();
                } else if (vType === 'regex') {
                    try {
                        const regex = new RegExp(data.regex_pattern);
                        isValid = regex.test(inputValue.trim());
                    } catch (e) {
                        console.error("Invalid regex:", e);
                        isValid = true;
                    }
                }

                if (isValid || vType === 'free') {
                    setLocalFeedback('correct');
                    setRevealing(true);
                    markLinkAsVisited(item.id, { answer: inputValue, validation_type: vType, validated: isValid });
                    setTimeout(() => setRevealing(false), 1000);
                } else {
                    setLocalFeedback('incorrect');
                    setTimeout(() => setLocalFeedback(null), 2000);
                }
            };

            return (
                <div className={`p-8 rounded-[2.5rem] transition-all duration-700 border-2 ${isInputCompleted
                    ? 'bg-indigo-500/5 border-indigo-500/30'
                    : 'bg-slate-800/20 border-white/5'
                    }`}>
                    <div className="flex flex-col gap-6">
                        <div className="flex gap-4 items-center">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isInputCompleted ? 'bg-indigo-500 text-white shadow-lg' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                <Type className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white uppercase tracking-tight">{item.title}</h3>
                                <p className="text-sm text-gray-400 font-medium italic">{data.description || 'Proporciona una respuesta:'}</p>
                            </div>
                        </div>

                        <div className="relative group max-w-2xl">
                            <input
                                type="text"
                                value={isInputCompleted ? (item.interactionData?.answer || inputValue) : inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                disabled={isInputCompleted || revealing}
                                placeholder={data.placeholder || 'Escribe aquí tu respuesta...'}
                                className={`w-full bg-black/40 border-2 rounded-2xl py-4 px-6 pr-32 text-white transition-all outline-none font-medium placeholder:text-gray-600 ${isInputCompleted
                                    ? 'border-indigo-500/50 text-indigo-200 bg-indigo-500/5'
                                    : localFeedback === 'incorrect'
                                        ? 'border-red-500/50 bg-red-500/5 animate-shake'
                                        : localFeedback === 'correct'
                                            ? 'border-emerald-500/50 bg-emerald-500/5'
                                            : 'border-white/5 focus:border-indigo-500/40 hover:border-white/10'
                                    }`}
                                onKeyDown={(e) => e.key === 'Enter' && validateAnswer()}
                            />

                            {!isInputCompleted && (
                                <button
                                    onClick={validateAnswer}
                                    disabled={revealing || !inputValue.trim()}
                                    className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"
                                >
                                    Enviar <Zap className="w-3 h-3" />
                                </button>
                            )}

                            {isInputCompleted && (
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-indigo-400">
                                    <CheckCircle className="w-6 h-6 animate-fade-in" />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-3">
                                {localFeedback === 'incorrect' && (
                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-fade-in flex items-center gap-2 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/10 shadow-lg shadow-red-500/5">
                                        <AlertTriangle className="w-4 h-4" /> Respuesta Incorrecta
                                    </span>
                                )}
                                {isInputCompleted && (
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-fade-in flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/10 shadow-lg shadow-emerald-500/5">
                                        <CheckCircle2 className="w-4 h-4" /> {data.validation_type === 'free' ? 'Respuesta Guardada' : 'Validación Superada'}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                {item.points > 0 && (
                                    <div className={`relative px-5 py-2 rounded-2xl font-black text-[11px] transition-all duration-500 transform ${isInputCompleted ? 'bg-yellow-500 text-slate-950 scale-110 shadow-lg shadow-yellow-500/20' : 'bg-slate-950 border border-white/5 text-yellow-500'}`}>
                                        +{item.points} PTS {isInputCompleted ? 'GANADOS' : ''}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );

        case 'password_tester':
            const [passValue, setPassValue] = useState('');
            const [showPass, setShowPass] = useState(false);
            const [pwnedCount, setPwnedCount] = useState(null);
            const [checkingPwned, setCheckingPwned] = useState(false);
            const isTesterCompleted = visitedLinks.has(item.id);

            const calculateStrength = (password) => {
                let score = 0;
                if (!password) return { score: 0, label: 'Vacío', color: 'bg-slate-800', textColor: 'text-gray-500' };

                if (password.length >= 8) score++;
                if (password.length >= 12) score++;
                if (/[a-z]/.test(password)) score++;
                if (/[A-Z]/.test(password)) score++;
                if (/[0-9]/.test(password)) score++;
                if (/[^a-zA-Z0-9]/.test(password)) score++;

                if (score <= 2) return { score, label: 'Muy Débil', color: 'bg-red-500', textColor: 'text-red-500', bgSoft: 'bg-red-500/10' };
                if (score <= 3) return { score, label: 'Débil', color: 'bg-orange-500', textColor: 'text-orange-500', bgSoft: 'bg-orange-500/10' };
                if (score <= 4) return { score, label: 'Media', color: 'bg-yellow-500', textColor: 'text-yellow-500', bgSoft: 'bg-yellow-500/10' };
                if (score <= 5) return { score, label: 'Fuerte', color: 'bg-emerald-500', textColor: 'text-emerald-500', bgSoft: 'bg-emerald-500/10' };
                return { score, label: 'Muy Segura', color: 'bg-blue-500', textColor: 'text-blue-500', bgSoft: 'bg-blue-500/10' };
            };

            const estimateCrackTime = (password) => {
                if (!password) return '0 segundos';
                let charsetSize = 0;
                if (/[a-z]/.test(password)) charsetSize += 26;
                if (/[A-Z]/.test(password)) charsetSize += 26;
                if (/[0-9]/.test(password)) charsetSize += 10;
                if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;

                const combinations = Math.pow(charsetSize, password.length);
                const hashesPerSecond = 1000000000;
                const seconds = combinations / hashesPerSecond;

                if (seconds < 1) return 'Instante';
                if (seconds < 60) return `${Math.floor(seconds)} segundos`;
                if (seconds < 3600) return `${Math.floor(seconds / 60)} min`;
                if (seconds < 86400) return `${Math.floor(seconds / 3600)} horas`;
                if (seconds < 2592000) return `${Math.floor(seconds / 86400)} días`;
                if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} meses`;
                if (seconds < 31536000000) return `${Math.floor(seconds / 31536000)} años`;
                return 'Siglos';
            };

            const strength = calculateStrength(passValue);
            const crackTime = estimateCrackTime(passValue);

            const checks = [
                { label: 'Minúsculas', met: /[a-z]/.test(passValue) },
                { label: 'Mayúsculas', met: /[A-Z]/.test(passValue) },
                { label: 'Números', met: /[0-9]/.test(passValue) },
                { label: 'Símbolos', met: /[^a-zA-Z0-9]/.test(passValue) }
            ];

            const checkPwned = async () => {
                if (!passValue) return;
                setCheckingPwned(true);
                setPwnedCount(null);
                try {
                    const msgUint8 = new TextEncoder().encode(passValue);
                    const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

                    const prefix = hashHex.substring(0, 5);
                    const suffix = hashHex.substring(5);

                    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);

                    if (response.status === 429) {
                        toast.error('Demasiadas solicitudes. Inténtalo más tarde.');
                        return;
                    }

                    if (!response.ok) {
                        throw new Error('Error en la API');
                    }

                    const text = await response.text();
                    const lines = text.split('\n');

                    const match = lines.find(line => line.trim().startsWith(suffix));
                    if (match) {
                        const count = parseInt(match.split(':')[1]);
                        setPwnedCount(count);
                    } else {
                        setPwnedCount(0);
                    }
                } catch (error) {
                    console.error('Error checking pwned:', error);
                    toast.error('Error al verificar filtraciones');
                } finally {
                    setCheckingPwned(false);
                }
            };

            const handleFinishTester = () => {
                if (isTesterCompleted) return;
                markLinkAsVisited(item.id);
            };

            return (
                <div className={`p-8 rounded-[2.5rem] transition-all duration-700 border-2 bg-slate-900/40 border-white/5`}>
                    <div className="flex flex-col gap-6">
                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center flex-shrink-0">
                                <Lock className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-tight">{item.title || 'Take the Password Test'}</h3>
                                {data.description && (
                                    <div
                                        className="text-sm text-gray-500 font-medium leading-relaxed italic"
                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.description) }}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="max-w-2xl w-full mx-auto space-y-6">
                            <div className="relative">
                                <div className="flex justify-end mb-2">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <span className="text-[10px] font-black uppercase text-gray-500 group-hover:text-white transition-colors">Mostrar contraseña</span>
                                        <input
                                            type="checkbox"
                                            checked={showPass}
                                            onChange={() => setShowPass(!showPass)}
                                            className="w-4 h-4 rounded border-white/10 bg-slate-950 text-pink-500 focus:ring-pink-500/50"
                                        />
                                    </label>
                                </div>
                                <div className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 ${passValue ? `border-opacity-50 ${strength.color.replace('bg-', 'border-')}` : 'border-white/5'}`}>
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        value={passValue}
                                        onChange={(e) => setPassValue(e.target.value)}
                                        placeholder="Ingresa una contraseña para probar..."
                                        className="w-full bg-slate-950/80 p-6 text-2xl text-center font-mono tracking-[0.3em] text-white outline-none placeholder:text-gray-800 placeholder:text-sm placeholder:tracking-normal placeholder:font-sans"
                                    />
                                    {passValue && (
                                        <div className={`py-2 text-center text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${strength.color} text-slate-950`}>
                                            {strength.label}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                                <div className="bg-black/20 p-6 rounded-3xl border border-white/5 space-y-4">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Composición:</p>
                                    <div className="grid grid-cols-1 gap-3">
                                        {checks.map((check, idx) => (
                                            <div key={idx} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${check.met ? 'text-emerald-400' : 'text-gray-600'}`}>
                                                <div className={`w-2 h-2 rounded-full ${check.met ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gray-800'}`} />
                                                {check.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-black/20 p-6 rounded-3xl border border-white/5 flex flex-col justify-center items-center text-center space-y-2">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Tiempo de hackeo:</p>
                                    <div className={`text-3xl font-black tracking-tighter ${passValue ? strength.textColor : 'text-gray-800 animate-pulse'}`}>
                                        {passValue ? crackTime : '????'}
                                    </div>
                                </div>

                                <div className="bg-black/20 p-6 rounded-3xl border border-white/5 flex flex-col justify-center items-center text-center space-y-4">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Base de Filtraciones:</p>

                                    {pwnedCount === null ? (
                                        <button
                                            onClick={checkPwned}
                                            disabled={!passValue || checkingPwned}
                                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                        >
                                            {checkingPwned ? 'Verificando...' : 'Verificar Filtraciones'}
                                        </button>
                                    ) : (
                                        <div className={`flex flex-col items-center animate-comic-pop`}>
                                            <div className={`text-2xl font-black ${pwnedCount > 0 ? 'text-red-500' : 'text-emerald-400'}`}>
                                                {pwnedCount.toLocaleString()} veces
                                            </div>
                                            <p className="text-[9px] font-bold text-gray-500 uppercase mt-1">
                                                {pwnedCount > 0 ? '¡Contraseña filtrada!' : 'Segura en filtraciones'}
                                            </p>
                                            <button
                                                onClick={() => setPwnedCount(null)}
                                                className="mt-3 text-[9px] text-indigo-400 hover:text-indigo-300 font-bold uppercase underline"
                                            >
                                                Verificar otra
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {!isTesterCompleted && passValue.length > 0 && (
                                <div className="flex justify-center pt-4">
                                    <button
                                        onClick={handleFinishTester}
                                        className="px-8 py-4 bg-pink-600 hover:bg-pink-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-pink-600/20 active:scale-95 flex items-center gap-3 group"
                                    >
                                        Finalizar Actividad <Zap className="w-4 h-4 group-hover:animate-pulse" />
                                    </button>
                                </div>
                            )}

                            {isTesterCompleted && (
                                <div className="flex justify-center pt-4">
                                    <span className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" /> Actividad Completada
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );

        case 'mfa_defender':
            return <MfaDefenderActivity 
                item={item} 
                data={ensureDataObject(item.data)} 
                visitedLinks={visitedLinks} 
                markLinkAsVisited={markLinkAsVisited} 
                playSuccess={playSuccess}
                playError={playError}
            />;

        case 'hack_neighbor':
            return <HackNeighborGame {...commonProps} />;

        case 'multiple_choice':
            const options_mc = data.options || [];
            const hasCorrectAnswer = options_mc.some(o => o.is_correct);
            const interactionData_mc = item.interactionData ? (typeof item.interactionData === 'string' ? JSON.parse(item.interactionData) : item.interactionData) : null;

            const [selectedIdx, setSelectedIdx] = useState(interactionData_mc?.selectedIndex ?? null);
            const [status_mc, setStatus_mc] = useState(interactionData_mc?.status ?? (item.isCompleted ? 'completed' : 'pending'));
            const [submitting_mc, setSubmitting_mc] = useState(false);

            const handleSelect = async (index) => {
                if (status_mc !== 'pending' && status_mc !== 'incorrect') return;

                setSelectedIdx(index);
                const selectedOption = options_mc[index];

                if (!hasCorrectAnswer) {
                    setSubmitting_mc(true);
                    try {
                        const resData = await markLinkAsVisited(item.id, {
                            selectedIndex: index,
                            text: selectedOption.text,
                            status: 'completed'
                        });

                        if (resData?.success) {
                            setStatus_mc('completed');
                            playSuccess();
                        }
                    } catch (error) {
                        toast.error('Error al guardar respuesta');
                    } finally {
                        setSubmitting_mc(false);
                    }
                }
            };

            const validateChoice = async () => {
                if (selectedIdx === null || status_mc === 'completed' || submitting_mc) return;

                setSubmitting_mc(true);
                const isCorrect = options_mc[selectedIdx].is_correct;

                try {
                    const resData = await markLinkAsVisited(item.id, {
                        selectedIndex: selectedIdx,
                        text: options_mc[selectedIdx].text,
                        status: isCorrect ? 'completed' : 'incorrect'
                    });

                    if (resData?.success) {
                        if (isCorrect) {
                            setStatus_mc('completed');
                            playSuccess();
                            toast.success('¡Correcto!');
                        } else {
                            setStatus_mc('incorrect');
                            playError();
                            toast.error('Respuesta incorrecta. Inténtalo de nuevo.');
                        }
                    }
                } catch (error) {
                    toast.error('Error al validar respuesta');
                } finally {
                    setSubmitting_mc(false);
                }
            };

            return (
                <div className={`p-8 rounded-[2.5rem] transition-all duration-700 border-2 ${status_mc === 'completed' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-900/40 border-white/5'}`}>
                    <div className="flex flex-col gap-6">
                        <div className="flex gap-4 items-center">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${status_mc === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                <CheckSquare className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white uppercase tracking-tight">{item.title}</h3>
                                {data.description && (
                                    <div
                                        className="text-sm text-gray-400 font-medium leading-relaxed mt-1"
                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.description) }}
                                    />
                                )}
                            </div>
                            {status_mc === 'completed' && (
                                <div className="hidden md:flex flex-col items-end">
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" /> Completado
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {options_mc.map((option, idx) => {
                                const isSelected = selectedIdx === idx;
                                const showAsCorrect = status_mc === 'completed' && isSelected;
                                const showAsIncorrect = status_mc === 'incorrect' && isSelected;

                                return (
                                    <button
                                        key={idx}
                                        disabled={status_mc === 'completed' || submitting_mc}
                                        onClick={() => handleSelect(idx)}
                                        className={`group relative flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${showAsCorrect
                                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                                            : showAsIncorrect
                                                ? 'bg-red-500/10 border-red-500/50 text-red-400 animate-shake'
                                                : isSelected
                                                    ? 'bg-primary-500/10 border-primary-500/50 text-white'
                                                    : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/10 hover:bg-black/40'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-primary-500 border-primary-500 text-white' : 'border-white/10'
                                            }`}>
                                            {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                        </div>
                                        <span className="font-semibold text-sm">{option.text}</span>

                                        {showAsCorrect && <CheckCircle2 className="w-5 h-5 ml-auto" />}
                                        {showAsIncorrect && <XCircle className="w-5 h-5 ml-auto" />}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
                            <div className="flex items-center gap-4">
                                {hasCorrectAnswer && status_mc !== 'completed' && (
                                    <button
                                        onClick={validateChoice}
                                        disabled={selectedIdx === null || submitting_mc}
                                        className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${selectedIdx !== null && !submitting_mc
                                            ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20 active:scale-95'
                                            : 'bg-slate-800 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        {submitting_mc ? 'Validando...' : 'Comprobar Respuesta'}
                                        <Zap className={`w-4 h-4 ${submitting_mc ? 'animate-spin' : ''}`} />
                                    </button>
                                )}

                                {status_mc === 'incorrect' && !submitting_mc && (
                                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" /> Inténtalo de nuevo
                                    </p>
                                )}
                            </div>

                            {item.points > 0 && (
                                <div className={`relative px-5 py-2 rounded-2xl font-black text-[11px] transition-all duration-500 transform ${status_mc === 'completed' ? 'bg-yellow-500 text-slate-950 scale-110 shadow-lg shadow-yellow-500/20' : 'bg-slate-950 border border-white/5 text-yellow-500'}`}>
                                    +{item.points} PTS {status_mc === 'completed' ? 'GANADOS' : ''}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );

        default:
            return null;
    }
}

function HackNeighborGame({ item, data, playSuccess, playError, markLinkAsVisited, visitedLinks }) {
    const isCompleted = visitedLinks.has(item.id);
    const [status, setStatus] = useState(isCompleted ? 'won' : 'browsing');
    const [attempts, setAttempts] = useState(0);
    const [passwordInput, setPasswordInput] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [lastError, setLastError] = useState(false);
    const [revealedHints, setRevealedHints] = useState(() => {
        const saved = localStorage.getItem(`cgr_lesson_hints_${item.id}`);
        return saved ? JSON.parse(saved) : {};
    }); // { hintIndex: true }

    useEffect(() => {
        localStorage.setItem(`cgr_lesson_hints_${item.id}`, JSON.stringify(revealedHints));
    }, [revealedHints, item.id]);

    const profile = useMemo(() => {
        const index = (item.id % HACK_PROFILES.length);
        return HACK_PROFILES[index];
    }, [item.id]);

    const handleHackAttempt = () => {
        if (passwordInput === profile.password) {
            setStatus('won');
            playSuccess();
            toast.success('¡Acceso concedido! Has vulnerado la cuenta.');
            const hintsUsedCount = Object.keys(revealedHints).length;
            markLinkAsVisited(item.id, { success: true, hintsUsed: hintsUsedCount });
        } else {
            setAttempts(prev => prev + 1);
            setLastError(true);
            playError();
            setTimeout(() => {
                setLastError(false);
            }, 800);
            setPasswordInput('');
        }
    };

    const isHackWon = status === 'won';

    return (
        <div className="space-y-6 animate-fade-in group/hack">
            <div className={`bg-slate-900/60 border-2 rounded-[3.5rem] overflow-hidden shadow-2xl transition-all duration-700 ${isHackWon ? 'border-green-500/30 shadow-green-500/10' : 'border-white/5'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
                    {/* Feed SocialCGR */}
                    <div className="lg:col-span-8 border-r border-white/5 bg-black/20 flex flex-col">
                        <div className="bg-slate-800/50 p-4 border-b border-white/5 flex items-center gap-4">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                            </div>
                            <div className="flex-1 bg-black/40 rounded-lg px-4 py-1.5 flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                                <Lock className="w-3 h-3 text-green-500/50" /> https://socialcgr.facebook.com/profile/{profile.name.toLowerCase().replace(' ', '.')}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[500px] scrollbar-hide">
                            <div className="relative">
                                <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-white/5 overflow-hidden relative">
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                                    <div className="absolute top-4 right-4 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                        <Camera className="w-3 h-3" /> Editar Portada
                                    </div>
                                </div>
                                <div className="flex items-end px-8 -mt-12 gap-5 mb-4">
                                    <div className="w-28 h-28 bg-slate-800 rounded-[2rem] border-4 border-slate-950 shadow-2xl flex items-center justify-center text-4xl font-black text-primary-400 overflow-hidden relative">
                                        {profile.profile_pic ? (
                                            <img src={profile.profile_pic} alt={profile.name} className="w-full h-full object-cover" />
                                        ) : (
                                            profile.name.split(' ').map(n => n[0]).join('')
                                        )}
                                        <div className="absolute inset-0 bg-primary-500/5"></div>
                                    </div>
                                    <div className="pb-3">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-2xl font-black text-white tracking-tight">{profile.name}</h3>
                                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                                                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Digital Security Consultant</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                                <div className="space-y-5">
                                    <div className="bg-slate-800/20 p-5 rounded-3xl border border-white/5 space-y-4 shadow-sm">
                                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Shield className="w-3 h-3 text-primary-400" /> Información Básica
                                        </div>
                                        <p className="text-xs text-gray-300 italic font-medium leading-relaxed">"{profile.bio}"</p>
                                        <div className="space-y-3 pt-3 border-t border-white/5">
                                            <div className="flex items-center gap-3 text-gray-400 text-[11px] font-bold"><Calendar className="w-4 h-4 text-primary-400" /> Nací el {profile.birthday}</div>
                                            <div className="flex items-center gap-3 text-gray-400 text-[11px] font-bold"><Briefcase className="w-4 h-4 text-primary-400" /> Trabajo en {profile.work}</div>
                                            <div className="flex items-center gap-3 text-gray-400 text-[11px] font-bold"><Users className="w-4 h-4 text-primary-400" /> 1,248 Amigos</div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/20 p-4 rounded-3xl border border-white/5 space-y-4">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="w-8 h-8 rounded-xl bg-primary-500/20 flex items-center justify-center text-[10px] font-bold text-primary-400 overflow-hidden">
                                                {profile.profile_pic ? (
                                                    <img src={profile.profile_pic} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    profile.name[0]
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-white">Publicado hoy</span>
                                                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">Público 🌍</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-300 leading-relaxed font-medium">Mi gato <strong>{profile.cat}</strong> me tiene loco hoy. ¡No para de jugar con los cables! ❤️🐾</p>
                                        <div className="aspect-video bg-slate-900/50 rounded-2xl border border-white/5 flex items-center justify-center text-gray-700/30 group-hover:bg-slate-900/80 transition-all overflow-hidden">
                                            {profile.pet_pic ? (
                                                <img src={profile.pet_pic} alt={profile.cat} className="w-full h-full object-cover" />
                                            ) : (
                                                <Camera className="w-12 h-12 opacity-10" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-5">
                                    <div className="bg-slate-800/20 p-4 rounded-3xl border border-white/5 space-y-4">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 overflow-hidden">
                                                {profile.profile_pic ? (
                                                    <img src={profile.profile_pic} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    profile.name[0]
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-white">Ayer a las 18:45</span>
                                                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">Amigos 👥</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-300 leading-relaxed font-medium">¡Qué orgullo ser del <strong>{profile.team}</strong>! El domingo vamos por el liderato. ⚽🔥</p>
                                        <div className="flex items-center gap-6 text-gray-500 pt-2 px-1">
                                            <div className="flex items-center gap-2 text-primary-400"><Heart className="w-4 h-4 fill-primary-400" /> <span className="text-[10px] font-black">1.2k</span></div>
                                            <MessageCircle className="w-4 h-4" />
                                            <Share2 className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <div className="p-5 rounded-3xl bg-gradient-to-br from-primary-600/10 to-indigo-600/10 border border-white/5 flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-transform shadow-xl">
                                                <Camera className="w-6 h-6 text-primary-400" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-black text-white uppercase tracking-wider">Álbum: Recuerdos de Viaje</p>
                                                <p className="text-[9px] text-gray-500 font-bold">248 fotos compartidas</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terminal Hacker */}
                    <div className="lg:col-span-4 p-10 flex flex-col justify-between bg-[#050505] relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary-500/[0.02] pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 blur-[80px] rounded-full"></div>

                        <div className="space-y-8 relative z-10">
                            <div>
                                <div className="flex items-center gap-3 text-primary-500 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
                                        <Terminal className="w-5 h-5 animate-pulse" />
                                    </div>
                                    <span className="font-black text-[11px] uppercase tracking-[0.4em]">Hacker Mission</span>
                                </div>
                                <h3 className="text-3xl font-black text-white tracking-tighter leading-none mb-3 text-left">ESTRATEGIA BRUTE FORCE</h3>
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-[11px] text-gray-500 text-left leading-relaxed font-bold uppercase tracking-tight">Vulnera la cuenta utilizando ingeniería social.</p>
                                    <div className="bg-slate-900 px-3 py-1 rounded-full border border-white/5 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                                        <span className="text-[10px] font-black text-yellow-500 uppercase tracking-tighter">
                                            {Math.max(0, (item.points || 0) - (Object.keys(revealedHints).length * (item.data?.hint_penalty || 0)))} PUNTOS EN JUEGO
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {isHackWon ? (
                                <div className="space-y-6 animate-scale-up">
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-[2.5rem] p-8 text-center space-y-5 shadow-[0_0_50px_rgba(34,197,94,0.15)] relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                                        <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                                        <div className="space-y-1">
                                            <div className="text-green-400 font-black uppercase tracking-[0.2em] text-sm">¡Infiltración Completada!</div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">Status: LOGGED_IN</p>
                                        </div>
                                        <p className="text-xs text-slate-300 font-mono bg-black/40 py-2 rounded-xl border border-white/5">PASSWORD: <span className="text-white font-black">{profile.password}</span></p>
                                    </div>
                                    <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 p-6 rounded-3xl text-left space-y-4 shadow-2xl relative">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                                                <Award className="w-5 h-5 text-yellow-500" />
                                            </div>
                                            <div className="text-yellow-500 font-black text-[11px] uppercase tracking-widest">Lección Aprendida</div>
                                        </div>
                                        <p className="text-xs text-white leading-relaxed font-bold">
                                            Has visto lo predecible que es una clave basada en datos personales (como <strong>{profile.cat}</strong> o tu equipo <strong>{profile.team}</strong>).
                                        </p>
                                        <p className="text-[11px] text-primary-300 font-black uppercase tracking-tight line-through opacity-50">#ContraseñaObvia</p>
                                        <p className="text-xs text-green-300 font-bold italic leading-relaxed">
                                            Tip: ¡Las frases aleatorias largas (ej: "MiElefanteAzulComePizza22!") son tu mejor escudo!
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className={`space-y-3 transition-all duration-300 ${lastError ? 'scale-95' : ''}`}>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block pl-1 text-left">Introducir Secuencia de Acceso</label>
                                        <div className="relative group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={passwordInput}
                                                onChange={(e) => setPasswordInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleHackAttempt()}
                                                placeholder="Sugerencia: NombreGato + Mes"
                                                className={`w-full bg-[#080808] border-2 rounded-2xl py-5 px-7 text-xl font-mono text-white outline-none transition-all shadow-inner ${lastError ? 'border-red-600/50 shadow-[0_0_30px_rgba(220,38,38,0.2)]' : 'border-white/5 focus:border-primary-600/50'}`}
                                            />
                                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700 hover:text-primary-500 transition-colors">
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {lastError && (
                                            <div className="bg-red-950/20 border border-red-900/30 p-3 rounded-2xl animate-shake">
                                                <p className="text-[10px] text-red-500 font-black text-center tracking-widest uppercase font-mono">ACCESS_DENIED :: CREDENTIAL_MISMATCH</p>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleHackAttempt}
                                        disabled={!passwordInput}
                                        className="w-full h-16 bg-gradient-to-r from-primary-700 to-indigo-700 hover:from-primary-600 hover:to-indigo-600 disabled:from-slate-900 disabled:to-slate-900 disabled:text-gray-700 text-white font-black uppercase tracking-[0.2em] text-[12px] rounded-2xl transition-all shadow-[0_10px_30px_rgba(79,70,229,0.2)] active:scale-[0.98] flex items-center justify-center gap-3 group"
                                    >
                                        <Zap className="w-5 h-5 group-hover:scale-125 transition-transform" /> Atacar Cuenta
                                    </button>

                                    {/* Hints Section */}
                                    <div className="pt-6 border-t border-white/5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">¿Atascado? Considera una pista</p>
                                            {item.data?.hint_penalty > 0 && (
                                                <p className="text-[10px] text-red-500/80 font-black italic">
                                                    Penalización: -{item.data.hint_penalty} pts por pista
                                                </p>
                                            )}
                                        </div>
                                        <div className="grid gap-3">
                                            {[0, 1, 2].map((idx) => (
                                                <div key={idx} className="space-y-2">
                                                    {!revealedHints[idx] ? (
                                                        <button
                                                            onClick={() => setRevealedHints(prev => ({ ...prev, [idx]: true }))}
                                                            className="w-full py-3.5 px-5 bg-[#080808] hover:bg-slate-900 border border-white/5 rounded-2xl text-[10px] font-black text-gray-500 transition-all flex items-center justify-between group/btn shadow-inner"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Lock className="w-4 h-4 group-hover/btn:text-primary-500 transition-colors" />
                                                                <span className="group-hover/btn:text-gray-300 transition-colors uppercase tracking-[0.2em]">Desbloquear Pista #{idx + 1}</span>
                                                            </div>
                                                            <span className="text-[9px] text-red-500/50 font-black tracking-tighter bg-red-500/5 px-2 py-0.5 rounded-lg border border-red-500/10">
                                                                -{item.data?.hint_penalty || 0} PTS
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <div className="w-full py-4 px-5 bg-primary-500/5 border border-primary-500/20 rounded-2xl text-xs font-medium text-primary-200 animate-scale-up text-left flex gap-3">
                                                            <div className="w-1 h-full bg-primary-500 rounded-full"></div>
                                                            <p>{profile.hints?.[idx] || "Analiza los posts y la biografía del perfil."}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                            {item.points > 0 && (
                                <div className={`px-6 py-2.5 rounded-2xl font-black text-[11px] transition-all duration-700 shadow-xl ${isHackWon ? 'bg-yellow-500 text-slate-950 scale-105' : 'bg-slate-900 border border-white/10 text-yellow-500'}`}>
                                    +{item.points} PTS {isHackWon ? 'GANADOS' : ''}
                                </div>
                            )}
                            <div className="text-right">
                                <p className="text-[9px] font-mono text-gray-700 font-black">X-CORP INTRUSION SYSTEM</p>
                                <p className="text-[8px] font-mono text-gray-800 uppercase">Version 4.2.0-STABLE</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


function MfaDefenderActivity({ item, data, visitedLinks, markLinkAsVisited, playSuccess, playError }) {
    const isMfaCompleted = visitedLinks.has(item.id);
    const [mfaStatus, setMfaStatus] = useState(isMfaCompleted ? 'won' : 'idle');
    const [mfaCode, setMfaCode] = useState('------');
    const [userMfaInput, setUserMfaInput] = useState('');
    const [mfaFails, setMfaFails] = useState(0);
    
    // Cálculos derivados reactivos
    const hackTimeLimit = data.hack_time || 20;
    const mfaRotateTime = data.rotate_time || 5;
    const failPenalty = parseInt(data.fail_penalty) || 0;
    const currentPotentialPoints = Math.max(0, item.points - (mfaFails * failPenalty));

    const [timeLeft, setTimeLeft] = useState(hackTimeLimit);
    const [rotateProgress, setRotateProgress] = useState(100);

    const generateMfaCode = () => Math.floor(100000 + Math.random() * 900000).toString();

    const startMfaGame = () => {
        if (isMfaCompleted) return;
        setMfaStatus('playing');
        setTimeLeft(hackTimeLimit);
        setMfaCode(generateMfaCode());
        setRotateProgress(100);
        setUserMfaInput('');
    };

    useEffect(() => {
        let interval;
        if (mfaStatus === 'playing') {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 0.1) {
                        setMfaStatus('failed');
                        setMfaFails(f => {
                            const newFails = f + 1;
                            console.info(`[MFA-Lesson] FAILURE (Timeout)! Current fails: ${newFails}`);
                            return newFails;
                        });
                        playError?.();
                        return 0;
                    }
                    return prev - 0.1;
                });

                setRotateProgress(prev => {
                    const step = (100 / (mfaRotateTime * 10));
                    if (prev <= step) {
                        setMfaCode(generateMfaCode());
                        setMfaFails(f => {
                            const newFails = f + 1;
                            console.info(`[MFA-Lesson] FAILURE (Code Expired)! Current fails: ${newFails}`);
                            return newFails;
                        });
                        return 100;
                    }
                    return prev - step;
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [mfaStatus, hackTimeLimit, mfaRotateTime, playError]);

    const handleMfaSubmit = () => {
        if (mfaStatus !== 'playing') return;
        if (userMfaInput === mfaCode) {
            setMfaStatus('won');
            playSuccess?.();
            markLinkAsVisited(item.id, { mfaFails });
        } else {
            playError?.();
            setMfaFails(prev => {
                const newFails = prev + 1;
                console.info(`[MFA-Lesson] FAILURE (Wrong Code)! Current fails: ${newFails}`);
                return newFails;
            });
            setUserMfaInput('');
        }
    };

    return (
        <div className={`p-8 rounded-[2.5rem] transition-all duration-700 border-2 ${mfaStatus === 'won' ? 'bg-indigo-500/10 border-indigo-500/30' : mfaStatus === 'failed' ? 'bg-red-500/10 border-red-500/30 animate-shake' : 'bg-slate-900/40 border-white/5'}`}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-4 items-center">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${mfaStatus === 'won' ? 'bg-indigo-500 text-white' : 'bg-indigo-500/10 text-indigo-400'}`}>
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white uppercase tracking-tight">{item.title || 'Defensor MFA'}</h3>
                            <p className="text-sm text-gray-400 font-medium italic">
                                {data.description || 'El atacante tiene tu contraseña.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-black text-white/40 uppercase tracking-wider">Recompensa:</span>
                            <span className={`text-lg font-black tracking-tighter ${currentPotentialPoints === item.points ? 'text-emerald-400' : 'text-yellow-400'}`}>
                                {currentPotentialPoints} <span className="text-xs text-white/30">/ {item.points} PTS</span>
                            </span>
                        </div>
                        {failPenalty > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-red-500/60 uppercase tracking-widest">
                                    Panel de Riesgo: -{failPenalty} PTS x fallo
                                </span>
                                {mfaFails > 0 && (
                                    <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-[9px] font-black text-red-500 uppercase animate-pulse">
                                        -{mfaFails * failPenalty} acumulado ({mfaFails})
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto w-full">
                    <div className="bg-[#0a0a0a] rounded-3xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0"></div>
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-red-500 animate-pulse">
                                <div className="flex items-center gap-2"><Terminal className="w-4 h-4" /> Intruso Detectado</div>
                                <div>IP 192.168.XXX.XXX</div>
                            </div>
                            <div className="font-mono text-sm text-gray-500 leading-relaxed font-bold break-words">
                                &gt; Extrayendo credenciales... OK<br />
                                &gt; Match de contraseña... OK<br />
                                &gt; Obteniendo acceso root...
                            </div>
                        </div>
                        <div className="mt-8 space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-[11px] font-black text-red-400 uppercase tracking-widest">Progreso del Hackeo</span>
                                <span className="font-mono text-red-500 font-bold">{Math.max(0, timeLeft).toFixed(1)}s</span>
                            </div>
                            <div className="w-full h-3 bg-red-950/50 rounded-full overflow-hidden border border-red-500/20">
                                <div
                                    className="h-full bg-red-500 rounded-full transition-all duration-100 relative"
                                    style={{ width: `${(1 - (timeLeft / hackTimeLimit)) * 100}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800 rounded-3xl p-6 border-4 border-slate-700 relative shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
                        <div className="absolute top-2 w-16 h-1.5 bg-slate-900 rounded-full"></div>

                        {mfaStatus === 'idle' ? (
                            <div className="flex flex-col items-center gap-3">
                                <button
                                    onClick={startMfaGame}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 hover:scale-105 active:scale-95"
                                >
                                    <ShieldAlert className="w-5 h-5" /> Iniciar Defensa
                                </button>
                            </div>
                        ) : mfaStatus === 'failed' ? (
                            <div className="text-center space-y-4 animate-fade-in">
                                <XCircle className="w-16 h-16 text-red-500 mx-auto animate-shake" />
                                <div className="text-red-400 font-black uppercase tracking-widest">¡Sistema Comprometido!</div>
                                <button
                                    onClick={startMfaGame}
                                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold text-[10px] uppercase px-4 py-2 rounded-lg transition-colors mt-2"
                                >
                                    Reintentar
                                </button>
                            </div>
                        ) : mfaStatus === 'won' ? (
                            <div className="text-center space-y-4 animate-fade-in p-2">
                                <CheckCircle2 className="w-16 h-16 text-indigo-400 mx-auto scale-110" />
                                <div className="space-y-1">
                                    <div className="text-indigo-400 font-black uppercase tracking-widest text-lg">¡Misión Cumplida!</div>
                                    <div className="flex flex-col items-center gap-1">
                                        <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em]">
                                            PUNTOS GANADOS: {currentPotentialPoints} PTS
                                        </p>
                                        {mfaFails > 0 && failPenalty > 0 && (
                                            <p className="text-[9px] text-red-500/80 font-bold uppercase tracking-[0.1em] animate-pulse">
                                                (Penalización aplicada: -{mfaFails * failPenalty} pts por {mfaFails} fallos)
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-sm text-slate-300 font-medium leading-relaxed mt-4">
                                    Como acabas de experimentar, la contraseña por sí sola ya no es suficiente. El MFA añade una capa de seguridad vital.
                                </div>
                            </div>
                        ) : (
                            <div className="w-full space-y-6 text-center animate-fade-in">
                                <div className="flex items-center justify-center gap-2 text-indigo-400 mb-2">
                                    <Smartphone className="w-5 h-5" />
                                    <span className="font-extrabold text-[11px] uppercase tracking-widest text-slate-400">Authenticator App</span>
                                </div>

                                <div className="font-mono text-4xl text-white font-black tracking-[0.2em]">
                                    {mfaCode.substring(0, 3)} <span className="text-indigo-400">{mfaCode.substring(3)}</span>
                                </div>

                                <div className="w-full max-w-[200px] mx-auto h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 transition-all duration-100"
                                        style={{ width: `${rotateProgress}%` }}
                                    ></div>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <input
                                        type="text"
                                        placeholder="000000"
                                        maxLength={6}
                                        value={userMfaInput}
                                        onChange={(e) => setUserMfaInput(e.target.value.replace(/\D/g, ''))}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && userMfaInput.length === 6) {
                                                handleMfaSubmit();
                                            }
                                        }}
                                        className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl py-3 text-center text-xl font-mono text-white outline-none transition-colors tracking-[0.3em]"
                                    />
                                    <button
                                        onClick={handleMfaSubmit}
                                        disabled={userMfaInput.length < 6}
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:opacity-50 text-white font-black uppercase tracking-widest text-[10px] py-3 rounded-xl transition-all shadow-lg active:scale-95"
                                    >
                                        Verificar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
