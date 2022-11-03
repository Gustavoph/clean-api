import { Account } from '@/domain/entities'
import { connection } from '@/infra/repositories/mssql/helpers'
import { AccountModel } from '@/infra/repositories/mssql/entities'
import { AddAccountRepository, FindAccountByNameRepository } from '@/data/protocols'

export class MssqlAccountRepository implements AddAccountRepository, FindAccountByNameRepository {
  private readonly repository = connection.getRepository(AccountModel)

  async find (name: string): Promise<Account> {
    return await this.repository.findOne({ where: { name } })
  }

  async add (accountData: AddAccountRepository.Params): Promise<Account> {
    const account = this.repository.create(accountData)
    return await this.repository.save(account)
  }
}
