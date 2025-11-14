import { Router } from 'express';
import progressionRouter from './routes';

const api = Router();

api.use('/progression', progressionRouter);

export default api;
export * from './models';
