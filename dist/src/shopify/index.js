"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsFunc = void 0;
exports.fetchProducts = fetchProducts;
exports.fetchCustomers = fetchCustomers;
exports.fetchOrders = fetchOrders;
const axios = require('axios');
require("dotenv/config");
const SHOPIFY_SHOP = process.env.SHOPIFY_SHOP;
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API_VERSION = '2024-10';
async function fetchProducts(shopifyDomain, accessToken) {
    try {
        // const shopResponse = await axios.get(
        //   `https://${SHOPIFY_SHOP}.myshopify.com/admin/api/${API_VERSION}/shop.json`,
        //   {
        //     headers: {
        //       'X-Shopify-Access-Token': ACCESS_TOKEN,
        //       'Content-Type': 'application/json',
        //     },
        //   }
        // );
        // console.log('Shop connection successful:', shopResponse.data.shop.name);
        const productsResponse = await axios.get(`https://${shopifyDomain}.myshopify.com/admin/api/${API_VERSION}/products.json`, {
            headers: {
                'X-Shopify-Access-Token': accessToken,
                'Content-Type': 'application/json',
            },
        });
        const products = productsResponse.data.products;
        // console.log('Products:', products);
        return products;
    }
    catch (error) {
        console.error('Error:', error.response?.status, error.response?.data || error.message);
    }
}
;
async function fetchCustomers(shopifyDomain, accessToken) {
    try {
        const response = await axios.get(
        // `https://${shopifyDomain}.myshopify.com/admin/api//customers.json`,
        `https://${shopifyDomain}.myshopify.com/admin/api/${API_VERSION}/customers.json?fields=id,email,first_name,last_name,phone,created_at,orders_count,total_spent`, {
            headers: {
                'X-Shopify-Access-Token': accessToken,
                'Content-Type': 'application/json',
            },
        });
        return response.data.customers;
    }
    catch (error) {
        console.error('Error:', error.response?.status, error.response?.data || error.message);
    }
}
;
async function fetchOrders(shopifyDomain, accessToken) {
    try {
        const response = await axios.get(`https://${shopifyDomain}.myshopify.com/admin/api/${API_VERSION}/orders.json`, {
            headers: {
                'X-Shopify-Access-Token': accessToken,
                'Content-Type': 'application/json',
            },
        });
        return response.data.orders;
    }
    catch (error) {
        console.error('Error:', error.response?.status, error.response?.data || error.message);
    }
}
;
// Get abandoned checkouts (Cart/Checkout Abandoned)
const analyticsFunc = async (shopifyDomain, accessToken) => {
    const abandonedCheckouts = await fetch(`https://${shopifyDomain}.myshopify.com/admin/api/2024-10/checkouts.json?status=open`, {
        method: 'GET',
        headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json'
        }
    });
    // Get completed orders (Purchase Completed)
    const completedOrders = await fetch(`https://${shopifyDomain}.myshopify.com/admin/api/2024-10/orders.json?status=any&financial_status=paid`, {
        method: 'GET',
        headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json'
        }
    });
    const checkouts = await abandonedCheckouts.json();
    const orders = await completedOrders.json();
    // Calculate metrics
    const analytics = {
        cartAbandoned: checkouts.checkouts.length,
        checkoutStarted: checkouts.checkouts.length,
        purchaseCompleted: orders.orders.length
    };
    console.log(analytics);
    return analytics;
};
exports.analyticsFunc = analyticsFunc;
