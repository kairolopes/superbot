
const apiKey = 'B8D6946A36444E9382103E5C70404739';
const instanceName = 'kairo2';
const baseUrl = 'https://evolution-api-1p4o.onrender.com';

async function checkWebsocket() {
    console.log(`Checking WebSocket status for ${instanceName}...`);
    try {
        const response = await fetch(`${baseUrl}/websocket/find/${instanceName}`, {
            method: 'GET',
            headers: {
                'apikey': apiKey
            }
        });

        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error(text);
        } else {
            const data = await response.json();
            console.log('WebSocket Configuration:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }

    console.log(`Fetching all instances...`);
    try {
        const response = await fetch(`${baseUrl}/instance/fetchInstances`, {
            method: 'GET',
            headers: {
                'apikey': apiKey
            }
        });

        const data = await response.json();
        console.log('All Instances:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

checkWebsocket();
