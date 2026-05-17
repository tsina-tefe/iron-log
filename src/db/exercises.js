import { getDb } from "./client";

export async function getAllExercises() {
  const db = await getDb();
  return db.getAllAsync("SELECT * FROM exercises ORDER BY muscleGroup, name");
}

export async function getExerciseById(id) {
  const db = await getDb();
  return db.getFirstAsync("SELECT * FROM exercises WHERE id = ?", [id]);
}

export async function createExercise(name, muscleGroup) {
  const db = await getDb();
  const result = await db.runAsync(
    "INSERT INTO exercises (name, muscleGroup) VALUES (?, ?)",
    [name, muscleGroup],
  );
  return result.lastInsertRowId;
}
