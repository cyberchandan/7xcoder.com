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
  // Directly point to the Vercel Production Backend URL to bypass Vercel Authentication on mobile
  const vercelProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null;
  const cleanVercelFallback = 'https://7xcoder-com-backend.vercel.app';
  
  const baseUrl = process.env.BACKEND_URL || vercelProdUrl || cleanVercelFallback;
  return `${baseUrl}/api/unsubscribe/${token}`;
};

export const sendWelcomeEmail = async (email) => {
  const transporter = getTransporter();
  if (!transporter) return;

  const unsubscribeUrl = getUnsubscribeUrl(email);

  const mailOptions = {
    from: `"7xcoder" <${process.env.EMAIL_USER}>`,
    replyTo: process.env.EMAIL_USER,
    to: email,
    subject: `Welcome to 7xcoder Updates! 🎉`,
    headers: {
      'List-Unsubscribe': `<${unsubscribeUrl}>`
    },
    text: `Welcome to 7xcoder!\n\nYour Digital Marketing & Software Partner\n\nHello there,\nThank you for subscribing to our updates! We are absolutely thrilled to have you join our digital community.\n\nAbout 7xcoder:\nWe are a premier software agency providing top-tier digital marketing, custom web and app development, branding, graphic design, and innovative creative services. Our core mission is to empower every digital move you make and drive scalable, measurable growth for your business.\n\nVisit Our Website: https://7xcoder.com/\n\nYou will now receive our latest Blog Posts featuring digital marketing insights, alongside exciting Career Opportunities as soon as they are published. Stay tuned for amazing content!\n\nBest Regards,\nThe 7xcoder Team\n\nIf you change your mind, you can unsubscribe from this list at any time: ${unsubscribeUrl}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          @keyframes pulseBtn {
            0% { transform: scale(1); box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3); }
            50% { transform: scale(1.05); box-shadow: 0 8px 20px rgba(37, 99, 235, 0.6); }
            100% { transform: scale(1); box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3); }
          }
          .animated-btn {
            animation: pulseBtn 2.5s infinite ease-in-out;
            display: inline-block;
          }
          .animated-btn:hover {
            box-shadow: 0 6px 20px rgba(37, 99, 235, 0.7) !important;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f7f6;">
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; max-width: 600px; margin: 20px auto; color: #333; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          
          <div style="background: linear-gradient(135deg, #0b5edd 0%, #1e3a8a 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 1px;">Welcome to 7xcoder!</h1>
            <p style="color: #cbd5e1; margin-top: 10px; font-size: 16px; margin-bottom: 0;">Your Digital Marketing & Software Partner</p>
          </div>

          <div style="padding: 30px 40px;">
            <p style="font-size: 16px; color: #334155;">Hello there,</p>
            <p style="font-size: 16px; color: #334155; line-height: 1.6;">Thank you for subscribing to our updates! We are absolutely thrilled to have you join our digital community.</p>
            
            <div style="background-color: #f8fafc; padding: 20px 25px; border-left: 4px solid #0b5edd; margin: 25px 0; border-radius: 0 8px 8px 0;">
              <h3 style="margin-top: 0; color: #0f172a; font-size: 18px;">About 7xcoder</h3>
              <p style="margin-bottom: 0; color: #475569; line-height: 1.6; font-size: 15px;">
                We are a premier software agency providing top-tier digital marketing, custom web and app development, branding, graphic design, and innovative creative services. Our core mission is to empower every digital move you make and drive scalable, measurable growth for your business.
              </p>
            </div>

            <div style="text-align: center; margin: 40px 0;">
               <div class="animated-btn">
                 <a href="https://7xcoder.com/" style="display: inline-block; background: linear-gradient(45deg, #2563eb, #3b82f6); color: #ffffff; text-decoration: none; padding: 16px 40px; font-size: 16px; font-weight: bold; border-radius: 50px; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3); text-transform: uppercase; letter-spacing: 1.5px;">
                   Visit Our Website
                 </a>
               </div>
            </div>

            <p style="font-size: 16px; color: #334155; line-height: 1.6;">You will now receive our latest <strong>Blog Posts</strong> featuring digital marketing insights, alongside exciting <strong>Career Opportunities</strong> as soon as they are published.</p>
            <p style="font-size: 16px; color: #334155;">Stay tuned for amazing content!</p>
            
            <br/>
            <p style="font-size: 16px; color: #334155;">Best Regards,<br/><strong style="color: #0b5edd;">The 7xcoder Team</strong></p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-bottom: 0;">
              If you change your mind, you can <a href="${unsubscribeUrl}" style="color: #0b5edd; text-decoration: none;">unsubscribe from this list</a> at any time.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (err) {
    console.error(`❌ Failed to send welcome email to ${email}:`, err.message);
  }
};

export const sendGoodbyeEmail = async (email) => {
  const transporter = getTransporter();
  if (!transporter) return;

  const mailOptions = {
    from: `"7xcoder" <${process.env.EMAIL_USER}>`,
    replyTo: process.env.EMAIL_USER,
    to: email,
    subject: `You have been unsubscribed`,
    text: `Unsubscribed Successfully\n\nHello,\n\nWe're writing to confirm that you have successfully unsubscribed from 7xcoder updates.\n\nYour email address has been safely removed from our mailing list. You will no longer receive any new blog posts or career notifications moving forward, until you decide to subscribe again.\n\nWe're sorry to see you go and wish you the best!\n\nBest Regards,\nThe 7xcoder Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #666; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">Unsubscribed Successfully</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hello,</p>
          <p>We're writing to confirm that you have successfully unsubscribed from <strong>7xcoder updates</strong>.</p>
          <p>Your email address has been safely removed from our mailing list. You will no longer receive any new blog posts or career notifications moving forward, until you decide to subscribe again.</p>
          <p>We're sorry to see you go and wish you the best!</p>
          <br/>
          <p>Best Regards,<br/><strong>The 7xcoder Team</strong></p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Goodbye email sent to ${email}`);
  } catch (err) {
    console.error(`❌ Failed to send goodbye email to ${email}:`, err.message);
  }
};

export const sendMassAlertEmail = async (subscribers, type, item) => {
  const transporter = getTransporter();
  if (!transporter || !subscribers || subscribers.length === 0) return;

  const typeName = type === 'blog' ? 'Blog Post' : 'Career Opportunity';
  const prefix = type === 'blog' ? '📝 New Post' : '💼 New Job';

  const emailPromises = subscribers.map(subscriber => {
    const unsubscribeUrl = getUnsubscribeUrl(subscriber.email);

    const mailOptions = {
      from: `"7xcoder" <${process.env.EMAIL_USER}>`,
      replyTo: process.env.EMAIL_USER,
      to: subscriber.email,
      subject: `${prefix}: ${item.title}`,
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`
      },
      text: `New ${typeName} at 7xcoder!\n\n${item.title}\n\n${item.description}\n\nView Details: https://7xcoder.com/${type === 'blog' ? 'blog' : 'careers'}\n\nBest Regards,\nThe 7xcoder Team\n\nYou are receiving this because you subscribed to updates. Unsubscribe here: ${unsubscribeUrl}`,
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

    return transporter.sendMail(mailOptions).catch(err => {
      console.error(`❌ Failed to send alert email to ${subscriber.email}:`, err.message);
    });
  });

  await Promise.all(emailPromises);
  console.log(`✅ Mass alert distributed concurrently for ${item.title}`);
};

export const sendBulkWelcomeEmail = async (emails, subject, customMessage) => {
  const transporter = getTransporter();
  if (!transporter || !emails || emails.length === 0) return;

  const emailPromises = emails.map(email => {
    const unsubscribeUrl = getUnsubscribeUrl(email);
    
    // Inject Custom Message into the template if provided, else use the standard one
    const innerContent = customMessage ? 
      `<div style="font-size: 16px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${customMessage}</div>` 
      : 
      `<p style="font-size: 16px; color: #334155;">Hello there,</p>
       <p style="font-size: 16px; color: #334155; line-height: 1.6;">Thank you for subscribing to our updates! We are absolutely thrilled to have you join our digital community.</p>`;

    const mailOptions = {
      from: `"7xcoder" <${process.env.EMAIL_USER}>`,
      replyTo: process.env.EMAIL_USER,
      to: email,
      subject: subject || `Welcome to 7xcoder Updates! 🎉`,
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`
      },
      text: customMessage 
        ? `${customMessage.replace(/<[^>]*>?/gm, '')}\n\nVisit Our Website: https://7xcoder.com/\n\nIf you change your mind, you can unsubscribe from this list at any time: ${unsubscribeUrl}` 
        : `Welcome to 7xcoder!\n\nYour Digital Marketing & Software Partner\n\nHello there,\nThank you for subscribing to our updates! We are absolutely thrilled to have you join our digital community.\n\nVisit Our Website: https://7xcoder.com/\n\nIf you change your mind, you can unsubscribe from this list at any time: ${unsubscribeUrl}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @keyframes pulseBtn {
              0% { transform: scale(1); box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3); }
              50% { transform: scale(1.05); box-shadow: 0 8px 20px rgba(37, 99, 235, 0.6); }
              100% { transform: scale(1); box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3); }
            }
            .animated-btn {
              animation: pulseBtn 2.5s infinite ease-in-out;
              display: inline-block;
            }
            .animated-btn:hover {
              box-shadow: 0 6px 20px rgba(37, 99, 235, 0.7) !important;
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f7f6;">
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; max-width: 600px; margin: 20px auto; color: #333; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            
            <div style="background: linear-gradient(135deg, #0b5edd 0%, #1e3a8a 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 1px;">Welcome to 7xcoder!</h1>
              <p style="color: #cbd5e1; margin-top: 10px; font-size: 16px; margin-bottom: 0;">Your Digital Marketing & Software Partner</p>
            </div>

            <div style="padding: 30px 40px;">
              ${innerContent}
              
              <div style="background-color: #f8fafc; padding: 20px 25px; border-left: 4px solid #0b5edd; margin: 25px 0; border-radius: 0 8px 8px 0;">
                <h3 style="margin-top: 0; color: #0f172a; font-size: 18px;">About 7xcoder</h3>
                <p style="margin-bottom: 0; color: #475569; line-height: 1.6; font-size: 15px;">
                  We are a premier software agency providing top-tier digital marketing, custom web and app development, branding, graphic design, and innovative creative services. Our core mission is to empower every digital move you make and drive scalable, measurable growth for your business.
                </p>
              </div>

              <div style="text-align: center; margin: 40px 0;">
                 <div class="animated-btn">
                   <a href="https://7xcoder.com/" style="display: inline-block; background: linear-gradient(45deg, #2563eb, #3b82f6); color: #ffffff; text-decoration: none; padding: 16px 40px; font-size: 16px; font-weight: bold; border-radius: 50px; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3); text-transform: uppercase; letter-spacing: 1.5px;">
                     Visit Our Website
                   </a>
                 </div>
              </div>

              <p style="font-size: 16px; color: #334155; line-height: 1.6;">You will now receive our latest <strong>Blog Posts</strong> featuring digital marketing insights, alongside exciting <strong>Career Opportunities</strong> as soon as they are published.</p>
              <p style="font-size: 16px; color: #334155;">Stay tuned for amazing content!</p>
              
              <br/>
              <p style="font-size: 16px; color: #334155;">Best Regards,<br/><strong style="color: #0b5edd;">The 7xcoder Team</strong></p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
              <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-bottom: 0;">
                If you change your mind, you can <a href="${unsubscribeUrl}" style="color: #0b5edd; text-decoration: none;">unsubscribe from this list</a> at any time.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    return transporter.sendMail(mailOptions).catch(err => {
      console.error(`❌ Failed to send bulk email to ${email}:`, err.message);
    });
  });

  await Promise.all(emailPromises);
  console.log(`✅ Bulk emails distributed concurrently to ${emails.length} recipients`);
};
