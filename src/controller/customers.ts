import prisma from "../db";


export const getTopCustomers = async (tenantId: string, limit = 5) => {
    try{
        const topCustomers = await prisma.customer.findMany({
    where: { tenantId },
    orderBy: { totalSpent: 'desc' },
    take: limit,
    select: {
      firstName: true,
      lastName: true,
      email: true,
      totalSpent: true
    }
  });
    return topCustomers;
    }catch(err){
        console.error('Error fetching top customers', err);
    }
 
};


export const totalCustomersCount = async (tenantId: string) => {
    try{
        const count = await prisma.customer.count({
            where: { tenantId }
        });
        return count;
    }catch(err){
        console.error('Error counting customers', err);
    }   
};

export const revenueByCustomer = async (tenantId: string, customerEmail: string) => {
    try{
        const result = await prisma.order.aggregate({   
            where: { 
                tenantId,
                customerEmail
            },
            _sum: {
                amount: true
            }
        });
        return result._sum.amount || 0;
    }catch(err){
        console.error('Error calculating revenue by customer', err);
    }
};