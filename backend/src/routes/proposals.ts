import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import crypto from 'node:crypto';
import { prisma } from '../lib/prisma.js';
import { ok, fail } from '../lib/http.js';
import { FystackClient } from '../integrations/fystack/client.js';

async function requireMembership(userId: string, workspaceId: string) {
  return prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } }
  });
}

const proposalRoutes: FastifyPluginAsync = async (app) => {
  app.get('/workspaces/:workspaceId/proposals', { preHandler: app.auth }, async (req: any, reply) => {
    const { workspaceId } = req.params as { workspaceId: string };
    const m = await requireMembership(req.user.sub, workspaceId);
    if (!m) return reply.status(403).send(fail('FORBIDDEN', 'Not a workspace member'));

    const q = z
      .object({
        cycleId: z.string().uuid().optional(),
        status: z.enum(['draft', 'submitted', 'approved', 'rejected', 'spent', 'cancelled']).optional()
      })
      .parse(req.query ?? {});

    const proposals = await prisma.spendingProposal.findMany({
      where: {
        workspaceId,
        ...(q.cycleId ? { cycleId: q.cycleId } : {}),
        ...(q.status ? { status: q.status } : {})
      },
      include: { budgetLine: true, submitter: { select: { id: true, email: true, name: true } }, approvals: true },
      orderBy: { createdAt: 'desc' }
    });

    return ok(proposals);
  });

  app.post('/proposals', { preHandler: app.auth }, async (req: any, reply) => {
    const body = z
      .object({
        workspaceId: z.string().uuid(),
        cycleId: z.string().uuid(),
        budgetLineId: z.string().uuid(),
        amountUsd: z.coerce.number().positive(),
        description: z.string().min(1),
        justification: z.string().optional(),
        vendorName: z.string().optional(),
        expectedDate: z.string().datetime().optional()
      })
      .parse(req.body);

    const m = await requireMembership(req.user.sub, body.workspaceId);
    if (!m) return reply.status(403).send(fail('FORBIDDEN', 'Not a workspace member'));
    if (!['owner', 'admin', 'proposer'].includes(m.role)) return reply.status(403).send(fail('FORBIDDEN', 'Insufficient role'));

    // (MVP) no fine-grained budget-line permission enforcement yet.

    const proposal = await prisma.spendingProposal.create({
      data: {
        workspaceId: body.workspaceId,
        cycleId: body.cycleId,
        budgetLineId: body.budgetLineId,
        submitterId: req.user.sub,
        amountUsd: body.amountUsd,
        description: body.description,
        justification: body.justification,
        vendorName: body.vendorName,
        expectedDate: body.expectedDate ? new Date(body.expectedDate) : undefined
      }
    });

    return reply.status(201).send(ok(proposal));
  });

  app.post('/proposals/:proposalId/submit', { preHandler: app.auth }, async (req: any, reply) => {
    const { proposalId } = req.params as { proposalId: string };
    const proposal = await prisma.spendingProposal.findUnique({ where: { id: proposalId } });
    if (!proposal) return reply.status(404).send(fail('NOT_FOUND', 'Proposal not found'));

    if (proposal.submitterId !== req.user.sub) return reply.status(403).send(fail('FORBIDDEN', 'Only submitter can submit'));
    if (proposal.status !== 'draft') return reply.status(400).send(fail('INVALID_STATE', 'Only draft proposals can be submitted'));

    const updated = await prisma.spendingProposal.update({ where: { id: proposalId }, data: { status: 'submitted' } });
    return ok(updated);
  });

  app.post('/proposals/:proposalId/approve', { preHandler: app.auth }, async (req: any, reply) => {
    const { proposalId } = req.params as { proposalId: string };
    const body = z
      .object({
        comment: z.string().optional(),
        // execution params
        execute: z.boolean().default(false),
        walletId: z.string().uuid().optional(),
        fystackAssetId: z.string().optional(),
        recipientAddress: z.string().optional()
      })
      .parse(req.body ?? {});

    const proposal = await prisma.spendingProposal.findUnique({ where: { id: proposalId } });
    if (!proposal) return reply.status(404).send(fail('NOT_FOUND', 'Proposal not found'));

    const m = await requireMembership(req.user.sub, proposal.workspaceId);
    if (!m) return reply.status(403).send(fail('FORBIDDEN', 'Not a workspace member'));
    if (!['owner', 'admin', 'approver'].includes(m.role)) return reply.status(403).send(fail('FORBIDDEN', 'Insufficient role'));

    if (proposal.status !== 'submitted') return reply.status(400).send(fail('INVALID_STATE', 'Only submitted proposals can be approved'));

    const updated = await prisma.$transaction(async (tx) => {
      await tx.proposalApproval.create({
        data: { proposalId, approverId: req.user.sub, decision: 'approved', comment: body.comment }
      });

      return tx.spendingProposal.update({ where: { id: proposalId }, data: { status: 'approved' } });
    });

    // Optional: execute immediately via fystack withdrawal.
    if (body.execute) {
      if (!body.walletId || !body.fystackAssetId || !body.recipientAddress) {
        return reply.status(400).send(fail('MISSING_FIELDS', 'walletId, fystackAssetId, recipientAddress required when execute=true'));
      }

      const wallet = await prisma.wallet.findUnique({ where: { id: body.walletId } });
      if (!wallet?.fystackWalletId) return reply.status(400).send(fail('NO_FYSTACK_WALLET', 'Wallet not linked to fystack'));

      const fystack = new FystackClient();
      const idempotencyKey = crypto.randomUUID();

      // We assume amountUsd maps 1:1 with stablecoin USD (USDC) for MVP.
      const withdrawal = await fystack.requestWithdrawal(
        wallet.fystackWalletId,
        {
          asset_id: body.fystackAssetId,
          amount: String(proposal.amountUsd),
          recipient_address: body.recipientAddress
        },
        idempotencyKey
      );

      const wId = withdrawal?.data?.id ?? withdrawal?.id ?? null;
      if (wId) {
        await prisma.spendingProposal.update({ where: { id: proposalId }, data: { fystackWithdrawalId: String(wId) } });
      }

      return ok({ proposal: updated, fystackWithdrawal: withdrawal });
    }

    return ok(updated);
  });

  app.post('/proposals/:proposalId/reject', { preHandler: app.auth }, async (req: any, reply) => {
    const { proposalId } = req.params as { proposalId: string };
    const body = z.object({ reason: z.string().min(1), comment: z.string().optional() }).parse(req.body);

    const proposal = await prisma.spendingProposal.findUnique({ where: { id: proposalId } });
    if (!proposal) return reply.status(404).send(fail('NOT_FOUND', 'Proposal not found'));

    const m = await requireMembership(req.user.sub, proposal.workspaceId);
    if (!m) return reply.status(403).send(fail('FORBIDDEN', 'Not a workspace member'));
    if (!['owner', 'admin', 'approver'].includes(m.role)) return reply.status(403).send(fail('FORBIDDEN', 'Insufficient role'));

    if (proposal.status !== 'submitted') return reply.status(400).send(fail('INVALID_STATE', 'Only submitted proposals can be rejected'));

    const updated = await prisma.$transaction(async (tx) => {
      await tx.proposalApproval.create({
        data: { proposalId, approverId: req.user.sub, decision: 'rejected', comment: body.comment }
      });

      return tx.spendingProposal.update({
        where: { id: proposalId },
        data: { status: 'rejected', rejectionReason: body.reason }
      });
    });

    return ok(updated);
  });
};

export default proposalRoutes;
