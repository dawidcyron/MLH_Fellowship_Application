import DuplicateEmailError from './duplicate-email-error'
import AuthenticationError from './authentication-error'
import ValidationError from './validation-error'

/**
 * General error handler
 * @param err
 * @param req
 * @param res
 * @param next
 */
export function handleError (err, req, res, next) {
  if (err.code === '23505') {
    res.status(400).json(new DuplicateEmailError())
    next()
  }
  if (err.name === 'AuthenticationError' || err instanceof AuthenticationError) {
    res.status(401).json(new AuthenticationError())
    next()
  }
  if (err instanceof Array) {
    res.status(401).json(new ValidationError(err))
    next()
  }
  res.status(err.code).json(err)
}