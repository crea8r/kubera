# Kubera Budget Management Tool - Documentation Hub

> **Your one-stop guide** to understanding, planning, and building the Kubera budget management system.

---

## 📖 Documentation Structure

The documentation is organized into **3 main sections** for easy navigation:

```text
docs/
├── README.md                    ← You are here (START HERE!)
├── 01-overview/                 ← What we're building
├── 02-technical/                ← How to build it
└── 03-planning/                 ← When and how to execute
```

---

## 🚀 Quick Start

### New to the Project

**Read these in order:**

1. **[Overview Section](#-01-overview)** → Understand requirements and permissions
2. **[Technical Section](#-02-technical)** → Learn the architecture
3. **[Planning Section](#-03-planning)** → See the roadmap

### Ready to Build

**Jump straight to:**

- [Technical Architecture](./02-technical/ARCHITECTURE.md)
- [Spreadsheet Workflow](./02-technical/SPREADSHEET_WORKFLOW.md)
- [User Stories](./03-planning/USER_STORIES.md)

### Need Examples

**Check out:**

- [Real-world Examples](./03-planning/EXAMPLES.md)
- [Sample Budget CSV](./samples/sample.csv) *(confidential - not in git)*

---

## 📂 01. Overview

> **What we're building and who can do what**

### [REQUIREMENTS.md](./01-overview/REQUIREMENTS.md)

#### Complete project requirements specification

📄 **What's inside:**

- Project overview and goals
- 6 user roles (Owner, Admin, Proposer, Approver, Viewer, Custom)
- Core features specification
  - Budget creation and management
  - Spending proposal workflow
  - Approval system
  - fystack.io integration
  - Reporting and analytics
- Data model
- Success metrics

**📊 Size:** ~14KB | **⏱️ Read time:** 20 minutes

**👥 Who should read:** Everyone on the team

---

### [PERMISSIONS.md](./01-overview/PERMISSIONS.md)

#### Detailed permission system and access control

📄 **What's inside:**

- Workspace model (1 workspace = 1 budget)
- Detailed role specifications
- Fine-grained budget line-level permissions
- Permission matrix
- User management rules
- Database implementation
- Security enforcement
- Real-world use cases

**📊 Size:** ~13KB | **⏱️ Read time:** 15 minutes

**👥 Who should read:** Developers, Security team, Product managers

**🔑 Key Concepts:**

- `view: [budget_line_id]` - Control visibility
- `propose: [budget_line_id]` - Control who can submit proposals
- `approve: [budget_line_id]` - Control who can approve

---

## 🔧 02. Technical

> **How to build it - architecture and implementation details**

### [ARCHITECTURE.md](./02-technical/ARCHITECTURE.md)

#### Technical architecture and technology stack

📄 **What's inside:**

- System architecture diagram
- Technology stack recommendations
  - Frontend: Next.js + TypeScript
  - Backend: Node.js + Fastify
  - Database: PostgreSQL
- Complete database schema
- API endpoint specifications
- Security considerations
- Integration architecture (fystack.io)
- Scalability and deployment

**📊 Size:** ~19KB | **⏱️ Read time:** 25 minutes

**👥 Who should read:** Developers, DevOps, Tech leads

**💡 Quick Reference:**

- Database schema: Lines 100-290
- API endpoints: Lines 290-380
- Security: Lines 450+

---

### [SPREADSHEET_WORKFLOW.md](./02-technical/SPREADSHEET_WORKFLOW.md)

#### Spreadsheet-style UI and workflow

📄 **What's inside:**

- Analysis of current Google Sheets workflow
- Spreadsheet-like UI requirements
- Grid/table view specifications
- Inline editing, keyboard shortcuts
- Multi-currency support
- Import/export features
- Collaborative editing
- Technology recommendations (AG Grid)

**📊 Size:** ~17KB | **⏱️ Read time:** 20 minutes

**👥 Who should read:** Frontend developers, UX designers, Product managers

**🎯 Key Features:**

- Hierarchical budget structure (P, O, E, F categories)
- Multi-currency (USDC, SOL)
- Impact tracking per line item
- PIC (Person in Charge) assignment
- External funding source tracking

---

### [OPERATIONS_PLAN.md](./02-technical/OPERATIONS_PLAN.md)

#### Operations plan and KPI tracking integration

📄 **What's inside:**

- Operations Plan concept (what you achieve vs what you spend)
- Budget ↔ Operations relationship models
- KPI tracking and hypothesis testing
- Database schema for operations, KPIs, and milestones
- Zero-budget operations tracking
- Two-panel UI design (Budget + Operations)
- Workflow examples and integration points

**📊 Size:** ~24KB | **⏱️ Read time:** 25 minutes

**👥 Who should read:** Everyone (critical for understanding the complete system)

**💡 Key Insight:**

- **Budget** = Input (resources/money you spend)
- **Operations** = Output (results/KPIs you achieve)
- Many-to-many relationship: some ops need budget, some don't
- Track hypotheses and measure what works

---

### [DAILY_OPERATIONS.md](./02-technical/DAILY_OPERATIONS.md)

#### Daily activity logging and single source of truth

📄 **What's inside:**

- Daily activity log (work, meetings, decisions, blockers, insights)
- Timeline/feed view of all activities
- Link activities to operations and budget
- Notes and updates tracking
- Team standup format
- Search and filtering
- Complete historical record

**📊 Size:** ~28KB | **⏱️ Read time:** 30 minutes

**👥 Who should read:** Everyone (makes this your single source of truth)

**💡 Key Value:**

- **Single Source of Truth** - Everything in one place
- Plan (Budget + Operations) + Execute (Daily logs) + Track (KPIs)
- Complete audit trail of who did what and when
- Learn from history - capture insights and context

---

## 📅 03. Planning

> **When and how to execute - roadmap and stories**

### [USER_STORIES.md](./03-planning/USER_STORIES.md)

#### User stories organized by role

📄 **What's inside:**

- Stories for Budget Owners/Admins
- Stories for Team Members (Proposers)
- Stories for Approvers and Viewers
- System/integration stories
- Priority labels (P0, P1, P2)

**📊 Size:** ~7KB | **⏱️ Read time:** 10 minutes

**👥 Who should read:** Product managers, Developers, QA

**🏷️ Priorities:**

- **P0:** Must-have for MVP
- **P1:** Should-have post-MVP
- **P2:** Nice-to-have future features

---

### [PROJECT_PHASES.md](./03-planning/PROJECT_PHASES.md)

#### 6-phase implementation roadmap

📄 **What's inside:**

- **Phase 0:** Foundation & Setup (2-3 weeks)
- **Phase 1:** MVP - Core Budget Management (6-8 weeks)
- **Phase 2:** Enhanced Features & fystack.io (6-8 weeks)
- **Phase 3:** Advanced Budget Management (6-8 weeks)
- **Phase 4:** Analytics & Intelligence (8-10 weeks)
- **Phase 5:** Enterprise Features (10-12 weeks)
- **Phase 6:** Mobile Apps (12-16 weeks) - Optional
- Success metrics per phase
- Risk mitigation

**📊 Size:** ~13KB | **⏱️ Read time:** 15 minutes

**👥 Who should read:** Project managers, Stakeholders, Tech leads

**⏰ MVP Timeline:** 8-11 weeks (Phase 0 + Phase 1)

---

### [EXAMPLES.md](./03-planning/EXAMPLES.md)

#### Real-world examples and use cases

📄 **What's inside:**

- 16 detailed scenarios
- Budget setup examples
- Permission configurations
- Approval workflows
- Reporting examples
- fystack.io integration examples
- API usage examples
- Edge case handling

**📊 Size:** ~19KB | **⏱️ Read time:** 25 minutes

**👥 Who should read:** Everyone (great for understanding practical usage)

**💡 Use cases covered:**

- Small team quarterly budget
- Marketing campaign budget
- Cross-functional project
- Permission scenarios
- Payment flows
- Reconciliation

---

### [MVP_MOCKUP.md](./03-planning/MVP_MOCKUP.md)

#### Interactive mockup of the MVP application

📄 **What's inside:**

- 9 detailed screen mockups (Login, Dashboard, Budget, Operations, Timeline, etc.)
- Complete user flows with examples
- Spreadsheet-style budget view
- Operations plan interface
- Activity feed/timeline
- Proposal creation and approval workflow
- MVP feature checklist

**📊 Size:** ~35KB | **⏱️ Read time:** 30 minutes

**👥 Who should read:** Everyone (visualize the final product)

**💡 Value:**

- See what the MVP will look like before building
- Understand user flows and interactions
- Validate UX with stakeholders
- Reference for developers during implementation

---

## 🎯 Reading Paths

### For Product Managers / Stakeholders

```text
1. START → README.md (this file)
2. REQUIREMENTS.md → Understand what we're building
3. USER_STORIES.md → See user perspective
4. PROJECT_PHASES.md → Understand timeline
5. EXAMPLES.md → See it in action
```

**⏱️ Total time:** ~1.5 hours

---

### For Developers / Engineers

```text
1. START → README.md (this file)
2. REQUIREMENTS.md → Understand the problem
3. PERMISSIONS.md → Understand access control (CRITICAL!)
4. ARCHITECTURE.md → Understand technical solution
5. SPREADSHEET_WORKFLOW.md → Understand UI/UX approach
6. EXAMPLES.md → See implementation examples
```

**⏱️ Total time:** ~2 hours

---

### For UX/UI Designers

```text
1. START → README.md (this file)
2. REQUIREMENTS.md → Understand features
3. PERMISSIONS.md → Understand user roles
4. SPREADSHEET_WORKFLOW.md → Understand UI requirements
5. EXAMPLES.md → See real workflows
6. USER_STORIES.md → Understand user needs
```

**⏱️ Total time:** ~1.5 hours

---

### For Project Managers

```text
1. START → README.md (this file)
2. PROJECT_PHASES.md → Understand roadmap
3. USER_STORIES.md → Plan sprints
4. REQUIREMENTS.md → Validate scope
5. EXAMPLES.md → Set expectations
```

**⏱️ Total time:** ~1.5 hours

---

## 🎓 Key Concepts at a Glance

### Workspace Model

```text
1 Workspace = 1 Budget
├── Name, Start/End Date
├── Multiple Budget Lines (Categories)
├── Multiple Wallets (USDC, SOL, etc.)
└── Team Members with Roles
```

### User Roles

| Role | Transfer Owner | Update Settings | Manage Users | Propose | Approve | View Reports |
|------|---------------|-----------------|--------------|---------|---------|--------------|
| Owner | ✅ | ✅ | ✅ All | ✅ | ✅ | ✅ |
| Admin | ❌ | ❌ | ✅ Limited | ✅ | ✅ | ✅ |
| Proposer | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Approver | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Viewer | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### Budget Structure (from sample)

```text
Total: $450,800
├─ P. Personnel: $287,700
│  ├─ P1. Op team salary: $223,900
│  ├─ P2. Op team travel: $38,000
│  └─ ... (7 subcategories)
├─ O. Outreach: $65,000
│  ├─ O1. Startup Competition: $30,000
│  └─ ... (4 subcategories)
├─ E. Engage: $56,100
│  └─ ... (4 subcategories)
└─ F. Funnel: $42,000
   └─ ... (5 subcategories)
```

### Spending Workflow

```text
1. Proposer submits proposal
   ↓
2. Proposal goes to Approver
   ↓
3. Approver approves/rejects
   ↓
4. If approved → fystack.io payment
   ↓
5. Transaction syncs back
   ↓
6. Budget updated automatically
```

---

## 🛠️ Technology Stack (Recommended)

### Frontend

- **Framework:** Next.js 14+ with TypeScript
- **Grid Component:** AG Grid (for spreadsheet-like UI)
- **State Management:** React Query (server state)
- **Styling:** TailwindCSS

### Backend

- **Runtime:** Node.js with TypeScript
- **Framework:** Fastify
- **Database:** PostgreSQL 15+
- **Caching:** Redis 7+

### Integration

- **Payments:** fystack.io API
- **Email:** SendGrid
- **File Storage:** AWS S3

See [ARCHITECTURE.md](./02-technical/ARCHITECTURE.md) for detailed comparisons and alternatives.

---

## 📈 MVP Definition

**Timeline:** 8-11 weeks (Phase 0 + Phase 1)

**Features included:**

- ✅ User authentication (Owner, Admin, Proposer, Approver, Viewer)
- ✅ Budget creation with hierarchical categories
- ✅ Team member assignment with role-based permissions
- ✅ Spending proposal submission
- ✅ Approval workflow
- ✅ Email notifications
- ✅ Budget dashboard with key metrics
- ✅ Basic spreadsheet-like grid view
- ✅ Single currency support (USDC)

**Not in MVP (Phase 2+):**

- fystack.io integration (Phase 2)
- Multi-currency support (Phase 2)
- Advanced reporting (Phase 3-4)
- Mobile apps (Phase 6)

---

## 🔐 Confidential Files

These files are excluded from version control (see `.gitignore`):

```text
docs/samples/          ← Your current budget data
*.csv                  ← Any CSV files
```

**⚠️ Important:** Never commit actual budget data to the repository.

---

## 📝 Document Maintenance

**Keep documents updated:**

- ✅ Version in git alongside code
- ✅ Update when requirements change
- ✅ Review regularly with stakeholders
- ✅ Reference during development

**Last Updated:** December 7, 2025

**Status:** Requirements & Planning Phase

**Next Phase:** Technical Setup & MVP Development

---

## 🤔 Questions

If you have questions about:

**Requirements & Features:**

- Review [REQUIREMENTS.md](./01-overview/REQUIREMENTS.md)
- Check [EXAMPLES.md](./03-planning/EXAMPLES.md)

**Technical Implementation:**

- Review [ARCHITECTURE.md](./02-technical/ARCHITECTURE.md)
- Check [SPREADSHEET_WORKFLOW.md](./02-technical/SPREADSHEET_WORKFLOW.md)

**Timeline & Planning:**

- Review [PROJECT_PHASES.md](./03-planning/PROJECT_PHASES.md)
- Check [USER_STORIES.md](./03-planning/USER_STORIES.md)

**Permissions & Access Control:**

- Review [PERMISSIONS.md](./01-overview/PERMISSIONS.md)

---

## 🎯 Next Steps

**Right now (Planning Phase):**

1. ✅ Review all documentation
2. ✅ Gather stakeholder feedback
3. ✅ Validate requirements
4. ⏳ Finalize scope and priorities

**Coming up (Development Phase):**

1. Choose technology stack
2. Set up development environment
3. Design database schema
4. Create wireframes/mockups
5. Start Phase 0: Foundation

---

## 📚 Additional Resources

**Visual Reference:**

- [permission.png](./permission.png) - Original permission diagram

**Sample Data:**

- [samples/sample.csv](./samples/sample.csv) - Current budget structure *(confidential)*

---

**Happy Building! 🚀**

*For more information or to contribute, please contact the project team.*
