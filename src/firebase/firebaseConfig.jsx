// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlILM0TKPgJssjkL4_w9FScwcY89K0ZsU",
  authDomain: "react-firebase-card-9793a.firebaseapp.com",
  projectId: "react-firebase-card-9793a",
  storageBucket: "react-firebase-card-9793a.appspot.com",
  messagingSenderId: "108228740109",
  appId: "1:108228740109:web:b7aedb5d321932e936c144",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialize firestore
const db = getFirestore(app);

//Initiate Storage
export const storage = getStorage();

export default db;
