# <img src="./public/images/favicon.jpg" width="40" height="40" valign="middle"> MetroSync — PROJECT 300

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Backend-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**MetroSync** is a modern, web-based academic collaboration and scheduling platform designed specifically for **Metropolitan University, Bangladesh**. It streamlines the academic workflow by connecting students, faculty, and administration through a unified, role-based ecosystem.

---

## 🎓 Academic Context
**Institution:** Metropolitan University, Bangladesh  
**Department:** Computer Science and Engineering (CSE)  
**Session:** Spring 2026  
**Course:** PROJECT 300  

### 👥 The Team
| Name | ID | Role |
| :--- | :--- | :--- |
| **Nahidul Islam Rony** | 231-115-069 | Lead Developer / Backend |
| **Abu Ubayda** | 231-115-080 | Lead Developer / UI-UX |

---

## ✨ Key Features
MetroSync simplifies university life through specific tools for every user level:
* **📅 Smart Scheduling:** Dynamic class routines and task tracking.
* **📢 Centralized Notices:** Role-specific announcements and pinned department updates.
* **🔐 RBAC (Role-Based Access Control):** Secure dashboards tailored to Students, CRs, Teachers, HODs, and Admins.
* **📊 Administrative Tools:** Teacher assignments, course management, and exportable CSV reports.

---

## 🛠 Tech Stack
* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Backend/Database:** Firebase (Auth, Firestore, Storage)
* **Deployment:** Vercel

---

## 🗺 Project Roadmap (Sprints)

| ID | Feature | Assignee | Deadline |
| :--- | :--- | :--- | :--- |
| **N-1** | Authentication & Security | Rony | 31/08/2026 |
| **A-1** | Student Dashboards & Logic | Ubayda | 31/08/2026 |
| **N-2** | Teacher Course Management | Rony | 07/09/2026 |
| **N-3** | HOD Controls & Teacher Assignment | Rony | 05/10/2026 |
| **A-4** | Student Task Timeline | Ubayda | 26/10/2026 |
| **N-5** | Data Export (CSV) & Analytics | Rony | 02/11/2026 |

---

## 🚀 Getting Started

### 🔗 Live Access
The project is deployed and can be accessed live at:  
**[https://metrosync-eta.vercel.app](https://metrosync-eta.vercel.app)**

---

📂 Project Structure:

├── app/              # Next.js App Router (Pages & Layouts)
├── components/       # Reusable UI Components
├── utils/            # Helper functions & Middleware
├── public/           # Static assets (Images, Icons)
├── lib/              # Firebase configuration
└── types/            # TypeScript interfaces

✅ Quality Assurance & Acceptance:

[x] Security: Auth middleware protection for all private routes.

[x] Integrity: Role-based data leakage prevention.

[x] UX: Fully responsive design for mobile and desktop.

[x] Performance: Optimized image loading and server-side rendering.

📄 License

This project is part of an academic course. Please consult with the Department of CSE, Metropolitan University regarding licensing and redistribution.

Maintained by Abu Ubayda & Nahidul Islam Rony
