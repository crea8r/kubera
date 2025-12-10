# Budget Management Tool - Permission System

## Overview

The permission system is based on a workspace model where:
- **1 workspace = 1 budget** (with name, start_date, end_date, budget lines/categories)
- Each workspace can have **multiple wallets**
- Users are assigned **roles** within each workspace
- Permissions can be **fine-grained** at the budget line level

## Core Concepts

### Workspace
A workspace represents a single budget entity with:
- Name
- Start date and end date
- Budget lines (also called budget categories)
- Multiple wallets for fund management
- Team members with assigned roles

### Budget Planning
Workspaces support budget planning configuration:
- **Enabled/Disabled**: `budget_planning: true/false`
- **Budget Line Allocations**: Amount per line per frequency
- **View Restrictions**: Limit view access to certain budget lines
- **Action Restrictions**: Limit who can propose and approve on specific budget lines

## User Roles

### 1. Owner

The workspace owner has full control over the budget.

**Permissions:**
- ✅ Transfer ownership to another user
- ✅ Update workspace settings
- ✅ Manage all users and their roles
- ✅ Change budget planning configuration
  - Set budget line allocations
  - Limit view/propose/approve access per budget line
- ✅ Propose transactions: `propose: [budget_line_id]`
- ✅ Approve transactions: `approve: [budget_line_id]`
- ✅ View spending history: `view: [budget_line_id]`
- ✅ Create reports

**Constraints:**
- Only **one Owner per workspace**
- Owner cannot be removed, only transferred

**Use Cases:**
- Budget owner or primary stakeholder
- Person ultimately responsible for the budget
- Final decision maker

---

### 2. Admin

Administrators can manage the workspace but cannot change critical settings.

**Permissions:**
- ❌ Transfer ownership
- ❌ Update workspace settings
- ✅ Manage users (with restrictions)
  - ❌ Cannot manage Owner role
  - ❌ Cannot manage other Admins
  - ❌ Cannot manage Approver roles
  - ✅ Can manage Proposers and Viewers
- ✅ Change budget planning configuration
- ✅ Propose transactions: `propose: [budget_line_id]`
- ✅ Approve transactions: `approve: [budget_line_id]`
- ✅ View spending history: `view: [budget_line_id]`
- ✅ Create reports

**Use Cases:**
- Team leads or managers
- Trusted users who help manage the budget
- Secondary approvers with broad access

---

### 3. Proposer

Proposers can submit spending proposals but cannot approve them.

**Permissions:**
- ❌ Transfer ownership
- ❌ Update workspace settings
- ❌ Manage users
- ❌ Change budget planning
- ✅ Propose transactions: `propose: [budget_line_id]`
  - Can only propose for budget lines they have access to
- ❌ Approve transactions
- ❌ View spending history
- ❌ Create reports

**Constraints:**
- Proposals are scoped to specific budget lines
- Can only see their own proposals
- Cannot view overall budget health

**Use Cases:**
- Team members who need to request spending
- Department staff submitting expenses
- External contractors requesting payments

---

### 4. Approver

Approvers can approve proposals and view reports but cannot propose.

**Permissions:**
- ❌ Transfer ownership
- ❌ Update workspace settings
- ❌ Manage users
- ❌ Change budget planning
- ❌ Propose transactions
- ✅ Approve transactions: `approve: [budget_line_id]`
  - Can only approve for budget lines they have access to
- ✅ View spending history: `view: [budget_line_id]`
- ✅ Create reports

**Constraints:**
- Approval authority limited to assigned budget lines
- Cannot modify budget configuration
- Cannot submit proposals

**Use Cases:**
- Finance team members
- Department heads who approve but don't submit
- Compliance officers

---

### 5. Viewer

Viewers have read-only access to spending history and reports.

**Permissions:**
- ❌ Transfer ownership
- ❌ Update workspace settings
- ❌ Manage users
- ❌ Change budget planning
- ❌ Propose transactions
- ❌ Approve transactions
- ✅ View spending history: `view: [budget_line_id]`
- ✅ Create reports

**Constraints:**
- Completely read-only
- Can only view budget lines they have access to
- Cannot take any actions

**Use Cases:**
- Stakeholders who need visibility
- Auditors
- Executive team members
- Finance team for monitoring

---

### 6. Custom (Future Enhancement)

Custom roles allow for fine-tuned permission combinations.

**Potential Permissions:**
- Customizable mix of permissions from other roles
- Granular control over each permission type
- Ability to create role templates

**Use Cases:**
- Organizations with unique workflow requirements
- Complex approval hierarchies
- Specialized roles (e.g., "Budget Analyst")

**Note:** Marked as future enhancement in Phase 3-4

---

## Fine-Grained Permissions

### Budget Line-Level Access Control

Permissions can be scoped to specific budget lines (categories):

#### View Access: `view: [budget_line_id]`
- Restricts which budget lines a user can see
- Applies to: Owner, Admin, Approver, Viewer
- Example: Finance team can see all lines, but Marketing can only see marketing budget line

#### Propose Access: `propose: [budget_line_id]`
- Restricts which budget lines a user can propose spending for
- Applies to: Owner, Admin, Proposer
- Example: Engineering team can only propose for "Engineering Tools" and "Infrastructure" lines

#### Approve Access: `approve: [budget_line_id]`
- Restricts which budget lines a user can approve proposals for
- Applies to: Owner, Admin, Approver
- Example: Department head can only approve proposals in their department's budget line

### Example Access Configuration

```json
{
  "user_id": "user-123",
  "workspace_id": "workspace-456",
  "role": "approver",
  "permissions": {
    "view": ["budget_line_1", "budget_line_2", "budget_line_3"],
    "propose": [],
    "approve": ["budget_line_2", "budget_line_3"]
  }
}
```

This configuration means:
- User is an Approver
- Can view 3 budget lines
- Cannot propose (Approver role restriction)
- Can approve proposals only for budget lines 2 and 3

---

## Permission Matrix

| Role | Transfer Owner | Update Setting | Manage Users | Change Budget Planning | Propose Transactions | Approve Transactions | View History + Reports |
|------|---------------|----------------|--------------|------------------------|---------------------|---------------------|------------------------|
| **Owner** | ✅ | ✅ | ✅ All | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ❌ | ❌ | ✅ Limited* | ✅ | ✅ | ✅ | ✅ |
| **Proposer** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Approver** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Viewer** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Custom** | ? | ? | ? | ? | ? | ? | ? |

\* Admin can manage Proposers and Viewers, but cannot manage Owner, Admins, or Approvers

---

## Workspace Settings

### Settings that can be updated (Owner only):
- Workspace name
- Budget start and end dates
- Wallet configurations
- Integration settings (fystack.io)
- Notification preferences
- Default permissions for new members

### Budget Planning Configuration (Owner & Admin):
- Enable/disable budget planning
- Set budget line allocations
- Define amount per line per frequency (monthly, quarterly, annually)
- Configure view restrictions per budget line
- Configure propose/approve restrictions per budget line

---

## User Management Rules

### Who can manage whom:

**Owner:**
- Can add/remove/modify all users
- Can change anyone's role
- Can transfer ownership (becomes Admin after transfer)

**Admin:**
- Can add/remove/modify Proposers and Viewers
- **Cannot** manage Owner
- **Cannot** manage other Admins
- **Cannot** manage Approvers
- Can change roles for Proposers and Viewers only

**Other Roles:**
- Cannot manage users

### Invitation Flow:
1. Owner or Admin invites user via email
2. User receives invitation link
3. User signs up or logs in
4. User is assigned role by inviter
5. User can access workspace according to their role

---

## Implementation in Database

### budget_members table (updated)

```sql
CREATE TABLE budget_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- 'owner', 'admin', 'proposer', 'approver', 'viewer', 'custom'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(budget_id, user_id)
);
```

### budget_line_permissions table (new)

```sql
CREATE TABLE budget_line_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_member_id UUID REFERENCES budget_members(id) ON DELETE CASCADE,
  budget_category_id UUID REFERENCES budget_categories(id) ON DELETE CASCADE,
  can_view BOOLEAN DEFAULT FALSE,
  can_propose BOOLEAN DEFAULT FALSE,
  can_approve BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(budget_member_id, budget_category_id)
);
```

### Usage Example:

```sql
-- Get all budget lines a user can propose for
SELECT bc.*
FROM budget_categories bc
JOIN budget_line_permissions blp ON bc.id = blp.budget_category_id
JOIN budget_members bm ON blp.budget_member_id = bm.id
WHERE bm.user_id = 'user-123'
  AND bm.budget_id = 'budget-456'
  AND blp.can_propose = TRUE;
```

---

## API Authorization

### Middleware checks:

1. **Authenticate user** (JWT token)
2. **Verify workspace membership** (user is member of workspace)
3. **Check role permission** (role has required permission)
4. **Check budget line access** (user has access to specific budget line)

### Example Authorization Flow:

**Approving a proposal:**
```
1. User is authenticated ✓
2. User is member of the workspace ✓
3. User role is Owner, Admin, or Approver ✓
4. Proposal's budget line is in user's approve list ✓
   → Approval allowed
```

**Proposing spending:**
```
1. User is authenticated ✓
2. User is member of the workspace ✓
3. User role is Owner, Admin, or Proposer ✓
4. Selected budget line is in user's propose list ✓
   → Proposal creation allowed
```

---

## Permission Enforcement in UI

### Navigation Menu:
- Show/hide menu items based on role
- "Manage Users" only visible to Owner and Admin
- "Settings" only visible to Owner

### Budget Line Dropdown:
- Filter budget lines based on user's access
- When proposing: show only lines with `can_propose`
- When approving: show only lines with `can_approve`
- When viewing: show only lines with `can_view`

### Action Buttons:
- "Approve" button only shown if user has approve permission for that budget line
- "Edit Settings" only shown to Owner
- "Manage Planning" shown to Owner and Admin

---

## Security Considerations

### Prevent Privilege Escalation:
- Admins cannot promote themselves to Owner
- Admins cannot modify Owner or other Admins
- API endpoints validate role changes

### Audit All Permission Changes:
- Log when permissions are granted/revoked
- Log role changes
- Log ownership transfers

### Validate Budget Line Access:
- Always verify budget line permissions on backend
- Never trust frontend filtering alone
- Return 403 Forbidden if unauthorized

---

## Migration Path for Existing Systems

If migrating from a simpler permission system:

1. **Default mappings:**
   - Old "Budget Owner" → New "Owner"
   - Old "Approver" → New "Admin" (with all budget lines)
   - Old "Team Member" → New "Proposer" (with all budget lines)

2. **Grant full budget line access initially:**
   - Set `can_view`, `can_propose`, `can_approve` to TRUE for all budget lines
   - Let admins refine permissions over time

3. **Gradual restriction:**
   - Start with open access
   - Admins can progressively lock down access as needed

---

## Use Case Examples

### Example 1: Engineering Team Budget

**Workspace:** "Engineering Q1 2025"

**Members:**
- Alice (Owner) - CTO
- Bob (Admin) - Engineering Manager
- Carol (Approver) - Finance Lead
  - Can approve: "Salaries", "Cloud Infrastructure"
- David (Proposer) - Senior Engineer
  - Can propose: "Tools & Software", "Cloud Infrastructure"
- Eve (Viewer) - CFO

**Workflow:**
1. David proposes $500 for "Tools & Software" (GitHub Copilot subscription)
2. Carol cannot approve (wrong budget line)
3. Bob approves (Admin can approve all)
4. Payment processed via fystack.io
5. Eve views report to monitor spending

### Example 2: Marketing Campaign

**Workspace:** "Summer Campaign 2025"

**Members:**
- Frank (Owner) - CMO
- Grace (Admin) - Marketing Manager
- Henry (Approver) - Events budget line only
- Iris (Approver) - Digital Ads budget line only
- Jack (Proposer) - Content Team
- Kate (Proposer) - Events Team
- Leo (Viewer) - CEO

**Workflow:**
1. Kate (Events Team) proposes $2,000 for "Trade Show Booth" → Events budget line
2. Iris cannot approve (only has Digital Ads access)
3. Henry approves (has Events access)
4. Jack proposes $500 for "Stock Photos" → Digital Ads budget line
5. Iris approves (has Digital Ads access)
6. Leo views overall campaign spending

---

## Future Enhancements

### Phase 3-4:
- Custom roles with mix-and-match permissions
- Permission templates
- Temporary permission grants (time-limited)
- Delegation (temporary transfer of approval rights)

### Phase 5:
- Organization-level roles (apply across multiple workspaces)
- Role-based API access
- External auditor role with read-only, time-limited access
- Compliance officer role with audit log access
