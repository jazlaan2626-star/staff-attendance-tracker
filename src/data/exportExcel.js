import * as XLSX from 'xlsx';
import { weekdayOf } from './attendanceData';

const DAY_ABBR = { Sunday: 'Sun', Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat' };

export function downloadAttendanceExcel(staff, monthLabel, totalDays, year, month) {
  const dayHeaders = Array.from({ length: totalDays }, (_, i) => `${i + 1} (${DAY_ABBR[weekdayOf(year, month, i + 1)]})`);
  const header = ['Staff Name', 'Team', 'Weekly Off Day', ...dayHeaders];

  const rows = staff.map((s) => [
    s.name,
    s.team,
    s.weeklyOff,
    ...Array.from({ length: totalDays }, (_, i) => s.statuses[i] || ''),
  ]);

  const sheet = XLSX.utils.aoa_to_sheet([[`Staff Off Day Tracker (${monthLabel})`], [], header, ...rows]);
  sheet['!cols'] = [{ wch: 14 }, { wch: 14 }, { wch: 14 }, ...dayHeaders.map(() => ({ wch: 8 }))];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, monthLabel.replace(/\s+/g, '_').slice(0, 31));
  XLSX.writeFile(workbook, `Attendance_${monthLabel.replace(/\s+/g, '_')}.xlsx`);
}
