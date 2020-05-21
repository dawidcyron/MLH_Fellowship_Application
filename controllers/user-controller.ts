import { Request, Response } from 'express'
import { Container } from 'typedi'
import UserService from '../services/user-service'
import { User } from '../models/user'
import { validate } from 'class-validator'

let createUser = async (req: Request, res: Response) => {
  let userService = Container.get(UserService)
  let user: User = User.fromJson(req)
  let errors = await validate(user)
  if (errors.length) {
    res.send(errors)
    return
  }
  user = await userService.createUser(user)
  res.send(user)
}

export {createUser}