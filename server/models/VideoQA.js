import mongoose from 'mongoose';

const videoQASchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  relevantTimestamps: [{
    type: String
  }],
  confidence: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  aiPowered: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
videoQASchema.index({ videoId: 1, userId: 1 });
videoQASchema.index({ courseId: 1, userId: 1 });

const VideoQA = mongoose.model('VideoQA', videoQASchema);

export default VideoQA;