import { useState, useEffect, useCallback, useMemo } from 'react';
import { SEED_STAFF, ATTENDANCE_MONTH } from './attendanceData';

const STORAGE_KEY = `bluvia-attendance-${ATTENDANCE_MONTH.year}-${ATTENDANCE_MONTH.month}`;
const ADMIN_KEY = 'bluvia-attendance-admin';
const ADMIN_PIN = '2626'; // simple local admin gate — no backend

function loadStaff() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return SEED_STAFF.map((s) => ({ ...s, statuses: [...s.statuses] }));
}

export function useAttendance() {
  const [staff, setStaff] = useState(loadStaff);
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem(ADMIN_KEY) === '1');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(staff));
  }, [staff]);

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
    setStaff(SEED_STAFF.map((s) => ({ ...s, statuses: [...s.statuses] })));
  }, []);

  const todayIndex = useMemo(() => {
    const now = new Date();
    if (now.getFullYear() === ATTENDANCE_MONTH.year && now.getMonth() + 1 === ATTENDANCE_MONTH.month) {
      return now.getDate() - 1;
    }
    return null;
  }, []);

  return { staff, setStatus, isAdmin, login, logout, resetToSeed, todayIndex };
}
