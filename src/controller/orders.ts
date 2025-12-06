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
        return result._sum.amount || 0;
    }catch(err){
        console.error('Error calculating total revenue', err);
    }
};


export const rangeRevenue = async (tenantId: string, startDate: Date, endDate: Date) => {
    try{
        const result = await prisma.order.aggregate({   
            where: { 
                tenantId,
                createdAt: {gte: startDate, lte: endDate}
            },
            _sum: {
                amount: true
            }
        });
        return result._sum.amount || 0;
    }catch(err){
        console.error('Error calculating range revenue', err);
    }
};