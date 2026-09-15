require("dotenv").config();

const { Pool } = require("pg");

let pool = null;
let inited = false;

// Helper to convert SQL with `?` placeholders to $1, $2, ... for pg
function convertPlaceholders(sql) {
  let index = 0;
  return sql.replace(/\?/g, () => {
    index += 1;
    return `$${index}`;
  });
}

function makePool(dbName) {
  return new Pool({
    host: process.env.DB_HOST || "postgres",
    user: process.env.DB_USER || process.env.POSTGRES_USER || "postgres",
    password:
      process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || "root",
    database: dbName,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    max: 10,
  });
}

async function ensureDatabaseExists(dbName) {
  // Try connecting to target DB. If it doesn't exist, connect to default 'postgres' and create it.
  let testPool = makePool(dbName);
  try {
    await testPool.query("SELECT 1");
    await testPool.end();
    return;
  } catch (err) {
    await testPool.end();
    // Postgres undefined_database error code is 3D000
    if (
      (err && err.code === "3D000") ||
      (err.message || "").includes("does not exist")
    ) {
      const adminPool = makePool(process.env.POSTGRES_DB || "postgres");
      try {
        // create database if not exists
        await adminPool.query(`CREATE DATABASE \"${dbName}\"`);
      } finally {
        await adminPool.end();
      }
      return;
    }
    throw err;
  }
}

async function init() {
  if (inited) return;
  const dbName =
    process.env.DB_NAME || process.env.POSTGRES_DB || "sistema_educacional";
  await ensureDatabaseExists(dbName);
  pool = makePool(dbName);
  inited = true;
}

async function query(sql, params = []) {
  if (!inited) await init();
  const convertedSql = convertPlaceholders(sql);
  const res = await pool.query(convertedSql, params);
  // return in mysql2 style: [rows, fields]
  return [res.rows, res.fields];
}

async function getConnection() {
  if (!inited) await init();
  const client = await pool.connect();

  function convert(sql) {
    return convertPlaceholders(sql);
  }

  return {
    query: async (sql, params = []) => {
      const convertedSql = convert(sql);
      const res = await client.query(convertedSql, params);
      return [res.rows, res.fields];
    },
    beginTransaction: async () => {
      await client.query("BEGIN");
    },
    commit: async () => {
      await client.query("COMMIT");
    },
    rollback: async () => {
      await client.query("ROLLBACK");
    },
    release: () => {
      client.release();
    },
  };
}

module.exports = { init, query, pool: () => pool, getConnection };
