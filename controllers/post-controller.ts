import { NextFunction, Request, Response } from 'express'
import { Container } from 'typedi'
import { PostService } from '../services/post-service'
import { Post } from '../models/post'
import { validate } from 'class-validator'
import { User } from '../models/user'
import { plainToClass } from 'class-transformer'

/**
 * Route handler for creating new posts. Extracts and validates data and passes it to PostService for creation
 * @param req
 * @param res
 * @param next
 */
const createNewPost = async (req: Request, res: Response, next: NextFunction) => {
  const postService = Container.get(PostService)
  let post = plainToClass(Post, req.body, { excludeExtraneousValues: true })
  post.author = plainToClass(User, req.user)
  const errors = await validate(post)
  if (errors.length) {
    return next(errors)
  }
  post = await postService.createNewPost(post)
  delete post.author.password
  res.status(200).json({
    status: 'success',
    data: post
  })
}

/**
 * Route handler for deleteting posts. Extracts data from request and passes it to PostService for eletion
 * @param req
 * @param res
 */
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  const postService = Container.get(PostService)
  const postId = parseInt(req.params.postId)
  const user = plainToClass(User, req.user)
  try {
    const post = await postService.deletePost(postId, user)
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Deleted post'
      }
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Route handler for fetching all published posts.
 * @param req
 * @param res
 */
const getAllPosts = async (req: Request, res: Response) => {
  const postService = Container.get(PostService)
  res.status(200).json({
    status: 'success',
    data: await postService.getAllPosts()
  })
}

export { createNewPost, deletePost, getAllPosts }