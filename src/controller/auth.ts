import prisma from '../db';
import 'dotenv/config';
import { storeCustomerData, storeOrderData,storeProductData } from '../shopify/storeData';
import {
    fetchProducts,
    fetchCustomers,
    fetchOrders,
} from '../shopify/index';

import jwt from 'jsonwebtoken';

type SignupInput = {
    email: string;
    shopifyDomain: string;
    accessToken: string;
    password: string;
};

export const signupService = async ({ email,password,shopifyDomain, accessToken }: SignupInput) => {
    // create tenant
    const tenant = await prisma.tenant.create({
        data: {
            password,
            email,
            shopifyDomain,
            accessToken,
        },
    });

    const tenantId = tenant.id;

    //create jwt token for the tenant
    const token = jwt.sign({
        tenantId: tenant.id,
    }, process.env.JWT_SECRET!)

    // fetch data from Shopify for this tenant
    const [products, customers, orders] = await Promise.all([
        fetchProducts(shopifyDomain, accessToken),
        fetchCustomers(shopifyDomain, accessToken),
        fetchOrders(shopifyDomain, accessToken),
    ]);

    if(!products || !customers || !orders) {
        throw new Error('Failed to fetch data from Shopify');
    }

    // store data in the database
    await Promise.all([
        storeProductData(tenantId, products),
        storeCustomerData(tenantId, customers),
        storeOrderData(tenantId, orders),
    ]);
    

    return tenant;
};


export const signinService = async (email: string, password: string) => {
    try{
        const tenant = await prisma.tenant.findUnique({
            where: { email },
        });
        if (!tenant || tenant.password !== password) {
            throw new Error('Invalid email or password');
        }
        const token = jwt.sign({
            tenantId: tenant.id,
        }, process.env.JWT_SECRET!);
        return { tenant, token };
    } catch (error) {
        console.log('Signin error:', error);
        throw new Error('Signin failed');
    }
};


