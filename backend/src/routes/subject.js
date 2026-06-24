const express = require('express');
const router = express.Router();
const prisma = require('../config/db');

//list all subjects
router.get('/', async (req, res, next ) =>{
    try {
        const subjects = await prisma.subject.findMany();
        res.json(subjects);
    } catch (err) {
        next(err);
    }
});

//create a subject
router.post('/', async (req, res, next) =>{
    try {
        const { name } = req.body;
        const subject = await prisma.subject.create({ data: { name }});
        res.status(201).json(subject);
    } catch (err) {
        next(err);
    }
});

module.exports = router;