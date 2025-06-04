import VideoTranscript from '../models/VideoTranscript.js';
import VideoSummary from '../models/VideoSummary.js';
import VideoQA from '../models/VideoQA.js';
import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'https://skillnest-ai-service.onrender.com';

// Seed function to manually add transcripts (for showcase)
const seedTranscripts = async () => {
  const sampleTranscripts = [
    {
      videoId: 'react-hooks-intro',
      courseId: 'react-course-001',
      title: 'Introduction to React Hooks',
      transcript: [
        { timestamp: '00:00', text: 'Welcome to this comprehensive React hooks tutorial. Today we\'ll learn about useState and useEffect.' },
        { timestamp: '00:30', text: 'React hooks were introduced in React 16.8 and completely revolutionized how we write components.' },
        { timestamp: '01:00', text: 'useState is the most fundamental hook for managing component state in functional components.' },
        { timestamp: '01:30', text: 'useState returns an array with two elements: the current state value and a setter function.' },
        { timestamp: '02:00', text: 'useEffect handles side effects like API calls, subscriptions, and DOM manipulation.' },
        { timestamp: '02:30', text: 'useEffect can run after every render, or you can control when it runs with dependency arrays.' },
        { timestamp: '03:00', text: 'Custom hooks allow you to extract component logic into reusable functions that can be shared.' }
      ],
      cloudinaryUrl: 'https://res.cloudinary.com/demo/video/react-hooks.mp4',
      duration: '15:30'
    },
    {
      videoId: 'python-data-structures',
      courseId: 'python-course-001', 
      title: 'Python Data Structures Explained',
      transcript: [
        { timestamp: '00:00', text: 'Today we\'ll explore Python\'s built-in data structures: lists, dictionaries, sets, and tuples.' },
        { timestamp: '00:30', text: 'Lists are ordered, mutable collections that can store duplicate items and different data types.' },
        { timestamp: '01:00', text: 'You can access list elements using indexing, like my_list[0] for the first element.' },
        { timestamp: '01:30', text: 'Dictionaries store key-value pairs and provide O(1) average lookup time complexity.' },
        { timestamp: '02:00', text: 'Sets are unordered collections of unique elements, perfect for removing duplicates from data.' },
        { timestamp: '02:30', text: 'Tuples are immutable sequences, often used for coordinates or database records.' },
        { timestamp: '03:00', text: 'You can convert between these data structures using built-in functions like list(), dict(), and set().' }
      ],
      cloudinaryUrl: 'https://res.cloudinary.com/demo/video/python-data.mp4',
      duration: '12:45'
    },
    {
      videoId: 'javascript-async-await',
      courseId: 'javascript-course-001',
      title: 'JavaScript Async/Await and Promises',
      transcript: [
        { timestamp: '00:00', text: 'Understanding asynchronous JavaScript is crucial for modern web development.' },
        { timestamp: '00:30', text: 'Promises represent future values and help us handle asynchronous operations cleanly.' },
        { timestamp: '01:00', text: 'A promise can be in one of three states: pending, fulfilled, or rejected.' },
        { timestamp: '01:30', text: 'Async/await is syntactic sugar that makes working with promises much more readable.' },
        { timestamp: '02:00', text: 'Always use try-catch blocks with async/await for proper error handling.' },
        { timestamp: '02:30', text: 'You can use Promise.all() to run multiple asynchronous operations concurrently.' },
        { timestamp: '03:00', text: 'Avoid callback hell by embracing promises and async/await patterns.' }
      ],
      cloudinaryUrl: 'https://res.cloudinary.com/demo/video/js-async.mp4',
      duration: '18:20'
    }
  ];

  for (const transcriptData of sampleTranscripts) {
    const exists = await VideoTranscript.findOne({ videoId: transcriptData.videoId });
    if (!exists) {
      await VideoTranscript.create(transcriptData);
      console.log(`✅ Seeded transcript: ${transcriptData.title}`);
    }
  }
};

// Initialize sample transcripts for showcase
export const initializeShowcaseData = async (req, res) => {
  try {
    await seedTranscripts();
    
    const transcriptCount = await VideoTranscript.countDocuments();
    
    res.json({
      success: true,
      message: 'Showcase data initialized successfully',
      transcripts_available: transcriptCount
    });
  } catch (error) {
    console.error('Error initializing showcase data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize showcase data',
      error: error.message
    });
  }
};

// Get all available videos for showcase
export const getAvailableVideos = async (req, res) => {
  try {
    const videos = await VideoTranscript.find({}, {
      videoId: 1,
      courseId: 1,
      title: 1,
      duration: 1,
      cloudinaryUrl: 1,
      createdAt: 1
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: videos,
      count: videos.length
    });

  } catch (error) {
    console.error('Error fetching available videos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available videos',
      error: error.message
    });
  }
};

// Generate or retrieve video summary
export const getVideoSummary = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.auth?.userId || 'anonymous';
    
    // Check if summary exists in cache
    let summary = await VideoSummary.findOne({ videoId, userId });
    
    if (!summary) {
      // Get transcript first
      const transcript = await VideoTranscript.findOne({ videoId });
      if (!transcript) {
        return res.status(404).json({
          success: false,
          message: 'Transcript not found for this video'
        });
      }

      // Call AI service for summarization
      const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/video-ai/summarize`, {
        video_id: videoId,
        transcript: transcript.transcript,
        summary_type: 'detailed'
      });

      if (!aiResponse.data || !aiResponse.data.summary) {
        throw new Error('Invalid response from AI service');
      }

      // Cache the summary
      summary = await VideoSummary.create({
        videoId,
        userId,
        courseId: transcript.courseId,
        summary: aiResponse.data.summary,
        keyPoints: aiResponse.data.key_points || [],
        summaryType: 'detailed',
        aiPowered: true
      });
    }

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Error in getVideoSummary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate/retrieve video summary',
      error: error.message
    });
  }
};

// Ask questions about the video
export const askQuestion = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { question } = req.body;
    const userId = req.auth?.userId || 'anonymous';

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: 'Video ID is required'
      });
    }

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    // Check if similar question exists
    const existingQA = await VideoQA.findOne({
      videoId,
      question: {
        $regex: question,
        $options: 'i'
      }
    });

    if (existingQA) {
      return res.json({
        success: true,
        data: existingQA,
        source: 'cache'
      });
    }

    // Get transcript
    const transcript = await VideoTranscript.findOne({ videoId });
    if (!transcript) {
      return res.status(404).json({
        success: false,
        message: 'Transcript not found for this video'
      });
    }

    // Call AI service for answer
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/video-ai/ask-question`, {
      video_id: videoId,
      transcript: transcript.transcript,
      question
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.AI_SERVICE_KEY}`
      }
    });

    // Cache the Q&A
    const qa = await VideoQA.create({
      videoId,
      userId,
      courseId: transcript.courseId,
      question,
      answer: aiResponse.data.answer,
      relevantTimestamps: aiResponse.data.timestamps || [],
      confidence: aiResponse.data.confidence || 'medium',
      aiPowered: true
    });

    res.json({
      success: true,
      data: qa,
      source: 'ai'
    });

  } catch (error) {
    console.error('Error in askQuestion:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process question',
      error: error.message
    });
  }
};

// Get user's question history for a video
export const getQuestionHistory = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user?.id || 'anonymous';

    const questions = await VideoQA.find({ videoId, userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: questions
    });

  } catch (error) {
    console.error('Error fetching question history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch question history',
      error: error.message
    });
  }
};

// Get user's summaries for a video
export const getUserSummaries = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user?.id || 'anonymous';

    const summaries = await VideoSummary.find({ videoId, userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: summaries
    });

  } catch (error) {
    console.error('Error fetching summaries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch summaries',
      error: error.message
    });
  }
};

// Health check for video AI integration
export const healthCheck = async (req, res) => {
  try {
    // Test AI service connection
    const aiResponse = await fetch(`${AI_SERVICE_URL}/api/video-ai/health`, {
      method: 'GET',
      timeout: 10000
    });

    const aiHealthy = aiResponse.ok;
    const transcriptCount = await VideoTranscript.countDocuments();
    
    res.json({
      success: true,
      status: 'healthy',
      services: {
        database: 'connected',
        ai_service: aiHealthy ? 'connected' : 'disconnected',
        ai_service_url: AI_SERVICE_URL
      },
      showcase_data: {
        transcripts_available: transcriptCount,
        ready_for_demo: transcriptCount > 0
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      services: {
        database: 'connected',
        ai_service: 'disconnected',
        ai_service_url: AI_SERVICE_URL
      },
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Upload a new video transcript
export const uploadTranscript = async (req, res) => {
  try {
    const { videoId, courseId, title, transcript, cloudinaryUrl, duration } = req.body;

    // Validate required fields
    if (!videoId || !courseId || !title || !transcript || !cloudinaryUrl || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields. Please provide videoId, courseId, title, transcript, cloudinaryUrl, and duration.'
      });
    }

    // Validate transcript format
    if (!Array.isArray(transcript) || transcript.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Transcript must be a non-empty array of segments with timestamp and text.'
      });
    }

    // Check if transcript already exists
    const existingTranscript = await VideoTranscript.findOne({ videoId });
    if (existingTranscript) {
      return res.status(409).json({
        success: false,
        message: 'A transcript for this video already exists.',
        transcriptId: existingTranscript._id
      });
    }

    // Create new transcript
    const newTranscript = await VideoTranscript.create({
      videoId,
      courseId,
      title,
      transcript,
      cloudinaryUrl,
      duration
    });

    console.log(`✅ Uploaded transcript: ${title}`);

    res.status(201).json({
      success: true,
      message: 'Transcript uploaded successfully',
      data: newTranscript
    });

  } catch (error) {
    console.error('Error uploading transcript:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload transcript',
      error: error.message
    });
  }
};