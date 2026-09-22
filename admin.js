/**
 * BLACKOUT PROTOCOL: Admin & Game Master Command Portal
 * Complete Event Management Suite:
 * 1. Master Round Controller: Start & Stop Round 1, 2, 3, 4 with real-time sync.
 * 2. Official Attendance Page: Number of students, student names, PRN numbers, status, and manual check-in.
 * 3. Round Qualifiers: Students ranked strictly by least time taken among correct answers, with 1-click official qualification for next round.
 * 4. Live Submissions Feed: Real-time stream of all attempts with CORRECT / WRONG badges.
 * 5. All Students Roster: Searchable master database with infractions and revive controls.
 * 6. 16-Case Solution Matrix & Instant PRN Lookup.
 * 7. High-Contrast A4 QR Posters Generator for physical station setup.
 */

const AdminPortal = (function () {
  let isAuthenticated = false;
  let activeTab = "rounds"; // 'rounds' | 'attendance' | 'qualifiers' | 'feed' | 'roster' | 'solutions' | 'prn' | 'posters' | 'session'
  let currentQualifierRound = 1;
  let rosterFilter = "all";
  let rosterSearchQuery = "";
  let attendanceSearchQuery = "";
  let adminPollTimer = null;

  function escapeHtml(str) {
    if (typeof window.escapeHtml === "function") return window.escapeHtml(str);
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function init() {
    const btnOpenAdmin = document.getElementById("btnOpenAdmin");
    if (btnOpenAdmin) {
      btnOpenAdmin.addEventListener("click", openAdminModal);
    }

    // Global Hotkey (F2 or Ctrl+Shift+A)
    document.addEventListener("keydown", e => {
      if (
        e.key === "F2" ||
        (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a"))
      ) {
        e.preventDefault();
        openAdminModal();
      }
    });

    // Real-time synchronization
    const syncEvents = ["blackout_submission", "blackout_roster_update", "blackout_attendance_update", "blackout_round_update"];
    syncEvents.forEach(evt => {
      window.addEventListener(evt, () => {
        const modal = document.getElementById("adminModal");
        if (modal && modal.style.display === "flex" && isAuthenticated) {
          renderAdminDashboard(modal);
        }
      });
    });

    window.addEventListener("storage", e => {
      if (
        e.key === "BLACKOUT_EVENT_SUBMISSIONS" ||
        e.key === "BLACKOUT_STUDENTS_ROSTER" ||
        e.key === "BLACKOUT_ATTENDANCE_LOG" ||
        e.key === "BLACKOUT_GLOBAL_ROUND_STATE"
      ) {
        const modal = document.getElementById("adminModal");
        if (modal && modal.style.display === "flex" && isAuthenticated) {
          renderAdminDashboard(modal);
        }
      }
    });
  }

  function openAdminModal() {
    let modal = document.getElementById("adminModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "adminModal";
      modal.className = "admin-modal-backdrop";
      document.body.appendChild(modal);
    }
    modal.style.display = "flex";

    if (!isAuthenticated) {
      renderAdminLogin(modal);
    } else {
      renderAdminDashboard(modal);
      startAdminLivePoll(modal);
    }
  }

  function closeAdminModal() {
    const modal = document.getElementById("adminModal");
    if (modal) modal.style.display = "none";
    if (adminPollTimer) {
      clearInterval(adminPollTimer);
      adminPollTimer = null;
    }
  }

  function startAdminLivePoll(modal) {
    if (adminPollTimer) clearInterval(adminPollTimer);
    adminPollTimer = setInterval(async () => {
      if (modal.style.display !== "none" && isAuthenticated) {
        if (window.AppEngine && window.AppEngine.syncFromBackend) {
          await window.AppEngine.syncFromBackend();
        }
        // Re-render only if modal is open and active
        if (modal.style.display !== "none") {
          renderAdminDashboard(modal);
        }
      } else {
        clearInterval(adminPollTimer);
        adminPollTimer = null;
      }
    }, 2500);
  }

  function renderAdminLogin(modal) {
    modal.innerHTML = `
      <div class="admin-window" style="max-width:460px;">
        <div class="admin-window-header">
          <div style="font-family:var(--font-display);font-size:1.1rem;color:var(--neon-cyan);font-weight:800;">
            GAME MASTER AUTHENTICATION
          </div>
          <button id="btnCloseAdmin" class="btn-cyber-sm">&times;</button>
        </div>
        <div class="admin-window-body">
          <p style="font-size:0.85rem;color:var(--text-secondary);">
            Enter the Master Security Clearance Key to manage event attendance, control round start/stop, qualify students, and inspect solutions.
          </p>
          <div class="form-field-group">
            <label class="form-label">MASTER PASSWORD</label>
            <input type="password" id="adminPassInput" class="form-input" placeholder="e.g. CYBER-ADMIN-2026 or admin" autocomplete="off" autofocus />
            <div style="font-size:0.75rem;color:var(--neon-cyan);margin-top:0.4rem;display:flex;justify-content:space-between;align-items:center;">
              <span>Key: <strong>CYBER-ADMIN-2026</strong></span>
              <button type="button" id="btnQuickKey" class="btn-cyber-sm" style="padding:0.25rem 0.6rem;font-size:0.72rem;border-color:var(--neon-cyan);background:rgba(0,240,255,0.15)">
                ⚡ Quick Login
              </button>
            </div>
          </div>
          <button id="btnSubmitAdminPass" class="btn-submit-cyber" style="padding:0.75rem 1rem;">
            AUTHENTICATE COMMAND CENTER
          </button>
          <div id="adminAuthMsg" style="font-family:var(--font-mono);font-size:0.82rem;color:var(--neon-red);text-align:center;"></div>
        </div>
      </div>
    `;

    document.getElementById("btnCloseAdmin").addEventListener("click", closeAdminModal);

    const btnQuickKey = document.getElementById("btnQuickKey");
    if (btnQuickKey) {
      btnQuickKey.addEventListener("click", () => {
        const passField = document.getElementById("adminPassInput");
        passField.value = "CYBER-ADMIN-2026";
        document.getElementById("btnSubmitAdminPass").click();
      });
    }

    document.getElementById("btnSubmitAdminPass").addEventListener("click", () => {
      const input = document.getElementById("adminPassInput").value.trim();
      if (window.CryptoEngine.verifyAdmin(input)) {
        isAuthenticated = true;
        renderAdminDashboard(modal);
      } else {
        document.getElementById("adminAuthMsg").innerText = "ACCESS DENIED: Invalid Master Key.";
      }
    });

    document.getElementById("adminPassInput").addEventListener("keypress", e => {
      if (e.key === "Enter") {
        document.getElementById("btnSubmitAdminPass").click();
      }
    });
  }

  function renderAdminDashboard(modal) {
    const session = window.AppEngine.getSession();
    const submissions = window.AppEngine.getSubmissions ? window.AppEngine.getSubmissions() : [];
    const roster = window.AppEngine.getRoster ? window.AppEngine.getRoster() : [];
    const attendance = window.AppEngine.getAttendance ? window.AppEngine.getAttendance() : [];
    const roundState = window.AppEngine.getRoundState ? window.AppEngine.getRoundState() : {};
    const originUrl = window.location.origin + window.location.pathname;

    modal.innerHTML = `
      <div class="admin-window">
        <!-- Top Command Header -->
        <div class="admin-window-header">
          <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
            <div style="font-family:var(--font-display);font-size:1.15rem;color:var(--neon-cyan);font-weight:900;letter-spacing:1px;">
              BLACKOUT PROTOCOL // GAME MASTER OVERSEER
            </div>
            <span class="email-badge" style="background:rgba(0,255,136,0.15);color:var(--neon-green)">ONLINE &bull; FULL CONTROL</span>
          </div>
          <div style="display:flex;gap:0.5rem;align-items:center;">
            <button id="btnSeedDemo" class="btn-cyber-sm" style="border-color:var(--neon-amber);color:var(--neon-amber);" title="Populate demo students, attendance, & submissions">
              ⚡ Seed Demo Event Data
            </button>
            <button id="btnCloseAdmin" class="btn-cyber-sm">&times; CLOSE</button>
          </div>
        </div>

        <!-- Navigation Tabs Bar -->
        <div style="background:#050a14;padding:0.5rem 1.5rem 0 1.5rem;border-bottom:1px solid var(--border-subtle);">
          <div class="admin-nav-tabs">
            <button class="admin-tab-btn ${activeTab === 'rounds' ? 'active' : ''}" data-tab="rounds">
              🎮 ROUND CONTROLLER
            </button>
            <button class="admin-tab-btn ${activeTab === 'attendance' ? 'active' : ''}" data-tab="attendance">
              📋 ATTENDANCE ROSTER (${attendance.length})
            </button>
            <button class="admin-tab-btn ${activeTab === 'qualifiers' ? 'active' : ''}" data-tab="qualifiers">
              🏆 QUALIFIERS & ADVANCEMENT
            </button>
            <button class="admin-tab-btn ${activeTab === 'feed' ? 'active' : ''}" data-tab="feed">
              📊 LIVE SUBMISSIONS (${submissions.length})
            </button>
            <button class="admin-tab-btn ${activeTab === 'roster' ? 'active' : ''}" data-tab="roster">
              👥 ALL STUDENTS (${roster.length})
            </button>
            <button class="admin-tab-btn ${activeTab === 'solutions' ? 'active' : ''}" data-tab="solutions">
              🔑 16-CASE SOLUTION KEY
            </button>
            <button class="admin-tab-btn ${activeTab === 'prn' ? 'active' : ''}" data-tab="prn">
              🔍 PRN LOOKUP
            </button>
            <button class="admin-tab-btn ${activeTab === 'posters' ? 'active' : ''}" data-tab="posters">
              🖨️ PRINT A4 QR POSTERS
            </button>
            <button class="admin-tab-btn ${activeTab === 'session' ? 'active' : ''}" data-tab="session">
              ⚙️ TERMINAL OVERRIDES
            </button>
          </div>
        </div>

        <!-- Main Tab Content Body -->
        <div class="admin-window-body" id="adminTabContent">
          ${renderActiveTabContent(session, submissions, roster, attendance, roundState, originUrl)}
        </div>
      </div>
    `;

    document.getElementById("btnCloseAdmin").addEventListener("click", closeAdminModal);

    const btnSeedDemo = document.getElementById("btnSeedDemo");
    if (btnSeedDemo) {
      btnSeedDemo.addEventListener("click", async () => {
        if (confirm("Populate sample student attendance, roster, and submissions across rounds for demonstration in Neon DB?")) {
          btnSeedDemo.disabled = true;
          btnSeedDemo.innerText = "Seeding Neon DB...";
          try {
            await fetch("/api/admin/seed", { method: "POST" });
            if (window.AppEngine.syncFromBackend) await window.AppEngine.syncFromBackend();
          } catch (e) {
            if (window.AppEngine.seedDemoData) window.AppEngine.seedDemoData();
          }
          renderAdminDashboard(modal);
        }
      });
    }

    modal.querySelectorAll(".admin-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        activeTab = btn.getAttribute("data-tab");
        renderAdminDashboard(modal);
      });
    });

    attachTabSpecificHandlers(modal, session, submissions, roster, attendance, roundState, originUrl);
  }

  function renderActiveTabContent(session, submissions, roster, attendance, roundState, originUrl) {
    switch (activeTab) {
      case "rounds":
        return renderRoundControllerTab(roundState, submissions, roster);
      case "attendance":
        return renderAttendanceTab(attendance);
      case "qualifiers":
        return renderQualifiersTab(submissions, roster, roundState);
      case "feed":
        return renderSubmissionsFeedTab(submissions);
      case "roster":
        return renderRosterTab(roster);
      case "solutions":
        return renderSolutionsTab();
      case "prn":
        return renderPrnLookupTab();
      case "posters":
        return renderPostersTab(originUrl);
      case "session":
        return renderSessionTab(session);
      default:
        return renderRoundControllerTab(roundState, submissions, roster);
    }
  }

  // TAB 1: MASTER ROUND CONTROLLER (START, STOP & DIRECT QUALIFICATION)
  function renderRoundControllerTab(roundState, submissions = [], roster = []) {
    const r1 = roundState.round1 || { status: "RUNNING" };
    const r2 = roundState.round2 || { status: "LOCKED" };
    const r3 = roundState.round3 || { status: "LOCKED" };
    const r4 = roundState.round4 || { status: "LOCKED" };

    const q2List = roundState.qualifiedRound2 || [];
    const q3List = roundState.qualifiedRound3 || [];
    const q4List = roundState.qualifiedRound4 || [];

    // Helper to get verified candidate count for a round
    function getVerifiedCandidateCount(station) {
      const subPrns = submissions.filter(s => s.isCorrect && parseInt(s.stationNum, 10) === station && s.prn).map(s => String(s.prn).trim().toUpperCase());
      const rosPrns = roster.filter(r => !r.isEliminated && r.completedStations && r.completedStations.includes(station) && r.prn).map(r => String(r.prn).trim().toUpperCase());
      return Array.from(new Set([...subPrns, ...rosPrns])).length;
    }

    function renderRoundCard(num, name, stateObj, qList, targetRound) {
      const isRunning = stateObj.status === "RUNNING";
      const isStopped = stateObj.status === "STOPPED";

      let statusBadge = "";
      if (isRunning) {
        statusBadge = `<span class="status-tag correct" style="font-size:0.8rem;padding:0.3rem 0.75rem;">▶️ RUNNING (ACTIVE)</span>`;
      } else if (isStopped) {
        statusBadge = `<span class="status-tag" style="background:rgba(255,184,0,0.2);color:var(--neon-amber);border:1px solid var(--neon-amber);font-size:0.8rem;padding:0.3rem 0.75rem;">⏸️ PAUSED / STOPPED</span>`;
      } else {
        statusBadge = `<span class="status-tag" style="background:rgba(255,255,255,0.1);color:#aaa;border:1px solid #555;font-size:0.8rem;padding:0.3rem 0.75rem;">🔒 LOCKED</span>`;
      }

      const verifiedCount = num < 4 ? getVerifiedCandidateCount(num) : 0;
      const nextRound = num + 1;

      return `
        <div style="background:#040810;border:1px solid ${isRunning ? 'var(--neon-green)' : isStopped ? 'var(--neon-amber)' : 'var(--border-subtle)'};border-radius:8px;padding:1.25rem;display:flex;flex-direction:column;gap:0.85rem;">
          <!-- Top Row: Name, Status & Start/Stop -->
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
            <div>
              <div style="font-family:var(--font-display);font-size:1.05rem;color:#fff;font-weight:800;">
                STATION 0${num}: ${escapeHtml(name)}
              </div>
              <div style="font-family:var(--font-mono);font-size:0.8rem;color:var(--text-secondary);margin-top:0.25rem;">
                ${num > 1 ? `Clearance List: <strong style="color:var(--neon-cyan);">${qList.length} Officially Qualified Finalists</strong>` : 'Open Entry Station for all registered students (Round 1)'}
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
              ${statusBadge}
              ${isRunning ? `
                <button class="btn-cyber-danger-sm btn-round-action" data-action="stop" data-round="${num}" style="padding:0.5rem 1rem;">
                  ⏹️ STOP ROUND 0${num}
                </button>
              ` : `
                <button class="btn-cyber-sm btn-round-action" data-action="start" data-round="${num}" style="background:rgba(0,255,136,0.15);color:var(--neon-green);border-color:var(--neon-green);padding:0.5rem 1rem;font-weight:700;">
                  ▶️ START ROUND 0${num}
                </button>
              `}
            </div>
          </div>

          <!-- Qualification Advancement Box for Round num -> nextRound -->
          ${num < 4 ? `
            <div style="background:rgba(0,0,0,0.35);border:1px solid rgba(0,240,255,0.25);border-radius:6px;padding:0.75rem 1rem;">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.5rem;">
                <div style="font-family:var(--font-mono);font-size:0.8rem;color:var(--neon-cyan);font-weight:700;">
                  ADVANCE TO ROUND 0${nextRound} (${verifiedCount} Verified Analysts in Round 0${num})
                </div>
                <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
                  <button class="btn-cyber-sm btn-quick-qualify-all" data-round="${num}" style="font-size:0.75rem;padding:0.3rem 0.65rem;background:rgba(0,255,136,0.15);color:var(--neon-green);border-color:var(--neon-green)">
                    ⚡ Qualify All Verified (${verifiedCount})
                  </button>
                  <button class="btn-cyber-sm btn-quick-qualify-top" data-round="${num}" data-count="3" style="font-size:0.75rem;padding:0.3rem 0.65rem;color:var(--neon-cyan);border-color:var(--neon-cyan)">
                    ⭐ Top 3
                  </button>
                  <button class="btn-cyber-sm btn-quick-qualify-top" data-round="${num}" data-count="5" style="font-size:0.75rem;padding:0.3rem 0.65rem;color:var(--neon-cyan);border-color:var(--neon-cyan)">
                    ⭐ Top 5
                  </button>
                </div>
              </div>

              <!-- Manual PRN Quick-Add Input -->
              <form class="form-quick-add-prn" data-round="${nextRound}" style="display:flex;gap:0.4rem;align-items:center;margin-top:0.4rem;">
                <input type="text" class="form-input input-manual-prn" placeholder="Manually qualify PRN for Round 0${nextRound}..." style="width:240px;padding:0.3rem 0.6rem;font-size:0.78rem;" required />
                <button type="submit" class="btn-cyber-sm" style="font-size:0.75rem;padding:0.3rem 0.75rem;color:var(--neon-green);border-color:var(--neon-green);">
                  + Grant Clearance
                </button>
              </form>
            </div>
          ` : ""}

          <!-- Current Qualified Students Display -->
          ${num > 1 && qList.length > 0 ? `
            <div style="display:flex;flex-wrap:wrap;gap:0.4rem;align-items:center;">
              <span style="font-size:0.75rem;color:var(--neon-cyan);font-family:var(--font-mono);font-weight:700;">CLEARED AGENTS (${qList.length}):</span>
              ${qList.slice(0, 15).map(p => `
                <span class="email-badge" style="font-size:0.72rem;padding:0.2rem 0.5rem;display:inline-flex;align-items:center;gap:0.35rem;background:rgba(0,255,136,0.1);color:var(--neon-green);border-color:rgba(0,255,136,0.4);">
                  ${escapeHtml(p)}
                  <button class="btn-revoke-qualify" data-round="${num}" data-prn="${escapeHtml(p)}" style="background:none;border:none;color:var(--neon-red);cursor:pointer;font-weight:900;font-size:0.8rem;padding:0;line-height:1;" title="Revoke Clearance">&times;</button>
                </span>
              `).join("")}
              ${qList.length > 15 ? `<span style="font-size:0.75rem;color:var(--text-muted);font-family:var(--font-mono);">+${qList.length - 15} more</span>` : ""}
            </div>
          ` : num > 1 ? `
            <div style="font-size:0.78rem;color:var(--text-muted);font-family:var(--font-mono);">
              No students officially qualified for Round 0${num} yet. Use the qualify buttons above or the Qualifiers tab.
            </div>
          ` : ""}
        </div>
      `;
    }

    return `
      <div style="display:flex;flex-direction:column;gap:1.25rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
          <div>
            <h3 style="font-family:var(--font-mono);font-size:0.95rem;color:var(--neon-cyan);text-transform:uppercase;">
              Game Master Master Round Controls &amp; Instant Qualification
            </h3>
            <p style="font-size:0.82rem;color:var(--text-secondary);margin-top:0.2rem;">
              Control Start/Stop for each station and instantly qualify students for subsequent rounds with 1-click.
            </p>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:1rem;">
          ${renderRoundCard(1, "SPOOFED ORIGIN (ROUND 1)", r1, [], 2)}
          ${renderRoundCard(2, "DIGITAL SHADOW (ROUND 2)", r2, q2List, 3)}
          ${renderRoundCard(3, "DOMAIN MIRAGE (ROUND 3)", r3, q3List, 4)}
          ${renderRoundCard(4, "10-MIN BLACKOUT (FINAL ROUND 4)", r4, q4List, null)}
        </div>
      </div>
    `;
  }

  // TAB 2: ATTENDANCE ROSTER & CHECK-IN
  function renderAttendanceTab(attendance) {
    const total = attendance.length;
    const present = attendance.filter(a => a.status === "PRESENT" || a.status === "CHECKED_IN" || a.status === "IN_TERMINAL").length;
    const eliminated = attendance.filter(a => a.status === "ELIMINATED").length;
    const escaped = attendance.filter(a => a.status === "ESCAPED").length;

    let filtered = attendance.filter(a => {
      const q = attendanceSearchQuery.trim().toUpperCase();
      if (!q) return true;
      return (a.name && a.name.toUpperCase().includes(q)) || (a.prn && a.prn.toUpperCase().includes(q));
    });

    return `
      <div style="display:flex;flex-direction:column;gap:1.25rem;">
        <!-- KPI Header -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:0.75rem;">
          <div style="background:#040810;border:1px solid var(--border-subtle);border-radius:6px;padding:0.75rem;text-align:center;">
            <div style="font-size:0.75rem;color:var(--text-muted);font-family:var(--font-mono);">TOTAL ATTENDANCE</div>
            <div style="font-size:1.5rem;font-weight:900;color:#fff;">${total}</div>
          </div>
          <div style="background:#040810;border:1px solid rgba(0,255,136,0.3);border-radius:6px;padding:0.75rem;text-align:center;">
            <div style="font-size:0.75rem;color:var(--neon-green);font-family:var(--font-mono);">PRESENT / CHECKED-IN</div>
            <div style="font-size:1.5rem;font-weight:900;color:var(--neon-green);">${present}</div>
          </div>
          <div style="background:#040810;border:1px solid rgba(255,0,85,0.3);border-radius:6px;padding:0.75rem;text-align:center;">
            <div style="font-size:0.75rem;color:var(--neon-red);font-family:var(--font-mono);">ELIMINATED</div>
            <div style="font-size:1.5rem;font-weight:900;color:var(--neon-red);">${eliminated}</div>
          </div>
          <div style="background:#040810;border:1px solid #ffd700;border-radius:6px;padding:0.75rem;text-align:center;">
            <div style="font-size:0.75rem;color:#ffd700;font-family:var(--font-mono);">SURVIVORS / ESCAPED</div>
            <div style="font-size:1.5rem;font-weight:900;color:#ffd700;">${escaped}</div>
          </div>
        </div>

        <!-- Manual Check-In Form -->
        <div style="background:#040810;border:1px solid var(--border-subtle);border-radius:8px;padding:1rem;">
          <div style="font-family:var(--font-mono);font-size:0.85rem;color:var(--neon-cyan);text-transform:uppercase;margin-bottom:0.6rem;">
            Quick Student Check-In (Registration Desk)
          </div>
          <form id="attendanceCheckinForm" style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <input type="text" id="attNameInput" class="form-input" style="flex:1;min-width:200px;padding:0.5rem 0.8rem;font-size:0.85rem;" placeholder="Student Full Name (e.g. Alex Mercer)..." required />
            <input type="text" id="attPrnInput" class="form-input" style="width:200px;padding:0.5rem 0.8rem;font-size:0.85rem;" placeholder="College PRN (e.g. 2024010529)..." required />
            <button type="submit" class="btn-submit-cyber" style="width:auto;padding:0.5rem 1.25rem;font-size:0.85rem;">
              + CHECK IN STUDENT
            </button>
          </form>
        </div>

        <!-- Search & Export Bar -->
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
          <input type="text" id="attSearchInput" class="form-input" style="width:240px;padding:0.4rem 0.75rem;font-size:0.8rem;" placeholder="Search Name or PRN..." value="${escapeHtml(attendanceSearchQuery)}" />
          <div style="display:flex;gap:0.5rem;">
            <button id="btnCopyAttendance" class="btn-cyber-sm" style="border-color:var(--neon-cyan);color:var(--neon-cyan)">📋 Copy CSV</button>
            <button id="btnClearAttendance" class="btn-cyber-danger-sm">🗑️ Clear Attendance</button>
          </div>
        </div>

        <!-- Attendance Table -->
        <div style="overflow-x:auto;">
          <table class="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>College PRN</th>
                <th>Profile</th>
                <th>Check-In Time</th>
                <th>Attendance Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length === 0 ? `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:2rem;">No student attendance records matching search.</td></tr>` : filtered.map((st, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><strong>${escapeHtml(st.name)}</strong></td>
                  <td><strong style="color:var(--neon-cyan);">${escapeHtml(st.prn)}</strong></td>
                  <td><span class="email-badge">${escapeHtml(st.codeProfile || "------")}</span></td>
                  <td><small style="color:var(--text-muted);">${escapeHtml(st.timeStr || "Earlier")}</small></td>
                  <td>
                    ${st.status === "ESCAPED" ? `<span class="status-tag correct" style="background:#ffd700;color:#000;">🏆 ESCAPED</span>` :
                      st.status === "ELIMINATED" ? `<span class="status-tag wrong">🚨 ELIMINATED</span>` :
                      `<span class="status-tag correct">✓ PRESENT</span>`}
                  </td>
                  <td>
                    <div style="display:flex;gap:0.3rem;flex-wrap:wrap;align-items:center;">
                      <button class="btn-cyber-sm btn-toggle-att-status" data-prn="${escapeHtml(st.prn)}" data-status="${st.status === 'PRESENT' ? 'ABSENT' : 'PRESENT'}" style="padding:0.2rem 0.45rem;font-size:0.7rem;">
                        Toggle Status
                      </button>
                      <button class="btn-cyber-sm btn-att-qualify" data-prn="${escapeHtml(st.prn)}" data-round="2" style="padding:0.2rem 0.45rem;font-size:0.68rem;color:var(--neon-green);border-color:var(--neon-green);" title="Qualify for Round 2">
                        + R2
                      </button>
                      <button class="btn-cyber-sm btn-att-qualify" data-prn="${escapeHtml(st.prn)}" data-round="3" style="padding:0.2rem 0.45rem;font-size:0.68rem;color:var(--neon-cyan);border-color:var(--neon-cyan);" title="Qualify for Round 3">
                        + R3
                      </button>
                      <button class="btn-cyber-sm btn-att-qualify" data-prn="${escapeHtml(st.prn)}" data-round="4" style="padding:0.2rem 0.45rem;font-size:0.68rem;color:#ffd700;border-color:#ffd700;" title="Qualify for Round 4">
                        + R4
                      </button>
                      <button class="btn-cyber-danger-sm btn-delete-user" data-prn="${escapeHtml(st.prn)}" data-name="${escapeHtml(st.name)}" style="padding:0.2rem 0.45rem;font-size:0.68rem;" title="Permanently Delete Student from Database">
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // TAB 3: QUALIFIERS (FASTEST FIRST + OFFICIAL ADVANCEMENT BUTTON)
  function renderQualifiersTab(submissions = [], roster = [], roundState = {}) {
    let html = `
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
          <div>
            <h3 style="font-family:var(--font-mono);font-size:0.95rem;color:var(--neon-cyan);text-transform:uppercase;">
              Round Qualifiers &amp; Automated Selection (Fastest Clear Time)
            </h3>
            <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.2rem;">
              Correct submissions are ranked strictly by least time taken. Use the qualification buttons below to grant official clearance to the next round.
            </p>
          </div>
          <button id="btnCopyQualifiers" class="btn-cyber-sm" style="border-color:var(--neon-green);color:var(--neon-green)">
            📋 Copy Leaderboard
          </button>
        </div>

        <!-- Round Selector Bar -->
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button class="btn-cyber-sm qualifier-round-btn ${currentQualifierRound === 1 ? 'active-round' : ''}" data-round="1">
            ROUND 1 ➔ ROUND 2 QUALIFIERS
          </button>
          <button class="btn-cyber-sm qualifier-round-btn ${currentQualifierRound === 2 ? 'active-round' : ''}" data-round="2">
            ROUND 2 ➔ ROUND 3 QUALIFIERS
          </button>
          <button class="btn-cyber-sm qualifier-round-btn ${currentQualifierRound === 3 ? 'active-round' : ''}" data-round="3">
            ROUND 3 ➔ FINAL ROUND 4 QUALIFIERS
          </button>
          <button class="btn-cyber-sm qualifier-round-btn ${currentQualifierRound === 4 ? 'active-round' : ''}" data-round="4" style="border-color:var(--neon-green);color:var(--neon-green);">
            🏆 FINAL BLACKOUT CHAMPIONS
          </button>
          <button class="btn-cyber-sm qualifier-round-btn ${currentQualifierRound === 'eliminated' ? 'active-round' : ''}" data-round="eliminated" style="border-color:var(--neon-red);color:var(--neon-red);">
            🚨 ELIMINATED POOL
          </button>
        </div>
    `;

    if (currentQualifierRound === "eliminated") {
      const eliminated = submissions.filter(s => !s.isCorrect);
      html += `
        <div style="overflow-x:auto;">
          <table class="admin-table">
            <thead>
              <tr><th>#</th><th>Student Name</th><th>PRN Number</th><th>Station</th><th>Lockout Reason</th><th>Infraction Status</th></tr>
            </thead>
            <tbody>
              ${eliminated.length === 0 ? `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:2rem;">No students eliminated yet.</td></tr>` : eliminated.map((e, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><strong>${escapeHtml(e.studentName)}</strong></td>
                  <td><span style="color:var(--neon-cyan);">${escapeHtml(e.prn)}</span></td>
                  <td>Station ${e.stationNum}</td>
                  <td><span style="color:var(--neon-red);">${escapeHtml(e.failedQuestion || "Forensic Error")}</span></td>
                  <td><span class="status-tag wrong">${escapeHtml(e.status || "ELIMINATED")}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
      `;
      return html;
    }

    const roundNum = parseInt(currentQualifierRound, 10);
    const nextRound = roundNum < 4 ? roundNum + 1 : 4;

    // Discover candidates from BOTH submissions AND roster
    const candidateMap = new Map();
    submissions.forEach(sub => {
      const sNum = parseInt(sub.stationNum, 10);
      if (sub.isCorrect && sNum === roundNum && sub.prn) {
        const prnKey = String(sub.prn).trim().toUpperCase();
        if (!candidateMap.has(prnKey) || candidateMap.get(prnKey).elapsedSeconds > (sub.elapsedSeconds || 9999)) {
          candidateMap.set(prnKey, {
            prn: prnKey,
            studentName: sub.studentName || prnKey,
            codeProfile: sub.codeProfile || "PROFILE",
            elapsedSeconds: sub.elapsedSeconds || 60,
            elapsedFormatted: sub.elapsedFormatted || (sub.elapsedSeconds + "s"),
            stationNum: roundNum,
            isCorrect: true
          });
        }
      }
    });

    // Also include any student in roster who completed station roundNum without elimination
    roster.forEach(r => {
      if (!r.isEliminated && r.completedStations && r.completedStations.includes(roundNum) && r.prn) {
        const prnKey = String(r.prn).trim().toUpperCase();
        if (!candidateMap.has(prnKey)) {
          candidateMap.set(prnKey, {
            prn: prnKey,
            studentName: r.name || prnKey,
            codeProfile: r.codeProfile || "PROFILE",
            elapsedSeconds: 75,
            elapsedFormatted: "01:15",
            stationNum: roundNum,
            isCorrect: true
          });
        }
      }
    });

    const ranked = Array.from(candidateMap.values()).sort((a, b) => (a.elapsedSeconds || 9999) - (b.elapsedSeconds || 9999));
    const targetQualList = (roundState["qualifiedRound" + nextRound] || []).map(p => String(p).trim().toUpperCase());

    html += `
      <!-- Qualification Action Toolbar -->
      ${roundNum < 4 ? `
        <div style="background:#040810;border:1px solid var(--neon-cyan);border-radius:8px;padding:0.85rem 1.25rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
          <div>
            <span style="font-family:var(--font-mono);font-size:0.85rem;color:var(--neon-cyan);font-weight:700;">
              STEP 1: SELECT ROUND 0${nextRound} FINALISTS &bull; STEP 2: LAUNCH ROUND 0${nextRound}
            </span>
            <div style="font-size:0.78rem;color:var(--text-secondary);margin-top:0.2rem;">
              Qualified analysts are cleared to log into Round 0${nextRound} once started.
            </div>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
            <button id="btnQualifyAllCorrect" class="btn-cyber-sm" style="background:rgba(0,255,136,0.15);color:var(--neon-green);border-color:var(--neon-green)">
              ⚡ Approve All Verified (${ranked.length})
            </button>
            <button class="btn-cyber-sm btn-qualify-tier" data-count="3" style="color:var(--neon-cyan);border-color:var(--neon-cyan)">
              ⭐ Top 3
            </button>
            <button class="btn-cyber-sm btn-qualify-tier" data-count="5" style="color:var(--neon-cyan);border-color:var(--neon-cyan)">
              ⭐ Top 5
            </button>
            <button class="btn-cyber-sm btn-qualify-tier" data-count="10" style="color:var(--neon-cyan);border-color:var(--neon-cyan)">
              ⭐ Top 10
            </button>
            <form id="formManualQualify" style="display:inline-flex;gap:0.35rem;align-items:center;">
              <input type="text" id="manualQualPrnInput" class="form-input" placeholder="PRN to qualify..." style="width:130px;padding:0.35rem 0.5rem;font-size:0.75rem;" required />
              <button type="submit" class="btn-cyber-sm" style="color:var(--neon-green);border-color:var(--neon-green);font-size:0.75rem;padding:0.35rem 0.65rem;">+ Qualify</button>
            </form>
            <button class="btn-round-action btn-submit-cyber" data-action="start" data-round="${nextRound}" style="width:auto;padding:0.45rem 1.15rem;font-size:0.8rem;background:var(--neon-green);color:#000;border-color:var(--neon-green);font-weight:900;">
              ▶️ START ROUND 0${nextRound} NOW
            </button>
          </div>
        </div>
      ` : ""}

      <div style="overflow-x:auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Student Name</th>
              <th>College PRN</th>
              <th>Profile</th>
              <th>Clear Time</th>
              <th>Official Qualification Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${ranked.length === 0 ? `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:2rem;">No verified solutions for Station 0${roundNum} yet.</td></tr>` : ranked.map((st, idx) => {
              let rankBadge = `<span class="rank-badge rank-general">#${idx + 1}</span>`;
              if (idx === 0) rankBadge = `<span class="rank-badge rank-1">🥇 RANK 1</span>`;
              else if (idx === 1) rankBadge = `<span class="rank-badge rank-2">🥈 RANK 2</span>`;
              else if (idx === 2) rankBadge = `<span class="rank-badge rank-3">🥉 RANK 3</span>`;

              const cleanP = (st.prn || "").trim().toUpperCase();
              const isOfficiallyQualified = roundNum < 4 && targetQualList.includes(cleanP);
              const statusBadge = roundNum === 4
                ? `<span class="status-tag correct" style="background:#ffd700;color:#000;">🏆 ESCAPED CHAMPION</span>`
                : isOfficiallyQualified
                ? `<span class="status-tag correct">✓ QUALIFIED FOR ROUND 0${nextRound}</span>`
                : `<span class="status-tag" style="background:rgba(0,240,255,0.1);color:var(--neon-cyan);">ELIGIBLE (FASTEST #${idx + 1})</span>`;

              return `
                <tr>
                  <td>${rankBadge}</td>
                  <td><strong>${escapeHtml(st.studentName)}</strong></td>
                  <td><strong style="color:var(--neon-cyan);">${escapeHtml(st.prn)}</strong></td>
                  <td><span class="email-badge">${escapeHtml(st.codeProfile || "PROFILE")}</span></td>
                  <td><strong style="color:#ffffff;font-size:0.9rem;">${escapeHtml(st.elapsedFormatted || (st.elapsedSeconds + "s"))}</strong></td>
                  <td>${statusBadge}</td>
                  <td>
                    ${roundNum < 4 ? `
                      ${isOfficiallyQualified ? `
                        <button class="btn-cyber-sm btn-revoke-single-qualify" data-prn="${escapeHtml(st.prn)}" data-round="${nextRound}" style="padding:0.25rem 0.6rem;font-size:0.72rem;color:var(--neon-amber);border-color:var(--neon-amber);background:rgba(255,184,0,0.1);">
                          ✕ Revoke
                        </button>
                      ` : `
                        <button class="btn-cyber-sm btn-single-qualify" data-prn="${escapeHtml(st.prn)}" data-round="${nextRound}" style="padding:0.25rem 0.6rem;font-size:0.72rem;color:var(--neon-green);border-color:var(--neon-green);background:rgba(0,255,136,0.1);">
                          🛡️ Grant Clearance
                        </button>
                      `}
                    ` : `<span style="color:var(--neon-green);font-size:0.75rem;">Survivor</span>`}
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
    `;

    return html;
  }

  // TAB 4: LIVE SUBMISSIONS STREAM
  function renderSubmissionsFeedTab(submissions) {
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;margin-bottom:0.75rem;">
        <h3 style="font-family:var(--font-mono);font-size:0.95rem;color:var(--neon-cyan);text-transform:uppercase;">
          Real-Time Submissions Log (${submissions.length} total)
        </h3>
        <button id="btnClearSubmissions" class="btn-cyber-danger-sm">🗑️ Clear Submissions</button>
      </div>

      <div style="overflow-x:auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Time</th><th>Student Name</th><th>PRN Number</th><th>Station</th><th>Case Set</th><th>Clear Time</th><th>Result</th><th>Note</th>
            </tr>
          </thead>
          <tbody>
            ${submissions.length === 0 ? `<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:2rem;">No submissions yet. Standby for student activity.</td></tr>` : submissions.map(sub => `
              <tr>
                <td><small style="color:var(--text-muted);">${escapeHtml(sub.timeFormatted || "Just now")}</small></td>
                <td><strong>${escapeHtml(sub.studentName)}</strong></td>
                <td><span style="color:var(--neon-cyan);font-weight:700;">${escapeHtml(sub.prn)}</span></td>
                <td>Station ${sub.stationNum}</td>
                <td><span class="email-badge">Set ${escapeHtml(sub.caseLetter || "A")}</span></td>
                <td><strong style="color:#fff;">${escapeHtml(sub.elapsedFormatted || (sub.elapsedSeconds + "s"))}</strong></td>
                <td>${sub.isCorrect ? `<span class="status-tag correct">✓ CORRECT</span>` : `<span class="status-tag wrong">✗ WRONG</span>`}</td>
                <td>${sub.isCorrect ? `<span style="color:var(--neon-green);">${escapeHtml(sub.status || "Passed")}</span>` : `<span style="color:var(--neon-red);">${escapeHtml(sub.failedQuestion || "Failed")}</span>`}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  // TAB 5: ALL STUDENTS ROSTER
  function renderRosterTab(roster) {
    let filtered = roster.filter(st => {
      const q = rosterSearchQuery.trim().toUpperCase();
      const matchSearch = !q || (st.name && st.name.toUpperCase().includes(q)) || (st.prn && st.prn.toUpperCase().includes(q));
      if (!matchSearch) return false;
      if (rosterFilter === "active") return !st.isEliminated && !st.isEscaped;
      if (rosterFilter === "qualified") return st.completedStations && st.completedStations.length > 0 && !st.isEliminated;
      if (rosterFilter === "eliminated") return st.isEliminated;
      if (rosterFilter === "escaped") return st.isEscaped;
      return true;
    });

    return `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem;">
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button class="btn-cyber-sm roster-filter-btn ${rosterFilter === 'all' ? 'active-round' : ''}" data-filter="all">All (${roster.length})</button>
          <button class="btn-cyber-sm roster-filter-btn ${rosterFilter === 'active' ? 'active-round' : ''}" data-filter="active">Active</button>
          <button class="btn-cyber-sm roster-filter-btn ${rosterFilter === 'qualified' ? 'active-round' : ''}" data-filter="qualified">Qualified</button>
          <button class="btn-cyber-sm roster-filter-btn ${rosterFilter === 'eliminated' ? 'active-round' : ''}" data-filter="eliminated">Eliminated</button>
          <button class="btn-cyber-sm roster-filter-btn ${rosterFilter === 'escaped' ? 'active-round' : ''}" data-filter="escaped">Escaped</button>
        </div>
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <input type="text" id="rosterSearchInput" class="form-input" style="width:220px;padding:0.4rem 0.75rem;font-size:0.8rem;" placeholder="Search Name or PRN..." value="${escapeHtml(rosterSearchQuery)}" />
          <button id="btnClearRoster" class="btn-cyber-danger-sm">Clear Roster</button>
        </div>
      </div>

      <div style="overflow-x:auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>#</th><th>Student Name</th><th>PRN Number</th><th>Assigned Profile</th><th>Sets</th><th>Current Station</th><th>Status</th><th>Infractions</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length === 0 ? `<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:2rem;">No students found.</td></tr>` : filtered.map((st, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${escapeHtml(st.name)}</strong></td>
                <td><strong style="color:var(--neon-cyan);">${escapeHtml(st.prn)}</strong></td>
                <td><span class="email-badge">${escapeHtml(st.codeProfile || "------")}</span></td>
                <td><small>${st.assignedSets ? `S1:${st.assignedSets[1]} S2:${st.assignedSets[2]} S3:${st.assignedSets[3]} S4:${st.assignedSets[4]}` : "AUTO"}</small></td>
                <td>Station ${st.currentStation || 1}</td>
                <td>${st.isEliminated ? `<span class="status-tag wrong">🚨 ELIMINATED</span>` : st.isEscaped ? `<span class="status-tag correct" style="background:#ffd700;color:#000;">🏆 ESCAPED</span>` : `<span class="status-tag correct">ACTIVE</span>`}</td>
                <td>${st.tabInfractions > 0 ? `<span style="color:var(--neon-red);font-weight:700;">⚠️ ${st.tabInfractions}</span>` : `<span style="color:var(--text-muted);">0</span>`}</td>
                <td>
                  <div style="display:flex;gap:0.3rem;flex-wrap:wrap;align-items:center;">
                    ${st.isEliminated ? `<button class="btn-cyber-sm btn-revive-prn" data-prn="${escapeHtml(st.prn)}" style="padding:0.2rem 0.45rem;font-size:0.7rem;color:var(--neon-green);border-color:var(--neon-green)">🔓 Revive</button>` : ""}
                    ${!st.isEscaped ? `
                      <button class="btn-cyber-sm btn-roster-qualify-next" data-prn="${escapeHtml(st.prn)}" data-curr="${st.currentStation || 1}" style="padding:0.2rem 0.45rem;font-size:0.7rem;color:var(--neon-cyan);border-color:var(--neon-cyan)">
                        🏆 Qualify R${Math.min(4, (st.currentStation || 1) + 1)}
                      </button>
                    ` : `<span style="color:var(--neon-green);font-size:0.75rem;">Escaped</span>`}
                    <button class="btn-cyber-danger-sm btn-delete-user" data-prn="${escapeHtml(st.prn)}" data-name="${escapeHtml(st.name)}" style="padding:0.2rem 0.45rem;font-size:0.7rem;" title="Permanently Delete Student from Database">
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  // TAB 6: 16-CASE MASTER SOLUTION MATRIX
  function renderSolutionsTab() {
    return `
      <div style="background:#04070e;border:1px solid var(--border-subtle);border-radius:8px;padding:1rem;">
        <h3 style="font-family:var(--font-mono);font-size:0.9rem;color:var(--neon-amber);text-transform:uppercase;margin-bottom:0.75rem;">
          Master Solution Key Matrix (All 16 Station Cases)
        </h3>
        <div style="overflow-x:auto;">
          <table class="admin-table">
            <thead>
              <tr><th>Station</th><th>Case Set A</th><th>Case Set B</th><th>Case Set C</th><th>Case Set D</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>STATION 1</strong><br/><small>Spoofed Origin</small></td>
                <td>Q1: <strong>C</strong> | Q2: <strong>B</strong> | Q3: <strong>C</strong><br/><small>Dean Directive (.exe)</small></td>
                <td>Q1: <strong>B</strong> | Q2: <strong>A</strong> | Q3: <strong>B</strong><br/><small>OAuth BioCloud Sync</small></td>
                <td>Q1: <strong>A</strong> | Q2: <strong>A</strong> | Q3: <strong>B</strong><br/><small>CS301 Exam Leak (Tor)</small></td>
                <td>Q1: <strong>B</strong> | Q2: <strong>A</strong> | Q3: <strong>A</strong><br/><small>Laptop Quishing (QR)</small></td>
              </tr>
              <tr>
                <td><strong>STATION 2</strong><br/><small>Digital Shadow</small></td>
                <td>Q1: <strong>B</strong> | Q2: <strong>B</strong> | Q3: <strong>C</strong><br/><small>Bust!r#308</small></td>
                <td>Q1: <strong>B</strong> | Q2: <strong>A</strong><br/><small>Kasparov!2840</small></td>
                <td>Q1: <strong>B</strong> | Q2: <strong>A</strong><br/><small>Mustang@67#</small></td>
                <td>Q1: <strong>B</strong> | Q2: <strong>A</strong><br/><small>Vot3!Falcon25</small></td>
              </tr>
              <tr>
                <td><strong>STATION 3</strong><br/><small>Domain Mirage</small></td>
                <td>Q1: <strong>B</strong> | Q2: <strong>C</strong> | Q3: <strong>C</strong><br/><small>Userinfo @ + Redirect</small></td>
                <td>Q1: <strong>A</strong> | Q2: <strong>B</strong> | Q3: <strong>A</strong><br/><small>Cyrillic Homograph</small></td>
                <td>Q1: <strong>A</strong> | Q2: <strong>A</strong> | Q3: <strong>A</strong><br/><small>S3 CNAME Takeover</small></td>
                <td>Q1: <strong>C</strong> | Q2: <strong>A</strong> | Q3: <strong>A</strong><br/><small>URL Shortener Mask</small></td>
              </tr>
              <tr>
                <td><strong>STATION 4</strong><br/><small>Blackout Timeline</small></td>
                <td>Q1: <strong>C</strong> | Q2: <strong>A</strong> | Q3: <strong>C</strong> | Q4: <strong>B</strong><br/><strong style="color:var(--neon-green)">EXIT PIN: 25</strong></td>
                <td>Q1: <strong>B</strong> | Q2: <strong>A</strong> | Q3: <strong>C</strong> | Q4: <strong>B</strong><br/><strong style="color:var(--neon-green)">EXIT PIN: 34</strong></td>
                <td>Q1: <strong>B</strong> | Q2: <strong>A</strong> | Q3: <strong>B</strong> | Q4: <strong>B</strong><br/><strong style="color:var(--neon-green)">EXIT PIN: 49</strong></td>
                <td>Q1: <strong>B</strong> | Q2: <strong>A</strong> | Q3: <strong>B</strong> | Q4: <strong>B</strong><br/><strong style="color:var(--neon-green)">EXIT PIN: 61</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // TAB 7: PRN LOOKUP
  function renderPrnLookupTab() {
    return `
      <div style="background:#04070e;border:1px solid var(--border-subtle);border-radius:8px;padding:1.25rem;">
        <h3 style="font-family:var(--font-mono);font-size:0.95rem;color:var(--neon-cyan);text-transform:uppercase;margin-bottom:0.5rem;">
          Instant PRN Case & Solution Lookup
        </h3>
        <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:1rem;">
          Enter any student's College PRN Number to immediately decode their unique assigned station cases and expected room exit PIN.
        </p>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <input type="text" id="prnLookupInput" class="form-input" style="flex:1;min-width:240px;" placeholder="Enter Student PRN (e.g. 2024010529)..." />
          <button id="btnLookupPRN" class="btn-cyber-sm" style="padding:0.6rem 1.25rem;">LOOKUP SET & PIN</button>
        </div>
        <div id="prnLookupResult" style="margin-top:1rem;font-family:var(--font-mono);font-size:0.85rem;"></div>
      </div>
    `;
  }

  // TAB 8: PRINT A4 QR POSTERS
  function renderPostersTab(originUrl) {
    return `
      <div style="background:#04070e;border:1px solid var(--border-subtle);border-radius:8px;padding:1.25rem;">
        <h3 style="font-family:var(--font-mono);font-size:0.95rem;color:var(--neon-cyan);text-transform:uppercase;margin-bottom:0.5rem;">
          Physical Station A4 Poster & QR Generator
        </h3>
        <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:1rem;">
          Enter your host URL (e.g. your local Wi-Fi IP like <code>http://192.168.1.105:8765/</code>). Clicking print formats 4 distinct A4 posters ready to hang on station walls.
        </p>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem;">
          <input type="text" id="posterBaseUrl" class="form-input" style="flex:1;min-width:260px;" value="${originUrl}" />
          <button id="btnPrintA4Posters" class="btn-submit-cyber" style="padding:0.65rem 1.5rem;font-size:0.85rem;">
            🖨️ PRINT 4 A4 QR POSTERS (Ctrl+P)
          </button>
        </div>
      </div>
    `;
  }

  // TAB 9: TERMINAL OVERRIDES
  function renderSessionTab(session) {
    return `
      <div style="background:#04070e;border:1px solid var(--border-subtle);border-radius:8px;padding:1.25rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;gap:0.5rem;">
          <h3 style="font-family:var(--font-mono);font-size:0.95rem;color:var(--neon-cyan);text-transform:uppercase;">
            Active Terminal Session Inspector
          </h3>
          <div style="display:flex;gap:0.5rem;">
            ${session && session.isEliminated ? `<button id="btnAdminRevive" class="btn-cyber-sm" style="background:rgba(0,255,136,0.15);color:var(--neon-green);border-color:var(--neon-green)">🔓 REVIVE AGENT</button>` : ""}
            <button id="btnAdminForceClear" class="btn-cyber-danger-sm">RESET LOCAL TERMINAL</button>
          </div>
        </div>

        ${session ? `
          <table class="admin-table">
            <tr><th>Student Name:</th><td><strong>${escapeHtml(session.name)}</strong> (Agent ID: ${session.agentId})</td></tr>
            <tr><th>College PRN:</th><td><strong style="color:var(--neon-cyan);">${escapeHtml(session.prn)}</strong></td></tr>
            <tr><th>Assigned Sets:</th><td><span class="email-badge">S1:${session.assignedSets ? session.assignedSets[1] : 'A'} | S2:${session.assignedSets ? session.assignedSets[2] : 'A'} | S3:${session.assignedSets ? session.assignedSets[3] : 'A'} | S4:${session.assignedSets ? session.assignedSets[4] : 'A'}</span></td></tr>
            <tr><th>Current Station:</th><td>Station ${session.currentStation} of 4</td></tr>
            <tr><th>Status:</th><td>${session.isEliminated ? '<span style="color:var(--neon-red);font-weight:700;">🚨 ELIMINATED (' + escapeHtml(session.eliminatedReason || '') + ')</span>' : session.isEscaped ? '<span style="color:var(--neon-green);font-weight:700;">🏆 ESCAPED</span>' : '<span style="color:var(--neon-cyan);font-weight:700;">ACTIVE IN PROGRESS</span>'}</td></tr>
            <tr><th>Remaining Clock:</th><td>${Math.floor((session.remainingSeconds || 0) / 60)}m ${(session.remainingSeconds || 0) % 60}s</td></tr>
            <tr><th>Infractions:</th><td>${session.tabInfractions || 0}</td></tr>
          </table>
        ` : `<div style="font-size:0.85rem;color:var(--text-muted);font-family:var(--font-mono);">No active player terminal session loaded on this browser.</div>`}
      </div>
    `;
  }

  function attachTabSpecificHandlers(modal, session, submissions, roster, attendance, roundState, originUrl) {
    // Round Action Buttons (Start / Stop)
    modal.querySelectorAll(".btn-round-action").forEach(btn => {
      btn.addEventListener("click", () => {
        const roundNum = parseInt(btn.getAttribute("data-round"), 10);
        const action = btn.getAttribute("data-action");
        const newStatus = action === "start" ? "RUNNING" : "STOPPED";
        if (window.AppEngine.setRoundStatus) {
          window.AppEngine.setRoundStatus(roundNum, newStatus);
          renderAdminDashboard(modal);
        }
      });
    });

    // Attendance Manual Check-In Form
    const attForm = document.getElementById("attendanceCheckinForm");
    if (attForm) {
      attForm.addEventListener("submit", e => {
        e.preventDefault();
        const nameInput = document.getElementById("attNameInput");
        const prnInput = document.getElementById("attPrnInput");
        const name = nameInput.value.trim();
        const prn = prnInput.value.trim().toUpperCase();
        if (name && prn) {
          const assignment = window.CryptoEngine.deriveSetsFromPRN(prn);
          window.AppEngine.recordAttendance({
            id: "att_" + prn,
            name: name,
            prn: prn,
            codeProfile: assignment.codeProfile,
            timestamp: Date.now(),
            timeStr: new Date().toLocaleTimeString(),
            status: "PRESENT"
          });
          nameInput.value = "";
          prnInput.value = "";
          renderAdminDashboard(modal);
        }
      });
    }

    // Toggle Attendance Status
    modal.querySelectorAll(".btn-toggle-att-status").forEach(btn => {
      btn.addEventListener("click", () => {
        const prn = btn.getAttribute("data-prn");
        const newStatus = btn.getAttribute("data-status");
        if (window.AppEngine.updateAttendanceStatus) {
          window.AppEngine.updateAttendanceStatus(prn, newStatus);
          renderAdminDashboard(modal);
        }
      });
    });

    // Clear Attendance
    const btnClearAttendance = document.getElementById("btnClearAttendance");
    if (btnClearAttendance) {
      btnClearAttendance.addEventListener("click", () => {
        if (confirm("Clear all attendance records?")) {
          if (window.AppEngine.clearAttendance) window.AppEngine.clearAttendance();
          renderAdminDashboard(modal);
        }
      });
    }

    // Copy Attendance CSV
    const btnCopyAttendance = document.getElementById("btnCopyAttendance");
    if (btnCopyAttendance) {
      btnCopyAttendance.addEventListener("click", () => {
        const list = window.AppEngine.getAttendance ? window.AppEngine.getAttendance() : [];
        let csv = "PRN,Name,Profile,CheckInTime,Status\n";
        list.forEach(st => {
          csv += `"${st.prn}","${st.name}","${st.codeProfile || ''}","${st.timeStr || ''}","${st.status || ''}"\n`;
        });
        navigator.clipboard.writeText(csv).then(() => alert("Attendance CSV copied to clipboard!"));
      });
    }

    // Attendance Search
    const attSearchInput = document.getElementById("attSearchInput");
    if (attSearchInput) {
      attSearchInput.addEventListener("input", e => {
        attendanceSearchQuery = e.target.value;
        const bodyEl = document.getElementById("adminTabContent");
        if (bodyEl) {
          bodyEl.innerHTML = renderAttendanceTab(window.AppEngine.getAttendance ? window.AppEngine.getAttendance() : []);
          attachTabSpecificHandlers(modal, session, submissions, roster, attendance, roundState, originUrl);
        }
      });
    }

    // Qualifiers Round Switcher
    modal.querySelectorAll(".qualifier-round-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const rVal = btn.getAttribute("data-round");
        currentQualifierRound = rVal === "eliminated" ? "eliminated" : parseInt(rVal, 10);
        renderAdminDashboard(modal);
      });
    });

    // Helper function to qualify candidates for a round
    function doQualify(targetRound, prnList, isReplace = false) {
      if (window.AppEngine.qualifyStudentsForRound) {
        window.AppEngine.qualifyStudentsForRound(targetRound, prnList, isReplace);
        renderAdminDashboard(modal);
      }
    }

    // Helper function to revoke qualification
    function doRevoke(targetRound, prn) {
      if (window.AppEngine.revokeStudentQualification) {
        window.AppEngine.revokeStudentQualification(targetRound, prn);
        renderAdminDashboard(modal);
      }
    }

    // Qualify All Verified (from Qualifiers tab)
    const btnQualifyAllCorrect = document.getElementById("btnQualifyAllCorrect");
    if (btnQualifyAllCorrect) {
      btnQualifyAllCorrect.addEventListener("click", () => {
        const roundNum = parseInt(currentQualifierRound, 10);
        const nextRound = roundNum < 4 ? roundNum + 1 : 4;
        const validSubs = submissions.filter(s => s.isCorrect && parseInt(s.stationNum, 10) === roundNum);
        const rosterCandidates = roster.filter(r => !r.isEliminated && r.completedStations && r.completedStations.includes(roundNum));
        const prns = Array.from(new Set([
          ...validSubs.map(s => String(s.prn).trim().toUpperCase()),
          ...rosterCandidates.map(r => String(r.prn).trim().toUpperCase())
        ])).filter(Boolean);
        doQualify(nextRound, prns, false);
        alert(`Success: ${prns.length} students have been officially qualified for Round 0${nextRound}!`);
      });
    }

    // Qualify Top N Tier (from Qualifiers tab)
    modal.querySelectorAll(".btn-qualify-tier").forEach(btn => {
      btn.addEventListener("click", () => {
        const count = parseInt(btn.getAttribute("data-count"), 10) || 5;
        const roundNum = parseInt(currentQualifierRound, 10);
        const nextRound = roundNum < 4 ? roundNum + 1 : 4;
        
        const candidateMap = new Map();
        submissions.forEach(s => {
          if (s.isCorrect && parseInt(s.stationNum, 10) === roundNum && s.prn) {
            const p = String(s.prn).trim().toUpperCase();
            if (!candidateMap.has(p) || candidateMap.get(p).elapsedSeconds > (s.elapsedSeconds || 9999)) {
              candidateMap.set(p, s);
            }
          }
        });
        roster.forEach(r => {
          if (!r.isEliminated && r.completedStations && r.completedStations.includes(roundNum) && r.prn) {
            const p = String(r.prn).trim().toUpperCase();
            if (!candidateMap.has(p)) {
              candidateMap.set(p, { prn: p, elapsedSeconds: 75 });
            }
          }
        });
        const ranked = Array.from(candidateMap.values()).sort((a, b) => (a.elapsedSeconds || 9999) - (b.elapsedSeconds || 9999));
        const topPrns = ranked.slice(0, count).map(s => s.prn);
        doQualify(nextRound, topPrns, true);
        alert(`Success: Top ${topPrns.length} fastest analysts approved as official Round 0${nextRound} finalists!`);
      });
    });

    // Manual Qualify Form (from Qualifiers tab)
    const formManualQualify = document.getElementById("formManualQualify");
    if (formManualQualify) {
      formManualQualify.addEventListener("submit", e => {
        e.preventDefault();
        const input = document.getElementById("manualQualPrnInput");
        if (input && input.value.trim()) {
          const roundNum = parseInt(currentQualifierRound, 10);
          const nextRound = roundNum < 4 ? roundNum + 1 : 4;
          const prn = input.value.trim().toUpperCase();
          doQualify(nextRound, [prn], false);
          input.value = "";
        }
      });
    }

    // Single Student Qualify (Grant Clearance button)
    modal.querySelectorAll(".btn-single-qualify").forEach(btn => {
      btn.addEventListener("click", () => {
        const prn = btn.getAttribute("data-prn");
        const nextRound = parseInt(btn.getAttribute("data-round"), 10);
        doQualify(nextRound, [prn], false);
      });
    });

    // Single Student Revoke (Revoke Clearance button in Qualifiers tab)
    modal.querySelectorAll(".btn-revoke-single-qualify").forEach(btn => {
      btn.addEventListener("click", () => {
        const prn = btn.getAttribute("data-prn");
        const nextRound = parseInt(btn.getAttribute("data-round"), 10);
        doRevoke(nextRound, prn);
      });
    });

    // Quick Qualify All from Round Controller card
    modal.querySelectorAll(".btn-quick-qualify-all").forEach(btn => {
      btn.addEventListener("click", () => {
        const station = parseInt(btn.getAttribute("data-round"), 10);
        const nextRound = station + 1;
        const subPrns = submissions.filter(s => s.isCorrect && parseInt(s.stationNum, 10) === station && s.prn).map(s => String(s.prn).trim().toUpperCase());
        const rosPrns = roster.filter(r => !r.isEliminated && r.completedStations && r.completedStations.includes(station) && r.prn).map(r => String(r.prn).trim().toUpperCase());
        const allPrns = Array.from(new Set([...subPrns, ...rosPrns])).filter(Boolean);
        doQualify(nextRound, allPrns, false);
        alert(`Success: ${allPrns.length} students qualified for Round 0${nextRound}!`);
      });
    });

    // Quick Qualify Top N from Round Controller card
    modal.querySelectorAll(".btn-quick-qualify-top").forEach(btn => {
      btn.addEventListener("click", () => {
        const station = parseInt(btn.getAttribute("data-round"), 10);
        const count = parseInt(btn.getAttribute("data-count"), 10) || 5;
        const nextRound = station + 1;
        const candidateMap = new Map();
        submissions.forEach(s => {
          if (s.isCorrect && parseInt(s.stationNum, 10) === station && s.prn) {
            const p = String(s.prn).trim().toUpperCase();
            if (!candidateMap.has(p) || candidateMap.get(p).elapsedSeconds > (s.elapsedSeconds || 9999)) {
              candidateMap.set(p, s);
            }
          }
        });
        roster.forEach(r => {
          if (!r.isEliminated && r.completedStations && r.completedStations.includes(station) && r.prn) {
            const p = String(r.prn).trim().toUpperCase();
            if (!candidateMap.has(p)) {
              candidateMap.set(p, { prn: p, elapsedSeconds: 75 });
            }
          }
        });
        const ranked = Array.from(candidateMap.values()).sort((a, b) => (a.elapsedSeconds || 9999) - (b.elapsedSeconds || 9999));
        const topPrns = ranked.slice(0, count).map(s => s.prn);
        doQualify(nextRound, topPrns, true);
        alert(`Success: Top ${topPrns.length} students approved as official Round 0${nextRound} finalists!`);
      });
    });

    // Manual PRN quick-add form from Round Controller card
    modal.querySelectorAll(".form-quick-add-prn").forEach(form => {
      form.addEventListener("submit", e => {
        e.preventDefault();
        const nextRound = parseInt(form.getAttribute("data-round"), 10);
        const input = form.querySelector(".input-manual-prn");
        if (input && input.value.trim()) {
          const prn = input.value.trim().toUpperCase();
          doQualify(nextRound, [prn], false);
          input.value = "";
        }
      });
    });

    // Revoke from Round Controller card badges
    modal.querySelectorAll(".btn-revoke-qualify").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const roundNum = parseInt(btn.getAttribute("data-round"), 10);
        const prn = btn.getAttribute("data-prn");
        doRevoke(roundNum, prn);
      });
    });

    // Quick qualify from Attendance desk table
    modal.querySelectorAll(".btn-att-qualify").forEach(btn => {
      btn.addEventListener("click", () => {
        const prn = btn.getAttribute("data-prn");
        const targetRound = parseInt(btn.getAttribute("data-round"), 10);
        doQualify(targetRound, [prn], false);
        alert(`Agent ${prn} qualified for Round 0${targetRound}!`);
      });
    });

    // Quick qualify next round from Roster table
    modal.querySelectorAll(".btn-roster-qualify-next").forEach(btn => {
      btn.addEventListener("click", () => {
        const prn = btn.getAttribute("data-prn");
        const curr = parseInt(btn.getAttribute("data-curr"), 10) || 1;
        const nextRound = Math.min(4, curr + 1);
        doQualify(nextRound, [prn], false);
        alert(`Agent ${prn} qualified for Round 0${nextRound}!`);
      });
    });

    // Copy Qualifiers
    const btnCopyQualifiers = document.getElementById("btnCopyQualifiers");
    if (btnCopyQualifiers) {
      btnCopyQualifiers.addEventListener("click", () => {
        const table = modal.querySelector(".admin-table");
        if (!table) return;
        let text = `CAMPUS CYBER ESCAPE - QUALIFIERS LEADERBOARD\n==============================================\n`;
        table.querySelectorAll("tr").forEach(row => {
          const cells = Array.from(row.querySelectorAll("th, td")).map(c => c.innerText.trim());
          text += cells.join(" | ") + "\n";
        });
        navigator.clipboard.writeText(text).then(() => alert("Qualifiers leaderboard copied to clipboard!"));
      });
    }

    // User Deletion Handler (Permanently removes student from Neon DB)
    modal.querySelectorAll(".btn-delete-user").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const prn = btn.getAttribute("data-prn");
        const name = btn.getAttribute("data-name") || prn;
        if (confirm(`PERMANENT ACTION: Are you sure you want to DELETE student ${name} (${prn})?\n\nThis will permanently remove:\n- Student record\n- All station question submissions & logs\n- Attendance check-in entries\n- Round qualification status\n\nThis action cannot be undone.`)) {
          btn.disabled = true;
          btn.innerText = "Deleting...";
          if (window.AppEngine && window.AppEngine.deleteStudent) {
            await window.AppEngine.deleteStudent(prn);
          }
          if (window.AppEngine && window.AppEngine.syncFromBackend) {
            await window.AppEngine.syncFromBackend();
          }
          alert(`✓ Student ${prn} (${name}) has been permanently deleted from the database.`);
          renderAdminDashboard(modal);
        }
      });
    });

    // Clear Submissions
    const btnClearSubmissions = document.getElementById("btnClearSubmissions");
    if (btnClearSubmissions) {
      btnClearSubmissions.addEventListener("click", async () => {
        if (confirm("Clear all recorded student submissions in Neon DB?")) {
          btnClearSubmissions.disabled = true;
          if (window.AppEngine.clearSubmissions) window.AppEngine.clearSubmissions();
          try {
            await fetch("/api/reset", { method: "DELETE" });
          } catch (e) {}
          if (window.AppEngine.syncFromBackend) await window.AppEngine.syncFromBackend();
          renderAdminDashboard(modal);
        }
      });
    }

    // Clear Roster
    const btnClearRoster = document.getElementById("btnClearRoster");
    if (btnClearRoster) {
      btnClearRoster.addEventListener("click", async () => {
        if (confirm("Clear all registered students roster and reset event in Neon DB?")) {
          btnClearRoster.disabled = true;
          if (window.AppEngine.clearRoster) window.AppEngine.clearRoster();
          try {
            await fetch("/api/reset", { method: "DELETE" });
          } catch (e) {}
          if (window.AppEngine.syncFromBackend) await window.AppEngine.syncFromBackend();
          renderAdminDashboard(modal);
        }
      });
    }

    // Roster Search
    const rosterSearchInput = document.getElementById("rosterSearchInput");
    if (rosterSearchInput) {
      rosterSearchInput.addEventListener("input", e => {
        rosterSearchQuery = e.target.value;
        const bodyEl = document.getElementById("adminTabContent");
        if (bodyEl) {
          bodyEl.innerHTML = renderRosterTab(window.AppEngine.getRoster ? window.AppEngine.getRoster() : []);
          attachTabSpecificHandlers(modal, session, submissions, roster, attendance, roundState, originUrl);
        }
      });
    }

    // Roster Filter
    modal.querySelectorAll(".roster-filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        rosterFilter = btn.getAttribute("data-filter");
        renderAdminDashboard(modal);
      });
    });

    // Revive PRN in roster
    modal.querySelectorAll(".btn-revive-prn").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetPrn = btn.getAttribute("data-prn");
        const currentRoster = window.AppEngine.getRoster ? window.AppEngine.getRoster() : [];
        const student = currentRoster.find(r => (r.prn || "").toUpperCase() === targetPrn.toUpperCase());
        if (student) {
          student.isEliminated = false;
          student.eliminatedReason = null;
          student.tabInfractions = 0;
          localStorage.setItem("BLACKOUT_STUDENTS_ROSTER", JSON.stringify(currentRoster));
          const activeSess = window.AppEngine.getSession();
          if (activeSess && (activeSess.prn || "").toUpperCase() === targetPrn.toUpperCase()) {
            window.AppEngine.reviveAgent();
          }
          alert(`Agent ${targetPrn} (${student.name}) has been revived.`);
          renderAdminDashboard(modal);
        }
      });
    });

    // PRN Lookup
    const btnLookupPRN = document.getElementById("btnLookupPRN");
    if (btnLookupPRN) {
      btnLookupPRN.addEventListener("click", () => {
        const prnInput = document.getElementById("prnLookupInput").value.trim().toUpperCase();
        const resultEl = document.getElementById("prnLookupResult");
        if (!prnInput) {
          resultEl.innerHTML = `<span style="color:var(--neon-red)">Please enter a PRN number.</span>`;
          return;
        }
        const assignment = window.CryptoEngine.deriveSetsFromPRN(prnInput);
        const s4Set = assignment.sets[4];
        const s4Data = window.STATION_CASES[4][s4Set];
        const pin = s4Data ? s4Data.exitPin : "25";

        resultEl.innerHTML = `
          <div style="background:rgba(0,240,255,0.08);border:1px solid var(--neon-cyan);border-radius:6px;padding:0.85rem;">
            <div><strong>PRN:</strong> ${prnInput} &bull; <strong>ASSIGNED PROFILE:</strong> <span style="color:var(--neon-cyan);font-weight:700;">${assignment.codeProfile}</span></div>
            <div style="margin-top:0.5rem;display:flex;gap:0.75rem;flex-wrap:wrap;">
              <span>Station 1: <strong>Set ${assignment.sets[1]}</strong></span>
              <span>Station 2: <strong>Set ${assignment.sets[2]}</strong></span>
              <span>Station 3: <strong>Set ${assignment.sets[3]}</strong></span>
              <span>Station 4: <strong>Set ${assignment.sets[4]}</strong></span>
            </div>
            <div style="margin-top:0.5rem;color:var(--neon-green)">
              <strong>EXPECTED ROOM EXIT PIN:</strong> <span style="font-size:1.15rem;font-weight:900;">${pin}</span>
            </div>
          </div>
        `;
      });
    }

    // Print A4 Posters
    const btnPrintA4Posters = document.getElementById("btnPrintA4Posters");
    if (btnPrintA4Posters) {
      btnPrintA4Posters.addEventListener("click", () => {
        const baseUrl = document.getElementById("posterBaseUrl").value.trim();
        let printContainer = document.getElementById("posterPrintContainer");
        if (!printContainer) {
          printContainer = document.createElement("div");
          printContainer.id = "posterPrintContainer";
          printContainer.className = "poster-print-container";
          document.body.appendChild(printContainer);
        }
        printContainer.innerHTML = window.QRPosterEngine.renderPosters(baseUrl);
        window.print();
      });
    }

    // Session Revive
    const btnRevive = document.getElementById("btnAdminRevive");
    if (btnRevive) {
      btnRevive.addEventListener("click", () => {
        window.AppEngine.reviveAgent();
        renderAdminDashboard(modal);
      });
    }

    // Session Force Clear
    const btnForceClear = document.getElementById("btnAdminForceClear");
    if (btnForceClear) {
      btnForceClear.addEventListener("click", () => {
        if (confirm("Reset current player state on this computer?")) {
          window.AppEngine.clearSession();
          renderAdminDashboard(modal);
          window.AppEngine.renderActiveStation();
        }
      });
    }
  }

  return {
    init: init,
    open: openAdminModal
  };
})();

window.AdminPortal = AdminPortal;
window.openAdmin = AdminPortal.open;
window.openAdminModal = AdminPortal.open;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    AdminPortal.init();
  });
} else {
  AdminPortal.init();
}
