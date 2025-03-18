import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Webcam from "react-webcam";

const LoanApplication = () => {
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  // Initialize automatic speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let newTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          newTranscript += event.results[i][0].transcript + " ";
        }
        setTranscript(newTranscript);
      };

      recognition.start(); // Auto start speech recognition
      recognitionRef.current = recognition;
    }
  }, []);

  return (
    <div className="bg-white min-h-screen flex">
      {/* Sidebar Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 p-6 ml-64">
        <h1 className="text-2xl font-bold text-gray-900">AI Video Bot</h1>
        <p className="text-gray-600 mt-2">AI Video and Live Camera Feed with Automatic Transcription</p>

        {/* AI Video and User Camera (Side by Side) */}
        <div className="mt-6 flex gap-6">
          {/* AI Video Box */}
          <div className="w-1/2 border border-gray-300 rounded-lg overflow-hidden shadow-md">
            <video autoPlay loop muted className="w-full h-64">
              <source src="/path-to-ai-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* User Camera Box */}
          <div className="w-1/2 border border-gray-300 rounded-lg overflow-hidden shadow-md">
            <Webcam className="w-full h-64" />
          </div>
        </div>

        {/* Transcript Box (Below Video and Camera) */}
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md p-4 bg-gray-100 mt-6">
          <h3 className="text-md font-semibold text-gray-700 p-2 bg-gray-200">Transcript</h3>
          <p className="text-gray-800 p-2 h-24 overflow-y-auto">{transcript || "Listening..."}</p>
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;