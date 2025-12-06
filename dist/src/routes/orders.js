"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_1 = require("../controller/orders");
const middleware_1 = __importDefault(require("../middleware"));
const shopify_1 = require("../shopify");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
router.get('/total-orders', middleware_1.default, async (req, res) => {
    const tenantId = req.tenantId;
    if (!tenantId) {
        return res.status(400).json({ error: 'tenantId is required' });
    }
    const result = await (0, orders_1.totalOrdersCount)(tenantId);
    res.json({ totalOrders: result });
});
router.get('/revenue', middleware_1.default, async (req, res) => {
    const tenantId = req.tenantId;
    if (!tenantId) {
        return res.status(400).json({ error: 'tenantId is required' });
    }
    const result = await (0, orders_1.totalRevenue)(tenantId);
    res.json({ totalRevenue: result });
});
router.get('/range-revenue', middleware_1.default, async (req, res) => {
    const tenantId = req.tenantId;
    const { startDate, endDate } = req.query;
    if (!tenantId) {
        return res.status(400).json({ error: 'tenantId is required' });
    }
    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'startDate and endDate query parameters are required' });
    }
    const result = await (0, orders_1.rangeRevenue)(tenantId, new Date(startDate), new Date(endDate));
    res.json({ rangeRevenue: result });
});
router.get('/metrics', middleware_1.default, async (req, res) => {
    const tenantId = req.tenantId;
    if (!tenantId) {
        return res.status(401).json({ error: 'Tenant ID missing from token.' });
    }
    try {
        const tenant = await db_1.default.tenant.findUnique({
            where: {
                id: tenantId,
            },
            select: {
                shopifyDomain: true,
                accessToken: true,
            },
        });
        const { shopifyDomain, accessToken } = tenant?.shopifyDomain && tenant?.accessToken ? tenant : { shopifyDomain: null, accessToken: null };
        if (!shopifyDomain || !accessToken) {
            return res.status(500).json({ error: 'Shopify credentials missing for tenant.' });
        }
        const results = await (0, shopify_1.analyticsFunc)(shopifyDomain, accessToken);
        res.json({ metrics: results });
    }
    catch (error) {
        console.error('Error fetching metrics or tenant credentials:', error);
        res.status(500).json({ error: 'Failed to retrieve analytics data.' });
    }
});
exports.default = router;
