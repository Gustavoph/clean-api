import { Account } from '@/domain/entities'

export interface FindAccountByNameRepository {
  find: (name: string) => Promise<FindAccountByNameRepository.Result>
}

export namespace FindAccountByNameRepository {
  export type Result = Account
}
