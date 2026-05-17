import { create } from "zustand";

const useActiveSessionStore = create((set, get) => ({
  templateId: null,
  templateName: "",
  startedAt: null,
  elapsedSeconds: 0,

  exercises: [],

  restSecondsLeft: 0,

  startSession: (template) => {
    set({
      templateId: template.id,
      templateName: template.name,
      startedAt: new Date().toISOString(),
      elapsedSeconds: 0,
      exercises: template.exercises.map((ex) => ({
        exerciseId: ex.id,
        exerciseName: ex.name,
        sets: [{ setNumber: 1, weightKg: "", reps: "", completed: false }],
      })),
      restSecondsLeft: 0,
    });
  },

  tickElapsed: () =>
    set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 })),

  tickRest: () =>
    set((state) => ({
      restSecondsLeft: Math.max(0, state.restSecondsLeft - 1),
    })),

  skipRest: () => set({ restSecondsLeft: 0 }),

  addSet: (exerciseId) =>
    set((state) => ({
      exercises: state.exercises.map((ex) => {
        if (ex.exerciseId !== exerciseId) return ex;
        const next = ex.sets.length + 1;
        return {
          ...ex,
          sets: [
            ...ex.sets,
            { setNumber: next, weightKg: "", reps: "", completed: false },
          ],
        };
      }),
    })),

  updateSet: (exerciseId, setIndex, field, value) =>
    set((state) => ({
      exercises: state.exercises.map((ex) => {
        if (ex.exerciseId !== exerciseId) return ex;
        const updatedSets = ex.sets.map((s, i) =>
          i === setIndex ? { ...s, [field]: value } : s,
        );
        return { ...ex, sets: updatedSets };
      }),
    })),

  completeSet: (exerciseId, setIndex) =>
    set((state) => ({
      restSecondsLeft: 90,
      exercises: state.exercises.map((ex) => {
        if (ex.exerciseId !== exerciseId) return ex;
        const updatedSets = ex.sets.map((s, i) =>
          i === setIndex ? { ...s, completed: true } : s,
        );
        return { ...ex, sets: updatedSets };
      }),
    })),

  resetSession: () =>
    set({
      templateId: null,
      templateName: "",
      startedAt: null,
      elapsedSeconds: 0,
      exercises: [],
      restSecondsLeft: 0,
    }),

  getCompletedSets: () => {
    const { exercises } = get();
    return exercises.flatMap((ex) =>
      ex.sets
        .filter((s) => s.completed)
        .map((s) => ({
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          setNumber: s.setNumber,
          weightKg: parseFloat(s.weightKg) || 0,
          reps: parseInt(s.reps) || 0,
        })),
    );
  },
}));

export default useActiveSessionStore;
