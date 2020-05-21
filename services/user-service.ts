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

  async createUser (user: User): Promise<User> {
    user.password = await bcrypt.hash(user.password, 10)
    user = await this.userRepository.save(user)
    return user
  }

  async attemptLogin (credentials: Credentials): Promise<boolean> {
    const user: User = await this.userRepository.findOne({ email: credentials.email })
    if (!user) {
      return false
    }
    return await bcrypt.compare(credentials.password, user.password);
  }
}