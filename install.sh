# ──────────────────────────────────────────────────────────────
# SPILKA Terasa — Inštalačný skript
# Verzia: 1.0.0
# ──────────────────────────────────────────────────────────────
#!/bin/bash

set -e

# Farby
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     SPILKA Terasa — Inštalácia               ║${NC}"
echo -e "${BLUE}║     Reštauračný web s objednávkovým systémom ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"
echo ""

# ─── Kontrola predpokladov ────────────────────────────────────

echo -e "${YELLOW}[1/7] Kontrolujem predpoklady...${NC}"

check_command() {
  if ! command -v $1 &> /dev/null; then
    echo -e "${RED}✗ $1 nie je nainštalovaný${NC}"
    echo -e "  Nainštalujte ho podľa návodu na: $2"
    exit 1
  else
    echo -e "${GREEN}✓ $1 je nainštalovaný${NC}"
  fi
}

check_command "node" "https://nodejs.org (odporúčam verziu 20+)"
check_command "npm" "https://nodejs.org"

# Kontrola Node.js verzie
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo -e "${RED}✗ Node.js verzia musí byť aspoň 18. Vaša verzia: $(node -v)${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Node.js verzia: $(node -v)${NC}"

# Kontrola Bunu (voliteľné)
if command -v bun &> /dev/null; then
  echo -e "${GREEN}✓ Bun je nainštalovaný ($(bun -v)) — použije sa pre rýchlejšiu inštaláciu${NC}"
  PKG_MANAGER="bun"
else
  echo -e "${YELLOW}⚠ Bun nie je nainštalovaný — použije sa npm${NC}"
  echo -e "  Pre rýchlejšiu inštaláciu nainštalujte: https://bun.sh"
  PKG_MANAGER="npm"
fi

echo ""

# ─── Konfigurácia ─────────────────────────────────────────────

echo -e "${YELLOW}[2/7] Konfigurácia...${NC}"

# Opýtaj sa na port
read -p "Na ktorom porte má bežať web? [3000]: " PORT
PORT=${PORT:-3000}

# Opýtaj sa na databázu
read -p "Cesta k SQLite databáze [./db/custom.db]: " DB_PATH
DB_PATH=${DB_PATH:-"./db/custom.db"}

# Vytvor .env súbor
cat > .env << EOF
DATABASE_URL=file:${DB_PATH}
PORT=${PORT}
NEXT_PUBLIC_SITE_URL=http://localhost:${PORT}
EOF

echo -e "${GREEN}✓ .env súbor vytvorený${NC}"
echo ""

# ─── Inštalácia závislostí ────────────────────────────────────

echo -e "${YELLOW}[3/7] Inštalujem závislosti...${NC}"

if [ "$PKG_MANAGER" = "bun" ]; then
  bun install
else
  npm install
fi

echo -e "${GREEN}✓ Závislosti nainštalované${NC}"
echo ""

# ─── Databáza ─────────────────────────────────────────────────

echo -e "${YELLOW}[4/7] Pripravujem databázu...${NC}"

# Vytvor priečinok pre databázu
mkdir -p db

if [ "$PKG_MANAGER" = "bun" ]; then
  bun run db:push
else
  npm run db:push
fi

echo -e "${GREEN}✓ Databázová schéma vytvorená${NC}"
echo ""

# ─── Seed databázy ────────────────────────────────────────────

echo -e "${YELLOW}[5/7] Napĺňam databázu ukážkovými dátami...${NC}"

read -p "Chcete naplniť databázu ukážkovými dátami? [a/N]: " SEED
if [[ "$SEED" =~ ^[Aa]$ ]]; then
  if [ "$PKG_MANAGER" = "bun" ]; then
    bun run seed
  else
    npm run seed
  fi
  echo -e "${GREEN}✓ Databáza naplnená ukážkovými dátami${NC}"
else
  echo -e "${YELLOW}⚠ Databáza je prázdna. Môžete ju naplniť neskôr: npm run seed${NC}"
fi
echo ""

# ─── Build ────────────────────────────────────────────────────

echo -e "${YELLOW}[6/7] Vytváram produkčnú verziu...${NC}"

read -p "Chcete vytvoriť produkčný build? [a/N]: " BUILD
if [[ "$BUILD" =~ ^[Aa]$ ]]; then
  if [ "$PKG_MANAGER" = "bun" ]; then
    bun run build
  else
    npm run build
  fi
  echo -e "${GREEN}✓ Produkčná verzia vytvorená${NC}"
else
  echo -e "${YELLOW}⚠ Preskakujem build. Môžete ho vytvoriť neskôr: npm run build${NC}"
fi
echo ""

# ─── Dokončenie ───────────────────────────────────────────────

echo -e "${YELLOW}[7/7] Inštalácia dokončená!${NC}"
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          INŠTALÁCIA ÚSPEŠNÁ                  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "Pre spustenie vývojárskeho servera:"
echo -e "  ${BLUE}npm run dev${NC}       (alebo ${BLUE}bun run dev${NC})"
echo -e ""
echo -e "Pre spustenie produkčnej verzie:"
echo -e "  ${BLUE}npm run start${NC}     (alebo ${BLUE}bun run start${NC})"
echo -e ""
echo -e "Admin panel:"
echo -e "  ${BLUE}http://localhost:${PORT}/admin${NC}"
echo -e "  Prihlasovacie údaje: admin / spilka2026"
echo -e ""
echo -e "Objednávkový systém:"
echo -e "  ${BLUE}http://localhost:${PORT}/order?table=1${NC}"
echo -e ""
echo -e "Pre viac informácií pozrite ${BLUE}MANUAL.md${NC}"
echo ""
