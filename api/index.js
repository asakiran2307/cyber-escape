/**
 * BLACKOUT PROTOCOL: Unified Vercel Serverless API Router
 * Endpoints for multi-device live synchronization backed by Neon PostgreSQL.
 */

const { pool, initDb } = require("./db");

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === "object") {
      return resolve(req.body);
    }
    let data = "";
    req.on("data", chunk => {
      data += chunk;
    });
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  });
  res.end(JSON.stringify(data));
}

module.exports = async function handler(req, res) {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    });
    return res.end();
  }

  // Ensure DB schema is initialized
  try {
    await initDb();
  } catch (dbErr) {
    return sendJson(res, 500, { error: "Database connection failed", details: dbErr.message });
  }

  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname.replace(/\/+$/, "");
  const method = req.method.toUpperCase();

  try {
    // -------------------------------------------------------------
    // GET /api/state: Full snapshot of rounds, roster, attendance & submissions
    // -------------------------------------------------------------
    if (pathname === "/api/state" && method === "GET") {
      const [roundsRes, studentsRes, submissionsRes, attendanceRes] = await Promise.all([
        pool.query("SELECT state FROM game_state WHERE key = 'GLOBAL_ROUND_STATE' LIMIT 1"),
        pool.query("SELECT * FROM students ORDER BY last_active_at DESC NULLS LAST, created_at DESC"),
        pool.query("SELECT * FROM submissions ORDER BY timestamp DESC LIMIT 300"),
        pool.query("SELECT * FROM attendance ORDER BY timestamp DESC")
      ]);

      const roundState = roundsRes.rows[0]?.state || {
        round1: { status: "RUNNING" },
        round2: { status: "LOCKED" },
        round3: { status: "LOCKED" },
        round4: { status: "LOCKED" },
        qualifiedRound2: [],
        qualifiedRound3: [],
        qualifiedRound4: []
      };

      // Format student records for frontend
      const roster = studentsRes.rows.map(r => ({
        prn: r.prn,
        name: r.name,
        agentId: r.agent_id,
        codeProfile: r.code_profile,
        assignedSets: r.assigned_sets || {},
        currentStation: r.current_station,
        completedStations: Array.isArray(r.completed_stations) ? r.completed_stations : [],
        isEliminated: Boolean(r.is_eliminated),
        eliminatedReason: r.eliminated_reason,
        eliminatedStation: r.eliminated_station,
        isEscaped: Boolean(r.is_escaped),
        remainingSeconds: r.remaining_seconds,
        penaltySeconds: r.penalty_seconds || 0,
        tabInfractions: r.tab_infractions || 0,
        startedAt: r.started_at ? Number(r.started_at) : null,
        stationStartedAt: r.station_started_at ? Number(r.station_started_at) : null,
        registeredAt: r.started_at ? Number(r.started_at) : Date.now(),
        lastUpdated: r.last_active_at ? Number(r.last_active_at) : Date.now()
      }));

      // Format submissions for frontend
      const submissions = submissionsRes.rows.map(s => ({
        id: s.id,
        prn: s.prn,
        studentName: s.student_name,
        codeProfile: s.code_profile,
        stationNum: s.station_num,
        caseLetter: s.case_letter,
        elapsedSeconds: s.elapsed_seconds,
        elapsedFormatted: s.elapsed_formatted,
        isCorrect: Boolean(s.is_correct),
        status: s.status,
        failedQuestion: s.failed_question,
        timestamp: Number(s.timestamp),
        timeFormatted: new Date(Number(s.timestamp)).toLocaleTimeString()
      }));

      // Format attendance for frontend
      const attendance = attendanceRes.rows.map(a => ({
        id: a.id,
        prn: a.prn,
        name: a.name,
        codeProfile: a.code_profile,
        status: a.status,
        timestamp: Number(a.timestamp),
        timeStr: a.time_str
      }));

      return sendJson(res, 200, {
        success: true,
        serverTime: Date.now(),
        roundState,
        roster,
        submissions,
        attendance
      });
    }

    // -------------------------------------------------------------
    // POST /api/students: Register or Update Student Session
    // -------------------------------------------------------------
    if (pathname === "/api/students" && method === "POST") {
      const body = await parseJsonBody(req);
      const prn = (body.prn || "").trim().toUpperCase();
      const name = (body.name || "AGENT_X").trim();
      if (!prn) return sendJson(res, 400, { error: "Missing PRN" });

      const now = Date.now();
      const query = `
        INSERT INTO students (
          prn, name, agent_id, code_profile, assigned_sets,
          current_station, completed_stations, is_eliminated,
          eliminated_reason, eliminated_station, is_escaped,
          remaining_seconds, penalty_seconds, tab_infractions,
          started_at, station_started_at, last_active_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        ON CONFLICT (prn) DO UPDATE SET
          name = EXCLUDED.name,
          agent_id = COALESCE(EXCLUDED.agent_id, students.agent_id),
          code_profile = COALESCE(EXCLUDED.code_profile, students.code_profile),
          assigned_sets = COALESCE(EXCLUDED.assigned_sets, students.assigned_sets),
          current_station = GREATEST(students.current_station, EXCLUDED.current_station),
          completed_stations = (
            SELECT jsonb_agg(DISTINCT elem)
            FROM jsonb_array_elements(students.completed_stations || EXCLUDED.completed_stations) elem
          ),
          is_eliminated = EXCLUDED.is_eliminated,
          eliminated_reason = EXCLUDED.eliminated_reason,
          eliminated_station = EXCLUDED.eliminated_station,
          is_escaped = (students.is_escaped OR EXCLUDED.is_escaped),
          remaining_seconds = EXCLUDED.remaining_seconds,
          penalty_seconds = EXCLUDED.penalty_seconds,
          tab_infractions = EXCLUDED.tab_infractions,
          last_active_at = EXCLUDED.last_active_at
        RETURNING *;
      `;

      const values = [
        prn,
        name,
        body.agentId || null,
        body.codeProfile || null,
        JSON.stringify(body.assignedSets || {}),
        body.currentStation || 1,
        JSON.stringify(body.completedStations || []),
        Boolean(body.isEliminated),
        body.eliminatedReason || null,
        body.eliminatedStation || null,
        Boolean(body.isEscaped),
        body.remainingSeconds !== undefined ? body.remainingSeconds : 480,
        body.penaltySeconds || 0,
        body.tabInfractions || 0,
        body.startedAt || now,
        body.stationStartedAt || now,
        now
      ];

      const result = await pool.query(query, values);

      // Also ensure student is in attendance
      await pool.query(
        `
        INSERT INTO attendance (id, prn, name, code_profile, status, timestamp, time_str)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          status = CASE
            WHEN EXCLUDED.status = 'ESCAPED' THEN 'ESCAPED'
            WHEN EXCLUDED.status = 'ELIMINATED' THEN 'ELIMINATED'
            ELSE attendance.status
          END;
      `,
        [
          "att_" + prn,
          prn,
          name,
          body.codeProfile || null,
          body.isEscaped ? "ESCAPED" : body.isEliminated ? "ELIMINATED" : "PRESENT",
          now,
          new Date(now).toLocaleTimeString()
        ]
      );

      return sendJson(res, 200, { success: true, student: result.rows[0] });
    }

    // -------------------------------------------------------------
    // DELETE /api/students: Delete User & Cascade All Related Records
    // -------------------------------------------------------------
    if (pathname === "/api/students" && method === "DELETE") {
      const prn = (url.searchParams.get("prn") || "").trim().toUpperCase();
      if (!prn) return sendJson(res, 400, { error: "Missing prn query parameter" });

      // 1. Delete from students table (cascades to submissions & attendance)
      const delRes = await pool.query("DELETE FROM students WHERE UPPER(prn) = $1 RETURNING prn, name", [prn]);

      // 2. Also ensure manual attendance entries deleted if any orphaned
      await pool.query("DELETE FROM attendance WHERE UPPER(prn) = $1", [prn]);
      await pool.query("DELETE FROM submissions WHERE UPPER(prn) = $1", [prn]);

      // 3. Remove PRN from qualifiedRound lists in game_state
      const stateRes = await pool.query("SELECT state FROM game_state WHERE key = 'GLOBAL_ROUND_STATE'");
      if (stateRes.rows[0]) {
        const state = stateRes.rows[0].state;
        let changed = false;
        [2, 3, 4].forEach(r => {
          const k = "qualifiedRound" + r;
          if (Array.isArray(state[k])) {
            const before = state[k].length;
            state[k] = state[k].filter(p => String(p).trim().toUpperCase() !== prn);
            if (state[k].length !== before) changed = true;
          }
        });
        if (changed) {
          await pool.query("UPDATE game_state SET state = $1, updated_at = NOW() WHERE key = 'GLOBAL_ROUND_STATE'", [
            JSON.stringify(state)
          ]);
        }
      }

      return sendJson(res, 200, {
        success: true,
        message: `Student ${prn} permanently deleted from database.`,
        deletedCount: delRes.rowCount
      });
    }

    // -------------------------------------------------------------
    // POST /api/students/revive: Revive Eliminated Student
    // -------------------------------------------------------------
    if (pathname === "/api/students/revive" && method === "POST") {
      const body = await parseJsonBody(req);
      const prn = (body.prn || "").trim().toUpperCase();
      if (!prn) return sendJson(res, 400, { error: "Missing PRN" });

      await pool.query(
        `
        UPDATE students
        SET is_eliminated = FALSE, eliminated_reason = NULL, tab_infractions = 0, last_active_at = $2
        WHERE UPPER(prn) = $1;
      `,
        [prn, Date.now()]
      );

      await pool.query(
        `
        UPDATE attendance
        SET status = 'PRESENT'
        WHERE UPPER(prn) = $1 AND status = 'ELIMINATED';
      `,
        [prn]
      );

      return sendJson(res, 200, { success: true, message: `Student ${prn} revived successfully.` });
    }

    // -------------------------------------------------------------
    // POST /api/submissions: Record Forensic Verification Attempt
    // -------------------------------------------------------------
    if (pathname === "/api/submissions" && method === "POST") {
      const sub = await parseJsonBody(req);
      const prn = (sub.prn || "").trim().toUpperCase();
      const id = sub.id || "sub_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
      const now = sub.timestamp || Date.now();
      const stationNum = parseInt(sub.stationNum, 10);
      const isCorrect = Boolean(sub.isCorrect);

      // Ensure student exists in DB before inserting foreign key
      await pool.query(
        `
        INSERT INTO students (prn, name, code_profile, current_station, remaining_seconds, last_active_at)
        VALUES ($1, $2, $3, $4, 480, $5)
        ON CONFLICT (prn) DO UPDATE SET last_active_at = EXCLUDED.last_active_at;
      `,
        [prn, sub.studentName || prn, sub.codeProfile || "PROFILE", stationNum, now]
      );

      // Insert submission
      await pool.query(
        `
        INSERT INTO submissions (
          id, prn, student_name, code_profile, station_num,
          case_letter, elapsed_seconds, elapsed_formatted,
          is_correct, status, failed_question, timestamp
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO NOTHING;
      `,
        [
          id,
          prn,
          sub.studentName,
          sub.codeProfile,
          stationNum,
          sub.caseLetter || "A",
          sub.elapsedSeconds || 0,
          sub.elapsedFormatted || "00:00",
          isCorrect,
          sub.status || (isCorrect ? "CORRECT" : "ELIMINATED"),
          sub.failedQuestion || null,
          now
        ]
      );

      // If correct: auto-qualify and update student progress
      if (isCorrect) {
        const nextRound = stationNum < 4 ? stationNum + 1 : 4;
        await pool.query(
          `
          UPDATE students
          SET
            current_station = GREATEST(current_station, $2),
            completed_stations = (
              SELECT jsonb_agg(DISTINCT elem)
              FROM jsonb_array_elements(completed_stations || $3::jsonb) elem
            ),
            is_escaped = CASE WHEN $4 = 4 THEN TRUE ELSE is_escaped END,
            last_active_at = $5
          WHERE UPPER(prn) = $1;
        `,
          [prn, nextRound, JSON.stringify([stationNum]), stationNum, now]
        );

        if (stationNum === 4) {
          await pool.query("UPDATE attendance SET status = 'ESCAPED' WHERE UPPER(prn) = $1", [prn]);
        }

        // Add to qualified list in game_state if station < 4
        if (stationNum < 4) {
          const stateRes = await pool.query("SELECT state FROM game_state WHERE key = 'GLOBAL_ROUND_STATE'");
          if (stateRes.rows[0]) {
            const state = stateRes.rows[0].state;
            const qKey = "qualifiedRound" + nextRound;
            state[qKey] = Array.isArray(state[qKey]) ? state[qKey] : [];
            if (!state[qKey].includes(prn)) {
              state[qKey].push(prn);
              await pool.query("UPDATE game_state SET state = $1, updated_at = NOW() WHERE key = 'GLOBAL_ROUND_STATE'", [
                JSON.stringify(state)
              ]);
            }
          }
        }
      } else {
        // Sudden death elimination
        await pool.query(
          `
          UPDATE students
          SET is_eliminated = TRUE, eliminated_reason = $2, eliminated_station = $3, last_active_at = $4
          WHERE UPPER(prn) = $1;
        `,
          [prn, sub.failedQuestion || "Forensic Verification Failed", stationNum, now]
        );

        await pool.query("UPDATE attendance SET status = 'ELIMINATED' WHERE UPPER(prn) = $1", [prn]);
      }

      return sendJson(res, 200, { success: true, id });
    }

    // -------------------------------------------------------------
    // POST /api/attendance: Manual Check-In, Status Toggle, or Clear
    // -------------------------------------------------------------
    if (pathname === "/api/attendance" && method === "POST") {
      const body = await parseJsonBody(req);
      const action = body.action || "checkin";

      if (action === "clear") {
        await pool.query("DELETE FROM attendance;");
        return sendJson(res, 200, { success: true, message: "Attendance cleared." });
      }

      if (action === "toggle") {
        const prn = (body.prn || "").trim().toUpperCase();
        const status = body.status || "PRESENT";
        await pool.query("UPDATE attendance SET status = $1 WHERE UPPER(prn) = $2", [status, prn]);
        return sendJson(res, 200, { success: true });
      }

      // Check-in
      const prn = (body.prn || "").trim().toUpperCase();
      const name = (body.name || "").trim();
      if (!prn || !name) return sendJson(res, 400, { error: "Missing PRN or Name" });

      const now = Date.now();
      await pool.query(
        `
        INSERT INTO attendance (id, prn, name, code_profile, status, timestamp, time_str)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          status = EXCLUDED.status;
      `,
        [
          "att_" + prn,
          prn,
          name,
          body.codeProfile || null,
          body.status || "PRESENT",
          now,
          new Date(now).toLocaleTimeString()
        ]
      );

      // Also ensure student registered in students table
      await pool.query(
        `
        INSERT INTO students (prn, name, code_profile, last_active_at)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (prn) DO UPDATE SET name = EXCLUDED.name, last_active_at = EXCLUDED.last_active_at;
      `,
        [prn, name, body.codeProfile || null, now]
      );

      return sendJson(res, 200, { success: true });
    }

    // -------------------------------------------------------------
    // POST /api/rounds: Master Round Controller & Qualification
    // -------------------------------------------------------------
    if (pathname === "/api/rounds" && method === "POST") {
      const body = await parseJsonBody(req);
      const action = body.action; // 'status' | 'qualify' | 'revoke'

      const stateRes = await pool.query("SELECT state FROM game_state WHERE key = 'GLOBAL_ROUND_STATE'");
      const state = stateRes.rows[0]?.state || {};

      if (action === "status") {
        const roundNum = body.roundNum;
        const newStatus = body.status; // 'RUNNING' | 'STOPPED' | 'LOCKED'
        if (!state["round" + roundNum]) state["round" + roundNum] = {};
        state["round" + roundNum].status = newStatus;
      } else if (action === "qualify") {
        const roundNum = body.roundNum;
        const key = "qualifiedRound" + roundNum;
        const incomingPrns = (body.prnArray || []).map(p => String(p).trim().toUpperCase()).filter(Boolean);
        const existing = Array.isArray(state[key]) ? state[key] : [];
        const merged = body.replace ? Array.from(new Set(incomingPrns)) : Array.from(new Set([...existing, ...incomingPrns]));
        state[key] = merged;
        if (!state["round" + roundNum]) state["round" + roundNum] = {};
        state["round" + roundNum].status = "RUNNING";

        // Update student records
        if (incomingPrns.length > 0) {
          await pool.query(
            `
            UPDATE students
            SET current_station = GREATEST(current_station, $1)
            WHERE UPPER(prn) = ANY($2::text[]);
          `,
            [roundNum, incomingPrns]
          );
        }
      } else if (action === "revoke") {
        const roundNum = body.roundNum;
        const key = "qualifiedRound" + roundNum;
        const prn = (body.prn || "").trim().toUpperCase();
        if (Array.isArray(state[key])) {
          state[key] = state[key].filter(p => String(p).trim().toUpperCase() !== prn);
        }
      }

      await pool.query("UPDATE game_state SET state = $1, updated_at = NOW() WHERE key = 'GLOBAL_ROUND_STATE'", [
        JSON.stringify(state)
      ]);

      return sendJson(res, 200, { success: true, roundState: state });
    }

    // -------------------------------------------------------------
    // POST /api/admin/seed: Seed Demo Data into Neon PostgreSQL
    // -------------------------------------------------------------
    if (pathname === "/api/admin/seed" && method === "POST") {
      const now = Date.now();
      const demoStudents = [
        { name: "Pooja Reddy", prn: "2024010666", profile: "CASE-DCBA", station: 4, escaped: true, time1: 35, time2: 48, time3: 59, time4: 78, infractions: 0 },
        { name: "Diya Patel", prn: "2024010222", profile: "CASE-BBBB", station: 3, escaped: false, time1: 38, time2: 62, infractions: 1 },
        { name: "Aarav Sharma", prn: "2024010111", profile: "CASE-AAAA", station: 4, escaped: true, time1: 42, time2: 55, time3: 68, time4: 85, infractions: 0 },
        { name: "Rohan Verma", prn: "2024010333", profile: "CASE-CCCC", station: 2, escaped: false, time1: 52, infractions: 0 },
        { name: "Vikram Malhotra", prn: "2024010555", profile: "CASE-ABCD", station: 2, escaped: false, eliminated: true, reason: "ANTI-CHEAT: Tab switch limit exceeded (2/2)", time1: 65, infractions: 2 },
        { name: "Kunal Ghosh", prn: "2024010777", profile: "CASE-BADC", station: 3, escaped: false, time1: 71, time2: 80, infractions: 0 },
        { name: "Sneha Kulkarni", prn: "2024010888", profile: "CASE-CDAB", station: 1, escaped: false, time1: 89, infractions: 0 },
        { name: "Ananya Iyer", prn: "2024010444", profile: "CASE-DDDD", station: 1, escaped: false, eliminated: true, reason: "Incorrect submission at Q2: BioCloud Scope", time1: 45, infractions: 0 }
      ];

      // Clear existing
      await pool.query("DELETE FROM submissions; DELETE FROM attendance; DELETE FROM students;");

      for (let s of demoStudents) {
        const completed = s.escaped ? [1, 2, 3, 4] : s.station > 1 ? Array.from({ length: s.station - 1 }, (_, i) => i + 1) : [];
        await pool.query(
          `
          INSERT INTO students (
            prn, name, agent_id, code_profile, assigned_sets, current_station,
            completed_stations, is_eliminated, eliminated_reason, is_escaped,
            remaining_seconds, penalty_seconds, tab_infractions, started_at, last_active_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);
        `,
          [
            s.prn,
            s.name,
            "AG-" + s.prn.slice(-4),
            s.profile,
            JSON.stringify({ 1: s.profile[5], 2: s.profile[6], 3: s.profile[7], 4: s.profile[8] }),
            s.station,
            JSON.stringify(completed),
            Boolean(s.eliminated),
            s.reason || null,
            Boolean(s.escaped),
            25 * 60 - ((s.time1 || 0) + (s.time2 || 0) + (s.time3 || 0) + (s.time4 || 0)),
            (s.infractions || 0) * 60,
            s.infractions || 0,
            now - 1500000,
            now
          ]
        );

        // Attendance
        await pool.query(
          `
          INSERT INTO attendance (id, prn, name, code_profile, status, timestamp, time_str)
          VALUES ($1, $2, $3, $4, $5, $6, $7);
        `,
          [
            "att_" + s.prn,
            s.prn,
            s.name,
            s.profile,
            s.escaped ? "ESCAPED" : s.eliminated ? "ELIMINATED" : "PRESENT",
            now - 1500000,
            new Date(now - 1500000).toLocaleTimeString()
          ]
        );

        // Submissions
        if (s.time1) {
          await pool.query(
            `
            INSERT INTO submissions (id, prn, student_name, code_profile, station_num, case_letter, elapsed_seconds, elapsed_formatted, is_correct, status, failed_question, timestamp)
            VALUES ($1, $2, $3, $4, 1, $5, $6, $7, $8, $9, $10, $11);
          `,
            [
              "sub_demo_1_" + s.prn,
              s.prn,
              s.name,
              s.profile,
              s.profile[5] || "A",
              s.time1,
              `00:${s.time1 < 10 ? "0" : ""}${s.time1}`,
              !s.eliminated || s.station > 1,
              (!s.eliminated || s.station > 1) ? "QUALIFIED FOR ROUND 2" : "ELIMINATED",
              (s.eliminated && s.station === 1) ? s.reason : null,
              now - 1200000
            ]
          );
        }

        if (s.time2 && s.station >= 2) {
          await pool.query(
            `
            INSERT INTO submissions (id, prn, student_name, code_profile, station_num, case_letter, elapsed_seconds, elapsed_formatted, is_correct, status, failed_question, timestamp)
            VALUES ($1, $2, $3, $4, 2, $5, $6, $7, $8, $9, $10, $11);
          `,
            [
              "sub_demo_2_" + s.prn,
              s.prn,
              s.name,
              s.profile,
              s.profile[6] || "A",
              s.time2,
              `00:${s.time2 < 10 ? "0" : ""}${s.time2}`,
              !s.eliminated || s.station > 2,
              (!s.eliminated || s.station > 2) ? "QUALIFIED FOR ROUND 3" : "ELIMINATED",
              (s.eliminated && s.station === 2) ? s.reason : null,
              now - 800000
            ]
          );
        }

        if (s.time3 && s.station >= 3) {
          await pool.query(
            `
            INSERT INTO submissions (id, prn, student_name, code_profile, station_num, case_letter, elapsed_seconds, elapsed_formatted, is_correct, status, failed_question, timestamp)
            VALUES ($1, $2, $3, $4, 3, $5, $6, $7, $8, $9, $10, $11);
          `,
            [
              "sub_demo_3_" + s.prn,
              s.prn,
              s.name,
              s.profile,
              s.profile[7] || "A",
              s.time3,
              `00:${s.time3 < 10 ? "0" : ""}${s.time3}`,
              true,
              "QUALIFIED FOR ROUND 4",
              null,
              now - 400000
            ]
          );
        }

        if (s.time4 && s.station >= 4 && s.escaped) {
          const total = (s.time1 || 0) + (s.time2 || 0) + (s.time3 || 0) + (s.time4 || 0);
          await pool.query(
            `
            INSERT INTO submissions (id, prn, student_name, code_profile, station_num, case_letter, elapsed_seconds, elapsed_formatted, is_correct, status, failed_question, timestamp)
            VALUES ($1, $2, $3, $4, 4, $5, $6, $7, $8, $9, $10, $11);
          `,
            [
              "sub_demo_4_" + s.prn,
              s.prn,
              s.name,
              s.profile,
              s.profile[8] || "A",
              total,
              `${Math.floor(total / 60)}:${total % 60 < 10 ? "0" : ""}${total % 60}`,
              true,
              "CHAMPION / ESCAPED",
              null,
              now - 100000
            ]
          );
        }
      }

      const seedRoundState = {
        round1: { status: "RUNNING" },
        round2: { status: "RUNNING" },
        round3: { status: "RUNNING" },
        round4: { status: "RUNNING" },
        qualifiedRound2: ["2024010666", "2024010222", "2024010111", "2024010333", "2024010777"],
        qualifiedRound3: ["2024010666", "2024010222", "2024010111", "2024010777"],
        qualifiedRound4: ["2024010666", "2024010111"]
      };

      await pool.query("UPDATE game_state SET state = $1, updated_at = NOW() WHERE key = 'GLOBAL_ROUND_STATE'", [
        JSON.stringify(seedRoundState)
      ]);

      return sendJson(res, 200, { success: true, message: "Demo dataset seeded into Neon DB." });
    }

    // -------------------------------------------------------------
    // DELETE /api/reset: Reset Database Event Records
    // -------------------------------------------------------------
    if (pathname === "/api/reset" && method === "DELETE") {
      await pool.query("DELETE FROM submissions; DELETE FROM attendance; DELETE FROM students;");
      const defaultRoundState = {
        round1: { status: "RUNNING" },
        round2: { status: "LOCKED" },
        round3: { status: "LOCKED" },
        round4: { status: "LOCKED" },
        qualifiedRound2: [],
        qualifiedRound3: [],
        qualifiedRound4: []
      };
      await pool.query("UPDATE game_state SET state = $1, updated_at = NOW() WHERE key = 'GLOBAL_ROUND_STATE'", [
        JSON.stringify(defaultRoundState)
      ]);
      return sendJson(res, 200, { success: true, message: "All event records reset." });
    }

    // Route not found
    return sendJson(res, 404, { error: "Endpoint not found", path: pathname, method });
  } catch (err) {
    console.error("API error:", err);
    return sendJson(res, 500, { error: "Internal server error", details: err.message });
  }
};
