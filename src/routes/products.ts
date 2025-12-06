import { Router, Request,Response } from "express";
import { OutOfStockProducts, topSoldProducts, totalAvailableProduct } from "../controller/products";
import authMiddleware from "../middleware";


const router = Router();

router.get('/outofstock',authMiddleware, async (req: Request, res: Response) => {
   const tenantId = (req as any).tenantId; 

    if (!tenantId) {
        return res.status(401).json({ error: 'Tenant ID missing from token.' });
    }
    try {
        const outOfStockProducts = await OutOfStockProducts(tenantId);
        res.json({ outOfStockProducts });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch out of stock products' });
    }
});

router.get('/totalavailable',authMiddleware, async (req: Request, res: Response) => {
   const tenantId = (req as any).tenantId; 

    if (!tenantId) {
        return res.status(401).json({ error: 'Tenant ID missing from token.' });
    }
    try {
        const totalAvailable = await totalAvailableProduct(tenantId);
        res.json({ totalAvailable });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch total available products' });
    }
});
router.get('/topsold', authMiddleware, async (req: Request, res: Response) => {
   const tenantId = (req as any).tenantId; 

    if (!tenantId) {
        return res.status(401).json({ error: 'Tenant ID missing from token.' });
    }
    try {
        const topSold = await topSoldProducts(tenantId);
        res.json({ topSold });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch top sold products' });
    }
});
export default router;