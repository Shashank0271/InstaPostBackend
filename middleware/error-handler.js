const { StatusCodes } = require('http-status-codes');
const { CustomAPIError } = require('../errors/custom-error')
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log("entered error handler");
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  if (err.name == "ValidationError") {
    return res.status(StatusCodes.PRECONDITION_FAILED).json({ msg: err["_message"] });
  }
  //in case of unhandled error we get this :
  console.log(err.message);
  return res.status(500).json({ msg: 'Something went wrong, please try again' })
}

module.exports = errorHandlerMiddleware

