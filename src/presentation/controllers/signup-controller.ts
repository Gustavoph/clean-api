import { AddAccount } from '@/domain/usecases'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers'

export class SignUpController implements Controller {
  constructor (private readonly addAccount: AddAccount) {}

  async handle (request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const { name, password, sigeCode, permission } = request
      const accountOrError = await this.addAccount.add({
        name, password, sigeCode, permission
      })
      if (accountOrError.isLeft()) {
        return badRequest(accountOrError.value)
      }
      return ok(accountOrError.value)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string
    password: string
    sigeCode: string
    permission: string
    passwordConfirmation: string
  }
}
