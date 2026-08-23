import { useState, useEffect, useCallback } from 'react';
import { MONTH_NAMES, STATUS_OPTIONS, generateMonthStatuses, baseStatusesFor, daysInMonth } from './attendanceData';
import { effectiveRoster, updateRosterEntry } from './rosterStore';
import { safeLocal, safeSession } from './safeStorage';

const ADMIN_KEY = 'bluvia-attendance-admin';
const ADMIN_PIN = '2626'; // simple local admin gate — no backend

// v2: bumped so browsers with a stale August-2026 save (from before the
// real attendance data was seeded in) pick up the fresh sheet data instead
// of an old plain auto-generated pattern shadowing it.
function storageKey(year, month) {
  return `bluvia-attendance-v2-${year}-${month}`;
}

function buildStaffForMonth(year, month) {
  return effectiveRoster().map((s) => ({ ...s, statuses: baseStatusesFor(s.name, s.weeklyOff, year, month) }));
}

// Legacy saves may contain statuses (e.g. the old 'OFF*') that no longer
// exist in STATUS_META — normalize anything unrecognized to plain OFF so
// a stale browser save can never crash the status-color lookup.
function normalizeStatus(v) {
  if (!v) return null;
  if (STATUS_OPTIONS.includes(v)) return v;
  return v.startsWith('OFF') ? 'OFF' : null;
}

// Merges saved edits onto a freshly generated month (so a shorter/longer
// previous month, or a roster change, never desyncs the array length).
function loadStaff(year, month) {
  const base = buildStaffForMonth(year, month);
  try {
    const raw = safeLocal.get(storageKey(year, month));
    if (raw) {
      const saved = JSON.parse(raw);
      const byName = Object.fromEntries(saved.map((s) => [s.name, s.statuses]));
      return base.map((s) => (byName[s.name]
        ? { ...s, statuses: byName[s.name].slice(0, s.statuses.length).map(normalizeStatus) }
        : s));
    }
  } catch { /* ignore */ }
  return base;
}

export function useAttendance() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
  const [staff, setStaff] = useState(() => loadStaff(year, month));
  const [isAdmin, setIsAdmin] = useState(() => safeSession.get(ADMIN_KEY) === '1');

  // Reload whenever the viewed month changes
  useEffect(() => { setStaff(loadStaff(year, month)); }, [year, month]);

  useEffect(() => {
    safeLocal.set(storageKey(year, month), JSON.stringify(staff));
  }, [staff, year, month]);

  const setStatus = useCallback((name, dayIndex, value) => {
    setStaff((prev) => prev.map((s) => {
      if (s.name !== name) return s;
      const statuses = [...s.statuses];
      statuses[dayIndex] = value || null;
      return { ...s, statuses };
    }));
  }, []);

  // Changes a staff member's team/category — persists globally (not per-month).
  const setTeam = useCallback((name, team) => {
    updateRosterEntry(name, { team });
    setStaff((prev) => prev.map((s) => (s.name === name ? { ...s, team } : s)));
  }, []);

  // Changes a staff member's weekly off day — persists globally and regenerates
  // their auto-OFF days for the month currently in view.
  const setWeeklyOff = useCallback((name, weeklyOff) => {
    updateRosterEntry(name, { weeklyOff });
    setStaff((prev) => prev.map((s) => (
      s.name === name ? { ...s, weeklyOff, statuses: generateMonthStatuses(weeklyOff, year, month) } : s
    )));
  }, [year, month]);

  const login = useCallback((pin) => {
    if (pin === ADMIN_PIN) {
      safeSession.set(ADMIN_KEY, '1');
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    safeSession.remove(ADMIN_KEY);
    setIsAdmin(false);
  }, []);

  const resetToSeed = useCallback(() => {
    safeLocal.remove(storageKey(year, month));
    setStaff(buildStaffForMonth(year, month));
  }, [year, month]);

  const goPrevMonth = useCallback(() => {
    setMonth((m) => { if (m === 1) { setYear((y) => y - 1); return 12; } return m - 1; });
  }, []);
  const goNextMonth = useCallback(() => {
    setMonth((m) => { if (m === 12) { setYear((y) => y + 1); return 1; } return m + 1; });
  }, []);
  const goToday = useCallback(() => { const n = new Date(); setYear(n.getFullYear()); setMonth(n.getMonth() + 1); }, []);

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;
  const todayIndex = isCurrentMonth ? now.getDate() - 1 : null;
  const monthLabel = `${MONTH_NAMES[month - 1]} ${year}`;
  const totalDays = daysInMonth(year, month);

  return {
    staff, setStatus, setTeam, setWeeklyOff, isAdmin, login, logout, resetToSeed, todayIndex,
    year, month, monthLabel, totalDays, isCurrentMonth,
    goPrevMonth, goNextMonth, goToday,
  };
}
