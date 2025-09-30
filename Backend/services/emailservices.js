const nodemailer = require('nodemailer');
require('dotenv').config();

// SMTP Transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Test connection
transporter.verify(function (error, success) {
  if (error) {
    console.log('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to send emails');
  }
});

// Send Simple Welcome Email (NO tokens required)
function sendWelcomeEmail(employeeData, callback) {
  const { email, firstName, lastName } = employeeData;

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: 'Welcome to Our Company!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Our Company! 🎉</h1>
          </div>
          <div class="content">
            <p>Dear ${firstName} ${lastName},</p>
            
            <p>We are thrilled to welcome you to our team! 🎊</p>
            
            <p>Your employee profile has been successfully created. The HR team will reach out to you shortly with further instructions regarding:</p>
            
            <ul>
              <li>Your login credentials</li>
              <li>Onboarding schedule</li>
              <li>Company policies and guidelines</li>
              <li>Required documentation</li>
            </ul>
            
            <p>We're excited to have you on board and look forward to working with you!</p>
            
            <p>If you have any questions in the meantime, please don't hesitate to contact the HR department.</p>
            
            <p>Best regards,<br><strong>HR Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} Company Name. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email send error:', error);
      return callback(error, null);
    }
    console.log('Email sent successfully:', info.messageId);
    return callback(null, { success: true, messageId: info.messageId });
  });
}

module.exports = {
  sendWelcomeEmail,
};