#!/bin/bash
# Server watchdog - checks if Next.js is running and restarts it if not
# Runs as a persistent process

LOG="/home/z/my-project/dev.log"
PROJECT="/home/z/my-project"

while true; do
  # Check if server is responding
  if ! curl -s -o /dev/null -w "" http://localhost:3000/ 2>/dev/null; then
    echo "[$(date '+%H:%M:%S')] Server not responding, starting..." >> "$LOG"
    # Kill any stale processes
    pkill -f "next dev" 2>/dev/null
    sleep 1
    # Start server
    cd "$PROJECT" && npx next dev -p 3000 >> "$LOG" 2>&1 &
    SERVER_PID=$!
    echo "[$(date '+%H:%M:%S')] Server started with PID $SERVER_PID" >> "$LOG"
    # Wait for server to be ready
    for i in $(seq 1 20); do
      if curl -s -o /dev/null http://localhost:3000/ 2>/dev/null; then
        echo "[$(date '+%H:%M:%S')] Server is ready!" >> "$LOG"
        break
      fi
      sleep 1
    done
  fi
  sleep 5
done
