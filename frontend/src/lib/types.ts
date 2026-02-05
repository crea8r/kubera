export type User = {
  id: string;
  email: string;
  name: string;
  role?: string;
};

export type Workspace = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  currency: string;
};

export type PlanningCycle = {
  id: string;
  workspaceId: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

export type BudgetLine = {
  id: string;
  cycleId: string;
  code: string;
  name: string;
  allocatedUsd: string; // decimal serialized
  parentId?: string | null;
  pic?: string | null;
};

export type Operation = {
  id: string;
  cycleId: string;
  code: string;
  name: string;
  hypothesis: string;
  status: string;
  kpis: { id: string; name: string; target: string; current: string }[];
};

export type SpendingProposal = {
  id: string;
  workspaceId: string;
  cycleId: string;
  budgetLineId: string;
  submitterId: string;
  amountUsd: string;
  description: string;
  justification?: string | null;
  vendorName?: string | null;
  expectedDate?: string | null;
  status: string;
  rejectionReason?: string | null;
  fystackWithdrawalId?: string | null;
  createdAt: string;
};
