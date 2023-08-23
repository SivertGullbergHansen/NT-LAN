import { io } from 'socket.io-client';

export const serverPort = 3005;

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? '' : `http://localhost:${serverPort}`;

export const socket = io(URL);