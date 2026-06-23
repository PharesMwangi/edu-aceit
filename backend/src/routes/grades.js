// for performances
const express = require('express');
const router = express.Router();
const prisma = require('../config/db');

//view performances
router.get('/', async (req, res, next) =>{
    try {
        const {classId, subjectId, term} = req.query;

        const grades = await prisma.class.findMany({
            where: {
                subjectId: subjectId ? Number (subjectId) : undefined,
                term: term || undefined,
                student: classId ? {classId: Number (classId)} : undefined,
            },
            include: { student: true, subject: true},
        });
        res.json(grades);
    } catch (err) {
        next(err);
    }
});

//post and update student score
router.post('/', async (req, res, next) =>{
    try {
        const { studentId, subjectId, term, score, remarks } = req.body;
        const grade = prisma.class.upsert({
            where:{
                studentId_subjectId_term:{
                    studentId: Number(studentId),
                    subjectId: Number(subjectId),
                    term,
                },
            },
            update: {score: Number(score), remarks},
            create: {
                studentId: Number(studentId),
                subjectId: Number(subjectId),
                term,
                score: Number(score),
                remarks,
            },
        });
        res.status(201).json(grade);
    } catch (err) {
        next(err);
    }
});

module.exports = router;