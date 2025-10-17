@echo off
echo Setting up AFCF Database...
echo.

REM Check if MySQL is running
echo [1/4] Checking MySQL connection...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MySQL is not installed or not in PATH!
    echo Please install MySQL and add it to your PATH.
    pause
    exit /b 1
)

echo MySQL found. Please enter your MySQL root password:
mysql -u root -p -e "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo Failed to connect to MySQL. Please check your credentials.
    pause
    exit /b 1
)

echo.
echo [2/4] Creating database...
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS afcf_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if %errorlevel% neq 0 (
    echo Database creation failed!
    pause
    exit /b 1
)

echo.
echo [3/4] Creating database user...
mysql -u root -p -e "CREATE USER IF NOT EXISTS 'afcf_user'@'localhost' IDENTIFIED BY 'afcf_password123';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON afcf_database.* TO 'afcf_user'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"

echo.
echo [4/4] Running database migrations...
cd backend
if not exist .env (
    echo Creating .env file from template...
    copy env.example .env
    echo Please edit backend\.env file with your database credentials.
)

echo Running migrations...
npm run migrate
if %errorlevel% neq 0 (
    echo Migration failed! Please check your database configuration.
    pause
    exit /b 1
)

echo.
echo Database setup completed successfully!
echo.
echo Database Details:
echo - Database: afcf_database
echo - User: afcf_user
echo - Password: afcf_password123
echo.
echo Please update backend\.env file with these credentials.
echo.
pause
