#!/usr/bin/env node

const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

console.log('\n🔐 Password Hashing Utility\n');
console.log('This will generate a hashed password for your .env file.\n');

rl.question('Enter password to hash: ', (password) => {
  if (!password) {
    console.error('❌ Password cannot be empty');
    rl.close();
    return;
  }

  const hashed = hashPassword(password);

  console.log('\n✅ Password hashed successfully!\n');
  console.log('Add this to your .env file:');
  console.log('─'.repeat(60));
  console.log(`ADMIN_PASSWORD=${hashed}`);
  console.log('─'.repeat(60));
  console.log('\n⚠️  Save this hashed value in your .env file.');
  console.log('   The original password cannot be recovered from the hash.\n');

  rl.close();
});
