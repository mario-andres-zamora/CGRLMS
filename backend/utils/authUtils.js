/**
 * Centraliza la lógica de roles y permisos en el backend.
 */

const ROLES = {
    ADMIN: 'admin',
    ANALYST: 'analyst',
    STUDENT: 'student',
    INSTRUCTOR: 'instructor'
};

/**
 * Verifica si un usuario tiene acceso a funciones administrativas
 * @param {Object} user - Objeto de usuario (req.user)
 * @returns {Boolean}
 */
const hasAdminAccess = (user) => {
    if (!user) return false;
    // Por ahora, solo admin y analyst tienen acceso a partes del panel admin
    return [ROLES.ADMIN, ROLES.ANALYST, ROLES.INSTRUCTOR].includes(user.role);
};

/**
 * Verifica si es administrador total
 * @param {Object} user 
 * @returns {Boolean}
 */
const isAdmin = (user) => user?.role === ROLES.ADMIN;

/**
 * Verifica si es analista o admin (para reportes)
 * @param {Object} user 
 * @returns {Boolean}
 */
const isAnalystOrAdmin = (user) => {
    return user?.role === ROLES.ANALYST || user?.role === ROLES.ADMIN;
};

module.exports = {
    ROLES,
    hasAdminAccess,
    isAdmin,
    isAnalystOrAdmin
};
