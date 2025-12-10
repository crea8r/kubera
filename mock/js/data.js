// Mock Data for Kubera App

const mockData = {
    user: {
        name: "Hieu Bui",
        email: "hieu@superteam.vn",
        role: "Owner"
    },

    // Active workspace pair index
    activeWorkspaceIndex: 0,

    // Multiple budget+operation pairs (planning cycles)
    workspaces: [
        {
            id: 1,
            name: "Superteam VN 2025",
            period: "Annual 2025",
            startDate: "2025-01-01",
            endDate: "2025-12-31",
            status: "active", // active, completed, archived
            totalBudget: 450800,
            spent: 125400,
            committed: 45000,
            createdAt: "2025-01-01"
        },
        {
            id: 2,
            name: "Superteam VN Q1 2024",
            period: "Q1 2024",
            startDate: "2024-01-01",
            endDate: "2024-03-31",
            status: "completed",
            totalBudget: 120000,
            spent: 115000,
            committed: 0,
            createdAt: "2024-01-01"
        }
    ],

    // Budget categories organized by workspace
    budgetCategoriesByWorkspace: {
        1: [ // Workspace ID 1
        {
            code: "P",
            name: "Personnel",
            allocated: 63800,
            spent: 15000,
            children: [
                { code: "P2", name: "Op team travel", detail: "Team trips", allocated: 38000, spent: 8000, linkedOperations: [1, 2] },
                { code: "P3", name: "Run 3 hubs", detail: "Community hubs", allocated: 25200, monthly: 2100, spent: 7000, pic: "Linh", linkedOperations: [2, 3] }
            ]
        },
        {
            code: "O",
            name: "Outreach",
            allocated: 65000,
            spent: 20000,
            children: [
                { code: "O1", name: "Startup Competition", detail: "2 competitions", allocated: 30000, pic: "Fay", spent: 15000, linkedOperations: [1] },
                { code: "O2", name: "Accelerator Program", detail: "2 cohorts", allocated: 20000, pic: "Hieu", spent: 5000, linkedOperations: [2] },
                { code: "O4", name: "Side events", detail: "3 major events", allocated: 15000, pic: "Sunny", spent: 0, linkedOperations: [1, 2] }
            ]
        },
        {
            code: "E",
            name: "Engage",
            allocated: 56100,
            spent: 15000,
            children: [
                { code: "E1", name: "Mentorship & Intern", detail: "Year-round", allocated: 26100, pic: "Linh", spent: 10000, linkedOperations: [2] },
                { code: "E4", name: "BD - Gov & Enterprise", detail: "Policy work", allocated: 30000, pic: "Fay", spent: 5000, linkedOperations: [1] }
            ]
        },
        {
            code: "F",
            name: "Funnel",
            allocated: 42000,
            spent: 5400,
            children: [
                { code: "FS2", name: "Global hack", detail: "2 hackathons", allocated: 12000, pic: "Sunny", spent: 5000, linkedOperations: [1] },
                { code: "FS3", name: "Investor night", detail: "4 events", allocated: 4000, pic: "Sunny", spent: 0, linkedOperations: [1] },
                { code: "FS4", name: "Demo day", detail: "2 demo days", allocated: 10000, pic: "Sunny", spent: 0, linkedOperations: [2] },
                { code: "FJ", name: "Job activation", detail: "Training", allocated: 16000, pic: "Linh", spent: 400, linkedOperations: [2] }
            ]
        }
        ],
        2: [ // Workspace ID 2 (Q1 2024 - completed)
            {
                code: "O",
                name: "Outreach",
                allocated: 50000,
                spent: 48000,
                children: [
                    { code: "O1", name: "Developer Meetups", detail: "5 events", allocated: 30000, pic: "Sunny", spent: 28000 },
                    { code: "O2", name: "Marketing Campaign", detail: "Social media", allocated: 20000, pic: "Fay", spent: 20000 }
                ]
            }
        ]
    },

    // Operations organized by workspace
    operationsByWorkspace: {
        1: [ // Workspace ID 1
        {
            id: 1,
            name: "Climate Tech Competition",
            code: "OP-O1-Q1",
            status: "at-risk",
            owner: "Fay",
            hypothesis: "Climate-focused competitions attract quality founders and generate viable projects",
            timeline: "Jan 15 - Mar 31, 2025",
            linkedBudgetLines: ["O1", "O4", "FS2", "FS3", "E4", "P2"], // Links to multiple budget lines
            kpis: [
                { name: "Participants", target: 300, actual: 320, status: "good" },
                { name: "Projects Submitted", target: 20, actual: 18, status: "warning" },
                { name: "Quality Projects", target: 10, actual: 4, status: "danger" }
            ]
        },
        {
            id: 2,
            name: "Ambassador Program",
            code: "OP-O3-YEAR",
            status: "on-track",
            owner: "Linh",
            hypothesis: "Bottom-up community leadership scales engagement and project creation",
            timeline: "Jan 1 - Dec 31, 2025",
            linkedBudgetLines: ["O2", "O4", "E1", "P2", "P3", "FS4", "FJ"], // Links to multiple budget lines
            kpis: [
                { name: "Active Ambassadors", target: 10, actual: 8, status: "good" },
                { name: "Events Hosted", target: 100, actual: 45, status: "warning" },
                { name: "New Projects", target: 40, actual: 18, status: "warning" }
            ]
        },
        {
            id: 3,
            name: "Discord Community Engagement",
            code: "OP-COMM-01",
            status: "on-track",
            owner: "Linh",
            hypothesis: "Daily engagement increases retention and organic project formation",
            timeline: "Ongoing",
            linkedBudgetLines: ["P3"], // Only links to hub running costs - minimal budget
            kpis: [
                { name: "Daily Active Users", target: 100, actual: 120, status: "good" },
                { name: "Messages per Day", target: 50, actual: 58, status: "good" },
                { name: "30-day Retention", target: 70, actual: 72, status: "good" }
            ]
        }
        ],
        2: [ // Workspace ID 2 (Q1 2024 - completed)
            {
                id: 4,
                name: "Developer Meetup Series",
                code: "OP-O1-Q1",
                status: "on-track",
                budget: 30000,
                budgetSpent: 28000,
                owner: "Sunny",
                hypothesis: "Regular developer meetups build community and attract talent",
                timeline: "Jan 1 - Mar 31, 2024",
                kpis: [
                    { name: "Attendees", target: 200, actual: 245, status: "good" },
                    { name: "Events Completed", target: 5, actual: 5, status: "good" }
                ]
            }
        ]
    },

    // Activities are workspace-specific
    activitiesByWorkspace: {
        1: [
        {
            id: 1,
            type: "milestone",
            title: "Climate Competition - Applications Closed",
            description: "Received 320 applications, exceeding target by 20. Quality looks strong.",
            author: "Fay",
            timestamp: "2 hours ago",
            operation: "Climate Tech Competition",
            likes: 3,
            comments: 3
        },
        {
            id: 2,
            type: "proposal",
            title: "Budget Proposal Approved",
            description: "$5,000 for hackathon venue - Approved by Hieu",
            author: "Sunny",
            timestamp: "3 hours ago",
            operation: "Global Hack Activation"
        },
        {
            id: 3,
            type: "kpi",
            title: "KPI Update - Mentorship retention improved",
            description: "30-day retention: 65% → 72% (Target: 70%)",
            author: "Linh",
            timestamp: "Yesterday",
            operation: "Mentorship Program"
        },
        {
            id: 4,
            type: "blocker",
            title: "Venue contract negotiation stalled",
            description: "Waiting on vendor response for 3 days. Hieu to follow up.",
            author: "Sunny",
            timestamp: "Yesterday",
            operation: "Demo Day",
            comments: 5
        }
        ],
        2: []
    },

    // Proposals are workspace-specific
    proposalsByWorkspace: {
        1: [
        {
            id: 127,
            amount: 2000,
            description: "$2,000 for event catering",
            category: "O4. Side events",
            submitter: "Sunny",
            status: "pending",
            timestamp: "2 hours ago"
        },
        {
            id: 126,
            amount: 1500,
            description: "$1,500 for marketing materials",
            category: "O1. Startup Competition",
            submitter: "Fay",
            status: "pending",
            timestamp: "5 hours ago"
        },
        {
            id: 125,
            amount: 5000,
            description: "$5,000 for hackathon venue",
            category: "FS2. Global hack",
            submitter: "Sunny",
            status: "approved",
            timestamp: "Yesterday"
        },
        {
            id: 124,
            amount: 3000,
            description: "$3,000 for prize pool",
            category: "O1. Startup Competition",
            submitter: "Fay",
            status: "approved",
            timestamp: "2 days ago"
        },
        {
            id: 123,
            amount: 800,
            description: "$800 for design tools subscription",
            category: "P6. Tools & legal",
            submitter: "Linh",
            status: "rejected",
            timestamp: "3 days ago"
        }
        ],
        2: []
    }
};

// Helper functions to get current workspace data
function getCurrentWorkspace() {
    return mockData.workspaces[mockData.activeWorkspaceIndex];
}

function getCurrentBudgetCategories() {
    const workspace = getCurrentWorkspace();
    return mockData.budgetCategoriesByWorkspace[workspace.id] || [];
}

function getCurrentOperations() {
    const workspace = getCurrentWorkspace();
    return mockData.operationsByWorkspace[workspace.id] || [];
}

function getCurrentActivities() {
    const workspace = getCurrentWorkspace();
    return mockData.activitiesByWorkspace[workspace.id] || [];
}

function getCurrentProposals() {
    const workspace = getCurrentWorkspace();
    return mockData.proposalsByWorkspace[workspace.id] || [];
}

// Get operation by ID
function getOperationById(id) {
    const operations = getCurrentOperations();
    return operations.find(op => op.id === id);
}

// Get budget line by code
function getBudgetLineByCode(code) {
    const categories = getCurrentBudgetCategories();
    for (const category of categories) {
        if (category.children) {
            const found = category.children.find(child => child.code === code);
            if (found) return found;
        }
    }
    return null;
}

// Calculate total budget for an operation
function calculateOperationBudget(operation) {
    if (!operation.linkedBudgetLines || operation.linkedBudgetLines.length === 0) {
        return 0;
    }
    let total = 0;
    operation.linkedBudgetLines.forEach(code => {
        const budgetLine = getBudgetLineByCode(code);
        if (budgetLine) {
            total += budgetLine.allocated;
        }
    });
    return total;
}

// Calculate spent for an operation
function calculateOperationSpent(operation) {
    if (!operation.linkedBudgetLines || operation.linkedBudgetLines.length === 0) {
        return 0;
    }
    let total = 0;
    operation.linkedBudgetLines.forEach(code => {
        const budgetLine = getBudgetLineByCode(code);
        if (budgetLine) {
            total += (budgetLine.spent || 0);
        }
    });
    return total;
}
