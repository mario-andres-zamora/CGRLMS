import React from 'react';
import { Toaster, resolveValue } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import CyberCat from './CyberCat';

/**
 * Componente Presentacional: ToastBubble (Pattern Section 1)
 * Se encarga puramente de la representación visual del mensaje estilo cómic.
 */
const ToastBubble = ({ t, message, icon }) => {
  const isSuccess = t.type === 'success';
  const isError = t.type === 'error';
  const isLoading = t.type === 'loading';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ 
        opacity: t.visible ? 1 : 0, 
        y: t.visible ? 0 : 20, 
        scale: t.visible ? 1 : 0.8 
      }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }}
      className={`${t.className} flex items-center gap-2`}
    >
      {/* Icono (CyberCat) */}
      <div className="relative z-10 drop-shadow-xl pointer-events-auto">
        {icon || (
          isLoading ? (
            <CyberCat className="w-20 h-20" variant="searching" />
          ) : (
            <CyberCat className="w-20 h-20" variant={isError ? 'panic' : 'success'} />
          )
        )}
      </div>

      {/* Contenido de la burbuja */}
      <div 
        role="alert"
        aria-live="polite"
        className={`comic-bubble-content shadow-2xl ${
          isSuccess ? 'comic-bubble-success' : 
          isError ? 'comic-bubble-error' : 
          isLoading ? 'comic-bubble-info border-primary-500/50' : ''
        }`}
      >
        {message}
      </div>
    </motion.div>
  );
};

export default function AppToaster() {
  return (
    <Toaster
      position="bottom-center"
      gutter={12}
      toastOptions={{
        duration: 5000,
        // Clases base para el Toaster
        className: 'comic-bubble-toast pointer-events-none',
        style: {
          background: 'transparent',
          boxShadow: 'none',
          border: 'none',
          padding: 0,
        },
      }}
    >
      {(t) => (
        <AnimatePresence mode="wait">
          <ToastBubble 
            key={t.id}
            t={t}
            message={resolveValue(t.message, t)}
            icon={t.icon}
          />
        </AnimatePresence>
      )}
    </Toaster>
  );
}
