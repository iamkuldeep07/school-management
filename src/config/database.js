import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management',
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

/**
 * Initialize database — creates the DB and schools table if they don't exist.
 */
const initializeDatabase = async () => {
  // Connect without selecting a DB first to create it if needed
  const bootstrapPool = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    ssl: dbConfig.ssl, // 👈 ADDED THIS FOR AIVEN
    waitForConnections: true,
    connectionLimit: 1,
  });

  const conn = await bootstrapPool.getConnection();

  try {
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );

    await conn.query(`USE \`${dbConfig.database}\``);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id         INT           NOT NULL AUTO_INCREMENT,
        name       VARCHAR(255)  NOT NULL,
        address    VARCHAR(500)  NOT NULL,
        latitude   FLOAT         NOT NULL,
        longitude  FLOAT         NOT NULL,
        created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_coordinates (latitude, longitude)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅  Database and table initialised successfully.');
  } finally {
    conn.release();
    await bootstrapPool.end();
  }
};

export { pool, initializeDatabase };