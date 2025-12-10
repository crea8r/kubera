# Budget Management Tool - Examples & Use Cases

This document provides concrete examples of how the budget management tool works in real-world scenarios.

## Table of Contents

1. [Basic Budget Setup](#basic-budget-setup)
2. [Team Collaboration Examples](#team-collaboration-examples)
3. [Permission Scenarios](#permission-scenarios)
4. [Approval Workflow Examples](#approval-workflow-examples)
5. [Reporting Examples](#reporting-examples)
6. [Integration Examples](#integration-examples)

---

## Basic Budget Setup

### Example 1: Small Team Quarterly Budget

**Scenario:** A small engineering team needs to manage their Q1 2025 budget.

**Setup:**
- **Budget Name:** Engineering Q1 2025
- **Total Amount:** $50,000
- **Period:** January 1 - March 31, 2025
- **Currency:** USD

**Budget Lines:**
```
1. Tools & Software: $10,000
2. Cloud Infrastructure: $25,000
3. Contractor Payments: $10,000
4. Training & Conferences: $5,000
```

**Team Members:**
```
- Alice (Owner) - Engineering Manager
- Bob (Admin) - Tech Lead
- Carol (Proposer) - Senior Engineer
- David (Proposer) - Junior Engineer
- Eve (Approver) - Finance Manager
- Frank (Viewer) - VP of Engineering
```

**Workflow:**
1. Alice creates the budget and categories
2. Alice invites team members and assigns roles
3. Carol and David can propose spending
4. Alice, Bob, and Eve can approve proposals
5. Frank can view reports

---

### Example 2: Marketing Campaign Budget

**Scenario:** Marketing team running a summer campaign with multiple sub-teams.

**Setup:**
- **Budget Name:** Summer Campaign 2025
- **Total Amount:** $100,000
- **Period:** June 1 - August 31, 2025

**Budget Lines:**
```
1. Digital Ads: $40,000
2. Events: $30,000
3. Content Creation: $20,000
4. Influencer Partnerships: $10,000
```

**Fine-Grained Permissions:**
```
- Grace (Owner) - CMO
  - Can do everything

- Henry (Admin) - Marketing Manager
  - Can manage Proposers
  - Can approve all budget lines

- Iris (Approver) - Digital Marketing Lead
  - Can approve: Digital Ads, Content Creation only
  - Can view all budget lines

- Jack (Approver) - Events Lead
  - Can approve: Events only
  - Can view all budget lines

- Kate, Leo, Mike (Proposers) - Marketing Coordinators
  - Kate: Can propose for Digital Ads
  - Leo: Can propose for Events
  - Mike: Can propose for Content Creation
```

**Example Workflow:**
1. Kate proposes $2,000 for "Facebook Ad Campaign"
   - Budget Line: Digital Ads
   - Status: Pending approval
2. Iris approves (has Digital Ads approval rights)
3. Payment triggers via fystack.io
4. Budget automatically updated

---

## Team Collaboration Examples

### Example 3: Cross-Functional Project

**Scenario:** A product launch requiring coordination between engineering, design, and marketing.

**Budget Setup:**
- **Name:** Product X Launch
- **Total:** $200,000
- **Budget Lines:**
  - Engineering Development: $100,000
  - Design & UX: $40,000
  - Marketing: $60,000

**Team Structure:**
```
Owner: Product Manager (Sarah)
Admins:
  - Engineering Lead (Tom)
  - Design Lead (Uma)
  - Marketing Lead (Victor)

Proposers organized by department:
Engineering Team:
  - Can propose for "Engineering Development" only
Design Team:
  - Can propose for "Design & UX" only
Marketing Team:
  - Can propose for "Marketing" only

Approvers:
  - Department Leads approve for their own budget lines
  - Finance Officer approves all budget lines
  - Product Manager (Owner) can approve everything
```

**Collaboration Example:**
1. **Week 1:** Engineering team proposes $5,000 for API development tools
   - Proposer: Engineer A
   - Budget Line: Engineering Development
   - Approver: Engineering Lead (Tom)
   - Status: Approved

2. **Week 2:** Design team needs contractor
   - Proposer: Designer B
   - Budget Line: Design & UX
   - Amount: $8,000
   - Approver: Design Lead (Uma)
   - Status: Approved

3. **Week 4:** Marketing wants to reallocate funds
   - Marketing Lead requests Product Manager to move $5,000 from Marketing to Design
   - Product Manager (Owner) adjusts budget allocations
   - All team members notified

---

## Permission Scenarios

### Scenario 1: Restricting Visibility

**Problem:** Finance team wants to hide salary budget line from non-management.

**Solution:**
```
Budget: "Operations 2025"
Budget Lines:
  1. Salaries (RESTRICTED)
  2. Office Supplies
  3. Equipment

Permissions:
Owner (CFO):
  - view: [Salaries, Office Supplies, Equipment]
  - approve: [Salaries, Office Supplies, Equipment]

Admin (Finance Manager):
  - view: [Salaries, Office Supplies, Equipment]
  - approve: [Salaries, Office Supplies, Equipment]

Approver (Office Manager):
  - view: [Office Supplies, Equipment]
  - approve: [Office Supplies, Equipment]
  - CANNOT see Salaries budget line

Proposers (Team):
  - view: [Office Supplies, Equipment]
  - propose: [Office Supplies, Equipment]
  - CANNOT see Salaries budget line
```

**Result:** Only Owner and Admin can see and manage the Salaries budget line.

---

### Scenario 2: Delegated Approval Authority

**Problem:** Department heads should only approve their own department's spending.

**Solution:**
```
Budget: "Company-Wide Q2 2025"
Budget Lines:
  1. Engineering
  2. Marketing
  3. Sales
  4. Operations

Team:
Owner: CEO
  - Can approve all

Admin: CFO
  - Can approve all

Approvers by department:
  - Engineering Manager → approve: [Engineering]
  - Marketing Manager → approve: [Marketing]
  - Sales Manager → approve: [Sales]
  - Operations Manager → approve: [Operations]

Proposers:
  - Engineering team → propose: [Engineering]
  - Marketing team → propose: [Marketing]
  - etc.
```

**Workflow Example:**
```
1. Engineer proposes $1,000 for "Developer Tools"
   ↓
2. Routing: Goes to Engineering Manager (has approve rights for Engineering)
   ↓
3. Engineering Manager approves
   ✓ Payment processed
```

If Engineer tries to propose for Marketing budget line:
```
❌ ERROR: User does not have propose permission for Marketing budget line
```

---

### Scenario 3: Temporary Team Member

**Problem:** Contractor needs limited access for 2 months.

**Solution:**
```
1. Add contractor as Proposer
2. Grant propose access only to "Contractor Payments" budget line
3. Set reminder to remove access after 2 months

Permissions:
Contractor (John):
  - Role: Proposer
  - view: [Contractor Payments]
  - propose: [Contractor Payments]
  - Duration: Temporary (manual removal after project)

After 2 months:
  - Owner removes John from workspace
  - John loses all access
  - Historical proposals remain visible to others
```

---

## Approval Workflow Examples

### Example 4: Simple Approval

**Flow:**
```
1. CREATE PROPOSAL
   Proposer: Alice
   Amount: $500
   Category: Office Supplies
   Description: "Standing desks for team"
   Status: Draft

2. SUBMIT PROPOSAL
   Alice clicks "Submit"
   Status: Submitted
   Notification sent to approvers

3. APPROVE
   Approver: Bob
   Action: Approve
   Status: Approved
   Notification sent to Alice

4. PAYMENT
   System creates payment in fystack.io
   Status: Processing

5. COMPLETE
   fystack.io confirms payment
   Status: Spent
   Budget updated automatically
```

---

### Example 5: Rejected Proposal

**Flow:**
```
1. SUBMIT
   Proposer: Carol
   Amount: $10,000
   Category: Marketing
   Description: "Billboard advertising"

2. REVIEW
   Approver: Dave (Marketing Lead)
   Concern: Too expensive, unclear ROI

3. REJECT
   Action: Reject
   Reason: "Please provide ROI analysis and consider cheaper alternatives"
   Status: Rejected
   Notification sent to Carol

4. REVISE
   Carol updates proposal:
   - Adds ROI calculations
   - Reduces to $7,000
   - Adds market research

5. RESUBMIT
   Status: Submitted (new proposal)
   Dave reviews again

6. APPROVE
   Satisfied with changes
   Status: Approved
```

---

### Example 6: Multi-Level Approval (Future Enhancement)

**Scenario:** Large expenses require multiple approvals.

**Rules:**
```
Amount < $1,000:
  - 1 approval required (any approver)

Amount $1,000 - $10,000:
  - 2 approvals required (department head + finance)

Amount > $10,000:
  - 3 approvals required (department head + finance + owner)
```

**Example:**
```
Proposal: $15,000 for "New Servers"

Step 1: Engineering Manager approves
  ✓ Approval 1/3

Step 2: Finance Manager approves
  ✓ Approval 2/3

Step 3: CTO (Owner) approves
  ✓ Approval 3/3
  → Payment triggered
```

---

## Reporting Examples

### Example 7: Budget Health Dashboard

**Dashboard View:**
```
Engineering Q1 2025
├─ Total Budget: $50,000
├─ Spent: $32,000 (64%)
├─ Committed: $8,000 (16%)
├─ Pending: $3,000 (6%)
└─ Available: $7,000 (14%)

Status: ⚠️ Yellow (above target spending rate)

Breakdown by Category:
┌────────────────────┬──────────┬─────────┬────────────┬───────────┐
│ Category           │ Budget   │ Spent   │ Committed  │ Available │
├────────────────────┼──────────┼─────────┼────────────┼───────────┤
│ Tools & Software   │ $10,000  │ $8,000  │ $1,000     │ $1,000    │
│ Cloud Infra        │ $25,000  │ $20,000 │ $3,000     │ $2,000    │
│ Contractors        │ $10,000  │ $3,000  │ $4,000     │ $3,000    │
│ Training           │ $5,000   │ $1,000  │ $0         │ $4,000    │
└────────────────────┴──────────┴─────────┴────────────┴───────────┘

Alerts:
⚠️ Cloud Infrastructure at 92% utilization
⚠️ 60% of time period elapsed, 80% of budget used
✓ Training budget underspent, $4,000 available
```

---

### Example 8: Spending Trends Report

**Monthly Spending:**
```
Engineering Q1 2025 - Spending Over Time

January:  $12,000 ████████████░░░░░░░░
February: $15,000 ███████████████░░░░░
March:    $5,000  █████░░░░░░░░░░░░░░░

Average: $10,667/month
Burn Rate: $1,455/week
Runway: 4.8 weeks remaining

Forecast:
If current trend continues:
  - End of period spending: $47,000
  - Unspent: $3,000 (6%)

Recommendation: ✓ On track, slight under-spend
```

---

### Example 9: Variance Report

**Planned vs Actual:**
```
Marketing Campaign - Variance Analysis

┌──────────────┬──────────┬─────────┬───────────┬──────────┐
│ Category     │ Planned  │ Actual  │ Variance  │ Status   │
├──────────────┼──────────┼─────────┼───────────┼──────────┤
│ Digital Ads  │ $40,000  │ $38,000 │ -$2,000   │ ✓ Under  │
│ Events       │ $30,000  │ $35,000 │ +$5,000   │ ⚠️ Over   │
│ Content      │ $20,000  │ $19,500 │ -$500     │ ✓ Under  │
│ Influencers  │ $10,000  │ $7,500  │ -$2,500   │ ✓ Under  │
├──────────────┼──────────┼─────────┼───────────┼──────────┤
│ TOTAL        │ $100,000 │ $100,000│ $0        │ ✓ Match  │
└──────────────┴──────────┴─────────┴───────────┴──────────┘

Analysis:
• Events over budget by 17% due to unexpected venue costs
• Savings from other categories offset the overage
• Overall budget on target
```

---

## Integration Examples

### Example 10: fystack.io Payment Flow

**Scenario:** Approved proposal triggers payment.

**Step-by-Step:**

**1. Proposal Approved**
```json
{
  "proposal_id": "prop-123",
  "budget_id": "budget-456",
  "amount": 1500,
  "currency": "USD",
  "vendor": "AWS",
  "status": "approved"
}
```

**2. System Creates Payment Request**
```javascript
// Pseudo-code
const fystackPayment = await fystack.payments.create({
  amount: proposal.amount,
  currency: proposal.currency,
  recipient: proposal.vendor,
  description: proposal.description,
  metadata: {
    proposal_id: proposal.id,
    budget_id: proposal.budget_id
  }
});

// Update proposal with fystack transaction ID
await updateProposal(proposal.id, {
  fystack_transaction_id: fystackPayment.id,
  status: 'processing'
});
```

**3. fystack.io Processes Payment**
```
fystack.io → Payment initiated
fystack.io → Payment processing
fystack.io → Payment completed
```

**4. Webhook Receives Update**
```javascript
// Webhook handler
app.post('/api/fystack/webhook', async (req, res) => {
  const event = req.body;

  if (event.type === 'payment.completed') {
    const proposalId = event.metadata.proposal_id;

    await updateProposal(proposalId, {
      status: 'spent',
      transaction_date: event.completed_at,
      actual_amount: event.amount
    });

    await updateBudget(event.metadata.budget_id);
    await sendNotification(proposalId, 'payment_completed');
  }

  res.json({ received: true });
});
```

**5. Budget Updated**
```
Budget before:
  Spent: $32,000
  Committed: $1,500

Budget after:
  Spent: $33,500
  Committed: $0
```

**6. Notifications Sent**
```
Email to Proposer:
  "Your proposal for AWS services ($1,500) has been paid."

Email to Budget Owner:
  "Payment completed: $1,500 to AWS from Engineering Q1 budget."
```

---

### Example 11: Payment Failure Handling

**Scenario:** Payment fails due to insufficient funds in wallet.

**Flow:**
```
1. Proposal Approved
   Status: Approved

2. Payment Request to fystack.io
   Status: Processing

3. fystack.io Returns Error
   Error: "insufficient_funds"
   Status: Failed

4. System Handles Failure
   - Update proposal status to "payment_failed"
   - Log error message
   - Send notification to admins
   - Keep proposal in "committed" state

5. Admin Notification
   Subject: "Payment Failed - Action Required"
   Message: "Proposal #123 payment failed due to insufficient funds.
            Please add funds to wallet or cancel the proposal."

6. Admin Actions
   Option 1: Add funds to wallet and retry
   Option 2: Cancel proposal and update budget
   Option 3: Request budget reallocation

7. Retry Payment
   - Admin clicks "Retry Payment"
   - System creates new payment request
   - Status: Processing → Completed
```

---

### Example 12: Reconciliation

**Scenario:** Daily reconciliation between system and fystack.io.

**Reconciliation Report:**
```
Date: 2025-03-15
Budget: Engineering Q1 2025

System Records:
  Proposals marked "Spent": 15
  Total Spent: $32,000

fystack.io Records:
  Completed Payments: 15
  Total Paid: $32,000

Status: ✓ Reconciled

Discrepancies: None
```

**If Discrepancy Found:**
```
Date: 2025-03-16
Budget: Marketing Q2 2025

System Records:
  Proposals marked "Spent": 10
  Total Spent: $25,000

fystack.io Records:
  Completed Payments: 9
  Total Paid: $23,500

Status: ⚠️ Discrepancy Detected

Missing Transactions:
  Proposal #456 - $1,500 - Status: "Spent" in system but no fystack payment

Action Required:
  1. Check fystack.io transaction logs
  2. Verify proposal #456 payment status
  3. Either:
     - Update system status to "Failed"
     - Or locate missing fystack transaction
```

---

## Advanced Examples

### Example 13: Budget Rollover

**Scenario:** Unspent budget at end of period needs to roll over.

**Q1 Ending:**
```
Engineering Q1 2025
Total: $50,000
Spent: $45,000
Remaining: $5,000
```

**Q2 Setup:**
```
Option 1: Create new budget, manually add rollover
  Engineering Q2 2025
  New allocation: $50,000
  Rollover from Q1: $5,000
  Total: $55,000

Option 2: Extend Q1 budget
  Engineering Q1 2025 (Extended)
  End date: Changed from March 31 → June 30
  Additional allocation: $50,000
  Total: $55,000 ($5,000 unspent + $50,000 new)
```

---

### Example 14: Emergency Override

**Scenario:** Urgent spending needed outside normal approval process.

**Setup:**
```
Budget: IT Infrastructure
Emergency Contact: CTO
Emergency Threshold: >$10,000 urgent spending

Normal Flow:
  Proposer → Approver → Payment (24-48 hours)

Emergency Flow:
  Proposer → Mark as "URGENT" → CTO notified
  ↓
  CTO reviews immediately
  ↓
  Fast-track approval → Payment (1-2 hours)
```

**Example:**
```
Incident: Server outage at 2 AM
Proposal: $15,000 for emergency server replacement

Normal Process: Would take 1-2 days
Emergency Process:
  1. On-call engineer creates proposal
  2. Marks as "URGENT - SERVER DOWN"
  3. CTO gets SMS notification
  4. CTO approves via mobile
  5. Payment processed immediately
  6. Server ordered, crisis averted
```

---

## API Examples

### Example 15: Creating a Proposal via API

**Request:**
```javascript
POST /api/proposals
Authorization: Bearer <token>
Content-Type: application/json

{
  "budget_id": "budget-456",
  "category_id": "cat-789",
  "amount": 2500.00,
  "description": "Figma Professional subscription for design team",
  "justification": "Need advanced prototyping features for Q2 product launch",
  "vendor_name": "Figma Inc.",
  "expected_date": "2025-04-01",
  "attachments": []
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "id": "prop-123",
    "budget_id": "budget-456",
    "category_id": "cat-789",
    "submitter_id": "user-789",
    "amount": 2500.00,
    "description": "Figma Professional subscription for design team",
    "status": "draft",
    "created_at": "2025-03-15T10:30:00Z"
  }
}
```

---

### Example 16: Approving a Proposal via API

**Request:**
```javascript
POST /api/proposals/prop-123/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "comment": "Approved. This will help streamline our design process."
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "id": "prop-123",
    "status": "approved",
    "approved_by": "user-456",
    "approved_at": "2025-03-15T11:00:00Z",
    "comment": "Approved. This will help streamline our design process."
  },
  "meta": {
    "payment_initiated": true,
    "fystack_transaction_id": "fys-tx-789"
  }
}
```

---

## Summary

These examples demonstrate:
- ✅ Setting up budgets for different team sizes and structures
- ✅ Configuring fine-grained permissions
- ✅ Managing approval workflows
- ✅ Generating useful reports
- ✅ Integrating with fystack.io
- ✅ Handling edge cases and errors
- ✅ Using the API

Use these examples as templates when implementing features or explaining functionality to stakeholders.

---

**Related Documents:**
- [REQUIREMENTS.md](./REQUIREMENTS.md) - Full feature specifications
- [PERMISSIONS.md](./PERMISSIONS.md) - Detailed permission model
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical implementation
- [USER_STORIES.md](./USER_STORIES.md) - User-centric stories
