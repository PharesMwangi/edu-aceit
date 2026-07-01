const LINKS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'students', label: 'Students' },
  { key: 'school', label: 'School' },
  { key: 'timetable', label: 'Timetable' },
  { key: 'reports', label: 'Reports' },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        Edu Ace<span>-It</span>
      </div>
      <div className="sidebar-label">Links</div>
      {LINKS.map((link) => (
        <button
          key={link.key}
          className={`sidebar-link ${active === link.key ? 'active' : ''}`}
          onClick={() => onNavigate(link.key)}
        >
          {link.label}
        </button>
      ))}
    </aside>
  );
}
