# AFCF Backend API

TypeScript-based REST API server for the Agricultural Finance Coordination Framework.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment:**
   ```bash
   cp env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Start MongoDB** (choose one):
   - Local: Ensure MongoDB service is running
   - Atlas: Use MongoDB Atlas connection string in `.env`

4. **Run in development:**
   ```bash
   npm run dev
   ```

5. **Or build and run production:**
   ```bash
   npm run build
   npm start
   ```

## 📋 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server (requires build first)
- `npm test` - Run tests (when implemented)

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (database, etc.)
│   ├── models/          # Mongoose models
│   ├── routes/          # API route handlers
│   ├── middleware/      # Express middleware
│   ├── utils/           # Utility functions
│   └── server.ts        # Main server file
├── dist/               # Compiled JavaScript (generated)
├── logs/               # Application logs
├── uploads/            # Uploaded files
├── .env                # Environment variables (create from env.example)
└── package.json        # Dependencies and scripts
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/verify` - Verify user (admin)
- `PUT /api/users/:id/activate` - Activate user (admin)
- `PUT /api/users/:id/deactivate` - Deactivate user (admin)

### Stakeholders
- `GET /api/stakeholders` - Get all stakeholders
- `GET /api/stakeholders/:id` - Get stakeholder by ID
- `POST /api/stakeholders` - Create stakeholder profile
- `PUT /api/stakeholders/:id` - Update stakeholder
- `PUT /api/stakeholders/:id/verify` - Verify stakeholder (admin)

### Loans
- `GET /api/loans` - Get all loans
- `GET /api/loans/:id` - Get loan by ID
- `POST /api/loans` - Create loan application
- `PUT /api/loans/:id/approve` - Approve loan
- `PUT /api/loans/:id/reject` - Reject loan
- `PUT /api/loans/:id/disburse` - Disburse loan

### Documents
- `GET /api/documents` - Get user documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:id` - Get document details
- `GET /api/documents/:id/download` - Download document
- `DELETE /api/documents/:id` - Delete document

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read

## 🔧 Environment Variables

See `env.example` for all available environment variables. Key ones:

- `MONGO_URI` - MongoDB connection string (required)
- `JWT_SECRET` - Secret key for JWT tokens (required)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## 🛠️ Technology Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** express-validator
- **Logging:** Winston
- **File Upload:** Multer

## 📝 Development Notes

- The server will start even if MongoDB is not connected, but API calls will fail
- Check `logs/` folder for application logs
- Uploads are stored in `uploads/` folder
- CORS is configured for frontend at `http://localhost:3000` (update in `.env`)

## 🐛 Troubleshooting

See `SETUP.md` for detailed troubleshooting guide.

## 📄 License

MIT

