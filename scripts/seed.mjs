#!/usr/bin/env node
/**
 * Aurapan data seeder.
 *
 * Creates an admin user, a couple of demo customers and ~10 realistic
 * women's-clothing products THROUGH THE PUBLIC APIs, so that product data is
 * replicated to the order/payment services via NATS events exactly like real
 * traffic (a direct DB insert would desync those services).
 *
 * The only direct database access is a one-time flip of `isAdmin: true` on
 * the admin user, because the signup API (correctly) does not let callers
 * grant themselves admin rights.
 *
 * Configuration (env vars):
 *   API_URL             base URL of the shop          (default http://aurapan.local)
 *   HOST_HEADER         optional Host header override (e.g. when API_URL is an IP)
 *   MONGO_URI_USER      user-service MongoDB URI      (default mongodb://localhost:27018/users-db,
 *                       matching: kubectl port-forward svc/user-mongo-srv 27018:27017)
 *   SEED_ADMIN_PASSWORD password for all seeded users (default password123)
 *
 * The script is idempotent: existing users and products (matched by email /
 * title) are skipped, so it can be re-run safely.
 */

import axios from 'axios';
import { MongoClient } from 'mongodb';

const API_URL = (process.env.API_URL ?? 'http://aurapan.local').replace(/\/+$/, '');
const HOST_HEADER = process.env.HOST_HEADER;
const MONGO_URI_USER = process.env.MONGO_URI_USER ?? 'mongodb://localhost:27018/users-db';
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'password123';

const ADMIN_EMAIL = 'admin@aurapan.com';

const log = (msg) => console.log(`[seed] ${msg}`);
const fail = (msg) => {
  console.error(`[seed] ERROR: ${msg}`);
  process.exit(1);
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  // We inspect status codes ourselves for clearer error messages.
  validateStatus: () => true,
  headers: HOST_HEADER ? { Host: HOST_HEADER } : {},
});

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const USERS = [
  {
    email: ADMIN_EMAIL,
    name: 'Aurapan Admin',
    gender: 'female',
    age: 30,
    bio: 'Store administrator',
  },
  {
    email: 'emma@example.com',
    name: 'Emma Carter',
    gender: 'female',
    age: 27,
    bio: 'Loves minimalist wardrobe staples',
    shippingAddress: {
      address: '12 Rosewood Lane',
      city: 'Portland',
      postalCode: '97201',
      country: 'USA',
    },
  },
  {
    email: 'sofia@example.com',
    name: 'Sofia Nilsson',
    gender: 'female',
    age: 33,
    bio: 'Weekend vintage hunter',
    shippingAddress: {
      address: 'Storgatan 8',
      city: 'Stockholm',
      postalCode: '114 51',
      country: 'Sweden',
    },
  },
];

// `images.image1` is required by the product model; the client renders image
// srcs containing "aurapan" through Cloudinary
// (https://res.cloudinary.com/thasup/image/upload/...). These are placeholder
// paths in that format — upload your own assets with matching public IDs, or
// edit the products in the admin dashboard afterwards.
const img = (slug, n) => `v1700000000/aurapan/products/${slug}-${n}.jpg`;

const product = ({ slug, ...rest }) => ({
  image1: img(slug, 1),
  image2: img(slug, 2),
  image3: img(slug, 3),
  image4: img(slug, 4),
  ...rest,
});

// category MUST be one of: Top | Bottom | Dress | Coat | Set
// (the client category pages filter with exact-case comparison).
// colors/sizes are comma-separated strings (client splits on ",").
const PRODUCTS = [
  product({
    slug: 'silk-wrap-blouse',
    title: 'Silk Wrap Blouse',
    price: 58,
    category: 'Top',
    brand: 'Aurapan',
    colors: 'ivory,black,dustyrose',
    sizes: 'XS,S,M,L',
    material: '100% mulberry silk',
    countInStock: 25,
    description:
      'A fluid wrap blouse cut from washable mulberry silk with a soft V-neckline, ' +
      'self-tie waist and slightly puffed shoulders. Dress it up with tailoring or ' +
      'down with denim — it drapes beautifully either way.',
  }),
  product({
    slug: 'ribbed-knit-tank',
    title: 'Ribbed Knit Tank Top',
    price: 24,
    category: 'Top',
    brand: 'Everyday Studio',
    colors: 'white,sage,charcoal',
    sizes: 'XS,S,M,L,XL',
    material: '95% organic cotton, 5% elastane',
    countInStock: 40,
    description:
      'The layering essential: a double-ribbed tank with a square neck and a close ' +
      'but breathable fit. Pre-washed so it keeps its shape, in a weighty organic ' +
      'cotton rib that does not go sheer.',
  }),
  product({
    slug: 'high-rise-wide-leg-trousers',
    title: 'High-Rise Wide-Leg Trousers',
    price: 72,
    category: 'Bottom',
    brand: 'Atelier 9',
    colors: 'black,camel,navy',
    sizes: 'XS,S,M,L,XL',
    material: '64% viscose, 33% polyamide, 3% elastane',
    countInStock: 30,
    description:
      'Sharp-pleated trousers with an extra-high rise and a floor-skimming wide leg. ' +
      'The drapey twill falls cleanly without clinging, and the elasticated back ' +
      'waistband keeps them comfortable through a full day at the office.',
  }),
  product({
    slug: 'pleated-midi-skirt',
    title: 'Pleated Satin Midi Skirt',
    price: 49,
    category: 'Bottom',
    brand: 'Aurapan',
    colors: 'champagne,emerald,black',
    sizes: 'XS,S,M,L',
    material: '100% recycled polyester satin',
    countInStock: 35,
    description:
      'Knife-pleated satin skirt that catches the light with every step. Sits high ' +
      'on the waist with a concealed zip and hits mid-calf — pair with chunky knits ' +
      'in winter or a fitted tank in summer.',
  }),
  product({
    slug: 'floral-wrap-midi-dress',
    title: 'Floral Wrap Midi Dress',
    price: 89,
    category: 'Dress',
    brand: 'Maison Fleur',
    colors: 'bluefloral,redfloral',
    sizes: 'XS,S,M,L,XL',
    material: '100% LENZING ECOVERO viscose',
    countInStock: 28,
    description:
      'A true wrap dress in a painterly floral print, with a ruffled hem, flutter ' +
      'sleeves and a waist tie you can adjust all day. The midi length and bias cut ' +
      'flatter every figure — our most re-ordered dress.',
  }),
  product({
    slug: 'slip-satin-maxi-dress',
    title: 'Bias-Cut Satin Slip Dress',
    price: 95,
    category: 'Dress',
    brand: 'Atelier 9',
    colors: 'champagne,slate,black',
    sizes: 'XS,S,M,L',
    material: '100% satin-finish viscose',
    countInStock: 18,
    description:
      'Cut on the bias so it skims rather than clings, this maxi slip dress has ' +
      'adjustable spaghetti straps, a delicate cowl neck and a side slit. ' +
      'Wedding-guest ready, but just as good over a tee.',
  }),
  product({
    slug: 'smocked-mini-dress',
    title: 'Smocked Puff-Sleeve Mini Dress',
    price: 54,
    category: 'Dress',
    brand: 'Everyday Studio',
    colors: 'gingham,lemon,white',
    sizes: 'XS,S,M,L,XL',
    material: '100% organic cotton poplin',
    countInStock: 32,
    description:
      'Crisp cotton poplin mini with a fully smocked bodice — zero zips, maximum ' +
      'comfort — voluminous puff sleeves and a tiered skirt. Throw it on with ' +
      'sandals and go.',
  }),
  product({
    slug: 'double-breasted-wool-coat',
    title: 'Double-Breasted Wool Coat',
    price: 159,
    category: 'Coat',
    brand: 'North & Pine',
    colors: 'camel,charcoal,black',
    sizes: 'XS,S,M,L,XL',
    material: '70% wool, 20% polyamide, 10% cashmere',
    countInStock: 15,
    description:
      'The forever coat: a tailored double-breasted silhouette in a brushed ' +
      'wool-cashmere blend, fully lined, with horn-effect buttons, deep pockets ' +
      'and a back vent. Falls just below the knee.',
  }),
  product({
    slug: 'cropped-trench-jacket',
    title: 'Cropped Trench Jacket',
    price: 98,
    category: 'Coat',
    brand: 'Aurapan',
    colors: 'beige,khaki',
    sizes: 'XS,S,M,L',
    material: '60% cotton, 40% recycled polyester, water-repellent finish',
    countInStock: 22,
    description:
      'All the trench details — storm flap, horn buttons, buckled cuffs — cropped ' +
      'to hip length so it works with wide-leg trousers and maxi skirts. '
      + 'Water-repellent for in-between weather.',
  }),
  product({
    slug: 'knit-lounge-set',
    title: 'Soft-Knit Lounge Set',
    price: 79,
    category: 'Set',
    brand: 'Everyday Studio',
    colors: 'oatmeal,sage,greymarl',
    sizes: 'XS,S,M,L,XL',
    material: '50% viscose, 28% polyester, 22% nylon',
    countInStock: 26,
    description:
      'A two-piece set in our cloud-soft sweater knit: a relaxed crew-neck top and ' +
      'matching wide-leg pants with a covered elastic waist. Wear together for ' +
      'travel days or split them across the rest of your wardrobe.',
  }),
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const cookiesFrom = (res) => {
  const setCookie = res.headers['set-cookie'];
  if (!setCookie || setCookie.length === 0) return null;
  return setCookie.map((c) => c.split(';')[0]).join('; ');
};

async function waitForApi() {
  const maxAttempts = 30;
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      const res = await api.get('/api/products');
      if (res.status === 200) {
        log(`API is up at ${API_URL} (${res.data.length} existing products)`);
        return;
      }
      log(`waiting for API... attempt ${i}/${maxAttempts} (status ${res.status})`);
    } catch (err) {
      log(`waiting for API... attempt ${i}/${maxAttempts} (${err.code ?? err.message})`);
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
  fail(`API at ${API_URL} did not become ready. Is the cluster running and the hosts entry / ingress in place?`);
}

async function signIn(email) {
  const res = await api.post('/api/users/signin', { email, password: PASSWORD });
  if (res.status === 200) return cookiesFrom(res);
  return null;
}

async function ensureUser(user) {
  const existing = await signIn(user.email);
  if (existing) {
    log(`user ${user.email} already exists — skipping signup`);
    return existing;
  }
  const res = await api.post('/api/users/signup', { ...user, password: PASSWORD });
  if (res.status !== 201) {
    fail(`signup failed for ${user.email}: HTTP ${res.status} ${JSON.stringify(res.data)}`);
  }
  log(`created user ${user.email}`);
  return cookiesFrom(res);
}

async function promoteAdmin() {
  log(`promoting ${ADMIN_EMAIL} to admin via ${MONGO_URI_USER.replace(/\/\/[^@]*@/, '//***@')}`);
  const client = new MongoClient(MONGO_URI_USER, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    const result = await client.db().collection('users').updateOne(
      { email: ADMIN_EMAIL },
      { $set: { isAdmin: true } }
    );
    if (result.matchedCount === 0) {
      fail(`no user with email ${ADMIN_EMAIL} found in the user database — wrong MONGO_URI_USER?`);
    }
    log(result.modifiedCount === 1 ? 'admin flag set' : 'admin flag was already set');
  } catch (err) {
    fail(
      `could not reach the user MongoDB (${err.message}). ` +
      'For local clusters run: kubectl port-forward svc/user-mongo-srv 27018:27017'
    );
  } finally {
    await client.close();
  }
}

async function seedProducts(adminCookie) {
  const listRes = await api.get('/api/products');
  if (listRes.status !== 200) {
    fail(`could not list products: HTTP ${listRes.status}`);
  }
  const existingTitles = new Set(listRes.data.map((p) => p.title));

  let created = 0;
  for (const p of PRODUCTS) {
    if (existingTitles.has(p.title)) {
      log(`product "${p.title}" already exists — skipping`);
      continue;
    }
    const res = await api.post('/api/products', p, { headers: { Cookie: adminCookie } });
    if (res.status !== 201) {
      fail(`creating "${p.title}" failed: HTTP ${res.status} ${JSON.stringify(res.data)}`);
    }
    log(`created product "${p.title}" (${p.category}, $${p.price})`);
    created++;
  }
  return created;
}

async function verifyProducts() {
  const res = await api.get('/api/products');
  if (res.status !== 200) fail(`verification failed: HTTP ${res.status}`);
  const titles = new Set(res.data.map((p) => p.title));
  const missing = PRODUCTS.filter((p) => !titles.has(p.title));
  if (missing.length > 0) {
    fail(`verification failed — missing products: ${missing.map((p) => p.title).join(', ')}`);
  }
  log(`verification OK: ${res.data.length} products in the catalog`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

log(`seeding ${API_URL}${HOST_HEADER ? ` (Host: ${HOST_HEADER})` : ''}`);

await waitForApi();

// 1. Users (admin + demo customers)
for (const user of USERS) {
  await ensureUser(user);
}

// 2. Promote the admin directly in the user DB (one-time, unavoidable)
await promoteAdmin();

// 3. Fresh sign-in so the session JWT carries isAdmin: true
const adminCookie = await signIn(ADMIN_EMAIL);
if (!adminCookie) fail(`could not sign in as ${ADMIN_EMAIL} after promotion`);
log('signed in as admin');

// 4. Products through the real API → NATS events reach order/payment services
const created = await seedProducts(adminCookie);

// 5. Verify
await verifyProducts();

log(`done — ${created} new product(s) created.`);
log(`sign in as ${ADMIN_EMAIL} / ${PASSWORD === 'password123' ? 'password123' : '<SEED_ADMIN_PASSWORD>'} to manage the store.`);
