// host: "127.0.0.1",
// user: "root",
// password: "root",
// database: "charge",
// port: 3306,
import mysql from 'mysql';

export default class MySQL {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
  conn: mysql.Connection;
  constructor(host: string, user: string, password: string, database: string, port: number = 3306) {
    this.host = host;
    this.user = user;
    this.password = password;
    this.database = database;
    this.port = port;
    this.conn = mysql.createConnection({
      host: this.host,
      user: this.user,
      password: this.password,
      database: this.database,
      port: this.port,
      multipleStatements: true,
      connectTimeout: 5000,
    });
  }

  connect(): Promise<any> {
    let that = this;

    return new Promise((resolve, reject) => {
      console.log('connect');
      that.conn.connect((err: mysql.MysqlError, ...args: any[]) => {
        if (err) {
          console.log('err', err);

          reject(err);
        } else {
          resolve(null);
        }
      });
    });
  }

  query(sql: string, params: any): Promise<any> {
    let that = this;
    return new Promise(function (resolve, reject) {
      let start = new Date();
      that.conn.query(sql, params, (err: any, data: any, fields: any) => {
        let gap = new Date().getMilliseconds() - start.getMilliseconds();
        console.log(gap);
        if (err) {
          reject(err);
        } else {
          resolve({
            data,
            gap,
            fields,
          });
        }
      });
    });
  }

  close() {
    this.conn.end();
  }
}
