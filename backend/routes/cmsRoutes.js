import express from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import Blog from '../models/Blog.js';
import Career from '../models/Career.js';
import Subscriber from '../models/Subscriber.js';
import { sendWelcomeEmail, sendMassAlertEmail, sendGoodbyeEmail } from '../utils/emailService.js';

const router = express.Router();

// Middleware to protect routes
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

// Setup Multer for image uploads (Memory storage for Vercel serverless)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ---------------- BLOGS ---------------- 

router.get('/blogs', async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

router.post('/blogs', auth, upload.single('image'), async (req, res, next) => {
  try {
    const { title, description, date, comments } = req.body;
    let imageUrl = '';
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const mimeType = req.file.mimetype;
      imageUrl = `data:${mimeType};base64,${b64}`;
    }
    
    const blog = new Blog({ title, description, date, comments, imageUrl });
    await blog.save();

    // Trigger mass email asynchronously
    const activeSubs = await Subscriber.find({ isSubscribed: true });
    await sendMassAlertEmail(activeSubs, 'blog', { title, description });

    res.status(201).json(blog);
  } catch (error) {
    res.status(400);
    next(error);
  }
});

router.put('/blogs/:id', auth, upload.single('image'), async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const mimeType = req.file.mimetype;
      updateData.imageUrl = `data:${mimeType};base64,${b64}`;
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(blog);
  } catch (error) {
    res.status(400);
    next(error);
  }
});

router.delete('/blogs/:id', auth, async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
});

// ---------------- CAREERS ---------------- 

router.get('/careers', async (req, res, next) => {
  try {
    const careers = await Career.find().sort({ date: -1 });
    res.json(careers);
  } catch (error) {
    next(error);
  }
});

router.post('/careers', auth, upload.single('image'), async (req, res, next) => {
  try {
    const { title, description, date, location, requirements } = req.body;
    let imageUrl = '';
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const mimeType = req.file.mimetype;
      imageUrl = `data:${mimeType};base64,${b64}`;
    }
    
    const career = new Career({ title, description, date, location, requirements, imageUrl });
    await career.save();

    // Trigger mass email synchronously
    const activeSubs = await Subscriber.find({ isSubscribed: true });
    await sendMassAlertEmail(activeSubs, 'career', { title, description, location });

    res.status(201).json(career);
  } catch (error) {
    res.status(400);
    next(error);
  }
});

router.put('/careers/:id', auth, upload.single('image'), async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const mimeType = req.file.mimetype;
      updateData.imageUrl = `data:${mimeType};base64,${b64}`;
    }
    const career = await Career.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(career);
  } catch (error) {
    res.status(400);
    next(error);
  }
});

router.delete('/careers/:id', auth, async (req, res, next) => {
  try {
    await Career.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
});

// ---------------- SUBSCRIBERS ---------------- 

router.post('/subscribe', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400);
      throw new Error('Please provide an email');
    }

    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      if (!existingSubscriber.isSubscribed) {
        existingSubscriber.isSubscribed = true;
        await existingSubscriber.save();
        // Fire welcome email synchronously
        await sendWelcomeEmail(email);
        return res.status(200).json({ success: true, message: 'Welcome back! You have re-subscribed.' });
      }
      return res.status(400).json({ success: false, message: 'You are already subscribed to our newsletter.' });
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    
    // Fire welcome email synchronously
    await sendWelcomeEmail(email);
    
    res.status(201).json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    next(error);
  }
});

router.get('/subscribers', auth, async (req, res, next) => {
  try {
    const subscribers = await Subscriber.find({ isSubscribed: true }).sort({ date: -1 });
    res.json(subscribers);
  } catch (error) {
    next(error);
  }
});

// GET Unsubscribe endpoint without auth to allow users clicking from email
router.get('/unsubscribe/:token', async (req, res) => {
  try {
    const token = req.params.token;
    if (!token) {
      return res.status(400).send('<h1>Invalid Link</h1><p>Missing unsubscription token.</p>');
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, secret);
    
    if (decoded && decoded.email) {
      await Subscriber.findOneAndDelete({ email: decoded.email });
      
      // Fire goodbye email
      await sendGoodbyeEmail(decoded.email);

      return res.status(200).send(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; text-align: center; color: #333;">
          <h1 style="color: #666;">Unsubscribed Successfully</h1>
          <p>You have been completely removed from our active mailing list. You will no longer receive new blog or career alerts.</p>
          <p>We're sorry to see you go! A confirmation email has been dispatched to your inbox. If this was a mistake, you can re-subscribe on our website anytime.</p>
          <a href="https://7xcoder.com" style="display: inline-block; margin-top: 20px; background: #0b5edd; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Return to 7xcoder</a>
        </div>
      `);
    } else {
      throw new Error("Invalid token payload");
    }
  } catch (error) {
    console.error('Unsubscribe error:', error.message);
    res.status(400).send('<h1>Error</h1><p>The unsubscription link is invalid or has expired.</p>');
  }
});

export default router;
