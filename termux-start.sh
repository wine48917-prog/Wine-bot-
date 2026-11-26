#!/data/data/com.termux/files/usr/bin/bash
set -e
cd "$(dirname "$0")"
pkg update -y
pkg install -y nodejs-lts
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Edit .env and set a private ADMIN_TOKEN (24+ characters), then run this script again."
  exit 0
fi
npm install
mkdir -p data/session
npm start
