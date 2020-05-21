export function handleError(err, req, res, next) {
  const output = {
    error: {
      name: err.name,
      message: err.message,
    }
  }
  if (err.name === 'AuthenticationError') {
    output.error.message = 'You are not authorized to access this resource'
  }
  res.status(err.status || 500).json(output)
}