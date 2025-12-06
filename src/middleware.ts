import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
	const authHeader = (req.headers.authorization || req.headers.Authorization) as string | undefined;

	if (!authHeader ) {
		return res.status(401).json({ error: 'Missing or invalid Authorization header' });
	}

	const token = authHeader.split(' ')[1];
	try {
		const secret = process.env.JWT_SECRET;
		if (!secret) {
			console.error('JWT_SECRET is not set');
			return res.status(500).json({ error: 'Server configuration error' });
		}

		const payload = jwt.verify(token, secret) as any;
		const tenantId = payload?.tenantId ?? payload?.tenant_id ?? payload?.sub;

		// Ensure req.body exists before assigning tenantId (body-parser may not have run)
		const anyReq = req as any;
		anyReq.body = anyReq.body ?? {};
		if (tenantId) anyReq.body.tenantId = tenantId;

		// also expose on req.tenant and req.tenantId for convenience and typing
		(req as any).tenant = tenantId;
		(req as any).tenantId = tenantId;

		return next();
	} catch (err: any) {
		console.log('Authentication error:', err);
		return res.status(401).json({ error: 'Invalid or expired token' });
	}
}

