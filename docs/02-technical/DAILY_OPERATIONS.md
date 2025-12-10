# Daily Operations & Activity Logging

## Overview

Transform Kubera from a planning tool into a **complete operational system** by adding daily logging and activity tracking. This creates a single source of truth for:

1. **Planning** → Budget + Operations Plan (what you intend to do)
2. **Execution** → Daily logs + Activities (what you're actually doing)
3. **Tracking** → Progress + KPIs (what you achieved)
4. **Learning** → Historical data (what worked and why)

## Why Daily Operations Matter

### Current Gap

**Without daily logging:**
```
Plan → [Black Box] → Results
```

You know what you planned and what you achieved, but not:
- What actually happened day-to-day?
- What challenges did you face?
- Why did things succeed or fail?
- Who did what and when?

**With daily logging:**
```
Plan → Daily Activities → Progress Updates → Results
  ↓          ↓                  ↓              ↓
Store everything in one place for future reference
```

### Benefits

✅ **Single source of truth** - Everything in one place

✅ **Historical context** - Understand why decisions were made

✅ **Team alignment** - Everyone sees what's happening

✅ **Learning** - Capture lessons and insights

✅ **Accountability** - Clear record of who did what

✅ **Transparency** - Stakeholders can follow progress

## Core Concepts

### 1. Activity Log (What happened)

Daily journal entries documenting:
- Work completed
- Meetings held
- Decisions made
- Blockers encountered
- Insights learned

### 2. Updates (Progress on operations)

Status updates on specific operations:
- Milestone completed
- KPI progress
- Budget spent
- Next steps

### 3. Notes (Context and details)

Supporting information:
- Meeting notes
- Research findings
- Ideas and brainstorming
- External links and resources

### 4. Timeline (Historical view)

Chronological feed showing everything:
- Activities
- Updates
- Budget proposals
- Approvals
- KPI changes

## Data Model

### activity_log table

```sql
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES budgets(id) ON DELETE CASCADE,

  -- What
  activity_type VARCHAR(50) NOT NULL, -- 'work', 'meeting', 'decision', 'blocker', 'insight', 'milestone'
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,

  -- Links to other entities
  operation_id UUID REFERENCES operations_plan(id), -- Optional: link to operation
  budget_category_id UUID REFERENCES budget_categories(id), -- Optional: link to budget
  proposal_id UUID REFERENCES spending_proposals(id), -- Optional: link to proposal

  -- Who & When
  author_id UUID REFERENCES users(id) NOT NULL,
  activity_date DATE NOT NULL, -- When activity happened (can be past/future)
  logged_at TIMESTAMP DEFAULT NOW(), -- When it was logged

  -- Visibility
  is_public BOOLEAN DEFAULT TRUE, -- Share with all workspace members

  -- Rich content
  attachments JSONB, -- Files, images, links
  tags TEXT[], -- ["marketing", "competition", "urgent"]

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### operation_updates table

```sql
CREATE TABLE operation_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_id UUID REFERENCES operations_plan(id) ON DELETE CASCADE,

  -- Update content
  update_type VARCHAR(50) NOT NULL, -- 'status', 'milestone', 'kpi', 'blocker', 'general'
  title VARCHAR(255) NOT NULL,
  description TEXT,

  -- Status change (if applicable)
  old_status VARCHAR(50),
  new_status VARCHAR(50),

  -- Who & When
  author_id UUID REFERENCES users(id) NOT NULL,
  update_date TIMESTAMP DEFAULT NOW(),

  -- Visibility
  is_highlight BOOLEAN DEFAULT FALSE, -- Important update

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### notes table

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES budgets(id) ON DELETE CASCADE,

  -- Note content
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL, -- Rich text/markdown
  note_type VARCHAR(50), -- 'meeting', 'research', 'idea', 'decision', 'general'

  -- Links
  operation_id UUID REFERENCES operations_plan(id),
  budget_category_id UUID REFERENCES budget_categories(id),

  -- Organization
  tags TEXT[],
  is_pinned BOOLEAN DEFAULT FALSE,

  -- Who & When
  author_id UUID REFERENCES users(id) NOT NULL,

  -- Collaboration
  shared_with_user_ids UUID[], -- Specific users who can see this note

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### kpi_updates table

```sql
CREATE TABLE kpi_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_kpi_id UUID REFERENCES operation_kpis(id) ON DELETE CASCADE,

  -- KPI change
  old_value DECIMAL(15, 2),
  new_value DECIMAL(15, 2),

  -- Context
  notes TEXT, -- Why did it change?
  evidence_url TEXT, -- Link to proof/data

  -- Who & When
  updated_by UUID REFERENCES users(id) NOT NULL,
  update_date TIMESTAMP DEFAULT NOW(),

  created_at TIMESTAMP DEFAULT NOW()
);
```

### comments table

```sql
-- Comments on activities, operations, proposals, etc.
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- What is being commented on
  entity_type VARCHAR(50) NOT NULL, -- 'activity', 'operation', 'proposal', 'note'
  entity_id UUID NOT NULL,

  -- Comment content
  content TEXT NOT NULL,

  -- Threading
  parent_comment_id UUID REFERENCES comments(id), -- For replies

  -- Who & When
  author_id UUID REFERENCES users(id) NOT NULL,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## UI/UX Design

### 1. Timeline View (Primary View)

```
┌─────────────────────────────────────────────────────────────────┐
│  Superteam VN 2025                    [Timeline ▼] [+ Log Activity]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Filters: [All Types ▼] [All People ▼] [All Operations ▼] [📅]│
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 📅 Today - December 7, 2025                            │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │                                                         │    │
│  │ 🎯 10:30 AM - Milestone Completed                      │    │
│  │    Climate Tech Competition - Applications Closed      │    │
│  │    ├─ 320 applications received (target: 300) ✅       │    │
│  │    ├─ By Fay                                           │    │
│  │    └─ Next: Screening phase starts tomorrow            │    │
│  │    💬 3 comments                                        │    │
│  │                                                         │    │
│  │ 💰 9:00 AM - Budget Proposal Approved                  │    │
│  │    $5,000 for hackathon venue                          │    │
│  │    ├─ Approved by Hieu                                 │    │
│  │    └─ Linked to: FS2 Global Hack Activation            │    │
│  │                                                         │    │
│  │ 📝 8:15 AM - Team Update                               │    │
│  │    Weekly standup notes                                │    │
│  │    ├─ By Linh                                          │    │
│  │    ├─ Discussed: Ambassador recruitment                │    │
│  │    └─ 📎 Meeting recording attached                    │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 📅 Yesterday - December 6, 2025                        │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │                                                         │    │
│  │ 🚧 4:30 PM - Blocker                                   │    │
│  │    Venue contract negotiation stalled                  │    │
│  │    ├─ By Sunny                                         │    │
│  │    ├─ Linked to: Demo Day operation                    │    │
│  │    └─ Action: Hieu to follow up with vendor            │    │
│  │    💬 5 comments                                        │    │
│  │                                                         │    │
│  │ 📊 2:00 PM - KPI Update                                │    │
│  │    Mentorship Program - 30-day retention               │    │
│  │    ├─ Updated: 65% → 72% (target: 70%) ✅            │    │
│  │    ├─ By Linh                                          │    │
│  │    └─ Note: New onboarding flow working well           │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  [Load More]                                                     │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Quick Log Modal

```
┌─────────────────────────────────────────────────────────┐
│  Log Activity                                      [✕]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Type: [⚡ Work ▼]  [Meeting, Decision, Blocker...]    │
│                                                          │
│  Title:                                                  │
│  ┌────────────────────────────────────────────────┐    │
│  │ Completed Climate Competition applications     │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Description:                                            │
│  ┌────────────────────────────────────────────────┐    │
│  │ Received 320 applications, 20 more than        │    │
│  │ target. Quality looks good based on initial    │    │
│  │ screening. Starting full review tomorrow.      │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Link to:                                                │
│  [🎯 Climate Tech Competition ▼]                        │
│                                                          │
│  Date: [Dec 7, 2025 ▼]                                  │
│                                                          │
│  Tags: [+ Add tags]                                      │
│  [competition] [milestone] [outreach]                    │
│                                                          │
│  Attachments: [📎 Upload]                               │
│                                                          │
│  [ ] Mark as highlight                                   │
│                                                          │
│  [Cancel]                            [Log Activity]      │
└─────────────────────────────────────────────────────────┘
```

### 3. Operation Detail View with Activity Feed

```
┌─────────────────────────────────────────────────────────────────┐
│  Climate Tech Competition 2025                    [Edit] [...]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Status: 🟡 In Progress        Owner: Fay        Budget: $15k   │
│                                                                  │
│  ┌─────────────────┬─────────────────┬─────────────────┐       │
│  │   Overview      │   Activity      │   KPIs          │       │
│  └─────────────────┴─────────────────┴─────────────────┘       │
│                                                                  │
│  Activity Feed                               [+ Log Update]     │
│  ────────────────────────────────────────────────────────       │
│                                                                  │
│  📅 Dec 7, 2025                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 🎯 Applications Closed - 320 received                  │    │
│  │ 10:30 AM by Fay                                        │    │
│  │                                                         │    │
│  │ Exceeded target by 20 applications. Quality looks      │    │
│  │ strong based on initial review. Mix of early-stage     │    │
│  │ and growth-stage climate tech startups.                │    │
│  │                                                         │    │
│  │ Next: Begin screening process tomorrow.                │    │
│  │                                                         │    │
│  │ 👍 3  💬 3 comments  🔗 Share                          │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  📅 Dec 1, 2025                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 📢 Competition Launched                                 │    │
│  │ 9:00 AM by Fay                                         │    │
│  │                                                         │    │
│  │ Announced on Twitter, LinkedIn, Discord. Email sent    │    │
│  │ to 1,200 community members. Press release published.   │    │
│  │                                                         │    │
│  │ Early traction: 50 applications in first 24 hours.     │    │
│  │                                                         │    │
│  │ 👍 5  💬 2 comments  📎 1 attachment                    │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  [Load Earlier Activity]                                        │
└─────────────────────────────────────────────────────────────────┘
```

### 4. Daily Standup View

Quick team updates format:

```
┌─────────────────────────────────────────────────────────┐
│  Team Standup - December 7, 2025                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  👤 Fay (BD & Events)                                   │
│  ✅ Yesterday:                                          │
│     • Closed Climate Competition applications (320)     │
│     • Venue contract for Demo Day finalized             │
│  🎯 Today:                                              │
│     • Start competition screening                       │
│     • Kickoff meeting with Smart City partners          │
│  🚧 Blockers: None                                      │
│  ───────────────────────────────────────────────────    │
│                                                          │
│  👤 Linh (Chief of Staff)                               │
│  ✅ Yesterday:                                          │
│     • Reviewed ambassador applications (15 total)       │
│     • Updated mentorship KPIs (72% retention!)          │
│  🎯 Today:                                              │
│     • Interview top 5 ambassador candidates             │
│     • Prepare Q2 budget report                          │
│  🚧 Blockers: Waiting on finance approval for interns   │
│  ───────────────────────────────────────────────────    │
│                                                          │
│  👤 Sunny (Events)                                      │
│  ✅ Yesterday:                                          │
│     • Demo day venue deposit paid                       │
│     • Created event timeline                            │
│  🎯 Today:                                              │
│     • Send speaker invitations                          │
│     • Design event materials                            │
│  🚧 Blockers: AV vendor hasn't confirmed availability   │
│                                                          │
│  [Add My Update]                                         │
└─────────────────────────────────────────────────────────┘
```

### 5. Search & Filter

```
┌─────────────────────────────────────────────────────────┐
│  🔍 Search activities, updates, notes...                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Filters:                                                │
│  ┌──────────────────────────────────────────────┐      │
│  │ Type:      [All ▼] [Activity, Update, Note] │      │
│  │ Author:    [All ▼] [Fay, Linh, Sunny, Hieu]│      │
│  │ Operation: [All ▼] [Competition, Mentorship]│      │
│  │ Tags:      [All ▼] [urgent, milestone...]   │      │
│  │ Date:      [Last 7 days ▼]                  │      │
│  └──────────────────────────────────────────────┘      │
│                                                          │
│  Results: 47 items                                       │
│                                                          │
│  [Sort by: Recent ▼]                                     │
│                                                          │
│  📝 Competition screening completed - Dec 6              │
│  🎯 Milestone: 320 applications received - Dec 7         │
│  💬 Meeting notes: Ambassador strategy - Dec 5           │
│  ...                                                     │
└─────────────────────────────────────────────────────────┘
```

## Use Cases & Workflows

### Use Case 1: Daily Work Log

**Scenario:** Fay closes competition applications

**Workflow:**
```
1. Fay clicks [+ Log Activity]
2. Selects type: "Milestone"
3. Title: "Applications Closed"
4. Links to: Climate Tech Competition
5. Description: "320 applications received..."
6. Clicks [Log Activity]
   ↓
System automatically:
   - Posts to timeline
   - Notifies operation owner (if different)
   - Updates operation activity feed
   - Makes searchable
```

### Use Case 2: Team Standup

**Scenario:** Daily team check-in

**Workflow:**
```
1. Each team member logs their standup
   - Yesterday's work
   - Today's plan
   - Blockers

2. Team can see everyone's updates in Timeline

3. Hieu (owner) reviews blockers and takes action
```

### Use Case 3: KPI Progress Update

**Scenario:** Linh sees mentorship retention improved

**Workflow:**
```
1. Linh goes to Mentorship Program operation
2. Clicks on "30-day retention" KPI
3. Updates: 65% → 72%
4. Adds note: "New onboarding flow working well"
5. Saves
   ↓
System automatically:
   - Creates KPI update record
   - Posts to timeline
   - Notifies operation owner
   - Shows in KPI history chart
```

### Use Case 4: Meeting Notes

**Scenario:** Strategy meeting about Q2 budget

**Workflow:**
```
1. Hieu creates new Note
2. Type: "Meeting"
3. Title: "Q2 Budget Strategy Meeting"
4. Content: (markdown/rich text)
   - Attendees: Hieu, Linh, Fay
   - Discussed reallocating $10k from X to Y
   - Decision: Approve reallocation
   - Action items: Linh to update budget
5. Links to: Q2 Budget workspace
6. Tags: [strategy, budget, q2]
7. Shares with: Linh, Fay
8. Saves
   ↓
Note is searchable and linked to budget
```

### Use Case 5: Blocker Tracking

**Scenario:** Venue contract stuck

**Workflow:**
```
1. Sunny logs blocker
   Type: "Blocker"
   Title: "Venue contract negotiation stalled"
   Description: "Waiting on vendor response for 3 days"
   Linked to: Demo Day operation
   Priority: High

2. System notifies operation owner (Hieu)

3. Hieu comments:
   "I'll follow up directly with vendor today"

4. Next day, Sunny updates:
   "✅ Resolved - Contract signed!"

5. Blocker marked resolved
```

## Integration Points

### 1. Activity → Budget

```
Activity: "Paid $5,000 venue deposit"
    ↓
Links to → Budget Proposal #123
    ↓
Updates → Budget spent: +$5,000
```

### 2. Activity → Operation

```
Activity: "Kickoff meeting completed"
    ↓
Links to → Climate Competition operation
    ↓
Shows in → Operation activity feed
```

### 3. Activity → KPI

```
Activity: "320 applications received"
    ↓
Triggers → KPI update (participants: 320)
    ↓
Shows in → KPI progress chart
```

### 4. Timeline Aggregation

Everything appears in unified timeline:
```
Timeline View:
  ├─ Activity logged by Fay
  ├─ Proposal approved by Hieu
  ├─ KPI updated by Linh
  ├─ Note created by Sunny
  └─ Comment added by Team Member
```

## Activity Types

### 1. Work Activities
- Task completed
- Deliverable submitted
- Research completed
- Content published

### 2. Meetings
- Team standup
- Strategy meeting
- Partner call
- Review session

### 3. Decisions
- Budget reallocation approved
- Operation cancelled
- Strategy pivot
- Vendor selected

### 4. Blockers
- Waiting on approval
- Technical issue
- Resource constraint
- External dependency

### 5. Insights
- Learning captured
- Pattern observed
- Recommendation
- Best practice documented

### 6. Milestones
- Phase completed
- Goal achieved
- Deadline met
- Launch executed

## Features

### 1. Rich Text Editor

Support for:
- **Markdown** formatting
- **@mentions** (tag team members)
- **#hashtags** (for easy tagging)
- **Links** to operations, budgets, proposals
- **Embedded images/videos**
- **Code blocks** (for technical notes)
- **Tables** and lists

### 2. Notifications

Get notified when:
- Someone @mentions you
- Comment on your activity
- Blocker assigned to you
- Operation you own gets updated
- KPI target achieved/missed

### 3. Digest & Summaries

**Daily Digest Email:**
```
Subject: Superteam VN - Daily Digest (Dec 7, 2025)

Today's Highlights:
  🎯 3 milestones completed
  💰 2 proposals approved
  🚧 1 new blocker

Recent Activity:
  • Climate Competition applications closed (320)
  • Venue deposit paid ($5,000)
  • Mentorship retention improved to 72%

Upcoming:
  • Competition screening starts tomorrow
  • Ambassador interviews scheduled

[View Full Timeline →]
```

**Weekly Summary:**
```
Subject: Weekly Summary - Week of Dec 1-7

This Week:
  ✅ Completed: 12 activities
  🎯 Milestones: 5 hit
  💰 Budget: $15,000 spent
  📊 KPIs: 4 updated

Top Performers:
  • Climate Competition: Exceeded target by 20
  • Mentorship: Retention up 7%

Blockers Resolved: 3
New Blockers: 1

[View Details →]
```

### 4. Templates

Quick templates for common activities:

**Standup Template:**
```
Yesterday:
  -

Today:
  -

Blockers:
  - None
```

**Meeting Notes Template:**
```
Meeting:
Date:
Attendees:

Agenda:
  1.
  2.

Discussion:

Decisions:
  -

Action Items:
  - [ ]
```

**Retrospective Template:**
```
Operation:
Date:

What went well:
  -

What could be improved:
  -

Action items for next time:
  -
```

### 5. Export & Backup

Export options:
- **Timeline export** → PDF, CSV
- **Operation history** → Full activity log
- **Meeting notes** → Markdown files
- **Backup workspace** → JSON dump

## Permissions

### Activity Visibility

```
Public Activities:
  - Visible to all workspace members
  - Appear in timeline
  - Searchable

Private Activities:
  - Only visible to author and mentioned users
  - Don't appear in public timeline
  - Searchable only by author

Operation-Linked Activities:
  - Inherit operation permissions
  - If user can view operation, can view activities
```

### Who Can Do What

```
Owner:
  ✅ View all activities
  ✅ Log activities
  ✅ Edit/delete any activity
  ✅ Comment on any activity

Admin:
  ✅ View all activities
  ✅ Log activities
  ✅ Edit their own activities
  ✅ Comment on any activity

Operation Owner:
  ✅ View activities linked to their operations
  ✅ Log activities for their operations
  ✅ Edit their own activities
  ✅ Comment on activities for their operations

Team Member:
  ✅ View public activities
  ✅ Log their own activities
  ✅ Edit their own activities
  ✅ Comment on activities they can see
```

## Implementation Phases

### Phase 1: Basic Activity Logging
- Create activity_log table
- Simple timeline view
- Basic activity types (work, meeting, blocker)
- Link to operations

### Phase 2: Rich Features
- Rich text editor
- @mentions and notifications
- Comments
- File attachments
- Search and filter

### Phase 3: Advanced Features
- KPI auto-update from activities
- Templates
- Daily/weekly digests
- Analytics dashboard
- Export functionality

### Phase 4: Collaboration
- Real-time updates
- Team standup view
- Activity reactions (👍, ❤️)
- Activity voting/prioritization

## Example: Complete Daily Workflow

```
Morning (9 AM):
  ├─ Hieu logs standup update
  ├─ Reviews timeline for overnight activity
  └─ Comments on blocker from Sunny

Midday (12 PM):
  ├─ Fay logs: "Applications closed - 320 received"
  ├─ System auto-updates KPI
  └─ Notification sent to operation stakeholders

Afternoon (3 PM):
  ├─ Linh logs KPI update: Retention 65% → 72%
  ├─ Creates note with insights on what worked
  └─ Tags Hieu for visibility

Evening (6 PM):
  ├─ Sunny logs blocker: "Vendor not responding"
  ├─ Hieu gets notification
  └─ Hieu comments: "I'll follow up tomorrow"

End of Day:
  └─ Everyone receives daily digest email
```

## Benefits Summary

✅ **Transparency** - Everyone sees what's happening

✅ **Context** - Historical record of why decisions were made

✅ **Accountability** - Clear ownership and tracking

✅ **Learning** - Capture insights and lessons

✅ **Efficiency** - No need for separate tools (Notion, Slack, etc.)

✅ **Single Source of Truth** - Everything in one place

---

**This transforms Kubera from a planning tool into a complete operational system where teams can:**
- Plan (Budget + Operations)
- Execute (Daily activities + Updates)
- Track (KPIs + Progress)
- Learn (Historical data + Insights)

**All in one place. All connected. All searchable. Forever.**

---

**Related Documents:**
- [OPERATIONS_PLAN.md](./OPERATIONS_PLAN.md) - Operations and KPI tracking
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [SPREADSHEET_WORKFLOW.md](./SPREADSHEET_WORKFLOW.md) - Budget UI/UX
