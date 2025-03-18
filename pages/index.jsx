import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      router.push("/home"); // Redirect to Home
    }, 2000); // Change delay as needed
  }, []);

  return (
    <div className="relative flex items-center justify-center h-screen bg-white overflow-hidden">
      {/* Top Left Circle - Enlarged */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-[#1453F9] rounded-full sm:"></div>

      {/* Bottom Right Circle - Enlarged */}
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-[#02AFAA] rounded-full"></div>

      {/* Content */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600">AI Branch Manager</h1>
        <p className="mt-4 text-lg text-gray-700">
          Apply for loans with video-based assistance!
        </p>
        {loading && <p className="mt-6 text-lg font-semibold text-gray-500">Loading...</p>}
      </div>
    </div>
  );
}