import nodemailer from "nodemailer";

const sendEmail = async (to, subject, body) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"BlogApp" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html: body,
  });
};

export default sendEmail;