// src/db.js
// This file's ONLY job: create one shared PrismaClient instance
// so every route reuses the same connection instead of opening a new one each time.
// Prisma reads DATABASE_URL from .env automatically - no manual connection code needed.

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;