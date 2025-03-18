import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import PDFViewer from "./components/PDFViewer";

const LoanApplication = () => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [queryResponse, setQueryResponse] = useState("");
    const [additionalQuery, setAdditionalQuery] = useState("");

    // Handle file selection and preview
    const handleFileUpload = (event) => {
        const uploadedFile = event.target.files[0];

        if (uploadedFile && uploadedFile.type === "application/pdf") {
            setFile(uploadedFile);

            // Revoke previous URL to free memory
            setPreviewUrl((prevUrl) => {
                if (prevUrl) {
                    URL.revokeObjectURL(prevUrl);
                }
                return URL.createObjectURL(uploadedFile);
            });
        } else {
            alert("Only PDF files are allowed!");
            event.target.value = "";
        }
    };

    // Handle file upload & immediately fetch analysis response
    const handleFileUploaded = async () => {
        if (!file) {
            alert("No file selected!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:8000/upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                const uploadedFilename = data.filename;

                // Fetch extracted response from backend
                const queryResponse = await fetch(`http://localhost:8000/query?filename=${uploadedFilename}`, {
                    method: "GET",
                });

                if (queryResponse.ok) {
                    const queryData = await queryResponse.json();
                    setQueryResponse(queryData.response); // Display backend response
                } else {
                    setQueryResponse("Failed to fetch response!");
                }

                alert("File uploaded successfully!");
            } else {
                alert("Upload failed!");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading file!");
        }
    };

    // Handle additional query submission
    const handleAdditionalQuery = async () => {
        if (!additionalQuery.trim()) {
            alert("Please enter a query before submitting!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/submit-query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: additionalQuery }),
            });

            if (response.ok) {
                alert("Query submitted successfully!");
                setAdditionalQuery(""); // Clear input after submission
            } else {
                alert("Failed to submit query.");
            }
        } catch (error) {
            console.error("Query submission error:", error);
            alert("Error submitting query!");
        }
    };

    // Cleanup URLs on unmount
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    return (
        <div className="bg-white min-h-screen flex">
            {/* Sidebar Navbar */}
            <Navbar />

            {/* Main Content */}
            <div className="flex-1 p-6 ml-64 flex gap-8">
                {/* Left Section - File Upload */}
                <div className="w-1/3 bg-gray-100 p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-gray-900">Loan Application</h1>
                    <p className="text-gray-600 mt-2">Upload a document for verification.</p>

                    {/* File Upload */}
                    <label className="block text-gray-700 font-semibold mt-4 mb-2">Upload Document</label>
                    <div className="relative">
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-500 text-center cursor-pointer">
                            {file ? file.name : "Upload Document (PDF only)"}
                        </div>
                    </div>

                    {/* Upload & Process Button */}
                    <button
                        onClick={handleFileUploaded}
                        className="mt-6 w-full bg-[#1453F9] text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
                    >
                        Upload & Analyze
                    </button>

                    {/* Display Analysis Result */}
                    {queryResponse && (
                        <div className="mt-4 p-4 bg-gray-100 border-l-4 border-blue-500 rounded-md shadow-sm">
                            <h4 className="text-lg font-bold text-blue-800 mb-2">Financial Analysis Report:</h4>
                            <div className="text-gray-800 space-y-2">
                                {queryResponse
                                    .split("\n")
                                    .filter((line) => !line.includes("Analysis of the Financial Data:")) // Remove specific line
                                    .map((line, index) => {
                                        const parts = line.split(":");
                                        const title = parts[0]?.trim();
                                        const content = parts.slice(1).join(":").trim();

                                        return (
                                            <p key={index} className="leading-relaxed">
                                                {title ? <strong className="text-gray-900">{title}:</strong> : null} {content || title}
                                            </p>
                                        );
                                    })}
                            </div>
                        </div>
                    )}

                    {/* Additional Query Section (Appears Only After Analysis Report) */}
                    {queryResponse && queryResponse.trim() !== "" && (
                        <div className="mt-6 p-4 bg-gray-100 border-l-4 border-blue-500 rounded-md shadow-sm">
                            <h4 className="text-lg font-bold text-blue-800 mb-2">Additional Query:</h4>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                rows="3"
                                placeholder="Enter your additional query..."
                                value={additionalQuery}
                                onChange={(e) => setAdditionalQuery(e.target.value)}
                            ></textarea>
                            <button
                                onClick={handleAdditionalQuery}
                                className="mt-4 w-full bg-[#1453F9] text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
                            >
                                Submit Query
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Section - PDF Preview */}
                <div className="w-2/3 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview Document</h2>

                    {/* PDF Preview */}
                    {previewUrl && (
                        <div key={previewUrl} className="border border-gray-300 rounded-md overflow-hidden">
                            <h3 className="text-md font-semibold text-gray-700 p-2 bg-gray-200">Document Preview</h3>
                            <PDFViewer fileUrl={previewUrl} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoanApplication;
