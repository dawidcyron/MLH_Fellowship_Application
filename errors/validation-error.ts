export default class ValidationError extends Error {
  constructor (errors) {
    super()
    this.status = 'error'
    this.type = 'validation_error'
    this.message = 'Some of the provided data is incorrect.'
    this.code = 400
    this.errors = errors.map(err => ({[err.property]: err.constraints}))
  }

  status: string
  type: string
  code: number
  errors: Array<Object>
}