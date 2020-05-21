import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as passport from 'passport'
import { createConnection, useContainer } from 'typeorm'
import { createUser } from './controllers/user-controller'
import { Container } from 'typedi'

const app = express()

const port = 3000

useContainer(Container)

app.use(bodyParser.json())

createConnection().then(connection => {
  app.post('/register', createUser)

  app.listen(port, () => console.log('Server started at port 3000'))
})