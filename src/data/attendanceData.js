/* ── Attendance seed data — sourced from OFF_DAY_TRACKER.xlsx (August 2026) ──
   Admin edits are persisted to localStorage on top of this seed. */

export const ATTENDANCE_MONTH = { year: 2026, month: 8, label: 'August 2026' };

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

// statuses[i] = status for day (i+1) of the month, '' or null = working day
export const SEED_STAFF = [
  { name: 'Yanal', team: 'Champion', weeklyOff: 'Friday', offDayNum: 5, statuses: [null,null,null,null,null,null,'OFF','SL',null,null,null,null,'SL','OFF','ABS','ABS','FRL',null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null] },
  { name: 'Sadha', team: 'Champion', weeklyOff: 'Wednesday', offDayNum: 3, statuses: [null,null,null,null,null,'OFF*','SL',null,null,null,null,null,'OFF*',null,'SL','ABS',null,null,null,'OFF*',null,null,null,null,null,'OFF',null,null,null,null,null] },
  { name: 'Nafkha', team: 'Champion', weeklyOff: 'Saturday', offDayNum: 6, statuses: ['OFF',null,null,null,null,null,null,null,'OFF*',null,'SL',null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null] },
  { name: 'Jawidh', team: 'Champion', weeklyOff: 'Sunday', offDayNum: 7, statuses: [null,'OFF',null,null,null,null,null,null,'OFF',null,'SL',null,null,null,null,'OFF',null,null,null,null,null,null,null,'OFF*',null,null,null,null,null,'OFF',null] },
  { name: 'Aus', team: 'Champion', weeklyOff: 'Monday', offDayNum: 1, statuses: [null,null,'OFF',null,'AL','AL','AL','AL','AL','AL','AL','AL','AL','AL','AL','AL',null,'OFF*',null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF'] },
  { name: 'Manaaf', team: 'Champion', weeklyOff: 'Monday', offDayNum: 1, statuses: [null,null,'OFF',null,null,null,null,null,null,null,'OFF*',null,'ABS','ABS','ABS','ABS','OFF','ABS',null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF'] },
  { name: 'Hafna', team: 'Champion', weeklyOff: 'Thursday', offDayNum: 4, statuses: [null,null,null,null,null,'OFF','SL',null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null,null,null,'OFF*',null,null,null] },
  { name: 'Rahba', team: 'Champion', weeklyOff: 'Wednesday', offDayNum: 3, statuses: [null,null,null,null,null,'OFF*',null,null,'SL','SL','SL',null,'OFF*',null,null,null,null,null,null,'OFF*',null,null,null,null,null,'OFF',null,null,null,null,null] },
  { name: 'Lara', team: 'Champion', weeklyOff: 'Tuesday', offDayNum: 2, statuses: [null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null,null] },
  { name: 'Ihusha', team: 'Champion', weeklyOff: 'Saturday', offDayNum: 6, statuses: ['OFF',null,null,null,null,null,null,'OFF',null,'SL','SL',null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null] },
  { name: 'Affan', team: 'Champion', weeklyOff: 'Sunday', offDayNum: 7, statuses: [null,'OFF',null,null,null,null,null,'SL','OFF',null,null,null,null,null,null,'OFF',null,'SL',null,null,null,null,null,'OFF*',null,null,null,null,null,'OFF',null] },
  { name: 'Azmee', team: 'FDC Champ', weeklyOff: 'Sunday', offDayNum: 7, statuses: [null,'OFF',null,null,null,null,null,null,'OFF','SL','SL','Resign',null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null] },
  { name: 'Hayath', team: 'FDC Champ', weeklyOff: 'Sunday', offDayNum: 7, statuses: [null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null,'SL','OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null] },
  { name: 'Raya', team: 'FDC Champ', weeklyOff: 'Tuesday', offDayNum: 2, statuses: [null,null,null,'OFF',null,null,null,null,null,'ABS','OFF','ABS','ABS','Resign',null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null,null] },
  { name: 'Nazal', team: 'FDC Champ', weeklyOff: 'Sunday', offDayNum: 7, statuses: [null,'OFF',null,null,null,null,null,null,'OFF','SL',null,null,'SL',null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null] },
  { name: 'Raaidh', team: 'FDC Champ', weeklyOff: 'Saturday', offDayNum: 6, statuses: ['OFF',null,null,null,null,null,null,null,'OFF*',null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null] },
  { name: 'Maain', team: 'FDC Champ', weeklyOff: 'Saturday', offDayNum: 6, statuses: ['OFF',null,null,null,null,null,null,null,'OFF*',null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null] },
  { name: 'Suma', team: 'FDC Champ', weeklyOff: 'Tuesday', offDayNum: 2, statuses: [null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,'FRL',null,'FRL','OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null,null] },
  { name: 'Arusham', team: 'FDC Champ', weeklyOff: 'Thursday', offDayNum: 4, statuses: [null,null,null,null,null,'OFF','SL',null,null,null,null,null,'OFF',null,null,null,'SL',null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null] },
  { name: 'Yoosuf', team: 'FDC Champ', weeklyOff: 'Thursday', offDayNum: 4, statuses: [null,null,null,null,null,'OFF','SL',null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null] },
  { name: 'Naushan', team: 'FDC Champ', weeklyOff: 'Wednesday', offDayNum: 3, statuses: [null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null] },
  { name: 'Muaz', team: 'Distribution', weeklyOff: 'Friday', offDayNum: 5, statuses: [null,null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null] },
  { name: 'Aleem', team: 'Distribution', weeklyOff: 'Saturday', offDayNum: 6, statuses: ['OFF',null,null,null,null,null,null,null,'OFF*',null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null] },
  { name: 'Rismee', team: 'Back Office', weeklyOff: 'Friday', offDayNum: null, statuses: [null,null,null,null,null,null,'OFF',null,null,null,null,'SL',null,'OFF',null,null,null,null,null,null,'OFF',null,null,null,null,null,null,'OFF',null,null,null] },
];

export const STORMING_DAYS = {
  5: 'Postpaid', 8: 'FBB', 10: 'Prepaid', 12: 'Postpaid', 17: 'FBB', 19: 'Postpaid', 23: 'Prepaid', 27: 'Postpaid',
};

export const TEAMS = ['Champion', 'FDC Champ', 'Distribution', 'Back Office'];

export const DAY_LABELS = ['Sat','Sun','Mon','Tue','Wed','Thu','Fri'];
// Aug 1 2026 is a Saturday
export function dayLabel(dayNum) {
  return DAY_LABELS[(dayNum - 1) % 7];
}
