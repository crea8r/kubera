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
  // Kubera constraint: one budget = one annual cycle. No additional cycles.
  app.post('/workspaces/:workspaceId/cycles', { preHandler: app.auth }, async (req: any, reply) => {
    return reply.status(400).send(
      fail(
        'ANNUAL_ONLY',
        'Kubera currently supports annual budgets only (1 active cycle per workspace). Create a new workspace for a new year.'
      )
    );
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
        notes: z.string().optional(),
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
        notes: body.notes,
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
