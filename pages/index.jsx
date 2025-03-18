import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";
import { auth, signInWithEmailAndPassword, signInWithPopup, googleProvider, createUserWithEmailAndPassword } from "../firebaseConfig";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const db = getFirestore();

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/loading");
    }

    // Auto sign out when tab is closed
    const handleTabClose = () => {
      signOut(auth).then(() => {
        localStorage.removeItem("user");
      }).catch((error) => console.error("Sign out error:", error));
    };

    window.addEventListener("beforeunload", handleTabClose);
    return () => window.removeEventListener("beforeunload", handleTabClose);
  }, [router]);

  const handleSignup = async () => {
    if (!email || !password || !name) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: new Date(),
      });

      localStorage.setItem("user", JSON.stringify(user));
      setSuccessMessage("Account created successfully! Redirecting...");
      setTimeout(() => router.push("/loading"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("user", JSON.stringify(userCredential.user));
      router.push("/loading");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName || "User",
          email: user.email,
          createdAt: new Date(),
        });
      }

      localStorage.setItem("user", JSON.stringify(user));
      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => router.push("/loading"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-50 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-[#1453F9] opacity-20 rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-96 h-96 bg-[#02AFAA] opacity-20 rounded-full"></div>

      {/* Authentication Card */}
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-96 text-center">
        <h2 className="text-3xl font-bold text-black">{isSignup ? "Create an Account" : "Welcome Back"}</h2>
        <p className="text-sm text-black mt-2">{isSignup ? "Sign up to get started" : "Sign in to continue"}</p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}

        {isSignup && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 mt-4 border rounded-lg text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mt-4 border rounded-lg text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mt-4 border rounded-lg text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={isSignup ? handleSignup : handleLogin}
          className="w-full mt-6 p-3 bg-blue-600 text-white rounded-lg"
        >
          {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-black">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center p-3 border rounded-lg text-black"
        >
          <FcGoogle className="text-2xl mr-2" /> Sign in with Google
        </button>

        <p
          className="mt-4 text-sm cursor-pointer text-black"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign up"}
        </p>
      </div>
    </div>
  );
}