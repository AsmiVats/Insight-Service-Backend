import { Response, Router,Request } from "express";
import authMiddleware from "../middleware";
import { getTopCustomers, revenueByCustomer, topCountries, totalCustomersCount } from "../controller/customers";

const router = Router();

router.get('/topcustomers',authMiddleware, async (req:Request, res:Response) => {
    const tenantId = req.tenantId;
    const result = await getTopCustomers(tenantId!);
    res.json({result});
});


router.get('/totalcount',authMiddleware, async (req:Request, res:Response) => {
    const tenantId = req.tenantId;
    const result = await totalCustomersCount(tenantId!);
    res.json({totalCustomers: result});
});

router.get('/revenuebycustomer',authMiddleware, async (req:Request, res:Response) => {
    const tenantId = req.tenantId;
    const customerEmail = req.query.email as string;
    const result = await revenueByCustomer(tenantId!, customerEmail);
    res.json({ customerEmail, revenue: result });
});

router.get('/topcountries',authMiddleware, async (req:Request, res:Response) => {
    const tenantId = req.tenantId;
    const result = await topCountries(tenantId!);
    res.json({result});
});
export default router;
   