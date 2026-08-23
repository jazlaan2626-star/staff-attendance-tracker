import { ROSTER } from './attendanceData';

const KEY = 'bluvia-attendance-roster-overrides';

function readOverrides() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeOverrides(overrides) {
  localStorage.setItem(KEY, JSON.stringify(overrides));
}

// Roster with any admin edits (team/weekly-off changes) applied on top of the base sheet.
export function effectiveRoster() {
  const overrides = readOverrides();
  return ROSTER.map((s) => (overrides[s.name] ? { ...s, ...overrides[s.name] } : s));
}

export function updateRosterEntry(name, patch) {
  const overrides = readOverrides();
  overrides[name] = { ...overrides[name], ...patch };
  writeOverrides(overrides);
}

export function resetRosterOverrides() {
  localStorage.removeItem(KEY);
}
