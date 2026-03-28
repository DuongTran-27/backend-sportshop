// Optional dependency: nodemailer
// Recommended: run `npm install nodemailer --save` in the server folder to enable real email sending.
const MyConstants = require('./MyConstants');

let transporter = null;
try {
  console.log(MyConstants.EMAIL_USER)
  console.log(MyConstants.EMAIL_PASS)
  // try to require nodemailer; if missing, we'll fall back to a noop implementation
  // so the server doesn't crash in environments without the package.
  // CLI: npm install nodemailer --save
  const nodemailer = require('nodemailer');
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
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
  send(email, id, token) {

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f4f6f8;">
        
        <!-- HEADER -->
        <div style="text-align: center; padding-bottom: 20px;">
          <h2 style="color: #4CAF50; margin: 0;">Gear Sport</h2>
        </div>

        <!-- BODY -->
        <div style="background: white; padding: 24px; border-radius: 10px;">
          
          <p>Chào bạn 👋,</p>

          <p>Cảm ơn bạn đã đăng ký tài khoản tại <b>Gear Sport</b>.</p>

          <p>Vui lòng sử dụng thông tin bên dưới để kích hoạt tài khoản:</p>

          <!-- ID BOX -->
          <div style="margin: 20px 0;">
            <p style="margin-bottom: 5px;"><b>ID:</b></p>
            <div style="padding: 12px; background: #eee; border-radius: 6px; font-family: monospace;">
              ${id}
            </div>
          </div>

          <!-- TOKEN BOX -->
          <div style="margin: 20px 0;">
            <p style="margin-bottom: 5px;"><b>Token:</b></p>
            <div style="padding: 12px; background: #eee; border-radius: 6px; font-family: monospace; word-break: break-all;">
              ${token}
            </div>
          </div>

          <p>👉 Nhập ID và Token này vào trang kích hoạt tài khoản trên website.</p>
        </div>

        <!-- FOOTER -->
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: gray;">
          <hr/>
          <p>© 2026 Gear Sport</p>
        </div>

      </div>
    `;

    if (!transporter) {
      console.warn('EmailUtil.send called but transporter is not configured.');
      console.log('Activation for', email, 'id=', id, 'token=', token);
      return Promise.resolve(true);
    }

    return new Promise(function (resolve) {
      const mailOptions = {
        from: `"Gear Sport" <${MyConstants.EMAIL_USER}>`,
        to: email,
        subject: "Mã kích hoạt tài khoản - Gear Sport",
        html: html
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
