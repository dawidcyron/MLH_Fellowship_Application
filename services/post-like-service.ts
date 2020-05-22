import { Container, Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { PostLike } from '../models/post-like'
import { Repository } from 'typeorm'
import { PostService } from './post-service'
import { User } from '../models/user'

@Service()
export class PostLikeService {

  constructor (
    @InjectRepository(PostLike)
    private postLikeRepository: Repository<PostLike>
  ) {}

  /**
   * Checks in the database if there exists a record of user liking the post. If it does, removes it, if not, adds it.
   * @param postId
   * @param user
   */
  async addOrRemoveLike (postId: number, user: User): Promise<PostLike> {
    const postService = Container.get(PostService)
    const post = await postService.getPostById(postId)
    const isAlreadyLiked = await this.postLikeRepository.findOne({ liked_by: user, liked_post: post })
    if (isAlreadyLiked) {
      return await this.postLikeRepository.remove(isAlreadyLiked)
    } else {
      const postLike = new PostLike()
      postLike.liked_post = post
      postLike.liked_by = user
      return await this.postLikeRepository.save(postLike)

    }
  }
}