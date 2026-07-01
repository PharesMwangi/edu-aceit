import { useState, useEffect } from "react";
import { api } from "../api/client";
import StatusMessage from "../components/StatusMessage";

const TABS = [
    { key: 'list',  label: 'Submitted Reports'},
    { key: 'add', label: 'Write a Report'},
];

export default function Reports(){
    const [tab, setTab] = useState('list');
    const [reports, setReports] = useState([]);
    const [classes, setClasses ] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [status, setStatus] = useState(null);

    const [form, setForm ] = useState({teacherId: '', classId:'', term: '', content:''});

    const loadAll = async () =>{
        try {
            const[ r, c, t] = await Promise.all([
                api.get('/reports'), api.get('/class'), api.get('/teacher'),
            ]);
            setReports(r); setClasses(c); setTeachers(t);
        } catch (err) {
            setStatus({ type: 'err', text: err.message});
        }
    };

    useEffect(() => { loadAll(); }, []);

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            await api.post('/reports', form);
            setStatus({type: 'ok',text: 'Report Submitted'});
            setForm({ teacherId:'', classId:'', term: '', content: ''});
            loadAll();
            setTab('list');
        } catch (err) {
            setStatus({ type: 'err', text: err.message});
        }
    };

    return(
        <div>
            <h1 className="page-title">Reports</h1>
            <p className="page-subtitle">Teacher write-ups on progress, by term </p>

            <StatusMessage status={status} />

            <div className="tab-row">
                {TABS.map((t) =>(
                    <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={()=> setTab(t.key)}>
                        {t.label}
                    </button>
                ))}
            </div>

            { tab === 'list' &&(
                <div className="panel">
                    <div className="panel-title">
                        Submitted Reports
                        <button className="btn btn-ghost" onClick={loadAll}>Refresh</button>
                    </div>
                    {reports.length === 0 ? (
                        <div className="empty-state">No Reports Submitted Yet.</div>
                    ):(
                        reports.map((r) => (
                            <div key={r.id} style={{padding: '12px 0', borderBottom: '1px solid var (--line)'}}>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem'}}>
                                    {r.class?.name} - {r.term}
                                </div>
                                <div className="muted" style={{marginBottom: 6}}>
                                    By {r.teacher?.firstName} {r.teacher?.lastName}
                                </div>
                                <div style={{ fontSize: '0.9rem'}}>{r.content}</div>
                            </div>
                        ))
                    )}
                </div>
            )}

            { tab === 'add' &&(
                <div className="panel">
                    <div className="panel-title">Write a Report.</div>
                    <form action="" onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <label htmlFor="">
                                Teacher
                                <select required value={form.teacherId} onChange={(e) => setForm ({...form, teacherId: e.target.value})}>
                                    <option value="">Select Teacher</option>
                                    {teachers.map((t) => <option key={t.id} value={t.id}> {t.firstName} {t.lastName} </option>)}
                                </select>
                            </label>
                            <label htmlFor="">
                                Class
                                <select required value={form.classId} onChange={(e) => setForm ({...form, classId: e.target.value})}>
                                    <option value="">Select Class</option>
                                    {classes.map((t) => <option key={c.id} value={c.id}> {c.name}</option>)}
                                </select>
                            </label>
                            <label htmlFor="">
                                Term
                                <input required placeholder="term 1- 2026" value={form.term}
                                onChange={(e) => setForm({ ...form, term: e.target.value })} />
                            </label>
                        </div>
                        <label htmlFor="" style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.78rem', color: 'var(--ink-soft)', marginBottom: 14}}>
                            Report Content.
                            <textarea required rows={5} value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value})} 
                            style={{padding: '8px 10px', border: '1px solid (var--line)', borderRadius: 6, fontSize: '0.9rem'}} />
                        </label>
                        <button className="btn btn-amber" type="submit">Submit Report</button>
                    </form>
                </div>
            )}
        </div>
    );
}