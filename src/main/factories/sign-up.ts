import { DbAddAccount } from '@/data/usecases/db-add-account'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter'
import { MssqlAccountRepository } from '@/infra/repositories/mssql'
import { SignUpController } from '@/presentation/controllers/signup-controller'
import { makeSignUpValidation } from './sign-up-validation'

export const makeSignUpController = (): SignUpController => {
  const hasher = new BcryptAdapter(10)
  const accountRepository = new MssqlAccountRepository()
  const dbAddAccount = new DbAddAccount(hasher, accountRepository, accountRepository)

  const controller = new SignUpController(makeSignUpValidation(), dbAddAccount)
  return controller
}
