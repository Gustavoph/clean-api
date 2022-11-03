export class ExistingUserError extends Error {
  constructor (name: string) {
    super(`User ${name} already registered.`)
    this.name = 'ExistingUserError'
  }
}
