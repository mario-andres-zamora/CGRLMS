import { useEffect, useRef } from 'react';
import toast, { useToasterStore } from 'react-hot-toast';
import { useSoundStore } from '../store/soundStore';

/**
 * Componente que escucha las notificaciones de toast y reproduce sonidos
 */
export default function ToastSoundEffect() {
    const { toasts } = useToasterStore();
    const lastPlayedId = useRef(null);

    const { playSound } = useSoundStore();

    useEffect(() => {
        // Encontrar el toast más reciente que acaba de aparecer
        const lastToast = toasts[toasts.length - 1];

        if (lastToast && lastToast.visible && lastPlayedId.current !== lastToast.id) {
            // Si el toast es de tipo error, reproducir gato-error.mp3 usando la tienda global
            if (lastToast.type === 'error') {
                playSound('/sounds/gato-error.mp3');
                lastPlayedId.current = lastToast.id;
            }
        }
    }, [toasts, playSound]);

    return null;
}
