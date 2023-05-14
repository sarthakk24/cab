import { NextFunction, Request, Response, Router } from 'express';
import Logger from '../../loaders/logger';
import { findRide, insertion } from './controller';
const ridesRouter = Router();

ridesRouter.get('/', handleCheck);
ridesRouter.post('/', rides);
// ridesRouter.get('/insert', insert);
async function handleCheck(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json('rides routes is working');
  } catch (err: any) {
    Logger.error(err.error);
    res
      .status(err.code || 503)
      .json({ success: false, message: err.error || 'ISR' });
  }
}

// async function insert(req: Request, res: Response, next: NextFunction) {
//   try {
//     const data = await insertion();
//     res.status(200).json('inserted');
//   } catch (err: any) {
//     Logger.error(err.error);
//     res
//       .status(err.code || 503)
//       .json({ success: false, message: err.error || 'ISR' });
//   }
// }

async function rides(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await findRide(req.body.id);
    res.status(200).json(data);
  } catch (err: any) {
    Logger.error(err.error);
    res
      .status(err.code || 503)
      .json({ success: false, message: err.error || 'ISR' });
  }
}

export default ridesRouter;
