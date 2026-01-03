# Backend Integration Guide

## ✅ Setup Complete!

Your Next.js frontend is now configured to connect with your Node.js/MongoDB backend.

---

## 📁 Files Created

### 1. **Type Definitions** (`lib/types/index.ts`)
- TypeScript interfaces for all your backend models
- User, Salary, LeaveRequest, EmployeeProfile, Attendance
- API response types

### 2. **API Client** (`lib/api-client.ts`)
- Centralized API configuration
- Handles authentication (Bearer token)
- Fetch wrapper with error handling
- HTTP methods: GET, POST, PUT, DELETE, PATCH

### 3. **Service Files** (in `lib/services/`)
- **auth.ts** - Login, logout, register, get current user
- **leave.ts** - Leave requests (create, update, approve, reject)
- **salary.ts** - Salary info, payslips
- **attendance.ts** - Check-in/out, attendance records
- **index.ts** - Export all services

### 4. **Environment Configuration** (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
Change `5000` to your actual backend port

---

## 🚀 How to Use

### 1. **Login Example**
```typescript
import { authService } from "@/lib/services";

const handleLogin = async (email: string, password: string) => {
  try {
    const response = await authService.login({ email, password });
    console.log("Logged in as:", response.user.email);
    // Token is automatically saved to localStorage
  } catch (error) {
    console.error("Login failed:", error);
  }
};
```

### 2. **Get Employee Profile**
```typescript
import { employeeService } from "@/lib/services";

const loadProfile = async (userId: string) => {
  const profile = await employeeService.getProfile(userId);
  console.log(profile.fullName, profile.department);
};
```

### 3. **Submit Leave Request**
```typescript
import { leaveService } from "@/lib/services";

const requestLeave = async () => {
  const leave = await leaveService.createLeave({
    leaveType: "Paid",
    startDate: "2024-01-15",
    endDate: "2024-01-20",
    remarks: "Vacation"
  });
};
```

### 4. **Check-In/Out**
```typescript
import { attendanceService } from "@/lib/services";

// Check in
const checkIn = await attendanceService.checkIn();

// Check out
const checkOut = await attendanceService.checkOut();
```

### 5. **Get Salary Info**
```typescript
import { salaryService } from "@/lib/services";

const salary = await salaryService.getMySalary();
console.log("Net Salary:", salary.netSalary);
```

---

## 🔧 Configuration

### Backend URL
Edit `.env.local` to match your backend:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### For Production
Change to your production backend URL:
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## 📝 Backend Requirements

Your backend should have these endpoints:

### Authentication
- `POST /api/auth/login` - Returns `{ token, user }`
- `POST /api/auth/register`
- `GET /api/auth/me` - Returns current user (requires auth)
- `POST /api/auth/logout`

### Users
- `GET /api/users` - Get all users (paginated)
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Employee Profile
- `GET /api/employees/profile/:userId` - Get employee profile
- `PUT /api/employees/profile/:userId` - Update profile
- `POST /api/employees/profile/:userId/picture` - Upload profile picture
- `GET /api/employees` - Get all employees (paginated)

### Leave Requests
- `GET /api/leaves/my-requests` - Get user's leave requests
- `GET /api/leaves` - Get all leaves (admin)
- `GET /api/leaves/:id` - Get specific leave
- `POST /api/leaves` - Create leave request
- `PUT /api/leaves/:id` - Update leave request
- `PUT /api/leaves/:id/approve` - Approve leave (admin)
- `PUT /api/leaves/:id/reject` - Reject leave (admin)
- `DELETE /api/leaves/:id` - Delete leave request

### Salary
- `GET /api/salary/my-salary` - Get current user's salary
- `GET /api/salary/:employeeId` - Get employee salary (admin)
- `GET /api/salary` - Get all salaries (paginated, admin)
- `PUT /api/salary/:employeeId` - Update salary (admin)
- `GET /api/salary/payslips/my-payslips` - Get current user's payslips
- `GET /api/salary/payslips/:employeeId` - Get employee payslips (admin)
- `POST /api/salary/payslips/generate` - Generate payslip (admin)

### Attendance
- `GET /api/attendance/today` - Get today's attendance
- `POST /api/attendance/check-in` - Check in
- `POST /api/attendance/check-out` - Check out
- `GET /api/attendance/my-records` - Get user's attendance (paginated)
- `GET /api/attendance/:employeeId` - Get employee attendance (admin)
- `GET /api/attendance` - Get all attendance (admin, paginated)
- `GET /api/attendance/summary` - Get attendance summary

---

## 🔐 Authentication

The API client automatically:
1. Reads the auth token from `localStorage`
2. Adds it to every request as: `Authorization: Bearer <token>`
3. Stores the token after login

You need to handle logout and clear the token:
```typescript
import { authService } from "@/lib/services";

authService.logout(); // Clears token from localStorage
```

---

## ⚠️ Important Notes

1. **CORS Configuration**: Your backend needs to allow requests from `http://localhost:3000` (dev) and your production domain
   ```javascript
   // In your backend
   app.use(cors({
     origin: ["http://localhost:3000", "https://yourdomain.com"],
     credentials: true
   }));
   ```

2. **Error Handling**: All service methods throw errors on failure
   ```typescript
   try {
     await leaveService.createLeave(...);
   } catch (error) {
     console.error(error.message);
   }
   ```

3. **Loading States**: Use loading/error states in your components (see `example-integration.tsx`)

4. **Token Expiration**: Implement token refresh logic if your backend uses JWT with expiration

---

## 🎯 Next Steps

1. Update `.env.local` with your backend URL
2. Make sure your backend is running
3. Update existing components to use the services
4. Test each endpoint with real data
5. Implement error handling and user feedback

---

## 📚 Example Component

Check `components/example-integration.tsx` for a complete working example!

