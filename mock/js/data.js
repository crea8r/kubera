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
            name: "Superteam Vietnam (Demo)",
            period: "Annual 2025",
            startDate: "2025-01-01",
            endDate: "2025-12-31",
            status: "active", // active, completed, archived
            totalBudget: 380000,
            spent: 95000,
            committed: 42000,
            createdAt: "2025-01-01"
        },
        {
            id: 2,
            name: "CloudFlow SaaS",
            period: "2025 Operations",
            startDate: "2025-01-01",
            endDate: "2025-12-31",
            status: "active",
            totalBudget: 850000,
            spent: 245000,
            committed: 125000,
            createdAt: "2025-01-01"
        },
        {
            id: 3,
            name: "DeFiX Protocol",
            period: "Token Launch 2025",
            startDate: "2025-01-01",
            endDate: "2025-12-31",
            status: "active",
            totalBudget: 2500000,
            spent: 680000,
            committed: 420000,
            createdAt: "2025-01-01"
        }
    ],

    // Budget categories organized by workspace
    budgetCategoriesByWorkspace: {
        1: [ // Workspace ID 1 - Superteam Vietnam (Demo data, not real numbers)
        {
            code: "P",
            name: "Personnel",
            allocated: 52000,
            spent: 12000,
            children: [
                { code: "P1", name: "Team Operations", detail: "Core team", allocated: 28000, spent: 7000, linkedOperations: [1, 2] },
                { code: "P2", name: "Community Hubs", detail: "3 locations", allocated: 24000, monthly: 2000, spent: 5000, pic: "Minh", linkedOperations: [2, 3] }
            ]
        },
        {
            code: "O",
            name: "Outreach",
            allocated: 78000,
            spent: 22000,
            children: [
                { code: "O1", name: "Builder Competitions", detail: "3 events", allocated: 35000, pic: "Lan", spent: 12000, linkedOperations: [1] },
                { code: "O2", name: "Developer Workshops", detail: "Monthly series", allocated: 28000, pic: "Tuan", spent: 8000, linkedOperations: [2] },
                { code: "O3", name: "Community Events", detail: "Quarterly", allocated: 15000, pic: "Hai", spent: 2000, linkedOperations: [1, 2] }
            ]
        },
        {
            code: "E",
            name: "Engage",
            allocated: 64000,
            spent: 18000,
            children: [
                { code: "E1", name: "Mentorship Program", detail: "Year-round", allocated: 32000, pic: "Linh", spent: 11000, linkedOperations: [2] },
                { code: "E2", name: "Partnership Development", detail: "Ecosystem growth", allocated: 32000, pic: "Hoa", spent: 7000, linkedOperations: [1, 3] }
            ]
        },
        {
            code: "F",
            name: "Funnel & Growth",
            allocated: 48000,
            spent: 8000,
            children: [
                { code: "F1", name: "Hackathons", detail: "3 major events", allocated: 20000, pic: "Nam", spent: 5000, linkedOperations: [1] },
                { code: "F2", name: "Demo Days", detail: "Quarterly", allocated: 18000, pic: "Nga", spent: 2000, linkedOperations: [2] },
                { code: "F3", name: "Talent Pipeline", detail: "Training & placement", allocated: 10000, pic: "Duc", spent: 1000, linkedOperations: [2, 3] }
            ]
        }
        ],
        2: [ // Workspace ID 2 - CloudFlow SaaS
            {
                code: "RD",
                name: "Research & Development",
                allocated: 380000,
                spent: 105000,
                children: [
                    { code: "RD1", name: "Engineering Team", detail: "8 developers", allocated: 280000, monthly: 23333, pic: "Alex Chen", spent: 75000, linkedOperations: [4, 5] },
                    { code: "RD2", name: "Product Design", detail: "2 designers", allocated: 60000, monthly: 5000, pic: "Sarah Kim", spent: 18000, linkedOperations: [4] },
                    { code: "RD3", name: "Infrastructure", detail: "AWS, tools", allocated: 40000, monthly: 3333, pic: "DevOps", spent: 12000, linkedOperations: [4, 5] }
                ]
            },
            {
                code: "SM",
                name: "Sales & Marketing",
                allocated: 220000,
                spent: 68000,
                children: [
                    { code: "SM1", name: "Marketing Team", detail: "3 marketers", allocated: 90000, monthly: 7500, pic: "Emma Davis", spent: 28000, linkedOperations: [6] },
                    { code: "SM2", name: "Sales Team", detail: "2 sales reps", allocated: 80000, monthly: 6667, pic: "Mike Johnson", spent: 25000, linkedOperations: [6] },
                    { code: "SM3", name: "Ad Spend", detail: "Google, LinkedIn", allocated: 50000, pic: "Emma Davis", spent: 15000, linkedOperations: [6] }
                ]
            },
            {
                code: "CS",
                name: "Customer Success",
                allocated: 120000,
                spent: 35000,
                children: [
                    { code: "CS1", name: "Support Team", detail: "3 support staff", allocated: 90000, monthly: 7500, pic: "Lisa Wong", spent: 28000, linkedOperations: [7] },
                    { code: "CS2", name: "Onboarding", detail: "Tools & resources", allocated: 30000, pic: "Lisa Wong", spent: 7000, linkedOperations: [7] }
                ]
            },
            {
                code: "OPS",
                name: "Operations",
                allocated: 130000,
                spent: 37000,
                children: [
                    { code: "OPS1", name: "General Admin", detail: "Office, legal", allocated: 60000, pic: "Admin", spent: 18000 },
                    { code: "OPS2", name: "Tools & Software", detail: "SaaS subscriptions", allocated: 40000, pic: "IT", spent: 12000 },
                    { code: "OPS3", name: "Hiring & Recruiting", detail: "Talent acquisition", allocated: 30000, pic: "HR", spent: 7000 }
                ]
            }
        ],
        3: [ // Workspace ID 3 - DeFiX Protocol (Token Sale Startup)
            {
                code: "DEV",
                name: "Protocol Development",
                allocated: 950000,
                spent: 265000,
                children: [
                    { code: "DEV1", name: "Core Protocol Team", detail: "12 blockchain devs", allocated: 600000, monthly: 50000, pic: "Viktor Petrov", spent: 175000, linkedOperations: [8, 9] },
                    { code: "DEV2", name: "Smart Contract Audits", detail: "3 audits", allocated: 180000, pic: "Security", spent: 60000, linkedOperations: [8] },
                    { code: "DEV3", name: "Infrastructure", detail: "Nodes, RPC, indexing", allocated: 120000, pic: "DevOps", spent: 22000, linkedOperations: [8, 9] },
                    { code: "DEV4", name: "Research", detail: "Cryptography, MEV", allocated: 50000, pic: "Research Team", spent: 8000, linkedOperations: [9] }
                ]
            },
            {
                code: "TKN",
                name: "Tokenomics & Treasury",
                allocated: 580000,
                spent: 145000,
                children: [
                    { code: "TKN1", name: "Liquidity Provision", detail: "DEX liquidity", allocated: 400000, pic: "Treasury", spent: 100000, linkedOperations: [10] },
                    { code: "TKN2", name: "Market Making", detail: "MM agreements", allocated: 120000, pic: "Finance", spent: 35000, linkedOperations: [10] },
                    { code: "TKN3", name: "Token Economics", detail: "Modeling & analysis", allocated: 60000, pic: "Econ Team", spent: 10000, linkedOperations: [10] }
                ]
            },
            {
                code: "GTM",
                name: "Go-to-Market",
                allocated: 420000,
                spent: 128000,
                children: [
                    { code: "GTM1", name: "Marketing & PR", detail: "Content, campaigns", allocated: 180000, pic: "Maria Santos", spent: 65000, linkedOperations: [11] },
                    { code: "GTM2", name: "Community Growth", detail: "Ambassadors, mods", allocated: 120000, pic: "Community", spent: 38000, linkedOperations: [11] },
                    { code: "GTM3", name: "Partnerships", detail: "Protocol integrations", allocated: 80000, pic: "BD Team", spent: 18000, linkedOperations: [11] },
                    { code: "GTM4", name: "Events & Conferences", detail: "Sponsorships", allocated: 40000, pic: "Events", spent: 7000, linkedOperations: [11] }
                ]
            },
            {
                code: "OPS",
                name: "Operations & Legal",
                allocated: 320000,
                spent: 88000,
                children: [
                    { code: "OPS1", name: "Legal & Compliance", detail: "Counsel, entity setup", allocated: 150000, pic: "Legal", spent: 45000 },
                    { code: "OPS2", name: "Trading Operations", detail: "Fee collection system", allocated: 80000, pic: "Trading Ops", spent: 22000, linkedOperations: [12] },
                    { code: "OPS3", name: "Finance & Accounting", detail: "CFO, bookkeeping", allocated: 60000, pic: "Finance", spent: 16000 },
                    { code: "OPS4", name: "General Admin", detail: "Tools, insurance", allocated: 30000, pic: "Admin", spent: 5000 }
                ]
            },
            {
                code: "REV",
                name: "Revenue Streams",
                allocated: 230000,
                spent: 54000,
                children: [
                    { code: "REV1", name: "Trading Fee Infrastructure", detail: "Fee capture & routing", allocated: 120000, pic: "Protocol Eng", spent: 32000, linkedOperations: [12] },
                    { code: "REV2", name: "Revenue Analytics", detail: "Dashboards, tracking", allocated: 60000, pic: "Data Team", spent: 15000, linkedOperations: [12] },
                    { code: "REV3", name: "Treasury Management", detail: "Yield strategies", allocated: 50000, pic: "Treasury", spent: 7000 }
                ]
            }
        ]
    },

    // Operations organized by workspace
    operationsByWorkspace: {
        1: [ // Workspace ID 1 - Superteam Vietnam
        {
            id: 1,
            name: "Web3 Builder Sprint",
            code: "OP-O1-Q1",
            status: "on-track",
            owner: "Lan",
            hypothesis: "Structured builder programs with mentorship produce high-quality projects",
            timeline: "Jan 15 - Apr 30, 2025",
            linkedBudgetLines: ["O1", "O3", "F1"],
            kpis: [
                { name: "Participants", target: 250, actual: 185, status: "good" },
                { name: "Projects Completed", target: 25, actual: 12, status: "warning" },
                { name: "Projects Funded", target: 8, actual: 3, status: "warning" }
            ]
        },
        {
            id: 2,
            name: "Developer Education Track",
            code: "OP-E1-YEAR",
            status: "on-track",
            owner: "Tuan",
            hypothesis: "Consistent education programs build sustainable developer pipeline",
            timeline: "Jan 1 - Dec 31, 2025",
            linkedBudgetLines: ["O2", "E1", "P1", "P2", "F2", "F3"],
            kpis: [
                { name: "Workshop Participants", target: 500, actual: 280, status: "good" },
                { name: "Course Completions", target: 150, actual: 65, status: "warning" },
                { name: "Placed in Jobs", target: 30, actual: 12, status: "good" }
            ]
        },
        {
            id: 3,
            name: "Ecosystem Partnerships",
            code: "OP-E2-YEAR",
            status: "on-track",
            owner: "Hoa",
            hypothesis: "Strategic partnerships unlock resources and opportunities for builders",
            timeline: "Ongoing",
            linkedBudgetLines: ["E2", "P2"],
            kpis: [
                { name: "Active Partners", target: 15, actual: 18, status: "good" },
                { name: "Co-hosted Events", target: 12, actual: 8, status: "good" },
                { name: "Partner Funding Secured", target: 80000, actual: 45000, status: "warning" }
            ]
        }
        ],
        2: [ // Workspace ID 2 - CloudFlow SaaS
            {
                id: 4,
                name: "Product V2 Launch",
                code: "OP-RD-V2",
                status: "on-track",
                owner: "Alex Chen",
                hypothesis: "Enhanced features and UX improvements will increase conversion and reduce churn",
                timeline: "Jan 1 - Jun 30, 2025",
                linkedBudgetLines: ["RD1", "RD2", "RD3"],
                kpis: [
                    { name: "Feature Completion", target: 100, actual: 65, status: "good" },
                    { name: "Beta Users", target: 50, actual: 42, status: "good" },
                    { name: "User Satisfaction", target: 85, actual: 88, status: "good" }
                ]
            },
            {
                id: 5,
                name: "Platform Scalability",
                code: "OP-RD-SCALE",
                status: "on-track",
                owner: "DevOps Team",
                hypothesis: "Infrastructure improvements support 10x user growth without performance degradation",
                timeline: "Q1-Q2 2025",
                linkedBudgetLines: ["RD1", "RD3"],
                kpis: [
                    { name: "Response Time (ms)", target: 200, actual: 185, status: "good" },
                    { name: "Uptime %", target: 99.9, actual: 99.95, status: "good" },
                    { name: "Concurrent Users", target: 5000, actual: 3200, status: "good" }
                ]
            },
            {
                id: 6,
                name: "Customer Acquisition",
                code: "OP-SM-ACQ",
                status: "at-risk",
                owner: "Emma Davis",
                hypothesis: "Multi-channel marketing drives qualified leads and shortens sales cycle",
                timeline: "Q1-Q4 2025",
                linkedBudgetLines: ["SM1", "SM2", "SM3"],
                kpis: [
                    { name: "MQLs per Month", target: 200, actual: 125, status: "warning" },
                    { name: "Trial Signups", target: 100, actual: 68, status: "warning" },
                    { name: "Paid Conversions", target: 25, actual: 12, status: "danger" }
                ]
            },
            {
                id: 7,
                name: "Customer Retention",
                code: "OP-CS-RET",
                status: "on-track",
                owner: "Lisa Wong",
                hypothesis: "Proactive support and onboarding reduces churn below 5% monthly",
                timeline: "Ongoing",
                linkedBudgetLines: ["CS1", "CS2"],
                kpis: [
                    { name: "Monthly Churn %", target: 5, actual: 4.2, status: "good" },
                    { name: "NPS Score", target: 50, actual: 58, status: "good" },
                    { name: "Support Response Time (hrs)", target: 4, actual: 2.5, status: "good" }
                ]
            }
        ],
        3: [ // Workspace ID 3 - DeFiX Protocol
            {
                id: 8,
                name: "Mainnet Launch",
                code: "OP-DEV-MAIN",
                status: "on-track",
                owner: "Viktor Petrov",
                hypothesis: "Secure, audited protocol launch establishes market credibility and attracts TVL",
                timeline: "Jan 1 - May 31, 2025",
                linkedBudgetLines: ["DEV1", "DEV2", "DEV3"],
                kpis: [
                    { name: "Smart Contracts Audited", target: 8, actual: 6, status: "good" },
                    { name: "Critical Bugs", target: 0, actual: 0, status: "good" },
                    { name: "Testnet TVL ($M)", target: 5, actual: 3.8, status: "good" }
                ]
            },
            {
                id: 9,
                name: "Protocol Innovation",
                code: "OP-DEV-INNOV",
                status: "on-track",
                owner: "Research Team",
                hypothesis: "Novel MEV protection and gas optimization differentiate protocol in market",
                timeline: "Q1-Q3 2025",
                linkedBudgetLines: ["DEV1", "DEV3", "DEV4"],
                kpis: [
                    { name: "Research Papers Published", target: 3, actual: 1, status: "good" },
                    { name: "Gas Savings %", target: 30, actual: 22, status: "warning" },
                    { name: "MEV Protection Rate %", target: 80, actual: 65, status: "warning" }
                ]
            },
            {
                id: 10,
                name: "Token Launch & Liquidity",
                code: "OP-TKN-LAUNCH",
                status: "on-track",
                owner: "Finance Team",
                hypothesis: "Strategic token launch with deep liquidity drives price discovery and market confidence",
                timeline: "Apr 1 - Jun 30, 2025",
                linkedBudgetLines: ["TKN1", "TKN2", "TKN3"],
                kpis: [
                    { name: "DEX Liquidity ($M)", target: 10, actual: 4.5, status: "good" },
                    { name: "Token Holders", target: 5000, actual: 2800, status: "good" },
                    { name: "24h Volume ($M)", target: 2, actual: 0.8, status: "warning" }
                ]
            },
            {
                id: 11,
                name: "Community & Ecosystem Growth",
                code: "OP-GTM-COMM",
                status: "on-track",
                owner: "Maria Santos",
                hypothesis: "Strong community engagement and partnerships drive protocol adoption",
                timeline: "Ongoing",
                linkedBudgetLines: ["GTM1", "GTM2", "GTM3", "GTM4"],
                kpis: [
                    { name: "Discord Members", target: 50000, actual: 32000, status: "good" },
                    { name: "Active Ambassadors", target: 100, actual: 75, status: "good" },
                    { name: "Protocol Integrations", target: 20, actual: 12, status: "warning" }
                ]
            },
            {
                id: 12,
                name: "Trading Fee Revenue",
                code: "OP-REV-FEES",
                status: "on-track",
                owner: "Trading Ops",
                hypothesis: "Competitive fee structure with volume incentives generates sustainable revenue",
                timeline: "Post-launch ongoing",
                linkedBudgetLines: ["OPS2", "REV1", "REV2"],
                kpis: [
                    { name: "Monthly Trading Volume ($M)", target: 100, actual: 45, status: "good" },
                    { name: "Fee Revenue ($K)", target: 150, actual: 68, status: "good" },
                    { name: "Active Traders", target: 10000, actual: 5500, status: "good" }
                ]
            }
        ]
    },

    // Activities are workspace-specific
    activitiesByWorkspace: {
        1: [ // Superteam Vietnam
        {
            id: 1,
            type: "milestone",
            title: "Builder Sprint - First Cohort Launched",
            description: "185 participants enrolled in Web3 Builder Sprint. Strong interest from AI and DeFi builders.",
            author: "Lan",
            timestamp: "3 hours ago",
            operation: "Web3 Builder Sprint",
            likes: 8,
            comments: 4
        },
        {
            id: 2,
            type: "proposal",
            title: "Workshop Budget Approved",
            description: "$3,500 for developer workshop series in Hanoi - Approved",
            author: "Tuan",
            timestamp: "5 hours ago",
            operation: "Developer Education Track"
        },
        {
            id: 3,
            type: "kpi",
            title: "KPI Update - Partnership milestone reached",
            description: "Secured 18 active partners, exceeding Q1 target of 15",
            author: "Hoa",
            timestamp: "Yesterday",
            operation: "Ecosystem Partnerships"
        },
        {
            id: 4,
            type: "meeting",
            title: "Monthly Team Sync - Strong Progress",
            description: "Reviewed Q1 metrics. Education track and partnerships ahead of schedule.",
            author: "Minh",
            timestamp: "2 days ago",
            comments: 7
        }
        ],
        2: [ // CloudFlow SaaS
        {
            id: 5,
            type: "milestone",
            title: "Product V2 Beta Launch",
            description: "42 beta users onboarded. Initial feedback very positive (88% satisfaction).",
            author: "Alex Chen",
            timestamp: "4 hours ago",
            operation: "Product V2 Launch",
            likes: 12,
            comments: 8
        },
        {
            id: 6,
            type: "blocker",
            title: "Conversion Rate Below Target",
            description: "Trial to paid conversion at 12% vs 25% target. Need to investigate onboarding friction.",
            author: "Emma Davis",
            timestamp: "6 hours ago",
            operation: "Customer Acquisition",
            comments: 15
        },
        {
            id: 7,
            type: "kpi",
            title: "KPI Win - Churn Rate Improved",
            description: "Monthly churn dropped to 4.2%, beating our 5% target. Support team doing great work!",
            author: "Lisa Wong",
            timestamp: "Yesterday",
            operation: "Customer Retention",
            likes: 18
        },
        {
            id: 8,
            type: "decision",
            title: "Infrastructure Upgrade Approved",
            description: "Additional $15K approved for database optimization to support scaling.",
            author: "DevOps Team",
            timestamp: "2 days ago",
            operation: "Platform Scalability"
        }
        ],
        3: [ // DeFiX Protocol
        {
            id: 9,
            type: "milestone",
            title: "6th Smart Contract Audit Completed",
            description: "Trail of Bits audit complete - 2 medium issues found and fixed. On track for mainnet.",
            author: "Viktor Petrov",
            timestamp: "2 hours ago",
            operation: "Mainnet Launch",
            likes: 45,
            comments: 12
        },
        {
            id: 10,
            type: "kpi",
            title: "Community Growth Accelerating",
            description: "Discord hit 32K members (+8K this month). Ambassador program scaling well.",
            author: "Maria Santos",
            timestamp: "4 hours ago",
            operation: "Community & Ecosystem Growth",
            likes: 67,
            comments: 8
        },
        {
            id: 11,
            type: "proposal",
            title: "Market Maker Agreement Approved",
            description: "$35K for Wintermute MM services - Approved by treasury multi-sig",
            author: "Finance Team",
            timestamp: "Yesterday",
            operation: "Token Launch & Liquidity"
        },
        {
            id: 12,
            type: "kpi",
            title: "Testnet Trading Volume Milestone",
            description: "Testnet hit $45M monthly volume. Fee revenue tracking at $68K/month.",
            author: "Trading Ops",
            timestamp: "2 days ago",
            operation: "Trading Fee Revenue",
            likes: 34,
            comments: 18
        }
        ]
    },

    // Proposals are workspace-specific
    proposalsByWorkspace: {
        1: [ // Superteam Vietnam
        {
            id: 101,
            amount: 2500,
            description: "$2,500 for Builder Sprint prize pool",
            category: "O1. Builder Competitions",
            submitter: "Lan",
            status: "pending",
            timestamp: "3 hours ago"
        },
        {
            id: 102,
            amount: 1800,
            description: "$1,800 for workshop materials and venue",
            category: "O2. Developer Workshops",
            submitter: "Tuan",
            status: "pending",
            timestamp: "1 day ago"
        },
        {
            id: 103,
            amount: 3500,
            description: "$3,500 for hackathon venue rental",
            category: "F1. Hackathons",
            submitter: "Nam",
            status: "approved",
            timestamp: "2 days ago"
        },
        {
            id: 104,
            amount: 4200,
            description: "$4,200 for partnership event sponsorship",
            category: "E2. Partnership Development",
            submitter: "Hoa",
            status: "approved",
            timestamp: "3 days ago"
        },
        {
            id: 105,
            amount: 900,
            description: "$900 for community hub equipment",
            category: "P2. Community Hubs",
            submitter: "Minh",
            status: "rejected",
            timestamp: "4 days ago"
        }
        ],
        2: [ // CloudFlow SaaS
        {
            id: 201,
            amount: 15000,
            description: "$15,000 for database optimization (infrastructure upgrade)",
            category: "RD3. Infrastructure",
            submitter: "DevOps Team",
            status: "pending",
            timestamp: "1 hour ago"
        },
        {
            id: 202,
            amount: 8500,
            description: "$8,500 for Q2 Google Ads campaign",
            category: "SM3. Ad Spend",
            submitter: "Emma Davis",
            status: "pending",
            timestamp: "4 hours ago"
        },
        {
            id: 203,
            amount: 12000,
            description: "$12,000 for UX research and user testing",
            category: "RD2. Product Design",
            submitter: "Sarah Kim",
            status: "approved",
            timestamp: "Yesterday"
        },
        {
            id: 204,
            amount: 6500,
            description: "$6,500 for sales enablement tools (Gong, Outreach)",
            category: "OPS2. Tools & Software",
            submitter: "Mike Johnson",
            status: "approved",
            timestamp: "2 days ago"
        },
        {
            id: 205,
            amount: 3200,
            description: "$3,200 for customer onboarding video series",
            category: "CS2. Onboarding",
            submitter: "Lisa Wong",
            status: "approved",
            timestamp: "3 days ago"
        }
        ],
        3: [ // DeFiX Protocol
        {
            id: 301,
            amount: 45000,
            description: "$45,000 for Certora formal verification audit",
            category: "DEV2. Smart Contract Audits",
            submitter: "Viktor Petrov",
            status: "pending",
            timestamp: "2 hours ago"
        },
        {
            id: 302,
            amount: 25000,
            description: "$25,000 for ETHDenver sponsorship and booth",
            category: "GTM4. Events & Conferences",
            submitter: "Maria Santos",
            status: "pending",
            timestamp: "5 hours ago"
        },
        {
            id: 303,
            amount: 35000,
            description: "$35,000 for Wintermute market making services",
            category: "TKN2. Market Making",
            submitter: "Finance Team",
            status: "approved",
            timestamp: "Yesterday"
        },
        {
            id: 304,
            amount: 80000,
            description: "$80,000 for additional DEX liquidity (Uniswap V3)",
            category: "TKN1. Liquidity Provision",
            submitter: "Treasury",
            status: "approved",
            timestamp: "2 days ago"
        },
        {
            id: 305,
            amount: 15000,
            description: "$15,000 for influencer marketing campaign",
            category: "GTM1. Marketing & PR",
            submitter: "Maria Santos",
            status: "approved",
            timestamp: "3 days ago"
        },
        {
            id: 306,
            amount: 28000,
            description: "$28,000 for legal opinion on securities law compliance",
            category: "OPS1. Legal & Compliance",
            submitter: "Legal",
            status: "approved",
            timestamp: "4 days ago"
        }
        ]
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
