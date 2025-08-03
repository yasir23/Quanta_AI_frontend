import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "quanta-trend-intelligence",
  appId: "1:476108375502:web:1a5d6e66bd7e62ed83179f",
  storageBucket: "quanta-trend-intelligence.firebasestorage.app",
  apiKey: "AIzaSyAmw_XNtHkQA6tDXbOY-iw1Dg6ZK0Fp4UY",
  authDomain: "quanta-trend-intelligence.firebaseapp.com",
  messagingSenderId: "476108375502",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
