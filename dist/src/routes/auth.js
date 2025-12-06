"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controller/auth");
const db_1 = __importDefault(require("../db"));
const shopify_1 = require("../shopify");
const storeData_1 = require("../shopify/storeData");
const middleware_1 = __importDefault(require("../middleware"));
const router = (0, express_1.Router)();
router.post('/signup', async (req, res) => {
    try {
        const { email, shopifyDomain, accessToken, password } = req.body;
        const tenant = await (0, auth_1.signupService)({ email, shopifyDomain, accessToken, password });
        res.status(201).json({ tenant });
    }
    catch (err) {
        res.status(400).json({ error: err.message || 'Signup failed' });
    }
});
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await (0, auth_1.signinService)(email, password);
        res.json(result);
    }
    catch (err) {
        res.status(401).json({ error: err.message || 'Signin failed' });
    }
});
router.post('/update', middleware_1.default, async (req, res) => {
    try {
        const tenantId = req.body.tenantId;
        if (!tenantId) {
            return res.status(400).json({ error: 'tenantId is required' });
        }
        const tenant = await db_1.default.tenant.findUnique({
            where: { id: tenantId },
            select: { shopifyDomain: true, accessToken: true },
        });
        if (!tenant?.shopifyDomain || !tenant?.accessToken) {
            return res.status(400).json({ error: 'Invalid tenantId' });
        }
        const [products, customers, orders] = await Promise.all([
            (0, shopify_1.fetchProducts)(tenant.shopifyDomain, tenant.accessToken),
            (0, shopify_1.fetchCustomers)(tenant.shopifyDomain, tenant.accessToken),
            (0, shopify_1.fetchOrders)(tenant.shopifyDomain, tenant.accessToken),
        ]);
        if (!products || !customers || !orders) {
            return res.status(500).json({ error: 'Failed to fetch data from Shopify' });
        }
        // update data in the database
        await Promise.all([
            (0, storeData_1.storeProductData)(tenantId, products),
            (0, storeData_1.storeCustomerData)(tenantId, customers),
            (0, storeData_1.storeOrderData)(tenantId, orders),
        ]);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Data update failed' });
    }
});
exports.default = router;
