// import nodemailer from "nodemailer";

// export const sendBulkEmails = async (emails, subject, html) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.MAIL_USER,
//       pass: process.env.MAIL_PASS, // use App Password if 2FA enabled
//     },
//   });

//   const sendPromises = emails.map((to) =>
//     transporter.sendMail({
//       from: `"Nystai Institute" <${process.env.MAIL_USER}>`,
//       to,
//       subject,
//       html,
//     })
//   );

//   await Promise.all(sendPromises);
// };


import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // or "outlook" if you're using Outlook
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const sendBulkEmails = async (to, subject, data, showMarkDone = false, completedMessage = "") => {
  const html = `
<div style="font-family: Arial, sans-serif; background-color: #fcf9f3; padding: 20px; color: #333;">
  <img src="cid:nystailogo@cid" alt="Nystai Logo" style="height: 60px; margin-bottom: 20px;" />

  <h2 style="font-size: 22px; color: #1f3e23;">📘 Course: ${data.course}</h2>
  <h1 style="font-size: 26px; color: #ED1C24;">📝 New Assignment: ${data.task_title}</h1>
  <h3 style="font-size: 20px;">📅 Due by: ${new Date(data.due_date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })}</h3>

  <p style="line-height: 1.6; font-size: 16px; margin-top: 20px;">
    ${data.task_description || ""}
  </p>

  ${data.remark ? `
  <p style="line-height: 1.6; font-size: 16px; margin-top: 20px; color: #d9534f;">
    <strong>📝 Remark:</strong> ${data.remark}
  </p>` : ""}

  ${completedMessage ? `
  <p style="line-height: 1.6; font-size: 16px; margin-top: 20px; color: #1f3e23;">
    <strong>${completedMessage}</strong>
  </p>` : ""}

  ${showMarkDone ? `
  <div style="margin: 30px 0;">
    <a href="${data.viewLink || "#"}" style="display: inline-block; margin-bottom: 10px;">
      <button style="background: #f6c200; color: #1f3e23; border: none; padding: 12px 24px; font-size: 16px; border-radius: 5px;">
        Mark as Done
      </button>
    </a>
  </div>` : ""}

  <hr style="border-top: 1px solid #f6c200; margin: 30px 0;" />

  <p style="font-size: 15px;"><strong>Submission Method:</strong> Please upload your assignment via the student dashboard before the deadline.</p>
  <p style="font-size: 15px;"><strong>Note:</strong> This task is important for progressing to the next module. Kindly ensure timely submission.</p>

  <p style="margin-top: 30px; font-size: 15px;">If you have any questions, feel free to reach out to your trainer or reply to this email.</p>

  <p style="margin-top: 20px; font-size: 15px;">
    Good luck!<br/>
    <strong>NYSTAI Team</strong><br/>
    Adhiba Technologies, Coimbatore<br/>
    <a href="https://www.nystai.in" style="color: #1f3e23;">www.nystai.in</a> |
    <a href="mailto:support@nystai.in" style="color: #1f3e23;">support@nystai.in</a> |
    +91 81899 77700
  </p>
</div>
`;

  await transporter.sendMail({
    from: `"Nystai Institute" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments: [
      {
        filename: "logo.png",
        path: path.resolve(__dirname, "../assets/logo.png"),
        cid: "nystailogo@cid",
      },
    ],
  });
};




