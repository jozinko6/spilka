#!/bin/bash
# Keep-alive script for Next.js dev server
# Automatically restarts the server if it crashes

LOG="/home/z/my-project/dev.log"

while true; do
  echo "[$(date)] Starting Next.js dev server..." >> "$LOG"
  cd /home/z/my-project && npx next dev -p 3000 >> "$LOG" 2>&1
  EXIT_CODE=$?
  echo "[$(date)] Server exited with code $EXIT_CODE. Restarting in 3 seconds..." >> "$LOG"
  sleep 3
done
