#!/usr/bin/env bash
# Inicia backend y frontend en Linux/macOS (requiere haber cargado la BD y ejecutado npm install).
cd "$(dirname "$0")"
(cd backend && npm run dev) &
sleep 3
(cd frontend && npm run dev) &
echo "AFRONEXIA en http://localhost:3000  (Ctrl+C para detener)"
wait
