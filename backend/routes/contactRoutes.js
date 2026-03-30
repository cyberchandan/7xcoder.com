import express from 'express';
import nodemailer from 'nodemailer';
import Contact from '../models/Contact.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, businessName, mobile, service, message } = req.body;
    // Background Database Save
    const saveToDb = async () => {
      try {
        const newContact = new Contact({ name, email, businessName, mobile, service, message });
        await newContact.save();
        console.log('✅ Background: Lead saved to database');
      } catch (dbError) {
        console.error('⚠️ Background: Database save failed:', dbError.message);
      }
    };

    // Background Email Send
    const sendEmail = async () => {
      if (process.env.EMAIL_PASS && process.env.EMAIL_USER) {
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });

          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `New Lead: ${name} from ${businessName || 'Website'} - 7xcoder`,
            text: `
              New contact form submission!
              
              Name: ${name}
              Email: ${email}
              Business: ${businessName || 'N/A'}
              Mobile: ${mobile || 'N/A'}
              Service Interested: ${service}
              Message: ${message}
            `
          };

          await transporter.sendMail(mailOptions);
          console.log('✅ Background: Email notification sent');
        } catch (mailError) {
          console.error('❌ Background: Email failed:', mailError.message);
        }
      }
    };

    // Execute tasks concurrently and wait for them to finish before responding
    // This is required in Vercel because returning the res.json() freezes the serverless Node instance!
    await Promise.all([saveToDb(), sendEmail()]);

    res.status(200).json({ 
      success: true, 
      message: 'Message received! We will get back to you soon.' 
    });

  } catch (criticalError) {
    console.error('❌ Critical Error:', criticalError);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
