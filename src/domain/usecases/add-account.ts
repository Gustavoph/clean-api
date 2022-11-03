import { Account } from '@/domain/entities'

export interface AddAccount {
  add: (account: AddAccount.Params) => Promise<AddAccount.Result>
}

export namespace AddAccount {
  export type Params = Omit<Account, 'id' | 'createdAt'>
  export type Result = Account
}
