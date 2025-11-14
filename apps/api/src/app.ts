import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import progressionApi from './progression';
import xpRoutes from './xp/routes';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/progression', progressionApi);
  app.use('/api/xp', xpRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
  });

  return app;
}

export default createApp;
