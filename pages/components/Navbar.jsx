import { useState, useEffect } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../../firebaseConfig"; // Ensure firebase is properly initialized

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        localStorage.removeItem("user"); // Clear session
        router.push("/"); // Redirect to login (index) if not logged in
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user"); // Clear session
      router.push("/"); // Redirect to index after sign out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Define navigation links
  const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/document_application", label: "Document Application" },
    { href: "/AI_Video_Bot", label: "AI Video Bot" },
    { href: "/loan_application", label: "Loan Application" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <>
      {!isOpen && user && (
        <button
          className="lg:hidden fixed top-4 left-4 z-50 text-3xl text-white transition-all duration-300"
          onClick={() => setIsOpen(true)}
        >
          <IoMenu />
        </button>
      )}

      {/* Sidebar Navbar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-[#1453F9] text-white flex flex-col p-6 shadow-xl 
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          transition-transform duration-300 lg:translate-x-0 lg:w-64 lg:flex`}
      >
        {/* Close Button - Mobile View Only */}
        {user && (
          <button
            className="lg:hidden absolute top-4 right-4 text-3xl text-white"
            onClick={() => setIsOpen(false)}
          >
            <IoClose />
          </button>
        )}

        {/* Sidebar Content */}
        <h2 className="text-2xl font-bold mt-8 lg:mt-0">AI Branch Manager</h2>

        {user && (
          <>
            <nav className="mt-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`block py-2 px-4 rounded-md transition ${
                    router.pathname === link.href
                      ? "bg-white text-[#1453F9] font-semibold" // Active Page Styling
                      : "hover:bg-blue-300 text-white"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Sign Out Button */}
            <div className="mt-auto flex flex-col">
              <button
                onClick={handleSignOut}
                className="mt-4 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
              >
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}