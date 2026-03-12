import { NavLink, Outlet } from 'react-router-dom';

export function MainLayout() {
  return (
    <div>
      <header
        style={{
          padding: '1rem',
          borderBottom: '1px solid #ccc',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}
      >

        <nav style={{ display: 'flex', gap: '0.75rem' }}>
          <NavLink to="/">Quote Builder</NavLink>
        </nav>
      </header>

      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
