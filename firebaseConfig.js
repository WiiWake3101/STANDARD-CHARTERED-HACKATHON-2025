import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    createUserWithEmailAndPassword 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Import Firestore

const firebaseConfig = {
    apiKey: "AIzaSyCSwAVk7AeD5w_Cr2pa41nWvlLHd3Mvjls",
    authDomain: "standard-chartered-hackathon.firebaseapp.com",
    projectId: "standard-chartered-hackathon",
    storageBucket: "standard-chartered-hackathon.firebasestorage.app",
    messagingSenderId: "155349328615",
    appId: "1:155349328615:web:2608414ac19ad67f0b3842",
    measurementId: "G-GDNB223J98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ Initialize Firestore
const googleProvider = new GoogleAuthProvider();

export { auth, db, signInWithEmailAndPassword, signInWithPopup, googleProvider, createUserWithEmailAndPassword }; // ✅ Export db