import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import { initializeDatabase } from './config/database.js';
import swaggerSpec from './config/swagger.js';
import schoolRoutes from './routes/schoolRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger (development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}]  ${req.method}  ${req.originalUrl}`);
    next();
  });
}

// ── Swagger UI 
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'School Management API Docs',
    swaggerOptions: { persistAuthorization: true },
  })
);

// Serve raw OpenAPI spec as JSON
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ── Routes 
app.use('/', schoolRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running.', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.', errors: [err.message] });
});

// ── Bootstrap 
const start = async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`\n🚀  Server running on http://localhost:${PORT}`);
      console.log(`📚  Swagger docs  →  http://localhost:${PORT}/api-docs\n`);
    });
  } catch (error) {
    console.error('❌  Failed to start server:', error.message);
    process.exit(1);
  }
};

start();

export default app;
