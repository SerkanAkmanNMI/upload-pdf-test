import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

if (!API_KEY || !API_URL) {
    console.error("⚠️ Missing API_KEY or API_URL. Make sure your .env file is set up.");
    process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadFile = (fileName, binaryData) => {
    return fetch(`${API_URL}?name=${fileName}&extension=pdf`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
            'X-API-KEY': API_KEY
        },
        body: binaryData // Send raw binary data
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to upload file: ${fileName}. HTTP status: ${response.status}`);
        }
        return response.json();
    });
};

// Read and encode file from local directory instead of fetching from URL
const readAndEncodeFile = (filePath) => {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        return fileBuffer.toString('base64');
    } catch (error) {
        console.error(`❌ Error reading file: ${filePath}`, error);
        process.exit(1);
    }
};

// Define file paths in the local app directory
const signedPdfPath = path.join(__dirname, 'test-signed.pdf');
const signingLogPath = path.join(__dirname, 'test-signing-log.pdf');

// Simulating inputData from Zapier
const inputData = {
    signed_pdf_name: 'signed-test.pdf',
    signing_log_name: 'signing-log-test.pdf',
    signed_pdf_binary: readAndEncodeFile(signedPdfPath),
    signing_log_binary: readAndEncodeFile(signingLogPath)
};

Promise.all([
    Promise.resolve(inputData.signed_pdf_binary),
    Promise.resolve(inputData.signing_log_binary)
])
.then(([signedPdfBase64, signingLogBase64]) => {
    return uploadFile(inputData.signed_pdf_name, Buffer.from(signedPdfBase64, 'base64'))
        .then(response1 => {
            console.log("Signed PDF uploaded successfully:", response1);
            return uploadFile(inputData.signing_log_name, Buffer.from(signingLogBase64, 'base64'));
        });
})
.then(response2 => {
    console.log("Signing Log uploaded successfully:", response2);
})
.catch(error => {
    console.error("Upload failed:", error.message);
});
