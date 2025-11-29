# Employee Leave Management System

A comprehensive Employee Leave Management System built with modern web technologies. This system allows employees to apply for leave and managers to approve/reject requests with a clean, responsive UI.

## Features

### Employee Features

- User registration and authentication
- Apply for different types of leave (sick, casual, vacation)
- View personal leave balance
- See status of submitted requests
- Cancel pending leave requests
- Responsive dashboard with statistics

### Manager Features

- View all employee leave requests
- Approve or reject leave requests
- Filter and search requests
- Dashboard with team statistics
- Pagination for large datasets

### Technical Features

- Role-based access control
- JWT authentication
- RESTful API design
- MongoDB with Mongoose ORM
- Responsive UI with Tailwind CSS
- State management with Zustand
- Form validation and error handling
- Loading states and user feedback
- Vercel deployment ready

## Tech Stack

### Frontend

- React 18
- Zustand (State Management)
- Tailwind CSS (Styling)
- React Router v6
- Axios (HTTP Client)
- Heroicons (Icons)

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (Authentication)
- Bcrypt.js (Password Hashing)
- Dotenv (Environment Variables)

### Deployment

- Vercel (Frontend & Backend)

## Project Structure

```
employee-leave-management/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # Zustand stores
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── server/                 # Node.js backend
│   ├── controllers/        # Request handlers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── server.js           # Entry point
│   └── package.json        # Backend dependencies
├── vercel.json             # Vercel deployment configuration
└── README.md               # Project documentation
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Environment Variables

#### Backend (.env in server/)

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

#### Frontend (.env in client/)

```env
VITE_API_URL=http://localhost:5000/api
```

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd employee-leave-management
```

2. Install backend dependencies:

```bash
cd server
npm install
```

3. Install frontend dependencies:

```bash
cd ../client
npm install
```

### Running the Application

#### Development Mode

1. Start the backend server:

```bash
cd server
npm run dev
```

2. Start the frontend development server:

```bash
cd client
npm run dev
```

3. Seed the database with initial data:

```bash
cd server
npm run seed
```

#### Production Mode

1. Build the frontend:

```bash
cd client
npm run build
```

2. Start the backend server:

```bash
cd server
npm start
```

## Default Credentials

### Manager Account

- Email: manager@company.com
- Password: Manager@123

### Sample Employee Accounts

- Email: john.doe@company.com
- Password: Employee@123

Additional sample employees are created during seeding.

## API Documentation

### Authentication Routes

- `POST /api/auth/register` - Register a new employee
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Employee Leave Routes

- `POST /api/leaves` - Apply for leave
- `GET /api/leaves/my-requests` - Get own leave requests
- `DELETE /api/leaves/:id` - Cancel a leave request
- `GET /api/leaves/balance` - Get leave balance

### Manager Leave Routes

- `GET /api/leaves/all` - Get all leave requests
- `GET /api/leaves/pending` - Get pending leave requests
- `PUT /api/leaves/:id/approve` - Approve a leave request
- `PUT /api/leaves/:id/reject` - Reject a leave request

### Dashboard Routes

- `GET /api/dashboard/employee` - Get employee dashboard data
- `GET /api/dashboard/manager` - Get manager dashboard data

## Deployment to Vercel

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

## Testing Checklist

Before submission, test:

- [x] Employee can register and login
- [x] Manager can login with default credentials
- [x] Employee can apply for leave with validations
- [x] Employee cannot apply for past dates
- [x] Employee cannot apply for weekends
- [x] Employee cannot apply when insufficient balance
- [x] Employee can view their requests
- [x] Employee can cancel pending requests only
- [x] Manager can view all pending requests
- [x] Manager can approve leaves (balance deducts)
- [x] Manager can reject leaves (balance remains same)
- [x] Dashboard stats are accurate
- [x] Logout works properly
- [x] Protected routes redirect to login
- [x] Responsive on mobile devices

## Screenshots

_(Placeholder for screenshots - add actual screenshots when available)_

1. Login Page
2. Employee Dashboard
3. Leave Application Form
4. Manager Dashboard
5. Pending Requests View

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email [your-email@example.com] or open an issue in the repository.
# Employee-Leave-Management
# Leave-Management
