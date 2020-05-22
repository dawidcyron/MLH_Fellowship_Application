/**
 * Error used to inform user about incorrect credentials
 */
export default class InvalidCredentialsError extends Error {
  constructor () {
    super()
    this.status = 'error'
    this.type = 'invalid_credentials'
    this.message = 'Invalid credentials or user does not exist'
    this.code = 400
  }

  status: string
  type: string
  code: number
}