import prisma from "../db";


export const OutOfStockProducts = async (tenantId: string, limit = 5) => {
    try{
        const outOfStockProducts = await prisma.product.findMany({
    where: { tenantId, status: "inactive" },
   
    take: limit,
    select: {
      title: true,
      price: true,
      status: true,
      tags: true,
    }
  });
  console.log('Out of Stock Products:', outOfStockProducts);
    return outOfStockProducts;
    }catch(err){
        console.error('Error fetching out of stock products', err);
    }
 
};


export const totalAvailableProduct = async (tenantId: string) => {
    try{
        const count = await prisma.product.count({
            where: { tenantId }
        });
        return count;
    }catch(err){
        console.error('Error counting products', err);
    }   
};

export const topSoldProducts = async (tenantId: string, limit = 5) => {
    try {
        
        const result = await prisma.order.groupBy({
            by: ['itemName'],
            where: { tenantId },
            _sum: {
                quantity: true
            },
            orderBy: {
                _sum: {
                    quantity: 'desc'
                }
            },
            take: limit
        }); 
        return result.map(item => ({
            name: item.itemName,
            quantitySold: item._sum.quantity || 0,
        }));
    } catch(err){
        console.error('Error fetching top sold products', err);
    }
};