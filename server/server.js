import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import connectCloudinary from './configs/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import courseRouter from './routes/courseRoute.js'
import aiRoutes from './routes/aiRoutes.js'
import chatbotRouter from './routes/chatbotRoutes.js'
import { chatbotRateLimit, validateChatRequest, logChatbotRequest, handleChatbotError } from './middlewares/chatbotMiddleware.js'
import videoAiRouter from './routes/videoAiRoutes.js'

// Initialize Express
const app = express()

// Connect to database
await connectDB()
await connectCloudinary()

// CORS Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://skill-nest-lms.vercel.app',
    "https://skillnest-lms.tech", 
    'https://www.skillnest-lms.tech'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

// Clerk middleware
app.use((req, res, next) => {
  // Skip clerk middleware for webhook endpoints that need raw body
  if (req.path === '/stripe') {
    return next();
  }
  return clerkMiddleware()(req, res, next);
});

// Routes that need raw body (BEFORE express.json())
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

// JSON middleware for all other routes
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send("API Working"))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'LMS API is running successfully',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      ai_service: process.env.AI_SERVICE_URL ? 'configured' : 'not_configured',
      chatbot: 'available'
    }
  })
})

// Other routes (these will use express.json() automatically)
app.post('/clerk', clerkWebhooks)
app.use('/api/educator', educatorRouter)
app.use('/api/course', courseRouter)
app.use('/api/user', userRouter)
app.use('/api/chatbot', chatbotRouter)
app.use('/api/ai', aiRoutes);
app.use('/api/video-ai', videoAiRouter)

if (!process.env.AI_SERVICE_URL) {
  console.warn('⚠️ AI_SERVICE_URL not set. Bobby chatbot may not work properly.')
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`🎥 Video AI endpoints available at /api/video-ai/*`);
})