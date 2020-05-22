import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Post } from '../models/post'
import { Repository } from 'typeorm'
import { User } from '../models/user'
import AuthenticationError from '../errors/authentication-error'

@Service()
export class PostService {

  constructor (
    @InjectRepository(Post)
    private postRepository: Repository<Post>
  ) {}

  /**
   * Saves Post object to database.
   * @param post Post object to be saved
   */
  async createNewPost (post: Post): Promise<Post> {
    return await this.postRepository.save(post)
  }

  /**
   * Deletes post from database, ensuring that the current user is the creator of it
   * @param postId
   * @param user Currently logged in user
   * @throws AuthenticationError if the user is not the creator of the post
   */
  async deletePost (postId: number, user: User): Promise<Post> {
    const post = await this.postRepository.findOne(postId, { relations: ['author'] })
    if (post.author.id === user.id) {
      return await this.postRepository.remove(post)
    } else {
      throw new AuthenticationError()
    }
  }

  /**
   * Fetches all posts from database
   */
  async getAllPosts () {
    return await this.postRepository.find({ relations: ['author', 'likes'] })
  }

  /**
   * Fetches single post from database
   * @param postId
   */
  async getPostById (postId: number): Promise<Post> {
    return await this.postRepository.findOne(postId)
  }
}