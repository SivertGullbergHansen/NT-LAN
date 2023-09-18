import { io } from 'socket.io-client';

export const serverPort = 3004;

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? `seating.g4me.norsk-tipping.no:${serverPort}` : `192.168.41.76:${serverPort}`;

export const socket = io(URL);