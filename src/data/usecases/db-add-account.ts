import { AddAccount } from '@/domain/usecases'
import { Either, left, right } from '@/shared'
import { ExistingUserError } from '@/domain/errors'
import { AddAccountRepository, Hasher, FindAccountByNameRepository } from '@/data/protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly findAccountByNameRepository: FindAccountByNameRepository
  ) {}

  async add (accountData: AddAccount.Params): Promise<Either<ExistingUserError, AddAccount.Result>> {
    const userExists = await this.findAccountByNameRepository.find(accountData.name)
    if (userExists) return left(new ExistingUserError(accountData.name))
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    return right(account)
  }
}
