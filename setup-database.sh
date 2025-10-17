#!/bin/bash

echo "Setting up AFCF Database..."
echo

# Check if MySQL is installed
echo "[1/4] Checking MySQL connection..."
if ! command -v mysql &> /dev/null; then
    echo "MySQL is not installed. Please install MySQL first."
    exit 1
fi

# Test MySQL connection
mysql -u root -p -e "SELECT 1;" &> /dev/null
if [ $? -ne 0 ]; then
    echo "Failed to connect to MySQL. Please check your credentials."
    exit 1
fi

echo
echo "[2/4] Creating database..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS afcf_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if [ $? -ne 0 ]; then
    echo "Database creation failed!"
    exit 1
fi

echo
echo "[3/4] Creating database user..."
mysql -u root -p -e "CREATE USER IF NOT EXISTS 'afcf_user'@'localhost' IDENTIFIED BY 'afcf_password123';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON afcf_database.* TO 'afcf_user'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"

echo
echo "[4/4] Running database migrations..."
cd backend

if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp env.example .env
    echo "Please edit backend/.env file with your database credentials."
fi

echo "Running migrations..."
npm run migrate
if [ $? -ne 0 ]; then
    echo "Migration failed! Please check your database configuration."
    exit 1
fi

echo
echo "Database setup completed successfully!"
echo
echo "Database Details:"
echo "- Database: afcf_database"
echo "- User: afcf_user"
echo "- Password: afcf_password123"
echo
echo "Please update backend/.env file with these credentials."
echo
