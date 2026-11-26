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
if grep -q "your_whatsapp_number_with_country_code" .env; then
  read -r -p "Developer WhatsApp number with country code (digits only): " DEV_NUMBER
  if ! [[ "$DEV_NUMBER" =~ ^[0-9]{10,15}$ ]]; then
    echo "Invalid number. Edit DEVELOPER_NUMBER in .env and run again."
    exit 1
  fi
  sed -i "s/your_whatsapp_number_with_country_code/$DEV_NUMBER/" .env
fi
npm install
mkdir -p data/session
npm start
