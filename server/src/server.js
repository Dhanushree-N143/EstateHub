import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from './models/user.model.js';
import { Property } from './models/property.model.js';
import { Booking } from './models/booking.model.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET || 'development-only-secret';
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

// EstateHUB demo catalogue: 30 realistic listings across four communities.
// Images are loaded from Unsplash's image CDN so the database remains lightweight.
const imageUrls = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80'
];

const propertySeeds = [
  ['p1','Skyline Loft 14B','Madurai','Riverstone District','sale','apartment',18500000,3,2,1450,'New'],
  ['p2','Harborview Residence','Chennai','Marina Quarter','rent','apartment',42000,2,2,1120,'Popular'],
  ['p3','The Aster Penthouse','Bengaluru','Aster Central','invest','penthouse',32750000,4,3,2600,'Premium'],
  ['p4','Willow Court Studio','Madurai','Riverstone District','rent','studio',21000,1,1,640,'Cozy'],
  ['p5','Cedar Heights Villa','Coimbatore','Cedar Grove','sale','villa',24900000,4,4,3100,'Featured'],
  ['p6','Marina Bay Suites','Chennai','Marina Quarter','invest','penthouse',58000000,5,4,3800,'High ROI'],
  ['p7','Orchard Grove Villa','Coimbatore','Cedar Grove','sale','villa',21200000,3,3,2450,'Featured'],
  ['p8','Palm Row Apartment 3C','Bengaluru','Aster Central','rent','apartment',38500,2,2,1050,'New'],
  ['p9','Lakeside Studio 9','Madurai','Riverstone District','sale','studio',9800000,1,1,560,'Starter'],
  ['p10','Vaigai Crest Residence','Madurai','Riverstone District','sale','apartment',16400000,3,2,1380,'Family Pick'],
  ['p11','Temple View Homes','Madurai','Riverstone District','rent','apartment',28500,2,2,1180,'New'],
  ['p12','Meenakshi Garden Villa','Madurai','Riverstone District','invest','villa',22800000,4,3,2750,'Growth Area'],
  ['p13','KK Nagar Courtyard','Madurai','Riverstone District','sale','villa',19800000,3,3,2200,'Value'],
  ['p14','Anna Nagar Heights','Madurai','Riverstone District','rent','apartment',32000,3,2,1420,'Popular'],
  ['p15','Greenway Studio','Madurai','Riverstone District','rent','studio',18000,1,1,520,'Budget'],
  ['p16','Vaigai Riverfront Penthouse','Madurai','Riverstone District','sale','penthouse',36500000,4,4,2900,'Premium'],
  ['p17','Marina Pearl Apartments','Chennai','Marina Quarter','sale','apartment',21400000,3,2,1510,'Sea View'],
  ['p18','Adyar Grove Villa','Chennai','Marina Quarter','sale','villa',31500000,4,4,2880,'Featured'],
  ['p19','Besant Nagar Studio','Chennai','Marina Quarter','rent','studio',26000,1,1,610,'Coastal'],
  ['p20','OMR Tech Residence','Chennai','Marina Quarter','invest','apartment',17200000,2,2,1250,'High Demand'],
  ['p21','Guindy Central Suites','Chennai','Marina Quarter','rent','apartment',47000,3,2,1480,'Premium'],
  ['p22','ECR Palm Villa','Chennai','Marina Quarter','invest','villa',42500000,4,4,3350,'Investment'],
  ['p23','Whitefield Parkside','Bengaluru','Aster Central','sale','apartment',23900000,3,3,1620,'Tech Corridor'],
  ['p24','Indiranagar Urban Loft','Bengaluru','Aster Central','rent','apartment',56000,2,2,1180,'Premium'],
  ['p25','Koramangala Sky Villa','Bengaluru','Aster Central','sale','villa',39500000,4,4,3050,'Featured'],
  ['p26','Yelahanka Green Studio','Bengaluru','Aster Central','rent','studio',24000,1,1,590,'Budget'],
  ['p27','Hebbal Lakeview Penthouse','Bengaluru','Aster Central','invest','penthouse',44800000,4,4,2780,'High ROI'],
  ['p28','RS Puram Residence','Coimbatore','Cedar Grove','sale','apartment',17800000,3,2,1460,'Family Pick'],
  ['p29','Race Course Villa','Coimbatore','Cedar Grove','sale','villa',28900000,4,4,3020,'Premium'],
  ['p30','Saibaba Colony Studio','Coimbatore','Cedar Grove','rent','studio',19500,1,1,570,'Budget']
];

const properties = propertySeeds.map((p, index) => ({
  id: p[0], title: p[1], city: p[2], community: p[3], category: p[4], type: p[5],
  price: p[6], beds: p[7], baths: p[8], sqft: p[9], tag: p[10],
  colors: index % 2 === 0 ? ['#3E7CB1', '#16324F'] : ['#E3A857', '#16324F'],
  image: imageUrls[index % imageUrls.length]
}));

async function seedDatabase() {
  await Property.bulkWrite(properties.map(property => ({
    updateOne: { filter: { id: property.id }, update: { $set: property }, upsert: true }
  })));
  console.log(`EstateHUB catalogue ready: ${properties.length} properties.`);

  const username = process.env.DEMO_USERNAME || 'dhanu.shree';
  const password = process.env.DEMO_PASSWORD || 'Estate@123';
  const displayName = process.env.DEMO_DISPLAY_NAME || 'Dhanu Shree';
  const existingUser = await User.findOne({ username });

  if (!existingUser) {
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ username, passwordHash, displayName });
    console.log(`Seeded demo user: ${username}`);
  }
}

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication required.' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
  }
}

app.get('/api/health', async (_req, res) => {
  res.json({ status: mongoose.connection.readyState === 1 ? 'ok' : 'degraded', service: 'EstateHUB API', database: mongoose.connection.name || null });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const username = String(req.body?.username ?? '').trim();
    const password = String(req.body?.password ?? '');
    const displayName = String(req.body?.displayName ?? '').trim();

    if (!username || !password || !displayName) return res.status(400).json({ message: 'Username, password and display name are required.' });
    if (username.length < 3) return res.status(400).json({ message: 'Username must contain at least 3 characters.' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must contain at least 6 characters.' });

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(409).json({ message: 'Username already exists.' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash, displayName });
    res.status(201).json({ message: 'Account created successfully. You can now log in.', user: { username: user.username, displayName: user.displayName } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Unable to register.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const username = String(req.body?.username ?? '').trim();
    const password = String(req.body?.password ?? '');
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Invalid username or password.' });

    const token = jwt.sign({ sub: user.username, displayName: user.displayName }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user: { username: user.username, displayName: user.displayName } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Unable to log in.' });
  }
});

app.get('/api/properties', authenticate, async (_req, res) => {
  try {
    const result = await Property.find({}).select('-_id id title city community category type price beds baths sqft tag colors image').lean();
    res.json(result);
  } catch (error) {
    console.error('Properties error:', error);
    res.status(500).json({ message: 'Unable to load properties.' });
  }
});

app.get('/api/bookings', authenticate, async (req, res) => {
  try {
    const result = await Booking.find({ username: req.user.sub }).select('-_id id propertyId propertyTitle date time purpose status customer').sort({ createdAt: -1 }).lean();
    res.json(result);
  } catch (error) {
    console.error('Bookings error:', error);
    res.status(500).json({ message: 'Unable to load bookings.' });
  }
});

app.post('/api/bookings', authenticate, async (req, res) => {
  try {
    const { propertyId, propertyTitle, date, time, purpose } = req.body ?? {};
    if (!propertyId || !propertyTitle || !date || !time || !purpose) return res.status(400).json({ message: 'Property, date, time and purpose are required.' });

    const selectedDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(selectedDate.getTime()) || selectedDate < today) return res.status(400).json({ message: 'Booking date must be today or a future date.' });

    const property = await Property.findOne({ id: propertyId });
    if (!property) return res.status(404).json({ message: 'Property not found.' });

    const duplicate = await Booking.findOne({ propertyId, date, time, status: { $in: ['Pending', 'Confirmed'] } });
    if (duplicate) return res.status(409).json({ message: 'This property is already booked for the selected date and time.' });

    const booking = await Booking.create({
      id: `b${Date.now()}`,
      propertyId: property.id,
      propertyTitle: property.title,
      date,
      time,
      purpose,
      status: 'Pending',
      customer: req.user.displayName,
      username: req.user.sub
    });

    res.status(201).json({ id: booking.id, propertyId: booking.propertyId, propertyTitle: booking.propertyTitle, date: booking.date, time: booking.time, purpose: booking.purpose, status: booking.status, customer: booking.customer });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Could not create booking.' });
  }
});

app.delete('/api/bookings/:id', authenticate, async (req, res) => {
  try {
    const deleted = await Booking.findOneAndDelete({ id: req.params.id, username: req.user.sub });
    if (!deleted) return res.status(404).json({ message: 'Booking not found.' });
    res.json({ message: 'Booking cancelled.' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ message: 'Unable to cancel booking.' });
  }
});

async function startServer() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is missing. Add it to server/.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
    await seedDatabase();
    app.listen(PORT, () => console.log(`EstateHUB API running on http://localhost:${PORT}`));
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

startServer();
