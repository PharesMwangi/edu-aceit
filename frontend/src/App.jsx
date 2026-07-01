import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import School from './pages/School';
import Timetable from './pages/Timetable';
import Reports from './pages/Reports';

const PAGES = {
  dashboard: Dashboard,
  students: Students,
  school: School,
  timetable: Timetable,
  reports: Reports,
};

export default function App() {
  const [active, setActive] = useState('dashboard');
  const ActivePage = PAGES[active];

  return (
    <div className="app-shell">
      <Sidebar active={active} onNavigate={setActive} />
      <main className="content">
        <ActivePage />
      </main>
    </div>
  );
}
