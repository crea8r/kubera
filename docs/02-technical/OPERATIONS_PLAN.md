# Operations Plan & Budget Integration

## Overview

The **Operations Plan** tracks what you want to **achieve** (KPIs, outcomes, hypotheses), while the **Budget** tracks what you need to **spend** (resources, money). They're related but independent:

- ✅ Some operations require budget
- ✅ Some operations require no budget (organic activities)
- ✅ Some budget items have no direct KPIs (overhead, tools)

## Key Concepts

### Budget vs Operations Plan

```text
BUDGET (Input/Resources)              OPERATIONS PLAN (Output/Results)
├─ P. Personnel: $287,700       ←→    ├─ Build team capability
├─ O. Outreach: $65,000         ←→    ├─ Run 2 startup competitions
│  └─ $30,000 Competition       ←→    │  └─ KPI: 300+ participants, 20 projects
├─ E. Engage: $56,100           ←→    ├─ Mentorship program
│  └─ $26,100 Mentorship        ←→    │  └─ KPI: 100 mentor-mentee pairs
└─ F. Funnel: $42,000           ←→    └─ Job matching
                                      └─ KPI: 50 jobs placed

                              Some operations need no budget:
                              ├─ Community volunteer events (no cost)
                              ├─ Organic social media growth
                              └─ Partnership referrals (free)
```

## Relationship Models

### 1. One-to-One Relationship

**Budget item directly funds one operation**

```
Budget: O1. Startup Competition ($30,000)
    ↓
Operation: Summer Startup Competition 2025
    ├─ Hypothesis: "Startup competitions attract high-quality founders"
    ├─ Target KPIs:
    │   ├─ 300+ participants
    │   ├─ 20 projects submitted
    │   ├─ $15k GDP from prize
    └─ Actual Results: (tracked after execution)
```

### 2. One-to-Many Relationship

**One budget item funds multiple operations**

```
Budget: P1. Op Team Salary ($223,900)
    ↓
Operations:
    ├─ Run 3 community hubs
    ├─ Execute mentorship program
    ├─ Organize monthly events
    └─ Manage partnerships
```

### 3. Many-to-One Relationship

**Multiple budget items fund one operation**

```
Operation: Solana Hackathon Vietnam 2025
    ↑
Budget contributions:
    ├─ FS2. Global hack activation: $12,000
    ├─ P2. Op team travel: $5,000 (subset)
    └─ P5. Content production: $2,000 (subset)
```

### 4. No Budget Required

**Operations that require no budget**

```
Operation: Organic Community Growth
    ├─ Hypothesis: "Daily Discord engagement increases retention"
    ├─ Target KPIs:
    │   ├─ 100+ daily active members
    │   ├─ 50+ messages per day
    └─ Budget: $0 (volunteer effort)

Operation: Partnership Referrals
    ├─ Hypothesis: "Partner ecosystem drives quality deal flow"
    ├─ Target KPIs:
    │   ├─ 10 partner referrals/month
    │   ├─ 50% conversion to active projects
    └─ Budget: $0 (existing relationships)
```

## Data Model

### operations_plan table

```sql
CREATE TABLE operations_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  code VARCHAR(10), -- 'OP1', 'OP2', etc.
  name VARCHAR(255) NOT NULL,
  description TEXT,
  hypothesis TEXT, -- "We believe that X will result in Y"
  parent_operation_id UUID REFERENCES operations_plan(id), -- for hierarchy
  level INTEGER DEFAULT 1, -- 1 = category, 2 = subcategory, 3 = operation
  status VARCHAR(50) DEFAULT 'planned', -- 'planned', 'in_progress', 'completed', 'cancelled'
  start_date DATE,
  end_date DATE,
  owner_user_id UUID REFERENCES users(id), -- PIC for this operation
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### operation_kpis table

```sql
CREATE TABLE operation_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_id UUID REFERENCES operations_plan(id) ON DELETE CASCADE,
  kpi_name VARCHAR(255) NOT NULL, -- "Participants", "Projects", "Revenue"
  kpi_type VARCHAR(50), -- 'numeric', 'percentage', 'currency', 'boolean'
  target_value DECIMAL(15, 2), -- Target to achieve
  actual_value DECIMAL(15, 2), -- Actual achieved (updated as we track)
  unit VARCHAR(50), -- "participants", "USD", "%", "projects"
  measurement_frequency VARCHAR(50), -- 'one_time', 'daily', 'weekly', 'monthly'
  formula TEXT, -- "=300 participants * 5% conversion = 15 projects"
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### budget_operation_link table

```sql
-- Links budget items to operations
CREATE TABLE budget_operation_link (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_category_id UUID REFERENCES budget_categories(id) ON DELETE CASCADE,
  operation_id UUID REFERENCES operations_plan(id) ON DELETE CASCADE,
  allocated_amount DECIMAL(15, 2), -- How much of this budget goes to this operation
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(budget_category_id, operation_id)
);
```

### operation_milestones table

```sql
CREATE TABLE operation_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_id UUID REFERENCES operations_plan(id) ON DELETE CASCADE,
  milestone_name VARCHAR(255) NOT NULL,
  target_date DATE,
  completion_date DATE,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'missed'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Example from Your Sample Budget

Based on your `sample.csv`, here's how budget and operations align:

### Example 1: Startup Competition

**Budget:**

```
O1. Mission-focus Startup Competition: $30,000
- Detail: "300+ participant each, $15k per competition"
- Impact: "=15k GDP from prize, = 20 projects"
```

**Operations Plan:**

```yaml
Operation: Climate Tech Startup Competition 2025
  Code: OP-O1-Q2
  Hypothesis: "Climate-focused competitions attract quality founders and generate viable projects"
  Budget Link: O1 ($30,000)
  Timeline: Q2 2025

  KPIs:
    - Participants: Target 300+, Actual: TBD
    - Projects Submitted: Target 20, Actual: TBD
    - Prize GDP: Target $15,000, Actual: TBD
    - Quality Projects (passed screening): Target 10, Actual: TBD
    - Projects still active 6 months later: Target 5, Actual: TBD

  Milestones:
    - Launch announcement: Week 1
    - Applications open: Week 2
    - Applications close: Week 6
    - Judging: Week 7
    - Demo day: Week 8
```

### Example 2: Ambassador Program

**Budget:**

```
O3. Ambassador Program: $72,000 ($6,000/month) - Paid by Fndn
- Detail: "10 Ambassadors, 600u each per month"
- Impact: "100 events, 2,000 impressions, ~40 projects"
```

**Operations Plan:**

```yaml
Operation: Community Ambassador Program 2025
  Code: OP-O3-YEAR
  Hypothesis: "Bottom-up community leadership scales engagement and project creation"
  Budget Link: O3 ($72,000)
  Funding Source: Foundation Grant
  Timeline: Full year 2025

  KPIs:
    - Active Ambassadors: Target 10, Actual: TBD
    - Events per Ambassador: Target 10/year, Actual: TBD
    - Total Events: Target 100, Actual: TBD
    - Event Participants: Target 2,000, Actual: TBD
    - New Projects Created: Target 40, Actual: TBD
    - Ambassador Retention Rate: Target 80%, Actual: TBD

  Sub-Operations:
    OP-O3-1: Recruit 10 Ambassadors
      - Milestone: Applications (Month 1)
      - Milestone: Selection (Month 1)
      - KPI: 50+ applications, 10 selected

    OP-O3-2: Monthly Ambassador Events
      - Recurring monthly
      - KPI: 8-10 events/month

    OP-O3-3: Quarterly Ambassador Training
      - Q1, Q2, Q3, Q4
      - KPI: 90%+ attendance
```

### Example 3: No-Budget Operation

**Operations Plan:**

```yaml
Operation: Discord Community Engagement
  Code: OP-COMM-01
  Hypothesis: "Daily community engagement increases retention and organic project formation"
  Budget Link: None ($0 - volunteer effort)
  Timeline: Ongoing

  KPIs:
    - Daily Active Members: Target 100+, Actual: TBD
    - Messages per Day: Target 50+, Actual: TBD
    - Weekly Active Members: Target 300+, Actual: TBD
    - Member Retention (30-day): Target 70%, Actual: TBD
    - Organic Project Formations: Target 5/month, Actual: TBD

  Owner: Community Manager (existing staff, no additional budget)
```

## UI/UX Design

### Two-Panel View (Recommended)

```
┌─────────────────────────────────────────────────────────────────┐
│  Workspace: Superteam VN 2025                         [Budget ▼]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────┬────────────────────┐                    │
│  │   BUDGET           │  OPERATIONS PLAN   │                    │
│  │   (Resources)      │  (Results)         │                    │
│  ├────────────────────┼────────────────────┤                    │
│  │                    │                    │                    │
│  │ P. Personnel       │ OP1. Team Building │                    │
│  │ $287,700           │ KPI: 4 hires       │◄──────linked       │
│  │                    │                    │                    │
│  │ O. Outreach        │ OP2. Competitions  │                    │
│  │ $65,000            │ KPI: 300+ people   │◄──────linked       │
│  │ ├─ O1 Competition  │ ├─ Climate Comp    │                    │
│  │ │  $30,000         │ │  20 projects     │◄──────linked       │
│  │ └─ O2 Accelerator  │ └─ Accel Program   │                    │
│  │    $20,000         │    20 startups     │◄──────linked       │
│  │                    │                    │                    │
│  │                    │ OP3. Organic Growth│                    │
│  │                    │ KPI: 100 DAU       │◄────── $0 budget   │
│  │                    │ Budget: $0         │                    │
│  └────────────────────┴────────────────────┘                    │
│                                                                  │
│  [Link Budget to Operation] [Create Operation]                  │
└─────────────────────────────────────────────────────────────────┘
```

### Linked Card View

When you click on a budget item, show linked operations:

```
┌──────────────────────────────────────────┐
│ O1. Startup Competition - $30,000        │
├──────────────────────────────────────────┤
│ Linked Operations (2):                   │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ Climate Tech Competition           │  │
│ │ Budget: $15,000 (50%)             │  │
│ │ Status: In Progress               │  │
│ │ KPIs:                             │  │
│ │   Participants: 250/300 (83%)     │  │
│ │   Projects: 18/20 (90%)           │  │
│ └────────────────────────────────────┘  │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ Smart City Competition             │  │
│ │ Budget: $15,000 (50%)             │  │
│ │ Status: Planned                   │  │
│ │ Start: Q3 2025                    │  │
│ └────────────────────────────────────┘  │
│                                          │
│ [+ Link New Operation]                   │
└──────────────────────────────────────────┘
```

### Operations Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  Operations Dashboard                              Q2 2025  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Active Operations: 12         On Track: 8     At Risk: 4   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Operation: Climate Tech Competition                  │  │
│  │ Status: ⚠️ At Risk                                   │  │
│  │ Budget: $15,000 (50% of O1)                         │  │
│  │                                                      │  │
│  │ Progress:                                            │  │
│  │   Timeline: Week 6/8                      ████░░ 75%│  │
│  │   Budget Spent: $12,000/$15,000          ████░░ 80%│  │
│  │                                                      │  │
│  │ KPIs:                                                │  │
│  │   ✅ Participants: 250/300 (83%)         ████░░    │  │
│  │   ⚠️ Projects: 18/20 (90%)               █████░    │  │
│  │   ❌ Quality Projects: 4/10 (40%)        ██░░░░    │  │
│  │                                                      │  │
│  │ Next Milestone: Judging (2 days)                    │  │
│  │ Owner: Fay                                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  [View All Operations] [Create New Operation]               │
└─────────────────────────────────────────────────────────────┘
```

## Key Features

### 1. Hypothesis Tracking

**Problem:** Not all initiatives succeed. Track what works.

**Solution:**

```yaml
Operation: Mentorship Program Experiment
  Hypothesis: "Structured mentorship increases builder retention by 30%"

  Test:
    - Control Group: 50 builders (no mentorship)
    - Test Group: 50 builders (with mentorship)

  KPIs:
    - 30-day retention (Control): Actual TBD
    - 30-day retention (Test): Actual TBD
    - Retention Lift: Target +30%

  Decision Criteria:
    - If lift ≥ 20%: Scale program
    - If lift < 20%: Iterate or cancel
```

### 2. Budget-to-Impact Visibility

**See ROI of budget spending:**

```
Budget: $30,000 → Operation: Competition → KPIs:
  - 300 participants
  - 20 projects
  - Cost per participant: $100
  - Cost per project: $1,500

  Benchmark: Industry average is $200/participant
  Result: ✅ 50% more efficient
```

### 3. Zero-Budget Operations

**Track valuable activities that don't require budget:**

```
Operations requiring $0:
  - Discord community management
  - Social media engagement
  - Email newsletters
  - Volunteer event support
  - Partnership referrals

These still have KPIs and owners!
```

### 4. Cross-Operation Analysis

**Compare operations to find best performers:**

```
┌────────────────────────┬──────────┬─────────┬────────────┐
│ Operation              │ Budget   │ Result  │ Efficiency │
├────────────────────────┼──────────┼─────────┼────────────┤
│ Climate Competition    │ $15,000  │ 20 proj │ $750/proj  │
│ Smart City Competition │ $15,000  │ 25 proj │ $600/proj  │ ✅ Better
│ Accelerator Program    │ $20,000  │ 20 proj │ $1,000/proj│
└────────────────────────┴──────────┴─────────┴────────────┘

Insight: Smart City competitions are 20% more efficient
Action: Allocate more budget to Smart City theme in Q3
```

## Integration Points

### 1. Proposal → Operation Tracking

When spending is approved:

```
Budget Proposal: "$5,000 for hackathon prizes"
    ↓ (approved)
Links to → Operation: "Q2 Hackathon"
    ↓
Updates KPI: "Prize pool: $5,000 ✓"
```

### 2. Operation → Budget Request

When operation needs funding:

```
Operation: "Community Meetup Series"
    ↓
Create Budget Proposal: "$2,000 for venue and catering"
    ↓ (if approved)
Links Budget ← → Operation
```

### 3. Reporting Integration

**Combined Budget + Operations Report:**

```
Q2 2025 Report
──────────────

BUDGET PERFORMANCE:
  Total Budget: $112,700
  Spent: $85,000 (75%)
  Committed: $15,000 (13%)
  Available: $12,700 (11%)

OPERATIONS PERFORMANCE:
  Total Operations: 12
  Completed: 4 (33%)
  In Progress: 6 (50%)
  Planned: 2 (17%)

  KPI Achievement:
    Participants: 1,250/1,500 (83%)
    Projects: 45/50 (90%)
    Jobs Placed: 30/50 (60%)

INSIGHTS:
  ✅ Projects exceeding targets
  ⚠️ Jobs placement behind schedule
  💡 Recommendation: Allocate more to job activation programs
```

## Workflow Examples

### Workflow 1: Budget-First Approach

```
1. Create Budget
   "O1. Startup Competition: $30,000"

2. Plan Operations from Budget
   "What will this $30,000 achieve?"

3. Create Linked Operation
   Operation: Climate Tech Competition
   - KPI: 300 participants
   - KPI: 20 projects

4. Execute & Track
   - Approve spending proposals
   - Update KPIs as results come in

5. Measure ROI
   - Spent: $30,000
   - Achieved: 320 participants, 22 projects
   - Result: ✅ 107% of target
```

### Workflow 2: Operations-First Approach

```
1. Define Operation
   "We want to run a Climate Tech Competition"

2. Set KPIs
   - 300 participants
   - 20 projects
   - 5 viable startups

3. Budget What's Needed
   "To achieve this, we need:"
   - $15,000 prizes
   - $10,000 venue
   - $5,000 marketing
   = $30,000 total

4. Create Budget Request
   Submit proposal for $30,000

5. Link Budget → Operation
   Once approved, link budget to operation

6. Execute & Track
```

### Workflow 3: Organic Operations (No Budget)

```
1. Create Operation
   "Discord Daily Engagement Program"

2. Set KPIs
   - 100 daily active members
   - 50+ messages per day

3. Budget: $0
   "This uses existing community manager time"

4. Track KPIs Independently
   - Not linked to any budget
   - Still tracked in operations dashboard

5. Measure Success
   "Achieved 120 DAU with $0 spent!"
```

## Permission Considerations

### Operations Plan Permissions

```
Owner:
  ✅ Create/edit/delete all operations
  ✅ Link operations to budget
  ✅ Update all KPIs
  ✅ View all operations

Admin:
  ✅ Create/edit operations
  ✅ Link operations to budget
  ✅ Update KPIs for their operations
  ✅ View all operations

Operation Owner (PIC):
  ✅ Edit their assigned operations
  ✅ Update KPIs for their operations
  ❌ Cannot delete operations
  ✅ View all operations

Proposer:
  ✅ View operations they're involved in
  ❌ Cannot edit operations
  ❌ Cannot update KPIs

Viewer:
  ✅ View all operations (read-only)
  ✅ View all KPIs
  ❌ Cannot edit anything
```

## Next Steps

### Phase 1: Foundation
- Design operations plan database schema
- Create basic operations CRUD
- Link operations to budget items

### Phase 2: KPI Tracking
- Add KPI definitions
- Manual KPI updates
- Progress dashboards

### Phase 3: Advanced Features
- Hypothesis tracking
- A/B test support
- Automated KPI calculations
- Predictive analytics

### Phase 4: Integration
- Auto-create operations from budget
- Auto-update KPIs from proposals
- Budget reallocation based on operation performance

---

## Summary

**Why Add Operations Plan:**

✅ **Visibility:** See what your money is achieving, not just what you're spending

✅ **Accountability:** Each operation has owner and KPIs

✅ **Learning:** Track hypotheses and see what works

✅ **Flexibility:** Track non-budget operations too

✅ **Decision Making:** Reallocate budget based on performance

**Integration with Budget:**

- Budget = Input (resources)
- Operations = Output (results)
- Many-to-many relationship
- Some operations need no budget
- Combined reporting shows full picture

This gives you a complete system: **Budget what you spend** + **Track what you achieve** = **Learn and improve**

---

**Related Documents:**

- [REQUIREMENTS.md](../01-overview/REQUIREMENTS.md) - Core requirements
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [SPREADSHEET_WORKFLOW.md](./SPREADSHEET_WORKFLOW.md) - UI/UX design
