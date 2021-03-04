import firebase from 'firebase';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9-2sBoYZ7de1AsR8RclN1h7U-RGcMElo",
  authDomain: "in-kuwait.firebaseapp.com",
  projectId: "in-kuwait",
  storageBucket: "in-kuwait.appspot.com",
  messagingSenderId: "890129110623",
  appId: "1:890129110623:web:ecc7f97a2b547a97046dea",
  measurementId: "G-GZNW5J7SQH"
};

const firebaseApp= firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const timestamp=firebase.firestore.FieldValue.serverTimestamp()

export { db,auth,timestamp }
