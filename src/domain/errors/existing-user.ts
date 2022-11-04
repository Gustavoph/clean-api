export class NameAlreadyInUseError extends Error {
  constructor (name: string) {
    super(`Name ${name} already registered.`)
    this.name = 'NameAlreadyInUseError'
  }
}
