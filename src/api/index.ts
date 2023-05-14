import { Router } from 'express';
import ridesRouter from './rides';

export default (): Router => {
  const app = Router();
  app.use('/rides', ridesRouter);
  return app;
};
