import mongoose from 'mongoose';

const liveProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  githubLink: {
    type: String,
    default: '',
  },
  liveLink: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('LiveProject', liveProjectSchema);
