import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as passport from 'passport'
import { createConnection, useContainer } from 'typeorm'
import { createUser, deleteUser, loginUser } from './controllers/user-controller'
import { Container } from 'typedi'
import UserService from './services/user-service'
import { User } from './models/user'
import { handleError } from './errors/error-handler'

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
  app.post('/login', loginUser)
  app.delete('/user', passport.authenticate('jwt', {session: false, failWithError: true}), deleteUser)
  app.use(handleError)
  app.listen(port, () => console.log('Server started at port 3000'))
})