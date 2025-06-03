import mongoose from 'mongoose';

const videoSummarySchema = new mongoose.Schema({
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
  summaryType: {
    type: String,
    enum: ['detailed', 'brief', 'key_points'],
    default: 'detailed'
  },
  summary: {
    type: String,
    required: true
  },
  keyPoints: [{
    type: String
  }],
  aiPowered: {
    type: Boolean,
    default: false
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
videoSummarySchema.index({ videoId: 1, userId: 1, summaryType: 1 });

const VideoSummary = mongoose.model('VideoSummary', videoSummarySchema);

export default VideoSummary;