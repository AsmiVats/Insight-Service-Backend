import prisma from "../db";



export const totalOrdersCount = async (tenantId: string) => {
    try{
        const count = await prisma.order.count({    
            where: { tenantId }
        });
        return count;
    }catch(err){
        console.error('Error counting orders', err);
    }
};

export const totalRevenue = async (tenantId: string) => {
    try{
        const result = await prisma.order.aggregate({
            where: { tenantId },
            _sum: {
                amount: true
            }
        });

        const orders = await prisma.order.findMany({
            where: { tenantId }
        });
        console.log(orders);
        return result._sum.amount || 0;
    }catch(err){
        console.error('Error calculating total revenue', err);
    }
};


interface DailyRevenue {
    date: string; 
    revenue: number;
}
export const rangeRevenue = async (tenantId: string, startDate: Date, endDate: Date): Promise<DailyRevenue[]> => {
    try {
        const result = await prisma.$queryRaw<DailyRevenue[]>`
            SELECT
                DATE("createdAt") AS date,
                SUM(amount) AS revenue
            FROM "Order"
            WHERE "tenantId" = ${tenantId}
              AND "createdAt" >= ${startDate}::date
              AND "createdAt" <= ${endDate}::date
            GROUP BY date
            ORDER BY date ASC;
        `;


        const parsedResult = result.map(item => ({
            date: item.date,
            revenue: parseFloat(item.revenue.toString()), 
        }));
        
        return parsedResult;

    } catch (err) {
        console.error('Error calculating daily grouped revenue', err);
        throw new Error('Failed to fetch daily revenue data.');
    }
};