import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Mock data
const mockBusinesses = [
  {
    id: '1',
    name: 'Barbershop Elit',
    description: 'Moderný barbershop v centre mesta',
    email: 'info@barbershop.sk',
    phone: '0902123456',
    address: 'Hlavná 123',
    city: 'Bratislava',
    country: 'Slovakia',
    timezone: 'Europe/Bratislava',
    currency: 'EUR',
    averageRating: 4.8,
    totalReviews: 42,
    isActive: true,
  },
  {
    id: '2',
    name: 'Beauty Salon Luna',
    description: 'Kaderníctvo a kozmetika',
    email: 'info@luna.sk',
    phone: '0903456789',
    address: 'Obchodná 45',
    city: 'Bratislava',
    country: 'Slovakia',
    timezone: 'Europe/Bratislava',
    currency: 'EUR',
    averageRating: 4.5,
    totalReviews: 28,
    isActive: true,
  },
];

const mockServices = [
  { id: '1', businessId: '1', name: 'Strihanie vlasov', description: 'Pánske strihanie', duration: 30, price: 15, currency: 'EUR' },
  { id: '2', businessId: '1', name: 'Strihanie brady', description: 'Úprava brady', duration: 20, price: 10, currency: 'EUR' },
  { id: '3', businessId: '2', name: 'Dámske strihanie', description: 'Strih a fúkanie', duration: 60, price: 25, currency: 'EUR' },
];

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), mode: 'demo' });
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { email, firstName, lastName } = req.body;
  res.json({
    user: {
      id: Math.random().toString(36).substr(2, 9),
      email,
      firstName,
      lastName,
      role: 'CLIENT',
      verified: true,
    },
    token: 'demo-token-' + Math.random().toString(36).substr(2, 9),
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  res.json({
    user: {
      id: '1',
      email,
      firstName: 'Viktor',
      lastName: 'Testovací',
      role: 'CLIENT',
      verified: true,
    },
    token: 'demo-token-12345',
  });
});

app.get('/api/auth/profile', (req, res) => {
  res.json({
    id: '1',
    email: 'test@test.sk',
    firstName: 'Viktor',
    lastName: 'Testovací',
    role: 'CLIENT',
    verified: true,
  });
});

// Business routes
app.get('/api/businesses', (req, res) => {
  res.json(mockBusinesses);
});

app.get('/api/businesses/:id', (req, res) => {
  const business = mockBusinesses.find(b => b.id === req.params.id);
  if (!business) {
    return res.status(404).json({ error: 'Business not found' });
  }
  res.json(business);
});

app.post('/api/businesses', (req, res) => {
  const newBusiness = {
    id: Math.random().toString(36).substr(2, 9),
    ...req.body,
    averageRating: 0,
    totalReviews: 0,
    isActive: true,
  };
  mockBusinesses.push(newBusiness);
  res.status(201).json(newBusiness);
});

// Service routes
app.get('/api/services', (req, res) => {
  const { businessId } = req.query;
  const filtered = businessId
    ? mockServices.filter(s => s.businessId === businessId)
    : mockServices;
  res.json(filtered);
});

// Booking routes
app.get('/api/bookings', (req, res) => {
  res.json({ bookings: [], pagination: { total: 0, page: 1, limit: 10, pages: 0 } });
});

app.post('/api/bookings', (req, res) => {
  const booking = {
    id: Math.random().toString(36).substr(2, 9),
    ...req.body,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  };
  res.status(201).json(booking);
});

app.get('/api/bookings/available-slots', (req, res) => {
  // Generate some demo slots
  const slots = [];
  for (let hour = 9; hour < 18; hour++) {
    slots.push({
      start: `${hour}:00`,
      end: `${hour + 1}:00`,
      available: Math.random() > 0.3,
    });
  }
  res.json(slots);
});

// Reviews
app.get('/api/reviews', (req, res) => {
  res.json([]);
});

// Staff
app.get('/api/staff', (req, res) => {
  res.json([]);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Demo Backend running on port ${PORT}`);
  console.log(`📝 Mode: DEMO (mock data)`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('');
  console.log('⚠️  This is a demo version with mock data.');
  console.log('   On your PC, run "npm install" and Prisma will work correctly.');
});

export default app;
