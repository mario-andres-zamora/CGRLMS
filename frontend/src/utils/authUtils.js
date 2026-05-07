/**
 * Centraliza la lógica de permisos y roles de la plataforma.
 */

export const ROLES = {
    ADMIN: 'admin',
    ANALYST: 'analyst',
    STUDENT: 'student',
    INSTRUCTOR: 'instructor'
};

/**
 * Verifica si un usuario tiene acceso al panel de administración (ya sea total o parcial)
 * @param {Object} user - Objeto de usuario del store
 * @returns {Boolean}
 */
export const hasAdminPanelAccess = (user) => {
    if (!user) return false;
    return [ROLES.ADMIN, ROLES.ANALYST, ROLES.INSTRUCTOR].includes(user.role);
};

/**
 * Verifica si un usuario es administrador total
 * @param {Object} user - Objeto de usuario del store
 * @returns {Boolean}
 */
export const isFullAdmin = (user) => {
    return user?.role === ROLES.ADMIN;
};

/**
 * Verifica si un usuario es analista
 * @param {Object} user - Objeto de usuario del store
 * @returns {Boolean}
 */
export const isAnalyst = (user) => {
    return user?.role === ROLES.ANALYST;
};
