/**
 * BLACKOUT PROTOCOL: Core Game Controller & Audio Synthesizer
 * Manages player registration, sudden-death validation, state persistence,
 * Web Audio sound effects and event telemetry.
 */

const AppEngine = (function () {
  const STORAGE_KEY = "BLACKOUT_SESSION_V3";
  let audioCtx = null;
  let isMuted = false;
  let timerInterval = null;

  // Initialize Web Audio API procedurally
  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => { });
    }
  }

  function playTone(freq, duration, type = "sine", gainVal = 0.15) {
    if (isMuted || !audioCtx) return;
    try {
      if (audioCtx.state === "suspended") audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio play err", e);
    }
  }

  function playKeyClick() {
    playTone(1800, 0.04, "triangle", 0.08);
  }

  function playSuccessChime() {
    if (isMuted || !audioCtx) return;
    try {
      if (audioCtx.state === "suspended") audioCtx.resume();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((note, idx) => {
        setTimeout(() => playTone(note, 0.25, "sine", 0.2), idx * 90);
      });
    } catch (e) { }
  }

  function playErrorBuzz() {
    playTone(130, 0.4, "sawtooth", 0.25);
  }

  function playLockdownSiren() {
    if (isMuted || !audioCtx) return;
    try {
      if (audioCtx.state === "suspended") audioCtx.resume();
      let count = 0;
      const sirenTimer = setInterval(() => {
        playTone(count % 2 === 0 ? 880 : 440, 0.35, "sawtooth", 0.3);
        count++;
        if (count >= 6) clearInterval(sirenTimer);
      }, 350);
    } catch (e) { }
  }

  // Online API Client (Neon PostgreSQL Sync)
  async function apiFetch(endpoint, options = {}) {
    try {
      const res = await fetch(endpoint, {
        headers: { "Content-Type": "application/json" },
        ...options
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  // Session State
  function getSession() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function saveSession(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (state) syncSessionToRoster(state);
      if (state && state.prn) {
        apiFetch("/api/students", {
          method: "POST",
          body: JSON.stringify(state)
        });
      }
    } catch (e) { }
  }

  const SUBMISSIONS_KEY = "BLACKOUT_EVENT_SUBMISSIONS";
  const ROSTER_KEY = "BLACKOUT_STUDENTS_ROSTER";

  function getSubmissions() {
    try {
      const data = localStorage.getItem(SUBMISSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function recordSubmission(entry) {
    try {
      const list = getSubmissions();
      list.unshift(entry);
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent("blackout_submission", { detail: entry }));
      apiFetch("/api/submissions", {
        method: "POST",
        body: JSON.stringify(entry)
      });
    } catch (e) {
      console.warn("Error recording submission", e);
    }
  }

  function clearSubmissions() {
    localStorage.removeItem(SUBMISSIONS_KEY);
    window.dispatchEvent(new CustomEvent("blackout_submission", { detail: { action: "cleared" } }));
  }

  function getRoster() {
    try {
      const data = localStorage.getItem(ROSTER_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function syncSessionToRoster(session) {
    if (!session || !session.prn) return;
    try {
      const roster = getRoster();
      const prnUpper = session.prn.toUpperCase();
      const existingIdx = roster.findIndex(r => r.prn.toUpperCase() === prnUpper);
      const studentRecord = {
        agentId: session.agentId,
        name: session.name,
        prn: session.prn,
        codeProfile: session.codeProfile,
        assignedSets: session.assignedSets,
        currentStation: session.currentStation,
        completedStations: session.completedStations || [],
        isEliminated: session.isEliminated || false,
        eliminatedReason: session.eliminatedReason || null,
        isEscaped: session.isEscaped || false,
        remainingSeconds: session.remainingSeconds,
        penaltySeconds: session.penaltySeconds || 0,
        tabInfractions: session.tabInfractions || 0,
        registeredAt: session.startedAt || Date.now(),
        lastUpdated: Date.now()
      };
      if (existingIdx >= 0) {
        roster[existingIdx] = { ...roster[existingIdx], ...studentRecord };
      } else {
        roster.push(studentRecord);
      }
      localStorage.setItem(ROSTER_KEY, JSON.stringify(roster));
      window.dispatchEvent(new CustomEvent("blackout_roster_update", { detail: studentRecord }));
    } catch (e) {
      console.warn("Roster sync error", e);
    }
  }

  function clearRoster() {
    localStorage.removeItem(ROSTER_KEY);
    window.dispatchEvent(new CustomEvent("blackout_roster_update", { detail: { action: "cleared" } }));
  }

  // ==========================================
  // ATTENDANCE & EVENT CHECK-IN MANAGEMENT
  // ==========================================
  const ATTENDANCE_KEY = "BLACKOUT_ATTENDANCE_LOG";

  function getAttendance() {
    try {
      const data = localStorage.getItem(ATTENDANCE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function recordAttendance(entry) {
    try {
      const list = getAttendance();
      const prnUpper = (entry.prn || "").toUpperCase();
      const existingIdx = list.findIndex(a => (a.prn || "").toUpperCase() === prnUpper);
      if (existingIdx >= 0) {
        list[existingIdx] = { ...list[existingIdx], ...entry };
      } else {
        list.unshift(entry);
      }
      localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent("blackout_attendance_update", { detail: entry }));
    } catch (e) {
      console.warn("Attendance record error", e);
    }
  }

  function updateAttendanceStatus(prn, newStatus) {
    try {
      const list = getAttendance();
      const prnUpper = (prn || "").toUpperCase();
      const target = list.find(a => (a.prn || "").toUpperCase() === prnUpper);
      if (target) {
        target.status = newStatus;
        localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(list));
        window.dispatchEvent(new CustomEvent("blackout_attendance_update", { detail: target }));
      }
      apiFetch("/api/attendance", {
        method: "POST",
        body: JSON.stringify({ action: "toggle", prn: prnUpper, status: newStatus })
      });
    } catch (e) { }
  }

  function clearAttendance() {
    localStorage.removeItem(ATTENDANCE_KEY);
    window.dispatchEvent(new CustomEvent("blackout_attendance_update", { detail: { action: "cleared" } }));
    apiFetch("/api/attendance", {
      method: "POST",
      body: JSON.stringify({ action: "clear" })
    });
  }

  // ==========================================
  // MASTER ROUND STATE & QUALIFICATION ENGINE
  // ==========================================
  const GLOBAL_ROUND_KEY = "BLACKOUT_GLOBAL_ROUND_STATE";

  function getRoundState() {
    try {
      const data = localStorage.getItem(GLOBAL_ROUND_KEY);
      return data ? JSON.parse(data) : {
        round1: { status: "RUNNING" },
        round2: { status: "LOCKED" },
        round3: { status: "LOCKED" },
        round4: { status: "LOCKED" },
        qualifiedRound2: [],
        qualifiedRound3: [],
        qualifiedRound4: []
      };
    } catch (e) {
      return {
        round1: { status: "RUNNING" },
        round2: { status: "LOCKED" },
        round3: { status: "LOCKED" },
        round4: { status: "LOCKED" },
        qualifiedRound2: [],
        qualifiedRound3: [],
        qualifiedRound4: []
      };
    }
  }

  function saveRoundState(state) {
    try {
      localStorage.setItem(GLOBAL_ROUND_KEY, JSON.stringify(state));
      window.dispatchEvent(new CustomEvent("blackout_round_update", { detail: state }));
    } catch (e) { }
  }

  function setRoundStatus(roundNum, status) {
    const state = getRoundState();
    if (!state["round" + roundNum]) state["round" + roundNum] = {};
    state["round" + roundNum].status = status;
    saveRoundState(state);
    apiFetch("/api/rounds", {
      method: "POST",
      body: JSON.stringify({ action: "status", roundNum, status })
    });
  }

  function qualifyStudentsForRound(roundNum, prnArray, replace = false) {
    const rNum = parseInt(roundNum, 10);
    const state = getRoundState();
    const key = "qualifiedRound" + rNum;
    const cleanPrns = (prnArray || []).map(p => String(p || "").trim().toUpperCase()).filter(Boolean);
    const existing = (state[key] || []).map(p => String(p || "").trim().toUpperCase());
    const merged = replace ? Array.from(new Set(cleanPrns)) : Array.from(new Set([...existing, ...cleanPrns]));
    state[key] = merged;
    if (state["round" + rNum]) {
      state["round" + rNum].status = "RUNNING";
    }
    saveRoundState(state);

    // Synchronize to online backend
    apiFetch("/api/rounds", {
      method: "POST",
      body: JSON.stringify({ action: "qualify", roundNum: rNum, prnArray: cleanPrns, replace })
    });

    // Synchronize to Student Roster and Attendance records
    try {
      const roster = getRoster();
      let rosterChanged = false;
      cleanPrns.forEach(prn => {
        const student = roster.find(r => (r.prn || "").toUpperCase() === prn);
        if (student) {
          student.completedStations = student.completedStations || [];
          for (let k = 1; k < rNum; k++) {
            if (!student.completedStations.includes(k)) student.completedStations.push(k);
          }
          student.completedStations.sort((a, b) => a - b);
          if (student.currentStation < rNum) student.currentStation = rNum;
          student.status = `QUALIFIED FOR ROUND ${rNum}`;
          rosterChanged = true;
        }
      });
      if (rosterChanged) {
        localStorage.setItem(ROSTER_KEY, JSON.stringify(roster));
        window.dispatchEvent(new CustomEvent("blackout_roster_update", { detail: { action: "qualified_sync" } }));
      }
    } catch (e) {
      console.warn("Roster sync on qualify error", e);
    }

    return merged;
  }

  function revokeStudentQualification(roundNum, prn) {
    const rNum = parseInt(roundNum, 10);
    const state = getRoundState();
    const key = "qualifiedRound" + rNum;
    const cleanPrn = String(prn || "").trim().toUpperCase();
    const existing = (state[key] || []).map(p => String(p || "").trim().toUpperCase());
    state[key] = existing.filter(p => p !== cleanPrn);
    saveRoundState(state);

    apiFetch("/api/rounds", {
      method: "POST",
      body: JSON.stringify({ action: "revoke", roundNum: rNum, prn: cleanPrn })
    });
  }

  // Delete User & Cascade from Local and Remote Database
  async function deleteStudent(prn) {
    const cleanPrn = String(prn || "").trim().toUpperCase();
    if (!cleanPrn) return;

    // 1. Remove from local roster
    try {
      const roster = getRoster().filter(r => (r.prn || "").toUpperCase() !== cleanPrn);
      localStorage.setItem(ROSTER_KEY, JSON.stringify(roster));
      window.dispatchEvent(new CustomEvent("blackout_roster_update", { detail: { action: "deleted", prn: cleanPrn } }));
    } catch (e) {}

    // 2. Remove from local attendance
    try {
      const att = getAttendance().filter(a => (a.prn || "").toUpperCase() !== cleanPrn);
      localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(att));
      window.dispatchEvent(new CustomEvent("blackout_attendance_update", { detail: { action: "deleted", prn: cleanPrn } }));
    } catch (e) {}

    // 3. Remove from local submissions
    try {
      const subs = getSubmissions().filter(s => (s.prn || "").toUpperCase() !== cleanPrn);
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(subs));
      window.dispatchEvent(new CustomEvent("blackout_submission", { detail: { action: "deleted", prn: cleanPrn } }));
    } catch (e) {}

    // 4. Remove from round qualifications
    try {
      const rState = getRoundState();
      let changed = false;
      [2, 3, 4].forEach(r => {
        const k = "qualifiedRound" + r;
        if (Array.isArray(rState[k])) {
          rState[k] = rState[k].filter(p => (p || "").toUpperCase() !== cleanPrn);
          changed = true;
        }
      });
      if (changed) saveRoundState(rState);
    } catch (e) {}

    // 5. If this device's active session is for this PRN, clear it
    const activeSession = getSession();
    if (activeSession && (activeSession.prn || "").toUpperCase() === cleanPrn) {
      clearCurrentSession();
      renderRegistration();
      showToast(`Terminal session for ${cleanPrn} was deleted.`, "info");
    }

    // 6. Delete from Neon PostgreSQL DB
    await apiFetch(`/api/students?prn=${encodeURIComponent(cleanPrn)}`, {
      method: "DELETE"
    });
  }

  // Background Database Sync (Pulls changes from Neon DB)
  async function syncFromBackend() {
    const data = await apiFetch("/api/state");
    if (!data || !data.success) return;

    if (data.roundState) {
      localStorage.setItem(GLOBAL_ROUND_KEY, JSON.stringify(data.roundState));
      window.dispatchEvent(new CustomEvent("blackout_round_update", { detail: data.roundState }));
    }
    if (Array.isArray(data.roster)) {
      localStorage.setItem(ROSTER_KEY, JSON.stringify(data.roster));
      window.dispatchEvent(new CustomEvent("blackout_roster_update", { detail: { action: "sync", list: data.roster } }));
    }
    if (Array.isArray(data.submissions)) {
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(data.submissions));
      window.dispatchEvent(new CustomEvent("blackout_submission", { detail: { action: "sync", list: data.submissions } }));
    }
    if (Array.isArray(data.attendance)) {
      localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(data.attendance));
      window.dispatchEvent(new CustomEvent("blackout_attendance_update", { detail: { action: "sync", list: data.attendance } }));
    }

    // Verify active session status against server
    const session = getSession();
    if (session && session.prn) {
      const prnUpper = session.prn.toUpperCase();
      const serverStudent = data.roster.find(r => (r.prn || "").toUpperCase() === prnUpper);

      // If user was deleted from DB by Game Master
      if (!serverStudent && data.roster.length > 0) {
        clearCurrentSession();
        renderRegistration();
        showToast("Your terminal session was reset by the Game Master.", "error");
        return;
      }

      // If user was revived by Game Master
      if (serverStudent && session.isEliminated && !serverStudent.isEliminated) {
        session.isEliminated = false;
        session.eliminatedReason = null;
        saveSession(session);
        const lockModal = document.getElementById("lockoutModal");
        if (lockModal) lockModal.style.display = "none";
        renderActiveStation();
        showToast("✓ Clearance restored: Your terminal has been revived by the Game Master!", "success");
      }

      // If user was advanced to another station
      if (serverStudent && serverStudent.currentStation > session.currentStation) {
        session.currentStation = serverStudent.currentStation;
        session.completedStations = serverStudent.completedStations || [];
        saveSession(session);
        renderActiveStation();
      }
    }
  }

  function isStudentQualifiedForRound(roundNum, prn) {
    const rNum = parseInt(roundNum, 10);
    if (rNum <= 1) return true;
    const cleanPrn = String(prn || "").trim().toUpperCase();
    if (!cleanPrn) return false;

    const state = getRoundState();
    const key = "qualifiedRound" + rNum;
    const qualifiedList = (state[key] || []).map(p => String(p || "").trim().toUpperCase());

    // 1. Direct check in official qualified list
    if (qualifiedList.includes(cleanPrn)) return true;

    // 2. Check roster completion record
    const roster = getRoster();
    const student = roster.find(r => (r.prn || "").toUpperCase() === cleanPrn);
    if (student && !student.isEliminated) {
      if (student.completedStations && student.completedStations.includes(rNum - 1)) {
        // Allow progression if no strict shortlist was designated yet
        if (qualifiedList.length === 0) return true;
      }
    }

    // 3. Fallback: check active session
    const session = getSession();
    if (session && String(session.prn || "").trim().toUpperCase() === cleanPrn && !session.isEliminated) {
      if (session.completedStations && session.completedStations.includes(rNum - 1)) {
        if (qualifiedList.length === 0) return true;
      }
    }

    return false;
  }

  function seedDemoData() {
    const demoStudents = [
      { name: "Pooja Reddy", prn: "2024010666", codeProfile: "CASE-DCBA", station: 4, isEscaped: true, time1: 35, time2: 48, time3: 59, time4: 78, infractions: 0 },
      { name: "Diya Patel", prn: "2024010222", codeProfile: "CASE-BBBB", station: 3, isEscaped: false, time1: 38, time2: 62, infractions: 1 },
      { name: "Aarav Sharma", prn: "2024010111", codeProfile: "CASE-AAAA", station: 4, isEscaped: true, time1: 42, time2: 55, time3: 68, time4: 85, infractions: 0 },
      { name: "Rohan Verma", prn: "2024010333", codeProfile: "CASE-CCCC", station: 2, isEscaped: false, time1: 52, infractions: 0 },
      { name: "Vikram Malhotra", prn: "2024010555", codeProfile: "CASE-ABCD", station: 2, isEscaped: false, isEliminated: true, reason: "Incorrect submission at Q2", time1: 65, infractions: 0 },
      { name: "Kunal Ghosh", prn: "2024010777", codeProfile: "CASE-BADC", station: 3, isEscaped: false, time1: 71, time2: 80, infractions: 0 },
      { name: "Sneha Kulkarni", prn: "2024010888", codeProfile: "CASE-CDAB", station: 1, isEscaped: false, time1: 89, infractions: 0 },
      { name: "Ananya Iyer", prn: "2024010444", codeProfile: "CASE-DDDD", station: 1, isEscaped: false, isEliminated: true, reason: "Incorrect submission at Q2: BioCloud Scope", time1: 45, infractions: 0 }
    ];

    const roster = [];
    const submissions = [];
    const now = Date.now();

    demoStudents.forEach((s, idx) => {
      const assignment = window.CryptoEngine.deriveSetsFromPRN(s.prn);
      const studentRecord = {
        agentId: "AG-" + (2000 + idx),
        name: s.name,
        prn: s.prn,
        codeProfile: s.codeProfile,
        assignedSets: assignment.sets,
        currentStation: s.station,
        completedStations: s.isEscaped ? [1, 2, 3, 4] : s.station > 1 ? Array.from({ length: s.station - 1 }, (_, i) => i + 1) : [],
        isEliminated: s.isEliminated || false,
        eliminatedReason: s.reason || null,
        isEscaped: s.isEscaped || false,
        remainingSeconds: 25 * 60 - ((s.time1 || 0) + (s.time2 || 0) + (s.time3 || 0) + (s.time4 || 0)),
        penaltySeconds: (s.infractions || 0) * 60,
        tabInfractions: s.infractions || 0,
        registeredAt: now - (1500000 - idx * 60000),
        lastUpdated: now - idx * 30000
      };
      roster.push(studentRecord);

      if (s.time1) {
        submissions.push({
          id: "sub_demo_1_" + idx,
          timestamp: now - (1200000 - idx * 40000),
          timeFormatted: new Date(now - (1200000 - idx * 40000)).toLocaleTimeString(),
          studentName: s.name,
          prn: s.prn,
          codeProfile: s.codeProfile,
          stationNum: 1,
          caseLetter: assignment.sets[1],
          elapsedSeconds: s.time1,
          elapsedFormatted: formatTime(s.time1),
          isCorrect: !s.isEliminated || s.station > 1,
          status: (!s.isEliminated || s.station > 1) ? "QUALIFIED FOR ROUND 2" : "ELIMINATED",
          failedQuestion: (s.isEliminated && s.station === 1) ? s.reason : null
        });
      }

      if (s.time2 && s.station >= 2) {
        submissions.push({
          id: "sub_demo_2_" + idx,
          timestamp: now - (800000 - idx * 30000),
          timeFormatted: new Date(now - (800000 - idx * 30000)).toLocaleTimeString(),
          studentName: s.name,
          prn: s.prn,
          codeProfile: s.codeProfile,
          stationNum: 2,
          caseLetter: assignment.sets[2],
          elapsedSeconds: s.time2,
          elapsedFormatted: formatTime(s.time2),
          isCorrect: !s.isEliminated || s.station > 2,
          status: (!s.isEliminated || s.station > 2) ? "QUALIFIED FOR ROUND 3" : "ELIMINATED",
          failedQuestion: (s.isEliminated && s.station === 2) ? s.reason : null
        });
      }

      if (s.time3 && s.station >= 3) {
        submissions.push({
          id: "sub_demo_3_" + idx,
          timestamp: now - (400000 - idx * 20000),
          timeFormatted: new Date(now - (400000 - idx * 20000)).toLocaleTimeString(),
          studentName: s.name,
          prn: s.prn,
          codeProfile: s.codeProfile,
          stationNum: 3,
          caseLetter: assignment.sets[3],
          elapsedSeconds: s.time3,
          elapsedFormatted: formatTime(s.time3),
          isCorrect: true,
          status: "QUALIFIED FOR ROUND 4",
          failedQuestion: null
        });
      }

      if (s.time4 && s.station >= 4 && s.isEscaped) {
        const total = (s.time1 || 0) + (s.time2 || 0) + (s.time3 || 0) + (s.time4 || 0);
        submissions.push({
          id: "sub_demo_4_" + idx,
          timestamp: now - (100000 - idx * 10000),
          timeFormatted: new Date(now - (100000 - idx * 10000)).toLocaleTimeString(),
          studentName: s.name,
          prn: s.prn,
          codeProfile: s.codeProfile,
          stationNum: 4,
          caseLetter: assignment.sets[4],
          elapsedSeconds: total,
          elapsedFormatted: formatTime(total),
          isCorrect: true,
          status: "CHAMPION / ESCAPED",
          failedQuestion: null
        });
      }
    });

    localStorage.setItem(ROSTER_KEY, JSON.stringify(roster));
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));

    // Seed Attendance
    const attendance = demoStudents.map((s, idx) => ({
      id: "att_" + s.prn,
      name: s.name,
      prn: s.prn,
      codeProfile: s.codeProfile,
      timestamp: now - (1500000 - idx * 60000),
      timeStr: new Date(now - (1500000 - idx * 60000)).toLocaleTimeString(),
      status: s.isEscaped ? "ESCAPED" : s.isEliminated ? "ELIMINATED" : "IN_TERMINAL"
    }));
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendance));

    // Seed Global Round Qualification State
    const roundState = {
      round1: { status: "RUNNING" },
      round2: { status: "RUNNING" },
      round3: { status: "RUNNING" },
      round4: { status: "RUNNING" },
      qualifiedRound2: ["2024010666", "2024010222", "2024010111", "2024010333", "2024010777"],
      qualifiedRound3: ["2024010666", "2024010222", "2024010111", "2024010777"],
      qualifiedRound4: ["2024010666", "2024010111"]
    };
    saveRoundState(roundState);

    window.dispatchEvent(new CustomEvent("blackout_roster_update", { detail: { action: "seeded" } }));
    window.dispatchEvent(new CustomEvent("blackout_submission", { detail: { action: "seeded" } }));
    window.dispatchEvent(new CustomEvent("blackout_attendance_update", { detail: { action: "seeded" } }));
  }

  // Station Countdown Durations:
  // Round 1: 8 Min | Round 2: 8 Min | Round 3: 8 Min | Round 4: 10 Min
  const STATION_ROUND_DURATIONS = {
    1: 8 * 60,   // 8 Minutes (480s)
    2: 8 * 60,   // 8 Minutes (480s)
    3: 8 * 60,   // 8 Minutes (480s)
    4: 10 * 60   // 10 Minutes (600s)
  };

  function createNewSession(name, prn) {
    const cleanPrn = (prn || "PRN0000").trim().toUpperCase();
    const assignment = window.CryptoEngine.deriveSetsFromPRN(cleanPrn);
    const session = {
      agentId: "AG-" + Math.floor(1000 + Math.random() * 9000),
      name: (name || "AGENT_X").trim(),
      prn: cleanPrn,
      assignedSets: assignment.sets, // e.g. { 1: 'B', 2: 'A', 3: 'D', 4: 'C' }
      codeProfile: assignment.codeProfile, // e.g. "CASE-BADC"
      currentStation: 1,
      completedStations: [],
      isEliminated: false,
      eliminatedReason: null,
      eliminatedStation: null,
      isEscaped: false,
      remainingSeconds: STATION_ROUND_DURATIONS[1], // Round 1: 8 Minutes (08:00)
      stationTimerInitializedFor: 1,
      penaltySeconds: 0,
      startedAt: Date.now(),
      stationStartedAt: Date.now(),
      tabInfractions: 0
    };
    saveSession(session);

    // Automatically register student in Attendance
    recordAttendance({
      id: "att_" + cleanPrn,
      name: session.name,
      prn: cleanPrn,
      codeProfile: assignment.codeProfile,
      timestamp: Date.now(),
      timeStr: new Date().toLocaleTimeString(),
      status: "CHECKED_IN"
    });

    return session;
  }

  function clearCurrentSession() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Timer Tick Engine
  let tickCounter = 0;
  function startMissionTimer(onTick) {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const session = getSession();
      if (!session || session.isEliminated || session.isEscaped) return;

      session.remainingSeconds--;
      tickCounter++;
      // Sync from online backend every 3 seconds
      if (tickCounter % 3 === 0) {
        syncFromBackend();
      }

      if (session.remainingSeconds <= 0) {
        session.remainingSeconds = 0;
        const durMin = session.currentStation === 4 ? 10 : 8;
        triggerElimination(`STATION 0${session.currentStation} CLOCK EXPIRED: Official ${durMin}-minute window elapsed.`, session.currentStation);
      } else {
        saveSession(session);
        if (typeof onTick === "function") onTick(session);
      }
    }, 1000);
  }

  function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  }

  // Sudden Death Lockout Trigger
  function triggerElimination(reason, stationNum = null) {
    const session = getSession();
    if (!session) return;

    session.isEliminated = true;
    session.eliminatedReason = reason;
    session.eliminatedStation = stationNum || session.currentStation;
    saveSession(session);

    playLockdownSiren();
    renderLockoutModal(session);
  }

  // Admin Override to Revive Agent
  function reviveEliminatedAgent(overridePrn = null) {
    const session = getSession();
    const targetPrn = overridePrn || (session && session.prn);
    if (targetPrn) {
      apiFetch("/api/students/revive", {
        method: "POST",
        body: JSON.stringify({ prn: targetPrn })
      });
    }
    if (session) {
      session.isEliminated = false;
      session.eliminatedReason = null;
      saveSession(session);
    }
    const modal = document.getElementById("lockoutModal");
    if (modal) modal.style.display = "none";
    renderActiveStation();
  }

  // Dynamic Station Renderer
  function renderActiveStation() {
    const session = getSession();
    if (!session) {
      renderRegistration();
      return;
    }

    if (session.isEliminated) {
      renderLockoutModal(session);
      return;
    }

    if (session.isEscaped) {
      renderVictoryModal(session);
      return;
    }

    // Update Telemetry Header
    updateHUD(session);

    const stationNum = session.currentStation;
    const assignedLetter = (session.assignedSets && session.assignedSets[stationNum]) || "A";
    const stationCases = window.STATION_CASES[stationNum];
    const stationData = (stationCases && stationCases[assignedLetter]) || stationCases["A"];

    const container = document.getElementById("stationContainer");
    if (!container) return;

    // Gatekeeper 1: Check if Round is PAUSED/STOPPED by Game Master
    const roundState = getRoundState();
    const roundInfo = roundState["round" + stationNum];
    if (roundInfo && roundInfo.status === "STOPPED") {
      container.innerHTML = `
        <div class="station-card" style="text-align:center;padding:3.5rem 1.5rem;max-width:680px;margin:2rem auto;border-color:var(--neon-amber);">
          <div style="font-size:3.5rem;margin-bottom:1rem;color:var(--neon-amber);">&#9208;</div>
          <h2 style="font-family:var(--font-display);color:var(--neon-amber);margin-bottom:0.75rem;">ROUND 0${stationNum} CURRENTLY PAUSED</h2>
          <p style="font-family:var(--font-mono);font-size:0.9rem;color:var(--text-secondary);line-height:1.6;margin-bottom:1.5rem;">
            The Game Master has temporarily held Station 0${stationNum}.<br/>
            Station investigative terminals are on standby pending the official countdown.
          </p>
          <div class="email-badge" style="display:inline-block;padding:0.5rem 1.25rem;border-color:var(--neon-amber);color:var(--neon-amber);font-weight:700;">
            STATUS: STANDBY FOR GAME MASTER AUTHORIZATION
          </div>
        </div>
      `;
      return;
    }

    // Gatekeeper 2: Check if Student is officially qualified for this round
    if (stationNum > 1 && !isStudentQualifiedForRound(stationNum, session.prn)) {
      container.innerHTML = `
        <div class="station-card" style="text-align:center;padding:3.5rem 1.5rem;max-width:680px;margin:2rem auto;border-color:var(--neon-red);">
          <div style="font-size:3.5rem;margin-bottom:1rem;color:var(--neon-red);">&#128683;</div>
          <h2 style="font-family:var(--font-display);color:var(--neon-red);margin-bottom:0.75rem;">ACCESS RESTRICTED: ROUND 0${stationNum}</h2>
          <p style="font-family:var(--font-mono);font-size:0.9rem;color:var(--text-secondary);line-height:1.6;margin-bottom:1.5rem;">
            Agent <strong>${escapeHtml(session.name)}</strong> (${escapeHtml(session.prn)}):<br/>
            You have not been officially qualified for Round 0${stationNum} by the Game Master.<br/>
            Only the fastest verified analysts from Round 0${stationNum - 1} are granted clearance to advance.
          </p>
          <div class="email-badge" style="display:inline-block;padding:0.5rem 1.25rem;border-color:var(--neon-red);color:var(--neon-red);font-weight:700;">
            CLEARANCE REQUIRED: CONTACT GAME MASTER DESK
          </div>
        </div>
      `;
      return;
    }

    // Ensure per-station timer is initialized (Round 1: 8m, Round 2: 8m, Round 3: 8m, Round 4: 10m)
    if (session.stationTimerInitializedFor !== stationNum) {
      session.remainingSeconds = STATION_ROUND_DURATIONS[stationNum] || (8 * 60);
      session.stationTimerInitializedFor = stationNum;
      session.stationStartedAt = Date.now();
      saveSession(session);
    }

    // Build Station Viewport HTML
    let contentHtml = `
      <div class="station-card">
        <div class="station-card-header">
          <div class="station-title-group">
            <h2>${stationData.title}</h2>
            <p>${stationData.subtitle} &bull; Set: [${assignedLetter}] &bull; Profile: ${session.codeProfile}</p>
          </div>
          <div class="telemetry-pill" style="border-color:var(--border-active)">
            <span class="label">ROUND</span>
            <span class="val">${stationNum} / 4</span>
          </div>
        </div>

        <div class="station-briefing-box">
          <strong>FORENSIC BRIEFING:</strong> ${stationData.briefing}
        </div>
    `;

    // Station Specific Evidence Rendering
    if (stationNum === 1 && stationData.emails) {
      contentHtml += renderEmailEvidence(stationData.emails);
    } else if (stationNum === 2 && stationData.dossier) {
      contentHtml += renderOsintEvidence(stationData.dossier);
    } else if (stationNum === 3 && stationData.urls) {
      contentHtml += renderUrlEvidence(stationData.urls);
    } else if (stationNum === 4 && stationData.timeline) {
      contentHtml += renderTimelineEvidence(stationData.timeline);
    }

    // Render Sudden Death Submission Form
    contentHtml += renderChallengeForm(stationData.questions, stationNum, assignedLetter);

    contentHtml += `</div>`;
    container.innerHTML = contentHtml;

    // Attach listeners
    attachFormHandlers(stationNum, assignedLetter);
  }

  function renderEmailEvidence(emails) {
    let html = `
      <div class="evidence-deck">
        <div class="evidence-deck-title">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z"/></svg>
          Captured Email Stream (3 Evidence Items)
        </div>
    `;
    emails.forEach(email => {
      html += `
        <div class="email-card">
          <div class="email-meta-header">
            <span class="email-badge">EVIDENCE ${email.id}</span>
            <span>${email.date || "TODAY"}</span>
          </div>
          <div class="email-body-content">
            <div class="email-sender">FROM: ${escapeHtml(email.sender)}</div>
            ${email.recipient ? `<div style="font-size:0.8rem;color:var(--text-muted)">TO: ${escapeHtml(email.recipient)}</div>` : ""}
            <div class="email-subject">SUBJECT: ${escapeHtml(email.subject || "Security Notice")}</div>
            <div style="margin: 0.5rem 0; color: #cfddec; white-space: pre-line;">${escapeHtml(email.body)}</div>
            ${email.headers ? `<div class="email-headers-view"><strong>[RAW MIME HEADERS]</strong>\n${escapeHtml(email.headers)}</div>` : ""}
          </div>
        </div>
      `;
    });
    html += `</div>`;
    return html;
  }

  function renderOsintEvidence(dossier) {
    let html = `
      <div class="evidence-deck">
        <div class="evidence-deck-title">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg>
          Subject Dossier: ${escapeHtml(dossier.name)} (${escapeHtml(dossier.title || "")})
        </div>
        <div class="osint-grid">
    `;
    dossier.socialPosts.forEach(post => {
      html += `
        <div class="osint-card">
          <div class="osint-platform">
            <span>${escapeHtml(post.platform)}</span>
            <span>${escapeHtml(post.date || "")}</span>
          </div>
          <div style="font-size:0.9rem;color:#d8e5f8;">${escapeHtml(post.imageCaption)}</div>
          ${post.badge ? `<div class="osint-badge-chip">${escapeHtml(post.badge)}</div>` : ""}
        </div>
      `;
    });
    html += `</div></div>`;
    return html;
  }

  function renderUrlEvidence(urls) {
    let html = `
      <div class="evidence-deck">
        <div class="evidence-deck-title">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/></svg>
          Gateway URL Triage Sandbox
        </div>
    `;
    urls.forEach((url, idx) => {
      html += `
        <div class="url-inspect-card">
          <div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:0.8rem;">
            <span style="color:var(--neon-cyan);font-weight:700;">URL #${idx + 1}</span>
            <span style="color:var(--text-muted)">CAPTURED AT GATEWAY</span>
          </div>
          <div class="url-raw-string">${escapeHtml(url.fullUrl)}</div>
          ${url.breakdown ? `
            <div class="url-chips-row">
              ${url.breakdown.userinfo ? `<div class="url-chip"><span class="chip-lbl">Userinfo (@): </span><span class="chip-val">${escapeHtml(url.breakdown.userinfo)}</span></div>` : ""}
              ${url.breakdown.actualHost ? `<div class="url-chip"><span class="chip-lbl">Actual Host: </span><span class="chip-val">${escapeHtml(url.breakdown.actualHost)}</span></div>` : ""}
              ${url.breakdown.path ? `<div class="url-chip"><span class="chip-lbl">Path: </span><span class="chip-val">${escapeHtml(url.breakdown.path)}</span></div>` : ""}
              ${url.breakdown.punycode ? `<div class="url-chip"><span class="chip-lbl">Punycode: </span><span class="chip-val">${escapeHtml(url.breakdown.punycode)}</span></div>` : ""}
            </div>
          ` : ""}
          ${url.note ? `<div style="font-size:0.8rem;color:#8ba3c7;font-style:italic;">Forensic Note: ${escapeHtml(url.note)}</div>` : ""}
        </div>
      `;
    });
    html += `</div>`;
    return html;
  }

  function renderTimelineEvidence(timeline) {
    let html = `
      <div class="evidence-deck">
        <div class="evidence-deck-title">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/></svg>
          Blackout SIEM Chronological Telemetry (08:50 - 09:00)
        </div>
        <div class="timeline-deck">
    `;
    timeline.forEach(row => {
      let tagClass = "tag-noise";
      if (row.tag === "EXECUTION" || row.tag === "PATIENT_ZERO" || row.tag === "INITIAL_ACCESS" || row.tag === "ROOT_CAUSE") tagClass = "tag-execution";
      if (row.tag === "CANARY") tagClass = "tag-canary";
      if (row.tag === "IMPACT" || row.tag === "LOCKDOWN") tagClass = "tag-impact";

      html += `
        <div class="timeline-row">
          <div class="timeline-time">${escapeHtml(row.time)}</div>
          <div class="timeline-source">${escapeHtml(row.source)}</div>
          <div class="timeline-event">${escapeHtml(row.event)}</div>
          <div class="timeline-tag ${tagClass}">${escapeHtml(row.tag)}</div>
        </div>
      `;
    });
    html += `</div></div>`;
    return html;
  }

  function renderChallengeForm(questions, stationNum, caseId) {
    let html = `
      <form id="stationForm" class="challenge-form">
        <div class="sudden-death-warning">
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
          <span><strong>SUDDEN-DEATH ACTIVE:</strong> Submitting any incorrect answer triggers instant TERMINAL LOCKOUT (ELIMINATION). Choose carefully.</span>
        </div>
    `;

    questions.forEach((q, idx) => {
      html += `
        <div class="form-field-group">
          <label class="form-label">${escapeHtml(q.label)}</label>
          <div class="form-prompt">${escapeHtml(q.prompt)}</div>
          <div class="mcq-options-grid" data-question="${q.id}">
      `;

      if (q.options && q.options.length > 0) {
        q.options.forEach(opt => {
          html += `
            <label class="mcq-option-card" data-val="${escapeHtml(opt.value)}">
              <input type="radio" name="${q.id}" value="${escapeHtml(opt.value)}" class="mcq-radio-hidden" />
              <span class="mcq-letter-badge">${escapeHtml(opt.value)}</span>
              <span class="mcq-option-text">${escapeHtml(opt.text)}</span>
            </label>
          `;
        });
      }

      html += `</div></div>`;
    });

    html += `
        <button type="submit" class="btn-submit-cyber">
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
          SUBMIT FORENSIC VERIFICATION
        </button>
      </form>
    `;
    return html;
  }

  function attachFormHandlers(stationNum, assignedLetter) {
    const form = document.getElementById("stationForm");
    if (!form) return;

    form.addEventListener("change", e => {
      if (e.target.type === "radio") {
        initAudio();
        playKeyClick();
        const parentGrid = e.target.closest(".mcq-options-grid");
        if (parentGrid) {
          parentGrid.querySelectorAll(".mcq-option-card").forEach(c => c.classList.remove("selected"));
          const parentCard = e.target.closest(".mcq-option-card");
          if (parentCard) parentCard.classList.add("selected");
        }
      }
    });

    form.addEventListener("submit", e => {
      e.preventDefault();
      initAudio();
      playKeyClick();

      const formData = new FormData(form);
      const session = getSession();
      if (!session || session.isEliminated) return;

      const stationCases = window.STATION_CASES[stationNum];
      const stationData = stationCases[assignedLetter] || stationCases["A"];
      const questions = stationData.questions;

      let allCorrect = true;
      let failedQuestion = null;

      // Calculate time taken on this specific station
      const now = Date.now();
      const stationStart = session.stationStartedAt || session.startedAt || now;
      const elapsedSeconds = Math.max(1, Math.round((now - stationStart) / 1000));
      const elapsedFormatted = formatTime(elapsedSeconds);

      // 1. Verify that the agent has chosen an answer for all questions
      for (let q of questions) {
        const val = formData.get(q.id);
        if (!val) {
          playErrorBuzz();
          alert(`⚠️ INCOMPLETE FORENSIC RECORD:\nPlease select an answer for "${q.label}" before submitting verification.`);
          return;
        }
      }

      // 2. Verify each question with CryptoEngine
      for (let q of questions) {
        const userVal = formData.get(q.id);
        const isValid = window.CryptoEngine.verifyStationMCQ(stationNum, assignedLetter, q.id, userVal);
        if (!isValid) {
          allCorrect = false;
          failedQuestion = q.label;
          break;
        }
      }

      if (!allCorrect) {
        // Sudden death elimination!
        playErrorBuzz();
        const reason = `Incorrect submission at ${failedQuestion}. Threat actor detected your unauthorized attempt.`;

        // Log to Admin Submissions Feed
        recordSubmission({
          id: "sub_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
          timestamp: Date.now(),
          timeFormatted: new Date().toLocaleTimeString(),
          studentName: session.name,
          prn: session.prn,
          codeProfile: session.codeProfile,
          stationNum: stationNum,
          caseLetter: assignedLetter,
          elapsedSeconds: elapsedSeconds,
          elapsedFormatted: elapsedFormatted,
          isCorrect: false,
          status: "ELIMINATED",
          failedQuestion: failedQuestion || "Forensic Verification Failed"
        });

        triggerElimination(reason, stationNum);
      } else {
        // Correct submission!
        playSuccessChime();
        if (!session.completedStations.includes(stationNum)) {
          session.completedStations.push(stationNum);
        }

        const nextRound = stationNum < 4 ? stationNum + 1 : 4;

        // Log to Admin Submissions Feed
        recordSubmission({
          id: "sub_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
          timestamp: Date.now(),
          timeFormatted: new Date().toLocaleTimeString(),
          studentName: session.name,
          prn: session.prn,
          codeProfile: session.codeProfile,
          stationNum: stationNum,
          caseLetter: assignedLetter,
          elapsedSeconds: elapsedSeconds,
          elapsedFormatted: elapsedFormatted,
          isCorrect: true,
          status: stationNum < 4 ? `QUALIFIED FOR ROUND ${nextRound}` : "CHAMPION / ESCAPED",
          failedQuestion: null
        });

        if (stationNum < 4) {
          // Auto-qualify student upon verified forensic completion
          qualifyStudentsForRound(nextRound, [session.prn]);
          session.stationStartedAt = Date.now();
          saveSession(session);
          showToast(`✓ STATION 0${stationNum} VERIFIED! STANDBY FOR GAME MASTER SELECTION.`, "success");
          renderRoundCompleteModal(session, stationNum, elapsedFormatted);
        } else {
          // Final Station Complete - Escape Room Cleared!
          session.isEscaped = true;
          saveSession(session);
          renderVictoryModal(session);
        }
      }
    });
  }

  // Round Completed Standby & Logout Screen
  function renderRoundCompleteModal(session, stationNum, elapsedFormatted) {
    const nextRound = stationNum + 1;
    const container = document.getElementById("stationContainer");
    if (!container) return;

    container.innerHTML = `
      <div class="station-card" style="max-width:680px;margin:2.5rem auto;text-align:center;border-color:var(--neon-green);box-shadow:0 0 35px rgba(0,255,136,0.25);">
        <div style="font-size:3.5rem;color:var(--neon-green);margin-bottom:0.75rem;">✓</div>
        <h2 style="font-family:var(--font-display);font-size:1.6rem;color:var(--neon-green);letter-spacing:1px;margin-bottom:0.5rem;">
          STATION 0${stationNum} VERIFIED &amp; COMPLETED
        </h2>
        <div style="font-family:var(--font-mono);font-size:0.9rem;color:#d8ffea;margin-bottom:1.5rem;">
          AGENT: <strong>${escapeHtml(session.name)}</strong> &bull; PRN: <strong style="color:var(--neon-cyan);">${escapeHtml(session.prn)}</strong> &bull; CLEAR TIME: <strong style="color:#fff;">${elapsedFormatted}</strong>
        </div>

        <div style="background:rgba(0,0,0,0.4);border:1px dashed var(--neon-cyan);border-radius:8px;padding:1.25rem;text-align:left;font-family:var(--font-mono);font-size:0.85rem;color:var(--text-secondary);line-height:1.7;margin-bottom:1.75rem;">
          <div style="color:var(--neon-cyan);font-weight:700;margin-bottom:0.4rem;text-transform:uppercase;">
            📡 SUBMISSION TRANSMITTED TO GAME MASTER OVERSEER
          </div>
          &bull; Your clear time has been recorded in the Master Qualification Leaderboard.<br/>
          &bull; The Game Master will now review rankings and select the fastest finalists for <strong>ROUND 0${nextRound}</strong>.<br/>
          &bull; Terminal session for Round 0${stationNum} has concluded.
        </div>

        <div style="font-family:var(--font-mono);font-size:0.85rem;color:var(--neon-amber);margin-bottom:1.25rem;">
          ⏳ Standby for Game Master announcement. You must log out your terminal now.
        </div>

        <button id="btnLogoutAfterRound" class="btn-submit-cyber" style="width:auto;padding:0.75rem 2rem;font-size:0.9rem;background:rgba(255,0,85,0.15);border-color:var(--neon-red);color:#ff99aa;">
          🚪 LOGOUT TERMINAL &bull; RETURN TO STANDBY
        </button>
      </div>
    `;

    document.getElementById("btnLogoutAfterRound").addEventListener("click", () => {
      initAudio();
      playKeyClick();
      clearCurrentSession();
      renderRegistration();
      showToast(`Terminal logged out. Standby for Round 0${nextRound} announcement.`, "info");
    });
  }

  // Lockout Modal
  function renderLockoutModal(session) {
    let modal = document.getElementById("lockoutModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "lockoutModal";
      modal.className = "lockout-modal-backdrop";
      document.body.appendChild(modal);
    }
    modal.style.display = "flex";

    modal.innerHTML = `
      <div class="lockout-box">
        <div class="lockout-icon">&#9888;</div>
        <div class="lockout-title">TERMINAL LOCKDOWN</div>
        <div style="font-family:var(--font-mono);font-size:0.9rem;color:var(--neon-red);letter-spacing:1px;">
          AGENT STATUS: ELIMINATED
        </div>
        <div class="lockout-desc">
          ${escapeHtml(session.eliminatedReason || "Security violation detected during forensic verification.")}
        </div>
        <div class="lockout-instruction">
          Your station terminal has been isolated from the network.<br/>
          <strong>REPORT TO THE GAME MASTER IMMEDIATELY.</strong><br/>
          An official override key is required to reset your terminal.
        </div>
        <div class="admin-override-group">
          <input type="password" id="overridePass" class="form-input" placeholder="Game Master Override Key..." style="flex:1;" />
          <button id="btnOverride" class="btn-cyber-danger-sm">DISARM LOCKOUT</button>
        </div>
        <div id="overrideMsg" style="font-family:var(--font-mono);font-size:0.8rem;color:var(--neon-red);"></div>
      </div>
    `;

    document.getElementById("btnOverride").addEventListener("click", () => {
      initAudio();
      const pass = document.getElementById("overridePass").value;
      if (window.CryptoEngine.verifyAdmin(pass)) {
        playSuccessChime();
        reviveEliminatedAgent();
      } else {
        playErrorBuzz();
        document.getElementById("overrideMsg").innerText = "INVALID OVERRIDE KEY. ACCESS DENIED.";
      }
    });

    const overrideInput = document.getElementById("overridePass");
    if (overrideInput) {
      overrideInput.addEventListener("keypress", e => {
        if (e.key === "Enter") {
          document.getElementById("btnOverride").click();
        }
      });
    }
  }

  // Victory / Room Escape Modal
  function renderVictoryModal(session) {
    let modal = document.getElementById("victoryModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "victoryModal";
      modal.className = "victory-modal-backdrop";
      document.body.appendChild(modal);
    }
    modal.style.display = "flex";

    const s4Set = (session.assignedSets && session.assignedSets[4]) || "A";
    const s4Data = window.STATION_CASES[4][s4Set] || window.STATION_CASES[4]["A"];
    const exitPin = s4Data.exitPin || "25";

    const elapsed = 25 * 60 - session.remainingSeconds;

    modal.innerHTML = `
      <div class="victory-box">
        <div style="font-family:var(--font-display);font-size:1.8rem;color:var(--neon-green);font-weight:900;letter-spacing:2px;">
          BLACKOUT DEFENDED
        </div>
        <div style="font-family:var(--font-mono);font-size:0.85rem;color:#85ffc7;">
          AGENT: ${escapeHtml(session.name)} &bull; PRN: ${escapeHtml(session.prn)} &bull; ALL 4 STATIONS VERIFIED
        </div>

        <div class="pin-display-banner">
          <div class="pin-label">OFFICIAL ROOM EXIT PIN</div>
          <div class="pin-code-giant">${exitPin}</div>
          <div style="font-size:0.85rem;color:#ccc;margin-top:0.5rem;">
            Call out this PIN to the Game Master to stop the official event clock!
          </div>
        </div>

        <div style="display:flex;justify-content:space-around;background:rgba(0,0,0,0.4);padding:1rem;border-radius:6px;font-family:var(--font-mono);font-size:0.85rem;flex-wrap:wrap;gap:0.5rem;">
          <div><span style="color:var(--text-muted)">CLEAR TIME:</span> <strong style="color:#fff;">${formatTime(elapsed)}</strong></div>
          <div><span style="color:var(--text-muted)">CASE PROFILE:</span> <strong style="color:var(--neon-cyan);">${session.codeProfile}</strong></div>
          <div><span style="color:var(--text-muted)">RANK:</span> <strong style="color:var(--neon-green);">ELITE SOC ANALYST</strong></div>
        </div>

        <button id="btnCloseVictory" class="btn-cyber-sm" style="align-self:center;margin-top:0.5rem;">CLOSE PASS</button>
      </div>
    `;

    document.getElementById("btnCloseVictory").addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // Registration Screen
  function renderRegistration() {
    const container = document.getElementById("stationContainer");
    if (!container) return;

    container.innerHTML = `
      <div class="station-card" style="max-width:680px;margin:2rem auto;">
        <div class="station-card-header">
          <div class="station-title-group">
            <h2>CAMPUS CYBER ESCAPE</h2>
            <p>OPERATION BLACKOUT PROTOCOL // AGENT REGISTRATION</p>
          </div>
        </div>

        <div class="station-briefing-box">
          <strong>MISSION DIRECTIVE:</strong> The campus core hypervisor has suffered a multi-vector breach. Enter your Full Name and College PRN Number to access your investigative terminal.
        </div>

        <div class="sudden-death-warning">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
          <div>
            <strong>STRICT SUDDEN-DEATH ELIMINATION:</strong><br/>
            Submitting any incorrect multiple-choice answer triggers instant <strong>TERMINAL LOCKOUT</strong>. Do not guess. Check all evidence carefully.
          </div>
        </div>

        <form id="regForm" class="challenge-form" style="margin-top:0;">
          <div class="form-field-group">
            <label class="form-label">STUDENT FULL NAME</label>
            <input type="text" id="nameInput" class="form-input" placeholder="e.g. Alex Mercer" required autofocus />
          </div>

          <div class="form-field-group">
            <label class="form-label">COLLEGE PRN NUMBER / ROLL ID</label>
            <input type="text" id="prnInput" class="form-input" placeholder="e.g. 2024010529" required />
            <div style="font-size:0.75rem;color:var(--neon-cyan);margin-top:0.3rem;">
              <strong>CASE AUTO-ASSIGNMENT:</strong> Your unique pathway across all 16 station cases is mathematically determined from your PRN. No manual selection permitted.
            </div>
          </div>

          <button type="submit" class="btn-submit-cyber">
            INITIALIZE AGENT TERMINAL
          </button>
        </form>
      </div>
    `;

    document.getElementById("regForm").addEventListener("submit", e => {
      e.preventDefault();
      initAudio();
      playKeyClick();

      const name = document.getElementById("nameInput").value.trim();
      const prn = document.getElementById("prnInput").value.trim().toUpperCase();

      // Check student history in roster
      const roster = getRoster();
      const existing = roster.find(r => (r.prn || "").toUpperCase() === prn);

      if (existing && existing.isEliminated) {
        playErrorBuzz();
        alert(`ACCESS DENIED: Agent ${prn} is ELIMINATED.\nReason: ${existing.eliminatedReason || "Previous elimination"}.\n\nReport to the Game Master desk for manual override.`);
        return;
      }

      if (existing && existing.isEscaped) {
        playSuccessChime();
        alert(`CONGRATULATIONS: Agent ${prn} has already defended the campus and escaped!`);
        return;
      }

      // Determine highest qualified station for this student
      let highestQualified = 1;
      for (let s = 4; s >= 2; s--) {
        if (isStudentQualifiedForRound(s, prn)) {
          highestQualified = s;
          break;
        }
      }

      // Check URL param if student scanned a specific station QR poster
      const urlParams = new URLSearchParams(window.location.search);
      const paramStation = parseInt(urlParams.get("station"), 10);

      let targetStation = 1;
      if (paramStation && paramStation >= 1 && paramStation <= 4) {
        targetStation = paramStation;
      } else if (highestQualified > 1) {
        targetStation = highestQualified;
      } else if (existing && existing.completedStations && existing.completedStations.length > 0) {
        targetStation = Math.min(4, Math.max(...existing.completedStations) + 1);
      }

      // If targetStation > 1: verify Game Master Finalist clearance and Round Running status
      if (targetStation > 1) {
        if (!isStudentQualifiedForRound(targetStation, prn)) {
          playErrorBuzz();
          alert(`⛔ ACCESS RESTRICTED: Agent ${name} (${prn})\n\nYou have NOT been selected as a Round 0${targetStation} Finalist by the Game Master.\n\nPlease await the Game Master's announcement of finalists.`);
          return;
        }

        const roundState = getRoundState();
        const rInfo = roundState["round" + targetStation];
        if (!rInfo || rInfo.status !== "RUNNING") {
          playErrorBuzz();
          alert(`⏳ STANDBY: Agent ${name} (${prn})\n\nYou are an OFFICIALLY APPROVED FINALIST for Round 0${targetStation}!\n\nHowever, the Game Master has not started Round 0${targetStation} yet. Please wait for the start signal.`);
          return;
        }
      } else {
        // Round 1 start check
        const roundState = getRoundState();
        const rInfo = roundState["round1"];
        if (rInfo && rInfo.status === "STOPPED") {
          playErrorBuzz();
          alert(`⏳ STANDBY: Round 01 is currently PAUSED by the Game Master.\n\nPlease await the start signal.`);
          return;
        }
      }

      // Initialize terminal session for targetStation
      let session = createNewSession(name, prn);
      session.currentStation = targetStation;
      const priorStations = [];
      for (let k = 1; k < targetStation; k++) priorStations.push(k);
      session.completedStations = Array.from(new Set([...(existing?.completedStations || []), ...priorStations]));
      session.remainingSeconds = STATION_ROUND_DURATIONS[targetStation] || (8 * 60);
      session.stationTimerInitializedFor = targetStation;
      session.stationStartedAt = Date.now();
      saveSession(session);

      playSuccessChime();
      renderActiveStation();
      startMissionTimer(updateHUD);
    });
  }

  function updateHUD(session) {
    if (!session) return;
    const callsignEl = document.getElementById("hudCallsign");
    const prnEl = document.getElementById("hudPRN");
    const caseEl = document.getElementById("hudCase");
    const timerEl = document.getElementById("hudTimer");
    const threatEl = document.getElementById("hudThreat");

    if (callsignEl) callsignEl.innerText = session.name || "UNREGISTERED";
    if (prnEl) prnEl.innerText = session.prn || "------";
    if (caseEl) caseEl.innerText = session.codeProfile || "------";
    if (timerEl) {
      timerEl.innerText = formatTime(session.remainingSeconds);
      if (session.remainingSeconds < 300) {
        timerEl.parentElement.classList.add("urgent");
      }
    }
    if (threatEl) {
      threatEl.innerText = session.isEliminated ? "ELIMINATED" : "ACTIVE";
    }

    // Update both top tracker bar and bottom dock buttons
    const roundState = getRoundState();
    for (let i = 1; i <= 4; i++) {
      const topNode = document.getElementById(`trackNode${i}`);
      const dockBtn = document.getElementById(`dockNode${i}`);

      const isCompleted = session.completedStations.includes(i);
      const isCurrent = session.currentStation === i;
      const isQualified = isStudentQualifiedForRound(i, session.prn);
      const isRoundActive = !roundState["round" + i] || roundState["round" + i].status !== "STOPPED";

      if (topNode) {
        topNode.classList.remove("active", "completed", "locked");
        if (isCompleted) {
          topNode.classList.add("completed");
          topNode.querySelector(".node-status").innerText = "VERIFIED";
        } else if (isCurrent) {
          topNode.classList.add("active");
          topNode.querySelector(".node-status").innerText = isRoundActive ? "IN PROGRESS" : "PAUSED";
        } else {
          topNode.classList.add("locked");
          topNode.querySelector(".node-status").innerText = isQualified ? "UNLOCKED" : "LOCKED";
        }
      }

      if (dockBtn) {
        dockBtn.classList.remove("active", "completed", "locked");
        const iconSpan = dockBtn.querySelector(".dock-icon");
        if (isCompleted) {
          dockBtn.classList.add("completed");
          if (iconSpan) iconSpan.innerText = "✓";
        } else if (isCurrent) {
          dockBtn.classList.add("active");
          if (iconSpan) iconSpan.innerText = `${i}️⃣`;
        } else {
          dockBtn.classList.add("locked");
          if (iconSpan) iconSpan.innerText = isQualified ? "🔓" : "🔒";
        }
      }
    }
  }

  function showToast(msg, type = "info") {
    let toast = document.getElementById("cyberToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "cyberToast";
      toast.style.cssText = "position:fixed;bottom:20px;right:20px;padding:12px 20px;border-radius:6px;font-family:monospace;font-size:13px;z-index:99999;box-shadow:0 0 15px rgba(0,0,0,0.8);transition:opacity 0.3s ease;";
      document.body.appendChild(toast);
    }
    if (type === "success") {
      toast.style.background = "#051c0f";
      toast.style.border = "1px solid #00ff88";
      toast.style.color = "#00ff88";
    } else {
      toast.style.background = "#140a1c";
      toast.style.border = "1px solid #00f0ff";
      toast.style.color = "#00f0ff";
    }
    toast.innerText = msg;
    toast.style.opacity = "1";
    setTimeout(() => { toast.style.opacity = "0"; }, 3000);
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  window.escapeHtml = escapeHtml;

  // Bootstrap Game
  function init() {
    // Pull fresh state from Neon PostgreSQL
    syncFromBackend();

    // URL Gatekeeping & parameter check
    const urlParams = new URLSearchParams(window.location.search);
    const paramStation = parseInt(urlParams.get("station"), 10);

    let session = getSession();

    if (paramStation && !session) {
      showToast(`Please register with your Name and PRN before accessing Station ${paramStation}.`, "info");
    } else if (paramStation && session) {
      if (paramStation > session.currentStation && !session.completedStations.includes(paramStation - 1)) {
        showToast(`GATEWAY LOCKED: You must complete Station 0${paramStation - 1} first.`, "error");
      } else if (!isStudentQualifiedForRound(paramStation, session.prn)) {
        showToast(`RESTRICTED: You are not qualified for Round ${paramStation} by the Game Master!`, "error");
      } else {
        session.currentStation = paramStation;
        saveSession(session);
      }
    }

    if (session) {
      renderActiveStation();
      startMissionTimer(updateHUD);
    } else {
      renderRegistration();
    }

    // Bottom dock click handlers
    for (let i = 1; i <= 4; i++) {
      const dockBtn = document.getElementById(`dockNode${i}`);
      if (dockBtn) {
        dockBtn.addEventListener("click", () => {
          initAudio();
          const sess = getSession();
          if (!sess) {
            showToast("Please register first to initialize your terminal.", "error");
            return;
          }
          if (sess.isEliminated) {
            showToast("TERMINAL LOCKED: Agent has been eliminated.", "error");
            return;
          }
          if (i === sess.currentStation) return;

          if (i < sess.currentStation) {
            sess.currentStation = i;
            saveSession(sess);
            renderActiveStation();
            return;
          }

          // Trying to advance: check prior completion & qualification
          const isQual = isStudentQualifiedForRound(i, sess.prn);
          const hasPrior = sess.completedStations && sess.completedStations.includes(i - 1);
          if (!hasPrior && !isQual) {
            playErrorBuzz();
            showToast(`⛔ GATE LOCKED: You must complete Station 0${i - 1} before accessing Station 0${i}!`, "error");
            return;
          }

          if (!isQual) {
            playErrorBuzz();
            showToast(`⛔ RESTRICTED: You are not qualified for Round 0${i} by the Game Master!`, "error");
            return;
          }

          const roundState = getRoundState();
          const rInfo = roundState["round" + i];
          if (rInfo && rInfo.status === "STOPPED") {
            playErrorBuzz();
            showToast(`⏳ PAUSED: Round 0${i} is currently paused by the Game Master!`, "error");
            return;
          }

          playKeyClick();
          sess.currentStation = i;
          if (!sess.completedStations) sess.completedStations = [];
          for (let k = 1; k < i; k++) {
            if (!sess.completedStations.includes(k)) sess.completedStations.push(k);
          }
          if (sess.stationTimerInitializedFor !== i) {
            sess.remainingSeconds = STATION_ROUND_DURATIONS[i] || (8 * 60);
            sess.stationTimerInitializedFor = i;
            sess.stationStartedAt = Date.now();
          }
          saveSession(sess);
          renderActiveStation();
        });
      }
    }

    // Listen for live round status or qualification updates from Game Master
    window.addEventListener("blackout_round_update", () => {
      const sess = getSession();
      if (sess && !sess.isEliminated && !sess.isEscaped) {
        renderActiveStation();
      }
    });

    // Header Action Listeners
    const btnAudio = document.getElementById("btnToggleAudio");
    if (btnAudio) {
      btnAudio.addEventListener("click", () => {
        initAudio();
        isMuted = !isMuted;
        btnAudio.innerText = isMuted ? "🔇 AUDIO: OFF" : "🔊 AUDIO: ON";
      });
    }

    const btnReset = document.getElementById("btnResetGame");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        if (confirm("Reset current mission? All station progress will be cleared.")) {
          clearCurrentSession();
          renderRegistration();
        }
      });
    }
  }

  return {
    init: init,
    getSession: getSession,
    saveSession: saveSession,
    reviveAgent: reviveEliminatedAgent,
    renderActiveStation: renderActiveStation,
    clearSession: clearCurrentSession,
    getSubmissions: getSubmissions,
    recordSubmission: recordSubmission,
    clearSubmissions: clearSubmissions,
    getRoster: getRoster,
    clearRoster: clearRoster,
    seedDemoData: seedDemoData,
    getAttendance: getAttendance,
    recordAttendance: recordAttendance,
    updateAttendanceStatus: updateAttendanceStatus,
    clearAttendance: clearAttendance,
    getRoundState: getRoundState,
    saveRoundState: saveRoundState,
    setRoundStatus: setRoundStatus,
    qualifyStudentsForRound: qualifyStudentsForRound,
    revokeStudentQualification: revokeStudentQualification,
    isStudentQualifiedForRound: isStudentQualifiedForRound,
    deleteStudent: deleteStudent,
    syncFromBackend: syncFromBackend,
    apiFetch: apiFetch
  };
})();

window.AppEngine = AppEngine;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    AppEngine.init();
  });
} else {
  AppEngine.init();
}
