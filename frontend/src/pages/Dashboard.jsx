import { useState, useEffect } from "react";
import { api } from "../api/client";
import StatusMessage from "../components/StatusMessage";

export default function Dashboard(){
    const [classes, setClasses] = useState([]);
    const [students, setStudents] =useState([]);
    const [status, setStatus] = useState(null);

    //total classlist button
    const loadClasses = async() =>{
        try {
            const data = await api.get('/classes');
            setClasses(data);
            setStatus({ type: 'ok', text: `loaded ${data.length} class(es),`});
        } catch (err) {
            setStatus({ type: 'err', text: err.message});
        }
    };

    //leavers marks
    const loadGrades = async () => {
        try {
          const data = await api.get('/grades');
          setStudents(data);
          setStatus({ type: 'ok', text: `Loaded ${data.length} grade record(s).` });
        } catch (err) {
          setStatus({ type: 'err', text: err.message });
        }
      };

      useEffect(()=>{
        loadClasses();
      }, []) ;

      return (
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">A quick look at classes and learner performance.</p>
      
            <StatusMessage status={status} />
      
            <div className="panel">
              <div className="panel-title">
                Total Class List
                <button className="btn btn-ghost" onClick={loadClasses}>Refresh</button>
              </div>
              {classes.length === 0 ? (
                <div className="empty-state">No classes yet. Add one from the School tab.</div>
              ) : (
                <table>
                  <thead>
                    <tr><th>ID</th><th>Name</th><th>Level</th><th>Students</th></tr>
                  </thead>
                  <tbody>
                    {classes.map((c) => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.name}</td>
                        <td>{c.level || '-'}</td>
                        <td>{c.students?.length ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
      
            <div className="panel">
              <div className="panel-title">
                Learner's Marks
                <button className="btn btn-amber" onClick={loadGrades}>Load marks</button>
              </div>
              {students.length === 0 ? (
                <div className="empty-state">No marks loaded yet. Click "Load marks" to fetch from the API.</div>
              ) : (
                <table>
                  <thead>
                    <tr><th>Student</th><th>Subject</th><th>Term</th><th>Score</th></tr>
                  </thead>
                  <tbody>
                    {students.map((g) => (
                      <tr key={g.id}>
                        <td>{g.student?.firstName} {g.student?.lastName}</td>
                        <td>{g.subject?.name}</td>
                        <td>{g.term}</td>
                        <td>{g.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
}