import { pool } from './src/config/database.js'; // Adjust path if needed
import { faker } from '@faker-js/faker';

const TOTAL_RECORDS = 1000;

const seedDatabase = async () => {
  console.log(`🌱 Generating ${TOTAL_RECORDS} random schools...`);

  // 1. Generate data in memory first
  const schoolsData = [];
  for (let i = 0; i < TOTAL_RECORDS; i++) {
    // Creating realistic-sounding school names
    const schoolName = `${faker.location.city()} ${faker.helpers.arrayElement(['High', 'Academy', 'Public School', 'Institute', 'Grammar'])}`;
    
    // We push an ARRAY of values, not an object. This is required for bulk inserts.
    schoolsData.push([
      schoolName,
      faker.location.streetAddress(),
      faker.location.latitude(),
      faker.location.longitude()
    ]);
  }

  try {
    // 2. Clear out old data
    await pool.query('TRUNCATE TABLE schools');
    console.log('🗑️  Cleared existing schools data.');

    console.log('⏳ Pushing bulk data to the cloud...');
    
    // 3. The Bulk Insert
    // Note: We MUST use pool.query here, not pool.execute. 
    // pool.query supports the double-array syntax [[]] needed for bulk inserts.
    const [result] = await pool.query(
      `INSERT INTO schools (name, address, latitude, longitude) VALUES ?`,
      [schoolsData]
    );

    console.log(`✅ Success! Inserted ${result.affectedRows} rows in a single query.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    process.exit(1);
  }
};

seedDatabase();