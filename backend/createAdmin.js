const bcrypt = require('bcryptjs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('users.json');
const db = low(adapter);
db.defaults({ users: [] }).write();

async function createAdmin() {
  const existing = db.get('users').find({ email: 'admin@shop.com' }).value();
  if (existing) {
    console.log('✅ Admin already exists!');
    console.log('📧 Email: admin@shop.com');
    console.log('🔑 Password: admin123');
    process.exit(0);
  }
  const hashed = await bcrypt.hash('admin123', 10);
  db.get('users').push({
    id: Date.now().toString(),
    name: 'Admin',
    email: 'admin@shop.com',
    password: hashed,
    role: 'admin',
    createdAt: new Date().toISOString(),
  }).write();
  console.log('✅ Admin created!');
  console.log('📧 Email: admin@shop.com');
  console.log('🔑 Password: admin123');
  process.exit(0);
}

createAdmin();
