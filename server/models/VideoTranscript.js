import mongoose from 'mongoose';

const transcriptSegmentSchema = new mongoose.Schema({
  timestamp: {
    type: String,
    required: false
  },
  text: {
    type: String,
    required: true
  },
  speaker: {
    type: String,
    required: false
  }
}, { _id: false });

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
  transcript: [transcriptSegmentSchema],
  cloudinaryUrl: {
    type: String,
    required: false
  },
  duration: {
    type: String,
    required: false
  },
  uploadedBy: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
videoTranscriptSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const VideoTranscript = mongoose.model('VideoTranscript', videoTranscriptSchema);

export default VideoTranscript;