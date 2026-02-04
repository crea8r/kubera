import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import { env } from '../lib/env.js';

export default fp(async (app) => {
  await app.register(cookie);
  await app.register(jwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: 'kubera_token',
      signed: false
    }
  });

  app.decorate('auth', async (req: any, reply: any) => {
    try {
      await req.jwtVerify();
    } catch {
      return reply.status(401).send({ success: false, error: { code: 'UNAUTHENTICATED', message: 'Not logged in' } });
    }
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    auth: any;
  }
}
