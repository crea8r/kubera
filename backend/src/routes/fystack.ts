import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { ok, fail } from '../lib/http.js';
import { FystackClient } from '../integrations/fystack/client.js';

async function requireMembership(userId: string, workspaceId: string) {
  return prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } }
  });
}

const fystackRoutes: FastifyPluginAsync = async (app) => {
  app.get('/assets', { preHandler: app.auth }, async () => {
    const fystack = new FystackClient();
    const data = await fystack.listAssets();
    return ok(data);
  });

  app.get('/networks', { preHandler: app.auth }, async () => {
    const fystack = new FystackClient();
    const data = await fystack.listNetworks();
    return ok(data);
  });

  app.get('/workspace-stats', { preHandler: app.auth }, async () => {
    const fystack = new FystackClient();
    const data = await fystack.workspaceStats();
    return ok(data);
  });

  app.post('/workspaces/:workspaceId/wallets', { preHandler: app.auth }, async (req: any, reply) => {
    const { workspaceId } = req.params as { workspaceId: string };
    const me = await requireMembership(req.user.sub, workspaceId);
    if (!me || (me.role !== 'owner' && me.role !== 'admin')) return reply.status(403).send(fail('FORBIDDEN', 'Insufficient role'));

    const body = z
      .object({
        name: z.string().min(1),
        walletType: z.enum(['standard', 'mpc']).default('standard'),
        walletPurpose: z.enum(['general', 'user']).default('general')
      })
      .parse(req.body);

    const fystack = new FystackClient();
    const res = await fystack.createWallet({
      name: body.name,
      wallet_type: body.walletType,
      wallet_purpose: body.walletPurpose
    });

    const fystackWalletId = res?.data?.wallet_id ?? res?.data?.id ?? res?.wallet_id ?? null;

    const wallet = await prisma.wallet.create({
      data: {
        workspaceId,
        name: body.name,
        fystackWalletId: fystackWalletId ? String(fystackWalletId) : null
      }
    });

    return reply.status(201).send(ok({ wallet, fystack: res }));
  });

  app.get('/withdrawals/:withdrawalId', { preHandler: app.auth }, async (req: any) => {
    const { withdrawalId } = req.params as { withdrawalId: string };
    const fystack = new FystackClient();
    const data = await fystack.getWithdrawal(withdrawalId);
    return ok(data);
  });

  // Webhook receiver: stores payload for reconciliation.
  app.post('/webhook', async (req, reply) => {
    const body: any = req.body;
    const event = String(body?.event ?? 'unknown');
    const resourceId = body?.resource_id ? String(body.resource_id) : (body?.payload?.id ? String(body.payload.id) : null);
    const webhookId = body?.webhook_id ? String(body.webhook_id) : null;

    await prisma.fystackWebhookEvent.create({
      data: {
        event,
        resourceId,
        webhookId,
        payload: body ?? {}
      }
    });

    // TODO: verify signature if Fystack provides one; docs page we pulled doesn't include signature headers.
    return reply.status(200).send({ ok: true });
  });
};

export default fystackRoutes;
