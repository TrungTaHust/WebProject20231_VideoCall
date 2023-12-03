import firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyD_UA8Dj2mt8ua5u2ib12-wexR564TIKxY",
  authDomain: "chat-app-3eb4c.firebaseapp.com",
  projectId: "chat-app-3eb4c",
  storageBucket: "chat-app-3eb4c.appspot.com",
  messagingSenderId: "19907776278",
  appId: "1:19907776278:web:06377df5b1fecca479ca37",
  measurementId: "G-GEK2M5Z9T4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

if (window.location.hostname === 'localhost') {
   auth.useEmulator('http://localhost:9099');
   db.useEmulator('localhost', '8080');
}

export { db, auth };
export default firebase;
