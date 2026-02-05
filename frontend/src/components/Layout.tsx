import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import './layout.css';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <Link to="/">Kubera</Link>
        </div>
        <div className="spacer" />
        <div className="user">
          {user ? (
            <>
              <span className="muted">{user.email}</span>
              <button className="btn" onClick={() => logout()}>
                Logout
              </button>
            </>
          ) : (
            <span className="muted">Not logged in</span>
          )}
        </div>
      </header>

      <div className="shell">
        <aside className="sidebar">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/budget">Budget</NavLink>
          <NavLink to="/operations">Operations</NavLink>
          <NavLink to="/proposals">Proposals</NavLink>
          <NavLink to="/timeline">Timeline</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </aside>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
