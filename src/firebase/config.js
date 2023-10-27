import firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyAwd3lvOUN_Zrf2lxlyJ_gULd-l04HIBDU",
  authDomain: "webproject20231.firebaseapp.com",
  projectId: "webproject20231",
  storageBucket: "webproject20231.appspot.com",
  messagingSenderId: "1029998299386",
  appId: "1:1029998299386:web:5804d01582bc65cf85a143",
  measurementId: "G-C6867LW7CH"
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
