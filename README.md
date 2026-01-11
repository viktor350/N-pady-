# Bookio Pro - Pokročilá booking aplikácia

Moderná webová aplikácia pre online rezervácie služieb s pokročilými funkciami, ktoré presahujú základné Bookio.

## 🚀 Funkcie

### Pre zákazníkov
- 📱 **Online rezervácie 24/7** - Rezervujte si termín kedykoľvek a odkiaľkoľvek
- 🔍 **Vyhľadávanie firiem** - Nájdite služby podľa názvu, lokality alebo kategórie
- 📅 **Real-time dostupnosť** - Vidíte len skutočne voľné termíny
- ⭐ **Hodnotenia a recenzie** - Prečítajte si skúsenosti iných zákazníkov
- 🔔 **Notifikácie** - Dostávajte pripomienky o nadchádzajúcich rezerváciách
- 📊 **História rezervácií** - Prehľad všetkých vašich rezervácií

### Pre poskytovateľov služieb
- 🏢 **Správa firmy** - Vytvorte a spravujte profil vašej firmy
- 💼 **Správa služieb** - Pridávajte a upravujte ponúkané služby
- 👥 **Správa personálu** - Spravujte zamestnancov a ich dostupnosť
- ⏰ **Pracovné hodiny** - Nastavte otváracie hodiny pre každý deň
- 📈 **Dashboard** - Prehľad rezervácií a štatistík
- 💬 **Odpovede na recenzie** - Komunikujte so svojimi zákazníkmi
- 🎨 **Prispôsobenie** - Nastavte vlastné logo, farby a popis

## 🛠️ Technológie

### Backend
- **Node.js** + **Express** - Robustný REST API server
- **TypeScript** - Type-safe vývoj
- **Prisma** - Moderný ORM pre PostgreSQL
- **PostgreSQL** - Relačná databáza
- **JWT** - Bezpečná autentifikácia
- **bcrypt** - Hashing hesiel
- **Socket.io** - Real-time notifikácie
- **Winston** - Logging

### Frontend
- **React 18** - UI knižnica
- **TypeScript** - Type-safe vývoj
- **Vite** - Rýchly build tool
- **React Router** - Routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP klient
- **React Query** - Server state management
- **date-fns** - Date manipulation
- **Lucide React** - Ikony

## 📦 Inštalácia

### Požiadavky
- Node.js 18+ a npm
- PostgreSQL 14+
- Git

### Krok 1: Klonujte repozitár

```bash
git clone <repository-url>
cd N-pady-
```

### Krok 2: Inštalácia závislostí

```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### Krok 3: Nastavenie databázy

1. Vytvorte PostgreSQL databázu:
```sql
CREATE DATABASE bookio_pro;
```

2. Skopírujte `.env.example` na `.env` v `backend` adresári:
```bash
cd backend
cp .env.example .env
```

3. Upravte `.env` súbor s vašimi údajmi:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/bookio_pro?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. Spustite migrácie:
```bash
npm run prisma:migrate
npm run prisma:generate
```

### Krok 4: Nastavenie frontendu

```bash
cd ../frontend
cp .env.example .env
```

Upravte `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Spustenie aplikácie

### Vývojové prostredie

V root adresári spustite oba servery naraz:
```bash
npm run dev
```

Alebo spustite samostatne:

**Backend** (port 5000):
```bash
cd backend
npm run dev
```

**Frontend** (port 5173):
```bash
cd frontend
npm run dev
```

Aplikácia bude dostupná na:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- API Health check: http://localhost:5000/health

### Produkčné prostredie

```bash
# Build
npm run build

# Spustenie
npm start
```

## 📁 Štruktúra projektu

```
bookio-pro/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Databázová schéma
│   ├── src/
│   │   ├── controllers/           # API kontroléry
│   │   ├── middleware/            # Express middleware
│   │   ├── routes/                # API routes
│   │   ├── services/              # Business logika
│   │   ├── types/                 # TypeScript typy
│   │   ├── utils/                 # Pomocné funkcie
│   │   └── index.ts               # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/            # React komponenty
│   │   ├── context/               # React context
│   │   ├── pages/                 # Stránky
│   │   ├── services/              # API služby
│   │   ├── types/                 # TypeScript typy
│   │   ├── App.tsx                # Hlavná aplikácia
│   │   └── main.tsx               # Entry point
│   └── package.json
└── package.json                   # Root package.json
```

## 🗄️ Databázový model

### Hlavné entity:
- **User** - Používatelia (klienti, poskytovatelia, admini)
- **Business** - Firmy poskytujúce služby
- **Service** - Služby ponúkané firmami
- **Staff** - Personál firiem
- **WorkingHours** - Pracovné hodiny
- **Booking** - Rezervácie
- **Review** - Hodnotenia a recenzie
- **Notification** - Notifikácie

## 🔐 API Endpoints

### Autentifikácia
- `POST /api/auth/register` - Registrácia
- `POST /api/auth/login` - Prihlásenie
- `GET /api/auth/profile` - Profil používateľa
- `PUT /api/auth/profile` - Aktualizácia profilu

### Firmy
- `GET /api/businesses` - Zoznam firiem
- `GET /api/businesses/:id` - Detail firmy
- `POST /api/businesses` - Vytvorenie firmy (PROVIDER)
- `PUT /api/businesses/:id` - Aktualizácia firmy (PROVIDER)
- `DELETE /api/businesses/:id` - Zmazanie firmy (PROVIDER)

### Služby
- `GET /api/services` - Zoznam služieb
- `GET /api/services/:id` - Detail služby
- `POST /api/services` - Vytvorenie služby (PROVIDER)
- `PUT /api/services/:id` - Aktualizácia služby (PROVIDER)
- `DELETE /api/services/:id` - Zmazanie služby (PROVIDER)

### Rezervácie
- `GET /api/bookings` - Zoznam rezervácií
- `GET /api/bookings/:id` - Detail rezervácie
- `POST /api/bookings` - Vytvorenie rezervácie
- `PATCH /api/bookings/:id/status` - Aktualizácia stavu
- `GET /api/bookings/available-slots` - Voľné termíny

### Recenzie
- `GET /api/reviews` - Zoznam recenzií
- `POST /api/reviews` - Vytvorenie recenzie
- `POST /api/reviews/:id/respond` - Odpoveď na recenziu (PROVIDER)

### Personál
- `GET /api/staff` - Zoznam personálu
- `POST /api/staff` - Pridanie personálu (PROVIDER)
- `PUT /api/staff/:id` - Aktualizácia personálu (PROVIDER)
- `POST /api/staff/assign-service` - Priradenie služby
- `POST /api/staff/working-hours` - Nastavenie pracovných hodín

## 🎯 Pokročilé funkcie

### Oproti základnému Bookio:
1. ✅ **Multi-tenant systém** - Podpora viacerých firiem
2. ✅ **Správa personálu** - Priradenie zamestnancov k službám
3. ✅ **Flexibilné pracovné hodiny** - Rôzne hodiny pre každý deň
4. ✅ **Real-time notifikácie** - Socket.io integrácia
5. ✅ **Pokročilé hodnotenia** - Odpovede na recenzie
6. ✅ **TypeScript** - Type-safe development
7. ✅ **Moderný stack** - React 18, Vite, Tailwind
8. ✅ **RESTful API** - Čistá API architektúra
9. ✅ **Bezpečnosť** - JWT, bcrypt, validácie
10. ✅ **Responsive dizajn** - Funguje na všetkých zariadeniach

## 🔄 Budúce rozšírenia

- [ ] Email notifikácie
- [ ] SMS pripomienky
- [ ] Online platby (Stripe/PayPal)
- [ ] Integrácia s Google Calendar
- [ ] Mobilná aplikácia (React Native)
- [ ] Multi-jazyčnosť (i18n)
- [ ] Dashboard s grafmi a štatistikami
- [ ] Export dát (PDF, CSV)
- [ ] API dokumentácia (Swagger)
- [ ] Unit a E2E testy

## 🤝 Prispievanie

Contributions sú vítané! Prosím:
1. Forkni repozitár
2. Vytvor feature branch (`git checkout -b feature/amazing-feature`)
3. Commit zmeny (`git commit -m 'Add amazing feature'`)
4. Push do branch (`git push origin feature/amazing-feature`)
5. Otvor Pull Request

## 📝 Licencia

MIT License - voľne použiteľné pre komerčné aj nekomerčné účely.

## 👨‍💻 Autor

Vytvorené s ❤️ pre modernú booking experience

## 📞 Podpora

Pre otázky a podporu:
- GitHub Issues: <repository-url>/issues
- Email: support@bookiopro.com

---

**Bookio Pro** - Because booking should be simple! 🚀
