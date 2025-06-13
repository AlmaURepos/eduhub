// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDi2DMyE2vEPEcUvI__HNqigp2vh2YB-cs",
  authDomain: "eduhub-82000.firebaseapp.com",
  projectId: "eduhub-82000",
  storageBucket: "eduhub-82000.firebasestorage.app",
  messagingSenderId: "677503509811",
  appId: "1:677503509811:web:fa4ab69ae98a5675d88a46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;