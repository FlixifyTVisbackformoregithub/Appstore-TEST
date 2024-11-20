import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBK0Jvp8ZfwVEoiMBO_tEzyk91Z7GvKUnE",
  authDomain: "nexus-ad0c1.firebaseapp.com",
  projectId: "nexus-ad0c1",
  storageBucket: "nexus-ad0c1.firebasestorage.app",
  messagingSenderId: "218420994793",
  appId: "1:218420994793:web:f22d71c7711223d25a4678",
  measurementId: "G-FVHS2TSBSL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);