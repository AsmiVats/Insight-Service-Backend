"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_1 = require("../controller/products");
const middleware_1 = __importDefault(require("../middleware"));
const router = (0, express_1.Router)();
router.get('/outofstock', middleware_1.default, async (req, res) => {
    const tenantId = req.tenantId;
    if (!tenantId) {
        return res.status(401).json({ error: 'Tenant ID missing from token.' });
    }
    try {
        const outOfStockProducts = await (0, products_1.OutOfStockProducts)(tenantId);
        res.json({ outOfStockProducts });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch out of stock products' });
    }
});
router.get('/totalavailable', middleware_1.default, async (req, res) => {
    const tenantId = req.tenantId;
    if (!tenantId) {
        return res.status(401).json({ error: 'Tenant ID missing from token.' });
    }
    try {
        const totalAvailable = await (0, products_1.totalAvailableProduct)(tenantId);
        res.json({ totalAvailable });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch total available products' });
    }
});
router.get('/topsold', middleware_1.default, async (req, res) => {
    const tenantId = req.tenantId;
    if (!tenantId) {
        return res.status(401).json({ error: 'Tenant ID missing from token.' });
    }
    try {
        const topSold = await (0, products_1.topSoldProducts)(tenantId);
        res.json({ topSold });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch top sold products' });
    }
});
exports.default = router;
