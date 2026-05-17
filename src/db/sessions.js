import { getDb } from "./client";

export async function getAllSessions() {
  const db = await getDb();
  const sessions = await db.getAllAsync(
    "SELECT * FROM sessions ORDER BY startedAt DESC",
  );

  for (const s of sessions) {
    const stats = await db.getFirstAsync(
      `
      SELECT
        COUNT(*)              as totalSets,
        SUM(weightKg * reps)  as totalVolume
      FROM sets WHERE sessionId = ?
    `,
      [s.id],
    );
    s.totalSets = stats.totalSets ?? 0;
    s.totalVolume = stats.totalVolume ?? 0;
  }

  return sessions;
}

export async function getSessionWithSets(sessionId) {
  const db = await getDb();
  const session = await db.getFirstAsync(
    "SELECT * FROM sessions WHERE id = ?",
    [sessionId],
  );
  session.sets = await db.getAllAsync(
    "SELECT * FROM sets WHERE sessionId = ? ORDER BY exerciseId, setNumber",
    [sessionId],
  );
  return session;
}

export async function createSession(
  templateId,
  templateName,
  startedAt,
  finishedAt,
  durationSeconds,
  sets,
) {
  const db = await getDb();

  const result = await db.runAsync(
    `
    INSERT INTO sessions (templateId, templateName, startedAt, finishedAt, durationSeconds)
    VALUES (?, ?, ?, ?, ?)
  `,
    [templateId, templateName, startedAt, finishedAt, durationSeconds],
  );

  const sessionId = result.lastInsertRowId;

  for (const set of sets) {
    await db.runAsync(
      `
      INSERT INTO sets (sessionId, exerciseId, exerciseName, setNumber, weightKg, reps)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        sessionId,
        set.exerciseId,
        set.exerciseName,
        set.setNumber,
        set.weightKg,
        set.reps,
      ],
    );
  }

  return sessionId;
}
