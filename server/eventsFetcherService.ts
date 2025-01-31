import { eventsFetcher } from './eventsFetcher';
import { sequelize } from './models';

async function startEventFetcher() {
  try {
    sequelize.sync().then(() => {
        console.log('Database connected');
    }).catch((error) => { console.error('Database connection error:', error); process.exit(1); });
    
    await eventsFetcher();

  } catch (error) {
    console.error('Event fetcher error:', error);
    process.exit(1);
  }
}

startEventFetcher();