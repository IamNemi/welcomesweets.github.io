#!/usr/bin/env node
// Seed menu items into Supabase from menu.md
// Usage: node seed-menu.mjs

const SUPABASE_URL = 'https://jfvgsaiobwaozbsdnaec.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdmdzYWlvYndhb3pic2RuYWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMDE5MDQsImV4cCI6MjA5Nzc3NzkwNH0.4WwDK2PKkrQ5DAASvCuEWToXDNadUMFOesPluVSrEBk';

// Category name → sort_order (must match existing categories)
const CATEGORY_MAP = {
  'Traditional Sweets': 1,
  'Savory Snacks(farsan)': 2,
  'Fast Food': 3,
};

// All items from menu.md (excluding S.No 501-503 which have "—" category)
const items = [
  { name: 'Samosa', price: '₹15', cat: 'Fast Food' },
  { name: 'Samosa Pav', price: '₹18', cat: 'Fast Food' },
  { name: 'Vada', price: '₹13', cat: 'Fast Food' },
  { name: 'Vada Pav', price: '₹15', cat: 'Fast Food' },
  { name: 'Bhajiya Pav', price: '₹18', cat: 'Fast Food' },
  { name: 'Cutlet', price: '₹15', cat: 'Fast Food' },
  { name: 'Kachori', price: '₹25', cat: 'Fast Food' },
  { name: 'Veg Cutlet', price: '₹15', cat: 'Fast Food' },
  { name: 'Patti Samosa', price: '₹15', cat: 'Fast Food' },
  { name: 'Sabudana Wada', price: '₹15', cat: 'Fast Food' },
  { name: 'Bhaji 100gm', price: '₹25', cat: 'Savory Snacks(farsan)' },
  { name: 'Khaman 100gm', price: '₹25', cat: 'Savory Snacks(farsan)' },
  { name: 'White Khaman 100gm', price: '₹25', cat: 'Savory Snacks(farsan)' },
  { name: 'Aloowadi 100gm', price: '₹25', cat: 'Savory Snacks(farsan)' },
  { name: 'Jalebi 100gm', price: '₹25', cat: 'Traditional Sweets' },
  { name: 'Jalebi', price: '₹240', cat: 'Traditional Sweets' },
  { name: 'Jalebi 250gm', price: '₹60', cat: 'Traditional Sweets' },
  { name: 'Khaman 250gm', price: '₹60', cat: 'Savory Snacks(farsan)' },
  { name: 'Aloowadi 250gm', price: '₹60', cat: 'Savory Snacks(farsan)' },
  { name: 'Imrati 250gm', price: '₹70', cat: 'Traditional Sweets' },
  { name: 'Fafda 250gm', price: '₹80', cat: 'Savory Snacks(farsan)' },
  { name: 'Papadi 250gm', price: '₹70', cat: 'Savory Snacks(farsan)' },
  { name: 'Gulab Jamun Pcs', price: '₹15', cat: 'Traditional Sweets' },
  { name: 'Kala Jamun', price: '₹15', cat: 'Traditional Sweets' },
  { name: 'D/F Jamun', price: '₹25', cat: 'Traditional Sweets' },
  { name: 'Mawa Gujiya', price: '₹20', cat: 'Traditional Sweets' },
  { name: 'Loong Lata', price: '₹25', cat: 'Traditional Sweets' },
  { name: 'Balusahi', price: '₹10', cat: 'Traditional Sweets' },
  { name: 'Rasgulla', price: '₹15', cat: 'Traditional Sweets' },
  { name: 'Rasmalai', price: '₹30', cat: 'Traditional Sweets' },
  { name: 'Kessar Wati', price: '₹20', cat: 'Traditional Sweets' },
  { name: 'Rajbhog', price: '₹30', cat: 'Traditional Sweets' },
  { name: 'Bengali Sweets', price: '₹35', cat: 'Traditional Sweets' },
  { name: 'Pani Puri', price: '₹25', cat: 'Fast Food' },
  { name: 'Sev Puri', price: '₹30', cat: 'Fast Food' },
  { name: 'Ragda Puri', price: '₹30', cat: 'Fast Food' },
  { name: 'Gila Bhel', price: '₹30', cat: 'Fast Food' },
  { name: 'Sukha Bhel', price: '₹25', cat: 'Fast Food' },
  { name: 'Cheese Dahi Puri', price: '₹40', cat: 'Fast Food' },
  { name: 'Samosa Chat', price: '₹40', cat: 'Fast Food' },
  { name: 'Sada S/W', price: '₹30', cat: 'Fast Food' },
  { name: 'Toast S/W', price: '₹40', cat: 'Fast Food' },
  { name: 'Veg Cheese S/W', price: '₹50', cat: 'Fast Food' },
  { name: 'Masala Toast S/W', price: '₹40', cat: 'Fast Food' },
  { name: 'Cheese Toast S/W', price: '₹60', cat: 'Fast Food' },
  { name: 'Chz Chilly Toast S/W', price: '₹70', cat: 'Fast Food' },
  { name: 'Veg Grill S/W', price: '₹90', cat: 'Fast Food' },
  { name: 'Cheese Grill S/W', price: '₹110', cat: 'Fast Food' },
  { name: 'Paneer Chz Grill S', price: '₹140', cat: 'Fast Food' },
  { name: 'Veg Franky', price: '₹30', cat: 'Fast Food' },
  { name: 'Noodles Franky', price: '₹35', cat: 'Fast Food' },
  { name: 'Mayonoise Franky', price: '₹40', cat: 'Fast Food' },
  { name: 'Chz Mayo Franky', price: '₹60', cat: 'Fast Food' },
  { name: 'Khaman', price: '₹240', cat: 'Savory Snacks(farsan)' },
  { name: 'Aloowadi', price: '₹240', cat: 'Savory Snacks(farsan)' },
  { name: 'Imrati', price: '₹280', cat: 'Traditional Sweets' },
  { name: 'Kanda Bhaji', price: '₹240', cat: 'Savory Snacks(farsan)' },
  { name: 'Aloo Bhaji', price: '₹240', cat: 'Savory Snacks(farsan)' },
  { name: 'Farsan', price: '₹240', cat: 'Savory Snacks(farsan)' },
  { name: 'Kaju Kalti', price: '₹900', cat: 'Traditional Sweets' },
  { name: 'Kessar Kaju Katli', price: '₹1000', cat: 'Traditional Sweets' },
  { name: 'Sugar Free K/Kt', price: '₹1000', cat: 'Traditional Sweets' },
  { name: 'Dry Fruits Sweet', price: '₹1200', cat: 'Traditional Sweets' },
  { name: 'Spl Dry Fruit', price: '₹1200', cat: 'Traditional Sweets' },
  { name: 'Sugar Free Sweet', price: '₹1200', cat: 'Traditional Sweets' },
  { name: 'Dry Fruit Barfi', price: '₹720', cat: 'Traditional Sweets' },
  { name: 'Malai Barfi', price: '₹600', cat: 'Traditional Sweets' },
  { name: 'Rose Barfi', price: '₹600', cat: 'Traditional Sweets' },
  { name: 'Anjeer Barfi', price: '₹600', cat: 'Traditional Sweets' },
  { name: 'Mango Barfi', price: '₹600', cat: 'Traditional Sweets' },
  { name: 'Malai Pista Barfi', price: '₹680', cat: 'Traditional Sweets' },
  { name: 'Malai Cake', price: '₹600', cat: 'Traditional Sweets' },
  { name: 'Malai Choco Barfi', price: '₹560', cat: 'Traditional Sweets' },
  { name: 'Pista Barfi', price: '₹400', cat: 'Traditional Sweets' },
  { name: 'S/F Mawa Barfi', price: '₹440', cat: 'Traditional Sweets' },
  { name: 'Kesar Malai Peda', price: '₹560', cat: 'Traditional Sweets' },
  { name: 'Malai Peda', price: '₹520', cat: 'Traditional Sweets' },
  { name: 'Mathura Peda', price: '₹520', cat: 'Traditional Sweets' },
  { name: 'Kesar Malai Puri', price: '₹480', cat: 'Traditional Sweets' },
  { name: 'S/F Malai Puri', price: '₹440', cat: 'Traditional Sweets' },
  { name: 'Sangam Roll', price: '₹520', cat: 'Traditional Sweets' },
  { name: 'Badam Kalli', price: '₹520', cat: 'Traditional Sweets' },
  { name: 'Malai Kachori', price: '₹520', cat: 'Traditional Sweets' },
  { name: 'Yellow Peda', price: '₹400', cat: 'Traditional Sweets' },
  { name: 'White Peda', price: '₹400', cat: 'Traditional Sweets' },
  { name: 'D/F Badam Halwa', price: '₹400', cat: 'Traditional Sweets' },
  { name: 'D/F Halwa', price: '₹480', cat: 'Traditional Sweets' },
  { name: 'Kessar Halwa', price: '₹400', cat: 'Traditional Sweets' },
  { name: 'Mahim Halwa', price: '₹400', cat: 'Traditional Sweets' },
  { name: 'Mysore Pak', price: '₹320', cat: 'Traditional Sweets' },
  { name: 'D. Ladoo', price: '₹520', cat: 'Traditional Sweets' },
  { name: 'Methi Ladoo', price: '₹400', cat: 'Traditional Sweets' },
  { name: 'Spl Bessan Ladoo', price: '₹320', cat: 'Traditional Sweets' },
  { name: 'Sada Bessan Ladoo', price: '₹240', cat: 'Traditional Sweets' },
  { name: 'Boondi Ladoo', price: '₹280', cat: 'Traditional Sweets' },
  { name: 'Mothichur Ladoo', price: '₹240', cat: 'Traditional Sweets' },
  { name: 'Spl D/G Boondi Ladoo', price: '₹400', cat: 'Traditional Sweets' },
  { name: 'Boondi', price: '₹240', cat: 'Savory Snacks(farsan)' },
  { name: 'Bhajini Chakli', price: '₹240', cat: 'Savory Snacks(farsan)' },
  { name: 'Poha Chura', price: '₹200', cat: 'Savory Snacks(farsan)' },
  { name: 'Karanji', price: '₹200', cat: 'Traditional Sweets' },
  { name: 'Sankar Pada', price: '₹200', cat: 'Savory Snacks(farsan)' },
  { name: 'Nan Khatai Biscu', price: '₹200', cat: 'Savory Snacks(farsan)' },
  { name: 'Bhakarwadi', price: '₹200', cat: 'Savory Snacks(farsan)' },
  { name: 'Kachori', price: '₹200', cat: 'Savory Snacks(farsan)' },
  { name: 'Patti Samosa', price: '₹240', cat: 'Savory Snacks(farsan)' },
  { name: 'Masala Roll', price: '₹240', cat: 'Savory Snacks(farsan)' },
  { name: 'Farali Chiwda', price: '₹280', cat: 'Savory Snacks(farsan)' },
  { name: 'Sada Chakli', price: '₹200', cat: 'Savory Snacks(farsan)' },
  { name: 'Schzwan Chakli', price: '₹240', cat: 'Savory Snacks(farsan)' },
  { name: 'Bhakhra', price: '₹200', cat: 'Savory Snacks(farsan)' },
  { name: 'Kela Wafer', price: '₹360', cat: 'Savory Snacks(farsan)' },
  { name: 'Aloo Waffers', price: '₹300', cat: 'Savory Snacks(farsan)' },
  { name: 'Methiwadi', price: '₹240', cat: 'Savory Snacks(farsan)' },
  { name: 'Spl Mawa Bhujiya', price: '₹320', cat: 'Savory Snacks(farsan)' },
  { name: 'Sada Mix Mithai', price: '₹400', cat: 'Traditional Sweets' },
  { name: 'Spl Mix Mithai', price: '₹600', cat: 'Traditional Sweets' },
  { name: 'D/F Mix Mithai', price: '₹1200', cat: 'Traditional Sweets' },
  { name: 'Spl Mirchi Wada', price: '₹15', cat: 'Fast Food' },
  { name: 'Kanda Kachori', price: '₹20', cat: 'Fast Food' },
  { name: 'Bhajiya 250gm', price: '₹50', cat: 'Savory Snacks(farsan)' },
  { name: 'Pav', price: '₹3', cat: 'Fast Food' },
];

async function main() {
  // Step 0: Sign in as admin (required for inserts via RLS)
  const email = process.env.ADMIN_EMAIL || 'admin@welcomesweets.qd.je';
  const password = process.env.ADMIN_PASSWORD || 'admin';
  if (!password) {
    console.error('Set ADMIN_PASSWORD env var: ADMIN_PASSWORD=yourpassword node seed-menu.mjs');
    process.exit(1);
  }
  console.log(`Signing in as ${email}...`);
  const authRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const authData = await authRes.json();
  if (authData.error) {
    console.error('Auth failed:', authData.error_description || authData.error);
    process.exit(1);
  }
  console.log('Auth response keys:', Object.keys(authData));
  const token = authData.access_token || authData.session?.access_token;
  if (!token) {
    console.error('No token in auth response:', JSON.stringify(authData).slice(0, 500));
    process.exit(1);
  }
  console.log('Authenticated. Token preview:', token.slice(0, 20) + '...');

  // Step 1: Fetch existing categories to get their IDs
  console.log('Fetching categories...');
  const catRes = await fetch(`${SUPABASE_URL}/rest/v1/categories?select=*`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${token}`,
    },
  });
  const categories = await catRes.json();

  const catIdMap = {};
  for (const cat of categories) {
    catIdMap[cat.name] = cat.id;
  }
  console.log('Categories found:', Object.keys(catIdMap).join(', '));

  // Check for missing categories
  for (const name of Object.keys(CATEGORY_MAP)) {
    if (!catIdMap[name]) {
      console.error(`Category "${name}" not found in database!`);
      process.exit(1);
    }
  }

  // Step 2: Fetch existing items to avoid duplicates
  console.log('Checking existing items...');
  const existRes = await fetch(`${SUPABASE_URL}/rest/v1/menu_items?select=name`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${token}`,
    },
  });
  const existing = await existRes.json();
  const existingNames = new Set(existing.map((i) => i.name));

  // Step 3: Insert items in batches
  const toInsert = items
    .filter((item) => !existingNames.has(item.name))
    .map((item, idx) => ({
      category_id: catIdMap[item.cat],
      name: item.name,
      price: item.price,
      description: '',
      image_url: '',
      sort_order: idx + 1,
      popular: false,
    }));

  if (toInsert.length === 0) {
    console.log('All items already exist. Nothing to insert.');
    return;
  }

  console.log(`Inserting ${toInsert.length} items (${items.length - toInsert.length} skipped as duplicates)...`);

  // Supabase has a row limit per request, batch in groups of 50
  const BATCH_SIZE = 50;
  let inserted = 0;
  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const batch = toInsert.slice(i, i + BATCH_SIZE);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/menu_items`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(batch),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, err);
      process.exit(1);
    }
    inserted += batch.length;
    console.log(`  Inserted ${inserted}/${toInsert.length}`);
  }

  console.log(`Done! ${inserted} items inserted.`);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
