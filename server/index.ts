import express, { Request, Response, NextFunction } from 'express';
import { sequelize } from './models';
import routes from './routes';
import {  eventsFetcher } from './eventsFetcher';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  next();
});

app.use(express.json());
app.use('/api', routes);

// Initialize database and start event fetcher
async function startServer() {
  try {
    // Sync database (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');

    // Start the event fetcher
    await eventsFetcher();
    console.log('Event fetcher started');

    // Start the HTTP server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
