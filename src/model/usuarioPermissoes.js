const db = require('../../database/mysql.js');

async function getRoles() {
    const [rows] = await db.query('SELECT id, name FROM roles WHERE excluido < 1 ORDER BY id');
    return rows.map(r => ({ id: r.id, name: r.name }));
}

async function getPermissions() {
    const [rows] = await db.query('SELECT id, name FROM permissions WHERE excluido < 1 ORDER BY id');
    return rows.map(p => ({ id: p.id, name: p.name }));
}

async function getMatrix() {
    const [rows] = await db.query(`
        SELECT r.name AS role, p.name AS permission, rp.access
        FROM role_permissions rp
        INNER JOIN roles r ON r.id = rp.role_id
        INNER JOIN permissions p ON p.id = rp.permission_id
    `);

    const matrix = {};
    for (const row of rows) {
        matrix[row.role] = matrix[row.role] || {};
        matrix[row.role][row.permission] = row.access === 'full' ? true : (row.access === 'view' ? 'view' : false);
    }

    return matrix;
}

async function saveMatrix(matrix) {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [rolesRows] = await conn.query('SELECT id, name FROM roles WHERE excluido < 1');
        const [permRows] = await conn.query('SELECT id, name FROM permissions WHERE excluido < 1');

        const roleByName = {};
        for (const r of rolesRows) roleByName[r.name] = r.id;
        const permByName = {};
        for (const p of permRows) permByName[p.name] = p.id;

        const inserts = [];
        for (const roleName of Object.keys(matrix)) {
            const roleId = roleByName[roleName];
            if (!roleId) continue;
            const perms = matrix[roleName] || {};
            for (const permName of Object.keys(perms)) {
                const permId = permByName[permName];
                if (!permId) continue;
                const val = perms[permName];
                let access = 'none';
                if (val === true || val === 'full') access = 'full';
                else if (val === 'view') access = 'view';
                else access = 'none';

                inserts.push([roleId, permId, access]);
            }
        }

        if (inserts.length > 0) {
            const sql = 'INSERT INTO role_permissions (role_id, permission_id, access) VALUES ? ON DUPLICATE KEY UPDATE access = VALUES(access)';
            await conn.query(sql, [inserts]);
        }

        await conn.commit();
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}

module.exports = {
    getRoles,
    getPermissions,
    getMatrix,
    saveMatrix
};
