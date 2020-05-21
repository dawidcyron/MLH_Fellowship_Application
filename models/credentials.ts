export class Credentials {
  email: string
  password: string

  static fromJson = (json) => {
    return Object.assign(new Credentials(), json)
  }
}