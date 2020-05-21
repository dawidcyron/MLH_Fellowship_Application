import { Request, Response } from 'express'
import { Container } from 'typedi'
import * as jwt from 'jsonwebtoken'
import UserService from '../services/user-service'
import { User } from '../models/user'
import { validate } from 'class-validator'
import { Credentials } from '../models/credentials'

const createUser = async (req: Request, res: Response) => {
  const userService = Container.get(UserService)
  let user: User = User.fromJson(req.body)
  let errors = await validate(user)
  if (errors.length) {
    res.status(400).json({
      status: 'error',
      errors
    })
    return
  }
  user = await userService.createUser(user)
  delete user.password
  res.send(user)
}

const loginUser = async (req: Request, res: Response) => {
  const userService = Container.get(UserService)
  const credentials = Credentials.fromJson(req.body)
  const user = await userService.attemptLogin(credentials)
  if (user instanceof User) {
    //TODO: place secret in .env file
    const token = jwt.sign({id: user.id}, 'testSecret')
    res.json({
      token
    })
  } else {
    res.status(401).json( {
      status: 'error',
      message: 'Invalid credentials'
    })
  }
}

const deleteUser = async (req: Request, res: Response) => {
  const userService = Container.get(UserService)
  const user = req.user as User
  const affected = await userService.deleteUser(user)
  if (affected) {
    res.status(200).json({
      message: 'Successfully deleted user'
    })
  }
}

const getUser = (req: Request, res: Response) => {
  let user = req.user as User
  delete user.password
  res.status(200).json(user)
}


export {createUser, loginUser, deleteUser, getUser}