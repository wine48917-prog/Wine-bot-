#!/data/data/com.termux/files/usr/bin/bash
set -e
cd "$(dirname "$0")"
pkg update -y
pkg install -y nodejs-lts openssl
if [ ! -f .env ]; then
  cp .env.example .env
  TOKEN="$(openssl rand -hex 32)"
  sed -i "s/replace-with-a-long-random-secret-at-least-24-characters/$TOKEN/" .env
  echo
  echo "WINE BOT admin token (save it privately):"
  echo "$TOKEN"
  echo
fi
npm install
mkdir -p data/session
npm start
