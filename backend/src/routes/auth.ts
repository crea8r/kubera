import type { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { ok, fail } from '../lib/http.js';

const authRoutes: FastifyPluginAsync = async (app) => {
  app.post('/register', async (req, reply) => {
    const body = z
      .object({ email: z.string().email(), name: z.string().min(1), password: z.string().min(8) })
      .parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) return reply.status(409).send(fail('EMAIL_TAKEN', 'Email already registered'));

    const passwordHash = await bcrypt.hash(body.password, 12);
    const user = await prisma.user.create({
      data: { email: body.email, name: body.name, passwordHash }
    });

    const token = app.jwt.sign({ sub: user.id });
    reply.setCookie('kubera_token', token, { httpOnly: true, sameSite: 'lax', path: '/' });

    return ok({ id: user.id, email: user.email, name: user.name });
  });

  app.post('/login', async (req, reply) => {
    const body = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) return reply.status(401).send(fail('INVALID_CREDENTIALS', 'Invalid credentials'));

    const okPw = await bcrypt.compare(body.password, user.passwordHash);
    if (!okPw) return reply.status(401).send(fail('INVALID_CREDENTIALS', 'Invalid credentials'));

    const token = app.jwt.sign({ sub: user.id });
    reply.setCookie('kubera_token', token, { httpOnly: true, sameSite: 'lax', path: '/' });
    return ok({ id: user.id, email: user.email, name: user.name });
  });

  app.post('/logout', async (req, reply) => {
    reply.clearCookie('kubera_token', { path: '/' });
    return ok({});
  });

  app.get('/me', { preHandler: app.auth }, async (req: any) => {
    const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
    if (!user) return fail('NOT_FOUND', 'User not found');
    return ok({ id: user.id, email: user.email, name: user.name, role: user.role });
  });
};

export default authRoutes;
