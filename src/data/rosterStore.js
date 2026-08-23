import { ROSTER } from './attendanceData';
import { safeLocal } from './safeStorage';

const KEY = 'bluvia-attendance-roster-overrides';

function readOverrides() {
  try {
    const raw = safeLocal.get(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeOverrides(overrides) {
  safeLocal.set(KEY, JSON.stringify(overrides));
}

// Roster with any admin edits (team/weekly-off/resigned changes) applied on top of the base sheet.
// `resigned` is left undefined here unless explicitly set — callers fall back
// to detecting a 'Resign' status in that month's data when it's untouched.
export function effectiveRoster() {
  const overrides = readOverrides();
  return ROSTER.map((s) => ({ ...s, ...overrides[s.name] }));
}

export function updateRosterEntry(name, patch) {
  const overrides = readOverrides();
  overrides[name] = { ...overrides[name], ...patch };
  writeOverrides(overrides);
}

export function resetRosterOverrides() {
  safeLocal.remove(KEY);
}
