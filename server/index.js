/**
 * CRRT Calculators API
 * SQLite schema mirrors frontend calculation records.
 * Port 3851 — intentionally distinct from Vite (5174).
 */
import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.CRRT_API_PORT || 3851);
const DATA_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "crrt.sqlite");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

// Schema matches frontend storage.js record shape
db.exec(`
  CREATE TABLE IF NOT EXISTS calculations (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    inputs TEXT NOT NULL,
    results TEXT NOT NULL,
    label TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

function rowToRecord(row) {
  return {
    id: row.id,
    type: row.type,
    inputs: JSON.parse(row.inputs),
    results: JSON.parse(row.results),
    label: row.label,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "crrt-calculators", version: "2.0.0", db: DB_PATH });
});

app.get("/api/calculations", (_req, res) => {
  const rows = db
    .prepare("SELECT * FROM calculations ORDER BY created_at DESC")
    .all();
  res.json(rows.map(rowToRecord));
});

app.post("/api/calculations", (req, res) => {
  const { id, type, inputs, results, label, created_at, updated_at } = req.body || {};
  if (!id || !type || !inputs || !results) {
    return res.status(400).json({ error: "id, type, inputs, results required" });
  }
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO calculations (id, type, inputs, results, label, created_at, updated_at)
     VALUES (@id, @type, @inputs, @results, @label, @created_at, @updated_at)
     ON CONFLICT(id) DO UPDATE SET
       type=excluded.type,
       inputs=excluded.inputs,
       results=excluded.results,
       label=excluded.label,
       updated_at=excluded.updated_at`
  ).run({
    id,
    type,
    inputs: JSON.stringify(inputs),
    results: JSON.stringify(results),
    label: label || "",
    created_at: created_at || now,
    updated_at: updated_at || now,
  });
  const row = db.prepare("SELECT * FROM calculations WHERE id = ?").get(id);
  res.status(201).json(rowToRecord(row));
});

app.delete("/api/calculations/:id", (req, res) => {
  db.prepare("DELETE FROM calculations WHERE id = ?").run(req.params.id);
  res.status(204).end();
});

app.delete("/api/calculations", (_req, res) => {
  db.prepare("DELETE FROM calculations").run();
  res.status(204).end();
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`CRRT API listening on https://127.0.0.1:${PORT} (http locally)`);
  console.log(`SQLite: ${DB_PATH}`);
});
