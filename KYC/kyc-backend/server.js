const express = require("express");
const Tesseract = require("tesseract.js");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/upload", async (req, res) => {
  const { image, documentType } = req.body;

  console.log("Received request to process document:", documentType);

  try {
    console.log("Starting OCR processing...");

    // Tesseract.js configuration
    const { data: { text } } = await Tesseract.recognize(image, "eng", {
      logger: (info) => console.log(info), // Log progress
      tessedit_pageseg_mode: 11, // PSM 11: Sparse text
      tessedit_ocr_engine_mode: 3, // OEM 3: Default OCR engine
    });

    console.log("OCR Output:", text); // Log the extracted text

    // Extract data based on document type
    let extractedData = {};
    if (documentType === "Aadhaar") {
      extractedData = extractAadhaarDetails(text);
    } else if (documentType === "PAN") {
      extractedData = extractPANDetails(text);
    } else if (documentType === "IncomeProof") {
      extractedData = extractIncomeProofDetails(text);
    }

    console.log("Extracted Data:", extractedData); // Log the extracted data

    // Check if any field is "Not found"
    const requiresManualUpload = Object.values(extractedData).includes("Not found");

    res.json({ ...extractedData, requiresManualUpload });
  } catch (err) {
    console.error("Error during OCR processing:", err); // Log the error
    res.status(400).json({ error: "Failed to process the document" });
  }
});

const extractAadhaarDetails = (text) => {
  // Extract Name
  const nameMatch = text.match(/([A-Za-z\s]+)/); // Matches "First Last" names
  const name = nameMatch ? nameMatch[0].trim() : "Not found";

  // Extract DOB
  const dobMatch = text.match(/(\d{2}\/\d{2}\/\d{4})/); // Matches "DD/MM/YYYY"
  const dob = dobMatch ? dobMatch[0].trim() : "Not found";

  // Extract Gender
  const genderMatch = text.match(/(Male|Female)/i); // Matches "Male" or "Female" (case-insensitive)
  const gender = genderMatch ? genderMatch[0].trim() : "Not found";

  // Extract Aadhaar Number
  const aadhaarMatch = text.match(/(\d{4}\s?\d{4}\s?\d{4})/); // Matches "XXXX XXXX XXXX" or "XXXXXXXXXXXX"
  const aadhaarNumber = aadhaarMatch ? aadhaarMatch[0].trim() : "Not found";

  return {
    name,
    dob,
    gender,
    aadhaarNumber,
  };
};

const extractPANDetails = (text) => {
    // Extract Applicant Name
    const nameMatch = text.match(/([A-Z]+\s[A-Z]+\s[A-Z]+)/);
    const name = nameMatch ? nameMatch[0].trim() : "Not found";
  
    // Extract Applicant's Father Name
    const fatherNameMatch = text.match(/([A-Z]+\s[A-Z]+)/);
    const fatherName = fatherNameMatch ? fatherNameMatch[0].trim() : "Not found";
  
    // Extract DOB
    const dobMatch = text.match(/(\d{2}\/\d{2}\/\d{4})/);
    const dob = dobMatch ? dobMatch[0].trim() : "Not found";
  
    // Extract PAN Number
    const panMatch = text.match(/[A-Z]{5}\d{4}[A-Z]{1}/);
    const panNumber = panMatch ? panMatch[0].trim() : "Not found";
  
    return {
      name,
      fatherName,
      dob,
      panNumber,
    };
  };

const extractIncomeProofDetails = (text) => {
  // Extract Employer Name
  const employerMatch = text.match(/Employer\s*:\s*([A-Za-z\s]+)/i); // Matches "Employer: XYZ"
  const employer = employerMatch ? employerMatch[1].trim() : "Not found";

  // Extract Salary
  const salaryMatch = text.match(/Salary\s*:\s*([\d,]+)/i); // Matches "Salary: 123,456"
  const salary = salaryMatch ? salaryMatch[1].trim() : "Not found";

  // Extract Date
  const dateMatch = text.match(/Date\s*:\s*(\d{2}\/\d{2}\/\d{4})/i); // Matches "Date: DD/MM/YYYY"
  const date = dateMatch ? dateMatch[1].trim() : "Not found";

  return {
    employer,
    salary,
    date,
  };
};

app.listen(3001, () => console.log("Server running on port 3001"));