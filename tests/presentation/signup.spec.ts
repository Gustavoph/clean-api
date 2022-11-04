import { Account } from '@/domain/entities'
import { ExistingUserError } from '@/domain/errors'
import { AddAccount } from '@/domain/usecases'
import { SignUpController } from '@/presentation/controllers'
import { Validation } from '@/presentation/protocols'
import { Either, left, right } from '@/shared'
import { badRequest, ok, serverError } from '@/presentation/helpers'
import { ServerError } from '@/presentation/errors'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeFakeAccount = (): Account => ({
  id: 'any_id',
  name: 'any_name',
  password: 'any_password',
  sigeCode: 'any_sige_code',
  createdAt: 'any_created_at',
  permission: 'any_permission'
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccount.Params): Promise<Either<ExistingUserError, Account>> {
      return right(makeFakeAccount())
    }
  }
  return new AddAccountStub()
}

const makeRequest = (): SignUpController.Request => ({
  name: 'any_name',
  password: 'any_password',
  sigeCode: 'any_sigeCode',
  permission: 'any_permission',
  passwordConfirmation: 'any_password_confirmation'
})

interface SutType {
  validationStub: Validation
  addAccountStub: AddAccount
  sut: SignUpController
}

const makeThrow = (): never => {
  throw new Error()
}

const makeSut = (): SutType => {
  const validationStub = makeValidation()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(validationStub, addAccountStub)
  return {
    sut,
    addAccountStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeRequest())
    expect(validationSpy).toHaveBeenCalledWith(makeRequest())
  })

  it('Should return badRequest if Validation return an error', async () => {
    const error = new Error('')
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => error)
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(badRequest(error))
  })

  it('Should return serverError if Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(makeThrow)
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: makeRequest().name,
      password: makeRequest().password,
      sigeCode: makeRequest().sigeCode,
      permission: makeRequest().permission
    })
  })

  it('Should return badRequest if AddAccount return an error', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return left(new ExistingUserError('any_name'))
    })
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(badRequest(new ExistingUserError('any_name')))
  })

  it('Should return serverError if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(makeThrow)
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  it('Should return ok if valida data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })
})
