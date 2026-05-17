import * as SQLite from "expo-sqlite";

let db;

export async function getDb() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("ironlog.db");
    await db.execAsync("PRAGMA journal_mode = WAL;");
    await db.execAsync("PRAGMA foreign_keys = ON;");
  }
  return db;
}

export async function initDb() {
  const db = await getDb();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS exercises (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      muscleGroup TEXT NOT NULL,
      createdAt   TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS templates (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      name      TEXT NOT NULL,
      color     TEXT NOT NULL DEFAULT '#D0FD3E',
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS templateExercises (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      templateId INTEGER NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
      exerciseId INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
      sortOrder  INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      templateId      INTEGER REFERENCES templates(id) ON DELETE SET NULL,
      templateName    TEXT NOT NULL,
      startedAt       TEXT NOT NULL,
      finishedAt      TEXT,
      durationSeconds INTEGER
    );

    CREATE TABLE IF NOT EXISTS sets (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      sessionId   INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      exerciseId  INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
      exerciseName TEXT NOT NULL,
      setNumber   INTEGER NOT NULL,
      weightKg    REAL NOT NULL DEFAULT 0,
      reps        INTEGER NOT NULL DEFAULT 0,
      completedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  await seedDefaultExercises(db);
}

// Seed a default exercise library on first launch
async function seedDefaultExercises(db) {
  const existing = await db.getFirstAsync(
    "SELECT COUNT(*) as count FROM exercises",
  );
  if (existing.count > 0) return;

  const defaults = [
    // Chest
    { name: "Bench Press", muscleGroup: "Chest" },
    { name: "Incline Bench", muscleGroup: "Chest" },
    { name: "Cable Fly", muscleGroup: "Chest" },
    // Back
    { name: "Pull Up", muscleGroup: "Back" },
    { name: "Barbell Row", muscleGroup: "Back" },
    { name: "Lat Pulldown", muscleGroup: "Back" },
    // Shoulders
    { name: "Overhead Press", muscleGroup: "Shoulders" },
    { name: "Lateral Raise", muscleGroup: "Shoulders" },
    // Arms
    { name: "Barbell Curl", muscleGroup: "Biceps" },
    { name: "Tricep Pushdown", muscleGroup: "Triceps" },
    // Legs
    { name: "Squat", muscleGroup: "Legs" },
    { name: "Romanian Deadlift", muscleGroup: "Legs" },
    { name: "Leg Press", muscleGroup: "Legs" },
    { name: "Leg Curl", muscleGroup: "Legs" },
    // Core
    { name: "Deadlift", muscleGroup: "Core" },
    { name: "Plank", muscleGroup: "Core" },
  ];

  for (const ex of defaults) {
    await db.runAsync(
      "INSERT INTO exercises (name, muscleGroup) VALUES (?, ?)",
      [ex.name, ex.muscleGroup],
    );
  }
}
