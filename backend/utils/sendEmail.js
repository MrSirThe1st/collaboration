import nodemailer from "nodemailer";
import { google } from "googleapis";
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  try {
    // Create OAuth2 client
    const oauth2Client = new OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    // Get access token with better error handling
    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.error("OAuth2 Error Details:", {
            errorMessage: err.message,
            errorCode: err.code,
            errorStack: err.stack,
            errorResponse: err.response?.data,
          });
          reject(`Failed to create access token: ${err.message}`);
        }
        resolve(token);
      });
    });

    if (!accessToken) {
      throw new Error("No access token received");
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USERNAME,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    // Verify transporter
    await transporter.verify();
    console.log("Transporter verified successfully");

    return transporter;
  } catch (error) {
    console.error("Transporter creation error:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });
    throw error;
  }
};

const createEmailTemplate = (options) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>${options.subject}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
          /* Add some basic styling */
          body {
            background-color: #f6f9fc;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            font-size: 14px;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
          }

          .container {
            background-color: #ffffff;
            border-radius: 12px;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .logo {
            text-align: center;
            margin-bottom: 20px;
          }

          .logo img {
            width: 150px;
            height: auto;
          }

          .content {
            padding: 20px;
            color: #333333;
          }

          .button {
            background-color: #007bff;
            border-radius: 6px;
            color: #ffffff;
            display: inline-block;
            font-size: 16px;
            font-weight: bold;
            margin: 20px 0;
            padding: 12px 24px;
            text-decoration: none;
            text-transform: capitalize;
          }

          .footer {
            color: #6b7280;
            font-size: 12px;
            text-align: center;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <!-- Replace with your logo URL -->
            <img src="YOUR_LOGO_URL" alt="Your Company Logo">
          </div>
          <div class="content">
            <h2>${options.subject}</h2>
            <p>${options.message}</p>
            ${
              options.actionButton
                ? `
              <div style="text-align: center;">
                <a href="${options.actionButton.url}" class="button">
                  ${options.actionButton.text}
                </a>
              </div>
            `
                : ""
            }
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Yippie. All rights reserved.</p>
            <p>If you didn't request this email, please ignore it.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const sendEmail = async (options) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_USERNAME}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: createEmailTemplate(options),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send email");
  }
};

export default sendEmail;
