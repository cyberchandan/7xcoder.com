import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const getTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ Email credentials missing, skipping email sending.');
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const getUnsubscribeUrl = (email) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  const token = jwt.sign({ email }, secret, { expiresIn: '3650d' }); // 10 years valid token
  // Use frontend URL, fallback to backend if missing
  const baseUrl = process.env.FRONTEND_URL || import.meta.env?.VITE_BACKEND_URL || 'https://7xcoder.com';
  return `${baseUrl.includes('api') ? 'https://7xcoder.com' : baseUrl}/api/unsubscribe?token=${token}`;
};

export const sendWelcomeEmail = async (email) => {
  const transporter = getTransporter();
  if (!transporter) return;

  const unsubscribeUrl = getUnsubscribeUrl(email);

  const mailOptions = {
    from: `"7xcoder" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Welcome to 7xcoder Updates! 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #0b5edd; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">Welcome to 7xcoder!</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hello there,</p>
          <p>Thank you for subscribing to our updates! We are thrilled to have you here.</p>
          <p>You will now receive our latest <strong>Blog Posts</strong> featuring digital marketing insights, and exciting <strong>Career Opportunities</strong> as soon as they are published.</p>
          <p>Stay tuned for amazing content!</p>
          <br/>
          <p>Best Regards,<br/><strong>The 7xcoder Team</strong></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888; text-align: center;">
            If you change your mind, you can <a href="${unsubscribeUrl}" style="color: #0b5edd;">unsubscribe from this list</a> at any time.
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (err) {
    console.error(`❌ Failed to send welcome email to ${email}:`, err.message);
  }
};

export const sendMassAlertEmail = async (subscribers, type, item) => {
  const transporter = getTransporter();
  if (!transporter || !subscribers || subscribers.length === 0) return;

  const typeName = type === 'blog' ? 'Blog Post' : 'Career Opportunity';
  const prefix = type === 'blog' ? '📝 New Post' : '💼 New Job';

  for (const subscriber of subscribers) {
    // Generate individual unsubscribe URLs
    const unsubscribeUrl = getUnsubscribeUrl(subscriber.email);

    const mailOptions = {
      from: `"7xcoder" <${process.env.EMAIL_USER}>`,
      to: subscriber.email,
      subject: `${prefix}: ${item.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #0b5edd; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">New ${typeName} at 7xcoder!</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #0b5edd; margin-top: 0;">${item.title}</h2>
            <p>${item.description}</p>
            ${item.location ? `<p><strong>📍 Location:</strong> ${item.location}</p>` : ''}
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://7xcoder.com/${type === 'blog' ? 'blog' : 'careers'}" style="background-color: #0b5edd; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Details</a>
            </div>
            <p>Best Regards,<br/><strong>The 7xcoder Team</strong></p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #888; text-align: center;">
              You are receiving this because you subscribed to updates. <a href="${unsubscribeUrl}" style="color: #0b5edd;">Unsubscribe here</a>.
            </p>
          </div>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error(`❌ Failed to send alert email to ${subscriber.email}:`, err.message);
    }
  }
  console.log(`✅ Mass alert distributed for ${item.title}`);
};
