import { User } from '../models/user'
import * as bcrypt from 'bcrypt'
import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'

@Service()
export default class UserService {

  constructor (
    @InjectRepository(User)
  private userRepository: Repository<User>
  ) {}

  async createUser(user: User) {
    user.password = await bcrypt.hash(user.password, 10)
    user = await this.userRepository.save(user)
    return user
  }
}