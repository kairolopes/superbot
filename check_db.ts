
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Override the connection URI to point to localhost for local execution
process.env.DATABASE_CONNECTION_URI = 'postgresql://user:pass@localhost:5432/evolution_db?schema=evolution_api';

const prisma = new PrismaClient();

async function main() {
  const instanceName = 'kairo2';
  console.log(`Checking instance: ${instanceName}...`);
  
  try {
    const instance = await prisma.instance.findUnique({
      where: { name: instanceName },
      include: { Websocket: true, Webhook: true }
    });

    if (!instance) {
      console.log(`Instance '${instanceName}' not found.`);
    } else {
      console.log('Instance found:', JSON.stringify(instance, null, 2));
      
      if (instance.Websocket) {
        console.log('Websocket configuration:', instance.Websocket);
      } else {
        console.log('No Websocket configuration found.');
      }
      
      if (instance.Webhook) {
        console.log('Webhook configuration:', instance.Webhook);
      } else {
        console.log('No Webhook configuration found.');
      }
    }
  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
