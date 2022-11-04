import { Validation } from '@/presentation/protocols'
import { RequiredFieldValidation, ValidationComposite, CompareFieldsValidation } from '@/presentation/validations'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'password', 'passwordConfirmation', 'sigeCode', 'permission']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  return new ValidationComposite(validations)
}
