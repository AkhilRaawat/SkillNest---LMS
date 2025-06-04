import mongoose from 'mongoose';

const videoTranscriptSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
    unique: true
  },
  courseId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  transcript: [{
    timestamp: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }],
  cloudinaryUrl: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient queries
videoTranscriptSchema.index({ videoId: 1 });
videoTranscriptSchema.index({ courseId: 1 });

const VideoTranscript = mongoose.model('VideoTranscript', videoTranscriptSchema);

export default VideoTranscript;