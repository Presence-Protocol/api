import express from 'express';
import { sequelize } from './models';
import routes from './routes';
import {  eventsFetcher } from './eventsFetcher';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', routes);


    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  
