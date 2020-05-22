export default class DuplicateEmailError extends Error {
  constructor () {
    super()
    this.status = 'error'
    this.type = 'duplicate_email'
    this.message = 'Account with provided email already exists'
    this.code = 400
  }

  status: string
  type: string
  code: number
}