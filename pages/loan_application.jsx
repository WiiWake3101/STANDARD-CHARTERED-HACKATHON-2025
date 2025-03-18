import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css"; // Required for styles

const LoanApplication = () => {
  const [aadharFile, setAadharFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [aadharPreviewUrl, setAadharPreviewUrl] = useState(null);
  const [panPreviewUrl, setPanPreviewUrl] = useState(null);

  // Handle file upload and generate preview
  const handleFileUpload = (event, setFile, setPreviewUrl) => {
    const file = event.target.files[0];

    if (file && file.type === "application/pdf") {
      setFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Generate a preview URL
    } else {
      alert("Only PDF files are allowed!");
      event.target.value = "";
    }
  };

  return (
    <div className="bg-white min-h-screen flex">
      {/* Sidebar Navbar */}
      <Navbar />

      {/* Main Content - Flexbox Layout */}
      <div className="flex-1 p-6 ml-64 flex gap-8">
        {/* Left Section - File Uploads */}
        <div className="w-1/3 bg-gray-100 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900">Loan Application</h1>
          <p className="text-gray-600 mt-2">Start your loan application process here.</p>

          {/* Aadhar Upload */}
          <label className="block text-gray-700 font-semibold mt-4 mb-2">Upload Aadhar Card</label>
          <div className="relative">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileUpload(e, setAadharFile, setAadharPreviewUrl)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-500 text-center cursor-pointer">
              {aadharFile ? aadharFile.name : "Upload Aadhar (PDF only)"}
            </div>
          </div>

          {/* PAN Upload */}
          <label className="block text-gray-700 font-semibold mt-4 mb-2">Upload PAN Card</label>
          <div className="relative">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileUpload(e, setPanFile, setPanPreviewUrl)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-500 text-center cursor-pointer">
              {panFile ? panFile.name : "Upload PAN (PDF only)"}
            </div>
          </div>

          {/* Submit Button */}
          <button className="mt-6 w-full bg-[#1453F9] text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition">
            Submit
          </button>
        </div>

        {/* Right Section - PDF Previews */}
        <div className="w-2/3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview Documents</h2>

          {/* Aadhar Preview */}
          {aadharPreviewUrl && (
            <div className="mb-6 border border-gray-300 rounded-md overflow-hidden">
              <h3 className="text-md font-semibold text-gray-700 p-2 bg-gray-200">Aadhar Preview</h3>
              <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`}>
                <Viewer fileUrl={aadharPreviewUrl} />
              </Worker>
            </div>
          )}

          {/* PAN Preview */}
          {panPreviewUrl && (
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <h3 className="text-md font-semibold text-gray-700 p-2 bg-gray-200">PAN Preview</h3>
              <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`}>
                <Viewer fileUrl={panPreviewUrl} />
              </Worker>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;