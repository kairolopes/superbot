import { io } from "socket.io-client";
import axios from "axios";

const API_KEY = "evolution-api-secret-key-123456";
const BASE_URL = "https://evolution-api-1p4o.onrender.com";
const INSTANCE_NAME = "Principal"; 

async function main() {
  console.log(`Starting test_message_flow against ${BASE_URL}...`);

  // 1. Fetch Instances
  try {
    console.log("Fetching instances...");
    const instancesRes = await axios.get(`${BASE_URL}/instance/fetchInstances`, {
      headers: { apikey: API_KEY }
    });
    
    console.log("Fetch success. Data:", JSON.stringify(instancesRes.data, null, 2));
    const instances = instancesRes.data;
    let targetInstance = instances.find((i: any) => i.name === INSTANCE_NAME);

    if (!targetInstance) {
      console.log(`Instance ${INSTANCE_NAME} not found. Checking available...`);
      if (instances.length > 0) {
          targetInstance = instances[0];
          console.log(`Using available instance: ${targetInstance.name}`);
      } else {
          console.error("No instances available on server.");
          return;
      }
    }
    
    const currentInstanceName = targetInstance.name;
    const ownerNumber = targetInstance.ownerJid ? targetInstance.ownerJid.split('@')[0] : "5511999999999";
    console.log(`Using Instance: ${currentInstanceName} (Status: ${targetInstance.connectionStatus})`);
    console.log(`Target Number: ${ownerNumber}`);

    // 2. Connect WebSocket
    const namespaceUrl = `${BASE_URL}/${currentInstanceName}`;
    console.log(`Connecting WebSocket to: ${namespaceUrl}`);
    
    const socket = io(namespaceUrl, {
      transports: ['websocket', 'polling'],
      forceNew: true,
      query: {
        apikey: API_KEY
      }
    });

    let sendEventReceived = false;
    let upsertEventReceived = false;

    // Timeout to fail test if events don't arrive
    const timeout = setTimeout(() => {
        console.error("❌ TIMEOUT: Events did not arrive within 30 seconds.");
        console.log(`Status - Send: ${sendEventReceived}, Upsert: ${upsertEventReceived}`);
        process.exit(1);
    }, 30000);

    socket.on("connect", () => {
      console.log("✅ WebSocket Connected!");
      
      // 3. Send Message
      sendMessage(currentInstanceName, ownerNumber); 
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ WebSocket Disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error(`❌ WebSocket Connection Error: ${err.message}`);
    });

    // Listen for events
    socket.onAny((eventName, ...args) => {
        console.log(`🔔 Event received: ${eventName}`);
        if (eventName === 'messages.upsert' || eventName === 'MESSAGES_UPSERT') {
             upsertEventReceived = true;
             checkCompletion();
        }
        if (eventName === 'send.message' || eventName === 'SEND_MESSAGE') {
             sendEventReceived = true;
             checkCompletion();
        }
    });

    function checkCompletion() {
        if (sendEventReceived && upsertEventReceived) {
            console.log("🚀 TEST COMPLETED SUCCESSFULLY: Sent and Received events confirmed.");
            clearTimeout(timeout);
            process.exit(0);
        }
    }

  } catch (error: any) {
    console.error("❌ Error in test:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

async function sendMessage(instanceName: string, number: string) {
  try {
    const url = `${BASE_URL}/message/sendText/${instanceName}`;
    const body = {
      number: number,
      text: `Teste de fluxo automático ${new Date().toISOString()}`,
      delay: 1200,
      linkPreview: false
    };
    
    console.log(`Sending message to ${url}...`);
    const res = await axios.post(url, body, {
      headers: { apikey: API_KEY }
    });
    
    console.log("Message request sent:", res.status);
  } catch (error: any) {
    console.error("❌ Error sending message:", error.message);
    if (error.response) {
      console.error("Response data:", JSON.stringify(error.response.data, null, 2));
    }
  }
}

main();
