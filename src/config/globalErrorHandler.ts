import { StatusCodes } from 'http-status-codes';
import ErrorCodes from '../const/ErrorCodes';
import ErrorBase from '../errors/ErrorBase';
import { ErrorRequestHandler } from 'express';
import { MAX_FILE_SIZE_MB } from '../const/FileConstants';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // Handling of multer file size limit error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(StatusCodes.REQUEST_TOO_LONG).send({
      errorCode: ErrorCodes.FILE_SIZE_LIMIT_EXCEEDED_CODE,
      message: `File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.`,
    });
  }

  // Handling of body-parser content malformed error
  if (err.type === 'entity.parse.failed') {
    return res.status(StatusCodes.BAD_REQUEST).send({
      errorCode: ErrorCodes.MALFORMED_JSON_ERROR_CODE,
      message: 'Malformed json'
    });
  }

  if (err instanceof ErrorBase) {
    const error = err;

    return res.status(error.getHttpStatusCode()).send({
      errorCode: error.getErrorCode(),
      message: error.getMessage()
    });
  } else {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      errorCode: ErrorCodes.RUNTIME_ERROR_CODE,
      message: 'Internal Server Error'
    });
  }
}

export default globalErrorHandler;
