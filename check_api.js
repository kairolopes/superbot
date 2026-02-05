const apiKey = 'evolution-api-secret-key-123456';
const baseUrl = 'https://evolution-api-1p4o.onrender.com';

async function check() {
  try {
    console.log('Fetching instances...');
    const resInstances = await fetch(`${baseUrl}/instance/fetchInstances`, {
      headers: { apikey: apiKey }
    });
    console.log('Instances Status:', resInstances.status);
    const instances = await resInstances.json();
    console.log('Instances:', JSON.stringify(instances, null, 2));

    const instanceName = instances.length > 0 ? instances[0].name : 'kairo2';
    console.log(`\nChecking details for instance: ${instanceName}`);

    // Check Connection State
    const resState = await fetch(`${baseUrl}/instance/connectionState/${instanceName}`, {
      headers: { apikey: apiKey }
    });
    console.log('Connection State:', await resState.json());

    // Check Webhook
    const resWebhook = await fetch(`${baseUrl}/webhook/find/${instanceName}`, {
      headers: { apikey: apiKey }
    });
    console.log('Webhook Config:', await resWebhook.json());

  } catch (error) {
    console.error('Error:', error);
  }
}

check();
