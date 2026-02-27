import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Placeholder config for Project Miri
// In production, these should be replaced with import.meta.env variables
const firebaseConfig = {
    apiKey: "PLACEHOLDER_API_KEY",
    authDomain: "miri-project.firebaseapp.com",
    projectId: "miri-project",
    storageBucket: "miri-project.appspot.com",
    messagingSenderId: "PLACEHOLDER_SENDER_ID",
    appId: "PLACEHOLDER_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
