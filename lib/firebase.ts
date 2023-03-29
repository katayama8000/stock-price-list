// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCbr80cmFbAYSf19Dq-4nVqhU4_hRr1JOE',
  authDomain: 'stock-price-8a08b.firebaseapp.com',
  projectId: 'stock-price-8a08b',
  storageBucket: 'stock-price-8a08b.appspot.com',
  messagingSenderId: '37225828460',
  appId: '1:37225828460:web:3f4d9efa6dbe6a5d228849',
  measurementId: 'G-94Y3TW6K2S',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
