export default class AuthenticationError extends Error {
  constructor () {
    super()
    this.status = 'error'
    this.type = 'unauthorized'
    this.message = 'You are not authorized to access this resource'
    this.code = 401
  }

  status: string
  type: string
  code: number
}