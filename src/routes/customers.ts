import { Response, Router,Request } from "express";
import authMiddleware from "../middleware";
import { getTopCustomers, totalCustomersCount } from "../controller/customers";

const router = Router();

router.get('/topcustomers',authMiddleware, async (req:Request, res:Response) => {
    const tenantId = req.tenantId;
    const result = getTopCustomers(tenantId!);
    res.json(result);
});


router.get('/totalcount',authMiddleware, async (req:Request, res:Response) => {
    const tenantId = req.tenantId;
    const result = await totalCustomersCount(tenantId!);
    res.json(result);
});
export default router;
   