import { Account } from '@/domain/entities'

export interface AddAccount {
  add: (account: AddAccount.Params) => Promise<AddAccount.Result>
}

export namespace AddAccount {
  export type Params = Omit<Account, 'id'>
  export type Result = Account
}
