# 🚀 Flowbit – Multi-Tenant Workflow Management App

 It is a full-stack multi-tenant ticketing application built using React, Node.js, MongoDB, and integrated with **n8n** for workflow automation. It demonstrates secure tenant isolation, role-based access control, and modern frontend/backend practices.

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Vite
- **Backend**: Express.js, Node.js, MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Workflow Automation**: n8n (via Docker)
- **Containerization**: Docker (structure ready)

---

## 🔐 Features

### ✅ Authentication & Authorization

- Sign Up / Sign In with JWT
- Roles: `admin`, `user`
- Each user has a `customerId` to isolate tenants
- Middleware enforces role and tenant access

### 🎟️ Ticket Management

- Admins can create support tickets
- Tickets are linked to the admin’s tenant (`customerId`)
- Stored in MongoDB

### 🔁 n8n Integration

- n8n listens via Webhook
- When triggered, it updates the status of tickets in DB

---

## 📁 Project Structure

flowbit-app/
├── api/ # Express backend APIs and middleware
│ ├── routes/
│ ├── models/
│ ├── auth.js
│ └── index.js
├── react-shell/ # React + Tailwind frontend shell
├── n8n/ # n8n (Dockerized workflow engine)
└── README.md # You're here!


---

## 🚀 Getting Started

### 🔧 Backend (API)
```bash
cd api
npm install
npm run dev

💻 Frontend (React)

cd react-shell
npm install
npm run dev

🐳 Run n8n with Docker

docker run -it --rm \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

📦 Environment Variables

Create a .env file in api/:

PORT=5000
MONGO_URI=mongodb://localhost:27017/flowbit
JWT_SECRET=your_jwt_secret

🧪 Test Users
✅ Admin

{
  "email": "admin@tenant1.com",
  "password": "admin123",
  "role": "admin",
  "customerId": "tenant1"
}





