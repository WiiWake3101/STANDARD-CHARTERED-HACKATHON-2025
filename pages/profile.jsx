import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { app, db } from "../firebaseConfig";
import Navbar from "./components/Navbar"; // ✅ Import Navbar

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setProfileData(userDoc.data());
        }
      } else {
        localStorage.removeItem("user");
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100 overflow-hidden">
      {/* Top Left Circle */}
      <div className="absolute top-[-50px] -left-[30px] lg:top-[-100px] lg:left-[200px] w-40 h-40 sm:w-50 sm:h-50 md:-left-[50px] md:w-64 md:h-64 lg:w-96 lg:h-96 bg-[#02AFAA] rounded-full"></div>

      {/* Bottom Right Circle */}
      <div className="absolute -bottom-[50px] -right-[30px] lg:-bottom-[100px] lg:-right-[100px] w-40 h-40 sm:w-50 sm:h-50 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-[#1453F9] rounded-full"></div>

      {/* ✅ Navbar */}
      <Navbar />

      {/* Profile Section - Centered */}
      <div className="flex flex-1 h-screen items-center justify-center text-center lg:ml-64">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-3xl font-bold text-[#1453F9] mb-6">Profile</h2>

          {profileData ? (
            <>
              <div className="mb-4">
                <label className="font-semibold text-gray-700">Full Name:</label>
                <p className="border p-2 rounded mt-1 text-gray-800">{profileData.name}</p>
              </div>
              <div className="mb-4">
                <label className="font-semibold text-gray-700">Email:</label>
                <p className="border p-2 rounded mt-1 text-gray-800">{profileData.email}</p>
              </div>
            </>
          ) : (
            <p className="text-gray-700">Loading profile...</p>
          )}

          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;