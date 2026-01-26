# SmartWorkshop Management System
**Smart Vehicle Service Marketplace – Final Year Project**

## 📌 Overview
The **SmartWorkshop Management System** is a role-based digital marketplace designed to improve transparency and coordination between **customers** and **independent automotive workshops** in the UK.

Developed as a **BSc Computer Science Final Year Project**, the system demonstrates the feasibility of a secure, workflow-oriented service platform using modern backend practices.

---

## 🎯 Key Features
- Secure authentication (JWT + bcrypt)
- Role-Based Access Control (Customer, Mechanic, Admin)
- Structured workflows:
  - Service Requests
  - Quotations
  - Job creation and tracking
- Relational database design aligned with ERD
- Dockerised MySQL with phpMyAdmin
- End-to-end “happy path” fully implemented

---

## 🏗️ Architecture
- **Backend:** Node.js + Express
- **Database:** MySQL 8 (Docker)
- **Infrastructure:** Docker Compose, phpMyAdmin
- **Design:** Three-tier architecture (Presentation, Application, Data)

> Directus was intentionally **not used** due to time and scope constraints. All functionality is implemented via a custom backend to ensure clarity and evaluability.

---

## 🔐 Roles
- **Customer:** Create service requests, review quotations, track jobs
- **Mechanic:** Submit quotations, update job status
- **Admin:** Platform oversight

---

## 🔁 Core Workflow
1. Customer logs in and creates a service request  
2. Mechanic submits a quotation  
3. Customer accepts a quotation  
4. System creates a job automatically  
5. Mechanic updates job status  
6. Customer views progress and completion  

---
