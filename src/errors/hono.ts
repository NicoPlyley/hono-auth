import { Error } from 'hono-error-handler';

const handleHonoErrors = (error: Error) => {
  // Request Error
  if (error.name === 'SyntaxError') {
    error.statusCode = 400;
    error.message = 'Invalid JSON';
    return error;
  }

  // General Code Errors
  if (error.name === 'TypeError') {
    error.message = 'Internal Server Error';
    error.statusCode = 500;
  }

  return error;
};

export default handleHonoErrors;
