import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', background: '#000', color: '#fff', padding: 24, textAlign: 'center',
          fontFamily: 'Inter, -apple-system, sans-serif',
        }}>
          <p style={{ color: '#ff6a00', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Something went wrong</p>
          <p style={{ color: '#8a8a8a', fontSize: 13, marginBottom: 16, maxWidth: 420 }}>
            The page hit an unexpected error. Reloading usually fixes it — if this browser blocks
            local storage (private/incognito mode), try a normal browser window.
          </p>
          {this.state.error?.message && (
            <pre style={{
              color: '#ff8a2e', fontSize: 11, background: 'rgba(255,106,0,0.06)', border: '1px solid rgba(255,106,0,0.2)',
              borderRadius: 8, padding: '10px 14px', marginBottom: 16, maxWidth: 520, whiteSpace: 'pre-wrap',
              textAlign: 'left', fontFamily: 'JetBrains Mono, monospace',
            }}>
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid rgba(255,106,0,0.4)', background: 'rgba(255,106,0,0.1)', color: '#ff6a00', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
