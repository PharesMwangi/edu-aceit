const express = require('express');
const router = express.Router();
const prisma = require('../config/db');

// get full weekly timetable
router.get('/', async(req, res, next) =>{
    try {
        const { classId, teacherId } = req.query;
        const slots = await prisma.timetableSlot.findMany({
            where: {
                classId: classId ? Number(classId) : undefined,
                teacherId: teacherId ? Number(teacherId) : undefined,
            },
            include: { class: true, subject: true, teacher: true},
            orderBy: [{dayOfWeek: 'asc'}, {startTime: 'asc'}],
        });
        res.json(slots);
    } catch (err) {
        next(err);
    }
});

//add slot to timetable
router.post('/', async(req, res, next) =>{
    try {
        const { classId, subjectId, teacherId, dayOfWeek, startTime, endTime } = req.body;
        const slot = await prisma.timetableSlot.create({
            data: {
                classId: Number(classId),
                subjectId: Number(subjectId),
                teacherId: Number(teacherId),
                dayOfWeek,
                startTime,
                endTime,
            },
        });
        res.status(201).json(slot)
    } catch (err) {
        next(err);
    }
});

module.exports = router;