import { connection } from '@/infra/repositories/mssql/helpers'

connection.initialize()
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(3333, () => {
      console.log('Server running at http://localhost:3333')
    })
  })
  .catch(console.error)
