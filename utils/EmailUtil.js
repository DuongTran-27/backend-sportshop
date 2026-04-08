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
  },

  // Gửi email xác nhận đơn hàng thành công
  sendOrderConfirmation(email, order) {
    const formatPrice = (p) => Number(p || 0).toLocaleString('vi-VN') + '₫';
    const orderDate = new Date(order.cdate || Date.now()).toLocaleDateString('vi-VN', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    // Build items table rows
    const itemRows = (order.items || []).map((item, i) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px 8px; text-align: center; color: #666;">${i + 1}</td>
        <td style="padding: 12px 8px;">
          <div>
            <p style="margin: 0; font-weight: 600; color: #111;">${item.name || 'Sản phẩm'}</p>
            ${item.size ? `<p style="margin: 2px 0 0 0; font-size: 12px; color: #888;">Size: ${item.size}</p>` : ''}
          </div>
        </td>
        <td style="padding: 12px 8px; text-align: center;">${item.quantity || 1}</td>
        <td style="padding: 12px 8px; text-align: right; font-weight: 600; color: #111;">${formatPrice((item.price || 0) * (item.quantity || 1))}</td>
      </tr>
    `).join('');

    const shipping = order.shippingInfo || {};
    const shippingFee = order.totalAmount > 500000 ? 0 : 30000;
    const grandTotal = (order.totalAmount || 0) + shippingFee;

    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: auto; background: #f4f6f8; padding: 0;">
        
        <!-- HEADER -->
        <div style="background: linear-gradient(135deg, #111 0%, #333 100%); padding: 32px 24px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 24px; letter-spacing: 1px;">⚡ Gear Sport</h1>
          <p style="color: #ccc; margin: 8px 0 0 0; font-size: 13px;">Xác nhận đơn hàng</p>
        </div>

        <!-- BODY -->
        <div style="background: white; padding: 32px 24px;">
          
          <!-- Success Banner -->
          <div style="text-align: center; margin-bottom: 28px;">
            <div style="width: 60px; height: 60px; background: #e8f5e8; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px;">
              <span style="font-size: 28px;">✅</span>
            </div>
            <h2 style="color: #111; margin: 0 0 8px 0; font-size: 22px;">Đặt hàng thành công!</h2>
            <p style="color: #666; margin: 0; font-size: 14px;">Cảm ơn bạn đã mua sắm tại Gear Sport</p>
          </div>

          <!-- Order Info -->
          <div style="background: #f8f9fa; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 4px 0; color: #666; font-size: 13px;">Mã đơn hàng:</td>
                <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #fa5400; font-size: 14px;">${order.orderNumber || order._id}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #666; font-size: 13px;">Ngày đặt:</td>
                <td style="padding: 4px 0; text-align: right; font-size: 13px; color: #333;">${orderDate}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #666; font-size: 13px;">Phương thức:</td>
                <td style="padding: 4px 0; text-align: right; font-size: 13px; color: #333;">${order.paymentMethod || 'COD'}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #666; font-size: 13px;">Trạng thái:</td>
                <td style="padding: 4px 0; text-align: right;">
                  <span style="background: #fff3e0; color: #e65100; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">Đang xử lý</span>
                </td>
              </tr>
            </table>
          </div>

          <!-- Products Table -->
          <h3 style="color: #111; font-size: 16px; margin: 0 0 12px 0;">📦 Sản phẩm đã mua</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f8f9fa; border-bottom: 2px solid #eee;">
                <th style="padding: 10px 8px; text-align: center; font-size: 12px; color: #666; font-weight: 600;">#</th>
                <th style="padding: 10px 8px; text-align: left; font-size: 12px; color: #666; font-weight: 600;">Sản phẩm</th>
                <th style="padding: 10px 8px; text-align: center; font-size: 12px; color: #666; font-weight: 600;">SL</th>
                <th style="padding: 10px 8px; text-align: right; font-size: 12px; color: #666; font-weight: 600;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
          </table>

          <!-- Totals -->
          <div style="border-top: 2px solid #eee; padding-top: 16px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 4px 0; color: #666; font-size: 14px;">Tạm tính:</td>
                <td style="padding: 4px 0; text-align: right; font-size: 14px;">${formatPrice(order.totalAmount)}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #666; font-size: 14px;">Phí vận chuyển:</td>
                <td style="padding: 4px 0; text-align: right; font-size: 14px;">${shippingFee === 0 ? '<span style="color: #00a843; font-weight: 600;">Miễn phí</span>' : formatPrice(shippingFee)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0 0 0; font-weight: 700; font-size: 18px; color: #111;">Tổng cộng:</td>
                <td style="padding: 8px 0 0 0; text-align: right; font-weight: 700; font-size: 18px; color: #fa5400;">${formatPrice(grandTotal)}</td>
              </tr>
            </table>
          </div>

          <!-- Shipping Info -->
          ${shipping.fullName ? `
          <div style="margin-top: 24px; background: #f8f9fa; border-radius: 10px; padding: 16px 20px;">
            <h3 style="color: #111; font-size: 14px; margin: 0 0 10px 0;">🚚 Thông tin giao hàng</h3>
            <p style="margin: 4px 0; font-size: 13px; color: #333;"><b>Người nhận:</b> ${shipping.fullName}</p>
            <p style="margin: 4px 0; font-size: 13px; color: #333;"><b>Địa chỉ:</b> ${shipping.address || ''}${shipping.city ? ', ' + shipping.city : ''}</p>
            <p style="margin: 4px 0; font-size: 13px; color: #333;"><b>Số điện thoại:</b> ${shipping.phone || ''}</p>
          </div>
          ` : ''}

        </div>

        <!-- FOOTER -->
        <div style="background: #f4f6f8; padding: 20px 24px; text-align: center; border-radius: 0 0 10px 10px;">
          <p style="color: #999; font-size: 12px; margin: 0;">Nếu có thắc mắc, vui lòng liên hệ chúng tôi qua email.</p>
          <p style="color: #bbb; font-size: 11px; margin: 8px 0 0 0;">© 2026 Gear Sport. All rights reserved.</p>
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
        subject: `✅ Đơn hàng #${order.orderNumber || order._id} đã được xác nhận - Gear Sport`,
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
