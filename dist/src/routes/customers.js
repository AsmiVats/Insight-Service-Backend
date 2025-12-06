"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = __importDefault(require("../middleware"));
const customers_1 = require("../controller/customers");
const router = (0, express_1.Router)();
router.get('/topcustomers', middleware_1.default, async (req, res) => {
    const tenantId = req.tenantId;
    const result = await (0, customers_1.getTopCustomers)(tenantId);
    res.json({ result });
});
router.get('/totalcount', middleware_1.default, async (req, res) => {
    const tenantId = req.tenantId;
    const result = await (0, customers_1.totalCustomersCount)(tenantId);
    res.json({ totalCustomers: result });
});
router.get('/revenuebycustomer', middleware_1.default, async (req, res) => {
    const tenantId = req.tenantId;
    const customerEmail = req.query.email;
    const result = await (0, customers_1.revenueByCustomer)(tenantId, customerEmail);
    res.json({ customerEmail, revenue: result });
});
router.get('/topcountries', middleware_1.default, async (req, res) => {
    const tenantId = req.tenantId;
    const result = await (0, customers_1.topCountries)(tenantId);
    res.json({ result });
});
exports.default = router;
