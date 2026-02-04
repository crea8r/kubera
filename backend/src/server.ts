import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { env } from './lib/env.js';
import authPlugin from './plugins/auth.js';

import authRoutes from './routes/auth.js';
import workspaceRoutes from './routes/workspaces.js';
import cycleRoutes from './routes/cycles.js';
import proposalRoutes from './routes/proposals.js';
import fystackRoutes from './routes/fystack.js';

const app = Fastify({
  logger: { level: env.LOG_LEVEL }
});

await app.register(cors, {
  origin: true,
  credentials: true
});

await app.register(swagger, {
  openapi: {
    info: {
      title: 'Kubera API',
      version: '0.1.0'
    }
  }
});

await app.register(swaggerUi, {
  routePrefix: '/docs'
});

await app.register(authPlugin);

app.get('/health', async () => ({ ok: true }));

await app.register(authRoutes, { prefix: '/api/auth' });
await app.register(workspaceRoutes, { prefix: '/api/workspaces' });
await app.register(cycleRoutes, { prefix: '/api' });
await app.register(proposalRoutes, { prefix: '/api' });
await app.register(fystackRoutes, { prefix: '/api/fystack' });

app.setErrorHandler((err, req, reply) => {
  req.log.error({ err }, 'Unhandled error');
  const anyErr = err as any;
  const status = anyErr?.statusCode || 500;
  reply.status(status).send({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: status === 500 ? 'Internal server error' : String(anyErr?.message ?? 'Error')
    }
  });
});

app.listen({ port: env.PORT, host: '0.0.0.0' });
