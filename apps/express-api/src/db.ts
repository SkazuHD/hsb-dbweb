import mariadb, {Pool, PoolConfig} from 'mariadb';
import * as process from 'process';

class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    if (Database.instance) return Database.instance;
    const config: PoolConfig = {
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      trace: true,
      ssl: {
        rejectUnauthorized: false
      },
      connectionLimit: 5
    };
    this.pool = mariadb.createPool(config);
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async query(sql: string, params?: any[]): Promise<any> {
    let conn;
    try {
      conn = await this.pool.getConnection();
      return await conn.query(sql, params);
    } catch (err) {
      console.error(`Error executing query: ${err}`);
    } finally {
      if (conn) conn.release();
    }
  }
}

export default Database;
