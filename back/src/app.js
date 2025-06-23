import express, { json } from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

import swaggerUi from 'swagger-ui-express';
const swaggerFile = JSON.parse(readFileSync('./src/swagger.json', 'utf8'));
const app = express();

// Middleware
app.use(cors());
app.use(json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Routes
app.use(maintenanceRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

export default app;
