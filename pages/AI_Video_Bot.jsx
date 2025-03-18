import React, { useState, useRef, useEffect } from "react";
import Navbar from "./components/Navbar";
import Webcam from "react-webcam";

const LoanApplication = () => {
  const [currentType, setCurrentType] = useState("greeting");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoSrc, setVideoSrc] = useState("");
  const [loanSelectionVisible, setLoanSelectionVisible] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showRepeatButton, setShowRepeatButton] = useState(false);
  const [transcript, setTranscript] = useState("Welcome to AI Loan Assistant");
  const [isListening, setIsListening] = useState(false);
  const videoRef = useRef(null);

  // Web Speech API for speech recognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true; // Keep listening
    recognition.interimResults = true; // Show interim results
    recognition.lang = "en-US"; // Set language to English

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      setTranscript(currentTranscript);
    };

    // Start listening when the user clicks the button to start chatting
    const startListening = () => {
      recognition.start();
    };

    // Stop listening (you can call it when needed, like when chat is over)
    const stopListening = () => {
      recognition.stop();
    };

    return { startListening, stopListening };
  }, []);

  // Video sequences
  const videoSequences = {
    greeting: ["1.mp4", "2.mp4"],
    personal: ["4.mp4", "5.mp4", "6.mp4", "9.mp4", "10.mp4", "11.mp4", "Thank.mp4"],
    home: ["15.mp4", "16.mp4", "17.mp4", "18.mp4", "20.mp4", "21.mp4", "Thank.mp4"],
    auto: ["23.mp4", "24.mp4", "25.mp4", "26.mp4", "27.mp4", "Thank.mp4"],
    business: ["30.mp4", "31.mp4", "32.mp4", "33.mp4", "34.mp4", "Thank.mp4"],
  };

  // Fetch Next Video and Transcript
  const fetchNextVideo = async (type, index) => {
    try {
      const response = await fetch("http://localhost:5000/get_next_video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, index }),
      });

      const data = await response.json();
      if (data.video && data.video !== "None") {
        setVideoSrc(data.video); // Update video source
        setTranscript(data.transcript || ""); // Set transcript from API
        setShowNextButton(true);
        setShowRepeatButton(true);

        // Show loan selection only when "2.mp4" plays
        if (data.video.includes("2.mp4")) {
          setLoanSelectionVisible(true);
        }
      } else {
        setVideoSrc(""); // No more videos
      }
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  // Play Next Video
  const playNextVideo = async () => {
    const nextIndex = currentVideoIndex + 1;
    if (nextIndex < videoSequences[currentType].length) {
      setCurrentVideoIndex(nextIndex);
      await fetchNextVideo(currentType, nextIndex);
      setShowNextButton(false);
      setShowRepeatButton(false);
    } else if (!videoSrc.includes("Thank.mp4")) {
      // If it's the last video and Thank.mp4 is not playing, play it
      setVideoSrc("Thank.mp4");
      setTranscript("Thank you for using AI Loan Assistant.");
      setShowNextButton(false);
      setShowRepeatButton(false);
    }
  };

  const repeatVideo = () => {
    // Re-set the video source to the current video without changing the sequence or index
    setVideoSrc(videoSequences[currentType][currentVideoIndex]);
  };

  // Start AI Chat
  const startChat = async () => {
    setCurrentVideoIndex(0);
    await fetchNextVideo(currentType, 0);
  };

  // Handle Loan Selection
  const selectLoan = async (loanType) => {
    setCurrentType(loanType);
    setCurrentVideoIndex(0);
    setLoanSelectionVisible(false);
    await fetchNextVideo(loanType, 0);
  };

  return (
    <div className="bg-white min-h-screen flex">
      {/* Sidebar Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 p-6 ml-64">
        <h1 className="text-2xl font-bold text-gray-900">AI Loan Assistant</h1>
        <p className="text-gray-600 mt-2">AI Video and Live Camera Feed</p>

        {/* AI Video and User Camera */}
        <div className="mt-6 flex gap-6">
          {/* AI Video */}
          <div className="w-1/2 border border-gray-300 rounded-lg overflow-hidden shadow-md p-4 flex flex-col items-center">
            {videoSrc && (
              <video
                key={videoSrc} // Force re-render when videoSrc changes
                ref={videoRef}
                className="w-full h-64"
                controls
                autoPlay
              >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {/* User Camera */}
          <div className="w-1/2 border border-gray-300 rounded-lg overflow-hidden shadow-md">
            <Webcam className="w-full h-64" />
          </div>
        </div>

        {/* Buttons Section */}
        <div className="mt-6 flex flex-col items-center">
          {/* Start Chat Button */}
          {!videoSrc && (
            <button
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
              onClick={startChat}
            >
              Start Chat
            </button>
          )}

          {/* Loan Selection Buttons (Shown when 2.mp4 plays) */}
          {loanSelectionVisible && (
            <div className="mt-4">
              <p className="text-black">Select your loan type:</p>
              {["personal", "home", "auto", "business"].map((loanType) => (
                <button
                  key={loanType}
                  className="px-4 py-2 bg-green-500 text-white rounded m-2"
                  onClick={() => selectLoan(loanType)}
                >
                  {loanType.charAt(0).toUpperCase() + loanType.slice(1)} Loan
                </button>
              ))}
            </div>
          )}

          {/* Next & Repeat Buttons */}
          <div className="mt-4 flex gap-4">
            {showNextButton && (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={playNextVideo}
              >
                Next
              </button>
            )}
            {showRepeatButton && (
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={repeatVideo}
              >
                Repeat
              </button>
            )}
          </div>
        </div>

        {/* Transcript Box */}
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md p-4 bg-gray-100 mt-6">
          <h3 className="text-md font-semibold text-gray-700 p-2 bg-gray-200">Transcript</h3>
          <p className="text-gray-800 p-2 h-24 overflow-y-auto">{transcript || "Listening..."}</p>
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;