import { User } from '../models/user'
import * as bcrypt from 'bcrypt'
import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import { Credentials } from '../models/credentials'

@Service()
export default class UserService {

  constructor (
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findUserById (userId: number) {
    return await this.userRepository.findOne(userId)
  }

  async createUser (user: User): Promise<User> {
    user.password = await bcrypt.hash(user.password, 10)
    user = await this.userRepository.save(user)
    return user
  }

  async attemptLogin (credentials: Credentials): Promise<boolean | User> {
    const user: User = await this.userRepository.findOne({ email: credentials.email })
    if (!user) {
      return false
    }
    if (await bcrypt.compare(credentials.password, user.password)) {
      return user
    } else {
      return false
    }
  }

  async deleteUser (user: User) : Promise<number>{
    const { affected } = await this.userRepository.delete(user.id)
    return affected
  }
}