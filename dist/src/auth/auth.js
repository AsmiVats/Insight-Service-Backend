"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinService = exports.signupService = void 0;
const db_1 = __importDefault(require("../db"));
require("dotenv/config");
const storeData_1 = require("../shopify/storeData");
const index_1 = require("../shopify/index");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signupService = async ({ email, password, shopifyDomain, accessToken }) => {
    // create tenant
    const tenant = await db_1.default.tenant.create({
        data: {
            password,
            email,
            shopifyDomain,
            accessToken,
        },
    });
    const tenantId = tenant.id;
    //create jwt token for the tenant
    const token = jsonwebtoken_1.default.sign({
        tenantId: tenant.id,
        shopifyDomain: tenant.shopifyDomain,
    }, process.env.JWT_SECRET);
    // fetch data from Shopify for this tenant
    const [products, customers, orders] = await Promise.all([
        (0, index_1.fetchProducts)(shopifyDomain, accessToken),
        (0, index_1.fetchCustomers)(shopifyDomain, accessToken),
        (0, index_1.fetchOrders)(shopifyDomain, accessToken),
    ]);
    if (!products || !customers || !orders) {
        throw new Error('Failed to fetch data from Shopify');
    }
    // store data in the database
    await Promise.all([
        (0, storeData_1.storeProductData)(tenantId, products),
        (0, storeData_1.storeCustomerData)(tenantId, customers),
        (0, storeData_1.storeOrderData)(tenantId, orders),
    ]);
    return tenant;
};
exports.signupService = signupService;
const signinService = async (email, password) => {
    try {
        const tenant = await db_1.default.tenant.findUnique({
            where: { email },
        });
        if (!tenant || tenant.password !== password) {
            throw new Error('Invalid email or password');
        }
        const token = jsonwebtoken_1.default.sign({
            tenantId: tenant.id,
            shopifyDomain: tenant.shopifyDomain,
        }, process.env.JWT_SECRET);
        return { tenant, token };
    }
    catch (error) {
        throw new Error('Signin failed');
    }
};
exports.signinService = signinService;
