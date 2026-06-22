// src/routes/students.js
const express = require('express');
const router = express.Router();
const prisma = require('..//config/db');

// GET /api/students - all students, optionally filtered by class
// e.g. /api/students?classId=2  -> students in that class
router.get('/', async (req, res, next) => {
  try {
    const { classId } = req.query;
    const students = await prisma.student.findMany({
      where: classId ? { classId: Number(classId) } : undefined,
      include: { class: true },
      orderBy: { lastName: 'asc' },
    });
    res.json(students);
  } catch (err) {
    next(err);
  }
});

// GET /api/students/:id - one student with all their grades (performance per subject)
router.get('/:id', async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        class: true,
        grades: { include: { subject: true } },
      },
    });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    next(err);
  }
});

// POST /api/students - add a new student
router.post('/', async (req, res, next) => {
  try {
    const { firstName, lastName, admissionNo, classId } = req.body;
    const student = await prisma.student.create({
      data: { firstName, lastName, admissionNo, classId: Number(classId) },
    });
    res.status(201).json(student);
  } catch (err) {
    next(err);
  }
});

module.exports = router;