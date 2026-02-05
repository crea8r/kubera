-- CreateEnum
CREATE TYPE "GlobalRole" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('owner', 'admin', 'proposer', 'approver', 'viewer');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('draft', 'submitted', 'approved', 'rejected', 'spent', 'cancelled');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('milestone', 'proposal', 'kpi_update', 'blocker', 'note');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "GlobalRole" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceMember" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "WorkspaceRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanningCycle" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanningCycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetLine" (
    "id" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "allocatedUsd" DECIMAL(18,6) NOT NULL,
    "parentId" TEXT,
    "pic" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BudgetLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operation" (
    "id" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hypothesis" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'on_track',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KPI" (
    "id" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "current" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KPI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetLineOperation" (
    "budgetLineId" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,

    CONSTRAINT "BudgetLineOperation_pkey" PRIMARY KEY ("budgetLineId","operationId")
);

-- CreateTable
CREATE TABLE "SpendingProposal" (
    "id" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "budgetLineId" TEXT NOT NULL,
    "submitterId" TEXT NOT NULL,
    "amountUsd" DECIMAL(18,6) NOT NULL,
    "description" TEXT NOT NULL,
    "justification" TEXT,
    "vendorName" TEXT,
    "expectedDate" TIMESTAMP(3),
    "status" "ProposalStatus" NOT NULL DEFAULT 'draft',
    "rejectionReason" TEXT,
    "fystackWithdrawalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpendingProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalApproval" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "approverId" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProposalApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetLinePermission" (
    "id" TEXT NOT NULL,
    "workspaceMemberId" TEXT NOT NULL,
    "budgetLineId" TEXT NOT NULL,
    "canView" BOOLEAN NOT NULL DEFAULT false,
    "canPropose" BOOLEAN NOT NULL DEFAULT false,
    "canApprove" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BudgetLinePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fystackWalletId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FystackWebhookEvent" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "resourceId" TEXT,
    "webhookId" TEXT,
    "payload" JSONB NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FystackWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "WorkspaceMember_userId_idx" ON "WorkspaceMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceMember_workspaceId_userId_key" ON "WorkspaceMember"("workspaceId", "userId");

-- CreateIndex
CREATE INDEX "PlanningCycle_workspaceId_idx" ON "PlanningCycle"("workspaceId");

-- CreateIndex
CREATE INDEX "BudgetLine_cycleId_idx" ON "BudgetLine"("cycleId");

-- CreateIndex
CREATE UNIQUE INDEX "BudgetLine_cycleId_code_key" ON "BudgetLine"("cycleId", "code");

-- CreateIndex
CREATE INDEX "Operation_cycleId_idx" ON "Operation"("cycleId");

-- CreateIndex
CREATE UNIQUE INDEX "Operation_cycleId_code_key" ON "Operation"("cycleId", "code");

-- CreateIndex
CREATE INDEX "KPI_operationId_idx" ON "KPI"("operationId");

-- CreateIndex
CREATE INDEX "SpendingProposal_cycleId_idx" ON "SpendingProposal"("cycleId");

-- CreateIndex
CREATE INDEX "SpendingProposal_workspaceId_idx" ON "SpendingProposal"("workspaceId");

-- CreateIndex
CREATE INDEX "SpendingProposal_submitterId_idx" ON "SpendingProposal"("submitterId");

-- CreateIndex
CREATE INDEX "SpendingProposal_status_idx" ON "SpendingProposal"("status");

-- CreateIndex
CREATE INDEX "ProposalApproval_proposalId_idx" ON "ProposalApproval"("proposalId");

-- CreateIndex
CREATE INDEX "ProposalApproval_approverId_idx" ON "ProposalApproval"("approverId");

-- CreateIndex
CREATE UNIQUE INDEX "BudgetLinePermission_workspaceMemberId_budgetLineId_key" ON "BudgetLinePermission"("workspaceMemberId", "budgetLineId");

-- CreateIndex
CREATE INDEX "Activity_cycleId_createdAt_idx" ON "Activity"("cycleId", "createdAt");

-- CreateIndex
CREATE INDEX "Wallet_workspaceId_idx" ON "Wallet"("workspaceId");

-- CreateIndex
CREATE INDEX "FystackWebhookEvent_event_idx" ON "FystackWebhookEvent"("event");

-- CreateIndex
CREATE INDEX "FystackWebhookEvent_resourceId_idx" ON "FystackWebhookEvent"("resourceId");

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanningCycle" ADD CONSTRAINT "PlanningCycle_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetLine" ADD CONSTRAINT "BudgetLine_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "PlanningCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetLine" ADD CONSTRAINT "BudgetLine_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BudgetLine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "PlanningCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KPI" ADD CONSTRAINT "KPI_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "Operation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetLineOperation" ADD CONSTRAINT "BudgetLineOperation_budgetLineId_fkey" FOREIGN KEY ("budgetLineId") REFERENCES "BudgetLine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetLineOperation" ADD CONSTRAINT "BudgetLineOperation_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "Operation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpendingProposal" ADD CONSTRAINT "SpendingProposal_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "PlanningCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpendingProposal" ADD CONSTRAINT "SpendingProposal_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpendingProposal" ADD CONSTRAINT "SpendingProposal_budgetLineId_fkey" FOREIGN KEY ("budgetLineId") REFERENCES "BudgetLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpendingProposal" ADD CONSTRAINT "SpendingProposal_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalApproval" ADD CONSTRAINT "ProposalApproval_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "SpendingProposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalApproval" ADD CONSTRAINT "ProposalApproval_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetLinePermission" ADD CONSTRAINT "BudgetLinePermission_workspaceMemberId_fkey" FOREIGN KEY ("workspaceMemberId") REFERENCES "WorkspaceMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetLinePermission" ADD CONSTRAINT "BudgetLinePermission_budgetLineId_fkey" FOREIGN KEY ("budgetLineId") REFERENCES "BudgetLine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "PlanningCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
