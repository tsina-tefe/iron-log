import { getDb } from "./client";

// Used by Progress screen — max weight per session for a given exercise
export async function getProgressForExercise(exerciseId) {
  const db = await getDb();
  return db.getAllAsync(
    `
    SELECT
      s.finishedAt                as date,
      MAX(st.weightKg)            as maxWeight,
      SUM(st.weightKg * st.reps)  as volume
    FROM sets st
    JOIN sessions s ON s.id = st.sessionId
    WHERE st.exerciseId = ?
      AND s.finishedAt IS NOT NULL
    GROUP BY s.id
    ORDER BY s.finishedAt ASC
  `,
    [exerciseId],
  );
}

// Used by Progress screen — all-time PR per exercise
export async function getAllPersonalRecords() {
  const db = await getDb();
  return db.getAllAsync(`
    SELECT
      st.exerciseId,
      st.exerciseName,
      MAX(st.weightKg) as bestWeight,
      s.finishedAt     as achievedAt
    FROM sets st
    JOIN sessions s ON s.id = st.sessionId
    GROUP BY st.exerciseId
    ORDER BY bestWeight DESC
  `);
}
