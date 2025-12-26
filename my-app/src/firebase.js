import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDaSHFlQe1c_hOaCic8ZHYxehhdVgYvIv4",
  authDomain: "class-capture-82413.firebaseapp.com",
  projectId: "class-capture-82413",
  storageBucket: "class-capture-82413.firebasestorage.app",
  messagingSenderId: "586552047692",
  appId: "1:586552047692:web:48eeecadbc74d6db0a1ce9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
