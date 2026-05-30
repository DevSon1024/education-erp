# 🎓 Smart Institute - Enterprise Education ERP

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=flat-square&logo=react)
![Status](https://img.shields.io/badge/Status-Transitioned_to_Maintenance-orange?style=flat-square)
![Live](https://img.shields.io/badge/Live_Portal-Active-success?style=flat-square)

An enterprise-grade Student Management Dashboard and Education ERP system. This platform streamlines administrative operations, student portals, fee management, and visitor inquiries. 

🔗 **Live Web Portal:** [smartinstituteonline.com](https://smartinstituteonline.com)

## > Project Overview & Status

**Status:** Phase 1 Complete / Transitioned.

This repository represents the core modernization of the Smart Institute platform. The project involved a comprehensive architectural migration of a legacy `.NET` codebase into a highly scalable **MERN stack** (MongoDB, Express.js, React, Node.js) ecosystem. 

*Note: I successfully architected and developed the application from its base to approximately 80% completion. The active development phase has concluded on my end, and current feature ownership, deployment, and ongoing maintenance have been officially handed over to the core team/another developer.*

## > Key Technical Contributions

During the primary development phase, the following architectural milestones and optimizations were implemented:

* **Legacy System Migration:** Successfully decoupled and migrated the enterprise student dashboard from a legacy `.NET` environment to a modern, decoupled MERN architecture.
* **Frontend Performance Optimization:** Implemented **React lazy loading** and code-splitting to drastically reduce initial bundle size and time-to-interactive (TTI).
* **Network Efficiency:** Engineered **API request debouncing** for complex search inputs (students, employees) to minimize server load and prevent database bottlenecking.
* **Security & Stability:** Integrated strict **rate-limiting strategies** on the backend to protect authentication and inquiry routes from brute-force or DDoS vectors.
* **Asset Management Pipeline:** Architected a robust media delivery system using **Cloudinary**, automating the optimization and caching of profile images, institute galleries, and study materials.
* **UI/UX Architecture:** Enforced a strict **mobile-first responsive design approach** across all React components using Tailwind CSS, ensuring optimal performance and usability on lower-end mobile devices before scaling up to desktop dashboards.
* **Communication Automation:** Integrated SMS API services to automate transactional notifications for student admissions and fee receipts.

## 🛠️ Technology Stack

**Frontend:**
* React.js (Vite)
* Redux Toolkit (State Management for Auth, Employees, Students, Transactions)
* Tailwind CSS (Mobile-first utility styling)
* PostCSS

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose (Complex indexing and aggregation pipelines)
* JWT Authentication & Role-Based Access Control (RBAC)

**Integrations:**
* Cloudinary (Image/Asset Pipeline)
* Third-party SMS Gateway 

## > Core Modules

1.  **Role-Based Access (User Rights):** Dynamic, template-driven permission middleware restricting access based on employee roles.
2.  **Student Portal:** End-to-end lifecycle management including admissions, attendance tracking, exam scheduling, and results.
3.  **Financial Dashboard:** Comprehensive fee collection, receipt generation, and ledger reporting.
4.  **Inquiry & Visitor Management:** Tracking for offline and online inquiries, follow-up DSR (Daily Sales Reports), and front-desk visitor logs.
5.  **Master Records:** Management for branches, courses, batches, subjects, and study materials.

## > Local Installation & Setup

If you are a new developer onboarding to this project, follow these steps to run the environment locally:

### Prerequisites
* Node.js (v16+ recommended)
* MongoDB (Local or Atlas URI)
* Cloudinary Account Credentials

### 1. Clone the repository
```bash
git clone https://github.com/your-username/education-erp.git
cd education-erp

```

### 2. Backend Setup

```bash
cd backend
npm install

```

*Create a `.env` file in the `/backend` directory based on `.env.example` and populate your database and Cloudinary keys.*

```bash
npm run dev

```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

```

*Create a `.env` file in the `/frontend` directory based on `.env.example`.*

```bash
npm run dev

```

## > Primary Author (Migration & Foundation)

* **Devson** - *Lead Full-Stack Developer (Base to v0.8)* * *Current maintenance and v1.0+ feature implementations are managed by the Smart Institute internal team.*
