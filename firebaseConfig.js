import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    createUserWithEmailAndPassword // ✅ Import createUserWithEmailAndPassword
} from "firebase/auth";

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
const googleProvider = new GoogleAuthProvider();
export { auth, signInWithEmailAndPassword, signInWithPopup, googleProvider, createUserWithEmailAndPassword }; // ✅ Export createUserWithEmailAndPassword