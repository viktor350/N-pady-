#!/bin/bash

echo "🚀 Bookio Pro - Automatická inštalácia"
echo "======================================"
echo ""

# Farby
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Krok 1: Over aktuálny adresár
echo -e "${BLUE}📍 Krok 1: Kontrola adresára${NC}"
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Chyba: Nie si v root adresári projektu!${NC}"
    echo "Prejdi do /home/user/N-pady- a spusti znova."
    exit 1
fi
echo -e "${GREEN}✅ Si v správnom adresári${NC}"
echo ""

# Krok 2: Inštalácia balíčkov
echo -e "${BLUE}📦 Krok 2: Inštalácia balíčkov${NC}"
echo "Toto môže trvať pár minút..."
if npm install; then
    echo -e "${GREEN}✅ Balíčky nainštalované${NC}"
else
    echo -e "${RED}❌ Chyba pri inštalácii balíčkov${NC}"
    exit 1
fi
echo ""

# Krok 3: Nastavenie backend .env
echo -e "${BLUE}⚙️  Krok 3: Nastavenie backendu${NC}"
cd backend

if [ ! -f ".env" ]; then
    echo "Vytváram .env súbor..."
    cp .env.example .env

    # Generuj náhodný JWT secret
    JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)

    # Uprav .env súbor
    cat > .env << EOF
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bookio_pro?schema=public"

# JWT
JWT_SECRET="${JWT_SECRET}"

# Server
PORT=5000
NODE_ENV=development

# Email (voliteľné - pre notifikácie)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=tvoj@email.com
# SMTP_PASS=tvoje_heslo

# Frontend URL
FRONTEND_URL=http://localhost:5173
EOF

    echo -e "${GREEN}✅ .env súbor vytvorený${NC}"
else
    echo -e "${GREEN}✅ .env súbor už existuje${NC}"
fi
echo ""

# Krok 4: Kontrola PostgreSQL
echo -e "${BLUE}🗄️  Krok 4: Kontrola databázy${NC}"
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL nainštalované${NC}"

    # Skús vytvoriť databázu
    echo "Vytváram databázu bookio_pro..."
    if sudo -u postgres psql -c "CREATE DATABASE bookio_pro;" 2>/dev/null; then
        echo -e "${GREEN}✅ Databáza vytvorená${NC}"
    else
        echo -e "${BLUE}ℹ️  Databáza už pravdepodobne existuje${NC}"
    fi
else
    echo -e "${RED}⚠️  PostgreSQL nie je nainštalované!${NC}"
    echo ""
    echo "Nainštaluj PostgreSQL:"
    echo "  Ubuntu/Debian: sudo apt-get install postgresql"
    echo "  MacOS: brew install postgresql"
    echo ""
    echo "Alebo použi Docker:"
    echo "  docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=bookio_pro postgres:15"
    echo ""
    read -p "Pokračovať bez databázy? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
echo ""

# Krok 5: Prisma setup
echo -e "${BLUE}🔧 Krok 5: Nastavenie Prisma${NC}"
echo "Generujem Prisma Client..."
if npx prisma generate; then
    echo -e "${GREEN}✅ Prisma Client vygenerovaný${NC}"
else
    echo -e "${RED}❌ Chyba pri generovaní Prisma Client${NC}"
    exit 1
fi

echo ""
echo "Spúšťam databázové migrácie..."
if npx prisma migrate dev --name init 2>/dev/null; then
    echo -e "${GREEN}✅ Migrácie dokončené${NC}"
else
    echo -e "${BLUE}ℹ️  Migrácie už boli spustené alebo databáza nie je dostupná${NC}"
fi
echo ""

# Vráť sa do root
cd ..

# Finálna správa
echo ""
echo "=================================="
echo -e "${GREEN}✅ INŠTALÁCIA DOKONČENÁ!${NC}"
echo "=================================="
echo ""
echo "🚀 Teraz môžeš spustiť aplikáciu:"
echo ""
echo -e "${BLUE}   npm run dev${NC}"
echo ""
echo "Aplikácia sa otvorí na:"
echo "   🎨 Frontend: http://localhost:5173"
echo "   🔧 Backend:  http://localhost:5000"
echo ""
echo "📚 Viac info: cat START.md"
echo ""
