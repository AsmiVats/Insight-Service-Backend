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
      totalSpent: true,
    }
  });
  console.log('Top Customers:', topCustomers);
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



export const topCountries = async (tenantId: string, limit = 5) => {
    try {
     
        const result = await prisma.customer.groupBy({
            by: ['country'],
            where: { tenantId },
            _count: {
                country: true
            },
            orderBy: {
                _count: {
                    country: 'desc'
                }
            },
            take: limit
        });
        
 
        const formattedResult = result.map(item => ({
            name: item.country,           
            count: item._count.country    
        }));


        return formattedResult;

    } catch (err) {
        console.error('Error fetching top countries', err);
        throw new Error('Failed to fetch top countries data.');
    }
};