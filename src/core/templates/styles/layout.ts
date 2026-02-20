export function getLayoutStyles(): string {
  return `
/* ===== Sidebar ===== */
.sidebar {
  width: var(--sidebar-width);
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  position: fixed;
  top: 0; left: 0;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: transform var(--transition);
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h2 { font-size: 1.1rem; }
.sidebar-header h2 a { color: var(--color-text); }
.sidebar-header h2 a:hover { text-decoration: none; color: var(--color-primary); }

.sidebar-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0.25rem;
}

.sidebar-nav {
  list-style: none;
  padding: 0.5rem 0;
  flex: 1;
  overflow-y: auto;
}

.sidebar-nav li { border-bottom: 1px solid var(--color-border); }

.sidebar-nav a {
  display: block;
  padding: 0.75rem 1.5rem;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  transition: background var(--transition), color var(--transition);
}

.sidebar-nav a:hover { background: var(--color-bg); color: var(--color-text); text-decoration: none; }

.sidebar-nav a.active {
  color: var(--color-primary);
  background: #eef2ff;
  font-weight: 600;
  border-left: 3px solid var(--color-primary);
}

.sidebar-nav li.current-chapter {
  background: rgba(79, 70, 229, 0.08);
  border-radius: 8px;
}

.sidebar-progress {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border);
}

.sidebar-progress .progress-bar {
  height: 6px;
  background: var(--color-border);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.sidebar-progress .progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
  width: 0%;
  transition: width 0.5s ease;
}

.sidebar-progress .progress-text { font-size: 0.8rem; color: var(--color-text-muted); }

/* ===== Main Content ===== */
.content {
  margin-left: var(--sidebar-width);
  padding: 2rem 3rem;
  max-width: calc(var(--sidebar-width) + 900px);
}

/* ===== Mobile Menu Button ===== */
.mobile-menu-btn {
  display: none;
  position: fixed;
  top: 1rem; left: 1rem;
  z-index: 200;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  font-size: 1.2rem;
  box-shadow: var(--shadow);
}
`;
}
