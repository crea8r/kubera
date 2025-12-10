# Spreadsheet-Style Budget Management

## Overview

Based on the current budgeting workflow using Google Sheets, this document outlines how to translate familiar spreadsheet features into a more structured, database-backed application while maintaining the intuitive spreadsheet UI/UX.

## Current Workflow Analysis

### Budget Structure (from sample.csv)

**Hierarchical Organization:**
```
Annual Budget: $450,800
├─ P. Personnel ($287,700)
│  ├─ P1. Op team salary ($223,900)
│  │  ├─ Team Lead - Hieu: $100,000/year ($8,333/month)
│  │  ├─ Chief of Staff - Linh: $60,000/year ($5,000/month)
│  │  ├─ BD - Fay: $32,400/year ($2,700/month)
│  │  └─ Event - Sunny: $31,500/year ($2,625/month)
│  ├─ P2. Op team travel: $38,000
│  ├─ P3. Run 3 hubs: $25,200 ($2,100/month)
│  ├─ P4. Merchandize: $3,000
│  ├─ P5. Content production: $12,000
│  ├─ P6. Tools & legal: $4,800 ($400/month)
│  └─ P7. Padding: $6,000 ($500/month)
├─ O. Outreach ($65,000)
│  ├─ O1. Startup Competition: $30,000
│  ├─ O2. Accelerator Program: $20,000
│  ├─ O3. Ambassador Program: $72,000 ($6,000/month) - Paid by Fndn
│  └─ O4. Side events: $15,000
├─ E. Engage ($56,100)
│  ├─ E1. Mentorship: $26,100
│  ├─ E2. Get-together events: $18,000 ($1,500/month) - Paid by Fndn
│  ├─ E3. Community training: $12,000 ($1,000/month) - Paid by Fndn
│  └─ E4. BD Gov & Enterprise: $30,000
└─ F. Funnel ($42,000)
   ├─ F1. Mini hackathon: $15,000 - Paid by Fndn
   ├─ FS2. Global hack: $12,000
   ├─ FS3. Investor night: $4,000
   ├─ FS4. Demo day: $10,000
   └─ FJ. Job activation: $16,000
```

### Key Characteristics

#### 1. Multi-Level Categorization
- **Level 1**: Major categories (P, O, E, F)
- **Level 2**: Sub-categories with codes (P1, P2, O1, O2, etc.)
- **Level 3**: Individual line items (Team Lead, BD, Events, etc.)

#### 2. Multiple Currencies
- **USDC**: Primary currency
- **SOL**: Secondary currency
- Both annual and monthly amounts tracked

#### 3. Rich Metadata per Line Item
- **Detail**: Description of the budget item
- **Impact**: Expected outcomes, metrics, KPIs
- **Annual Amount**: Total for the year
- **Monthly Amount**: Recurring monthly cost
- **PIC**: Person in Charge (owner/responsible person)
- **Funding Source**: Some items marked "Paid by Fndn (grant/bounty)"

#### 4. Impact Tracking
Examples from the sheet:
- "300+ participant each"
- "=15k GDP from prize"
- "100 mentor-mentee pair"
- "=3*4*12=144 meet-up events"

#### 5. External Funding Sources
- Some items funded by Foundation (grant)
- Some items funded by Foundation (bounty)
- Need to distinguish internal vs external budget

---

## Spreadsheet-Like UI Requirements

### 1. Grid/Table View (Primary View)

**Layout similar to Google Sheets:**
```
┌──────────┬────────────────┬──────────┬──────────┬──────────┬──────────┬─────────┐
│ Category │ Detail         │ Impact   │ Annual   │ Monthly  │ Currency│ PIC     │
│          │                │          │ USDC/SOL │ USDC/SOL │         │         │
├──────────┼────────────────┼──────────┼──────────┼──────────┼─────────┼─────────┤
│ ▼ P. Personnel                                   │ $287,700 │         │         │
│   ▼ P1. Op team salary                           │ $223,900 │         │         │
│     └─ Team Lead - Hieu   │ ...      │ $100,000 │ $8,333   │ USDC    │ Hieu    │
│     └─ Chief of Staff     │ ...      │ $60,000  │ $5,000   │ USDC    │ Linh    │
│   ▼ P2. Op team travel    │ Unit...  │ $38,000  │          │ USDC    │         │
│ ▼ O. Outreach                                    │ $65,000  │         │         │
│   └─ O1. Competition      │ 300+...  │ $30,000  │          │ USDC    │ Fay     │
└──────────┴────────────────┴──────────┴──────────┴──────────┴─────────┴─────────┘
```

**Features:**
- **Expandable/Collapsible rows** (tree structure)
- **Inline editing** (click to edit cells)
- **Drag-and-drop reordering**
- **Color coding** by category or status
- **Frozen headers** when scrolling
- **Summation rows** (auto-calculate totals)
- **Filter and sort** columns

### 2. Cell-Level Editing

**Inline Editing:**
- Click cell to edit
- Tab to move to next cell
- Enter to save and move down
- ESC to cancel

**Cell Types:**
- Text cells (Detail, Impact)
- Number cells (Amount) with currency formatting
- Dropdown cells (PIC, Currency, Category)
- Multi-line text cells (Impact/notes)

**Validation:**
- Required fields highlighted
- Format validation (currency, numbers)
- Real-time error messages

### 3. Spreadsheet-Like Formulas (Future)

**Auto-calculation:**
```
Annual = Monthly × 12
Category Total = SUM(child items)
Remaining = Allocated - Spent - Committed
```

**Impact formulas** (from your sheet):
```
"=15k GDP from prize"
"=20 startups"
"3*4*12=144 meet-up events"
```

### 4. Keyboard Shortcuts

Essential shortcuts for power users:
- **Arrow keys**: Navigate cells
- **Ctrl/Cmd + C/V**: Copy/paste
- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Enter**: Quick save
- **Delete**: Clear cell
- **F2**: Edit mode
- **Tab**: Next cell
- **Shift + Tab**: Previous cell

### 5. Bulk Operations

**Multi-select:**
- Click and drag to select range
- Shift + click for range select
- Ctrl/Cmd + click for non-contiguous select

**Bulk actions:**
- Copy/paste multiple cells
- Bulk edit (change PIC for multiple items)
- Bulk delete
- Bulk move to different category

### 6. Visual Features

**Color Coding:**
- Different colors for major categories (P, O, E, F)
- Conditional formatting (over budget = red, under budget = green)
- Highlight changed cells
- Mark items "Paid by Fndn" with distinct color/badge

**Visual Hierarchy:**
- Indentation for subcategories
- Bold for category headers
- Different font sizes
- Expand/collapse icons

**Progress Indicators:**
- Progress bars for budget utilization
- Sparklines for spending trends
- Status icons (pending, approved, spent)

---

## Database Schema for Spreadsheet Model

### Enhanced budget_categories table

```sql
CREATE TABLE budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  code VARCHAR(10), -- 'P1', 'O2', 'E3', etc.
  name VARCHAR(255) NOT NULL,
  parent_category_id UUID REFERENCES budget_categories(id),
  level INTEGER DEFAULT 1, -- 1 = top level (P, O, E, F), 2 = subcategory (P1, P2), 3 = line item
  order_index INTEGER DEFAULT 0, -- for sorting/ordering
  allocated_amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USDC', -- USDC, SOL, USD, etc.
  monthly_amount DECIMAL(15, 2), -- for recurring items
  frequency VARCHAR(20), -- 'monthly', 'quarterly', 'one-time'
  detail TEXT, -- description
  impact TEXT, -- expected outcomes, KPIs
  funding_source VARCHAR(50), -- 'internal', 'foundation_grant', 'foundation_bounty'
  pic_user_id UUID REFERENCES users(id), -- Person in Charge
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Multi-currency support

```sql
CREATE TABLE budget_currencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  currency_code VARCHAR(10) NOT NULL, -- 'USDC', 'SOL', 'USD'
  is_primary BOOLEAN DEFAULT FALSE,
  exchange_rate DECIMAL(18, 8), -- rate to primary currency if not primary
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Budget amounts per currency

```sql
CREATE TABLE budget_category_amounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_category_id UUID REFERENCES budget_categories(id) ON DELETE CASCADE,
  currency_code VARCHAR(10) NOT NULL,
  annual_amount DECIMAL(15, 2),
  monthly_amount DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(budget_category_id, currency_code)
);
```

---

## UI Components Breakdown

### 1. Budget Grid Component

**React Component Structure:**
```typescript
<BudgetGrid>
  <BudgetGridHeader />
  <BudgetGridBody>
    {categories.map(category => (
      <BudgetRow
        key={category.id}
        category={category}
        level={category.level}
        isExpanded={expandedRows.includes(category.id)}
        onToggle={() => toggleRow(category.id)}
        onEdit={(field, value) => handleEdit(category.id, field, value)}
      >
        {category.children?.map(child => (
          <BudgetRow ... /> // Recursive
        ))}
      </BudgetRow>
    ))}
  </BudgetGridBody>
  <BudgetGridFooter>
    <TotalRow />
  </BudgetGridFooter>
</BudgetGrid>
```

**Features:**
- Virtual scrolling for large datasets
- Optimistic updates (instant UI feedback)
- Real-time validation
- Auto-save on blur

### 2. Editable Cell Component

```typescript
<EditableCell
  type="text" | "number" | "currency" | "dropdown" | "textarea"
  value={cellValue}
  onChange={handleChange}
  onSave={handleSave}
  validation={validationRules}
  format={currencyFormat}
/>
```

**States:**
- Read mode (default)
- Edit mode (on click)
- Saving (spinner)
- Error (validation failed)

### 3. Category Row Component

```typescript
<CategoryRow
  category={category}
  level={level}
  isExpanded={isExpanded}
  indent={level * 20} // px
>
  <ToggleIcon />
  <CategoryCode>{category.code}</CategoryCode>
  <CategoryName editable>{category.name}</CategoryName>
  <DetailCell editable>{category.detail}</DetailCell>
  <ImpactCell editable>{category.impact}</ImpactCell>
  <AmountCell editable currency={currency}>
    {category.allocated_amount}
  </AmountCell>
  <PICCell editable type="user-select">
    {category.pic_user}
  </PICCell>
  <ActionsMenu />
</CategoryRow>
```

### 4. Contextual Right-Click Menu

**Actions:**
- Add subcategory
- Add line item
- Edit
- Delete
- Duplicate
- Move up/down
- Change PIC
- Mark as external funding
- Export to Excel

### 5. Budget Summary Panel (Sidebar)

```
┌─────────────────────────────┐
│   Budget Summary            │
├─────────────────────────────┤
│ Total Budget: $450,800      │
│   └─ USDC: $450,800         │
│   └─ SOL: $0                │
│                             │
│ By Category:                │
│   P. Personnel: $287,700    │
│   O. Outreach: $65,000      │
│   E. Engage: $56,100        │
│   F. Funnel: $42,000        │
│                             │
│ Funding Sources:            │
│   Internal: $378,800        │
│   Foundation: $72,000       │
│                             │
│ Monthly Recurring: $X       │
│ One-time: $Y                │
└─────────────────────────────┘
```

---

## Key Features to Support Spreadsheet Workflow

### 1. Import from CSV/Excel

**Import flow:**
1. Upload CSV/Excel file
2. Map columns to fields
3. Preview imported data
4. Validate and fix errors
5. Import to database

**Column mapping:**
```
CSV Column → Database Field
"Detail" → budget_categories.detail
"Impact" → budget_categories.impact
"Annual USDC" → budget_category_amounts.annual_amount
"Monthly USDC" → budget_category_amounts.monthly_amount
"PIC" → budget_categories.pic_user_id
```

### 2. Export to CSV/Excel

**Export options:**
- Current view (filtered/sorted)
- Full budget
- Selected categories only
- Include/exclude subcategories
- Format: CSV, Excel, Google Sheets

**Preserve formatting:**
- Indentation for hierarchy
- Color coding
- Formulas (if possible)
- Comments/notes

### 3. Collaborative Editing

**Similar to Google Sheets:**
- See who's viewing (avatars in top-right)
- See who's editing which cell (colored cursor)
- Real-time updates when others edit
- Conflict resolution (last save wins or merge)
- Comment/discussion threads on cells

**Cell-level comments:**
```
Cell: "Team Lead - Hieu"
Comments:
  - Linh: "Should we increase this to $110k?"
  - Hieu: "Let's discuss in next planning meeting"
```

### 4. Version History

**Like Google Sheets "Version History":**
- Auto-save every change
- Named versions ("Q1 Budget Final", "After Board Review")
- Restore previous version
- Compare versions (diff view)
- See who changed what and when

### 5. Templates

**Pre-built templates:**
- "Annual Budget Template"
- "Project Budget Template"
- "Department Budget Template"
- Custom templates from previous budgets

**Template variables:**
```
Template: Annual Department Budget
Variables:
  - Department Name
  - Year
  - Total Amount
  - Team Size

Applied:
  "Engineering 2025" → Department Name = "Engineering", Year = 2025
```

---

## Implementation Recommendations

### Phase 1: Basic Spreadsheet View

**MVP features:**
- Grid view with collapsible categories
- Inline editing of key fields (name, amount, detail, PIC)
- Add/edit/delete categories and line items
- Basic totals and summaries
- Single currency (USDC)

### Phase 2: Enhanced Spreadsheet Features

**Additional features:**
- Multi-currency support
- Import from CSV/Excel
- Export to CSV/Excel
- Bulk operations
- Keyboard shortcuts
- Undo/redo

### Phase 3: Collaboration

**Collaborative features:**
- Real-time editing
- Comments on cells
- User presence indicators
- Version history
- Change notifications

### Phase 4: Advanced Features

**Power user features:**
- Custom formulas
- Conditional formatting
- Advanced filters and views
- Templates
- Macros/automations

---

## UI/UX Principles

### 1. Familiarity
- Look and feel similar to Google Sheets
- Use familiar terminology
- Preserve muscle memory (keyboard shortcuts)

### 2. Progressive Disclosure
- Start simple (grid view)
- Advanced features in menus/modals
- Tooltips for new features

### 3. Performance
- Instant feedback (optimistic updates)
- Fast scrolling (virtual rendering)
- Background saving (no "Save" button needed)

### 4. Flexibility
- Support both keyboard and mouse workflows
- Multiple ways to do the same thing
- Customizable views and layouts

### 5. Error Prevention
- Validation before save
- Confirmation for destructive actions
- Undo/redo for mistakes

---

## Technology Recommendations

### Frontend

**Option 1: AG Grid (Recommended)**
- Enterprise-grade data grid
- Excel-like editing
- Tree data support
- Keyboard navigation
- Virtual scrolling
- Free community edition available

**Option 2: Handsontable**
- Excel-like spreadsheet
- Formula support
- Copy/paste from Excel
- Commercial license required

**Option 3: Custom with React Table + Custom Cells**
- Full control
- More development effort
- Use `@tanstack/react-table` for base

### Libraries

```json
{
  "ag-grid-react": "^31.0.0", // Grid component
  "ag-grid-enterprise": "^31.0.0", // Advanced features
  "xlsx": "^0.18.5", // Excel import/export
  "papaparse": "^5.4.1", // CSV parsing
  "react-beautiful-dnd": "^13.1.1", // Drag and drop
  "react-hotkeys-hook": "^4.4.1", // Keyboard shortcuts
  "numeral": "^2.0.6" // Number formatting
}
```

---

## Example: Current vs New Workflow

### Current Workflow (Google Sheets)

```
1. Open Google Sheet
2. Find row for "Team Lead - Hieu"
3. Click cell, edit amount
4. Hit Enter
5. Sheet auto-saves
6. Share with team via Google Sheets sharing
```

### New Workflow (Budget App)

```
1. Open budget "Superteam VN 2025"
2. Expand "P. Personnel" → "P1. Op team salary"
3. Click "Team Lead - Hieu" amount cell
4. Edit amount
5. Tab to next cell or Enter to save
6. Auto-saved to database
7. Team sees update in real-time
8. Proposal system enforces approval for changes >$X
```

### Value Add

**Beyond spreadsheet:**
- ✅ Enforced approval workflow
- ✅ Audit trail (who changed what when)
- ✅ Integration with fystack.io for payments
- ✅ Role-based permissions
- ✅ Automated reporting
- ✅ Budget vs actual tracking
- ✅ Alerts and notifications

**While keeping:**
- ✅ Familiar spreadsheet UI
- ✅ Quick inline editing
- ✅ Hierarchical structure
- ✅ Easy navigation

---

## Next Steps

1. **Validate** this approach with stakeholders
2. **Design** wireframes/mockups of grid view
3. **Prototype** with AG Grid or similar
4. **Test** with actual budget data
5. **Iterate** based on feedback

---

**Related Documents:**
- [REQUIREMENTS.md](./REQUIREMENTS.md) - Overall requirements
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [EXAMPLES.md](./EXAMPLES.md) - Usage examples
