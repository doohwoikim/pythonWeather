#!/bin/bash

# Kill background processes on script exit
cleanup() {
    echo "Stopping Aether Application..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Trap SIGINT (Ctrl+C)
trap cleanup SIGINT

echo "Starting Aether Application..."

# Start Backend
echo "Starting Flask Backend..."
cd backend

# Create venv if missing
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Check for Flask and install dependencies if missing
if ! python3 -c "import flask" 2>/dev/null; then
    echo "Installing backend dependencies..."
    if [ -f "Pipfile" ]; then
        pip install pipenv
        pipenv install --system --deploy
    elif [ -f "requirements.txt" ]; then
        pip install -r requirements.txt
    else
        pip install flask flask-cors flask-caching requests python-dotenv
    fi
fi

# Run server using venv python
python3 server.py &
BACKEND_PID=$!
cd ..

# Start Frontend
echo "Starting React Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
