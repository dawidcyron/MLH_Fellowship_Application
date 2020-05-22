import { User } from '../models/user'
import * as bcrypt from 'bcrypt'
import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import { Credentials } from '../models/credentials'
import InvalidCredentialsError from '../errors/invalid-credentials-error'

@Service()
export default class UserService {

  constructor (
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  /**
   * Find single user and return without password
   * @param userId
   */
  async findUserById (userId: number) {
    const user = await this.userRepository.findOne(userId, {
      select: ['id', 'email', 'password', 'first_name', 'last_name', 'birth_date']
    })
    delete user.password
    return user
  }

  /**
   * Hash the password using bcrypt and save user to database
   * @param user User object that should be saved
   */
  async createUser (user: User): Promise<User> {
    user.password = await bcrypt.hash(user.password, 10)
    user = await this.userRepository.save(user)
    return user
  }

  /**
   * Checks provided credentials, if user with given credentials exists returns him, else throws error
   * @param credentials Credentials containing email and password
   * @throws InvalidCredentialsError Error thrown if credentials are incorrect
   */
  async attemptLogin (credentials: Credentials): Promise<User> {
    const user: User = await this.userRepository.findOne({ email: credentials.email }, { select: ['password', 'id'] })
    if (!user) {
      throw new InvalidCredentialsError()
    }
    if (await bcrypt.compare(credentials.password, user.password)) {
      return user
    } else {
      throw new InvalidCredentialsError()
    }
  }

  /**
   * Deletes a user
   * @param user User that should be deleted
   */
  async deleteUser (user: User): Promise<User> {
    return await this.userRepository.remove(user)
  }
}