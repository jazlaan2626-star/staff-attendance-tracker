import { useState, useMemo } from 'react';
import { Lock, Unlock, RotateCcw, ShieldCheck, ChevronLeft, ChevronRight, Download, Search } from 'lucide-react';
import { useAttendance } from './data/useAttendance';
import { STATUS_OPTIONS, STATUS_META, TEAMS, weekdayOf } from './data/attendanceData';
import { downloadAttendanceExcel } from './data/exportExcel';

const ORANGE = '#ff6a00';
const DAY_ABBR = { Sunday: 'Sun', Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat' };

function Legend() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
      {STATUS_OPTIONS.filter(Boolean).map((k) => {
        const m = STATUS_META[k];
        return (
          <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#a3a3a3', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 7, padding: '4px 9px' }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: m.color }} />{m.label}
          </span>
        );
      })}
    </div>
  );
}

function AdminGate({ login }) {
  const [pin, setPin] = useState('');
  const [err, setErr] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!login(pin)) { setErr(true); setTimeout(() => setErr(false), 900); }
    setPin('');
  };
  return (
    <form onSubmit={submit} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <input
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="Admin PIN"
        style={{
          width: 110, padding: '7px 10px', borderRadius: 8, fontSize: 12,
          background: '#0a0a0a', color: '#fff',
          border: `1px solid ${err ? '#ef4444' : 'rgba(255,106,0,0.3)'}`,
          outline: 'none', fontFamily: 'Inter, sans-serif',
        }}
      />
      <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: '1px solid rgba(255,106,0,0.4)', background: 'rgba(255,106,0,0.1)', color: ORANGE, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
        <Lock size={13} /> Unlock
      </button>
    </form>
  );
}

function StatusCell({ value, isAdmin, isToday, isWeeklyOff, onChange }) {
  const meta = STATUS_META[value || ''];
  const [open, setOpen] = useState(false);

  const base = {
    width: 30, height: 26, borderRadius: 6, fontSize: 10, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: meta.text, background: meta.bg,
    border: `1px solid ${isToday ? ORANGE : (value ? meta.color + '55' : (isWeeklyOff ? 'rgba(255,106,0,0.25)' : 'rgba(255,255,255,0.06)'))}`,
    cursor: isAdmin ? 'pointer' : 'default', position: 'relative', flexShrink: 0,
  };

  if (!isAdmin) {
    return <div style={base} title={meta.label}>{value || ''}</div>;
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={base} onClick={() => setOpen((o) => !o)} title="Click to edit">
        {value || ''}
      </div>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: 30, left: 0, zIndex: 41, background: '#0a0a0a',
            border: '1px solid rgba(255,106,0,0.3)', borderRadius: 8, padding: 4,
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 148,
            boxShadow: '0 12px 28px rgba(0,0,0,0.6)',
          }}>
            {STATUS_OPTIONS.map((opt) => {
              const m = STATUS_META[opt];
              return (
                <button key={opt || 'none'} onClick={() => { onChange(opt); setOpen(false); }}
                  style={{
                    fontSize: 10, fontWeight: 600, padding: '5px 4px', borderRadius: 5, cursor: 'pointer',
                    border: `1px solid ${(opt === (value || '')) ? ORANGE : 'rgba(255,255,255,0.08)'}`,
                    background: m.bg || 'rgba(255,255,255,0.03)', color: m.text,
                  }}>
                  {opt === '' ? 'Working' : opt}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function TeamCell({ name, team, isAdmin, onChange }) {
  if (!isAdmin) return <div style={{ color: '#666', fontSize: 9, fontWeight: 400 }}>{team}</div>;

  return (
    <select
      value={team}
      onChange={(e) => onChange(name, e.target.value)}
      title="Change team"
      style={{
        marginTop: 2, fontSize: 9, fontWeight: 600, color: ORANGE, cursor: 'pointer',
        background: '#0a0a0a', border: '1px solid rgba(255,106,0,0.35)', borderRadius: 5,
        padding: '2px 4px', outline: 'none', maxWidth: 110,
      }}
    >
      {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
    </select>
  );
}

export default function AttendanceBoard() {
  const {
    staff, setStatus, setTeam, isAdmin, login, logout, resetToSeed, todayIndex,
    year, month, monthLabel, totalDays, isCurrentMonth,
    goPrevMonth, goNextMonth, goToday,
  } = useAttendance();
  const [teamFilter, setTeamFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const byTeam = teamFilter === 'All' ? staff : staff.filter((s) => s.team === teamFilter);
    const q = search.trim().toLowerCase();
    return q ? byTeam.filter((s) => s.name.toLowerCase().includes(q)) : byTeam;
  }, [staff, teamFilter, search]);

  const offToday = useMemo(() => {
    if (todayIndex == null) return [];
    return staff.filter((s) => s.statuses[todayIndex] === 'OFF').map((s) => s.name);
  }, [staff, todayIndex]);

  const summary = useMemo(() => {
    const counts = { OFF: 0, SL: 0, AL: 0, ABS: 0, FRL: 0, Resign: 0 };
    staff.forEach((s) => s.statuses.forEach((v) => {
      if (!v || counts[v] === undefined) return;
      counts[v] += 1;
    }));
    return counts;
  }, [staff]);

  return (
    <section id="attendance" className="section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ color: ORANGE, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Staff Attendance</p>
          <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0 }}>Off-Day Tracker</h2>
        </div>
        {isAdmin ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '6px 10px' }}>
              <ShieldCheck size={13} /> Admin mode
            </span>
            <button onClick={resetToSeed} title="Reset this month to auto-generated off days" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#a3a3a3', fontSize: 12, cursor: 'pointer' }}>
              <RotateCcw size={13} /> Reset
            </button>
            <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#a3a3a3', fontSize: 12, cursor: 'pointer' }}>
              <Unlock size={13} /> Lock
            </button>
          </div>
        ) : (
          <AdminGate login={login} />
        )}
      </div>

      {/* Month navigator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={goPrevMonth} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(255,106,0,0.25)', background: 'rgba(255,255,255,0.03)', color: ORANGE, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={15} />
        </button>
        <span className="grad-text" style={{ fontSize: 16, fontWeight: 800, minWidth: 150, textAlign: 'center' }}>{monthLabel}</span>
        <button onClick={goNextMonth} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(255,106,0,0.25)', background: 'rgba(255,255,255,0.03)', color: ORANGE, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronRight size={15} />
        </button>
        {!isCurrentMonth && (
          <button onClick={goToday} style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#a3a3a3', fontSize: 12, cursor: 'pointer' }}>
            Today
          </button>
        )}
        <button
          onClick={() => downloadAttendanceExcel(staff, monthLabel, totalDays, year, month)}
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,106,0,0.4)', background: 'rgba(255,106,0,0.1)', color: ORANGE, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
        >
          <Download size={13} /> Download Excel
        </button>
      </div>

      {offToday.length > 0 && (
        <div className="card" style={{ padding: '14px 18px', marginBottom: 20, borderColor: 'rgba(255,106,0,0.3)' }}>
          <p style={{ color: ORANGE, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Off today</p>
          <p style={{ color: '#e5e5e5', fontSize: 13 }}>{offToday.join(', ')}</p>
        </div>
      )}

      <div className="section-grid-4" style={{ marginBottom: 20 }}>
        {Object.entries(summary).map(([k, v]) => (
          <div key={k} className="card" style={{ textAlign: 'center', padding: 16 }}>
            <p style={{ fontSize: 22, fontWeight: 800, margin: 0, color: STATUS_META[k]?.color || ORANGE }}>{v}</p>
            <p style={{ color: '#888', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '6px 0 0' }}>{STATUS_META[k]?.label || k}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <Legend />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} color="#666" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search staff…"
                style={{
                  padding: '6px 10px 6px 28px', borderRadius: 8, fontSize: 12, width: 150,
                  background: 'rgba(255,255,255,0.03)', color: '#fff',
                  border: '1px solid rgba(255,255,255,0.08)', outline: 'none', fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.03)', padding: 4, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
              {['All', ...TEAMS].map((t) => (
                <button key={t} onClick={() => setTeamFilter(t)} style={{
                  padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none',
                  background: teamFilter === t ? ORANGE : 'transparent', color: teamFilter === t ? '#0a0a0a' : '#a3a3a3',
                }}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'separate', borderSpacing: '3px', fontSize: 11 }}>
            <thead>
              <tr>
                <th style={{ position: 'sticky', left: 0, background: '#0a0a0a', color: '#fff', textAlign: 'left', padding: '6px 10px', minWidth: 110, zIndex: 2 }}>Staff</th>
                <th style={{ color: '#888', minWidth: 70, fontWeight: 600 }}>Weekly Off</th>
                {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
                  <th key={d} style={{ color: '#666', fontWeight: 700, minWidth: 30 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {d}
                      <span style={{ fontSize: 8, color: '#555', fontWeight: 400 }}>{DAY_ABBR[weekdayOf(year, month, d)]}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.name}>
                  <td style={{ position: 'sticky', left: 0, background: '#0a0a0a', color: '#e5e5e5', fontWeight: 600, padding: '6px 10px', zIndex: 1 }}>
                    {s.name}
                    <TeamCell name={s.name} team={s.team} isAdmin={isAdmin} onChange={setTeam} />
                  </td>
                  <td style={{ textAlign: 'center', color: '#888', fontSize: 10 }}>{s.weeklyOff}</td>
                  {Array.from({ length: totalDays }, (_, i) => i).map((i) => (
                    <td key={i} style={{ textAlign: 'center' }}>
                      <StatusCell
                        value={s.statuses[i]}
                        isAdmin={isAdmin}
                        isToday={i === todayIndex}
                        isWeeklyOff={weekdayOf(year, month, i + 1) === s.weeklyOff}
                        onChange={(v) => setStatus(s.name, i, v)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isAdmin && (
          <p style={{ color: '#666', fontSize: 11, marginTop: 14 }}>Unlock admin mode with the PIN to edit attendance for any staff member and day.</p>
        )}
      </div>
    </section>
  );
}
