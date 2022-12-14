import { DbAddAccount } from '@/data/usecases'
import { AddAccountRepository, Hasher, FindAccountByNameRepository } from '@/data/protocols'
import { Account } from '@/domain/entities'
import { AddAccount } from '@/domain/usecases'
import { NameAlreadyInUseError } from '@/domain/errors'
import { right } from '@/shared'

interface SutType {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  findAccountByNameRepositoryStub: FindAccountByNameRepository
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (plaintext: string): Promise<string> {
      return await Promise.resolve('hashed')
    }
  }

  return new HasherStub()
}

const makeFakeAccount = (): Account => ({
  id: 'any_id',
  name: 'any_name',
  password: 'any_password',
  sigeCode: 'any_sige_code',
  createdAt: 'any_created_at',
  permission: 'any_permission'
})

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccount.Params): Promise<Account> {
      return await Promise.resolve(makeFakeAccount())
    }
  }

  return new AddAccountRepositoryStub()
}

const makeFindAccountByNameRepository = (): FindAccountByNameRepository => {
  class FindAccountByNameRepositoryStub implements FindAccountByNameRepository {
    async find (name: string): Promise<Account> {
      return null
    }
  }
  return new FindAccountByNameRepositoryStub()
}

const makeSut = (): SutType => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const findAccountByNameRepositoryStub = makeFindAccountByNameRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, findAccountByNameRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    findAccountByNameRepositoryStub
  }
}

const makeFakeAddAccountData = (): AddAccount.Params => ({
  name: 'any_name',
  password: 'any_password',
  sigeCode: 'any_sigeCode',
  permission: 'any_permission'
})

describe('DbAddAccount', () => {
  it('Should call FindAccountByNameRepository with correct name', async () => {
    const { sut, findAccountByNameRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(findAccountByNameRepositoryStub, 'find')
    await sut.add(makeFakeAddAccountData())
    expect(findSpy).toHaveBeenCalledWith(makeFakeAddAccountData().name)
  })

  it('Should return ExistingUser if FindAccountByNameRepository returns an Account', async () => {
    const { sut, findAccountByNameRepositoryStub } = makeSut()
    jest.spyOn(findAccountByNameRepositoryStub, 'find').mockImplementationOnce(async () => {
      return await Promise.resolve(makeFakeAccount())
    })
    const accountOrError = await sut.add(makeFakeAddAccountData())
    expect(accountOrError.value).toEqual(new NameAlreadyInUseError(makeFakeAddAccountData().name))
  })

  it('Should throws if FindAccountByNameRepository throw', async () => {
    const { sut, findAccountByNameRepositoryStub } = makeSut()
    jest.spyOn(findAccountByNameRepositoryStub, 'find').mockImplementationOnce(async () => {
      throw new Error('')
    })
    const promise = sut.add(makeFakeAddAccountData())
    await expect(promise).rejects.toThrow()
  })

  it('Should call Hasher with correct text', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(makeFakeAddAccountData())
    expect(hashSpy).toHaveBeenCalledWith(makeFakeAddAccountData().password)
  })

  it('Should throws if Hasher throw', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(async () => {
      throw new Error('')
    })
    const promise = sut.add(makeFakeAddAccountData())
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeFakeAddAccountData())
    expect(addSpy).toHaveBeenCalledWith({ ...makeFakeAddAccountData(), password: 'hashed' })
  })

  it('Should throw AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(async () => {
      throw new Error('')
    })
    const promise = sut.add(makeFakeAddAccountData())
    await expect(promise).rejects.toThrow()
  })

  it('Should return an account if on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAddAccountData())
    expect(account).toEqual(right(makeFakeAccount()))
  })
})
