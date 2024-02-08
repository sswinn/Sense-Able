// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_2BKQovHdTWS_gs7KPwPkydEtybjfLVA",
  authDomain: "sense-able.firebaseapp.com",
  projectId: "sense-able",
  storageBucket: "sense-able.appspot.com",
  messagingSenderId: "303060679675",
  appId: "1:303060679675:web:ba218eba43f807f1f8a95e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

//export const googleAuth = new GoogleAuthProvider();