#!/bin/bash

# Farby
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "================================"
echo "  🐳 Bookio Pro - Docker Setup"
echo "================================"
echo ""

# Krok 1: Kontrola Dockeru
echo -e "${BLUE}[1/5] Kontrolujem Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}[ERROR] Docker nie je nainštalovaný!${NC}"
    echo ""
    echo "Prosím nainštaluj Docker Desktop z:"
    echo "  Mac: https://docs.docker.com/desktop/install/mac-install/"
    echo "  Linux: https://docs.docker.com/engine/install/"
    echo ""
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${RED}[ERROR] Docker daemon nebeží!${NC}"
    echo ""
    echo "Prosím spusti Docker Desktop."
    echo ""
    exit 1
fi

echo -e "${GREEN}[OK] Docker je nainštalovaný a beží${NC}"
echo ""

# Krok 2: Spustenie databázy
echo -e "${BLUE}[2/5] Spúšťam PostgreSQL databázu v Dockeri...${NC}"
if docker-compose up -d; then
    echo -e "${GREEN}[OK] PostgreSQL databáza spustená${NC}"
else
    echo -e "${RED}[ERROR] Nepodarilo sa spustiť Docker container!${NC}"
    exit 1
fi
echo ""

echo -e "${YELLOW}Čakám 10 sekúnd kým sa databáza spustí...${NC}"
sleep 10
echo ""

# Krok 3: Inštalácia balíčkov
echo -e "${BLUE}[3/5] Inštalácia balíčkov...${NC}"
if npm install; then
    echo -e "${GREEN}[OK] Balíčky nainštalované${NC}"
else
    echo -e "${RED}[ERROR] Nepodarilo sa nainštalovať balíčky!${NC}"
    exit 1
fi
echo ""

# Krok 4: Nastavenie backendu
echo -e "${BLUE}[4/5] Nastavujem backend...${NC}"
cd backend

if [ ! -f ".env" ]; then
    echo "Vytváram .env súbor..."
    cp .env.example .env
    echo -e "${GREEN}[OK] .env súbor vytvorený${NC}"
else
    echo -e "${GREEN}[OK] .env súbor už existuje${NC}"
fi

echo "Generujem Prisma Client..."
if npx prisma generate; then
    echo -e "${GREEN}[OK] Prisma Client vygenerovaný${NC}"
else
    echo -e "${RED}[ERROR] Nepodarilo sa vygenerovať Prisma Client!${NC}"
    cd ..
    exit 1
fi

echo "Spúšťam databázové migrácie..."
if npx prisma migrate dev --name init 2>/dev/null; then
    echo -e "${GREEN}[OK] Migrácie dokončené${NC}"
else
    echo -e "${YELLOW}[WARNING] Migrácie zlyhali, ale to môže byť OK ak už boli spustené${NC}"
fi

cd ..
echo -e "${GREEN}[OK] Backend nastavený${NC}"
echo ""

# Krok 5: Finálna správa
echo -e "${BLUE}[5/5] Inštalácia dokončená!${NC}"
echo ""
echo "================================"
echo -e "${GREEN}  ✅ ÚSPECH! Aplikácia je pripravená${NC}"
echo "================================"
echo ""
echo "Teraz spusti aplikáciu príkazom:"
echo ""
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo "Aplikácia sa otvorí na:"
echo "  🎨 Frontend: http://localhost:5173"
echo "  🔧 Backend:  http://localhost:5000"
echo ""
echo "Užitočné príkazy:"
echo "  docker-compose logs postgres    # Zobraz databáza logy"
echo "  docker-compose down             # Zastav databázu"
echo "  docker-compose restart          # Reštartuj databázu"
echo ""
echo "================================"
echo ""
