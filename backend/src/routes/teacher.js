const express = require('express');
const router = express.Router();
const prisma = require('../config/db');

//list all teachers
router.get('/', async( req, res, next ) =>{
    try {
        const teachers = await prisma.teacher.findMany();
        res.json(teachers);
    } catch (err) {
        next(err);
    }
});

//get a teacher with what they teach 
router.get('/:id', async(req, res, next) =>{
    try {
        const teacher = await prisma.teacher.findUnique({
            where: {id: Number(req.params.id)},
            include: {
                classSubjects: {include: { class: true, subject: true }},
            },
        });
        if(!teacher) return res.status(404).json({ error: "Teacher not found!"});
        res.json(teacher);
    } catch (err) {
        next(err);
    }
    
});

//add a teacher
router.post('/', async( req, res, next) =>{
    try {
        const { firstName, lastName, email } = req.body;
        const teacher = await prisma.teacher.create({ data: {firstName, lastName, email} });
        res.status(201).json(teacher);
    } catch (err) {
        next(err);
    }
});

module.exports = router;