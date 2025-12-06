import { Router, Request, Response } from "express";
import { signinService, signupService } from "../controller/auth";
import prisma from "../db";
import { fetchCustomers, fetchOrders, fetchProducts } from "../shopify";
import { storeCustomerData, storeOrderData, storeProductData } from "../shopify/storeData";
import authMiddleware from "../middleware";

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


router.post('/update',authMiddleware,async (req: Request, res: Response) => {
	try{
		const tenantId = req.body.tenantId;

		if(!tenantId){
			return res.status(400).json({ error: 'tenantId is required' });
		}

		const tenant = await prisma.tenant.findUnique({
			where: { id: tenantId },
			select: { shopifyDomain: true, accessToken: true },
		});



		if(!tenant?.shopifyDomain || !tenant?.accessToken){
			return res.status(400).json({ error: 'Invalid tenantId' });
		}

		const [products, customers, orders] = await Promise.all([
			fetchProducts(tenant.shopifyDomain, tenant.accessToken),
			fetchCustomers(tenant.shopifyDomain, tenant.accessToken),
			fetchOrders(tenant.shopifyDomain, tenant.accessToken),
		]);


		if(!products || !customers || !orders) {
			return res.status(500).json({ error: 'Failed to fetch data from Shopify' });
		}

		// update data in the database
		await Promise.all([
			storeProductData(tenantId, products),
			storeCustomerData(tenantId, customers),
			storeOrderData(tenantId, orders),
		]);
	}
	catch(err:any){
		return res.status(500).json({ error: err.message || 'Data update failed' });
	
	}
});

export default router;