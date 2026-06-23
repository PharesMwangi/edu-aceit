const express = require('express');
const router = express.Router();
const prisma = require('../config/db');

//list all classes
router.get('/', async(req, res, next)=>{
    try {
        const classes = await prisma.class.findMany({
            include : {students: true },
        });
        res.json(classes);
    } catch (err) {
        next(err);
    }
});

//get one class with its students
router.get('/:id', async(req, res, next)=>{
    try {
        const classData = await prisma.class.findUnique({
            where: { id: Number(req.params.id) },
            include: {students: true, subjects: { include: { subject: true , teacher: true}}},
        });
        if(!classData) return res.status(404).json({ error: 'class not found!'});
        res.json(classData);
    } catch (err) {
        next(err);
    }
});

//create a class
router.post('/', async(req, res, next) =>{
    try {
        const {name, level} = req.body;
        const newClass = await prisma.class.create({ data: {name, level }});
        res.status(201).json(newClass);
    } catch (err) {
        next(err);
    }
});

module.exports = router;