import { WebSocket  } from 'ws';
import { generateMockData } from './data'

export default function startWebSocketServer() {
  const wss = new WebSocket.Server({ port: 3000 });

  wss.on('connection', (ws) => {
    console.log('WebSocket connection established.');

    ws.on('message', (message) => {
      console.log('WebSocket message received:', message);
      const response = JSON.stringify({ type: 'pong' });
      ws.send(response);
      console.log('WebSocket response sent:', response);
    });
    const interval = setInterval(() => {
      const mockData = generateMockData();
      ws.send(JSON.stringify(mockData));
    }, 1000);

    // Clean up the interval when the client closes the connection
    ws.on('close', () => {
      clearInterval(interval);
    });
  });

  console.log('WebSocket server started on port 3000.');
}