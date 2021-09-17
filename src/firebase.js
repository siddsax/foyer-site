import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBarNMFYvA5ChtKvyQCWmmjLweGqRfEauE",
  authDomain: "foyer-ba835.firebaseapp.com",
  projectId: "foyer-ba835",
  storageBucket: "foyer-ba835.appspot.com",
  messagingSenderId: "780614249083",
  appId: "1:780614249083:web:566cab2113efe820e610de",
  measurementId: "G-GQV12WQ37B",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth();

export { db, auth };
