/**
 * BLACKOUT PROTOCOL: Neon PostgreSQL Database Connection & Auto-Schema Manager
 */

const { Pool } = require("pg");

const DEFAULT_CONN_STR =
  "postgresql://neondb_owner:npg_I4bahKjmElV3@ep-late-bonus-ads7g5y0-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

const connectionString = process.env.DATABASE_URL || DEFAULT_CONN_STR;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000
});

let initialized = false;

async function initDb() {
  if (initialized) return;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Students / Roster Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        prn VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        agent_id VARCHAR(64),
        code_profile VARCHAR(64),
        assigned_sets JSONB,
        current_station INT DEFAULT 1,
        completed_stations JSONB DEFAULT '[]'::jsonb,
        is_eliminated BOOLEAN DEFAULT FALSE,
        eliminated_reason TEXT,
        eliminated_station INT,
        is_escaped BOOLEAN DEFAULT FALSE,
        remaining_seconds INT DEFAULT 480,
        penalty_seconds INT DEFAULT 0,
        tab_infractions INT DEFAULT 0,
        started_at BIGINT,
        station_started_at BIGINT,
        last_active_at BIGINT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Submissions Log Table (Cascades on Student Deletion)
    await client.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(128) PRIMARY KEY,
        prn VARCHAR(64) REFERENCES students(prn) ON DELETE CASCADE,
        student_name VARCHAR(255),
        code_profile VARCHAR(64),
        station_num INT NOT NULL,
        case_letter VARCHAR(4) NOT NULL,
        elapsed_seconds INT DEFAULT 0,
        elapsed_formatted VARCHAR(32),
        is_correct BOOLEAN NOT NULL,
        status VARCHAR(128),
        failed_question TEXT,
        timestamp BIGINT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. Attendance Roster Table (Cascades on Student Deletion)
    await client.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id VARCHAR(128) PRIMARY KEY,
        prn VARCHAR(64) REFERENCES students(prn) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        code_profile VARCHAR(64),
        status VARCHAR(64) DEFAULT 'PRESENT',
        timestamp BIGINT NOT NULL,
        time_str VARCHAR(64),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 4. Global Game State (Rounds & Tournament Qualifiers)
    await client.query(`
      CREATE TABLE IF NOT EXISTS game_state (
        key VARCHAR(64) PRIMARY KEY,
        state JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Default Round State
    const defaultRoundState = JSON.stringify({
      round1: { status: "RUNNING" },
      round2: { status: "LOCKED" },
      round3: { status: "LOCKED" },
      round4: { status: "LOCKED" },
      qualifiedRound2: [],
      qualifiedRound3: [],
      qualifiedRound4: []
    });

    await client.query(
      `
      INSERT INTO game_state (key, state)
      VALUES ('GLOBAL_ROUND_STATE', $1::jsonb)
      ON CONFLICT (key) DO NOTHING;
    `,
      [defaultRoundState]
    );

    await client.query("COMMIT");
    initialized = true;
    console.log("Neon PostgreSQL tables initialized successfully.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Database initialization failed:", err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  initDb
};
