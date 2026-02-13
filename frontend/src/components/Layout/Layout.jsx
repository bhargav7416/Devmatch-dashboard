import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

function Layout({ children }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>DevMatch Dashboard</h1>
          <p>Smart Developer Assignment System</p>
        </div>
      </nav>

      <div className="layout-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul className="nav-menu">
            <li className={isActive('/') ? 'active' : ''}>
              <Link to="/">
                📊 Dashboard
              </Link>
            </li>
            <li className={isActive('/developers') ? 'active' : ''}>
              <Link to="/developers">
                👥 Developers
              </Link>
            </li>
            <li className={isActive('/projects') ? 'active' : ''}>
              <Link to="/projects">
                📁 Projects
              </Link>
            </li>
            <li className={isActive('/matching') ? 'active' : ''}>
              <Link to="/matching">
                🎯 Match & Assign
              </Link>
            </li>
            <li className={isActive('/assignments') ? 'active' : ''}>
              <Link to="/assignments">
                📋 Assignment History
              </Link>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
