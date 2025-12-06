
# **Xeno – Multi-Tenant Shopify Insights Service**

A full-stack system that ingests Shopify store data (customers, orders, products) for multiple tenants and visualizes business insights through an authenticated dashboard.
This project simulates how Xeno onboards enterprise retailers and provides actionable analytics.

---
##  **High-Level Architecture**

```
           Shopify API
                │
                ▼
     Ingestion Service (Node.js / Express)
                │
                ▼
      PostgreSQL (Multi-Tenant Tables)
                │
                ▼
     Protected REST APIs (JWT Auth)
                │
                ▼
        React Insights Dashboard
```
<img width="931" height="373" alt="image" src="https://github.com/user-attachments/assets/09be3158-084a-435e-8d1e-39e90832a49c" />


---
## 🛠️ **Tech Stack**

| Layer                 | Technology                           |
| --------------------- | ------------------------------------ |
| Backend               | Node.js, Express.js, Prisma ORM      |
| Frontend              | React.js                             |
| Database              | PostgreSQL                           |
| Auth                  | JWT                                  |
| Deployment            | Render                               |
| Optional Enhancements | Redis / RabbitMQ for async ingestion |

---
##  **Features**

### **1. Multi-Tenant Architecture**

* Each Shopify store is treated as a **tenant**.
* All ingested data is isolated using a `tenantID`.
* Auth system ensures that users only access their tenant’s data.

### **2. Shopify Data Ingestion**

* Imports **customers**, **orders**, and **products** via Shopify REST Admin API.
* Manual “Update Data” trigger for the assignment.
* Schema structured to support scalable ingestion and analytics.

### **3. Insights Dashboard**

* KPI cards (Total Customers, Total Orders, Revenue).
* Revenue trend charts with date filtering.
* Top 5 high-value customers.
* Clean authentication flow using JWT.

### **4. Production-Ready Foundations**

* Prisma ORM for schema safety & migrations.
* Modular Express architecture.
* Environment-based configuration.
* Deployed backend (Render) and frontend dashboard.

---


## 🧩 **Data Models (Prisma Schema)**

Each model stores `storeId` to enforce tenant isolation.

| Model        | Purpose                       | Key Fields                                                        |
| ------------ | ----------------------------- | --------------------------------------------------------------    |
| **Store**    | Tenant info                   | `id`, `email`, `accessToken`, `shopDomain`,`password`,            |
| **Customer** | Ingested Shopify customers    | `id`, `name`, `email`, `totalSpent`, `tenantId`,`address`,        |
| **Order**    | Shopify orders                | `id`, `createdAt`, `totalPrice`, `tenantId`,`customer`,           |
| **Product**  | Shopify product catalog       | `id`, `title`, `inventoryQuantity`, `tenantId` ,`status`,`amount` |

---

## 🔌 **API Endpoints**

### **Authentication**

| Method | Endpoint           | Description                       |
| ------ | ------------------ | --------------------------------- |
| `POST` | `/api/auth/signup` | Create user + new tenant (Store). |
| `POST` | `/api/auth/signin` | Authenticate and receive JWT.     |

### **Dashboard APIs**

All require `Authorization: Bearer <token>`.
All protected `GET` routes require a JWT bearer token for authentication and are scoped to the authenticated tenant's data.

| Method | Endpoint | Description | Associated Dashboard Insight |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/orders/metrics` | Returns aggregate KPIs: Total Orders, Total Revenue, Total Customers, and Average Order Value (AOV). | **KPIs Section** |
| `GET` | `/api/orders/rangerevenue` | Analyzes order data to provide revenue and order counts over a specific date range (`startDate`, `endDate`). | **Revenue Trend Chart** |
| `GET` | `/api/customers/topcustomers` | Fetches the top 5 customers ranked by their lifetime spend. | **Top 5 Customers by Spend** |
| `GET` | `/api/customers/topcountries` | Aggregates customer data to identify the top countries, often used for geographical analysis charts. | **Customer Geography** |
| `GET` | `/api/products/totalavailable` | Returns the total count of products that are currently in stock. | **Total Available Products** |
| `GET` | `/api/products/outofstock` | Returns a list of all products (or variants) that have an inventory quantity of zero. | **Out of Stock Products List** |
| `GET` | `/api/products/topsold` | Returns a list of the top-selling products, ranked by unit volume sold. | **Top Sold Items** |




### **Ingestion**

| Method | Endpoint           | Description                                        |
| ------ | ------------------ | -------------------------------------------------- |
| `POST` | `/api/update` | Manually sync Shopify customers, orders, products. |

---

## 📌 **Assumptions**

1. **Synchronous ingestion** for demo purposes (sufficient for dev stores).
2. One primary user per Store during onboarding.
3. Shopify product schema simplified (omits variants & metafields).

---

## ⚠️ **Limitations & Next Steps for Production**

| Area               | Improvement                               | Benefit                                                   |
| ------------------ | ----------------------------------------- | --------------------------------------------------------- |
| **Data Sync**      | Implement Shopify Webhooks                | Real-time updates without polling                         |
| **Scalability**    | Add async job queue (Redis/RabbitMQ)      | Prevents rate-limit issues, improves ingestion throughput |
| **Data Freshness** | Delta sync instead of full re-ingest      | Faster ingestion & reduced API load                       |
| **Monitoring**     | Add structured logging + health checks    | Better debugging & reliability                            |
| **Security**       | Store Shopify tokens in a secrets manager | Protect tenant credentials                                |

---

## ⚙️ **Setup Instructions**

### **1. Clone the Repository**

```bash
git clone <REPO_URL>
cd <REPO_NAME>
```

### **2. Configure Environment Variables**

Create a `.env` file:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME"
JWT_SECRET="your_jwt_secret"


```

### **3. Install Dependencies**

```bash
npm install
```

### **4. Run Prisma Migrations**

```bash
npx prisma migrate dev --name init
```

### **5. Start the Server**

```bash
npm run build
npm run start
```

---

## 🌐 **Repositories**

### **Backend**

[https://github.com/AsmiVats/Insight-Service-Backend](https://github.com/AsmiVats/Insight-Service-Backend)

### **Frontend**

[https://github.com/AsmiVats/-Insights-Service-](https://github.com/AsmiVats/-Insights-Service-)

---
