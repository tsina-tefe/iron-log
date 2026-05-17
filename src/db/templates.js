import { getDb } from "./client";

export async function getAllTemplates() {
  const db = await getDb();
  const templates = await db.getAllAsync(
    "SELECT * FROM templates ORDER BY createdAt DESC",
  );

  // Attach exercise count to each template
  for (const t of templates) {
    const row = await db.getFirstAsync(
      "SELECT COUNT(*) as count FROM templateExercises WHERE templateId = ?",
      [t.id],
    );
    t.exerciseCount = row.count;
  }

  return templates;
}

export async function getTemplateWithExercises(templateId) {
  const db = await getDb();
  const template = await db.getFirstAsync(
    "SELECT * FROM templates WHERE id = ?",
    [templateId],
  );
  template.exercises = await db.getAllAsync(
    `
    SELECT e.*, te.sortOrder
    FROM exercises e
    JOIN templateExercises te ON te.exerciseId = e.id
    WHERE te.templateId = ?
    ORDER BY te.sortOrder
  `,
    [templateId],
  );
  return template;
}

export async function createTemplate(name, color, exerciseIds) {
  const db = await getDb();

  const result = await db.runAsync(
    "INSERT INTO templates (name, color) VALUES (?, ?)",
    [name, color],
  );
  const templateId = result.lastInsertRowId;

  for (let i = 0; i < exerciseIds.length; i++) {
    await db.runAsync(
      "INSERT INTO templateExercises (templateId, exerciseId, sortOrder) VALUES (?, ?, ?)",
      [templateId, exerciseIds[i], i],
    );
  }

  return templateId;
}

export async function deleteTemplate(templateId) {
  const db = await getDb();
  await db.runAsync("DELETE FROM templates WHERE id = ?", [templateId]);
}
