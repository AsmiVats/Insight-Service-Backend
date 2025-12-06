"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const authHeader = (req.headers.authorization || req.headers.Authorization);
    if (!authHeader) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET is not set');
            return res.status(500).json({ error: 'Server configuration error' });
        }
        const payload = jsonwebtoken_1.default.verify(token, secret);
        const tenantId = payload?.tenantId ?? payload?.tenant_id ?? payload?.sub;
        // Ensure req.body exists before assigning tenantId (body-parser may not have run)
        const anyReq = req;
        anyReq.body = anyReq.body ?? {};
        if (tenantId)
            anyReq.body.tenantId = tenantId;
        // also expose on req.tenant and req.tenantId for convenience and typing
        req.tenant = tenantId;
        req.tenantId = tenantId;
        return next();
    }
    catch (err) {
        console.log('Authentication error:', err);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
