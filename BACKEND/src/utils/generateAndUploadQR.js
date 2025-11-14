import QRCode from "qrcode";
import { put } from "@vercel/blob";

const generateAndUploadQR = async (studentRegisterNumber, studentId, certificateId) => {
  try {
    if (!certificateId) {
      throw new Error(" certificateId is missing. Cannot generate QR.");
    }

    if (!process.env.FRONTEND_URL) {
      throw new Error(" FRONTEND_URL is not defined in your .env file.");
    }

    console.log(" Starting QR generation");
    console.log(" Student ID:", studentId);
    console.log(" Register Number:", studentRegisterNumber);
    console.log(" Certificate ID:", certificateId);


    // Now always go to login page
    const verificationUrl = `${process.env.FRONTEND_URL}/student/login`;
    console.log("🔗 Verification URL:", verificationUrl);

    // Generate QR code PNG buffer
    const qrBuffer = await QRCode.toBuffer(loginUrl, { type: "png" });

    // Upload to Vercel Blob (always overwrite same file)
    const blob = await put(`studentqrs/fixed-login.png`, qrBuffer, {
      access: "public",
      token: process.env.VERCEL_BLOB_RW_TOKEN,
      allowOverwrite: true,
    });

    console.log(" QR uploaded successfully:", blob.url);
    return blob.url;
  } catch (err) {
    console.error(" QR generation failed:", err.message);
    throw new Error(`QR code generation failed: ${err.message}`);
  }
};

export default generateAndUploadQR;
