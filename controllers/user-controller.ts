import { Request, Response } from 'express'
import { Container } from 'typedi'
import UserService from '../services/user-service'
import { User } from '../models/user'
import { validate } from 'class-validator'
import { Credentials } from '../models/credentials'

const createUser = async (req: Request, res: Response) => {
  const userService = Container.get(UserService)
  let user: User = User.fromJson(req)
  let errors = await validate(user)
  if (errors.length) {
    res.send(errors)
    return
  }
  user = await userService.createUser(user)
  res.send(user)
}

const loginUser = async (req: Request, res: Response) => {
  const userService = Container.get(UserService)
  const credentials = Credentials.fromJson(req.body)
  const isSuccessfulLogin = userService.attemptLogin(credentials)
  if (isSuccessfulLogin) {

  } else {
    res.status(401).json( {
      status: 'error',
      message: 'Invalid credentials'
    })
  }
}



export {createUser, loginUser}