import { connection } from '@/infra/repositories/mssql/helpers'

connection.initialize().then(async () => {
  const app = (await import('./config/app')).default
  app.listen(5050, () => console.log('Server running at http://localhost:5050'))
}).catch(err => console.log(err))
