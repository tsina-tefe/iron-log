// Brzycki 1RM formula
export function calculate1RM(weightKg, reps) {
  if (reps === 1) return weightKg;
  return Math.round(weightKg * (36 / (37 - reps)));
}

// Total volume for a set array
export function calculateVolume(sets) {
  return sets.reduce((total, s) => {
    return total + (parseFloat(s.weightKg) || 0) * (parseInt(s.reps) || 0);
  }, 0);
}

// Group sessions by week label for SectionList
export function groupSessionsByWeek(sessions) {
  const now = new Date();
  const groups = {};

  for (const session of sessions) {
    const date = new Date(session.startedAt);
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let label;
    if (diffDays < 7) label = "THIS WEEK";
    else if (diffDays < 14) label = "LAST WEEK";
    else
      label = date
        .toLocaleDateString("en-US", { month: "long", year: "numeric" })
        .toUpperCase();

    if (!groups[label]) groups[label] = [];
    groups[label].push(session);
  }

  return Object.entries(groups).map(([title, data]) => ({ title, data }));
}

// Workout streak — consecutive days with at least one session
export function calculateStreak(sessions) {
  if (!sessions.length) return 0;

  const days = [
    ...new Set(sessions.map((s) => new Date(s.startedAt).toDateString())),
  ]
    .map((d) => new Date(d))
    .sort((a, b) => b - a);

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = (days[i - 1] - days[i]) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}
