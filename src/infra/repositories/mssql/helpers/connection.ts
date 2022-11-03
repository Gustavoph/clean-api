import { DataSource } from 'typeorm'

export const connection = new DataSource({
  type: 'mssql',
  host: '192.168.1.238',
  port: 1433,
  username: 'dbadmin',
  password: '@rv0re24Xcv',
  database: 'SATLTRUCAOECO',
  entities: ['src/infra/repositories/typeorm/entities/*.ts'],
  logging: false,
  synchronize: true,
  options: { encrypt: false },
  extra: { trustServerCertificate: true }
})
