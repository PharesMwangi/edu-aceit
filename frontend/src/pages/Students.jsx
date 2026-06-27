// src/pages/Students.jsx
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import StatusMessage from '../components/StatusMessage';

const TABS = [
  { key: 'saved', label: 'Saved List' },
  { key: 'add', label: 'Edit List (Add New)' },
  { key: 'records', label: 'Records' },
];

export default function Students() {
  const [tab, setTab] = useState('saved');
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [status, setStatus] = useState(null);

  const [form, setForm] = useState({ firstName: '', lastName: '', admissionNo: '', classId: '' });

  const loadStudents = async () => {
    try {
      const data = await api.get('/students');
      setStudents(data);
    } catch (err) {
      setStatus({ type: 'err', text: err.message });
    }
  };

  const loadClasses = async () => {
    try {
      const data = await api.get('/classes');
      setClasses(data);
    } catch (err) {
      setStatus({ type: 'err', text: err.message });
    }
  };

  useEffect(() => {
    loadStudents();
    loadClasses();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/students', form);
      setStatus({ type: 'ok', text: `${form.firstName} added.` });
      setForm({ firstName: '', lastName: '', admissionNo: '', classId: '' });
      loadStudents();
      setTab('saved');
    } catch (err) {
      setStatus({ type: 'err', text: err.message });
    }
  };

  return (
    <div>
      <h1 className="page-title">Students</h1>
      <p className="page-subtitle">View, add, and review records for learners.</p>

      <StatusMessage status={status} />

      <div className="tab-row">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'saved' && (
        <div className="panel">
          <div className="panel-title">
            Saved List
            <button className="btn btn-ghost" onClick={loadStudents}>Refresh</button>
          </div>
          {students.length === 0 ? (
            <div className="empty-state">No students saved yet.</div>
          ) : (
            <table>
              <thead>
                <tr><th>Admission No</th><th>Name</th><th>Class</th></tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td>{s.admissionNo}</td>
                    <td>{s.firstName} {s.lastName}</td>
                    <td>{s.class?.name || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'add' && (
        <div className="panel">
          <div className="panel-title">Add a Student</div>
          <form onSubmit={handleAdd}>
            <div className="form-grid">
              <label>
                First name
                <input required value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </label>
              <label>
                Last name
                <input required value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </label>
              <label>
                Admission No
                <input required value={form.admissionNo}
                  onChange={(e) => setForm({ ...form, admissionNo: e.target.value })} />
              </label>
              <label>
                Class
                <select required value={form.classId}
                  onChange={(e) => setForm({ ...form, classId: e.target.value })}>
                  <option value="">Select a class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </label>
            </div>
            <button className="btn" type="submit">Save student</button>
          </form>
          {classes.length === 0 && (
            <p className="muted" style={{ marginTop: 12 }}>
              No classes exist yet - create one in the School tab first.
            </p>
          )}
        </div>
      )}

      {tab === 'records' && <RecordsPanel students={students} />}
    </div>
  );
}

// "Records" sub-section: Score List + Result Slip, as sketched
function RecordsPanel({ students }) {
  const [subTab, setSubTab] = useState('scoreList');
  const [studentId, setStudentId] = useState('');
  const [grades, setGrades] = useState([]);
  const [status, setStatus] = useState(null);

  const loadGrades = async () => {
    try {
      const data = await api.get('/grades');
      setGrades(data);
    } catch (err) {
      setStatus({ type: 'err', text: err.message });
    }
  };

  useEffect(() => { loadGrades(); }, []);

  const studentGrades = grades.filter((g) => String(g.studentId) === String(studentId));
  const selected = students.find((s) => String(s.id) === String(studentId));

  return (
    <div className="panel">
      <div className="tab-row" style={{ marginBottom: 14 }}>
        <button className={`tab ${subTab === 'scoreList' ? 'active' : ''}`} onClick={() => setSubTab('scoreList')}>Score List</button>
        <button className={`tab ${subTab === 'resultSlip' ? 'active' : ''}`} onClick={() => setSubTab('resultSlip')}>Result Slip</button>
      </div>

      <StatusMessage status={status} />

      {subTab === 'scoreList' && (
        grades.length === 0 ? (
          <div className="empty-state">No grades recorded yet.</div>
        ) : (
          <table>
            <thead>
              <tr><th>Student</th><th>Subject</th><th>Term</th><th>Score</th></tr>
            </thead>
            <tbody>
              {grades.map((g) => (
                <tr key={g.id}>
                  <td>{g.student?.firstName} {g.student?.lastName}</td>
                  <td>{g.subject?.name}</td>
                  <td>{g.term}</td>
                  <td>{g.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {subTab === 'resultSlip' && (
        <div>
          <div className="form-grid" style={{ marginBottom: 18 }}>
            <label>
              Choose student
              <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                <option value="">Select a student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                ))}
              </select>
            </label>
          </div>

          {!studentId ? (
            <div className="empty-state">Pick a student to see their result slip.</div>
          ) : studentGrades.length === 0 ? (
            <div className="empty-state">No grades found for {selected?.firstName}.</div>
          ) : (
            <table>
              <thead>
                <tr><th>Subject</th><th>Term</th><th>Score</th><th>Remarks</th></tr>
              </thead>
              <tbody>
                {studentGrades.map((g) => (
                  <tr key={g.id}>
                    <td>{g.subject?.name}</td>
                    <td>{g.term}</td>
                    <td>{g.score}</td>
                    <td>{g.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
