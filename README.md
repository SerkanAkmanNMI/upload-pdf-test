File Upload Test - IRIS CRM API

📌 Overview

This project is a Node.js script designed to test file uploads to the IRIS CRM API using application/octet-stream. The script reads local PDF files, encodes them to Base64 (to simulate Zapier's behavior), decodes them back to binary, and then uploads them.

🔧 Setup Instructions

1️⃣ Install Dependencies

Ensure you have Node.js installed. Then, clone this repository and run:

npm install

2️⃣ Create a .env File

Before running the script, create a .env file in the root directory with the following content:

API_KEY=your_api_key_here
API_URL=https://{{your_url}}/api/v1/helpdesk/file

Replace your_api_key_here with the actual API key.
Replace your_url with actual url.

3️⃣ Run the Test

Execute the script with:

`node upload-test.js`

If successful, you should see output like this:

🚀 Starting file upload test...
✅ Uploaded: signed-test.pdf { status: 'success', fileId: '...' }
✅ Uploaded: signing-log-test.pdf { status: 'success', fileId: '...' }
🎉 All uploads completed!

📌 Issue Being Investigated

Zapier is currently failing to upload files to IRIS CRM, returning the error:

"Empty file is not allowed."

However, this Node.js test works, indicating that Zapier may be handling files differently.

Possible Causes of Zapier's Issue

Zapier may be sending Base64 instead of raw binary.

Request headers might not be correctly set.

Zapier may not be handling the file content properly before sending.

Next Steps

Compare Zapier's file-handling with this script.

Modify Zapier's webhook step to send raw binary instead of Base64.

If Zapier still fails, use a curl command to verify API behavior manually.

🛠️ Debugging with Curl

Try uploading a file manually with:

```
curl -X POST "$API_URL?name=test.pdf&extension=pdf" \
     -H "X-API-KEY: $API_KEY" \
     -H "Content-Type: application/octet-stream" \
     --data-binary @test-signed.pdf
```

If this works, then the issue is with Zapier, not the API.

✅ Conclusion

This project confirms that the API correctly accepts binary file uploads, suggesting that the issue lies in Zapier's handling of file data. Further debugging in Zapier is required to resolve the problem.

PS: The `old-upload-test.js` script mimics the original approach used by the client. It reads the file, encodes it in Base64, and then decodes it back to binary before uploading. This method was causing issues with the API rejecting the file as empty, which was resolved in the updated method by sending the raw binary data directly.