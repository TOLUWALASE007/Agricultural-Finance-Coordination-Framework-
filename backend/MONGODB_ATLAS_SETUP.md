# MongoDB Atlas Setup Guide

## Step-by-Step Instructions

### 1. Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account (or sign in if you already have one)
3. Complete the email verification

### 2. Create a Free Cluster
1. After logging in, click **"Create"** or **"Build a Database"**
2. Choose **"M0"** (Free tier - Shared)
3. Select your preferred **Cloud Provider and Region** (choose closest to you)
   - Recommended: AWS, region closest to your location
4. Click **"Create Cluster"**
5. Wait 2-3 minutes for the cluster to be created

### 3. Create Database User
1. In the Security section, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication method
4. Enter:
   - **Username**: `afcf_admin` (or your preferred username)
   - **Password**: Create a strong password (save it securely!)
5. Under **"Database User Privileges"**, select **"Read and write to any database"**
6. Click **"Add User"**

### 4. Configure Network Access
1. In the Security section, click **"Network Access"**
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ Note: For production, restrict to specific IPs
4. Click **"Confirm"**

### 5. Get Your Connection String
1. Go to **"Database"** section
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** as the driver
5. Copy the connection string
   - It will look like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### 6. Update Your .env File
1. Open `DEVELOPMENT/backend/.env`
2. Replace the `MONGO_URI` line with:
   ```
   MONGO_URI=mongodb+srv://afcf_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/afcf_database?retryWrites=true&w=majority
   ```
3. Replace:
   - `afcf_admin` with your database username
   - `YOUR_PASSWORD` with your database user password
   - `cluster0.xxxxx.mongodb.net` with your actual cluster URL
   - Keep `/afcf_database` at the end (this is your database name)

### 7. Test the Connection
1. Start your backend server:
   ```bash
   cd DEVELOPMENT/backend
   npm run dev
   ```
2. You should see: `✅ MongoDB connection established successfully`

## Troubleshooting

- **Connection timeout**: Make sure you've added your IP address in Network Access
- **Authentication failed**: Check your username and password in the connection string
- **Invalid connection string**: Make sure there are no spaces and the password is URL-encoded if it contains special characters

## Security Notes

- Never commit your `.env` file to version control
- For production, restrict Network Access to specific IPs
- Use strong passwords for database users
- Consider using environment-specific connection strings

