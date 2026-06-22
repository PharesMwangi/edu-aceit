require('dotenv').config();
const cors = require ('cors');
const express = require('express');

const studentRouter = require('./src/routes/student');

const app = express();

app.use(cors());
app.use(express.json());

//check server and db are alive
app.get('/api/health', (req, res) =>{
    res.json({ status: 'ok'});
});

app.use('/api/student', studentRouter);

//catch errors
app.use((err, req, res, next) =>{
    console.error(err);
    res.status(500).json({error: 'something went wrong on the server!'});
});

const PORT = process.env.port || 5000;
app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:$PORT`);
});