// Kubera Mock App - Main JavaScript

// State
let currentView = 'dashboard';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initLogin();
    initWorkspaceSelector();
    initNavigation();
    initModals();
    loadDashboard();
    loadBudgetTable();
    loadOperations();
    loadTimeline();
    loadProposals();
});

// Login Handler (not needed in dashboard page, but kept for compatibility)
function initLogin() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }
}

// Workspace Selector
function initWorkspaceSelector() {
    const selector = document.getElementById('workspace-selector');
    loadWorkspaceSelector();

    // Handle workspace switching
    selector.addEventListener('change', (e) => {
        mockData.activeWorkspaceIndex = parseInt(e.target.value);
        reloadAllData();
    });
}

function loadWorkspaceSelector() {
    const selector = document.getElementById('workspace-selector');
    selector.innerHTML = mockData.workspaces.map((ws, index) => {
        const statusBadge = ws.status === 'active' ? '🟢' : ws.status === 'completed' ? '✅' : '📦';
        return `<option value="${index}">${statusBadge} ${ws.name} (${ws.period})</option>`;
    }).join('');
    selector.value = mockData.activeWorkspaceIndex;
}

function reloadAllData() {
    loadDashboard();
    loadBudgetTable();
    loadOperations();
    loadTimeline();
    loadProposals();
}

// Navigation
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            switchView(view);
        });
    });

    // Also handle view buttons in cards
    document.querySelectorAll('[data-view]').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            if (view) switchView(view);
        });
    });
}

function switchView(view) {
    // Update nav
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    // Update views
    document.querySelectorAll('.view').forEach(v => {
        v.classList.toggle('active', v.id === `${view}-view`);
    });

    currentView = view;
}

// Modals
function initModals() {
    // Create Proposal
    const createProposalBtns = document.querySelectorAll('#create-proposal-btn, #create-proposal-btn2');
    const createProposalModal = document.getElementById('create-proposal-modal');

    createProposalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            createProposalModal.classList.add('active');
        });
    });

    // Log Activity
    const logActivityBtns = document.querySelectorAll('#log-activity-btn, #log-activity-btn2');
    const logActivityModal = document.getElementById('log-activity-modal');

    logActivityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            logActivityModal.classList.add('active');
        });
    });

    // Create Budget
    const createBudgetBtns = document.querySelectorAll('#new-budget-btn');
    const createBudgetModal = document.getElementById('create-budget-modal');

    createBudgetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loadBudgetOperationOptions();
            createBudgetModal.classList.add('active');
        });
    });

    // Create Operation
    const createOperationBtns = document.querySelectorAll('#add-operation-btn, #create-operation-btn');
    const createOperationModal = document.getElementById('create-operation-modal');

    createOperationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loadOperationBudgetOptions();
            createOperationModal.classList.add('active');
        });
    });

    // Add KPI button
    document.getElementById('add-kpi-btn').addEventListener('click', () => {
        addKpiInput();
    });

    // Workspace KPI button
    document.getElementById('ws-add-kpi-btn').addEventListener('click', () => {
        addWorkspaceKpiInput();
    });

    // New Workspace button
    const newWorkspaceBtns = document.querySelectorAll('#new-workspace-btn');
    const createWorkspaceModal = document.getElementById('create-workspace-modal');

    newWorkspaceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            createWorkspaceModal.classList.add('active');
        });
    });

    // Close modals
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active');
        });
    });

    // Click outside to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Form submissions
    document.getElementById('create-proposal-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Proposal submitted successfully!');
        createProposalModal.classList.remove('active');
    });

    document.getElementById('log-activity-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Activity logged successfully!');
        logActivityModal.classList.remove('active');
    });

    document.getElementById('create-budget-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('budget-name').value;
        const annual = document.getElementById('budget-annual').value;
        const linkedOpsSelect = document.getElementById('budget-linked-ops');
        const linkedOps = Array.from(linkedOpsSelect.selectedOptions).map(opt => opt.text);

        const opsText = linkedOps.length > 0
            ? `\n\nLinked to operations:\n${linkedOps.join('\n')}`
            : '\n\nNo operations linked';

        alert(`Budget item "${name}" created successfully with $${parseInt(annual).toLocaleString()} annual budget!${opsText}`);
        createBudgetModal.classList.remove('active');
        e.target.reset();
    });

    document.getElementById('create-operation-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('op-name').value;
        const hypothesis = document.getElementById('op-hypothesis').value;
        const budgetSelect = document.getElementById('op-budget');
        const linkedBudgets = Array.from(budgetSelect.selectedOptions).map(opt => opt.text);

        const budgetText = linkedBudgets.length > 0
            ? `\n\nLinked budget lines:\n${linkedBudgets.join('\n')}`
            : '\n\nNo budget required';

        alert(`Operation "${name}" created successfully!\n\nHypothesis: ${hypothesis}${budgetText}`);
        createOperationModal.classList.remove('active');
        e.target.reset();
        // Reset KPI inputs to just one
        document.getElementById('kpi-container').innerHTML = `
            <div class="kpi-input-group">
                <div class="form-group">
                    <label>KPI Name *</label>
                    <input type="text" class="kpi-name" placeholder="e.g., Number of Participants" required>
                </div>
                <div class="form-group">
                    <label>Target *</label>
                    <input type="number" class="kpi-target" placeholder="100" required>
                </div>
                <div class="form-group">
                    <label>Unit</label>
                    <input type="text" class="kpi-unit" placeholder="people, projects, %">
                </div>
            </div>
        `;
    });

    document.getElementById('create-workspace-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('ws-name').value;
        const period = document.getElementById('ws-period').value;
        const startDate = document.getElementById('ws-start-date').value;
        const endDate = document.getElementById('ws-end-date').value;
        const totalBudget = parseInt(document.getElementById('ws-total-budget').value);

        const opCode = document.getElementById('ws-op-code').value;
        const opName = document.getElementById('ws-op-name').value;
        const opHypothesis = document.getElementById('ws-op-hypothesis').value;
        const opOwner = document.getElementById('ws-op-owner').value;

        // Collect KPIs
        const kpiNames = document.querySelectorAll('.ws-kpi-name');
        const kpiTargets = document.querySelectorAll('.ws-kpi-target');
        const kpiUnits = document.querySelectorAll('.ws-kpi-unit');
        const kpis = [];

        for (let i = 0; i < kpiNames.length; i++) {
            if (kpiNames[i].value && kpiTargets[i].value) {
                kpis.push({
                    name: kpiNames[i].value,
                    target: parseInt(kpiTargets[i].value),
                    actual: 0,
                    unit: kpiUnits[i].value || '',
                    status: 'good'
                });
            }
        }

        alert(`Budget & Operation Pair Created!\n\nWorkspace: ${name} (${period})\nBudget: $${totalBudget.toLocaleString()}\n\nOperation: ${opName}\nHypothesis: ${opHypothesis}\nKPIs: ${kpis.length}`);

        createWorkspaceModal.classList.remove('active');
        e.target.reset();

        // Reset KPI container
        document.getElementById('ws-kpi-container').innerHTML = `
            <div class="kpi-input-group">
                <div class="form-group">
                    <label>KPI Name *</label>
                    <input type="text" class="ws-kpi-name" placeholder="e.g., Community Members" required>
                </div>
                <div class="form-group">
                    <label>Target *</label>
                    <input type="number" class="ws-kpi-target" placeholder="1000" required>
                </div>
                <div class="form-group">
                    <label>Unit</label>
                    <input type="text" class="ws-kpi-unit" placeholder="people, projects, %">
                </div>
            </div>
        `;
    });
}

// Add Workspace KPI Input
function addWorkspaceKpiInput() {
    const container = document.getElementById('ws-kpi-container');
    const newKpi = document.createElement('div');
    newKpi.className = 'kpi-input-group';
    newKpi.innerHTML = `
        <div class="form-group">
            <label>KPI Name *</label>
            <input type="text" class="ws-kpi-name" placeholder="e.g., Community Members" required>
        </div>
        <div class="form-group">
            <label>Target *</label>
            <input type="number" class="ws-kpi-target" placeholder="1000" required>
        </div>
        <div class="form-group">
            <label>Unit</label>
            <input type="text" class="ws-kpi-unit" placeholder="people, projects, %">
        </div>
        <button type="button" class="btn btn-secondary btn-sm remove-ws-kpi-btn">Remove</button>
    `;
    container.appendChild(newKpi);

    // Add remove functionality
    newKpi.querySelector('.remove-ws-kpi-btn').addEventListener('click', () => {
        newKpi.remove();
    });
}

// Add KPI Input
function addKpiInput() {
    const container = document.getElementById('kpi-container');
    const newKpi = document.createElement('div');
    newKpi.className = 'kpi-input-group';
    newKpi.innerHTML = `
        <div class="form-group">
            <label>KPI Name *</label>
            <input type="text" class="kpi-name" placeholder="e.g., Number of Participants" required>
        </div>
        <div class="form-group">
            <label>Target *</label>
            <input type="number" class="kpi-target" placeholder="100" required>
        </div>
        <div class="form-group">
            <label>Unit</label>
            <input type="text" class="kpi-unit" placeholder="people, projects, %">
        </div>
        <button type="button" class="btn btn-secondary btn-sm remove-kpi-btn">Remove</button>
    `;
    container.appendChild(newKpi);

    // Add remove functionality
    newKpi.querySelector('.remove-kpi-btn').addEventListener('click', () => {
        newKpi.remove();
    });
}

// Dashboard
function loadDashboard() {
    loadBudgetOverview();
    loadRecentActivity();
    loadPendingApprovals();
}

function loadBudgetOverview() {
    const workspace = getCurrentWorkspace();
    const container = document.getElementById('budget-overview-card');

    const available = workspace.totalBudget - workspace.spent - workspace.committed;
    const spentPercent = Math.round((workspace.spent / workspace.totalBudget) * 100);
    const committedPercent = Math.round((workspace.committed / workspace.totalBudget) * 100);
    const totalUsedPercent = spentPercent + committedPercent;

    container.innerHTML = `
        <h3>Budget Overview</h3>
        <div class="stat-row">
            <div class="stat-label">Total Budget:</div>
            <div class="stat-value">$${workspace.totalBudget.toLocaleString()}</div>
        </div>
        <div class="stat-row">
            <div class="stat-label">Spent:</div>
            <div class="stat-value">$${workspace.spent.toLocaleString()} (${spentPercent}%)</div>
        </div>
        <div class="stat-row">
            <div class="stat-label">Committed:</div>
            <div class="stat-value">$${workspace.committed.toLocaleString()} (${committedPercent}%)</div>
        </div>
        <div class="stat-row">
            <div class="stat-label">Available:</div>
            <div class="stat-value">$${available.toLocaleString()} (${100 - totalUsedPercent}%)</div>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${totalUsedPercent}%"></div>
        </div>
        <p class="${totalUsedPercent < 80 ? 'status-good' : totalUsedPercent < 95 ? 'status-warning' : 'status-danger'}">
            ${totalUsedPercent < 80 ? '✅ On Track' : totalUsedPercent < 95 ? '⚠️ Watch Spending' : '🚨 Over Budget'}
        </p>
        <button class="btn btn-link" data-view="budget">View Budget →</button>
    `;
}

function loadRecentActivity() {
    const container = document.getElementById('recent-activity');
    const activities = getCurrentActivities().slice(0, 3);

    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-header">
                <span class="activity-title">${getActivityIcon(activity.type)} ${activity.title}</span>
                <span class="activity-time">${activity.timestamp}</span>
            </div>
            <div class="activity-meta">by ${activity.author}${activity.operation ? ' • ' + activity.operation : ''}</div>
        </div>
    `).join('');
}

function loadPendingApprovals() {
    const container = document.getElementById('pending-approvals');
    const pending = getCurrentProposals().filter(p => p.status === 'pending').slice(0, 2);

    container.innerHTML = pending.map(proposal => `
        <div class="proposal-item">
            <div class="proposal-info">
                <h4>${proposal.description}</h4>
                <div class="proposal-meta">Submitted by ${proposal.submitter} • ${proposal.timestamp}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span class="proposal-amount">$${proposal.amount.toLocaleString()}</span>
                <button class="btn btn-primary btn-sm">Review</button>
            </div>
        </div>
    `).join('');
}

function getActivityIcon(type) {
    const icons = {
        milestone: '🎯',
        proposal: '💰',
        kpi: '📊',
        blocker: '🚧',
        meeting: '📝',
        decision: '✅'
    };
    return icons[type] || '📌';
}

// Budget Table
function loadBudgetTable() {
    const table = document.getElementById('budget-table');
    const workspace = getCurrentWorkspace();
    const budgetCategories = getCurrentBudgetCategories();

    let html = `
        <thead>
            <tr>
                <th>Code</th>
                <th>Category</th>
                <th>Detail</th>
                <th>Annual</th>
                <th>Monthly</th>
                <th>PIC</th>
                <th>Spent</th>
                <th>Linked Operations</th>
            </tr>
        </thead>
        <tbody>
    `;

    html += `
        <tr class="budget-row-category">
            <td></td>
            <td><strong>Total Budget</strong></td>
            <td></td>
            <td><strong>$${workspace.totalBudget.toLocaleString()}</strong></td>
            <td></td>
            <td></td>
            <td><strong>$${workspace.spent.toLocaleString()}</strong></td>
            <td></td>
        </tr>
    `;

    budgetCategories.forEach(category => {
        html += `
            <tr class="budget-row-category">
                <td><span class="expand-icon">▼</span> ${category.code}</td>
                <td><strong>${category.name}</strong></td>
                <td></td>
                <td><strong>$${category.allocated.toLocaleString()}</strong></td>
                <td></td>
                <td></td>
                <td><strong>$${category.spent.toLocaleString()}</strong></td>
                <td></td>
            </tr>
        `;

        if (category.children) {
            category.children.forEach(sub => {
                const linkedOps = sub.linkedOperations ? sub.linkedOperations.map(id => {
                    const op = getOperationById(id);
                    return op ? `<span class="operation-tag" title="${op.hypothesis}">${op.code}</span>` : '';
                }).join(' ') : '';

                html += `
                    <tr class="budget-row-subcategory">
                        <td>${sub.code ? '  ' + sub.code : ''}</td>
                        <td>${sub.code ? '  ' + sub.name : '    ' + sub.name}</td>
                        <td>${sub.detail || ''}</td>
                        <td>$${sub.allocated.toLocaleString()}</td>
                        <td>${sub.monthly ? '$' + sub.monthly.toLocaleString() : ''}</td>
                        <td>${sub.pic || ''}</td>
                        <td>$${sub.spent ? sub.spent.toLocaleString() : '0'}</td>
                        <td>${linkedOps}</td>
                    </tr>
                `;

                if (sub.children) {
                    sub.children.forEach(item => {
                        const linkedOps = item.linkedOperations ? item.linkedOperations.map(id => {
                            const op = getOperationById(id);
                            return op ? `<span class="operation-tag" title="${op.hypothesis}">${op.code}</span>` : '';
                        }).join(' ') : '';

                        html += `
                            <tr class="budget-row-item">
                                <td></td>
                                <td style="padding-left: 60px;">${item.name}</td>
                                <td>${item.detail || ''}</td>
                                <td>$${item.allocated.toLocaleString()}</td>
                                <td>${item.monthly ? '$' + item.monthly.toLocaleString() : ''}</td>
                                <td>${item.pic || ''}</td>
                                <td>$${item.spent ? item.spent.toLocaleString() : '0'}</td>
                                <td>${linkedOps}</td>
                            </tr>
                        `;
                    });
                }
            });
        }
    });

    html += '</tbody>';
    table.innerHTML = html;
}

// Operations
function loadOperations() {
    const container = document.getElementById('operations-grid');
    const operations = getCurrentOperations();

    container.innerHTML = operations.map(op => {
        const totalBudget = calculateOperationBudget(op);
        const totalSpent = calculateOperationSpent(op);
        const budgetPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

        const budgetLinesTags = op.linkedBudgetLines && op.linkedBudgetLines.length > 0
            ? op.linkedBudgetLines.map(code => {
                const line = getBudgetLineByCode(code);
                return line ? `<span class="budget-tag" title="$${line.allocated.toLocaleString()}">${code}</span>` : '';
            }).join(' ')
            : '<span class="no-budget-tag">No budget required</span>';

        return `
            <div class="operation-card">
                <div class="operation-header">
                    <h3 class="operation-title">🎯 ${op.name}</h3>
                    <span class="operation-status status-${op.status}">${op.status === 'on-track' ? '✅ On Track' : '⚠️ At Risk'}</span>
                </div>

                <div class="operation-meta">
                    <span>Total Budget: $${totalBudget.toLocaleString()}</span>
                    <span>Owner: ${op.owner}</span>
                    <span>Code: ${op.code}</span>
                </div>

                <div class="operation-budget-links">
                    <strong>Linked Budget Lines:</strong> ${budgetLinesTags}
                </div>

                <div class="operation-hypothesis">
                    "${op.hypothesis}"
                </div>

                <div class="kpi-list">
                    <h4>KPIs:</h4>
                    ${op.kpis.map(kpi => {
                        const percent = Math.round((kpi.actual / kpi.target) * 100);
                        const statusClass = kpi.status;
                        const statusIcon = kpi.status === 'good' ? '✅' : kpi.status === 'warning' ? '⚠️' : '❌';

                        return `
                            <div class="kpi-item">
                                <span class="kpi-label">${kpi.name}:</span>
                                <div class="kpi-value">
                                    <span>${kpi.actual} / ${kpi.target}</span>
                                    <div class="kpi-progress">
                                        <div class="kpi-progress-fill ${statusClass}" style="width: ${Math.min(percent, 100)}%"></div>
                                    </div>
                                    <span>${percent}% ${statusIcon}</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="stat-row">
                    <span>Budget Spent:</span>
                    <span>$${totalSpent.toLocaleString()} / $${totalBudget.toLocaleString()} (${budgetPercent}%)</span>
                </div>

                <div class="mt-1">
                    <button class="btn btn-link">View Details →</button>
                </div>
            </div>
        `;
    }).join('');
}

// Timeline
function loadTimeline() {
    const container = document.getElementById('timeline');
    const activities = getCurrentActivities();

    const groupedActivities = {
        'Today - December 7, 2025': activities.slice(0, 2),
        'Yesterday - December 6, 2025': activities.slice(2)
    };

    container.innerHTML = Object.entries(groupedActivities).map(([date, activities]) => `
        <div class="timeline-day">
            <div class="timeline-date">📅 ${date}</div>
            ${activities.map(activity => `
                <div class="timeline-item">
                    <div class="timeline-item-header">
                        <span class="timeline-item-title">${getActivityIcon(activity.type)} ${activity.title}</span>
                        <span class="timeline-item-author">by ${activity.author}</span>
                    </div>
                    <div class="timeline-item-content">
                        ${activity.description}
                        ${activity.operation ? `<br><br>Linked to: 🎯 ${activity.operation}` : ''}
                    </div>
                    <div class="timeline-item-footer">
                        ${activity.likes ? `<span>👍 ${activity.likes}</span>` : ''}
                        ${activity.comments ? `<span>💬 ${activity.comments} comments</span>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');
}

// Proposals
function loadProposals() {
    const container = document.getElementById('proposals-list');
    const proposals = getCurrentProposals();

    container.innerHTML = proposals.map(proposal => {
        const statusBadge = proposal.status === 'pending' ? 'warning' :
                           proposal.status === 'approved' ? 'success' : 'danger';

        return `
            <div class="proposal-item">
                <div class="proposal-info">
                    <h4>Proposal #${proposal.id}</h4>
                    <p>${proposal.description}</p>
                    <div class="proposal-meta">
                        ${proposal.category} • Submitted by ${proposal.submitter} • ${proposal.timestamp}
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span class="proposal-amount">$${proposal.amount.toLocaleString()}</span>
                    <span class="badge badge-${statusBadge}">${proposal.status}</span>
                    ${proposal.status === 'pending' ? `
                        <div class="proposal-actions">
                            <button class="btn btn-primary btn-sm" onclick="alert('Approved!')">✅ Approve</button>
                            <button class="btn btn-secondary btn-sm" onclick="alert('Rejected')">❌ Reject</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Load operation options for budget creation
function loadBudgetOperationOptions() {
    const select = document.getElementById('budget-linked-ops');
    const operations = getCurrentOperations();

    select.innerHTML = operations.map(op =>
        `<option value="${op.id}">${op.code} - ${op.name}</option>`
    ).join('');
}

// Load budget line options for operation creation
function loadOperationBudgetOptions() {
    const select = document.getElementById('op-budget');
    const categories = getCurrentBudgetCategories();
    let options = '';

    categories.forEach(category => {
        if (category.children) {
            category.children.forEach(line => {
                options += `<option value="${line.code}">${line.code} - ${line.name} ($${line.allocated.toLocaleString()})</option>`;
            });
        }
    });

    select.innerHTML = options;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(amount);
}

// Show notification (simple alert for demo)
function showNotification(message) {
    alert(message);
}
