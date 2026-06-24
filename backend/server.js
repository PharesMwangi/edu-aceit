require('dotenv').config();
const cors = require ('cors');
const express = require('express');

const classRouter = require('./src/routes/class');
const studentRouter = require('./src/routes/student');
const subjectRouter = require('./src/routes/subject');
const gradesRouter = require('./src/routes/grades');
const teacherRouter = require('./src/routes/teacher');
const timeRouter = require('./src/routes/timetable');

const app = express();

app.use(cors());
app.use(express.json());

//check server and db are alive
app.get('/api/health', (req, res) =>{
    res.json({ status: 'ok'});
});

app.use('/api/class', classRouter);
app.use('/api/student', studentRouter);
app.use('/api/subject', subjectRouter);
app.use('/api/grades', gradesRouter);
app.use('/api/teacher', teacherRouter);
app.use('/api/timetable', timeRouter);

//catch errors
app.use((err, req, res, next) =>{
    console.error(err);
    res.status(500).json({error: 'something went wrong on the server!'});
});

const PORT = process.env.port || 5000;
app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});