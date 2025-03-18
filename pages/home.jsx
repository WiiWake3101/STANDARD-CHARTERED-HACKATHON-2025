import Navbar from "./components/Navbar"; // ✅ Import Navbar

export default function Home() {
    return (
        <div className="relative flex flex-col min-h-screen bg-gray-100 overflow-hidden">
            {/* Top Left Circle */}
            <div className="absolute top-[-50px] -left-[30px] lg:top-[-100px] lg:left-[200px] w-40 h-40 sm:w-50 sm:h-50 md:-left-[50px] md:w-64 md:h-64 lg:w-96 lg:h-96 bg-[#02AFAA] rounded-full"></div>

            {/* Bottom Right Circle */}
            <div className="absolute -bottom-[50px] -right-[30px] lg:-bottom-[100px] lg:-right-[100px] w-40 h-40 sm:w-50 sm:h-50 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-[#1453F9] rounded-full"></div>

            <Navbar /> {/* ✅ Reusing Navbar Component */}

            {/* Main Content - Centered Properly for All Devices */}
            <div className="flex flex-1 h-screen items-center justify-center text-center lg:ml-64">
                <div>
                    <h2 className="text-5xl font-bold text-[#1453F9]">AI Branch Manager</h2>
                    <p className="mt-4 text-2xl text-gray-700 italic">
                        "Transforming financial assistance with intelligence and innovation."
                    </p>
                </div>
            </div>
        </div>
    );
}