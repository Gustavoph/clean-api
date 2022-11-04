import { Account } from '@/domain/entities'
import { ExistingUserError } from '@/domain/errors'
import { AddAccount } from '@/domain/usecases'
import { SignUpController } from '@/presentation/controllers'
import { Validation } from '@/presentation/protocols'
import { Either, right } from '@/shared'
import { serverError } from '@/presentation/helpers'
import { ServerError } from '@/presentation/errors'

describe('SignUp Controller', () => {
  it('Should return 500 if AddAccount throws', async () => {
    class ValidationSpy implements Validation {
      validate (input: any): Error {
        return null
      }
    }

    class AddAccountSpy implements AddAccount {
      async add (account: AddAccount.Params): Promise<Either<ExistingUserError, Account>> {
        return right({
          id: 'any_id',
          name: 'any_name',
          password: 'any_password',
          sigeCode: 'any_sige_code',
          createdAt: 'any_created_at',
          permission: 'any_permission'
        })
      }
    }

    const validationSpy = new ValidationSpy()
    const addAccountSpy = new AddAccountSpy()
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce((): never => {
      throw new Error()
    })

    const sut = new SignUpController(validationSpy, addAccountSpy)
    const request: SignUpController.Request = {
      name: 'any_name',
      password: 'any_password',
      sigeCode: 'any_sigeCode',
      permission: 'any_permission',
      passwordConfirmation: 'any_password_confirmation'
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })
})
