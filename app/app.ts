import { Application } from '@nativescript/core';
import { firebase } from '@nativescript/firebase-core';

firebase().initializeApp({
  apiKey: "AIzaSyBK0Jvp8ZfwVEoiMBO_tEzyk91Z7GvKUnE",
  authDomain: "nexus-ad0c1.firebaseapp.com",
  projectId: "nexus-ad0c1",
  storageBucket: "nexus-ad0c1.firebasestorage.app",
  messagingSenderId: "218420994793",
  appId: "1:218420994793:web:f22d71c7711223d25a4678",
  measurementId: "G-FVHS2TSBSL"
});

Application.run({ moduleName: 'app-root' });