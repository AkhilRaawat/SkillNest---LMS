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

// Initialize Express
const app = express()
app.use(express.json());


// Connect to database
await connectDB()
await connectCloudinary()

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://skill-nest-lms.vercel.app' // Add your frontend URL here
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))
app.use(clerkMiddleware())

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

app.post('/clerk', express.json() , clerkWebhooks)
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)
app.use('/api/educator', express.json(), educatorRouter)
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', express.json(), userRouter)
app.use('/api/chatbot', express.json(), chatbotRouter)
app.use('/api/ai', aiRoutes);

if (!process.env.AI_SERVICE_URL) {
  console.warn('⚠️ AI_SERVICE_URL not set. Bobby chatbot may not work properly.')
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})