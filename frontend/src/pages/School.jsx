import { useState, useEffect } from "react";
import { api } from "../api/client";
import StatusMessage from '../components/StatusMessage'

const TABS =[
    {key: 'classes', label: 'Classes'},
    {key: 'subjects', label: 'Subjects'},
    {key: 'addTeacher', label: 'Add Teacher'}
];

export default function School(){
    const [tab, setTab] = useState('classes');
    const [classes, setClasses ] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [status, setStatus] = (null);

    const [classForm, setClassForm] = useState({name:'', level:''});
    const [teacherForm, setTeacherForm] = useState({firstName:'', lastName:'', email:''});
    const [subjects, setSubjects] = useState([]);
    const [subjectForm, setSubjectForm] = useState({name: ''});

    const loadSubjects = async ()=>{
        try { setSubjects( await api.get('/subjects')); }
         catch (err) { setStatus({type: 'err', text: err.message }); }
    };

    const handleAddSubject = async (e) =>{
        e.preventDefault();
        try {
            await api.post('/subjects', subjectForm);
            setStatus({ type: 'ok', text: `Subject "${subjectForm.name}" created.`});
            setSubjectForm({name: ''});
            loadSubjects();
        } catch (err) {
            setStatus({ type: 'err', text: err.message});
        }
    };

    const loadClasses = async() =>{
        try{ setClasses(await api.get('/classes'));}
         catch(err){ setStatus({type: 'err', text: err.message}); }
    };

    const loadTeachers = async() =>{
        try{ setTeachers(await api.get('/teachers'));}
         catch(err) {setStatus({type: 'err', text: err.message}); }
    };

    useEffect(() => {loadClasses(); loadTeachers(); loadSubjects(); }, []);

    const handleAddClass = async (e) =>{
        e.preventDefault();
        try {
            await api.post('/classes', classForm);
            setStatus({ type: 'ok', text: `Class "${classForm.name}" created.`});
            setClassForm({name:'', level:''});
            loadClasses();
        } catch (err) {
            setStatus({ type: 'err', text: err.message});
        }
    };

    const handleAddTeacher = async(e) =>{
        e.preventDefault();
        try {
            await api.post('/teachers', teacherForm);
            setStatus({ type: 'ok', text: `Teacher "${teacherForm.firstName}" added.`});
            setTeacherForm({firstName: '', lastName: '', email: ''});
            loadTeachers();
        } catch (err) {
            setStatus({ type: 'err', text: err.message});
        }
    };

    return(
        <div>
            <h1 className="page-title">School</h1>
            <p className="page-subtitle">Manage classes and teaching staff.</p>

            <StatusMessage status= {status} />

            <div className="tab-row">
                {TABS.map((t) =>(
                    <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === 'classes' && (
                <>
                    <div className="panel">
                        <div className="panel-title">Add Class</div>
                        <form onSubmit={handleAddClass}>
                            <div className="form-grid">
                                <label htmlFor="">
                                    Class Name
                                    <input required placeholder="e.g. Grade 4B" value={classForm.name}
                                    onChange={(e) => setClassForm({ ...classForm, name: e.target.value })} />
                                </label>
                                <label htmlFor="">
                                    level
                                    <input placeholder="e.g. Grade 4" value={classForm.level}
                                    onChange={(e) => setClassForm({ ...classForm, level: e.target.value })} />
                                </label>
                            </div>
                            <button className="btn" type="submit">Save class</button>
                        </form>
                    </div>

                    <div className="panel">
                        <div className="panel-title">
                            School description - Classes on record
                            <button className="btn btn-ghost" onClick={loadClasses}>Refresh</button>
                        </div>
                        {classes.length === 0 ?(
                            <div className="empty-state"> No classes yet</div>
                        ) : (
                            <table>
                                <thead><tr><th>ID</th><th>Name</th><th>Level</th></tr></thead>
                                <tbody>
                                    {classes.map((c) => (
                                        <tr key={c.id}><td>{c.id}</td><td>{c.name}</td><td>{c.level || '-'}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}

            {tab === 'subjects' &&(
                <>
                    <div className="panel">
                        <div className="panel-title"> Add a Subject</div>
                        <form onSubmit={handleAddSubject}>
                            <div className="form-grid" style={{ gridTemplateColumns: '1fr'}}>
                                <label htmlFor="">
                                    Subject name
                                    <input required placeholder="e.g. Mathematics" value={subjectForm.name}
                                        onChange={(e) => setSubjectForm({ name: e.target.value })} />
                                </label>
                            </div>
                            <button className="btn" type="submit">Save Subject</button>
                        </form>
                    </div>

                    <div className="panel">
                        <div className="panel-title">
                        Subjects on record
                        <button className="btn btn-ghost" onClick={loadSubjects}>Refresh</button>
                        </div>
                        {subjects.length === 0 ? (
                        <div className="empty-state">No subjects yet.</div>
                        ) : (
                        <table>
                            <thead><tr><th>ID</th><th>Name</th></tr></thead>
                            <tbody>
                            {subjects.map((s) => (
                                <tr key={s.id}><td>{s.id}</td><td>{s.name}</td></tr>
                            ))}
                            </tbody>
                        </table>
                        )}
                    </div>
                </>
            )}

            {tab === 'addTeacher' &&(
                <>
                    <div className="panel">
                        <div className="panel-title">Add a Teacher</div>
                        <form onSubmit={handleAddTeacher}>
                            <div className="form-grid">
                                <label htmlFor="">
                                    First name
                                    <input required value={teacherForm.firstName}
                                        onChange={(e) => setTeacherForm({ ...teacherForm, firstName: e.target.value })} />
                                </label>
                                <label htmlFor="">
                                    Last name
                                    <input required value={teacherForm.lastName}
                                        onChange={(e) => setTeacherForm({ ...teacherForm, lastName: e.target.value })} />
                                </label>
                                <label htmlFor="">
                                    Email
                                    <input required value={teacherForm.email}
                                        onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })} />
                                </label>
                            </div>
                            <button className="btn btn-amber" type="submit">Save Teacher</button>
                        </form>
                    </div>

                    <div className="panel">
                        <div className="panel-title">
                            Teachers on Record
                            <button className="btn btn-ghost" onClick={loadTeachers}>Refresh</button>
                        </div>
                        {teachers.length === 0 ? (
                            <div className="empty-state">No Teachers Yet.</div>
                        ):(
                            <table>
                                <thead><tr><th>ID</th><th>Name</th><th>Email</th></tr></thead>
                                <tbody>
                                    {teachers.map((t) => (
                                        <tr key={t.id}><td>{t.id}</td><td>{t.firstName} {t.lastName}</td><td>{t.email}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}