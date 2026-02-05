import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const instanceName = 'kairo2';
  console.log(`Checking instance: ${instanceName}`);
  
  const instance = await prisma.instance.findUnique({
    where: { name: instanceName },
    include: { Websocket: true, Webhook: true }
  });

  if (!instance) {
    console.log(`Instance ${instanceName} not found`);
  } else {
    console.log('Instance found:');
    console.log(JSON.stringify(instance, null, 2));
    
    // Check global websocket config via env might be needed but this checks DB
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
