import { AddAccount } from '@/domain/usecases'
import { Either, left, right } from '@/shared'
import { ExistingUserError } from '@/domain/errors'
import { AddAccountRepository, Encrypter, FindAccountByNameRepository } from '@/data/protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encripter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly findAccountByNameRepository: FindAccountByNameRepository
  ) {}

  async add (accountData: AddAccount.Params): Promise<Either<ExistingUserError, AddAccount.Result>> {
    const userExists = await this.findAccountByNameRepository.find(accountData.name)
    if (!userExists) {
      const hashedPassword = await this.encripter.encrypt(accountData.password)
      const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
      return right(account)
    }
    return left(new ExistingUserError(accountData.name))
  }
}
