# Módulo: Fundamentos de Seguridad de la Información (CGR)

Este módulo detallado cubre los lineamientos institucionales **DGA-0056-2025** basados en **ISO/IEC 27001:2022**. Está diseñado para completarse en **30 minutos**.

---

## Lección 1: Marco Normativo y los Pilares de la Seguridad (El Escudo CGR)
*   **Duración:** 10 minutos.
*   **Contenido Extendido:**
    *   **El Valor de la Información:** En la CGR, la información es un **activo crítico** (Lineamiento E.3). No son solo archivos; es el sustento de la fiscalización superior. Si la información se pierde o altera, la Hacienda Pública queda ciega.
    *   **Marco Normativo 2.0:** La resolución **R-DC-00069-2025** (DGA-0056-2025) alinea a la institución con la norma **ISO/IEC 27001:2022**. Es la "Constitución" de seguridad en la CGR.
    *   **Los Pilares (Tríada CIA):**
        *   **Confidencialidad:** Proteger el secreto de las denuncias y planes de auditoría. (**Apartado D / E.3.2**).
        *   **Integridad:** Asegurar que los informes finales no sean modificados por terceros. (**Apartado D**).
        *   **Disponibilidad:** Que el SICA y Declaraciones Juradas funcionen bajo cualquier ataque. (**Apartado D**).
    *   **Mandamientos del Guardián (Recomendaciones):**
        1. **Principio de Necesidad de Saber:** Solo accede a lo que necesitas para tu trabajo.
        2. **Reporte Proactivo:** Si ves una vulnerabilidad (puerta abierta, PC desbloqueado), actúa, no ignores.
        3. **Responsabilidad Solidaria:** La seguridad de la CGR es tan fuerte como su eslabón más débil (un funcionario).
*   **Interactividad Gamificada (PRO):** **"Misión: El Escudo de la Contraloría"**. 
    *   **Etapa 1:** *Descifrando el Código*. El usuario debe seleccionar entre 3 frases cuál define la misión de seguridad de la CGR según la normativa 2025.
    *   **Etapa 2:** *Defensa de la Tríada*. Se presentan 3 amenazas (Ataque DDoS, Filtración de Datos, Borrado de Archivos). El usuario debe arrastrar el "Escudo CIA" correcto (Confidencialidad, Integridad o Disponibilidad) para detener cada ataque.
    *   **Etapa 3:** *Juramento Digital*. Una ceremonia visual donde el usuario firma su compromiso con los lineamientos, desbloqueando su primer fragmento de la insignia final.

## Lección 2: Buenas Prácticas de Seguridad
*   **Duración:** 10 minutos.
*   **Contenido Extendido:**
    *   **Comunicaciones Seguras (H.2):**
        *   **Correo Electrónico:** Uso exclusivo institucional. Prohibido usarlo para fines personales.
        *   **Prevención de Phishing:**
            1. **Verificar Remitente:** Pasa el cursor sobre el nombre para ver la dirección real. Desconfía si no termina en `@cgr.go.cr`.
            2. **No hacer clic:** Evita enlaces en correos no solicitados o con tono de urgencia.
            3. **Archivos Sospechosos:** No descargues ni abras adjuntos de remitentes desconocidos (especialmente `.zip`, `.exe`, `.html`).
            4. **Reportar:** Si sospechas de un correo, no lo borres sin avisar; usa el botón de reporte o notifica al **SOS** inmediatamente.
        *   **Navegación Web:** Uso responsable y orientado a funciones laborales.
    *   **Uso de Equipos (G.2):** Prohibido el uso de equipos personales (BYOD) para procesar información de la CGR sin autorización. Las laptops y tablets institucionales son herramientas de trabajo, no de entretenimiento.
    *   **Protección de la Información (E.3):** Clasifica siempre tus archivos. Si un documento contiene estrategias de fiscalización, es **Restringido**; si contiene datos personales, es **Sensible**.
    *   **Entorno Físico (G.5):** 
        *   **Bloqueo de Pantalla:** Regla de oro: `Win + L` cada vez que te levantes, aunque sea por un minuto.
        *   **Escritorio Limpio:** No dejes documentos restringidos ni USBs sobre la mesa al final del día.
*   **Interactividad Gamificada:** **"El Inspector de Estación"**. El usuario recorre una oficina virtual y debe "marcar" las infracciones: un USB olvidado, un correo personal abierto, un documento sensible sin clasificar y una PC desbloqueada.

## Lección 3: Identidad y Llaves Maestras (MFA y Gestión de Claves)
*   **Duración:** 8 minutos.
*   **Contenido Extendido:**
    *   **Identidad Digital Intransferible (H.1):** Tu usuario y contraseña son tu "firma digital". Cederlos es una falta a la integridad institucional.
    *   **Autenticación de Múltiples Factores (MFA):** No basta con una clave. El MFA combina:
        1. **Algo que sabes:** Contraseña o PIN.
        2. **Algo que tienes:** Token físico o código en Authenticator (Obligatorio en CGR - **H.1.3**).
        3. **Algo que eres:** Biometría (Huella o FaceID en dispositivos móviles).
    *   **El Arte de una Password CGR (H.1.7):**
        *   **Longitud sobre Complejidad:** Es más segura una frase larga como `MiGatoEsElReyDeLaCGR2025!` que una corta compleja como `Xy7$!`.
        *   **Vida Útil:** Cambia tu clave según la política de caducidad de la UTI para invalidar posibles filtraciones antiguas.
    *   **Administradores de Contraseñas:** Memorizar 20 claves complejas es imposible. Usa herramientas **aprobadas por la UTI y el CISO** para cifrar tus accesos. Nunca guardes claves en navegadores públicos ni en "post-its" digitales.
*   **Interactividad Gamificada:** **"Forjador de Claves y Escudos"**. 
    *   **Reto 1:** El usuario debe construir una "Passphrase" institucional que resista un ataque de *Brute-Force* de 100 años.
    *   **Reto 2:** Configurar virtualmente el MFA en una cuenta de correo, eligiendo el método más seguro (Authenticator App vs SMS).

## Lección 4: Guardianes y Respuesta SOS
*   **Duración:** 5 minutos.
*   **Contenido Extendido:**
    *   **Roles Clave:** El **CISO** (E.1.2) guía la estrategia, la **UTI** (E.1.4) mantiene los sistemas y el **CSIRT** (E.1.3) atiende ataques mayores.
    *   **Reporte SOS:** Tu responsabilidad es reportar cualquier anomalía (correos sospechosos, lentitud inusual, pérdida de equipo) inmediatamente a la mesa de servicio SOS.
*   **Interactividad Gamificada:** **"Botón de Pánico SOS"**. Se presentan situaciones (ataque de virus, robo de laptop, phishing). El usuario debe decidir a quién reportar y con qué prioridad para contener la amenaza.

---

## Especificaciones Técnicas para Desarrollo
Para la implementación en el LMS, se proponen los siguientes componentes interactivos:

1.  **Input Interactivo (Nuevo Tipo):**
    *   **Funcionalidad:** Campo de texto donde el usuario escribe su respuesta.
    *   **Validación Opcional:** El sistema puede validar contra un `string` exacto, una `regex` (ej: para fuerza de contraseña) o simplemente permitir entrada libre (reflexión).
    *   **Feedback:** Si es validado, mostrar "Correcto/Incorrecto". Si es libre, guardar la respuesta para el tutor.

2.  **Clasificador de Arrastre (Drag & Drop):** Para los retos de Tríada CIA y Categorías MAI.

3.  **Simulador de Phishing:** Componente visual de correo con zonas calientes (hotspots) para identificar errores.

---

## Resumen de Gamificación y Recompensas
*   **Puntos Totales:** 300 PTS.
*   **Insignia Principal:** **"Guardián de la Integridad CGR"** (otorgada al completar las 4 lecciones).
*   **Bonus "Cero Riesgos":** Si completas el interactivo de "El Inspector de Estación" sin fallos, desbloqueas el rango de "Auditor de Seguridad Senior".
*   **Reto Diario:** Al finalizar, se activa un "Check-list" diario en la App que te da 10 PTS extra por cada día que confirmes haber bloqueado tu pantalla al salir.

---
*Nota: Este contenido ha sido sintetizado de los lineamientos oficiales DGA-0056-2025 para fines educativos en la plataforma LMS-CGR.*

---
*Nota: Este contenido debe ser validado por la CISO institucional antes de ser cargado al ambiente de producción.*
