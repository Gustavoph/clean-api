import { AddAccount } from '@/domain/usecases'
import { AddAccountRepository, Encrypter, FindAccountByNameRepository } from '@/data/protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encripter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly findAccountByNameRepository: FindAccountByNameRepository
  ) {}

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const userExists = await this.findAccountByNameRepository.find(accountData.name)
    if (!userExists) {
      const hashedPassword = await this.encripter.encrypt(accountData.password)
      const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
      return account
    }
    return null
  }
}
