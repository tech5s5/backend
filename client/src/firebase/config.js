import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC6fPNDqlQmgiUjgBNXm5VurVIr3d8f3lw",
  authDomain: "mental-health-companion-be456.firebaseapp.com",
  projectId: "mental-health-companion-be456",
  storageBucket: "mental-health-companion-be456.firebasestorage.app",
  messagingSenderId: "747506795207",
  appId: "1:747506795207:web:dfa496c3b311fb72a4f4e2",
  measurementId: "G-56XL3SX7F5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app; 