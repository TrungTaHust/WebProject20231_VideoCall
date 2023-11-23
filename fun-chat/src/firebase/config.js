import firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyB-tDf-LSiG8ru46jApmJVfLKJGJ84AMpo",
  authDomain: "chat-app-c03cd.firebaseapp.com",
  projectId: "chat-app-c03cd",
  storageBucket: "chat-app-c03cd.appspot.com",
  messagingSenderId: "317275242737",
  appId: "1:317275242737:web:a560c1c32f0923cff8a950",
  measurementId: "G-5GPMZX0VNH"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

if (window.location.hostname === 'localhost') {
  // auth.useEmulator('http://localhost:9099');
  // db.useEmulator('localhost', '8080');
}

export { db, auth };
export default firebase;
