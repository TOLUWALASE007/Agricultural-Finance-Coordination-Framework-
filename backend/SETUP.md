# Backend Setup Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (v5.0 or higher)
   - Local installation, OR
   - MongoDB Atlas account (cloud)

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:
```bash
cp env.example .env
```

Edit `.env` with your settings:
- `MONGO_URI`: MongoDB connection string
  - Local: `mongodb://localhost:27017/afcf_database`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/afcf_database`
- `JWT_SECRET`: A secure random string for JWT tokens
- Other settings as needed

### 3. Start MongoDB

#### Option A: Local MongoDB
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

### 4. Build TypeScript
```bash
npm run build
```

### 5. Start the Server

#### Development Mode (with hot reload)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

### 6. Verify Server is Running

Visit: http://localhost:5000/health

You should see:
```json
{
  "status": "OK",
  "timestamp": "...",
  "uptime": ...,
  "environment": "development"
}
```

## API Endpoints

- Health Check: `GET /health`
- API Info: `GET /api`
- Authentication: `/api/auth`
- Users: `/api/users`
- Stakeholders: `/api/stakeholders`
- Loans: `/api/loans`
- Documents: `/api/documents`
- Notifications: `/api/notifications`

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- Verify network/firewall settings
- For Atlas: Check IP whitelist

### Port Already in Use
- Change `PORT` in `.env`
- Or stop the process using port 5000

### Build Errors
- Run `npm install` again
- Check TypeScript version: `npx tsc --version`
- Delete `node_modules` and `dist`, then reinstall

## Development Tips

- Use `npm run dev` for development (auto-reload on changes)
- Check `logs/` folder for application logs
- Use Postman or similar tool to test API endpoints
- Ensure CORS is configured correctly in `server.ts` for frontend

