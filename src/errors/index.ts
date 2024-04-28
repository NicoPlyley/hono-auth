import handleHonoErrors from './hono';
import handleDrizzleErrors from './drizzle';

const errorHandlers = [handleHonoErrors, handleDrizzleErrors];

export default errorHandlers;
