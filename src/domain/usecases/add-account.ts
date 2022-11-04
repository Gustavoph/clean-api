import { Either } from '@/shared'
import { Account } from '@/domain/entities'
import { NameAlreadyInUseError } from '@/domain/errors'

export interface AddAccount {
  add: (account: AddAccount.Params) => Promise<Either<NameAlreadyInUseError, AddAccount.Result>>
}

export namespace AddAccount {
  export type Params = Omit<Account, 'id' | 'createdAt'>
  export type Result = Account
}
