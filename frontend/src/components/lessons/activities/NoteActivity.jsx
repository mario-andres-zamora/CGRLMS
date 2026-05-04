import React from 'react';
import { Shield } from 'lucide-react';
import { linkify } from '../../../utils/textUtils';

export default function NoteActivity({ item, data }) {
    return (
        <div className="p-6 rounded-2xl bg-primary-500/5 border border-primary-500/10 flex gap-5 items-start animate-fade-in shadow-[inset_0_0_20px_rgba(59,130,246,0.02)]">
            <div className="p-3 bg-primary-500/10 rounded-xl text-primary-400 flex-shrink-0 shadow-lg border border-primary-500/20">
                <Shield className="w-6 h-6" />
            </div>
            <div>
                <h4 className="text-primary-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1.5">{item.title || 'Nota de Aprendizaje'}</h4>
                <p className="text-gray-400 text-sm leading-relaxed font-medium whitespace-pre-wrap">
                    {linkify(data.text || 'Recuerda tomar apuntes de los conceptos clave de esta sección.')}
                </p>
            </div>
        </div>
    );
}
