import { Router, Request, Response } from "express";
import { signinService, signupService } from "../controller/auth";

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
	try {
		const { email, shopifyDomain, accessToken, password } = req.body;
		const tenant = await signupService({ email, shopifyDomain, accessToken, password });
		res.status(201).json({ tenant });
	} catch (err: any) {
		res.status(400).json({ error: err.message || 'Signup failed' });
	}
});

router.post('/signin', async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		const result = await signinService(email, password);
		res.json(result);
	} catch (err: any) {
		res.status(401).json({ error: err.message || 'Signin failed' });
	}
});

export default router;