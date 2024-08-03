// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwpKuOLvIM06mY1zZOXrwuM81yk51B0aM",
  authDomain: "pantry-2236f.firebaseapp.com",
  projectId: "pantry-2236f",
  storageBucket: "pantry-2236f.appspot.com",
  messagingSenderId: "928792972867",
  appId: "1:928792972867:web:5ed5110eb56e868b268ef6",
  measurementId: "G-2WSEP23QDR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export {app, firestore};