"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_js_1 = require("./generated/prisma/client.js");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Disable certificate verification
    }
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_js_1.PrismaClient({ adapter });
exports.default = prisma;
