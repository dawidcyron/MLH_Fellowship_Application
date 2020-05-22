import { NextFunction, Request, Response } from 'express'
import { Container } from 'typedi'
import * as jwt from 'jsonwebtoken'
import UserService from '../services/user-service'
import { User } from '../models/user'
import { validate } from 'class-validator'
import { Credentials } from '../models/credentials'
import { plainToClass } from 'class-transformer'

/**
 * Route handler for creating new users. Extracts and validates data from the request, and passes it to UserService, and removes password before sending back
 * @param req
 * @param res
 * @param next
 */
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const userService = Container.get(UserService)
  let user: User = plainToClass(User, req.body, { excludeExtraneousValues: true })
  let errors = await validate(user)
  if (errors.length) {
    errors.forEach(err => console.log(err))
    return next(errors)
  }
  try {
    user = await userService.createUser(user)
    delete user.password
    res.status(201).json(user)
  } catch (e) {
    next(e)
  }
}

/**
 * Route handler for logging in users. Extracts and validates data and passes it to UserService
 * @param req
 * @param res
 * @param next
 */
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const userService = Container.get(UserService)
  const credentials = plainToClass(Credentials, req.body)
  try {
    const user = await userService.attemptLogin(credentials)
    //TODO: place secret in .env file
    const token = jwt.sign({ id: user.id }, 'testSecret')
    res.json({
      status: 'success',
      message: 'You successfully logged in',
      token
    })
  } catch (e) {
    return next(e)
  }
}

/**
 * Route handler for deleting users. Takes user from JWT and passes it to UserService for deletion
 * @param req
 * @param res
 */
const deleteUser = async (req: Request, res: Response) => {
  const userService = Container.get(UserService)
  let user = plainToClass(User, req.user)
  user = await userService.deleteUser(user)
  if (!user.id) {
    res.status(200).json({
      message: 'Successfully deleted user'
    })
  }
}

/**
 * Route handler for getting information about currently logged in user. Takes user from JWT and returns it
 * @param req
 * @param res
 */
const getUser = (req: Request, res: Response) => {
  let user = plainToClass(User, req.user)
  res.status(200).json(user)
}

export { createUser, loginUser, deleteUser, getUser }