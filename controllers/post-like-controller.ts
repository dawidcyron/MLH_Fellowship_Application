import { Request, Response } from 'express'
import { plainToClass } from 'class-transformer'
import { User } from '../models/user'
import { Container } from 'typedi'
import { PostLikeService } from '../services/post-like-service'

const addOrRemoveLike = async (req: Request, res: Response) => {
  const postLikeService = Container.get(PostLikeService)
  const user = plainToClass(User, req.user)
  const postId = parseInt(req.params.postId)
  const like = await postLikeService.addOrRemoveLike(postId, user)
  if (like.id) {
    res.status(200).json({
      status: 'success',
      message: 'Successfully liked the post'
    })
  } else {
    res.status(200).json({
      status: 'success',
      message: 'Successfully removed like from the post'
    })
  }
}

export { addOrRemoveLike }