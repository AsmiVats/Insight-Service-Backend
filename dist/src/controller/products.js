"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.topSoldProducts = exports.totalAvailableProduct = exports.OutOfStockProducts = void 0;
const db_1 = __importDefault(require("../db"));
const OutOfStockProducts = async (tenantId, limit = 5) => {
    try {
        const outOfStockProducts = await db_1.default.product.findMany({
            where: { tenantId, status: "inactive" },
            take: limit,
            select: {
                title: true,
                price: true,
                status: true,
                tags: true,
            }
        });
        console.log('Out of Stock Products:', outOfStockProducts);
        return outOfStockProducts;
    }
    catch (err) {
        console.error('Error fetching out of stock products', err);
    }
};
exports.OutOfStockProducts = OutOfStockProducts;
const totalAvailableProduct = async (tenantId) => {
    try {
        const count = await db_1.default.product.count({
            where: { tenantId }
        });
        return count;
    }
    catch (err) {
        console.error('Error counting products', err);
    }
};
exports.totalAvailableProduct = totalAvailableProduct;
const topSoldProducts = async (tenantId, limit = 5) => {
    try {
        const result = await db_1.default.order.groupBy({
            by: ['itemName'],
            where: { tenantId },
            _sum: {
                quantity: true
            },
            orderBy: {
                _sum: {
                    quantity: 'desc'
                }
            },
            take: limit
        });
        return result.map(item => ({
            name: item.itemName,
            quantitySold: item._sum.quantity || 0,
        }));
    }
    catch (err) {
        console.error('Error fetching top sold products', err);
    }
};
exports.topSoldProducts = topSoldProducts;
