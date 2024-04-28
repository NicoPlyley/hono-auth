import { Error } from 'hono-error-handler';

const handleDrizzleErrors = (error: Error) => {
  if (error.message.startsWith('D1_ERROR: UNIQUE constraint failed')) {
    const row = error.message.split('.')[1];
    error.message = `That ${row} already exists`;
    error.statusCode = 409;
    return error;
  }

  return error;
};

export default handleDrizzleErrors;
