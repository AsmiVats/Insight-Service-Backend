import prisma from "../db";


const storeProductData = async (tenantId: string, products: any[]) => {
     // store products
    await Promise.all(
        products.map(async (p: any) => {
            try {
                const shopifyProductId = String(p.id);
                //if not present will create if changes will update
                await prisma.product.upsert({
                    where: { shopifyProductId },
                    update: {
                        title: p.title ?? '',
                        status: p.status ?? '',
                        createdAt: p.created_at,
                        updatedAt: p.updated_at,
                        price: p.variants?.[0]?.price,
                        tags: Array.isArray(p.tags)
                            ? p.tags
                            : typeof p.tags === 'string'
                                ? p.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
                                : [],
                    },
                    create: {
                        shopifyProductId,
                        tenantId,
                        title: p.title ?? '',
                        status: p.status ?? '',
                        createdAt: p.created_at,
                        updatedAt: p.updated_at,
                        price: p.variants?.[0]?.price,
                        tags: Array.isArray(p.tags)
                            ? p.tags
                            : typeof p.tags === 'string'
                                ? p.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
                                : [],
                    }
                });
            } catch (err) {
                console.error('Failed to insert product', p.id, err);
            }
        })
    );
};


const storeCustomerData = async (tenantId: string, customers: any[]) => {
    // store customers
    const FIRST = ['Ava','Liam','Mia','Ethan','Zoe','Noah','Luna','Lucas'];
const LAST = ['Sharma','Patel','Smith','Johnson','Khan','Garcia','Lee','Brown'];
 const EMAIL = ['ava@example.com','liam@example.com','mia@example.com','ethan@example.com','zoe@example.com','noah@example.com','luna@example.com','lucas@example.com'];
    
    await Promise.all(

        customers.map(async (c:any)=>{
            try{
                const index = Math.floor(Math.random()* FIRST.length);
            const shopifyCustomerId = String(c.id);
                await prisma.customer.upsert({
                    where: { shopifyCustomerId },
                    update: {
                        totalSpent: c.total_spent,
                        orderCount: c.orders_count,
                    },
                    create: {
                        shopifyCustomerId,
                        tenantId,
                        email: c.email ?? EMAIL[index],
                        firstName: c.first_name?? FIRST[index],
                        lastName: c.last_name?? LAST[index],
                        totalSpent: c.total_spent,
                        orderCount: c.orders_count,
                        country: c.default_address?.country ?? 'United States',
                    }
                })
            }catch(err){
                console.error('Failed to insert customer', c.id, err);
            }
        })
    );
};

const storeOrderData = async (tenantId: string, orders: any[]) => {
    // store orders
    await Promise .all(
        orders.map(async (o:any)=>{
            try{
                const shopifyOrderId = String(o.id);
                await prisma.order.upsert({
                    where: { shopifyOrderId },
                    update: {
                        createdAt: o.created_at,
                        amount: o.total_price,
                        displayFinancialStatus: o.financial_status,
                        displayFulfillmentStatus: o.fulfillment_status,
                        itemName: o.line_items[0].name,
                        quantity: o.line_items[0].quantity,
                        customerEmail: o.customer?.email,
                    },
                    create: {
                        shopifyOrderId,
                        tenantId,
                        createdAt: o.created_at,
                        amount: o.total_price,
                        displayFinancialStatus: o.financial_status,
                        displayFulfillmentStatus: o.fulfillment_status,
                        itemName: o.line_items?.[0]?.name ?? '',
                        quantity: o.line_items?.[0]?.quantity ?? 0,
                        customerEmail: o.customer?.email ?? '',
                    }
                })
            }catch(err){
                console.error('Failed to insert order', o.id, err);
            }
        })
    );
};

export {
    storeProductData,
    storeCustomerData,
    storeOrderData,
};