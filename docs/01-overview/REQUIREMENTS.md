# Budget Management Tool - Requirements Document

## 1. Project Overview

A comprehensive budget management tool that enables organizations to:
- Create and manage budgets
- Allow team members to propose spending
- Implement approval workflows
- Integrate with fystack.io for actual spending
- Track and report on budget performance

## 2. User Roles & Permissions

**Note:** For detailed permission specifications, see [PERMISSIONS.md](./PERMISSIONS.md)

### Workspace Model
- 1 workspace = 1 budget (with name, start_date, end_date, budget lines)
- Each workspace can have multiple wallets
- Permissions can be scoped to specific budget lines

### 2.1 Owner
- Full control over the workspace
- Transfer ownership, update settings, manage all users
- Configure budget planning and restrictions
- Propose and approve transactions
- View all reports and analytics
- Only one Owner per workspace

### 2.2 Admin
- Manage users (except Owner, Admins, and Approvers)
- Configure budget planning
- Propose and approve transactions
- View all reports and analytics
- Cannot update workspace settings or transfer ownership

### 2.3 Proposer
- Submit spending proposals for assigned budget lines
- View only their own proposals
- Cannot approve or view overall budget health

### 2.4 Approver
- Approve proposals for assigned budget lines
- View spending history and create reports
- Cannot propose transactions

### 2.5 Viewer
- Read-only access to spending history and reports
- Can only view assigned budget lines
- Cannot propose or approve

### 2.6 Custom (Future)
- Customizable mix of permissions
- Fine-grained control for specialized roles

### 2.7 Fine-Grained Permissions

Permissions can be scoped to specific budget lines (categories):

#### Budget Line-Level Access
- **View Access**: `view: [budget_line_id]` - Control which budget lines a user can see
- **Propose Access**: `propose: [budget_line_id]` - Control which budget lines a user can propose spending for
- **Approve Access**: `approve: [budget_line_id]` - Control which budget lines a user can approve proposals for

#### Budget Planning Configuration
- Enable/disable budget planning per workspace
- Set amount per budget line per frequency (monthly, quarterly, annually)
- Limit view access to certain budget lines
- Limit propose and approve access to certain budget lines

#### Use Cases
- Marketing team can only propose/approve for marketing budget lines
- Finance team can view all budget lines but only approve for specific ones
- Department heads can approve only for their department's budget lines

### 2.8 Workspace & Wallet Management

#### Workspace (Budget)
- Each workspace represents one budget
- Contains: name, start_date, end_date, budget lines/categories
- Multiple wallets can be associated with a workspace

#### Wallets
- Multiple wallets per workspace for fund management
- Wallets connected to fystack.io for actual payments
- Wallet permissions managed at workspace level

## 3. Core Features

### 3.1 Budget Creation & Management

#### Budget Structure
- **Budget Name**: Descriptive name for the budget
- **Total Amount**: Overall budget allocation
- **Time Period**: Start and end dates
- **Currency**: Support for multiple currencies
- **Categories/Line Items**:
  - Breakdown by department, project, or expense type
  - Each category has its own allocation
  - Ability to set subcategories
- **Budget Owner**: Person responsible for the budget
- **Team Members**: Users who can propose spending

#### Budget Templates
- Create reusable budget templates
- Common categories for quick setup
- Ability to clone previous budgets

#### Budget Adjustments
- Ability to modify budget amounts
- Track revision history
- Require approval for significant changes

### 3.2 Spending Proposal System

#### Proposal Creation
Team members can submit proposals with:
- **Amount**: How much they want to spend
- **Category**: Which budget line item
- **Description**: What the spending is for
- **Justification**: Why it's needed
- **Vendor/Recipient**: Who will receive payment
- **Expected Date**: When spending will occur
- **Attachments**: Supporting documents (quotes, invoices, etc.)
- **Tags**: Custom labels for filtering

#### Proposal Workflow
1. **Draft**: Team member creates proposal
2. **Submitted**: Proposal sent for review
3. **Under Review**: Being evaluated by approver
4. **Approved**: Ready for spending
5. **Rejected**: Not approved (with reason)
6. **Spent**: Money has been disbursed
7. **Cancelled**: Withdrawn by requester

#### Proposal Features
- Save as draft before submitting
- Edit proposals while in draft state
- Withdraw submitted proposals
- Add comments/discussions on proposals
- Request additional information
- Conditional approvals with modifications

### 3.3 Approval System

#### Approval Rules
- Single approver per budget
- Multi-level approval for amounts exceeding threshold
- Automatic approval for amounts below threshold
- Delegation when approver is unavailable

#### Approval Actions
- Approve with one click
- Reject with required reason
- Request changes/more information
- Set conditions for approval
- Bulk approval for multiple proposals

#### Notifications
- Email notifications for new proposals
- Reminders for pending approvals
- Status updates to proposal submitters
- Escalation for delayed approvals

### 3.4 fystack.io Integration

#### Integration Requirements
- OAuth/API authentication with fystack.io
- Push approved spending to fystack.io
- Sync transaction status back to budget tool
- Map budget categories to fystack.io payment types
- Handle payment failures and retry logic

#### Payment Flow
1. Proposal approved in budget tool
2. Create payment request in fystack.io
3. Track payment status
4. Update proposal status when payment completes
5. Record actual spent amount

#### Sync Features
- Real-time or scheduled sync
- Reconciliation of planned vs actual spending
- Handle refunds and payment modifications
- Import historical transactions

### 3.5 Reporting & Analytics

#### Budget Dashboard
- Overall budget health at a glance
- Spent vs Available by category
- Pending proposals total
- Burn rate (spending velocity)
- Projected end-of-period status
- Visual charts and graphs

#### Reports

**Budget Status Report**
- Total allocated, spent, committed, available
- Breakdown by category
- Variance analysis
- Time-based trends

**Spending Proposals Report**
- All proposals by status
- Approval turnaround time
- Most common spending categories
- Proposal success rate

**Team Member Report**
- Spending by team member
- Proposal patterns
- Average request size

**Variance Report**
- Budget vs actual comparison
- Over/under spending by category
- Forecast accuracy

**Audit Trail**
- Complete history of all actions
- Who approved what and when
- Budget modifications log

#### Alert System
- Budget threshold warnings (e.g., 80% spent)
- Category overspending alerts
- Unusual spending patterns
- Upcoming budget period end
- Stale proposals (pending too long)

### 3.6 Budget Tracking & Health

#### Key Metrics
- **Total Budget**: Original allocation
- **Committed**: Approved but not yet spent
- **Spent**: Actually disbursed via fystack.io
- **Available**: Budget - (Committed + Spent)
- **Pending**: Proposals awaiting approval
- **Burn Rate**: Average spending per day/week/month
- **Runway**: Days until budget depleted at current rate
- **Utilization Rate**: Percentage of budget used

#### On-Track Indicators
- Green: Spending aligned with timeline
- Yellow: Slight deviation, needs attention
- Red: Significant variance, immediate action needed

#### Forecasting
- Projected end-of-period spending
- Recommended spending pace
- Category-level projections
- What-if scenario analysis

## 4. Technical Requirements

### 4.1 Data Management
- Secure database for all budget data
- Regular automated backups
- Data encryption at rest and in transit
- Audit logging for compliance

### 4.2 Authentication & Security
- User authentication (email/password, SSO)
- Role-based access control
- Session management
- API key management for integrations
- Two-factor authentication (optional)

### 4.3 API & Integrations
- RESTful API for fystack.io integration
- Webhook support for real-time updates
- Export capabilities (CSV, Excel, PDF)
- Import from other budget tools

### 4.4 Performance
- Support for multiple concurrent users
- Fast query response times
- Efficient handling of large datasets
- Pagination for long lists

### 4.5 User Interface
- Web-based application
- Mobile-responsive design
- Intuitive navigation
- Consistent design language
- Accessibility compliance

## 5. User Workflows

### 5.1 Creating a Budget
1. Admin navigates to "Create Budget"
2. Fills in budget details (name, amount, period)
3. Adds categories and allocations
4. Assigns team members
5. Sets approval rules
6. Saves and activates budget

### 5.2 Submitting a Spending Proposal
1. Team member clicks "New Proposal"
2. Selects budget and category
3. Enters amount and details
4. Adds justification and attachments
5. Submits for approval
6. Receives confirmation notification

### 5.3 Approving a Proposal
1. Approver receives notification
2. Reviews proposal details
3. Checks budget availability
4. Approves or rejects with comments
5. System updates proposal status
6. Submitter receives notification

### 5.4 Processing Payment
1. Approved proposal triggers fystack.io integration
2. Payment request created in fystack.io
3. Payment processed
4. Transaction status synced back
5. Budget updated with actual spend
6. Proposal marked as "Spent"

### 5.5 Monitoring Budget Health
1. Admin opens budget dashboard
2. Reviews key metrics and alerts
3. Examines category-level spending
4. Identifies issues (overspending, underspending)
5. Takes corrective action if needed
6. Exports reports for stakeholders

## 6. Data Model (High-Level)

### Budget
- ID, Name, Total Amount, Currency
- Start Date, End Date
- Owner ID
- Status (Active, Completed, Archived)
- Created/Modified timestamps

### Budget Category
- ID, Budget ID, Category Name
- Allocated Amount
- Parent Category (for hierarchy)

### Budget Member
- Budget ID, User ID
- Role (Proposer, Approver, Viewer)

### Spending Proposal
- ID, Budget ID, Category ID
- Submitter ID, Amount
- Description, Justification
- Status, Created Date
- Approved By, Approved Date
- fystack.io Transaction ID

### Transaction
- ID, Proposal ID
- Amount, Currency
- Transaction Date
- fystack.io Reference
- Status (Pending, Completed, Failed)

### User
- ID, Name, Email
- Role (Admin, User)
- Authentication details

## 7. Integration Specifications

### 7.1 fystack.io Integration
- **Authentication**: API key or OAuth 2.0
- **Endpoints Needed**:
  - Create payment
  - Get payment status
  - List transactions
  - Webhook for status updates
- **Data Mapping**:
  - Budget proposal → fystack payment request
  - Transaction status → Proposal status
- **Error Handling**:
  - Payment failures
  - Network timeouts
  - Invalid credentials

### 7.2 Export Capabilities
- PDF reports with charts
- Excel/CSV for raw data
- Scheduled report delivery via email
- Custom report builder

## 8. Non-Functional Requirements

### 8.1 Scalability
- Support for 100+ budgets
- 1000+ proposals per budget
- Multiple organizations (multi-tenancy)

### 8.2 Availability
- 99.9% uptime target
- Scheduled maintenance windows
- Disaster recovery plan

### 8.3 Usability
- Minimal training required
- Contextual help and tooltips
- Quick onboarding flow

### 8.4 Compliance
- Audit trail for all actions
- Data retention policies
- GDPR compliance (if applicable)
- Export user data on request

## 9. Future Enhancements

### Phase 2 Features
- Mobile app (iOS/Android)
- Advanced analytics with AI insights
- Budget recommendations based on historical data
- Multi-currency conversion and handling
- Integration with accounting software (QuickBooks, Xero)
- Recurring spending proposals
- Budget templates marketplace
- Team collaboration features (comments, @mentions)
- Advanced approval workflows (parallel, conditional)
- Custom fields for proposals
- Budget forecasting with machine learning

### Phase 3 Features
- Procurement module
- Vendor management
- Contract tracking
- Invoice matching
- Purchase orders
- Expense reimbursement
- Credit card integration
- Bill pay automation

## 10. Success Metrics

### Key Performance Indicators
- User adoption rate
- Proposal approval time (target: <24 hours)
- Budget accuracy (planned vs actual within 10%)
- User satisfaction score
- Time saved vs manual processes
- Reduction in budget overruns

## 11. Constraints & Assumptions

### Constraints
- Must integrate with fystack.io
- Web-based initially (no native mobile apps in v1)
- Single currency per budget in v1

### Assumptions
- Users have internet connectivity
- fystack.io API is stable and documented
- Email delivery is reliable for notifications
- Users have basic budget management knowledge

## 12. Open Questions

1. Should budgets support multiple approvers or approval chains?
2. What happens to pending proposals when budget period ends?
3. Should the system support budget rollover to next period?
4. What level of customization should be allowed for workflows?
5. Should there be a mobile app in v1 or web-responsive is sufficient?
6. What reporting frequency is expected (real-time, daily, weekly)?
7. Should historical budgets be editable or locked?
8. What integrations beyond fystack.io are must-haves vs nice-to-haves?

## 13. Next Steps

1. Review and refine requirements with stakeholders
2. Prioritize features into MVP vs future phases
3. Create detailed user stories for each feature
4. Design database schema
5. Create wireframes/mockups for key screens
6. Evaluate technology stack options
7. Estimate development effort
8. Create project timeline
9. Define testing strategy
10. Plan deployment and rollout strategy
