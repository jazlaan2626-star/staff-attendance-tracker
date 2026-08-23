import { useState, useEffect, useCallback } from 'react';
import { ROSTER, MONTH_NAMES, generateMonthStatuses, daysInMonth } from './attendanceData';

const ADMIN_KEY = 'bluvia-attendance-admin';
const ADMIN_PIN = '2626'; // simple local admin gate — no backend

function storageKey(year, month) {
  return `bluvia-attendance-${year}-${month}`;
}

function buildStaffForMonth(year, month) {
  return ROSTER.map((s) => ({ ...s, statuses: generateMonthStatuses(s.weeklyOff, year, month) }));
}

// Merges saved edits onto a freshly generated month (so a shorter/longer
// previous month, or a roster change, never desyncs the array length).
function loadStaff(year, month) {
  const base = buildStaffForMonth(year, month);
  try {
    const raw = localStorage.getItem(storageKey(year, month));
    if (raw) {
      const saved = JSON.parse(raw);
      const byName = Object.fromEntries(saved.map((s) => [s.name, s.statuses]));
      return base.map((s) => (byName[s.name] ? { ...s, statuses: byName[s.name].slice(0, s.statuses.length) } : s));
    }
  } catch { /* ignore */ }
  return base;
}

export function useAttendance() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
  const [staff, setStaff] = useState(() => loadStaff(year, month));
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem(ADMIN_KEY) === '1');

  // Reload whenever the viewed month changes
  useEffect(() => { setStaff(loadStaff(year, month)); }, [year, month]);

  useEffect(() => {
    localStorage.setItem(storageKey(year, month), JSON.stringify(staff));
  }, [staff, year, month]);

  const setStatus = useCallback((name, dayIndex, value) => {
    setStaff((prev) => prev.map((s) => {
      if (s.name !== name) return s;
      const statuses = [...s.statuses];
      statuses[dayIndex] = value || null;
      return { ...s, statuses };
    }));
  }, []);

  const login = useCallback((pin) => {
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem(ADMIN_KEY, '1');
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_KEY);
    setIsAdmin(false);
  }, []);

  const resetToSeed = useCallback(() => {
    localStorage.removeItem(storageKey(year, month));
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
    staff, setStatus, isAdmin, login, logout, resetToSeed, todayIndex,
    year, month, monthLabel, totalDays, isCurrentMonth,
    goPrevMonth, goNextMonth, goToday,
  };
}
