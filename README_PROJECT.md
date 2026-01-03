# 🚀 Dayflow HRMS - Complete Project

## 📁 Project Structure

```
v0-dayflow-hrms-frontend/
├── backend/                    ← Backend API (Express.js)
│   ├── models/                ← MongoDB Schemas
│   ├── routes/                ← API Endpoints
│   ├── middleware/            ← Authentication
│   ├── config/                ← Database Config
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── app/                       ← Frontend Pages (Next.js)
├── components/                ← React Components
├── lib/                       ← Services & Types
├── package.json
└── .env.local
```

---

## 🚀 Quick Start

### **Terminal 1 - Backend**
```powershell
cd backend
npm install
npm run dev
```
**Runs on**: http://localhost:5000

### **Terminal 2 - Frontend**
```powershell
# From project root
npm run dev
```
**Runs on**: http://localhost:3000

---

## 🗄️ Database

**Database Name**: `dayflow`

**Connection**: MongoDB local on `mongodb://localhost:27017/dayflow`

**Collections** (auto-created):
- users
- employeeprofiles
- attendances
- leaverequests
- salaries

---

## ✅ Test Account

1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill form:
   ```
   Employee ID: EMP001
   Email: test@example.com
   Password: password123
   ```
4. Login and test features!

---

## 📚 Features

✅ User Authentication (Login/Register)
✅ Employee Dashboard
✅ Check-in/Check-out
✅ Leave Requests
✅ Salary Information
✅ Admin Approvals
✅ Role-based Access

---

## 🛠️ Tech Stack

**Backend**: Node.js, Express, MongoDB, JWT
**Frontend**: Next.js, React, TypeScript, Tailwind CSS
**Database**: MongoDB (local or Atlas)

---

**Everything is ready to run!** 🎉
