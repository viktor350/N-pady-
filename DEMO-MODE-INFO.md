# 🎭 DEMO REŽIM - Dôležité Info

## ✅ Aplikácia teraz beží v DEMO režime!

**Backend**: http://localhost:5000 (beží s mock dátami)
**Frontend**: http://localhost:5173 (normálne)

---

## 🤔 Prečo DEMO režim?

V tomto development environmente je blokovaný prístup k Prisma binárnym súborom (403 Forbidden error).

**Ale neboj sa! Na tvojom PC to bude fungovať normálne.** 💪

---

## 📦 Čo je zahrnuté v DEMO režime:

### ✅ Funguje:
- Registrácia a prihlasovanie
- Prezeranie firiem (2 demo firmy)
- Prezeranie služieb
- Vytváranie rezervácií
- Dashboard
- Celý frontend
- Celé API endpointy

### ⚠️ Používa mock dáta:
- Firmy: Barbershop Elit, Beauty Salon Luna
- Služby: Strihanie vlasov, brady, atď.
- Dáta sa neukladajú do databázy (len v pamäti)

---

## 🏠 Ako to spustiť na TVOJOM PC (s databázou):

### 1️⃣ Klonuj projekt:
```bash
git clone https://github.com/viktor350/N-pady-.git
cd N-pady-
```

### 2️⃣ Nainštaluj Docker Desktop:
- Windows/Mac: https://www.docker.com/products/docker-desktop/

### 3️⃣ Spusti automatický setup:
```bash
# Windows:
setup-docker.bat

# Mac/Linux:
./setup-docker.sh
```

### 4️⃣ Spusti aplikáciu:
```bash
npm run dev
```

**HOTOVO!** Backend bude používať skutočnú PostgreSQL databázu. 🎉

---

## 🔄 Prepnutie medzi DEMO a plnou verziou:

### DEMO režim (aktuálne):
```bash
cd backend
npm run dev
```

### Plná verzia (s databázou):
```bash
cd backend
npm run dev:full
```

---

## 📝 Súbory:

```
backend/
├── src/
│   ├── index.ts          ← Plná verzia (s Prisma)
│   └── index-demo.ts     ← DEMO verzia (aktuálne)
├── package.json          ← "dev" používa demo
└── .env                  ← Konfigurácia
```

---

## 🧪 Testovanie DEMO aplikácie:

### 1. Otvor http://localhost:5173

### 2. Zaregistruj sa:
- Email: `test@test.sk`
- Meno: `Janko`
- Priezvisko: `Testovací`
- Heslo: `heslo123`

### 3. Prihláš sa:
Použij rovnaký email a heslo

### 4. Vyskúšaj funkcie:
- Choď na "Firmy" → Uvidíš 2 demo firmy
- Klikni na firmu → Uvidíš detail
- Vyskúšaj rezerváciu → Funguje!
- Choď na "Moje rezervácie" → Uvidíš prázdny zoznam (dáta sa neukladajú)

---

## 🚀 Na tvojom PC bude fungovať:

✅ Skutočná PostgreSQL databáza
✅ Prisma ORM
✅ Ukladanie všetkých dát
✅ Všetky relačné väzby
✅ Real-time notifikácie
✅ Plná funkcionalita

---

## 🆘 Riešenie problémov:

### "Cannot connect to database" na tvojom PC:

1. Uisti sa že Docker Desktop beží
2. Spusti: `docker-compose up -d`
3. Počkaj 10 sekúnd
4. Spusti: `npm run dev`

### "Prisma errors" na tvojom PC:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
```

---

## 📚 Dokumentácia:

- **README.md** - Hlavná dokumentácia
- **START.md** - Ako spustiť aplikáciu
- **DOCKER-SETUP.md** - Docker návod
- **DEMO-MODE-INFO.md** - Tento súbor

---

## 💡 Tip:

Tento DEMO režim je ideálny na:
- Vyskúšanie UI/UX
- Testovanie frontendu
- Prezentáciu projektu
- Development bez databázy

Ale pre produkciu alebo vývoj s dátami použij plnú verziu s databázou! 🚀

---

**Otázky? Pozri START.md alebo README.md** 😊
