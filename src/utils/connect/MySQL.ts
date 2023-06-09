// host: "127.0.0.1",
// user: "root",
// password: "root",
// database: "charge",
// port: 3306,
import mysql from 'mysql';
import { IHistoryState, useHistoryStore } from '~/store/modules/history';
export default class MySQL {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
  conn: mysql.Connection;
  store?: any;

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
      typeCast: function (field, next) {
        if (field.type === 'DATETIME') {
          let val = field.string();
          // console.log(new Date(val));
          if (val) {
            return new Date(val);
          } else {
            return null;
          }
        } else if (field.type === 'TINY') {
          let val = field.string();
          // if (val === '1') {
          //   return true;
          // } else if (val === '0') {
          //   return false;
          // } else {
          //   return val;
          // }
          return val;
        } /*else if (field.type === 'BIT') {
          // let val = field.string();
          console.error(field);
          next();
        }*/
        return next();
      },
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
          this.store = useHistoryStore();

          resolve(null);
        }
      });
    });
  }

  query(sql: string, params: any): Promise<any> {
    let that = this;
    let start = new Date();
    return new Promise(function (resolve, reject) {
      that.conn.query(sql, params, (err: any, data: any, fields: any) => {
        let gap = Math.abs(start.getMilliseconds() - new Date().getMilliseconds());
        console.log(gap);
        if (err) {
          that.store.add({
            sql: sql,
            date: new Date(),
            elapsed: gap,
            flag: false,
            error: err,
          });
          reject(err);
        } else {
          that.store.add({
            sql: sql,
            date: new Date(),
            elapsed: gap,
            flag: true,
            rows: data.length,
          });
          resolve({
            data,
            gap,
            fields,
          });
        }
      });
    });
  }

  async getDatabases() {
    return await this.query('SELECT * FROM `information_schema`.`SCHEMATA`', []);
  }

  async getTables(database: string) {
    this.conn.changeUser({ database: database });
    return await this.query('SHOW TABLES;', [database]);
  }

  async getTableInfomations(database: string) {
    return await this.query('SELECT * FROM `information_schema`.`TABLES` WHERE `TABLE_SCHEMA` = ?', [database]);
  }

  async getTableFields(database: string, table: string) {
    return await this.query('SHOW FULL FIELDS FROM `' + database + '`.`' + table + '`', []);
  }

  async getTableFieldInfomation(database: string, table: string) {
    return await this.query('SELECT * FROM `information_schema`.`COLUMNS` WHERE `TABLE_SCHEMA` = ? AND TABLE_NAME=?', [
      database,
      table,
    ]);
  }

  async getTableDDL(database: string, table: string) {
    return await this.query('SHOW CREATE TABLE `' + database + '`.`' + table + '`', []);
  }

  async getCollations() {
    return await this.query('SELECT * FROM `information_schema`.`COLLATIONS` ', []);
  }

  async status() {
    let resp = await this.query('SHOW STATUS', []);

    return resp;
  }

  async showVariables() {
    let resp = await this.query('SHOW VARIABLES', []);
    let data = resp.data;
    let result = {};
    for (let val of data) {
      result[val.Variable_name] = val.Value;
    }
    console.log(result);

    return result;
  }

  async processList() {
    let resp = await this.query('SHOW PROCESSLIST;', []);

    return resp;
  }

  async createDatabase(database: string, collation: string) {
    let resp = await this.query(`CREATE DATABASE ${database} DEFAULT COLLATE ${collation}`, []);

    return resp;
  }

  close() {
    this.conn.end();
  }
}
