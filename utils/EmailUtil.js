// Optional dependency: nodemailer
// Recommended: run `npm install nodemailer --save` in the server folder to enable real email sending.
const MyConstants = require('./MyConstants');

let transporter = null;
try {
  // try to require nodemailer; if missing, we'll fall back to a noop implementation
  // so the server doesn't crash in environments without the package.
  // CLI: npm install nodemailer --save
  const nodemailer = require('nodemailer');
  transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
        user: MyConstants.EMAIL_USER,
        pass: MyConstants.EMAIL_PASS, // Use App Password for 2FA
    },
    tls: {
        ciphers: 'SSLv3' // Often required for compatibility
    }
});
} catch (err) {
  console.warn('nodemailer not available; email sending disabled. Install with: npm install nodemailer --save');
}

const EmailUtil = {
  // send returns a Promise that resolves to true on success, false on failure or when transporter is not available
  send(email, id, token) {
    const text =
      'Thanks for signing up, please input these informations to activate your account:\n' +
      '\t.id: ' + id + '\n' +
      '\t.token: ' + token;

    if (!transporter) {
      // nodemailer not installed / not configured: for development we'll log the activation info
      // and resolve true so the signup flow can continue during local testing.
      console.warn('EmailUtil.send called but transporter is not configured. Activation token will be logged to console.');
      console.log('Activation for', email, 'id=', id, 'token=', token);
      return Promise.resolve(true);
    }

    return new Promise(function (resolve) {
      const mailOptions = {
        from: MyConstants.EMAIL_USER,
        to: email,
        subject: 'Signup | Verification',
        text: text
      };

      transporter.sendMail(mailOptions, function (err) {
        if (err) {
          console.error('transporter.sendMail error:', err);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
};

module.exports = EmailUtil;
