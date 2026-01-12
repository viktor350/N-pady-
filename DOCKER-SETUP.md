# 🐳 Docker Setup - Jednoduchý návod

## ✅ Čo potrebuješ:

1. **Docker Desktop** - Stiahni a nainštaluj:
   - Windows/Mac: https://www.docker.com/products/docker-desktop/
   - Linux: https://docs.docker.com/engine/install/

2. **Node.js** - Stiahni a nainštaluj:
   - https://nodejs.org/ (LTS verzia)

---

## 🚀 Spustenie aplikácie (3 kroky)

### KROK 1: Spusti Docker Desktop

- Otvor Docker Desktop aplikáciu
- Počkaj kým sa spustí (ikona v systray bude zelená)
- To je všetko! Docker už beží 👍

---

### KROK 2: Spusti databázu

Otvor terminál vo VS Code (`` Ctrl+` ``) a napíš:

```bash
docker-compose up -d
```

**Čo to urobí:**
- Stiahne PostgreSQL databázu (prvýkrát môže trvať 1-2 min)
- Spustí databázu na pozadí
- Vytvorí databázu `bookio_pro`

**Skontroluj že beží:**
```bash
docker ps
```
Mali by si vidieť `bookio-postgres` v zozname.

---

### KROK 3: Nastav projekt a spusti

```bash
# 1. Nainštaluj balíčky
npm install

# 2. Nastav backend konfiguráciu
cd backend
copy .env.example .env
# (na Macu/Linuxe: cp .env.example .env)

# 3. Vytvor databázové tabuľky
npx prisma generate
npx prisma migrate dev --name init

# 4. Vráť sa do root adresára
cd ..

# 5. Spusti aplikáciu
npm run dev
```

**HOTOVO!** 🎉

Otvor v prehliadači:
- 🎨 **Frontend**: http://localhost:5173
- 🔧 **Backend**: http://localhost:5000

---

## 🛠️ Užitočné príkazy

### Docker príkazy:

```bash
# Spusti databázu
docker-compose up -d

# Zastav databázu
docker-compose down

# Zobraz running containers
docker ps

# Zobraz logy databázy
docker-compose logs postgres

# Reštartuj databázu
docker-compose restart

# Vymaž všetko (databáza + dáta)
docker-compose down -v
```

### Aplikácia príkazy:

```bash
# Spusti aplikáciu (backend + frontend)
npm run dev

# Zastav aplikáciu
Ctrl+C v terminále

# Prisma Studio (GUI pre databázu)
cd backend
npx prisma studio
# Otvorí sa na http://localhost:5555
```

---

## 📊 Prisma Studio (Prezeranie databázy)

Ak chceš vidieť dáta v databáze:

```bash
cd backend
npx prisma studio
```

Otvorí sa na http://localhost:5555 a môžeš vidieť všetky tabuľky a dáta.

---

## ❌ Riešenie problémov

### "docker-compose: command not found"

**Windows/Mac:**
- Nainštaluj Docker Desktop
- Reštartuj počítač
- Spusti Docker Desktop

**Linux:**
```bash
sudo apt-get install docker-compose
```

---

### "Cannot connect to the Docker daemon"

- Uisti sa že Docker Desktop beží
- Na Windows/Mac: Otvor Docker Desktop aplikáciu
- Počkaj kým sa úplne nespustí

---

### "port is already allocated"

Niekto už používa port 5432:

```bash
# Nájdi čo používa port
# Windows:
netstat -ano | findstr :5432

# Mac/Linux:
lsof -i :5432

# Zastav Docker container
docker-compose down

# Skús znova
docker-compose up -d
```

---

### "Connection refused" pri pripájaní k databáze

```bash
# 1. Over že databáza beží
docker ps

# 2. Skontroluj logy
docker-compose logs postgres

# 3. Počkaj 10 sekúnd (databáza sa ešte môže spúšťať)

# 4. Over .env súbor v backend/
cat backend/.env
# Malo by byť:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bookio_pro?schema=public"
```

---

### Chcem začať odznova (vymazať všetko)

```bash
# 1. Zastav Docker
docker-compose down -v

# 2. Vymaž node_modules
rm -rf node_modules backend/node_modules frontend/node_modules

# 3. Začni odznova
docker-compose up -d
npm install
cd backend && npx prisma migrate dev --name init && cd ..
npm run dev
```

---

## 📁 Štruktúra súborov

```
N-pady-/
├── docker-compose.yml      ← Docker konfigurácia
├── backend/
│   ├── .env               ← Tvoja konfigurácia
│   ├── .env.example       ← Šablóna
│   └── prisma/
│       └── schema.prisma  ← Databázová schéma
└── frontend/
```

---

## ✅ Kontrolný zoznam

- [ ] Docker Desktop nainštalovaný a beží
- [ ] Node.js nainštalovaný
- [ ] Projekt stiahnutý z GitHubu
- [ ] Otvorený vo VS Code
- [ ] Spustený `docker-compose up -d`
- [ ] Over že beží: `docker ps`
- [ ] Spustený `npm install`
- [ ] Vytvorený `.env` súbor: `cd backend && copy .env.example .env`
- [ ] Spustené migrácie: `npx prisma migrate dev --name init`
- [ ] Spustená aplikácia: `npm run dev`
- [ ] Otvorené http://localhost:5173

---

## 🎓 Čo je Docker?

Docker je ako "virtuálny počítač" ktorý spúšťa len databázu. Nemusíš inštalovať PostgreSQL na svoj počítač, Docker to urobí za teba v izolovanom prostredí.

**Výhody:**
- ✅ Jednoduchá inštalácia (jeden príkaz)
- ✅ Nič nezapráši tvoj počítač
- ✅ Ľahko sa vymaže (`docker-compose down -v`)
- ✅ Funguje rovnako na Windows, Mac aj Linux

---

## 🆘 Ďalšia pomoc

Ak ťa niečo zasekne:
1. Pozri tento súbor (DOCKER-SETUP.md)
2. Pozri START.md pre viac info
3. Pozri README.md pre dokumentáciu

---

**Teraz pokračuj týmito krokmi a za 5 minút budeš mať aplikáciu bežať!** 🚀
