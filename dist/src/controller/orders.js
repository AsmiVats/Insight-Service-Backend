"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rangeRevenue = exports.totalRevenue = exports.totalOrdersCount = void 0;
const db_1 = __importDefault(require("../db"));
const totalOrdersCount = async (tenantId) => {
    try {
        const count = await db_1.default.order.count({
            where: { tenantId }
        });
        return count;
    }
    catch (err) {
        console.error('Error counting orders', err);
    }
};
exports.totalOrdersCount = totalOrdersCount;
const totalRevenue = async (tenantId) => {
    try {
        const result = await db_1.default.order.aggregate({
            where: { tenantId },
            _sum: {
                amount: true
            }
        });
        const orders = await db_1.default.order.findMany({
            where: { tenantId }
        });
        console.log(orders);
        return result._sum.amount || 0;
    }
    catch (err) {
        console.error('Error calculating total revenue', err);
    }
};
exports.totalRevenue = totalRevenue;
const rangeRevenue = async (tenantId, startDate, endDate) => {
    try {
        const result = await db_1.default.$queryRaw `
            SELECT
                DATE("createdAt") AS date,
                SUM(amount) AS revenue
            FROM "Order"
            WHERE "tenantId" = ${tenantId}
              AND "createdAt" >= ${startDate}::date
              AND "createdAt" <= ${endDate}::date
            GROUP BY date
            ORDER BY date ASC;
        `;
        const parsedResult = result.map(item => ({
            date: item.date,
            revenue: parseFloat(item.revenue.toString()),
        }));
        return parsedResult;
    }
    catch (err) {
        console.error('Error calculating daily grouped revenue', err);
        throw new Error('Failed to fetch daily revenue data.');
    }
};
exports.rangeRevenue = rangeRevenue;
