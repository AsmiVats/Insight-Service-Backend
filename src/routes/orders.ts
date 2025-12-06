import { Router } from "express";
import { rangeRevenue, totalOrdersCount, totalRevenue } from "../controller/orders";
import authMiddleware from "../middleware";
import { analyticsFunc } from "../shopify";
import prisma from "../db";

const router = Router();

router.get('/total-orders',authMiddleware, async (req, res) => {
    const tenantId = req.tenantId;
    if(!tenantId){
        return res.status(400).json({ error: 'tenantId is required' });
    }
    const result = await totalOrdersCount(tenantId);
    res.json({ totalOrders: result });
});

router.get('/revenue',authMiddleware, async (req, res) => {
    const tenantId = req.tenantId;
    if(!tenantId){
        return res.status(400).json({ error: 'tenantId is required' });
    }
    const result = await totalRevenue(tenantId);
    res.json({ totalRevenue: result });
});

router.get('/range-revenue',authMiddleware, async (req, res) => {
    const tenantId = req.tenantId;
    const { startDate, endDate } = req.query;
    if(!tenantId){
        return res.status(400).json({ error: 'tenantId is required' });
    }
    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'startDate and endDate query parameters are required' });
    }
    const result = await rangeRevenue(tenantId, new Date(startDate as string), new Date(endDate as string));
    res.json({ rangeRevenue: result });
});



router.get('/metrics', authMiddleware, async (req, res) => {

    const tenantId = (req as any).tenantId; 

    if (!tenantId) {
        return res.status(401).json({ error: 'Tenant ID missing from token.' });
    }

    try {

        const tenant = await prisma.tenant.findUnique({
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


        const results = await analyticsFunc(shopifyDomain, accessToken);
        

        res.json({ metrics: results });

    } catch (error) {
        console.error('Error fetching metrics or tenant credentials:', error);
        res.status(500).json({ error: 'Failed to retrieve analytics data.' });
    }
});


export default router;