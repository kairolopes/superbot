const { Client } = require('pg');

// Adjust connection string for local execution (host machine -> docker container port mapped to localhost)
// Original: postgresql://user:pass@postgres:5432/evolution_db?schema=evolution_api
// Local: postgresql://user:pass@localhost:5432/evolution_db?schema=evolution_api
// Use credentials from .env but change host to localhost
const connectionString = 'postgresql://admin:admin@localhost:5432/evolution_db?schema=evolution_api';

const client = new Client({
  connectionString: connectionString,
});

async function check() {
  try {
    await client.connect();
    console.log('Connected to database successfully!');

    // Check Instance table
    const resInstances = await client.query('SELECT * FROM "Instance"');
    console.log('Instances found:', resInstances.rows.length);
    resInstances.rows.forEach(row => {
        console.log(`- Name: ${row.name}, ID: ${row.id}, Status: ${row.connectionStatus}`);
    });

    // Check Webhook table for kairo2 (if exists) or all webhooks
    const resWebhooks = await client.query('SELECT * FROM "Webhook"');
    console.log('\nWebhooks found:', resWebhooks.rows.length);
    resWebhooks.rows.forEach(row => {
        console.log(`- InstanceID: ${row.instanceId}, Enabled: ${row.enabled}, URL: ${row.url}`);
    });
    
    // Check Settings table
    const resSettings = await client.query('SELECT * FROM "Setting"');
    console.log('\nSettings found:', resSettings.rows.length);
     resSettings.rows.forEach(row => {
        console.log(`- InstanceID: ${row.instanceId}, RejectCall: ${row.rejectCall}`);
    });

  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    await client.end();
  }
}

check();
