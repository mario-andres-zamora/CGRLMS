/**
 * Perfiles para el juego HackNeighbor
 * IMPORTANTE: Este archivo contiene las contraseñas reales y SOLO debe existir en el backend.
 */
const HACK_PROFILES = [
    {
        id: 1, name: 'Carlos Miranda', cat: 'Pelusa', birthday: '12 de Junio', team: 'Saprissa', work: 'Recursos Humanos', password: 'Pelusa1206', bio: 'Amante de los gatos y apasionado por el fútbol. ¡Vamos Monstruo!',
        profile_pic: '/images/hack-game/user_1.png', pet_pic: '/images/hack-game/pet_1.png',
        hints: ['Busca el nombre de su mascota en su biografía.', 'Combina el nombre del gato con su fecha de nacimiento.', 'El formato es Gato + DíaMes (Ej: Gato0101)']
    },
    {
        id: 2, name: 'Maria Solano', cat: 'Zeus', birthday: '30 de Septiembre', team: 'Alajuelense', work: 'Auditoría', password: 'Auditoria3009', bio: 'Comprometida con la transparencia. Fanática de los leones.',
        profile_pic: '/images/hack-game/user_2.png', pet_pic: '/images/hack-game/pet_2.png',
        hints: ['A veces usa su departamento de trabajo como base.', 'Revisa la fecha de su cumpleaños en su perfil.', 'Estructura: Trabajo + DíaMes (Ej: Ventas0101)']
    },
    {
        id: 3, name: 'Jorge Castro', cat: 'Luna', birthday: '15 de Enero', team: 'Herediano', work: 'TI', password: 'Herediano1501', bio: 'Tech enthusiast. El Team es mi pasión.',
        profile_pic: '/images/hack-game/user_3.png', pet_pic: '/images/hack-game/pet_3.png',
        hints: ['Su equipo de fútbol es su identidad.', 'Enero es el mes 01. Busca el día exacto.', 'Contraseña tipo: EquipoDíaMes']
    },
    {
        id: 4, name: 'Elena Rojas', cat: 'Simba', birthday: '22 de Marzo', team: 'Cartaginés', work: 'Jurídico', password: 'Simba2203', bio: 'Abogada por vocación. Siempre fiel al azul y blanco.',
        profile_pic: '/images/hack-game/user_4.png', pet_pic: '/images/hack-game/pet_4.png',
        hints: ['El nombre de su mascota es de un rey león.', 'Marzo es el tercer mes del año.', 'Une el gato con el número del día y del mes.']
    },
    {
        id: 5, name: 'Roberto Vargas', cat: 'Toby', birthday: '05 de Mayo', team: 'Saprissa', work: 'Administración', password: 'Roberto0505', bio: 'Gestionando el éxito. Morado de corazón.',
        profile_pic: '/images/hack-game/user_5.png', pet_pic: '/images/hack-game/pet_5.png',
        hints: ['Usa su propio nombre para no olvidar la clave.', 'Mayo es el mes 05.', 'Sigue el patrón: Nombre0505']
    },
    {
        id: 6, name: 'Lucia Gomez', cat: 'Nala', birthday: '18 de Agosto', team: 'Alajuelense', work: 'Contabilidad', password: 'Manuda1808', bio: 'Los números no mienten. 100% Manuda.',
        profile_pic: '/images/hack-game/user_6.png', pet_pic: '/images/hack-game/pet_6.png',
        hints: ['Usa su apodo de aficionada ("Manuda").', 'Agosto es el mes 08.', 'Escribe el apodo y luego 1808']
    },
    {
        id: 7, name: 'Andres Salas', cat: 'Rocky', birthday: '25 de Diciembre', team: 'Herediano', work: 'Comunicaciones', password: 'Comunicaciones2512', bio: 'Conectando personas. El Team fluye por mis venas.',
        profile_pic: '/images/hack-game/user_7.png', pet_pic: '/images/hack-game/pet_7.png',
        hints: ['Su clave está relacionada con su departamento.', 'Nació el mismo día que Navidad.', 'La clave es Departamento + Día + Mes']
    },
    {
        id: 8, name: 'Sofia Blanco', cat: 'Mochi', birthday: '14 de Febrero', team: 'Saprissa', work: 'Recepción', password: 'Mochi1402', bio: 'Atención con una sonrisa. ¡Saprissista siempre!',
        profile_pic: '/images/hack-game/user_8.png', pet_pic: '/images/hack-game/pet_8.png',
        hints: ['Nació en el día de San Valentín.', 'Su mascota se llama Mochi.', 'Prueba con Mochi1402']
    },
    {
        id: 9, name: 'Luis Mora', cat: 'Bruno', birthday: '09 de Septiembre', team: 'Alajuelense', work: 'Seguridad', password: 'Bruno0909', bio: 'Protegiendo lo que importa. Alma liguista.',
        profile_pic: '/images/hack-game/user_9.png', pet_pic: '/images/hack-game/pet_9.png',
        hints: ['El gato se llama Bruno.', 'Septiembre es el mes 09.', 'La secuencia es Bruno0909']
    },
    {
        id: 10, name: 'Carmen Lopez', cat: 'Kira', birthday: '01 de Noviembre', team: 'Herediano', work: 'Compras', password: 'Kira0111', bio: 'Buscando las mejores ofertas. Team unida jamás será vencida.',
        profile_pic: '/images/hack-game/user_10.png', pet_pic: '/images/hack-game/pet_10.png',
        hints: ['Su mascota es Kira.', 'Saca el día y mes de su biografía.', 'Prueba uniendo Kira con 0111']
    }
];

module.exports = { HACK_PROFILES };
