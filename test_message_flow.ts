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
    console.log(`Using Instance: ${currentInstanceName} (Status: ${targetInstance.connectionStatus})`);

    // 2. Connect WebSocket
    const namespaceUrl = `${BASE_URL}/${currentInstanceName}`;
    console.log(`Connecting WebSocket to: ${namespaceUrl}`);
    
    const socket = io(namespaceUrl, {
      transports: ['websocket', 'polling'],
      forceNew: true,
       // Render might require specific path or options, but usually standard io works
       // If path is custom, we need to know. Default is /socket.io
    });

    socket.on("connect", () => {
      console.log("✅ WebSocket Connected!");
      
      // 3. Send Message
      sendMessage(currentInstanceName, "5511999999999"); 
    });

    socket.on("messages.upsert", (data) => {
      console.log("✅ RECEIVED EVENT: messages.upsert");
      process.exit(0);
    });
    
    socket.on("MESSAGES_UPSERT", (data) => {
        console.log("✅ RECEIVED EVENT: MESSAGES_UPSERT");
        process.exit(0);
    });

    socket.on("connect_error", (err) => {
      console.error(`❌ WebSocket Connection Error: ${err.message}`);
      // console.error(JSON.stringify(err, null, 2));
      if (err.message === "websocket error") {
         console.log("Check server logs for rejection reason.");
      }
    });

  } catch (error) {
    console.error("Critical Error:", error.message);
    if (error.response) {
        console.error("Response Status:", error.response.status);
        console.error("Response Data:", JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
        console.error("No response received from server.");
    }
  }
}

async function sendMessage(instanceName: string, number: string) {
    console.log(`Sending test message to ${number}...`);
    try {
        const res = await axios.post(`${BASE_URL}/message/sendText/${instanceName}`, {
            number: number,
            text: "Teste de fluxo automático " + new Date().toISOString()
        }, {
            headers: { apikey: API_KEY }
        });
        console.log("Message request sent:", res.status);
    } catch (err) {
        console.error("Failed to send message:", err.message);
    }
}

main();
