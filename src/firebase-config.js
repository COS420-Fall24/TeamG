// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOPW7l04ofFNbLBkTe3fnTUDm1_buyH4U",
  authDomain: "money-gremlin-4bafb.firebaseapp.com",
  projectId: "money-gremlin-4bafb",
  storageBucket: "money-gremlin-4bafb.appspot.com",
  messagingSenderId: "82912161628",
  appId: "1:82912161628:web:1fbf32ceaccf961cbe5b99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);