// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyCFdjeW6IJK6qJMVrxjsTFZzaH3fW1-yDI",
  authDomain: "thebucket-19445.firebaseapp.com",
  projectId: "thebucket-19445",
  storageBucket: "thebucket-19445.appspot.com",
  messagingSenderId: "653193713784",
  appId: "1:653193713784:web:a3516bf1f3a8367bf7358d",
  measurementId: "G-N79M9YJ5DB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);