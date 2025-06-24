const yourToken = 'your_token_here'; // Replace with your actual token
const port = location.port || 5173; // Default to 5173 if port is not set
const wsUrl = `ws://${location.hostname}:${port}/?token=${yourToken}`;

const ws = new WebSocket(wsUrl);

// ...existing code for WebSocket events and other logic...