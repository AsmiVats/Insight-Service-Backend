"use strict";
// Get abandoned checkouts (Cart/Checkout Abandoned)
const abandonedCheckouts = await fetch(`https://asmi-9843.myshopify.com/admin/api/2024-10/checkouts.json?status=open`, {
    method: 'GET',
    headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
    }
});
// Get completed orders (Purchase Completed)
const completedOrders = await fetch(`https://asmi-9843.myshopify.com/admin/api/2024-10/orders.json?status=any&financial_status=paid`, {
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
    checkoutStarted: checkouts.checkouts.length, // Checkouts created
    purchaseCompleted: orders.orders.length
};
console.log(analytics);
