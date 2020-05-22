export default class CustomError extends Error {
  constructor () {
    super()
    this.name = 'spy'
  }
  name: string
}