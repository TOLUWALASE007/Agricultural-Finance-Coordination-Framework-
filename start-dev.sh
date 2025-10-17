#!/bin/bash

echo "Starting AFCF Development Environment..."
echo

echo "[1/3] Installing Frontend Dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Frontend dependency installation failed!"
    exit 1
fi

echo
echo "[2/3] Installing Backend Dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Backend dependency installation failed!"
    exit 1
fi

echo
echo "[3/3] Starting Development Servers..."
echo "Starting Frontend on http://localhost:3000"
echo "Starting Backend on http://localhost:5000"
echo

# Start frontend in background
cd ..
npm start &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

# Start backend in background
cd backend
npm run dev &
BACKEND_PID=$!

echo
echo "Development servers are starting..."
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000"
echo
echo "Press Ctrl+C to stop all servers..."

# Function to cleanup background processes
cleanup() {
    echo
    echo "Stopping servers..."
    kill $FRONTEND_PID 2>/dev/null
    kill $BACKEND_PID 2>/dev/null
    echo "Servers stopped."
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for user to stop
wait
