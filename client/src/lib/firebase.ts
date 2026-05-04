import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDtNPjSEFAxLjuhsZaFbYmZgMuM8gyeyQ8',
  authDomain: 'braniela-4215f.firebaseapp.com',
  projectId: 'braniela-4215f',
  storageBucket: 'braniela-4215f.firebasestorage.app',
  messagingSenderId: '607325821508',
  appId: '1:607325821508:web:240cd7747253a31295fa11',
  measurementId: 'G-QFNEJB3SVR',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
