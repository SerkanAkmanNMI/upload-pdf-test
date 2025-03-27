import fs from "fs";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

if (!API_KEY || !API_URL) {
  console.error(
    "⚠️ Missing API_KEY or API_URL. Make sure your .env file is set up."
  );
  process.exit(1);
}

// Function to read a file and encode it to Base64
const readFileAsBase64 = (filePath) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    return fileBuffer.toString("base64");
  } catch (error) {
    console.error(`❌ Error reading file: ${filePath}`, error);
    process.exit(1);
  }
};

// Function to upload a file
const uploadFile = async (fileName, binaryData) => {
  try {
    const response = await fetch(
      `${API_URL}?name=${encodeURIComponent(fileName)}&extension=pdf`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          "X-API-KEY": API_KEY
        },
        body: binaryData
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to upload file: ${fileName}. HTTP status: ${response.status}`
      );
    }

    const jsonResponse = await response.json();
    console.log(`✅ Uploaded: ${fileName}`, jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.error(`❌ Error uploading ${fileName}:`, error.message);
  }
};

// Set up test files
const signedPdfPath = "test-signed.pdf";
const signingLogPath = "test-signing-log.pdf";

console.log("🚀 Starting file upload test...");

// Simulate inputData as if coming from Zapier
const inputData = {
  signed_pdf_name: "signed-test.pdf",
  signing_log_name: "signing-log-test.pdf",
  signed_pdf_binary: readFileAsBase64(signedPdfPath),
  signing_log_binary: readFileAsBase64(signingLogPath)
};

// Upload files in sequence
(async () => {
  let response1 = await uploadFile(
    inputData.signed_pdf_name,
    Buffer.from(inputData.signed_pdf_binary, "base64")
  );
  if (response1) {
    await uploadFile(
      inputData.signing_log_name,
      Buffer.from(inputData.signing_log_binary, "base64")
    );
    console.log("🎉 All uploads completed!");
  }
})();
