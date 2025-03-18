import nodemailer from "nodemailer";

const emailSender = async (toEmail, subject, body) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: ` Blog application <${process.env.EMAIL_USER}>`,
      to: `${toEmail}`,
      subject: `${subject}`,
      html: `${body}`,
    });

    return info;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};

export default emailSender;
