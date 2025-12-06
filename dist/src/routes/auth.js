"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../auth/auth");
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
exports.default = router;
