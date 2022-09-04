import { createTransport, SendMailOptions, SentMessageInfo } from "nodemailer";

import hbs from "nodemailer-express-handlebars";
import { join } from "path";
import { config } from "dotenv";

config();

export const sendMail = async (
  options: SendMailOptions
): Promise<SentMessageInfo> => {
  const transporter = createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    // port: process.env.MAIL_PORT || 465,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  transporter.use(
    "compile",
    hbs({
      viewEngine: {
        extname: ".handlebars",
        layoutsDir: join(process.cwd(), "/templates/mails"),
        defaultLayout: "main",
        partialsDir: join(process.cwd(), "/templates/mails"),
      },
      viewPath: join(process.cwd(), "/templates/mails"),
    })
  );

  return transporter.sendMail({
    ...options,
    from: process.env.MAIL_FROM || "",
  });
};
