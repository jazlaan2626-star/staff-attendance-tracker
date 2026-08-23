import AttendanceBoard from './AttendanceBoard';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
      <div className="blob blob-1" /><div className="blob blob-2" />

      <header style={{
        padding: '20px 36px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1,
      }}>
        <div>
          <p className="grad-text" style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.04em', margin: 0 }}>STAFF ATTENDANCE TRACKER</p>
          <p style={{ color: 'var(--t2)', fontSize: 11, margin: 0 }}>Off day & leave management</p>
        </div>
      </header>

      <main className="main-scroll" style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 36px', position: 'relative', zIndex: 1 }}>
        <AttendanceBoard />
        <p style={{ textAlign: 'center', color: 'rgba(255,106,0,0.35)', fontSize: 11, paddingBottom: 24 }}>
          Developed with <span style={{ color: '#ff6a00' }}>&hearts;</span> by Jazlan Khalid
        </p>
      </main>
    </div>
  );
}
