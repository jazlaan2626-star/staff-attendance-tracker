/* ── Attendance roster — sourced from OFF_DAY_TRACKER.xlsx ──
   Each staff member's weekly off day auto-generates their OFF days for
   whichever month is showing. Admin edits (sick leave, absent, etc.)
   are layered on top and persisted per month in localStorage. */

export const STATUS_OPTIONS = ['', 'OFF', 'OFF*', 'SL', 'AL', 'ABS', 'FRL', 'Resign'];

export const STATUS_META = {
  '':       { label: 'Working', color: '#3a3a3a', bg: 'transparent',            text: '#6b6b6b' },
  'OFF':    { label: 'Weekly Off',   color: '#ff6a00', bg: 'rgba(255,106,0,0.18)', text: '#ff8a2e' },
  'OFF*':   { label: 'Off (Swapped)',color: '#ff9a3c', bg: 'rgba(255,154,60,0.14)',text: '#ffb066' },
  'SL':     { label: 'Sick Leave',   color: '#facc15', bg: 'rgba(250,204,21,0.14)', text: '#facc15' },
  'AL':     { label: 'Annual Leave', color: '#38bdf8', bg: 'rgba(56,189,248,0.14)', text: '#38bdf8' },
  'ABS':    { label: 'Absent',       color: '#ef4444', bg: 'rgba(239,68,68,0.16)',  text: '#ef4444' },
  'FRL':    { label: 'Family Resp. Leave', color: '#a78bfa', bg: 'rgba(167,139,250,0.14)', text: '#a78bfa' },
  'Resign': { label: 'Resigned',     color: '#71717a', bg: 'rgba(113,113,122,0.18)', text: '#a1a1aa' },
};

// Roster: name, team, and weekly off day — leave days are generated from this each month.
export const ROSTER = [
  { name: 'Yanal', team: 'Champion', weeklyOff: 'Friday' },
  { name: 'Sadha', team: 'Champion', weeklyOff: 'Wednesday' },
  { name: 'Nafkha', team: 'Champion', weeklyOff: 'Saturday' },
  { name: 'Jawidh', team: 'Champion', weeklyOff: 'Sunday' },
  { name: 'Aus', team: 'Champion', weeklyOff: 'Monday' },
  { name: 'Manaaf', team: 'Champion', weeklyOff: 'Monday' },
  { name: 'Hafna', team: 'Champion', weeklyOff: 'Thursday' },
  { name: 'Rahba', team: 'Champion', weeklyOff: 'Wednesday' },
  { name: 'Lara', team: 'Champion', weeklyOff: 'Tuesday' },
  { name: 'Ihusha', team: 'Champion', weeklyOff: 'Saturday' },
  { name: 'Affan', team: 'Champion', weeklyOff: 'Sunday' },
  { name: 'Azmee', team: 'FDC Champ', weeklyOff: 'Sunday' },
  { name: 'Hayath', team: 'FDC Champ', weeklyOff: 'Sunday' },
  { name: 'Raya', team: 'FDC Champ', weeklyOff: 'Tuesday' },
  { name: 'Nazal', team: 'FDC Champ', weeklyOff: 'Sunday' },
  { name: 'Raaidh', team: 'FDC Champ', weeklyOff: 'Saturday' },
  { name: 'Maain', team: 'FDC Champ', weeklyOff: 'Saturday' },
  { name: 'Suma', team: 'FDC Champ', weeklyOff: 'Tuesday' },
  { name: 'Arusham', team: 'FDC Champ', weeklyOff: 'Thursday' },
  { name: 'Yoosuf', team: 'FDC Champ', weeklyOff: 'Thursday' },
  { name: 'Naushan', team: 'FDC Champ', weeklyOff: 'Wednesday' },
  { name: 'Muaz', team: 'Distribution', weeklyOff: 'Friday' },
  { name: 'Aleem', team: 'Distribution', weeklyOff: 'Saturday' },
  { name: 'Rismee', team: 'Back Office', weeklyOff: 'Friday' },
];

export const TEAMS = ['Champion', 'FDC Champ', 'Distribution', 'Back Office'];

export const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const WEEKDAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export function daysInMonth(year, month /* 1-12 */) {
  return new Date(year, month, 0).getDate();
}

export function weekdayOf(year, month, day) {
  return WEEKDAY_NAMES[new Date(year, month - 1, day).getDay()];
}

// Builds a fresh statuses[] for the given month: 'OFF' on each staff member's
// weekly off day, blank otherwise — admin edits then layer on top per-day.
export function generateMonthStatuses(weeklyOff, year, month) {
  const total = daysInMonth(year, month);
  return Array.from({ length: total }, (_, i) => (weekdayOf(year, month, i + 1) === weeklyOff ? 'OFF' : null));
}
