import * as chai from 'chai'
import * as dirtyChai from 'dirty-chai'
import * as chaiAsPromised from 'chai-as-promised'
import { User } from '../../../models/user'
import { Repository } from 'typeorm'
import UserService from '../../../services/user-service'
import * as bcrypt from 'bcrypt'

const expect = chai.expect

chai.use(dirtyChai)
chai.use(chaiAsPromised)

let plainPassword = 'plainPassword'
let user: User

const userRepository = {
  save: (user) => {
    user.id = 4
    return {
      ...user
    }
  }
} as Repository<User>

let userService: UserService = new UserService(userRepository)

beforeEach(() => {
  user = new User()
  user.email = 'test@test.com'
  user.password = plainPassword
})

describe("UserService", () => {
  describe('createUser', () => {
    it('Should create new user and return user object with Id', async () => {
      user = await userService.createUser(user)
      expect(user).to.not.be.undefined('User should be created')
      expect(user.password).to.not.equal(plainPassword, 'Password should be hashed using bcrypt')
      expect(await bcrypt.compare(plainPassword, user.password)).to.be.true('Hashed password should be a valid bcrypt hash')
    })
  })
})