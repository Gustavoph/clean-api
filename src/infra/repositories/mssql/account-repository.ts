import { Account } from '@/domain/entities'
import { AddAccountRepository, FindAccountByNameRepository } from '@/data/protocols'

export class MssqlAccountRepository implements AddAccountRepository, FindAccountByNameRepository {
  async find (name: string): Promise<Account> {
    return null
  }

  async add (account: AddAccountRepository.Params): Promise<Account> {
    return null
  }
}
