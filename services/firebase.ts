import * as firebase from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAGNfopM9InJO7iHoGv3g9NYMjJ10udxBE",
  authDomain: "henzen-smartnest.firebaseapp.com",
  databaseURL: "https://henzen-smartnest-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "henzen-smartnest",
  storageBucket: "henzen-smartnest.firebasestorage.app",
  messagingSenderId: "1057660543629",
  appId: "1:1057660543629:web:853e57ae1197fb26d5f8c4"
};

const app = firebase.initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue, off };