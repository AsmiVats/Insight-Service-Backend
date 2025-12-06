"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.topCountries = exports.revenueByCustomer = exports.totalCustomersCount = exports.getTopCustomers = void 0;
const db_1 = __importDefault(require("../db"));
const getTopCustomers = async (tenantId, limit = 5) => {
    try {
        const topCustomers = await db_1.default.customer.findMany({
            where: { tenantId },
            orderBy: { totalSpent: 'desc' },
            take: limit,
            select: {
                firstName: true,
                lastName: true,
                email: true,
                totalSpent: true,
            }
        });
        console.log('Top Customers:', topCustomers);
        return topCustomers;
    }
    catch (err) {
        console.error('Error fetching top customers', err);
    }
};
exports.getTopCustomers = getTopCustomers;
const totalCustomersCount = async (tenantId) => {
    try {
        const count = await db_1.default.customer.count({
            where: { tenantId }
        });
        return count;
    }
    catch (err) {
        console.error('Error counting customers', err);
    }
};
exports.totalCustomersCount = totalCustomersCount;
const revenueByCustomer = async (tenantId, customerEmail) => {
    try {
        const result = await db_1.default.order.aggregate({
            where: {
                tenantId,
                customerEmail
            },
            _sum: {
                amount: true
            }
        });
        return result._sum.amount || 0;
    }
    catch (err) {
        console.error('Error calculating revenue by customer', err);
    }
};
exports.revenueByCustomer = revenueByCustomer;
const topCountries = async (tenantId, limit = 5) => {
    try {
        const result = await db_1.default.customer.groupBy({
            by: ['country'],
            where: { tenantId },
            _count: {
                country: true
            },
            orderBy: {
                _count: {
                    country: 'desc'
                }
            }
        });
        const formattedResult = result.map(item => ({
            name: item.country,
            count: item._count.country
        }));
        return formattedResult;
    }
    catch (err) {
        console.error('Error fetching top countries', err);
        throw new Error('Failed to fetch top countries data.');
    }
};
exports.topCountries = topCountries;
