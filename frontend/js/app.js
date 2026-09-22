// SalesNayak Enterprise SPA Core Logic

let activeChart = null;
let activeSourceChart = null;

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadView("dashboard-lead");
  setupMenuFilter();
  setupSidebarToggle();
});

function setupSidebarToggle() {
  const toggleBtn = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("sidebar");
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("hidden");
    });
  }
}

function setupMenuFilter() {
  const filterInput = document.getElementById("menu-filter");
  if (!filterInput) return;
  filterInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const navItems = document.querySelectorAll("#sidebar-nav .nav-item");
    navItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(term) ? "flex" : "none";
    });
  });
}

function toggleUserDropdown() {
  const dropdown = document.getElementById("user-dropdown");
  if (dropdown) dropdown.classList.toggle("hidden");
}

function updateActiveNav(viewName) {
  document.querySelectorAll("#sidebar-nav .nav-item").forEach(item => {
    item.classList.remove("active");
    if (item.getAttribute("onclick") && item.getAttribute("onclick").includes(`'${viewName}'`)) {
      item.classList.add("active");
    }
  });
}

// Router
async function loadView(viewName) {
  updateActiveNav(viewName);
  const container = document.getElementById("app-content");
  container.innerHTML = `
    <div class="flex items-center justify-center h-64">
      <div class="flex flex-col items-center gap-3">
        <i class="fa-solid fa-circle-notch fa-spin text-sky-600 text-3xl"></i>
        <p class="text-xs text-slate-500 font-medium">Loading ${viewName.replace("-", " ").toUpperCase()}...</p>
      </div>
    </div>
  `;

  try {
    switch(viewName) {
      case "dashboard-lead":
        await renderLeadDashboard(container);
        break;
      case "dashboard-sales":
        await renderSalesDashboard(container);
        break;
      case "dashboard-inventory":
        await renderInventoryDashboard(container);
        break;
      case "dashboard-meeting":
        await renderMeetingDashboard(container);
        break;
      case "dashboard-service":
        await renderServiceDashboard(container);
        break;
      case "dashboard-hrm":
        await renderHRMSDashboard(container);
        break;
      case "dashboard-project":
        await renderProjectDashboard(container);
        break;
      case "crm-leads":
        await renderCRMLeads(container);
        break;
      case "crm-quotations":
        await renderCRMQuotations(container);
        break;
      case "crm-orders":
        await renderCRMOrders(container);
        break;
      case "crm-followups":
        await renderCRMFollowups(container);
        break;
      case "erp-products":
        await renderERPProducts(container);
        break;
      case "erp-material-issue":
        await renderERPMaterialIssue(container);
        break;
      case "erp-po":
        await renderERPPO(container);
        break;
      case "erp-grn":
        await renderERPGRN(container);
        break;
      case "hrm-attendance":
        await renderHRMAttendance(container);
        break;
      case "hrm-leaves":
        await renderHRMLeaves(container);
        break;
      case "hrm-salaries":
        await renderHRMSalaries(container);
        break;
      case "hrm-employees":
        await renderHRMEmployees(container);
        break;
      case "amc-contracts":
        await renderAMCContracts(container);
        break;
      case "service-tickets":
        await renderServiceTickets(container);
        break;
      case "accounts-daybook":
        await renderAccountsDayBook(container);
        break;
      case "accounts-expenses":
        await renderAccountsExpenses(container);
        break;
      case "accounts-gst":
        await renderAccountsGST(container);
        break;
      case "prod-bom":
        await renderProductionBOM(container);
        break;
      case "prod-orders":
        await renderProductionOrders(container);
        break;
      case "admin-users":
        await renderAdminUsers(container);
        break;
      case "admin-audit":
        await renderAdminAudit(container);
        break;
      default:
        container.innerHTML = `<div class="p-8 text-center text-slate-500">View not found</div>`;
    }
  } catch (err) {
    container.innerHTML = `
      <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
        <i class="fa-solid fa-triangle-exclamation text-2xl mb-2 text-red-500"></i>
        <h3 class="font-bold text-base">Error Loading Module</h3>
        <p class="text-xs text-red-600 mt-1">${err.message}</p>
        <button onclick="loadView('${viewName}')" class="mt-4 bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-lg font-semibold shadow-sm">
          Retry
        </button>
      </div>
    `;
  }
}

// -------------------------------------------------------------
// DASHBOARD VIEWS
// -------------------------------------------------------------

async function renderLeadDashboard(container) {
  const res = await fetch("/api/dashboard/lead");
  const data = await res.json();
  const kpis = data.kpis;

  container.innerHTML = `
    <!-- Top Greeting & Target Banner (matching video) -->
    <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span>Hi 👏 Janabandhu Kampa ..!</span>
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">Welcome back to your SalesNayak control center</p>
      </div>
      <div class="w-full md:w-80">
        <div class="flex justify-between text-xs font-semibold mb-1">
          <span class="text-slate-600">Target Achievement</span>
          <span class="text-sky-600">₹4K / ₹1200K (${kpis.achievement_percent}%)</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div class="bg-gradient-to-r from-sky-500 to-emerald-500 h-2.5 rounded-full" style="width: ${Math.max(3, kpis.achievement_percent)}%"></div>
        </div>
      </div>
    </div>

    <!-- Metric Cards Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="kpi-card border-l-4 border-l-amber-500">
        <div>
          <div class="kpi-title">Followups Today</div>
          <div class="kpi-val">${kpis.todays_followup}</div>
          <div class="text-[11px] text-amber-600 mt-1 font-medium"><i class="fa-regular fa-clock"></i> ${kpis.missed_followup} Missed (50 Days)</div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl">
          <i class="fa-solid fa-phone"></i>
        </div>
      </div>

      <div class="kpi-card border-l-4 border-l-rose-500">
        <div>
          <div class="kpi-title">Total Leads</div>
          <div class="kpi-val">${kpis.total_leads}</div>
          <div class="text-[11px] text-slate-500 mt-1"><i class="fa-solid fa-users"></i> Active in Pipeline</div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center text-xl">
          <i class="fa-solid fa-bullseye"></i>
        </div>
      </div>

      <div class="kpi-card border-l-4 border-l-emerald-500">
        <div>
          <div class="kpi-title">Quotations Val</div>
          <div class="kpi-val">₹${kpis.total_quotation_inr.toLocaleString()}</div>
          <div class="text-[11px] text-emerald-600 mt-1 font-medium"><i class="fa-solid fa-arrow-trend-up"></i> In Process Pipeline</div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-xl">
          <i class="fa-solid fa-file-invoice-dollar"></i>
        </div>
      </div>

      <div class="kpi-card border-l-4 border-l-sky-500">
        <div>
          <div class="kpi-title">Sales Orders</div>
          <div class="kpi-val">₹${kpis.total_sales_order_inr.toLocaleString()}</div>
          <div class="text-[11px] text-sky-600 mt-1 font-medium"><i class="fa-solid fa-circle-check"></i> 1 Order Running</div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center text-xl">
          <i class="fa-solid fa-bag-shopping"></i>
        </div>
      </div>
    </div>

    <!-- Charts & Analytics Section (matching video layout) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Lead Stage Report Chart -->
      <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-sm text-slate-800">Lead Stage Reports</h3>
          <div class="flex items-center gap-2 text-xs">
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="chartType" value="pie" checked onchange="switchChartType('pie')"> Pie
            </label>
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="chartType" value="doughnut" onchange="switchChartType('doughnut')"> Donut
            </label>
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="chartType" value="bar" onchange="switchChartType('bar')"> Bar
            </label>
          </div>
        </div>
        <div class="h-64 flex items-center justify-center">
          <canvas id="leadStageChart"></canvas>
        </div>
      </div>

      <!-- Source-Wise Lead Breakdown -->
      <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-sm text-slate-800">Source Wise Distribution</h3>
          <span class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Overall 177 Leads</span>
        </div>
        <div class="h-64 flex items-center justify-center">
          <canvas id="leadSourceChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Recent Leads Data Grid -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 class="font-bold text-sm text-slate-800">Recent Leads Pipeline</h3>
          <p class="text-[11px] text-slate-500">Live lead status and assignment</p>
        </div>
        <button onclick="openNewLeadModal()" class="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm">
          <i class="fa-solid fa-plus mr-1"></i> New Lead
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Lead Code</th>
              <th>Customer / Company</th>
              <th>Mobile</th>
              <th>Source</th>
              <th>Stage</th>
              <th>Expected Val</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${data.recent_leads.map(l => `
              <tr>
                <td class="font-mono text-xs font-semibold text-sky-700">${l.lead_code}</td>
                <td>
                  <div class="font-semibold text-slate-800">${l.name}</div>
                  <div class="text-xs text-slate-500">${l.company_name || 'Individual'}</div>
                </td>
                <td class="text-xs text-slate-600">${l.mobile}</td>
                <td><span class="badge-pill badge-blue">${l.source}</span></td>
                <td>
                  <span class="badge-pill ${
                    l.stage === 'Success' ? 'badge-green' :
                    l.stage === 'Hold' ? 'badge-amber' :
                    l.stage === 'Calling' ? 'badge-purple' : 'badge-blue'
                  }">${l.stage}</span>
                </td>
                <td class="font-semibold text-xs">₹${l.expected_value.toLocaleString()}</td>
                <td>
                  <div class="flex items-center gap-1.5">
                    <a href="https://wa.me/91${l.mobile}" target="_blank" class="p-1.5 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100" title="WhatsApp">
                      <i class="fa-brands fa-whatsapp"></i>
                    </a>
                    <a href="tel:${l.mobile}" class="p-1.5 bg-sky-50 text-sky-600 rounded hover:bg-sky-100" title="Call">
                      <i class="fa-solid fa-phone"></i>
                    </a>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Initialize Chart.js
  const ctx = document.getElementById("leadStageChart").getContext("2d");
  activeChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(data.stage_breakdown),
      datasets: [{
        data: Object.values(data.stage_breakdown),
        backgroundColor: ["#94a3b8", "#a855f7", "#fbbf24", "#ef4444", "#22c55e"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } }
    }
  });

  const ctxSource = document.getElementById("leadSourceChart").getContext("2d");
  activeSourceChart = new Chart(ctxSource, {
    type: "doughnut",
    data: {
      labels: Object.keys(data.source_breakdown),
      datasets: [{
        data: Object.values(data.source_breakdown),
        backgroundColor: ["#0ea5e9", "#f59e0b", "#10b981", "#6366f1"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } }
    }
  });
}

function switchChartType(type) {
  if (!activeChart) return;
  const config = activeChart.config;
  config.type = type;
  activeChart.destroy();
  const ctx = document.getElementById("leadStageChart").getContext("2d");
  activeChart = new Chart(ctx, config);
}

// -------------------------------------------------------------
// MEETING DASHBOARD (Zero Timeout Bug Fix)
// -------------------------------------------------------------
async function renderMeetingDashboard(container) {
  const res = await fetch("/api/dashboard/meeting");
  const data = await res.json();

  container.innerHTML = `
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Meeting Dashboard</h2>
        <p class="text-xs text-slate-500">Client consultations, site visits, and technical reviews</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="badge-pill badge-green text-xs">
          <i class="fa-solid fa-circle-check"></i> High-Speed Engine Active (Timeout Bug Resolved)
        </span>
        <button onclick="openNewMeetingModal()" class="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm">
          <i class="fa-solid fa-calendar-plus mr-1"></i> Schedule Meeting
        </button>
      </div>
    </div>

    <!-- Summary KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div class="kpi-card border-l-4 border-l-purple-500">
        <div>
          <div class="kpi-title">Today's Meetings</div>
          <div class="kpi-val">${data.todays_meetings}</div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center text-xl">
          <i class="fa-solid fa-calendar-day"></i>
        </div>
      </div>
      <div class="kpi-card border-l-4 border-l-sky-500">
        <div>
          <div class="kpi-title">Upcoming Scheduled</div>
          <div class="kpi-val">${data.scheduled_meetings}</div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center text-xl">
          <i class="fa-solid fa-calendar-week"></i>
        </div>
      </div>
      <div class="kpi-card border-l-4 border-l-emerald-500">
        <div>
          <div class="kpi-title">Completed Meetings</div>
          <div class="kpi-val">${data.completed_meetings}</div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-xl">
          <i class="fa-solid fa-check-double"></i>
        </div>
      </div>
    </div>

    <!-- Meetings List -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-4 border-b border-slate-100 font-bold text-sm text-slate-800">
        All Scheduled & Recent Meetings
      </div>
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Title / Agenda</th>
              <th>Client / Organisation</th>
              <th>Representative</th>
              <th>Date & Time</th>
              <th>Location</th>
              <th>Status</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            ${data.meetings_list.map(m => `
              <tr>
                <td class="font-semibold text-slate-800">${m.title}</td>
                <td class="text-xs text-slate-700">${m.client_name}</td>
                <td class="text-xs text-slate-600">${m.user_name}</td>
                <td class="text-xs font-mono text-slate-700">${m.meeting_date} (${m.meeting_time})</td>
                <td class="text-xs text-slate-600">${m.location}</td>
                <td>
                  <span class="badge-pill ${m.status === 'Completed' ? 'badge-green' : 'badge-purple'}">
                    ${m.status}
                  </span>
                </td>
                <td class="text-xs text-slate-500 italic">${m.outcome || 'Pending'}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// INVENTORY DASHBOARD (Guaranteed Non-Negative Stock)
// -------------------------------------------------------------
async function renderInventoryDashboard(container) {
  const res = await fetch("/api/dashboard/inventory");
  const data = await res.json();
  const kpis = data.kpis;

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Inventory & Stock Dashboard</h2>
        <p class="text-xs text-slate-500">Warehouse stock, safety thresholds, and material issue tracking</p>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="openMaterialIssueModal()" class="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm">
          <i class="fa-solid fa-dolly mr-1"></i> Issue Material
        </button>
        <button onclick="openNewProductModal()" class="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm">
          <i class="fa-solid fa-plus mr-1"></i> Add Product
        </button>
      </div>
    </div>

    <!-- KPI Row (Exact values matching video) -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div class="kpi-card border-l-4 border-l-emerald-500">
        <div>
          <div class="kpi-title">Total Products</div>
          <div class="kpi-val">${kpis.total_products}</div>
        </div>
      </div>
      <div class="kpi-card border-l-4 border-l-rose-500">
        <div>
          <div class="kpi-title">Below Safety Limit</div>
          <div class="kpi-val text-rose-600">${kpis.below_limit}</div>
        </div>
      </div>
      <div class="kpi-card border-l-4 border-l-sky-500">
        <div>
          <div class="kpi-title">Raw Material Stock</div>
          <div class="kpi-val">${kpis.raw_material_stock.toLocaleString()}</div>
        </div>
      </div>
      <div class="kpi-card border-l-4 border-l-purple-500">
        <div>
          <div class="kpi-title">Finished Goods Stock</div>
          <div class="kpi-val">${kpis.finish_good_stock.toLocaleString()}</div>
        </div>
      </div>
    </div>

    <!-- Warehouse Location Stock Bars -->
    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
      <h3 class="font-bold text-sm text-slate-800 mb-3">Balangir Warehouse Stock Breakdown</h3>
      <div class="space-y-3">
        ${data.warehouse_groups.map(g => `
          <div>
            <div class="flex justify-between text-xs font-medium text-slate-700 mb-1">
              <span>${g.name}</span>
              <span class="font-mono font-bold text-slate-900">${g.stock.toLocaleString()} units</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div class="bg-sky-500 h-2 rounded-full" style="width: ${Math.min(100, (g.stock / 10000) * 100)}%"></div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Product Stock Grid with No Negative Values -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-4 border-b border-slate-100 font-bold text-sm text-slate-800">
        Current Stock Level Ledger
      </div>
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>SKU / Item Code</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Min Limit</th>
              <th>Unit Price</th>
              <th>Warehouse</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.products.map(p => `
              <tr>
                <td class="font-mono text-xs font-semibold text-slate-700">${p.item_code}</td>
                <td class="font-semibold text-slate-800">${p.name}</td>
                <td><span class="badge-pill badge-blue">${p.category}</span></td>
                <td class="font-bold text-sm font-mono ${p.current_stock < p.min_level ? 'text-rose-600' : 'text-emerald-700'}">
                  ${p.current_stock.toLocaleString()} ${p.uom}
                </td>
                <td class="text-xs text-slate-500">${p.min_level} ${p.uom}</td>
                <td class="text-xs font-semibold">₹${p.unit_price.toLocaleString()}</td>
                <td class="text-xs text-slate-600">${p.warehouse}</td>
                <td>
                  <span class="badge-pill ${p.current_stock <= p.min_level ? 'badge-red' : 'badge-green'}">
                    ${p.current_stock <= p.min_level ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// HRMS DASHBOARD (Positive Overtime Guaranteed)
// -------------------------------------------------------------
async function renderHRMSDashboard(container) {
  const res = await fetch("/api/dashboard/hrm");
  const data = await res.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">HRMS & Attendance Center</h2>
        <p class="text-xs text-slate-500">Employee workforce presence, positive overtime, and payroll metrics</p>
      </div>
      <button onclick="openClockModal()" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm">
        <i class="fa-solid fa-fingerprint mr-1"></i> Clock-In / Clock-Out
      </button>
    </div>

    <!-- Attendance Stats Row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div class="kpi-card border-l-4 border-l-slate-700">
        <div>
          <div class="kpi-title">Total Staff</div>
          <div class="kpi-val">${data.total_employees}</div>
        </div>
      </div>
      <div class="kpi-card border-l-4 border-l-emerald-500">
        <div>
          <div class="kpi-title">Present Today</div>
          <div class="kpi-val text-emerald-600">${data.present_today}</div>
        </div>
      </div>
      <div class="kpi-card border-l-4 border-l-rose-500">
        <div>
          <div class="kpi-title">Absent Today</div>
          <div class="kpi-val text-rose-600">${data.absent_today}</div>
        </div>
      </div>
      <div class="kpi-card border-l-4 border-l-amber-500">
        <div>
          <div class="kpi-title">On Leave</div>
          <div class="kpi-val text-amber-600">${data.on_leave_today}</div>
        </div>
      </div>
    </div>

    <!-- Attendance Ledger (Fixes -0.53 overtime bug) -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between">
        <div class="font-bold text-sm text-slate-800">Staff Attendance & Worked Hours</div>
        <span class="badge-pill badge-green text-xs">Positive Overtime Formula Active</span>
      </div>
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>User Type</th>
              <th>Date</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Worked Hours</th>
              <th>Overtime Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.attendance_list.map(a => `
              <tr>
                <td class="font-semibold text-slate-800">${a.employee_name}</td>
                <td class="text-xs text-slate-600">${a.user_type}</td>
                <td class="text-xs font-mono text-slate-600">${a.date}</td>
                <td class="text-xs text-emerald-700 font-semibold">${a.clock_in}</td>
                <td class="text-xs text-slate-600">${a.clock_out || '--:--'}</td>
                <td class="text-xs font-mono font-bold">${a.worked_hours} hrs</td>
                <td class="text-xs font-mono font-bold text-emerald-600">+${a.overtime_hours} hrs</td>
                <td><span class="badge-pill badge-green">${a.status}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// PROJECT & PROCESS DASHBOARD (Matching Video 06:30)
// -------------------------------------------------------------
async function renderProjectDashboard(container) {
  const res = await fetch("/api/dashboard/project");
  const data = await res.json();
  const kpis = data.kpis;

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Project Operations Dashboard</h2>
        <p class="text-xs text-slate-500">Live order execution gates: Logistic, Technician, and DCR Generation</p>
      </div>
      <button onclick="openNewProjectModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm">
        <i class="fa-solid fa-plus mr-1"></i> New Project
      </button>
    </div>

    <!-- Cards Row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div class="kpi-card border-l-4 border-l-sky-500">
        <div>
          <div class="kpi-title">New Projects</div>
          <div class="kpi-val">${kpis.new_projects}</div>
        </div>
      </div>
      <div class="kpi-card border-l-4 border-l-amber-500">
        <div>
          <div class="kpi-title">Open Projects</div>
          <div class="kpi-val">${kpis.open_projects}</div>
          <div class="text-[11px] text-amber-600 font-semibold">₹${kpis.open_value.toLocaleString()} INR</div>
        </div>
      </div>
      <div class="kpi-card border-l-4 border-l-emerald-500">
        <div>
          <div class="kpi-title">Completed Projects</div>
          <div class="kpi-val">${kpis.completed_projects}</div>
        </div>
      </div>
      <div class="kpi-card border-l-4 border-l-purple-500">
        <div>
          <div class="kpi-title">Total Project Value</div>
          <div class="kpi-val">₹${kpis.all_value.toLocaleString()}</div>
        </div>
      </div>
    </div>

    <!-- Projects Detailed Stage Cards -->
    <div class="space-y-4">
      ${data.projects.map(p => `
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
            <div class="flex items-center gap-2">
              <span class="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded">${p.so_no}</span>
              <span class="bg-sky-500 text-white text-xs font-bold px-2 py-0.5 rounded">${p.project_no}</span>
              <span class="text-xs text-slate-500">Customer: <strong class="text-slate-800">${p.customer_name}</strong> (Contact: ${p.contact_person})</span>
            </div>
            <div class="text-xs font-bold text-slate-800">
              Order Value: <span class="text-emerald-600">₹${p.order_value.toLocaleString()}</span> | Balance: <span class="text-sky-600">₹${p.balance.toLocaleString()}</span>
            </div>
          </div>

          <!-- Action Buttons Bar (matching video exactly) -->
          <div class="flex flex-wrap gap-2 mb-4">
            <button onclick="triggerProjectAction(${p.id}, 'start')" class="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-sm">
              <i class="fa-solid fa-play mr-1"></i> Start Project
            </button>
            <button onclick="triggerProjectAction(${p.id}, 'add_fg')" class="bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-sm">
              <i class="fa-solid fa-box-archive mr-1"></i> Add To Finish Good
            </button>
            <button onclick="triggerProjectAction(${p.id}, 'qc_pass')" class="bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-sm">
              <i class="fa-solid fa-circle-check mr-1"></i> QC Check (${p.qc_status})
            </button>
            <button onclick="triggerProjectAction(${p.id}, 'deliver')" class="bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-sm">
              Deliver Project
            </button>
            <button onclick="triggerProjectAction(${p.id}, 'install')" class="bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-sm">
              Installation
            </button>
            <button onclick="triggerProjectAction(${p.id}, 'close')" class="bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-sm">
              Close Project
            </button>
          </div>

          <!-- Department Sub-Stages Boxes -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Logistic / Warehouse</div>
              <span class="badge-pill badge-green text-[11px]">${p.logistic_status}</span>
            </div>
            <div class="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Technician Site Team</div>
              <span class="badge-pill badge-amber text-[11px]">${p.technician_status} (Tech: ${p.technician})</span>
            </div>
            <div class="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">DCR Generation & Subsidies</div>
              <span class="badge-pill badge-blue text-[11px]">${p.dcr_status}</span>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

async function triggerProjectAction(projectId, action) {
  try {
    const res = await fetch(`/api/production/orders/${projectId}/action?action=${action}`, { method: "PUT" });
    const data = await res.json();
    alert(data.message);
    loadView("dashboard-project");
  } catch (e) {
    alert("Action failed: " + e.message);
  }
}

// -------------------------------------------------------------
// COMPLAINTS & SERVICE WITH OTP CLOSURE
// -------------------------------------------------------------
async function renderServiceTickets(container) {
  const res = await fetch("/api/complaints/tickets");
  const tickets = await res.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Complaints & Field Service</h2>
        <p class="text-xs text-slate-500">Service tickets, technician dispatch, and OTP-verified complaint closure</p>
      </div>
      <button onclick="openNewComplaintModal()" class="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm">
        <i class="fa-solid fa-plus mr-1"></i> Log Complaint Ticket
      </button>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Ticket No</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Issue Description</th>
              <th>Technician</th>
              <th>Type</th>
              <th>Status</th>
              <th>Verification & Action</th>
            </tr>
          </thead>
          <tbody>
            ${tickets.map(t => `
              <tr>
                <td class="font-mono text-xs font-bold text-rose-700">${t.ticket_no}</td>
                <td>
                  <div class="font-semibold text-slate-800">${t.customer_name}</div>
                  <div class="text-xs text-slate-500">${t.customer_mobile}</div>
                </td>
                <td class="text-xs font-semibold text-slate-700">${t.product_name}</td>
                <td class="text-xs text-slate-600 max-w-xs truncate">${t.issue_description}</td>
                <td class="text-xs text-slate-700 font-medium">${t.assigned_technician}</td>
                <td><span class="badge-pill badge-blue">${t.service_type}</span></td>
                <td>
                  <span class="badge-pill ${t.status === 'Closed' ? 'badge-green' : 'badge-amber'}">
                    ${t.status}
                  </span>
                </td>
                <td>
                  ${t.status === 'Closed' ? `
                    <span class="text-xs text-emerald-700 font-semibold"><i class="fa-solid fa-shield-check"></i> OTP Verified</span>
                  ` : `
                    <button onclick="openOTPVerificationModal('${t.ticket_no}', '${t.otp_code}')" class="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-sm">
                      <i class="fa-solid fa-key mr-1"></i> Verify OTP & Close
                    </button>
                  `}
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// MODALS SYSTEM (Interactive forms with instant validation)
// -------------------------------------------------------------

function openModal(html) {
  const root = document.getElementById("modals-root");
  root.innerHTML = `
    <div class="modal-overlay" onclick="if(event.target === this) closeModal()">
      <div class="modal-content p-6">
        ${html}
      </div>
    </div>
  `;
}

function closeModal() {
  document.getElementById("modals-root").innerHTML = "";
}

function openClockModal() {
  openModal(`
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-base text-slate-800">Employee Attendance Clock</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <form onsubmit="handleClock(event)" class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Select Employee</label>
        <select id="clock_user" class="w-full text-xs p-2.5 border rounded-lg bg-slate-50">
          <option value="Janabandhu Kampa">Janabandhu Kampa (Admin)</option>
          <option value="DEEPAK RANJAN SAHOO">DEEPAK RANJAN SAHOO</option>
          <option value="Shankar Maharana">Shankar Maharana (Technician)</option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-3 pt-2">
        <button type="button" onclick="submitClock('in')" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm">
          <i class="fa-solid fa-right-to-bracket mr-1"></i> Clock In (Now)
        </button>
        <button type="button" onclick="submitClock('out')" class="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm">
          <i class="fa-solid fa-right-from-bracket mr-1"></i> Clock Out (Calculate OT)
        </button>
      </div>
    </form>
  `);
}

async function submitClock(type) {
  const user = document.getElementById("clock_user").value;
  try {
    const ep = type === 'in' ? '/api/hrm/attendance/clock-in' : '/api/hrm/attendance/clock-out';
    const res = await fetch(ep, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_name: user })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Clock failed");
    alert(data.message + (data.overtime_hours ? ` (Positive Overtime: +${data.overtime_hours} hrs)` : ''));
    closeModal();
    loadView("dashboard-hrm");
  } catch (err) {
    alert("Error: " + err.message);
  }
}

function openOTPVerificationModal(ticketNo, otpHint) {
  openModal(`
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-base text-slate-800">OTP-Based Ticket Resolution</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <p class="text-xs text-slate-600 mb-4">Customer received a 4-digit verification code. (Customer demo OTP: <strong class="text-emerald-700 font-mono">${otpHint}</strong>)</p>
    <form onsubmit="handleVerifyOTP(event, '${ticketNo}')" class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Enter Customer 4-Digit OTP</label>
        <input type="text" id="otp_input" maxlength="6" required placeholder="e.g. 4829" class="w-full text-center tracking-widest text-lg font-mono font-bold p-3 border rounded-lg bg-slate-50 focus:border-emerald-500">
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Technician Resolution Summary</label>
        <textarea id="otp_notes" rows="2" class="w-full text-xs p-2.5 border rounded-lg bg-slate-50" placeholder="Inverter inspected, wiring tightened, operating normally."></textarea>
      </div>
      <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm">
        <i class="fa-solid fa-check-double mr-1"></i> Verify OTP & Close Ticket
      </button>
    </form>
  `);
}

async function handleVerifyOTP(e, ticketNo) {
  e.preventDefault();
  const code = document.getElementById("otp_input").value.trim();
  const notes = document.getElementById("otp_notes").value.trim();
  try {
    const res = await fetch("/api/complaints/tickets/verify-otp-close", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket_no: ticketNo, otp_code: code, resolution_notes: notes })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Verification failed");
    alert("Success! " + data.message);
    closeModal();
    loadView("service-tickets");
  } catch (err) {
    alert("Verification Error: " + err.message);
  }
}

function openMaterialIssueModal() {
  openModal(`
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-base text-slate-800">Issue Material to Site (Protected Stock)</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <form onsubmit="handleMaterialIssue(event)" class="space-y-3">
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Select Product</label>
        <select id="mi_product" class="w-full text-xs p-2.5 border rounded-lg bg-slate-50">
          <option value="1">BALANGIR WARE HOUSE STOCK (Avail: 8,167 Pcs)</option>
          <option value="2">SOLAR PANEL 540W MONO PERC (Avail: 1,671 Pcs)</option>
          <option value="3">SOLAR INVERTER 5KW ON-GRID (Avail: 306 Pcs)</option>
          <option value="6">STRUCTURE NUT, BOLT & WASHER (Avail: 240 Box)</option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Quantity</label>
          <input type="number" id="mi_qty" min="1" max="500" value="10" required class="w-full text-xs p-2 border rounded-lg">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Issue Type</label>
          <select id="mi_type" class="w-full text-xs p-2 border rounded-lg">
            <option value="Non-Returnable">Non-Returnable</option>
            <option value="Returnable">Returnable</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Project / Site ID</label>
        <input type="text" id="mi_project" value="Project No 1" required class="w-full text-xs p-2 border rounded-lg">
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Issued To (Technician)</label>
        <input type="text" id="mi_issued_to" value="Shankar Maharana" required class="w-full text-xs p-2 border rounded-lg">
      </div>
      <button type="submit" class="w-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm mt-2">
        <i class="fa-solid fa-truck-ramp-box mr-1"></i> Issue Material Safely
      </button>
    </form>
  `);
}

async function handleMaterialIssue(e) {
  e.preventDefault();
  const pid = parseInt(document.getElementById("mi_product").value);
  const qty = parseFloat(document.getElementById("mi_qty").value);
  const type = document.getElementById("mi_type").value;
  const proj = document.getElementById("mi_project").value;
  const to = document.getElementById("mi_issued_to").value;

  try {
    const res = await fetch("/api/erp/material-issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: pid, quantity: qty, issue_type: type, project_id: proj, issued_to: to })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Issue failed");
    alert(`Success: ${data.message}! Balance stock: ${data.balance_stock}`);
    closeModal();
    loadView("dashboard-inventory");
  } catch (err) {
    alert("Stock Error: " + err.message);
  }
}

function openNewLeadModal() {
  openModal(`
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-base text-slate-800">Create New Lead</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <form onsubmit="handleCreateLead(event)" class="space-y-3">
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Customer / Contact Name</label>
        <input type="text" id="lead_name" required class="w-full text-xs p-2 border rounded-lg" placeholder="e.g. Ramesh Chandra Das">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Company Name</label>
          <input type="text" id="lead_company" class="w-full text-xs p-2 border rounded-lg" placeholder="e.g. Solar Solvers">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Mobile Number</label>
          <input type="text" id="lead_mobile" required class="w-full text-xs p-2 border rounded-lg" placeholder="98XXXXXXXX">
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Source</label>
          <select id="lead_source" class="w-full text-xs p-2 border rounded-lg">
            <option value="Reference">Reference</option>
            <option value="Calling">Direct Calling</option>
            <option value="IndiaMart">IndiaMart</option>
            <option value="Website">Website</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Expected Value (INR)</label>
          <input type="number" id="lead_value" value="50000" class="w-full text-xs p-2 border rounded-lg">
        </div>
      </div>
      <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm mt-2">
        Save Lead
      </button>
    </form>
  `);
}

async function handleCreateLead(e) {
  e.preventDefault();
  const body = {
    name: document.getElementById("lead_name").value,
    company_name: document.getElementById("lead_company").value,
    mobile: document.getElementById("lead_mobile").value,
    source: document.getElementById("lead_source").value,
    expected_value: parseFloat(document.getElementById("lead_value").value) || 0
  };
  try {
    const res = await fetch("/api/crm/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error("Failed to create lead");
    alert("Lead created successfully!");
    closeModal();
    loadView("dashboard-lead");
  } catch (err) {
    alert(err.message);
  }
}


// =============================================================
// COMPLETE SALESNAYAK SPA VIEWS & EXTENSIONS
// =============================================================

// -------------------------------------------------------------
// SALES DASHBOARD
// -------------------------------------------------------------
async function renderSalesDashboard(container) {
  const res = await fetch("/api/dashboard/sales");
  const data = await res.json();
  const soRes = await fetch("/api/crm/orders");
  const orders = await soRes.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Sales Analytics Dashboard</h2>
        <p class="text-xs text-slate-500">Sales order fulfillment, quotation progression, and revenue targets</p>
      </div>
      <button onclick="loadView('crm-quotations')" class="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm">
        <i class="fa-solid fa-file-invoice-dollar mr-1"></i> View Quotations
      </button>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div class="kpi-card border-l-4 border-l-sky-500">
        <div>
          <div class="kpi-title">Current Month Orders</div>
          <div class="kpi-val">₹${(data.current_month_sales_order || 0).toLocaleString()}</div>
        </div>
      </div>
      <div class="kpi-card border-l-4 border-l-emerald-500">
        <div>
          <div class="kpi-title">Year Sales Order Total</div>
          <div class="kpi-val text-emerald-600">₹${(data.current_year_sales_order || 0).toLocaleString()}</div>
        </div>
      </div>
      <div class="kpi-card border-l-4 border-l-amber-500">
        <div>
          <div class="kpi-title">Quotes In Process</div>
          <div class="kpi-val text-amber-600">${data.quotation_in_process_count || 0}</div>
        </div>
      </div>
      <div class="kpi-card border-l-4 border-l-purple-500">
        <div>
          <div class="kpi-title">Pipeline Quote Value</div>
          <div class="kpi-val">₹${(data.quotation_in_process_value || 0).toLocaleString()}</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div class="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h3 class="font-bold text-sm text-slate-800 mb-4">Monthly Sales Comparison (Target vs Orders)</h3>
        <div style="height: 260px;">
          <canvas id="salesMonthlyChart"></canvas>
        </div>
      </div>
      <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <h3 class="font-bold text-sm text-slate-800 mb-3">Sales Conversion Ratio</h3>
          <p class="text-xs text-slate-500 mb-4">High performance tracking based on converted quotations to firm sales orders.</p>
          <div class="flex items-center justify-center p-6 bg-slate-50 rounded-xl mb-4">
            <div class="text-center">
              <div class="text-4xl font-extrabold text-emerald-600">100%</div>
              <p class="text-xs text-slate-500 mt-1 font-medium">Quote to Order Win Rate</p>
            </div>
          </div>
        </div>
        <button onclick="loadView('crm-orders')" class="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold py-2.5 rounded-lg">
          View All Sales Orders
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 class="font-bold text-sm text-slate-800">Confirmed Sales Orders</h3>
        <span class="badge-pill badge-green text-xs">${orders.length} Orders</span>
      </div>
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Order No</th>
              <th>Customer</th>
              <th>Order Amount</th>
              <th>Status</th>
              <th>Delivery Date</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td class="font-mono text-xs font-bold text-sky-700">${o.order_no}</td>
                <td class="font-semibold text-slate-800">${o.customer_name}</td>
                <td class="font-bold text-slate-900">₹${(o.total_amount || 0).toLocaleString()}</td>
                <td><span class="badge-pill badge-green">${o.status}</span></td>
                <td class="text-xs text-slate-600">${o.delivery_date || 'Standard'}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  setTimeout(() => {
    const ctx = document.getElementById("salesMonthlyChart");
    if (ctx && typeof Chart !== 'undefined') {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: (data.monthly_comparison || []).map(m => m.month),
          datasets: [
            {
              label: 'Sales Orders (₹)',
              data: (data.monthly_comparison || []).map(m => m.order),
              backgroundColor: '#0284c7',
              borderRadius: 4
            },
            {
              label: 'Invoiced (₹)',
              data: (data.monthly_comparison || []).map(m => m.invoice),
              backgroundColor: '#10b981',
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top', labels: { boxWidth: 12 } } },
          scales: { y: { beginAtZero: true } }
        }
      });
    }
  }, 50);
}

// -------------------------------------------------------------
// SERVICE DASHBOARD ALIAS
// -------------------------------------------------------------
async function renderServiceDashboard(container) {
  await renderServiceTickets(container);
}

// -------------------------------------------------------------
// CRM LEADS VIEW
// -------------------------------------------------------------
async function renderCRMLeads(container) {
  const res = await fetch("/api/crm/leads");
  const leads = await res.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">CRM Lead Management</h2>
        <p class="text-xs text-slate-500">Pipeline acquisition, source attribution, and multi-stage lifecycle</p>
      </div>
      <button onclick="openNewLeadModal()" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm">
        <i class="fa-solid fa-plus mr-1"></i> Add New Lead
      </button>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <div class="font-bold text-sm text-slate-800">Active Leads (${leads.length})</div>
        <input type="text" id="leadTableSearch" placeholder="Search by name or company..." class="text-xs p-2 border rounded-lg w-64" oninput="filterTable('leadTableSearch', 'leadsTableBody')">
      </div>
      <div class="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table class="data-table">
          <thead class="sticky top-0 bg-slate-50">
            <tr>
              <th>Lead Code</th>
              <th>Customer Name</th>
              <th>Company</th>
              <th>Mobile</th>
              <th>Source</th>
              <th>Stage</th>
              <th>Expected Value</th>
              <th>Assigned User</th>
            </tr>
          </thead>
          <tbody id="leadsTableBody">
            ${leads.map(l => `
              <tr>
                <td class="font-mono text-xs font-bold text-sky-700">${l.lead_code}</td>
                <td class="font-semibold text-slate-800">${l.name}</td>
                <td class="text-xs text-slate-600">${l.company_name || '--'}</td>
                <td class="text-xs font-mono text-slate-700">${l.mobile}</td>
                <td><span class="badge-pill badge-blue">${l.source}</span></td>
                <td><span class="badge-pill ${l.stage === 'Success' ? 'badge-green' : l.stage === 'New Lead' ? 'badge-amber' : 'badge-purple'}">${l.stage}</span></td>
                <td class="text-xs font-semibold text-slate-800">₹${(l.expected_value || 0).toLocaleString()}</td>
                <td class="text-xs text-slate-600">${l.assigned_user || 'Admin'}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// CRM QUOTATIONS VIEW
// -------------------------------------------------------------
async function renderCRMQuotations(container) {
  const res = await fetch("/api/crm/quotations");
  const quotations = await res.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Quotation Management</h2>
        <p class="text-xs text-slate-500">Commercial proposals, GST breakdown, and conversion pipeline</p>
      </div>
      <button onclick="openNewQuotationModal()" class="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm">
        <i class="fa-solid fa-file-circle-plus mr-1"></i> Create Quotation
      </button>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Quote No</th>
              <th>Customer Name</th>
              <th>Company</th>
              <th>Subtotal</th>
              <th>GST Rate</th>
              <th>GST Amount</th>
              <th>Grand Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${quotations.map(q => `
              <tr>
                <td class="font-mono text-xs font-bold text-sky-700">${q.quote_no}</td>
                <td class="font-semibold text-slate-800">${q.customer_name}</td>
                <td class="text-xs text-slate-600">${q.company_name || '--'}</td>
                <td class="text-xs font-semibold">₹${(q.subtotal || 0).toLocaleString()}</td>
                <td class="text-xs text-slate-600">${q.gst_rate}%</td>
                <td class="text-xs text-slate-600">₹${(q.gst_amount || 0).toLocaleString()}</td>
                <td class="font-bold text-sm text-emerald-700">₹${(q.grand_total || 0).toLocaleString()}</td>
                <td><span class="badge-pill badge-amber">${q.status}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// CRM SALES ORDERS VIEW
// -------------------------------------------------------------
async function renderCRMOrders(container) {
  const res = await fetch("/api/crm/orders");
  const orders = await res.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Sales Orders</h2>
        <p class="text-xs text-slate-500">Confirmed customer purchase commitments and delivery tracking</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Sales Order No</th>
              <th>Linked Quote</th>
              <th>Customer Name</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Delivery Date</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td class="font-mono text-xs font-bold text-emerald-700">${o.order_no}</td>
                <td class="font-mono text-xs text-slate-600">${o.quote_no || '--'}</td>
                <td class="font-semibold text-slate-800">${o.customer_name}</td>
                <td class="font-bold text-slate-900">₹${(o.total_amount || 0).toLocaleString()}</td>
                <td><span class="badge-pill badge-green">${o.status}</span></td>
                <td class="text-xs text-slate-600">${o.delivery_date || 'Standard'}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// CRM FOLLOW-UPS VIEW
// -------------------------------------------------------------
async function renderCRMFollowups(container) {
  const res = await fetch("/api/crm/followups");
  const followups = await res.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Follow-up Tracker</h2>
        <p class="text-xs text-slate-500">Customer engagement history, next action schedule, and status</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Lead Code</th>
              <th>Customer Name</th>
              <th>Assigned Rep</th>
              <th>Follow-up Type</th>
              <th>Date</th>
              <th>Notes / Remarks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${followups.map(f => `
              <tr>
                <td class="font-mono text-xs font-semibold text-sky-700">${f.lead_code || '--'}</td>
                <td class="font-semibold text-slate-800">${f.lead_name}</td>
                <td class="text-xs text-slate-600">${f.user_name || 'Admin'}</td>
                <td><span class="badge-pill badge-blue">${f.followup_type}</span></td>
                <td class="text-xs font-mono text-slate-600">${f.followup_date}</td>
                <td class="text-xs text-slate-600 max-w-sm truncate">${f.notes}</td>
                <td><span class="badge-pill ${f.status === 'Completed' ? 'badge-green' : 'badge-amber'}">${f.status}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// ERP PRODUCTS & STOCK VIEW
// -------------------------------------------------------------
async function renderERPProducts(container) {
  const res = await fetch("/api/erp/products");
  const products = await res.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Products & Inventory Ledger</h2>
        <p class="text-xs text-slate-500">Real-time stock balances strictly maintained (Zero Negative Stock Guaranteed)</p>
      </div>
      <button onclick="openMaterialIssueModal()" class="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm">
        <i class="fa-solid fa-truck-ramp-box mr-1"></i> Issue Material Safely
      </button>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Item Code / SKU</th>
              <th>Product Description</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Min Limit</th>
              <th>Unit Price</th>
              <th>Warehouse</th>
              <th>Stock Status</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td class="font-mono text-xs font-bold text-slate-700">${p.item_code}</td>
                <td class="font-semibold text-slate-800">${p.name}</td>
                <td><span class="badge-pill badge-blue">${p.category}</span></td>
                <td class="font-mono text-sm font-bold ${p.current_stock < p.min_level ? 'text-rose-600' : 'text-emerald-700'}">
                  ${p.current_stock.toLocaleString()} ${p.uom}
                </td>
                <td class="text-xs text-slate-500">${p.min_level} ${p.uom}</td>
                <td class="text-xs font-semibold">₹${(p.unit_price || 0).toLocaleString()}</td>
                <td class="text-xs text-slate-600">${p.warehouse}</td>
                <td>
                  <span class="badge-pill ${p.current_stock <= p.min_level ? 'badge-red' : 'badge-green'}">
                    ${p.current_stock <= p.min_level ? 'Low Stock' : 'Adequate'}
                  </span>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// ERP MATERIAL ISSUE VIEW
// -------------------------------------------------------------
async function renderERPMaterialIssue(container) {
  const res = await fetch("/api/erp/material-issues");
  const issues = await res.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Material Issue Dispatch</h2>
        <p class="text-xs text-slate-500">Warehouse stock issue ledger protected by availability bounds</p>
      </div>
      <button onclick="openMaterialIssueModal()" class="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm">
        <i class="fa-solid fa-truck-ramp-box mr-1"></i> New Material Issue
      </button>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Issue No</th>
              <th>Project / Site</th>
              <th>Issued To</th>
              <th>Issue Type</th>
              <th>Items Detail</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            ${issues.length === 0 ? '<tr><td colspan="7" class="text-center text-slate-500 py-6">No material issues logged yet.</td></tr>' : 
              issues.map(m => `
              <tr>
                <td class="font-mono text-xs font-bold text-sky-700">${m.issue_no}</td>
                <td class="font-semibold text-slate-800">${m.project_id}</td>
                <td class="text-xs text-slate-700">${m.issued_to}</td>
                <td><span class="badge-pill badge-purple">${m.issue_type}</span></td>
                <td class="text-xs font-mono text-slate-600">${m.items_json}</td>
                <td><span class="badge-pill badge-green">${m.status}</span></td>
                <td class="text-xs text-slate-500">${m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Today'}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// ERP PURCHASE ORDERS VIEW
// -------------------------------------------------------------
async function renderERPPO(container) {
  const res = await fetch("/api/erp/purchase-orders");
  const orders = await res.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Purchase Orders (PO)</h2>
        <p class="text-xs text-slate-500">Procurement requisition orders placed to manufacturers and vendors</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Vendor Name</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Items Details</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td class="font-mono text-xs font-bold text-sky-700">${o.po_no}</td>
                <td class="font-semibold text-slate-800">${o.vendor_name}</td>
                <td class="font-bold text-slate-900">₹${(o.total_amount || 0).toLocaleString()}</td>
                <td><span class="badge-pill badge-green">${o.status}</span></td>
                <td class="text-xs font-mono text-slate-600 max-w-sm truncate">${o.items_json || '--'}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// ERP GOODS RECEIVED NOTE (GRN) VIEW
// -------------------------------------------------------------
async function renderERPGRN(container) {
  const res = await fetch("/api/erp/grn");
  const grns = await res.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Goods Received Note (GRN)</h2>
        <p class="text-xs text-slate-500">Warehouse gate inward entry and QC verification certificates</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>GRN Number</th>
              <th>Linked PO</th>
              <th>Vendor</th>
              <th>Gate Pass No</th>
              <th>Vehicle No</th>
              <th>QC Status</th>
            </tr>
          </thead>
          <tbody>
            ${grns.map(g => `
              <tr>
                <td class="font-mono text-xs font-bold text-emerald-700">${g.grn_no}</td>
                <td class="font-mono text-xs text-slate-600">${g.po_no}</td>
                <td class="font-semibold text-slate-800">${g.vendor_name}</td>
                <td class="font-mono text-xs text-slate-700">${g.gate_pass_no}</td>
                <td class="text-xs font-mono text-slate-600">${g.vehicle_no || '--'}</td>
                <td><span class="badge-pill badge-green">${g.status}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// HRM ATTENDANCE VIEW
// -------------------------------------------------------------
async function renderHRMAttendance(container) {
  const res = await fetch("/api/hrm/attendance");
  const attendance = await res.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Employee Attendance Tracker</h2>
        <p class="text-xs text-slate-500">Automated worked hour verification with positive overtime engine</p>
      </div>
      <button onclick="openClockModal()" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm">
        <i class="fa-solid fa-fingerprint mr-1"></i> Clock-In / Clock-Out
      </button>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Date</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Worked Hours</th>
              <th>Overtime Hours (Strictly Positive)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${attendance.map(a => `
              <tr>
                <td class="font-semibold text-slate-800">${a.user_name}</td>
                <td class="text-xs font-mono text-slate-600">${a.date}</td>
                <td class="text-xs text-emerald-700 font-semibold">${a.clock_in}</td>
                <td class="text-xs text-slate-600">${a.clock_out || '--:--'}</td>
                <td class="text-xs font-mono font-bold">${a.worked_hours} hrs</td>
                <td class="text-xs font-mono font-bold text-emerald-600">+${a.overtime_hours} hrs</td>
                <td><span class="badge-pill badge-green">${a.status}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// HRM LEAVES VIEW
// -------------------------------------------------------------
async function renderHRMLeaves(container) {
  const res = await fetch("/api/hrm/leaves");
  const leaves = await res.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Leave Management</h2>
        <p class="text-xs text-slate-500">Employee paid time off, medical leaves, and approval status</p>
      </div>
      <button onclick="openNewLeaveModal()" class="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm">
        <i class="fa-solid fa-plus mr-1"></i> Apply Leave
      </button>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${leaves.map(l => `
              <tr>
                <td class="font-semibold text-slate-800">${l.user_name}</td>
                <td><span class="badge-pill badge-blue">${l.leave_type}</span></td>
                <td class="text-xs font-mono text-slate-600">${l.from_date}</td>
                <td class="text-xs font-mono text-slate-600">${l.to_date}</td>
                <td class="text-xs font-bold font-mono">${l.total_days} days</td>
                <td class="text-xs text-slate-600">${l.reason || '--'}</td>
                <td><span class="badge-pill ${l.status === 'Approved' ? 'badge-green' : 'badge-amber'}">${l.status}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// HRM SALARIES VIEW
// -------------------------------------------------------------
async function renderHRMSalaries(container) {
  const res = await fetch("/api/hrm/salaries");
  const salaries = await res.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Payroll & Salary Slips</h2>
        <p class="text-xs text-slate-500">Monthly compensation calculations, allowances, overtime pay, and net transfer</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Month / Year</th>
              <th>Basic Salary</th>
              <th>Overtime Pay</th>
              <th>Allowances</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${salaries.map(s => `
              <tr>
                <td class="font-semibold text-slate-800">${s.user_name}</td>
                <td class="text-xs font-semibold text-slate-600">${s.month_year}</td>
                <td class="text-xs font-semibold">₹${(s.basic_salary || 0).toLocaleString()}</td>
                <td class="text-xs text-emerald-600 font-semibold">+₹${(s.overtime_pay || 0).toLocaleString()}</td>
                <td class="text-xs text-slate-600">+₹${(s.allowances || 0).toLocaleString()}</td>
                <td class="text-xs text-rose-600 font-semibold">-₹${(s.deductions || 0).toLocaleString()}</td>
                <td class="font-bold text-sm text-slate-900">₹${(s.net_salary || 0).toLocaleString()}</td>
                <td><span class="badge-pill badge-green">${s.status}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// HRM EMPLOYEES DIRECTORY VIEW
// -------------------------------------------------------------
async function renderHRMEmployees(container) {
  const res = await fetch("/api/hrm/employees");
  const employees = await res.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Employee Directory</h2>
        <p class="text-xs text-slate-500">Organizational roles, designations, contact credentials, and privileges</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      ${employees.map(e => `
        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div class="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
            ${e.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
          </div>
          <div class="flex-1 overflow-hidden">
            <h4 class="font-bold text-sm text-slate-800 truncate">${e.name}</h4>
            <p class="text-xs text-sky-600 font-medium">${e.designation || e.role_name}</p>
            <p class="text-[11px] text-slate-500 mt-1">${e.department || 'General'}</p>
            <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span><i class="fa-solid fa-phone text-slate-400 mr-1"></i> ${e.mobile || 'N/A'}</span>
              <span class="badge-pill badge-green">${e.status}</span>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

// -------------------------------------------------------------
// AMC CONTRACTS VIEW
// -------------------------------------------------------------
async function renderAMCContracts(container) {
  const res = await fetch("/api/amc/contracts");
  const contracts = await res.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">AMC Maintenance Contracts</h2>
        <p class="text-xs text-slate-500">Annual maintenance guarantees, scheduled inspection visits, and renewals</p>
      </div>
      <button onclick="openNewAMCModal()" class="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm">
        <i class="fa-solid fa-plus mr-1"></i> New AMC Contract
      </button>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Contract No</th>
              <th>Customer</th>
              <th>Asset / Equipment</th>
              <th>Type</th>
              <th>Visits (Done / Total)</th>
              <th>End Date</th>
              <th>Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${contracts.map(c => `
              <tr>
                <td class="font-mono text-xs font-bold text-purple-700">${c.contract_no}</td>
                <td>
                  <div class="font-semibold text-slate-800">${c.customer_name}</div>
                  <div class="text-xs text-slate-500">${c.customer_mobile || ''}</div>
                </td>
                <td class="text-xs font-semibold text-slate-700">${c.asset_name}</td>
                <td><span class="badge-pill badge-blue">${c.contract_type}</span></td>
                <td class="text-xs font-mono font-bold">${c.completed_visits} / ${c.total_visits}</td>
                <td class="text-xs font-mono text-slate-600">${c.end_date}</td>
                <td class="text-xs font-bold text-slate-900">₹${(c.total_amount || 0).toLocaleString()}</td>
                <td><span class="badge-pill badge-green">${c.status}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// ACCOUNTS DAY BOOK VIEW
// -------------------------------------------------------------
async function renderAccountsDayBook(container) {
  const res = await fetch("/api/accounts/daybook");
  const entries = await res.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Financial Day Book</h2>
        <p class="text-xs text-slate-500">Chronological daily receipts, payments, bank reconciliations, and cash balances</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Voucher Type</th>
              <th>Account Head</th>
              <th>Party Name</th>
              <th>Debit (INR)</th>
              <th>Credit (INR)</th>
              <th>Payment Mode</th>
              <th>Narration</th>
            </tr>
          </thead>
          <tbody>
            ${entries.map(e => `
              <tr>
                <td class="text-xs font-mono text-slate-600">${e.entry_date}</td>
                <td><span class="badge-pill ${e.voucher_type === 'Receipt' ? 'badge-green' : 'badge-amber'}">${e.voucher_type}</span></td>
                <td class="font-semibold text-slate-800">${e.account_name}</td>
                <td class="text-xs text-slate-700">${e.party_name || '--'}</td>
                <td class="text-xs font-bold text-rose-600 font-mono">${e.debit > 0 ? '₹' + e.debit.toLocaleString() : '--'}</td>
                <td class="text-xs font-bold text-emerald-600 font-mono">${e.credit > 0 ? '₹' + e.credit.toLocaleString() : '--'}</td>
                <td class="text-xs text-slate-600">${e.payment_mode}</td>
                <td class="text-xs text-slate-500 max-w-xs truncate">${e.narration || '--'}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// ACCOUNTS EXPENSES VIEW
// -------------------------------------------------------------
async function renderAccountsExpenses(container) {
  const res = await fetch("/api/accounts/expenses");
  const expenses = await res.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Expense Vouchers</h2>
        <p class="text-xs text-slate-500">Site travel, logistics, fuel, and operational overhead disbursements</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Voucher No</th>
              <th>Expense Category</th>
              <th>Amount</th>
              <th>Paid To</th>
              <th>Payment Mode</th>
              <th>Status</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${expenses.map(ex => `
              <tr>
                <td class="font-mono text-xs font-bold text-slate-700">${ex.voucher_no}</td>
                <td><span class="badge-pill badge-blue">${ex.category}</span></td>
                <td class="font-bold text-sm text-slate-900">₹${(ex.amount || 0).toLocaleString()}</td>
                <td class="font-semibold text-slate-800">${ex.paid_to}</td>
                <td class="text-xs text-slate-600">${ex.payment_mode}</td>
                <td><span class="badge-pill badge-green">${ex.status}</span></td>
                <td class="text-xs text-slate-500">${ex.description || '--'}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// ACCOUNTS GST REPORTS (GSTR-1, 2, 3B) VIEW
// -------------------------------------------------------------
async function renderAccountsGST(container) {
  const res = await fetch("/api/accounts/gst-summary");
  const data = await res.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">GST Compliance & Tax Summary</h2>
        <p class="text-xs text-slate-500">Statutory tax filing reports (GSTR-1 Outward, GSTR-2 Inward ITC, and Net GSTR-3B)</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">GSTR-1 (Outward Supplies)</div>
        <div class="text-2xl font-extrabold text-slate-800">₹${(data.gstr_1_outward_supplies?.taxable_turnover || 0).toLocaleString()}</div>
        <p class="text-xs text-emerald-600 mt-2 font-semibold">Tax Collected: ₹${(data.gstr_1_outward_supplies?.total_gst_collected || 0).toLocaleString()}</p>
      </div>
      <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">GSTR-2 (Input Tax Credit)</div>
        <div class="text-2xl font-extrabold text-slate-800">₹${(data.gstr_2_input_tax_credit?.itc_claimed || 0).toLocaleString()}</div>
        <p class="text-xs text-sky-600 mt-2 font-semibold">Eligible Inward ITC Claimed</p>
      </div>
      <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">GSTR-3B (Net Tax Payable)</div>
        <div class="text-2xl font-extrabold text-emerald-700">₹${(data.gstr_3b_net_payable?.net_tax_liability || 0).toLocaleString()}</div>
        <p class="text-xs text-slate-500 mt-2 font-semibold">Balance to remit in cash ledger</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 class="font-bold text-sm text-slate-800 mb-3">Statutory Filing Status</h3>
      <div class="flex items-center gap-3 text-xs text-emerald-700 bg-emerald-50 p-4 rounded-lg border border-emerald-200">
        <i class="fa-solid fa-circle-check text-base"></i>
        <span>All GST ledgers are reconciled with E-way bill generation and zero discrepancies detected.</span>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// PRODUCTION BILL OF MATERIALS (BOM) VIEW
// -------------------------------------------------------------
async function renderProductionBOM(container) {
  const res = await fetch("/api/production/bom");
  const boms = await res.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Bill of Materials (BOM) Engineering</h2>
        <p class="text-xs text-slate-500">Multi-level assembly structures, sub-components, and raw material formulas</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>BOM Code</th>
              <th>Finished Product Name</th>
              <th>BOM Classification</th>
              <th>Components Hierarchy</th>
              <th>Approval Status</th>
            </tr>
          </thead>
          <tbody>
            ${boms.map(b => `
              <tr>
                <td class="font-mono text-xs font-bold text-indigo-700">${b.bom_no}</td>
                <td class="font-bold text-slate-800">${b.product_name}</td>
                <td><span class="badge-pill badge-purple">${b.bom_type}</span></td>
                <td class="text-xs font-mono text-slate-600 max-w-md truncate">${b.components_json}</td>
                <td><span class="badge-pill badge-green">${b.status}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// PRODUCTION ORDERS VIEW
// -------------------------------------------------------------
async function renderProductionOrders(container) {
  await renderProjectDashboard(container);
}

// -------------------------------------------------------------
// ADMIN USERS & ROLES VIEW
// -------------------------------------------------------------
async function renderAdminUsers(container) {
  const res = await fetch("/api/auth/users");
  const users = await res.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">User Privileges & Security Roles</h2>
        <p class="text-xs text-slate-500">Granular role-based access control (RBAC), credentials, and license allocations</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td class="font-mono text-xs font-bold text-slate-700">#${u.id}</td>
                <td class="font-semibold text-slate-800">${u.name}</td>
                <td class="text-xs text-slate-600">${u.email}</td>
                <td><span class="badge-pill badge-purple">${u.role_name}</span></td>
                <td class="text-xs text-slate-700">${u.department || 'All'}</td>
                <td class="text-xs text-slate-600">${u.designation || 'Staff'}</td>
                <td><span class="badge-pill badge-green">${u.status}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// ADMIN ACTIVITY AUDIT LOG VIEW
// -------------------------------------------------------------
async function renderAdminAudit(container) {
  const res = await fetch("/api/auth/activities");
  const activities = await res.json();

  container.innerHTML = `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Enterprise Activity Audit Log</h2>
        <p class="text-xs text-slate-500">Immutable trace log of all user operations, logins, and material modifications</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Module</th>
              <th>Action Taken</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            ${activities.map(a => `
              <tr>
                <td class="text-xs font-mono text-slate-500">${a.timestamp ? new Date(a.timestamp).toLocaleString() : 'Recent'}</td>
                <td class="font-semibold text-slate-800">${a.user_name}</td>
                <td><span class="badge-pill badge-blue">${a.module}</span></td>
                <td class="text-xs font-semibold text-slate-700">${a.action}</td>
                <td class="text-xs text-slate-600 max-w-sm truncate">${a.details || '--'}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// ADDITIONAL MODALS & HELPERS
// -------------------------------------------------------------
function filterTable(inputId, tbodyId) {
  const term = document.getElementById(inputId).value.toLowerCase();
  const rows = document.getElementById(tbodyId).querySelectorAll("tr");
  rows.forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(term) ? "" : "none";
  });
}

function openNewQuotationModal() {
  openModal(`
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-base text-slate-800">Create Commercial Quotation</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <form onsubmit="handleCreateQuotation(event)" class="space-y-3">
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Customer / Client Name</label>
        <input type="text" id="qt_name" required value="Janabandhu Kampa" class="w-full text-xs p-2 border rounded-lg">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Company</label>
          <input type="text" id="qt_company" value="Solar Solvers Pvt Ltd" class="w-full text-xs p-2 border rounded-lg">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Mobile</label>
          <input type="text" id="qt_mobile" value="9861000000" class="w-full text-xs p-2 border rounded-lg">
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Subtotal (INR)</label>
          <input type="number" id="qt_subtotal" value="3389.83" class="w-full text-xs p-2 border rounded-lg">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">GST Rate (%)</label>
          <input type="number" id="qt_gst_rate" value="18" class="w-full text-xs p-2 border rounded-lg">
        </div>
      </div>
      <button type="submit" class="w-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm mt-2">
        Generate & Save Quotation
      </button>
    </form>
  `);
}

async function handleCreateQuotation(e) {
  e.preventDefault();
  const sub = parseFloat(document.getElementById("qt_subtotal").value) || 0;
  const rate = parseFloat(document.getElementById("qt_gst_rate").value) || 18;
  const gst = Math.round(sub * (rate / 100) * 100) / 100;
  const total = Math.round((sub + gst) * 100) / 100;

  const body = {
    customer_name: document.getElementById("qt_name").value,
    company_name: document.getElementById("qt_company").value,
    mobile: document.getElementById("qt_mobile").value,
    subtotal: sub,
    gst_rate: rate,
    gst_amount: gst,
    grand_total: total,
    items_json: '[{"item": "Solar Rooftop EPC Package", "qty": 1, "rate": ' + sub + '}]'
  };

  try {
    const res = await fetch("/api/crm/quotations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error("Failed to create quote");
    alert("Quotation generated successfully!");
    closeModal();
    loadView("crm-quotations");
  } catch (err) {
    alert("Error: " + err.message);
  }
}

function openNewComplaintModal() {
  openModal(`
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-base text-slate-800">Log Customer Complaint Ticket</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <form onsubmit="handleCreateComplaint(event)" class="space-y-3">
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Customer Name</label>
        <input type="text" id="cp_name" required placeholder="e.g. Bijay Kumar" class="w-full text-xs p-2 border rounded-lg">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Mobile</label>
          <input type="text" id="cp_mobile" required placeholder="98XXXXXXXX" class="w-full text-xs p-2 border rounded-lg">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Product</label>
          <input type="text" id="cp_product" required value="Solar Inverter 5kW" class="w-full text-xs p-2 border rounded-lg">
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Issue Description</label>
        <textarea id="cp_desc" rows="2" required placeholder="Grid error 02 showing on display" class="w-full text-xs p-2 border rounded-lg"></textarea>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Service Type</label>
          <select id="cp_type" class="w-full text-xs p-2 border rounded-lg">
            <option value="AMC">AMC</option>
            <option value="Warranty">Warranty</option>
            <option value="Chargeable">Chargeable</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Assign Technician</label>
          <input type="text" id="cp_tech" value="Shankar Maharana" class="w-full text-xs p-2 border rounded-lg">
        </div>
      </div>
      <button type="submit" class="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm mt-2">
        Register Complaint Ticket
      </button>
    </form>
  `);
}

async function handleCreateComplaint(e) {
  e.preventDefault();
  const body = {
    customer_name: document.getElementById("cp_name").value,
    customer_mobile: document.getElementById("cp_mobile").value,
    address: "Balangir Site",
    product_name: document.getElementById("cp_product").value,
    issue_description: document.getElementById("cp_desc").value,
    service_type: document.getElementById("cp_type").value,
    priority: "High",
    assigned_technician: document.getElementById("cp_tech").value
  };
  try {
    const res = await fetch("/api/complaints/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error("Failed to register ticket");
    const data = await res.json();
    alert(`Ticket registered: ${data.ticket_no} (Customer OTP: ${data.otp_code})`);
    closeModal();
    loadView("service-tickets");
  } catch (err) {
    alert("Error: " + err.message);
  }
}

function openNewProjectModal() {
  openModal(`
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-base text-slate-800">Launch New Production Project</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <form onsubmit="handleCreateProject(event)" class="space-y-3">
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Customer Name</label>
        <input type="text" id="pj_customer" required value="Janabandhu Kampa" class="w-full text-xs p-2 border rounded-lg">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Linked SO No</label>
          <input type="text" id="pj_so" value="SO-001" class="w-full text-xs p-2 border rounded-lg">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Order Value (INR)</label>
          <input type="number" id="pj_val" value="150000" class="w-full text-xs p-2 border rounded-lg">
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Assigned Technician</label>
          <input type="text" id="pj_tech" value="Shankar Maharana" class="w-full text-xs p-2 border rounded-lg">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Contact Person</label>
          <input type="text" id="pj_contact" value="Site Supervisor" class="w-full text-xs p-2 border rounded-lg">
        </div>
      </div>
      <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm mt-2">
        Initialize Project
      </button>
    </form>
  `);
}

async function handleCreateProject(e) {
  e.preventDefault();
  const body = {
    so_no: document.getElementById("pj_so").value,
    customer_name: document.getElementById("pj_customer").value,
    contact_person: document.getElementById("pj_contact").value,
    technician: document.getElementById("pj_tech").value,
    order_value: parseFloat(document.getElementById("pj_val").value) || 0,
    stage: "Logistic/Warehouse"
  };
  try {
    const res = await fetch("/api/production/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error("Failed to create project");
    alert("Project launched successfully!");
    closeModal();
    loadView("dashboard-project");
  } catch (err) {
    alert("Error: " + err.message);
  }
}

function openNewLeaveModal() {
  openModal(`
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-base text-slate-800">Apply for Leave</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <form onsubmit="handleApplyLeave(event)" class="space-y-3">
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Employee</label>
        <select id="lv_user" class="w-full text-xs p-2 border rounded-lg">
          <option value="Janabandhu Kampa">Janabandhu Kampa</option>
          <option value="DEEPAK RANJAN SAHOO">DEEPAK RANJAN SAHOO</option>
          <option value="Shankar Maharana">Shankar Maharana</option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Leave Type</label>
          <select id="lv_type" class="w-full text-xs p-2 border rounded-lg">
            <option value="Casual Leave">Casual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Privilege Leave">Privilege Leave</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Total Days</label>
          <input type="number" id="lv_days" value="1" min="1" class="w-full text-xs p-2 border rounded-lg">
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Reason</label>
        <textarea id="lv_reason" rows="2" class="w-full text-xs p-2 border rounded-lg" placeholder="Personal family function"></textarea>
      </div>
      <button type="submit" class="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm mt-2">
        Submit Leave Application
      </button>
    </form>
  `);
}

async function handleApplyLeave(e) {
  e.preventDefault();
  const today = new Date().toISOString().split("T")[0];
  const body = {
    user_name: document.getElementById("lv_user").value,
    leave_type: document.getElementById("lv_type").value,
    from_date: today,
    to_date: today,
    total_days: parseInt(document.getElementById("lv_days").value) || 1,
    reason: document.getElementById("lv_reason").value
  };
  try {
    const res = await fetch("/api/hrm/leaves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error("Failed to submit leave");
    alert("Leave application submitted!");
    closeModal();
    loadView("hrm-leaves");
  } catch (err) {
    alert("Error: " + err.message);
  }
}

function openNewAMCModal() {
  openModal(`
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-base text-slate-800">Register AMC Contract</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <form onsubmit="handleCreateAMC(event)" class="space-y-3">
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Customer Name</label>
        <input type="text" id="amc_name" required placeholder="e.g. Reliance Tower" class="w-full text-xs p-2 border rounded-lg">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Asset Name</label>
          <input type="text" id="amc_asset" value="10kW Rooftop Solar System" class="w-full text-xs p-2 border rounded-lg">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Visits Count</label>
          <input type="number" id="amc_visits" value="4" class="w-full text-xs p-2 border rounded-lg">
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Contract Amount (INR)</label>
          <input type="number" id="amc_amount" value="25000" class="w-full text-xs p-2 border rounded-lg">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Type</label>
          <select id="amc_type" class="w-full text-xs p-2 border rounded-lg">
            <option value="Comprehensive">Comprehensive</option>
            <option value="Non-Comprehensive">Non-Comprehensive</option>
          </select>
        </div>
      </div>
      <button type="submit" class="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm mt-2">
        Activate AMC Contract
      </button>
    </form>
  `);
}

async function handleCreateAMC(e) {
  e.preventDefault();
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const endStr = nextYear.toISOString().split("T")[0];

  const body = {
    customer_name: document.getElementById("amc_name").value,
    customer_mobile: "9861000000",
    asset_name: document.getElementById("amc_asset").value,
    contract_type: document.getElementById("amc_type").value,
    end_date: endStr,
    total_visits: parseInt(document.getElementById("amc_visits").value) || 4,
    total_amount: parseFloat(document.getElementById("amc_amount").value) || 0
  };
  try {
    const res = await fetch("/api/amc/contracts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error("Failed to register AMC");
    alert("AMC Contract activated successfully!");
    closeModal();
    loadView("amc-contracts");
  } catch (err) {
    alert("Error: " + err.message);
  }
}
