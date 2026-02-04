import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { ok, fail } from '../lib/http.js';

async function requireMembership(userId: string, workspaceId: string) {
  return prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } }
  });
}

const cycleRoutes: FastifyPluginAsync = async (app) => {
  app.post('/workspaces/:workspaceId/cycles', { preHandler: app.auth }, async (req: any, reply) => {
    const { workspaceId } = req.params as { workspaceId: string };
    const me = await requireMembership(req.user.sub, workspaceId);
    if (!me || (me.role !== 'owner' && me.role !== 'admin')) {
      return reply.status(403).send(fail('FORBIDDEN', 'Insufficient role'));
    }

    const body = z
      .object({ name: z.string().min(1), startDate: z.string().datetime(), endDate: z.string().datetime(), isActive: z.boolean().default(false) })
      .parse(req.body);

    const cycle = await prisma.planningCycle.create({
      data: {
        workspaceId,
        name: body.name,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        isActive: body.isActive
      }
    });

    if (cycle.isActive) {
      await prisma.planningCycle.updateMany({ where: { workspaceId, id: { not: cycle.id } }, data: { isActive: false } });
    }

    return reply.status(201).send(ok(cycle));
  });

  app.get('/cycles/:cycleId', { preHandler: app.auth }, async (req: any, reply) => {
    const { cycleId } = req.params as { cycleId: string };
    const cycle = await prisma.planningCycle.findUnique({
      where: { id: cycleId },
      include: {
        workspace: true,
        budgetLines: { orderBy: [{ code: 'asc' }] },
        operations: { include: { kpis: true }, orderBy: [{ code: 'asc' }] }
      }
    });
    if (!cycle) return reply.status(404).send(fail('NOT_FOUND', 'Cycle not found'));

    const m = await requireMembership(req.user.sub, cycle.workspaceId);
    if (!m) return reply.status(403).send(fail('FORBIDDEN', 'Not a workspace member'));

    const links = await prisma.budgetLineOperation.findMany({
      where: { budgetLine: { cycleId } },
      select: { budgetLineId: true, operationId: true }
    });

    return ok({ cycle, links });
  });

  app.post('/cycles/:cycleId/budget-lines', { preHandler: app.auth }, async (req: any, reply) => {
    const { cycleId } = req.params as { cycleId: string };
    const cycle = await prisma.planningCycle.findUnique({ where: { id: cycleId } });
    if (!cycle) return reply.status(404).send(fail('NOT_FOUND', 'Cycle not found'));

    const me = await requireMembership(req.user.sub, cycle.workspaceId);
    if (!me || (me.role !== 'owner' && me.role !== 'admin')) return reply.status(403).send(fail('FORBIDDEN', 'Insufficient role'));

    const body = z
      .object({
        code: z.string().min(1),
        name: z.string().min(1),
        allocatedUsd: z.coerce.number().nonnegative(),
        parentId: z.string().uuid().optional(),
        pic: z.string().optional(),
        operationIds: z.array(z.string().uuid()).default([])
      })
      .parse(req.body);

    const line = await prisma.budgetLine.create({
      data: {
        cycleId,
        code: body.code,
        name: body.name,
        allocatedUsd: body.allocatedUsd,
        parentId: body.parentId,
        pic: body.pic,
        links: {
          create: body.operationIds.map((operationId) => ({ operationId }))
        }
      },
      include: { links: true }
    });

    return reply.status(201).send(ok(line));
  });

  app.post('/cycles/:cycleId/operations', { preHandler: app.auth }, async (req: any, reply) => {
    const { cycleId } = req.params as { cycleId: string };
    const cycle = await prisma.planningCycle.findUnique({ where: { id: cycleId } });
    if (!cycle) return reply.status(404).send(fail('NOT_FOUND', 'Cycle not found'));

    const me = await requireMembership(req.user.sub, cycle.workspaceId);
    if (!me || (me.role !== 'owner' && me.role !== 'admin')) return reply.status(403).send(fail('FORBIDDEN', 'Insufficient role'));

    const body = z
      .object({
        code: z.string().min(1),
        name: z.string().min(1),
        hypothesis: z.string().min(1),
        status: z.string().default('on_track'),
        kpis: z.array(z.object({ name: z.string().min(1), target: z.string().min(1), current: z.string().default('0') })).default([]),
        budgetLineIds: z.array(z.string().uuid()).default([])
      })
      .parse(req.body);

    const op = await prisma.operation.create({
      data: {
        cycleId,
        code: body.code,
        name: body.name,
        hypothesis: body.hypothesis,
        status: body.status,
        kpis: { create: body.kpis },
        links: { create: body.budgetLineIds.map((budgetLineId) => ({ budgetLineId })) }
      },
      include: { kpis: true, links: true }
    });

    return reply.status(201).send(ok(op));
  });
};

export default cycleRoutes;
