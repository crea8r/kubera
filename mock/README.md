# Kubera MVP - Interactive Mock

This is a **fully interactive HTML/CSS/JavaScript mock** of the Kubera MVP. It runs entirely in your browser without needing any backend or database.

## 🔑 Key Concept: Budget & Operation Relationships

### Many-to-Many Linking Model

**Budget Lines ↔ Operations** are linked through a many-to-many relationship:

- **Each budget line (or category)** → Links to **at least ONE operation hypothesis**
  - Example: "O1. Startup Competition" budget supports "Climate Tech Competition" operation

- **Each operation hypothesis** → May link to **ZERO or more budget lines**
  - Some operations need budget from multiple lines
  - Some operations require NO budget (e.g., Discord Community Engagement)

### Planning Cycles

Each workspace contains **multiple planning cycles** over time:
- **Only ONE cycle is active** at any time (marked with 🟢)
- **Multiple cycles over time** for different periods (Q1, Q2, Annual, etc.)
- Each cycle is self-contained with its own budget categories, operations, activities, and proposals

## 🚀 How to Run

### Option 1: Simple File Open

1. Navigate to the `mock` folder
2. Double-click `login.html` to start from the login page
3. OR double-click `index.html` to go directly to the dashboard
4. It will open in your default browser

### Option 2: Local Server (Recommended)

```bash
# Navigate to the mock folder
cd mock

# If you have Python 3
python3 -m http.server 8000

# If you have Python 2
python -m SimpleHTTPServer 8000

# If you have Node.js
npx http-server

# If you have PHP
php -S localhost:8000
```

Then open:
- `http://localhost:8000/login.html` - Start from login page
- `http://localhost:8000` or `http://localhost:8000/index.html` - Go directly to dashboard

## 🎯 What You Can Do

### Login (login.html)
- **Email:** hieu@superteam.vn
- **Password:** password (or anything)
- Click "Sign In" to redirect to dashboard

### Switch Workspace Pairs
- Use dropdown in header to switch between:
  - 🟢 **Superteam VN 2025** (Annual 2025) - Active
  - ✅ **Superteam VN Q1 2024** (Q1 2024) - Completed
- Data updates automatically when you switch

### Create New Budget & Operation Pair
- Click **"+ New Budget & Operation Pair"** in header
- Fill in:
  - Planning cycle info (name, period, dates, budget)
  - Primary operation hypothesis
  - Key Performance Indicators (add multiple)
- Creates a complete planning cycle from scratch

### Dashboard
- See budget overview (total, spent, committed, available)
- See operations status (active, on track, at risk)
- View recent activity feed
- See pending approvals

### Budget View
- Spreadsheet-style table with hierarchical categories
- See all budget lines (P, O, E, F structure)
- View spent vs allocated amounts
- See PIC (Person in Charge) for each item
- **NEW:** See which operations are linked to each budget line
  - Hover over operation tags to see hypothesis
  - Purple tags show linked operations (e.g., OP-O1-Q1)

### Operations View
- See 3 sample operations with different budget requirements:
  1. **Climate Tech Competition** (At Risk ⚠️)
     - Links to 6 budget lines: O1, O4, FS2, FS3, E4, P2
     - Total budget calculated from linked lines
  2. **Ambassador Program** (On Track ✅)
     - Links to 7 budget lines: O2, O4, E1, P2, P3, FS4, FJ
     - Shows budget distribution across categories
  3. **Discord Community Engagement** (On Track ✅)
     - Links to only P3 (minimal budget)
     - Demonstrates low/no-budget operations
- Each operation shows:
  - **Linked Budget Lines** - Blue tags showing which budget items fund this operation
  - Hypothesis statement
  - KPIs with progress bars
  - Total budget (calculated from all linked lines)
  - Budget spent vs allocated
  - Status indicator

### Timeline View
- Activity feed showing all recent activities
- Different types: Milestones, Proposals, KPI Updates, Blockers
- Grouped by day
- Shows who did what and when

### Proposals View
- List of spending proposals
- Filter by status (Pending, Approved, Rejected)
- Approve/Reject pending proposals (demo only)

### Modals & Forms
- **"+ New Budget"** - Create new budget categories/items
  - Select hierarchy (category, subcategory, line item)
  - **Link to operations** - Select which operations this budget supports
  - Note: Budget lines should link to at least one operation

- **"+ Add Operation"** - Create operations with hypothesis
  - Define hypothesis using structured format
  - **Link to budget lines** - Select which budget items fund this (optional)
  - Add multiple KPIs with targets
  - Some operations may require zero budget

- **"+ Create Proposal"** - Submit spending proposals
- **"+ Log Activity"** - Log daily activities and milestones
- **"+ New Budget & Operation Pair"** - Create complete planning cycle from scratch
- All forms are fully interactive with demo submissions

## 📁 File Structure

```
mock/
├── login.html          # Login page
├── index.html          # Dashboard/Main app
├── css/
│   └── style.css       # All styles
├── js/
│   ├── data.js         # Mock data
│   └── app.js          # Application logic
└── README.md           # This file
```

## 🎨 Features Demonstrated

### ✅ Planning Layer
- [x] Budget with hierarchical categories
- [x] Operations with KPIs
- [x] Hypothesis tracking

### ✅ Execution Layer
- [x] Activity logging
- [x] Spending proposals
- [x] Approval workflow

### ✅ Tracking Layer
- [x] Timeline/feed view
- [x] KPI progress visualization
- [x] Budget vs spent tracking

### ✅ UI/UX
- [x] Spreadsheet-style budget table
- [x] Card-based operations view
- [x] Activity timeline
- [x] Modal forms
- [x] Responsive design (mobile-friendly)

## 🎭 Mock Data

The mock includes realistic data showing budget-operation relationships:

**Budget Categories with Linked Operations:**
- P. Personnel ($63,800)
  - P2. Op team travel → Links to Operations 1 & 2
  - P3. Run 3 hubs → Links to Operations 2 & 3
- O. Outreach ($65,000)
  - O1. Startup Competition → Links to Operation 1
  - O2. Accelerator Program → Links to Operation 2
  - O4. Side events → Links to Operations 1 & 2
- E. Engage ($56,100)
  - E1. Mentorship & Intern → Links to Operation 2
  - E4. BD - Gov & Enterprise → Links to Operation 1
- F. Funnel ($42,000)
  - FS2. Global hack → Links to Operation 1
  - FS3. Investor night → Links to Operation 1
  - FS4. Demo day → Links to Operation 2
  - FJ. Job activation → Links to Operation 2

**Operations with Budget Line Links:**
1. **Climate Tech Competition** (OP-O1-Q1)
   - Links to: O1, O4, FS2, FS3, E4, P2
   - Total budget: Sum of all linked lines
   - Demonstrates operation using multiple budget sources

2. **Ambassador Program** (OP-O3-YEAR)
   - Links to: O2, O4, E1, P2, P3, FS4, FJ
   - Broader operation spanning many categories

3. **Discord Community Engagement** (OP-COMM-01)
   - Links to: P3 only
   - Demonstrates minimal-budget operation

**Activities:**
- Milestone: Applications closed (320)
- Proposal: $5k venue approved
- KPI Update: Retention 65% → 72%
- Blocker: Venue contract stalled

**Proposals:**
- 5 proposals in different states (pending, approved, rejected)

## 🔄 Interactive Elements

### What Works:
- ✅ Login (any email/password) from login.html
- ✅ **Switch Between Workspace Pairs** - Dropdown selector with status indicators
- ✅ **Create New Budget & Operation Pair** - Complete flow from scratch
- ✅ Navigation between views
- ✅ View all budget items (per workspace pair)
- ✅ View all operations with KPIs (per workspace pair)
- ✅ View activity timeline (per workspace pair)
- ✅ View proposals (per workspace pair)
- ✅ **Create Budget Item** - Full form with category hierarchy
- ✅ **Create Operation** - With hypothesis and multiple KPIs
- ✅ **Create Proposal** - Submit spending requests
- ✅ **Log Activity** - Track daily work
- ✅ Submit forms (shows confirmation)
- ✅ Approve/Reject proposals (shows confirmation)
- ✅ Add/Remove multiple KPIs dynamically

### What's Mock:
- Data is hardcoded (not saved)
- No actual database
- No real authentication
- No API calls
- Form submissions just show alerts

## 🎯 Use This To:

1. **Validate UX** - Click through and see if the flow makes sense
2. **Show Stakeholders** - Share with team to get feedback
3. **Reference for Development** - Use as visual reference when building the real app
4. **Test Ideas** - Modify the HTML/CSS to try different layouts

## 🔧 Customization

### Change Mock Data
Edit `js/data.js` to modify:
- Budget categories and amounts
- Operations and KPIs
- Activities
- Proposals

### Change Styling
Edit `css/style.css` to modify:
- Colors (currently purple theme: #667eea)
- Fonts
- Layout
- Component styles

### Add Functionality
Edit `js/app.js` to add:
- New views
- More interactivity
- Additional features

## 📱 Responsive Design

The mock is mobile-responsive. Try resizing your browser window or opening on a phone to see the mobile layout.

## 🎨 Color Scheme

- **Primary:** #667eea (Purple)
- **Success:** #10b981 (Green)
- **Warning:** #f59e0b (Orange)
- **Danger:** #ef4444 (Red)
- **Gray:** #f5f7fa (Background)

## 💡 Tips

1. **Test on Different Browsers:**
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers

2. **Show to Team:**
   - Get feedback on layout
   - Validate workflow
   - Identify missing features

3. **Take Screenshots:**
   - Document the UI
   - Use in presentations
   - Share with developers

4. **Iterate:**
   - This is meant to be modified
   - Try different layouts
   - Test new ideas

## 🚀 Next Steps

After validating the mock:

1. **Gather Feedback** from team and stakeholders
2. **Update Documentation** based on feedback
3. **Start Development** using this as visual reference
4. **Build Real Backend** with database
5. **Implement Authentication** with real users
6. **Add fystack.io Integration** for payments

## ⚠️ Important Notes

- This is a **mock/prototype**, not production code
- No data is saved (everything resets on refresh)
- No security features (for demo only)
- Not optimized for performance
- Use for **visualization and validation** only

## 📚 Related Documentation

- [MVP_MOCKUP.md](../docs/03-planning/MVP_MOCKUP.md) - Text-based mockups
- [ARCHITECTURE.md](../docs/02-technical/ARCHITECTURE.md) - Technical architecture
- [REQUIREMENTS.md](../docs/01-overview/REQUIREMENTS.md) - Full requirements

---

**Enjoy exploring the Kubera MVP mock! 🎉**

*This mock demonstrates the complete system: Budget + Operations + Daily Logging in a single interface.*
