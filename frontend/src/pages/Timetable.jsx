import { useState, useEffect } from "react";
import { api } from "../api/client";
import StatusMessage from "../components/StatusMessage";

const TABS = [
    { key: 'list', label: 'Timetable List'},
    { key: 'generate', label: 'Generate (Add Slot)'},
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday'];

export default function Timetable(){
    const [tab, setTab] = useState('list');
    const [slots, setSlots] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [filterClassId, setFilterClassId] = useState('');
    const [status, setStatus] = useState(null);

    const [form, setForm] = useState({
        classId: '', subjectId: '', teacherId: '', dayOfWeek: 'Monday', startTime: '', endTime:'',
    });

    const loadAll = async () =>{
        try {
            const [s, c, sub, t] = await Promise.all([
                api.get('/timetable'), api.get('/classes'), api.get('/subjects'), api.get('/teachers'),
            ]);
            setSlots(s); setClasses(c); setSubjects(sub); setTeachers(t);
        } catch (err) {
            setStatus({type: 'err', text: err.message});
        }
    };

    useEffect(() => { loadAll(); }, []);

    const handleGenerate = async(e) =>{
        e.preventDefault();
        try {
            await api.post('/timetable', form);
            setStatus({ type: 'ok', text: 'Timetable slot added.'});
            setForm({ classId: '', subjectId: '', teacherId:'', dayOfWeek: 'Monday', startTime:'', endTime: ''});
            loadAll();
            setTab('list');
        } catch (err) {
            setStatus({type: 'err', text: err.message});
        }
    };

    const vissibleSlots = filterClassId
    ? slots.filter((s) => String(s.classId) === String(filterClassId))
    : slots;

    return(
        <div>
            <h1 className="page-title">Time-Table</h1>
            <p className="page-subtitle">Build and review your schedule.</p>

            <StatusMessage status={status} />

            <div className="tab-row">
                {TABS.map((t) =>(
                    <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === 'list' &&(
                <div className="panel">
                    <div className="panel-title">
                        Timetable list
                        <button className="btn btn-ghost" onClick={loadAll}>Refresh</button>
                    </div>
                    <div className="formgrid" style={{ gridTemplateColumns: '1fr', marginBottom:16}}>
                        <label htmlFor="">
                            Filter By Class
                            <select value={filterClassId} onChange={(e) => setFilterClassId(e.target.value)}>
                                <option value="">All Classes</option>
                                {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </label>
                    </div>
                    {vissibleSlots.length === 0 ?(
                        <div className="empty-state">No Timetable Slots Yet.</div>
                    ):(
                        <table>
                            <thead>
                                <tr><th>Day</th><th>Time</th><th>Class</th><th>Subject</th><th>Teacher</th></tr>
                            </thead>
                            <tbody>
                                {vissibleSlots.map((s) =>(
                                    <tr key={s.id}>
                                        <td>{s.dayOfWeek}</td>
                                        <td>{s.startTime}-{s.endTime} </td>
                                        <td>{s.class?.name} </td>
                                        <td>{s.subject?.name} </td>
                                        <td>{s.teacher?.firstName} {s.teacher?.lastName} </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {tab === 'generate' &&(
                <div className="panel">
                    <div className="panel-title">Generate a Timetable Slot.</div>
                    <form onSubmit={handleGenerate}>
                        <div className="form-grid">
                            <label htmlFor="">
                                Class
                                <select required value={form.classId} onChange={(e) => setForm({...form, classId: e.target.value })}>
                                    <option value="">Select Class</option>
                                    {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </label>
                            <label htmlFor="">
                                Subject
                                <select required value={form.subjectId} onChange={(e) => setForm({...form, subjectId: e.target.value})}>
                                    <option value="">Select Subject</option>
                                    {subjects.map((s) => <option key={s.id} value={s.id}>{s.name} </option>)}
                                </select>
                            </label>
                            <label htmlFor="">
                                Teacher
                                <select required value={form.teacherId} onChange={(e) => setForm({...form, teacherId: e.target.value})}>
                                    <option value="">Teacher</option>
                                    {teachers.map((t) => <option key={t.id} value={t.id}>{t.firstName} {t.lastName} </option>)}
                                </select>
                            </label>
                            <label htmlFor="">
                                Day
                                <select required value={form.dayOfWeek} onChange={(e) => setForm({...form, dayOfWeek: e.target.value})}>
                                    <option value="">Select Subject</option>
                                    {DAYS.map((d) => <option key={d.id} value={d.id}>{d} </option>)}
                                </select>
                            </label>
                            <label htmlFor="">
                                Start time
                                <input required type="time" value={form.startTime}
                                    onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
                            </label>
                            <label>
                                End time
                                <input required type="time" value={form.endTime}
                                onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
                            </label>
                        </div>
                        <button className="btn btn-amber" type="submit">Add slot</button>
                    </form>
                    {(classes.length === 0 || subjects.length === 0 || teachers.length === 0) &&(
                        <p className="muted" style={{marginTop: 12}}>
                            You'll need at least one class, subject, and teacher created first (School tab).
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}