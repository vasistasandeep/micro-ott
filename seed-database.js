// Simplified seed script that actually works
const { Client } = require('pg');

const client = new Client({
  host: 'ep-cool-leaf-aim15nlg-pooler.c-4.us-east-1.aws.neon.tech',
  port: 5432,
  database: 'neondb',
  user: 'neondb_owner',
  password: 'npg_WJQ3sodu9Uyr',
  ssl: { rejectUnauthorized: false },
});

// Movie titles
const movieTitles = [
  'The Last Journey', 'Shadow Warriors', 'Midnight Express', 'Desert Storm', 'Ocean Deep',
  'Mountain Peak', 'City Lights', 'Dark Horizon', 'Silent Echo', 'Broken Dreams',
  'Rising Sun', 'Fallen Angels', 'Lost Paradise', 'Hidden Truth', 'Secret Mission',
  'Final Countdown', 'Endless Night', 'Golden Dawn', 'Silver Lining', 'Crystal Clear',
  'Thunder Strike', 'Lightning Bolt', 'Storm Chaser', 'Wind Runner', 'Fire Starter'
];

const descriptions = [
  'An epic adventure that will keep you on the edge of your seat',
  'A thrilling story of courage and determination',
  'Experience the journey of a lifetime',
  'A masterpiece of modern cinema',
  'Unforgettable characters in an incredible story'
];

async function seedDatabase() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Clear existing test data
    await client.query("DELETE FROM content WHERE title LIKE 'Test%' OR title LIKE 'The Last%' OR title LIKE 'Shadow%'");
    
    console.log('🎬 Inserting 50 movies...\n');

    for (let i = 0; i < 50; i++) {
      const title = `${movieTitles[i % movieTitles.length]} ${i + 1}`;
      const description = descriptions[i % descriptions.length];
      const year = 2020 + (i % 5);
      const duration = 90 + (i % 60);
      const rating = ['PG', 'PG-13', 'R'][i % 3];
      const tier = i % 3 === 0 ? 'premium' : 'free';
      
      await client.query(`
        INSERT INTO content (
          type, title, description, release_date, duration_minutes,
          maturity_rating, poster_url, thumbnail_url, workflow_state,
          tier_requirement, published_at
        ) VALUES (
          'movie', $1, $2, $3, $4, $5, $6, $7, 'published', $8, NOW()
        )
      `, [
        title,
        description,
        `${year}-01-01`,
        duration,
        rating,
        `https://picsum.photos/seed/movie${i}/400/600`,
        `https://picsum.photos/seed/thumb${i}/400/225`,
        tier
      ]);

      if ((i + 1) % 10 === 0) {
        console.log(`  ✓ Inserted ${i + 1} movies...`);
      }
    }

    console.log('\n✅ 50 movies inserted successfully!\n');

    // Verify
    const count = await client.query('SELECT COUNT(*) FROM content');
    console.log(`📊 Total content in database: ${count.rows[0].count}`);

    // Sample
    const sample = await client.query('SELECT title, type FROM content LIMIT 5');
    console.log('\n📋 Sample content:');
    sample.rows.forEach(row => {
      console.log(`  - ${row.title} (${row.type})`);
    });

    console.log('\n🎉 Database seeded successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

seedDatabase();
