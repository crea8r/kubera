import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { ok, fail } from '../lib/http.js';

async function requireMembership(userId: string, workspaceId: string) {
  return prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } }
  });
}

const workspaceRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', { preHandler: app.auth }, async (req: any) => {
    const workspaces = await prisma.workspace.findMany({
      where: { members: { some: { userId: req.user.sub } } },
      orderBy: { createdAt: 'desc' }
    });
    return ok(workspaces);
  });

  app.post('/', { preHandler: app.auth }, async (req: any, reply) => {
    const body = z
      .object({
        name: z.string().min(1),
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
        currency: z.string().min(3).max(8).default('USD')
      })
      .parse(req.body);

    const workspace = await prisma.workspace.create({
      data: {
        name: body.name,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        currency: body.currency,
        members: {
          create: {
            userId: req.user.sub,
            role: 'owner'
          }
        },
        cycles: {
          create: {
            name: 'Initial',
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            isActive: true
          }
        }
      },
      include: { cycles: true }
    });

    return reply.status(201).send(ok(workspace));
  });

  app.get('/:workspaceId', { preHandler: app.auth }, async (req: any, reply) => {
    const { workspaceId } = req.params as { workspaceId: string };
    const m = await requireMembership(req.user.sub, workspaceId);
    if (!m) return reply.status(403).send(fail('FORBIDDEN', 'Not a workspace member'));

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { cycles: { orderBy: { createdAt: 'desc' } }, wallets: true }
    });
    if (!workspace) return reply.status(404).send(fail('NOT_FOUND', 'Workspace not found'));
    return ok(workspace);
  });

  app.post('/:workspaceId/members', { preHandler: app.auth }, async (req: any, reply) => {
    const { workspaceId } = req.params as { workspaceId: string };
    const me = await requireMembership(req.user.sub, workspaceId);
    if (!me || (me.role !== 'owner' && me.role !== 'admin')) {
      return reply.status(403).send(fail('FORBIDDEN', 'Insufficient role'));
    }

    const body = z
      .object({ email: z.string().email(), role: z.enum(['admin', 'proposer', 'approver', 'viewer']) })
      .parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) return reply.status(404).send(fail('NOT_FOUND', 'User not found'));

    const member = await prisma.workspaceMember.upsert({
      where: { workspaceId_userId: { workspaceId, userId: user.id } },
      update: { role: body.role },
      create: { workspaceId, userId: user.id, role: body.role }
    });

    return ok(member);
  });
};

export default workspaceRoutes;
