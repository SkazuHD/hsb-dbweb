export class SqlQueryBuilder {

  /**
   * FEEL FREE TO EXTEND OR OPTIMIZE
   */

  query: string;
  queryObject: any;

  constructor() {
    this.query = '';
    //TODO IMPLEMENT INSTEAD OF STRING CONCATENATION FOR MORE FLEXIBILITY
    this.queryObject = {};
  }

  //Select Query
  select(columns: string | string[]) {
    const columnList = Array.isArray(columns) ? columns.join(', ') : columns;
    this.query += `SELECT ${columnList} `;
    return this;
  }

  from(table: string) {
    this.query += ` FROM ${table}`;
    return this;
  }

  //Insert Query
  insertInto(table: string, columns: string[] | undefined = undefined) {
    this.query += `INSERT INTO ${table} `;
    if (columns)
      this.query += `(${columns.join(', ')}) `;
    return this;
  }

  values(numberOfValues: number) {
    this.query += ` VALUES (${Array(numberOfValues).fill('?').join(', ')})`;
    return this;
  }

  // Update Query
  update(table: string) {
    this.query += `UPDATE ${table}`;
    return this;
  }

  set(column: string, value: string | number | Date = "?") {
    this.query += ` SET ${column} = ${value}`;
    return this;
  }

  // Delete Query
  deleteFrom(table: string) {
    this.query = `DELETE
                  FROM ${table}`;
    return this;
  }

  // General
  where(column: string, value: string | number = "?") {
    if (typeof value === 'number' || value === "?") {
      this.query += ` WHERE ${column} = ${value}`;
    } else {
      this.query += ` WHERE ${column} = '${value}'`;
    }
    return this;
  }

  and(column: string, value: string | number = "?", comparator: '=' | '<' | '>' = '=') {
    if (typeof value === 'number' || value === "?") {
      this.query += ` AND ${column} ${comparator} ${value}`;
    } else {
      this.query += ` AND ${column} ${comparator} '${value}'`;
    }
    return this;
  }

  or(column: string, value: string | number = "?") {
    if (typeof value === 'number' || value === "?") {
      this.query += ` OR ${column} = ${value}`;
    } else {
      this.query += ` OR ${column} = '${value}'`;
    }
    return this;
  }

  limit(limit: number) {
    this.query += ` LIMIT ${limit}`;
    return this;
  }

  orderBy(column: string, order: string) {
    this.query += ` ORDER BY ${column} ${order}`;
    return this;
  }

  offset(offset: number) {
    this.query += ` OFFSET ${offset}`;
    return this;
  }

  onDuplicateKey(columns: string[], values: string[]) {
    this.query += ` ON DUPLICATE KEY UPDATE `;
    for (let i = 0; i < columns.length; i++) {
      this.query += `${columns[i]} = ${values[i]}`;
      if (i < columns.length - 1) {
        this.query += ', ';
      }
    }
    return this;
  }

  build() {
    return this.query.trim() + ';';
  }


}
