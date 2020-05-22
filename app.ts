import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as passport from 'passport'
import { createConnection, useContainer } from 'typeorm'
import { createUser, deleteUser, getUser, loginUser } from './controllers/user-controller'
import { Container } from 'typedi'
import UserService from './services/user-service'
import { User } from './models/user'
import { handleError } from './errors/error-handler'
import { createNewPost, deletePost, getAllPosts } from './controllers/post-controller'
import { addOrRemoveLike } from './controllers/post-like-controller'

const app = express()

const port = 3000

useContainer(Container)

app.use(bodyParser.json())
app.use(handleError)

const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

createConnection().then(connection => {

  const userService = Container.get(UserService)
  passport.use(new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromBodyField('token'),
      secretOrKey: 'testSecret'
    },
    async function (jwtPayload, cb) {
      const user: User = await userService.findUserById(jwtPayload.id)
      if (user) {
        return cb(null, user)
      } else {
        return cb(new Error('User does not exist'))
      }
    }
  ))

  app.post('/user', createUser)
  app.delete('/user', passport.authenticate('jwt', { session: false, failWithError: true }), deleteUser)
  app.get('/user', passport.authenticate('jwt', { session: false, failWithError: true }), getUser)

  app.get('/post', passport.authenticate('jwt', {session: false, failWithError: true}), getAllPosts)
  app.post('/post', passport.authenticate('jwt', {session: false, failWithError: true}), createNewPost)
  app.delete('/post/:postId(\\d+)/', passport.authenticate('jwt', {session: false, failWithError: true}), deletePost)

  app.get('/like/:postId(\\d+)/', passport.authenticate('jwt', {session: false, failWithError: true}), addOrRemoveLike)

  app.post('/login', loginUser)

  app.use(handleError)
  app.listen(port, () => console.log('Server started at port 3000'))
})