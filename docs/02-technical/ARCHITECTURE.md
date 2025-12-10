# Budget Management Tool - Technical Architecture

## 1. System Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Web App)                      │
│  - React/Vue/Angular (TBD)                                  │
│  - State Management (Redux/Context/Zustand)                 │
│  - UI Components Library                                    │
└───────────────────┬─────────────────────────────────────────┘
                    │ REST API / GraphQL
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend API Server                        │
│  - Node.js/Python/Go (TBD)                                  │
│  - Authentication & Authorization                           │
│  - Business Logic Layer                                     │
│  - API Endpoints                                            │
└─────┬──────────────────┬──────────────────┬────────────────┘
      │                  │                  │
      ▼                  ▼                  ▼
┌──────────┐  ┌──────────────────┐  ┌─────────────────┐
│ Database │  │ fystack.io API   │  │ Email Service   │
│ (Primary │  │                  │  │ (SendGrid/SES)  │
│  Store)  │  │                  │  │                 │
└──────────┘  └──────────────────┘  └─────────────────┘
```

## 2. Technology Stack Options

### 2.1 Frontend

**Option A: React + TypeScript**
- Pros: Large ecosystem, excellent tooling, TypeScript for type safety
- Cons: More boilerplate code
- Best for: Teams familiar with React, need for complex UIs

**Option B: Vue.js + TypeScript**
- Pros: Easier learning curve, great documentation, composition API
- Cons: Smaller ecosystem than React
- Best for: Faster development, simpler component structure

**Option C: Next.js (React Framework)**
- Pros: SSR/SSG capabilities, built-in routing, API routes
- Cons: More opinionated, larger bundle size
- Best for: SEO needs, full-stack development in one framework

**Recommendation**: Next.js for full-stack capability and better DX

### 2.2 Backend

**Option A: Node.js + Express/Fastify**
- Pros: JavaScript everywhere, large ecosystem, fast development
- Cons: Callback hell if not using async/await properly
- Best for: Quick iteration, JavaScript team

**Option B: Python + FastAPI/Django**
- Pros: Excellent for data processing, great libraries, readable code
- Cons: Slower than Node.js/Go for I/O operations
- Best for: Teams with Python expertise, complex data operations

**Option C: Go + Fiber/Gin**
- Pros: Excellent performance, built-in concurrency, strong typing
- Cons: Smaller ecosystem, more verbose
- Best for: High performance needs, microservices

**Recommendation**: Node.js + TypeScript + Fastify for consistent language across stack

### 2.3 Database

**Option A: PostgreSQL**
- Pros: ACID compliance, robust, excellent for financial data, JSON support
- Cons: Requires more setup, vertical scaling challenges
- Best for: Complex queries, data integrity critical

**Option B: MongoDB**
- Pros: Flexible schema, horizontal scaling, good for rapid development
- Cons: Less strict data integrity, eventual consistency issues
- Best for: Rapid iteration, flexible data models

**Option C: MySQL/MariaDB**
- Pros: Widely used, good performance, mature ecosystem
- Cons: Less advanced features than PostgreSQL
- Best for: Simpler requirements, hosting compatibility

**Recommendation**: PostgreSQL for data integrity and financial operations

### 2.4 Additional Services

- **Caching**: Redis for session management and query caching
- **File Storage**: AWS S3 or similar for proposal attachments
- **Email**: SendGrid or AWS SES for notifications
- **Monitoring**: DataDog, New Relic, or Sentry
- **Hosting**: AWS, Google Cloud, or Vercel/Railway for simpler deployment

## 3. Database Schema

### Core Tables

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user', -- 'admin' or 'user'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### budgets
```sql
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  total_amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'archived'
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### budget_categories
```sql
CREATE TABLE budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  allocated_amount DECIMAL(15, 2) NOT NULL,
  parent_category_id UUID REFERENCES budget_categories(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### budget_members
```sql
CREATE TABLE budget_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- 'owner', 'admin', 'proposer', 'approver', 'viewer', 'custom'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(budget_id, user_id),
  CONSTRAINT one_owner_per_budget CHECK (
    role != 'owner' OR
    (SELECT COUNT(*) FROM budget_members WHERE budget_id = budget_members.budget_id AND role = 'owner') = 1
  )
);
```

#### budget_line_permissions
```sql
CREATE TABLE budget_line_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_member_id UUID REFERENCES budget_members(id) ON DELETE CASCADE,
  budget_category_id UUID REFERENCES budget_categories(id) ON DELETE CASCADE,
  can_view BOOLEAN DEFAULT FALSE,
  can_propose BOOLEAN DEFAULT FALSE,
  can_approve BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(budget_member_id, budget_category_id)
);
```

#### wallets
```sql
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  fystack_wallet_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### spending_proposals
```sql
CREATE TABLE spending_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID REFERENCES budgets(id),
  category_id UUID REFERENCES budget_categories(id),
  submitter_id UUID REFERENCES users(id),
  amount DECIMAL(15, 2) NOT NULL,
  description TEXT NOT NULL,
  justification TEXT,
  vendor_name VARCHAR(255),
  expected_date DATE,
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'submitted', 'approved', 'rejected', 'spent', 'cancelled'
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  rejection_reason TEXT,
  fystack_transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### proposal_attachments
```sql
CREATE TABLE proposal_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES spending_proposals(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

#### transactions
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES spending_proposals(id),
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  transaction_date TIMESTAMP,
  fystack_reference VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### audit_log
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL, -- 'budget', 'proposal', etc.
  entity_id UUID NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL, -- 'proposal_submitted', 'proposal_approved', etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_entity_type VARCHAR(50),
  related_entity_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes for Performance

```sql
-- Frequently queried columns
CREATE INDEX idx_budgets_owner ON budgets(owner_id);
CREATE INDEX idx_budgets_status ON budgets(status);
CREATE INDEX idx_proposals_budget ON spending_proposals(budget_id);
CREATE INDEX idx_proposals_submitter ON spending_proposals(submitter_id);
CREATE INDEX idx_proposals_status ON spending_proposals(status);
CREATE INDEX idx_budget_members_user ON budget_members(user_id);
CREATE INDEX idx_budget_members_budget ON budget_members(budget_id);
CREATE INDEX idx_budget_members_role ON budget_members(budget_id, role);
CREATE INDEX idx_budget_line_perms_member ON budget_line_permissions(budget_member_id);
CREATE INDEX idx_budget_line_perms_category ON budget_line_permissions(budget_category_id);
CREATE INDEX idx_wallets_budget ON wallets(budget_id);
CREATE INDEX idx_transactions_proposal ON transactions(proposal_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
```

## 4. API Architecture

### RESTful API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

#### Budgets
- `GET /api/budgets` - List user's budgets
- `POST /api/budgets` - Create budget
- `GET /api/budgets/:id` - Get budget details
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Archive budget
- `GET /api/budgets/:id/dashboard` - Get budget dashboard data
- `GET /api/budgets/:id/health` - Get budget health metrics

#### Budget Categories
- `GET /api/budgets/:budgetId/categories` - List categories
- `POST /api/budgets/:budgetId/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

#### Budget Members
- `GET /api/budgets/:budgetId/members` - List members
- `POST /api/budgets/:budgetId/members` - Add member
- `PUT /api/budgets/:budgetId/members/:userId` - Update member role
- `DELETE /api/budgets/:budgetId/members/:userId` - Remove member

#### Spending Proposals
- `GET /api/proposals` - List user's proposals
- `GET /api/budgets/:budgetId/proposals` - List budget proposals
- `POST /api/proposals` - Create proposal
- `GET /api/proposals/:id` - Get proposal details
- `PUT /api/proposals/:id` - Update proposal
- `DELETE /api/proposals/:id` - Delete proposal (draft only)
- `POST /api/proposals/:id/submit` - Submit for approval
- `POST /api/proposals/:id/approve` - Approve proposal
- `POST /api/proposals/:id/reject` - Reject proposal
- `POST /api/proposals/:id/cancel` - Cancel proposal

#### Attachments
- `POST /api/proposals/:id/attachments` - Upload attachment
- `DELETE /api/attachments/:id` - Delete attachment
- `GET /api/attachments/:id` - Download attachment

#### Reports
- `GET /api/budgets/:id/reports/status` - Budget status report
- `GET /api/budgets/:id/reports/spending` - Spending analysis
- `GET /api/budgets/:id/reports/variance` - Variance report
- `GET /api/budgets/:id/reports/forecast` - Forecast report
- `POST /api/reports/export` - Export report (PDF/Excel)

#### Notifications
- `GET /api/notifications` - List notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

#### fystack.io Integration
- `POST /api/fystack/sync` - Manual sync with fystack.io
- `POST /api/fystack/webhook` - Webhook endpoint for fystack.io
- `GET /api/fystack/status/:proposalId` - Get payment status

### API Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2025-12-07T10:30:00Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "BUDGET_EXCEEDED",
    "message": "Insufficient budget available",
    "details": {
      "available": 1000,
      "requested": 1500
    }
  },
  "meta": {
    "timestamp": "2025-12-07T10:30:00Z"
  }
}
```

### Authentication

- JWT-based authentication
- Access token (short-lived, 15 minutes)
- Refresh token (long-lived, 7 days)
- Tokens stored in httpOnly cookies or Authorization header

## 5. Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Table/
│   ├── layout/
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── Footer/
│   ├── budgets/
│   │   ├── BudgetList/
│   │   ├── BudgetCard/
│   │   ├── BudgetForm/
│   │   └── BudgetDashboard/
│   ├── proposals/
│   │   ├── ProposalList/
│   │   ├── ProposalForm/
│   │   ├── ProposalCard/
│   │   └── ProposalApproval/
│   └── reports/
│       ├── StatusReport/
│       ├── SpendingChart/
│       └── VarianceReport/
├── pages/
│   ├── Dashboard.tsx
│   ├── BudgetDetails.tsx
│   ├── Proposals.tsx
│   ├── Reports.tsx
│   └── Settings.tsx
├── hooks/
│   ├── useBudgets.ts
│   ├── useProposals.ts
│   └── useAuth.ts
├── services/
│   ├── api.ts
│   ├── auth.ts
│   └── fystack.ts
├── store/
│   ├── budgets/
│   ├── proposals/
│   └── auth/
└── utils/
    ├── formatters.ts
    ├── validators.ts
    └── constants.ts
```

### State Management

**Global State (Redux/Zustand):**
- User authentication state
- Current budget context
- Notifications
- UI preferences

**Server State (React Query/SWR):**
- Budgets data
- Proposals data
- Reports data
- Automatic caching and revalidation

## 6. Security Considerations

### Authentication & Authorization
- Password hashing with bcrypt (cost factor 12+)
- JWT tokens with short expiry
- Role-based access control (RBAC)
- Row-level security for multi-user access

### Data Protection
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection
- CSRF tokens
- Rate limiting on API endpoints
- File upload validation (size, type)

### API Security
- HTTPS only
- CORS configuration
- API rate limiting
- Request size limits
- Authentication required for all endpoints (except login/register)

### Secrets Management
- Environment variables for sensitive config
- No secrets in code repository
- Rotate API keys regularly
- Separate credentials per environment

## 7. Integration Architecture

### fystack.io Integration

**Authentication Flow:**
1. Store fystack.io API credentials securely
2. OAuth 2.0 or API key authentication
3. Refresh tokens as needed

**Payment Creation Flow:**
```
Proposal Approved
    ↓
Validate proposal data
    ↓
Map to fystack.io format
    ↓
POST to fystack.io API
    ↓
Store transaction ID
    ↓
Poll for status / Wait for webhook
    ↓
Update proposal status
```

**Webhook Handler:**
- Receive payment status updates
- Verify webhook signature
- Update transaction status
- Send notifications to users
- Handle idempotency (duplicate webhooks)

**Error Handling:**
- Retry failed payments (exponential backoff)
- Alert admin on repeated failures
- Log all API interactions
- Provide manual retry option

## 8. Scalability & Performance

### Caching Strategy
- Redis for session storage
- API response caching (short TTL)
- Database query result caching
- CDN for static assets

### Database Optimization
- Proper indexing on foreign keys
- Materialized views for complex reports
- Connection pooling
- Read replicas for reporting queries

### Application Performance
- Lazy loading of components
- Pagination for large lists
- Debounced search inputs
- Optimistic UI updates
- Background job processing for heavy tasks

## 9. Deployment Architecture

### Development Environment
- Local PostgreSQL database
- Local Redis instance
- fystack.io sandbox/test API
- Mock email service

### Staging Environment
- Mirrors production setup
- Test integrations with fystack.io sandbox
- Used for UAT and testing

### Production Environment
- Load balancer (AWS ALB, Nginx)
- Auto-scaling application servers
- Managed PostgreSQL (RDS, Cloud SQL)
- Managed Redis (ElastiCache, Cloud Memorystore)
- CDN for static assets (CloudFront, Cloudflare)
- Monitoring and logging (DataDog, CloudWatch)

### CI/CD Pipeline
1. Code commit to Git
2. Automated tests run
3. Build Docker image
4. Deploy to staging
5. Run integration tests
6. Manual approval
7. Deploy to production
8. Health checks
9. Rollback on failure

## 10. Monitoring & Observability

### Application Metrics
- API response times
- Error rates by endpoint
- Active users
- Database query performance
- Cache hit rates

### Business Metrics
- Proposals created/approved per day
- Average approval time
- Budget utilization rates
- fystack.io integration success rate

### Logging
- Structured JSON logging
- Log levels (debug, info, warn, error)
- Request/response logging
- Audit trail for sensitive operations

### Alerting
- High error rates
- Slow API responses
- Database connection issues
- fystack.io integration failures
- Budget threshold breaches

## 11. Technology Decision Matrix

| Criteria | Next.js + Node.js | Django + React | Go + Vue |
|----------|-------------------|----------------|----------|
| Development Speed | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Performance | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Ecosystem | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Learning Curve | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Type Safety | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Community Support | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

**Recommended Stack:**
- **Frontend**: Next.js 14+ with TypeScript
- **Backend**: Node.js with TypeScript + Fastify
- **Database**: PostgreSQL 15+
- **Caching**: Redis 7+
- **Deployment**: Vercel (Frontend) + Railway/Render (Backend)
