// Optional dependency: nodemailer
// Recommended: run `npm install nodemailer --save` in the server folder to enable real email sending.
const MyConstants = require('./MyConstants');

let transporter = null;
try {
  console.log(MyConstants.EMAIL_USER)
  console.log(MyConstants.EMAIL_PASS)
  const nodemailer = require('nodemailer');
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: MyConstants.EMAIL_USER,
        pass: MyConstants.EMAIL_PASS,
    },
    tls: {
        ciphers: 'SSLv3'
    }
  });
} catch (err) {
  console.warn('nodemailer not available; email sending disabled. Install with: npm install nodemailer --save');
}

const EmailUtil = {
  send(email, id, token) {

    const html = `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:auto;background:#f0f2f5;padding:40px 16px;">

        <!-- HEADER -->
        <div style="background:#111111;padding:28px 32px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;letter-spacing:2px;">GEAR SPORT</h1>
          <p style="color:#888888;margin:6px 0 0 0;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Xac thuc tai khoan</p>
        </div>

        <!-- BODY -->
        <div style="background:#ffffff;padding:40px 32px;">

          <p style="color:#333333;font-size:15px;margin:0 0 12px 0;">Chao ban,</p>
          <p style="color:#555555;font-size:14px;line-height:1.7;margin:0 0 28px 0;">
            Cam on ban da dang ky tai khoan tai <strong style="color:#111111;">Gear Sport</strong>.
            Vui long su dung thong tin duoi day de kich hoat tai khoan cua ban.
          </p>

          <!-- ID BOX -->
          <div style="margin:0 0 16px 0;">
            <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;color:#888888;text-transform:uppercase;letter-spacing:1px;">ID tai khoan</p>
            <div style="padding:14px 18px;background:#f5f5f5;border:1px solid #e0e0e0;border-radius:8px;font-family:'Courier New',monospace;font-size:13px;color:#222222;word-break:break-all;">
              ${id}
            </div>
          </div>

          <!-- TOKEN BOX -->
          <div style="margin:0 0 28px 0;">
            <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;color:#888888;text-transform:uppercase;letter-spacing:1px;">Token kich hoat</p>
            <div style="padding:14px 18px;background:#f5f5f5;border:1px solid #e0e0e0;border-radius:8px;font-family:'Courier New',monospace;font-size:13px;color:#222222;word-break:break-all;">
              ${token}
            </div>
          </div>

          <!-- CTA Note -->
          <div style="background:#f8f9fa;border-left:3px solid #111111;padding:14px 18px;border-radius:0 8px 8px 0;">
            <p style="margin:0;font-size:13px;color:#444444;line-height:1.6;">
              Nhap <strong>ID</strong> va <strong>Token</strong> nay vao trang kich hoat tai khoan de hoan tat dang ky.
            </p>
          </div>

        </div>

        <!-- FOOTER -->
        <div style="background:#f0f2f5;padding:20px 32px;text-align:center;border-top:1px solid #e0e0e0;border-radius:0 0 12px 12px;">
          <p style="color:#aaaaaa;font-size:11px;margin:0;">© 2026 Gear Sport. All rights reserved.</p>
          <p style="color:#cccccc;font-size:11px;margin:6px 0 0 0;">Email nay duoc gui tu dong, vui long khong reply.</p>
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
        subject: "Kich hoat tai khoan - Gear Sport",
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
  },

  sendOrderConfirmation(email, order) {
    const formatPrice = (p) => Number(p || 0).toLocaleString('vi-VN') + 'VND';
    const orderDate = new Date(order.cdate || Date.now()).toLocaleDateString('vi-VN', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const itemRows = (order.items || []).map((item, i) => `
      <tr style="border-bottom:1px solid #eeeeee;">
        <td style="padding:12px 8px;text-align:center;color:#999999;font-size:13px;">${i + 1}</td>
        <td style="padding:12px 8px;">
          <p style="margin:0;font-weight:600;color:#111111;font-size:14px;">${item.name || 'San pham'}</p>
          ${item.size ? `<p style="margin:3px 0 0 0;font-size:12px;color:#888888;">Size: ${item.size}</p>` : ''}
        </td>
        <td style="padding:12px 8px;text-align:center;font-size:14px;color:#333333;">${item.quantity || 1}</td>
        <td style="padding:12px 8px;text-align:right;font-weight:600;color:#111111;font-size:14px;">${formatPrice((item.price || 0) * (item.quantity || 1))}</td>
      </tr>
    `).join('');

    const shipping = order.shippingInfo || {};
    const shippingFee = order.totalAmount > 500000 ? 0 : 30000;
    const grandTotal = (order.totalAmount || 0) + shippingFee;

    const html = `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:640px;margin:auto;background:#f0f2f5;padding:40px 16px;">

        <!-- HEADER -->
        <div style="background:#111111;padding:28px 32px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;letter-spacing:2px;">GEAR SPORT</h1>
          <p style="color:#888888;margin:6px 0 0 0;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Xac nhan don hang</p>
        </div>

        <!-- BODY -->
        <div style="background:#ffffff;padding:40px 32px;">

          <!-- Success Mark -->
          <div style="text-align:center;margin-bottom:32px;padding-bottom:28px;border-bottom:1px solid #eeeeee;">
            <div style="display:inline-block;width:56px;height:56px;background:#111111;border-radius:50%;margin-bottom:16px;text-align:center;line-height:60px;">
              <span style="color:#ffffff;font-size:26px;font-weight:700;">&#10003;</span>
            </div>
            <h2 style="color:#111111;margin:0 0 8px 0;font-size:20px;font-weight:700;">Don hang da duoc dat!</h2>
            <p style="color:#666666;margin:0;font-size:14px;">Cam on ban da mua sam tai Gear Sport.</p>
          </div>

          <!-- Order Info -->
          <div style="background:#f8f9fa;border-radius:10px;padding:20px 24px;margin-bottom:28px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:5px 0;color:#666666;font-size:13px;">Ma don hang:</td>
                <td style="padding:5px 0;text-align:right;font-weight:700;color:#111111;font-size:13px;">#${order.orderNumber || order._id}</td>
              </tr>
              <tr>
                <td style="padding:5px 0;color:#666666;font-size:13px;">Ngay dat:</td>
                <td style="padding:5px 0;text-align:right;font-size:13px;color:#333333;">${orderDate}</td>
              </tr>
              <tr>
                <td style="padding:5px 0;color:#666666;font-size:13px;">Phuong thuc:</td>
                <td style="padding:5px 0;text-align:right;font-size:13px;color:#333333;">${order.paymentMethod || 'COD'}</td>
              </tr>
              <tr>
                <td style="padding:5px 0;color:#666666;font-size:13px;">Trang thai:</td>
                <td style="padding:5px 0;text-align:right;">
                  <span style="background:#fff8e1;color:#f57c00;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:600;">Cho xu ly</span>
                </td>
              </tr>
            </table>
          </div>

          <!-- Products -->
          <p style="color:#111111;font-size:12px;font-weight:700;margin:0 0 10px 0;text-transform:uppercase;letter-spacing:1px;">San pham da mua</p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;border:1px solid #eeeeee;border-radius:8px;overflow:hidden;">
            <thead>
              <tr style="background:#f8f9fa;">
                <th style="padding:10px 8px;text-align:center;font-size:11px;color:#888888;font-weight:600;">#</th>
                <th style="padding:10px 8px;text-align:left;font-size:11px;color:#888888;font-weight:600;">San pham</th>
                <th style="padding:10px 8px;text-align:center;font-size:11px;color:#888888;font-weight:600;">SL</th>
                <th style="padding:10px 8px;text-align:right;font-size:11px;color:#888888;font-weight:600;">Thanh tien</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
          </table>

          <!-- Totals -->
          <div style="border-top:2px solid #111111;padding-top:20px;margin-bottom:24px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:5px 0;color:#666666;font-size:14px;">Tam tinh:</td>
                <td style="padding:5px 0;text-align:right;font-size:14px;color:#333333;">${formatPrice(order.totalAmount)}</td>
              </tr>
              <tr>
                <td style="padding:5px 0;color:#666666;font-size:14px;">Phi van chuyen:</td>
                <td style="padding:5px 0;text-align:right;font-size:14px;color:${shippingFee === 0 ? '#00a843' : '#333333'};font-weight:${shippingFee === 0 ? '700' : '400'};">${shippingFee === 0 ? 'Mien phi' : formatPrice(shippingFee)}</td>
              </tr>
              <tr>
                <td style="padding:14px 0 0 0;font-weight:800;font-size:18px;color:#111111;">Tong cong:</td>
                <td style="padding:14px 0 0 0;text-align:right;font-weight:800;font-size:18px;color:#111111;">${formatPrice(grandTotal)}</td>
              </tr>
            </table>
          </div>

          ${shipping.fullName ? `
          <div style="background:#f8f9fa;border-radius:10px;padding:20px 24px;">
            <p style="margin:0 0 10px 0;font-size:12px;font-weight:700;color:#111111;text-transform:uppercase;letter-spacing:1px;">Thong tin giao hang</p>
            <p style="margin:4px 0;font-size:13px;color:#333333;"><span style="color:#888888;">Nguoi nhan:</span> <strong>${shipping.fullName}</strong></p>
            <p style="margin:4px 0;font-size:13px;color:#333333;"><span style="color:#888888;">Dia chi:</span> ${shipping.address || ''}${shipping.city ? ', ' + shipping.city : ''}</p>
            <p style="margin:4px 0;font-size:13px;color:#333333;"><span style="color:#888888;">Dien thoai:</span> ${shipping.phone || ''}</p>
          </div>
          ` : ''}

        </div>

        <!-- FOOTER -->
        <div style="background:#f0f2f5;padding:20px 32px;text-align:center;border-top:1px solid #e0e0e0;border-radius:0 0 12px 12px;">
          <p style="color:#aaaaaa;font-size:11px;margin:0;">© 2026 Gear Sport. All rights reserved.</p>
          <p style="color:#cccccc;font-size:11px;margin:6px 0 0 0;">Neu co thac mac, vui long lien he chung toi.</p>
        </div>

      </div>
    `;

    if (!transporter) {
      console.warn('EmailUtil.sendOrderConfirmation called but transporter is not configured.');
      console.log('Order confirmation for', email, 'order=', order.orderNumber || order._id);
      return Promise.resolve(true);
    }

    return new Promise(function (resolve) {
      const mailOptions = {
        from: `"Gear Sport" <${MyConstants.EMAIL_USER}>`,
        to: email,
        subject: `Don hang #${order.orderNumber || order._id} da duoc xac nhan - Gear Sport`,
        html: html
      };

      transporter.sendMail(mailOptions, function (err) {
        if (err) {
          console.error('transporter.sendMail (order confirmation) error:', err);
          resolve(false);
        } else {
          console.log('Order confirmation email sent to', email);
          resolve(true);
        }
      });
    });
  }
};

module.exports = EmailUtil;
