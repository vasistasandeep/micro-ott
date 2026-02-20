import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';
import { createLogger } from '@ott/shared';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const logger = createLogger('api-gateway');

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

// Service routes
const services = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  catalog: process.env.CATALOG_SERVICE_URL || 'http://localhost:3002',
  streaming: process.env.STREAMING_SERVICE_URL || 'http://localhost:3003',
  activity: process.env.USER_ACTIVITY_SERVICE_URL || 'http://localhost:3004',
  recommendations: process.env.RECOMMENDATION_SERVICE_URL || 'http://localhost:3005',
};

// Proxy middleware for each service
app.use(
  '/api/auth',
  createProxyMiddleware({
    target: services.auth,
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '/api/auth' },
    onError: (err, req, res) => {
      logger.error('Auth service proxy error', err);
      res.status(503).json({ error: 'Auth service unavailable' });
    },
  }),
);

app.use(
  '/api/catalog',
  createProxyMiddleware({
    target: services.catalog,
    changeOrigin: true,
    pathRewrite: { '^/api/catalog': '/api/catalog' },
    onError: (err, req, res) => {
      logger.error('Catalog service proxy error', err);
      res.status(503).json({ error: 'Catalog service unavailable' });
    },
  }),
);

app.use(
  '/api/stream',
  createProxyMiddleware({
    target: services.streaming,
    changeOrigin: true,
    pathRewrite: { '^/api/stream': '/api/stream' },
    onError: (err, req, res) => {
      logger.error('Streaming service proxy error', err);
      res.status(503).json({ error: 'Streaming service unavailable' });
    },
  }),
);

const port = process.env.API_GATEWAY_PORT || 3000;
app.listen(port, () => {
  logger.info(`API Gateway running on port ${port}`);
  logger.info('Service routes configured:', services);
});
