import mariadb, { ConnectionConfig } from 'mariadb';
import * as process from 'process';

export async function init() {
  const config: ConnectionConfig = {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    ssl: {
      rejectUnauthorized: false
    }
  };
  let conn;
  try {
    conn = await mariadb.createConnection(config);
    const rows = await conn.query('SELECT 1 + 1 AS solution');
    console.log(rows); // [ { solution: 2 }, meta: ... ]
  } catch (err) {
    console.error(`Error connecting to MariaDB: ${err}`);
  } finally {
    if (conn) conn.end();
  }
}
