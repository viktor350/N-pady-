# 🚀 Ako spustiť Bookio Pro

## 📍 Aktuálne si tu: `/home/user/N-pady-`

---

## ⚡ RÝCHLY ŠTART (Odporúčané)

### 1️⃣ Nainštaluj všetko (ROOT adresár - tam kde si teraz)
```bash
npm install
```

### 2️⃣ Nastav databázu (prejdi do backend adresára)
```bash
cd backend

# Skopíruj .env súbor
cp .env.example .env

# Uprav .env súbor (nastav DATABASE_URL)
nano .env
# alebo
vim .env

# Vytvor databázu a tabuľky
npx prisma migrate dev --name init
npx prisma generate
```

### 3️⃣ Vráť sa do ROOT a spusti všetko naraz
```bash
cd ..
npm run dev
```

✅ **HOTOVO!** Aplikácia beží na:
- 🎨 Frontend: http://localhost:5173
- 🔧 Backend API: http://localhost:5000

---

## 📝 KROK PO KROKU (Podrobnejšie)

### Kde si práve teraz?
Zisti aktuálny adresár:
```bash
pwd
# Malo by vypísať: /home/user/N-pady-
```

---

### KROK 1: Inštalácia balíčkov

#### A) Root adresár (hlavná inštalácia)
```bash
# Si v: /home/user/N-pady-
pwd  # Over si, že si v root adresári

npm install
```

#### B) Backend balíčky
```bash
cd backend
npm install
cd ..
```

#### C) Frontend balíčky
```bash
cd frontend
npm install
cd ..
```

---

### KROK 2: Nastavenie databázy

#### A) Vytvor .env súbor
```bash
cd backend
cp .env.example .env
```

#### B) Uprav .env súbor
Otvor `.env` v editore a nastav:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/bookio_pro"
JWT_SECRET="tvoj-tajny-kluc-min-32-znakov-dlhy"
PORT=5000
NODE_ENV=development
```

**Ak nemáš PostgreSQL:**
```bash
# Ubuntu/Debian
sudo apt-get install postgresql

# Vytvor databázu
sudo -u postgres createdb bookio_pro
sudo -u postgres createuser -s tvoj_user
```

#### C) Spusti migrácie
```bash
# Stále si v /home/user/N-pady-/backend
npx prisma migrate dev --name init
npx prisma generate
```

#### D) Vráť sa do root
```bash
cd ..
```

---

### KROK 3: Spustenie aplikácie

#### MOŽNOSŤ A: Spusti všetko naraz (Odporúčané)
```bash
# V root adresári: /home/user/N-pady-
npm run dev
```
Toto spustí **BACKEND aj FRONTEND** naraz v jednom terminále!

#### MOŽNOSŤ B: Spusti samostatne (2 terminály)

**Terminál 1 - Backend:**
```bash
cd /home/user/N-pady-/backend
npm run dev
```

**Terminál 2 - Frontend:**
```bash
cd /home/user/N-pady-/frontend
npm run dev
```

---

## 🌐 Adresy aplikácie

Po spustení otvor v prehliadači:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Prisma Studio** (databáza UI):
  ```bash
  cd backend
  npm run prisma:studio
  ```
  Otvorí sa na: http://localhost:5555

---

## 🛠️ Užitočné príkazy

### Root adresár (`/home/user/N-pady-`)
```bash
npm run dev              # Spusti všetko naraz
npm run dev:backend      # Len backend
npm run dev:frontend     # Len frontend
npm run build            # Build produkcie
```

### Backend (`/home/user/N-pady-/backend`)
```bash
npm run dev              # Spusti dev server
npm run build            # Build TypeScript
npm run start            # Spusti produkciu
npm run prisma:studio    # Databáza UI
npm run prisma:generate  # Generuj Prisma Client
npm run prisma:migrate   # Spusti migrácie
```

### Frontend (`/home/user/N-pady-/frontend`)
```bash
npm run dev      # Spusti dev server
npm run build    # Build produkcie
npm run preview  # Preview buildu
```

---

## ❌ Riešenie problémov

### "Command not found"
```bash
# Najprv nainštaluj všetko
cd /home/user/N-pady-
npm install
```

### "Cannot connect to database"
```bash
# 1. Over či beží PostgreSQL
sudo systemctl status postgresql

# 2. Over DATABASE_URL v backend/.env
cd /home/user/N-pady-/backend
cat .env

# 3. Skús vytvoriť databázu znova
sudo -u postgres createdb bookio_pro
```

### "Port already in use"
```bash
# Nájdi proces na porte
lsof -i :5000  # pre backend
lsof -i :5173  # pre frontend

# Zabij proces
kill -9 PID
```

---

## 📂 Štruktúra projektu

```
/home/user/N-pady-/          ← ROOT (TU ZAČNI)
├── backend/                  ← Backend kód
│   ├── .env                  ← Konfigurácia (vytvor)
│   ├── prisma/
│   │   └── schema.prisma     ← Databáza schéma
│   ├── src/                  ← Zdrojový kód
│   └── package.json
├── frontend/                 ← Frontend kód
│   ├── src/                  ← React komponenty
│   └── package.json
├── package.json              ← Root konfigurácia
└── START.md                  ← Tento súbor
```

---

## ✅ Kontrolný zoznam

- [ ] Nainštalované balíčky (`npm install` v root)
- [ ] PostgreSQL nainštalované a beží
- [ ] Vytvorená databáza `bookio_pro`
- [ ] Skopírovaný `.env` súbor (`backend/.env`)
- [ ] Nastavený `DATABASE_URL` v `.env`
- [ ] Spustené migrácie (`prisma migrate dev`)
- [ ] Spustená aplikácia (`npm run dev`)
- [ ] Otvorené v prehliadači http://localhost:5173

---

🎉 **Teraz môžeš začať!**
