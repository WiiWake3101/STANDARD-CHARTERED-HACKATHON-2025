import { useState } from "react";
import { IoMenu, IoClose } from "react-icons/io5"; // Import icons
import { useRouter } from "next/router";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (username.trim() !== "") {
      router.push("/login");
    }
  };

  return (
    <>
      {/* Mobile Hamburger Button (☰) - Hide when Sidebar is Open */}
      {!isOpen && (
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
        {/* Close (X) Button - Mobile View Only */}
        <button
          className="lg:hidden absolute top-4 right-4 text-3xl text-white"
          onClick={() => setIsOpen(false)}
        >
          <IoClose />
        </button>

        {/* Sidebar Content */}
        <h2 className="text-2xl font-bold mt-8 lg:mt-0">AI Branch Manager</h2>
        <nav className="mt-6 space-y-4">
          <a href="/home" className="block py-2 px-4 bg-white text-[#1453F9] rounded-md">
            Home
          </a>
          <a href="/dashboard" className="block py-2 px-4 hover:bg-blue-300 rounded-md text-white">
            Dashboard
          </a>
          <a href="/loan_application" className="block py-2 px-4 hover:bg-blue-300 rounded-md text-white">
            Loan Application
          </a>
          <a href="/profile" className="block py-2 px-4 hover:bg-blue-300 rounded-md text-white">
            Profile
          </a>
        </nav>

        {/* Login Form Inside Navbar */}
        <div className="mt-auto flex flex-col">
          <button
            onClick={handleLogin}
            className="mt-4 px-6 py-2 bg-white text-[#1453F9] font-semibold rounded-lg hover:bg-blue-300 transition"
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
}