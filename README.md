# 🎓 SkillNest LMS - Intelligent Learning Management System

<div align="center">

![SkillNest Banner](https://img.shields.io/badge/SkillNest-LMS-blue?style=for-the-badge&logo=graduation-cap)

**Empowering Education with AI-Driven Learning Solutions**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-success?style=for-the-badge)](https://skillnest-lms.tech)
[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://skill-nest-lms.vercel.app)
[![AI Service](https://img.shields.io/badge/AI_Service-Render-purple?style=for-the-badge&logo=render)](https://skillnest-ai-service.onrender.com)

</div>

---

## 🚀 **Project Overview**

SkillNest LMS is a cutting-edge Learning Management System that combines traditional educational tools with advanced AI capabilities. Built with a modern microservices architecture, it delivers personalized learning experiences through intelligent features like automated quiz generation, AI-powered chatbot assistance, and smart video content analysis.

### 🌟 **Key Highlights**

- 🤖 **AI-Powered Learning**: Integrated Bobby AI Chatbot for 24/7 student support
- 📝 **Smart Quiz Generation**: Automated quiz creation using Google Gemini
- 🎥 **Video Intelligence**: AI-driven video summarization and Q&A
- 📱 **Responsive Design**: Seamless experience across all devices
- 🔐 **Secure Authentication**: Clerk-powered user management
- ⚡ **Real-time Features**: Live updates and notifications
- 🏗️ **Microservices Architecture**: Scalable and maintainable codebase

---

## 🏛️ **System Architecture**

```mermaid
graph TB
    A[👨‍💻 Client - React.js] --> B[🌐 Server - Node.js/Express]
    B --> C[🧠 AI Service - FastAPI/Python]
    B --> D[💾 MongoDB Database]
    B --> E[☁️ Cloudinary Storage]
    B --> F[🔐 Clerk Authentication]
    B --> G[💳 Stripe Payments]
    C --> H[🤖 Google Gemini AI]
    C --> I[⚡ Groq AI]
```

### 📁 **Project Structure**

```
skillnest-lms/
├── 📱 client/          # React.js Frontend (Vercel)
├── 🖥️  server/          # Node.js Backend (Vercel)
└── 🧠 ai-service/      # Python AI Microservice (Render)
```

---

## 🛠️ **Technology Stack**

<div align="center">

### **Frontend**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

### **Backend**
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

### **AI Services**
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

### **Cloud & Deployment**
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

</div>

---

## ✨ **Features**

### 👨‍🎓 **For Students**
- 📚 **Course Enrollment**: Browse and enroll in courses seamlessly
- 🎥 **Video Player**: Enhanced learning with integrated video content
- 📊 **Progress Tracking**: Monitor learning progress and achievements
- 🤖 **Bobby AI Assistant**: Get instant help and answers to your questions
- 📝 **AI-Generated Quizzes**: Practice with intelligent assessments
- 📱 **Mobile Responsive**: Learn anywhere, anytime

### 👨‍🏫 **For Educators**
- 📋 **Course Management**: Create, edit, and organize courses effortlessly
- 👥 **Student Analytics**: Track enrollment and student progress
- 📊 **Dashboard**: Comprehensive overview of teaching activities
- 🎯 **Content Creation**: Rich text editor with multimedia support
- 📈 **Performance Insights**: Analyze student engagement and success

### 🤖 **AI-Powered Features**
- **Bobby Chatbot**: Intelligent conversational AI for student support
- **Quiz Generator**: Auto-create quizzes from course content using Gemini AI
- **Video AI**: Summarize videos and answer questions about content
- **Smart Recommendations**: Personalized learning path suggestions

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ and npm/yarn
- Python 3.8+ and pip
- MongoDB database
- API keys for Clerk, Cloudinary, Stripe, Google Gemini, and Groq

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/skillnest-lms.git
cd skillnest-lms
```

### **2. Frontend Setup**
```bash
cd client
npm install
cp .env.example .env.local
# Add your environment variables
npm run dev
```

### **3. Backend Setup**
```bash
cd server
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### **4. AI Service Setup**
```bash
cd ai-service
pip install -r requirements.txt
cp .env.example .env
# Add your AI API keys
python main.py
```

---

## 🌐 **Environment Variables**

### **Client (.env.local)**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_BACKEND_URL=your_backend_url
VITE_AI_SERVICE_URL=your_ai_service_url
```

### **Server (.env)**
```env
MONGODB_URI=your_mongodb_connection
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
STRIPE_SECRET_KEY=your_stripe_secret
AI_SERVICE_URL=your_ai_service_url
```

### **AI Service (.env)**
```env
GOOGLE_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
MONGODB_URI=your_mongodb_connection
```

---

## 📋 **API Endpoints**

### **Core APIs**
- `GET /api/health` - System health check
- `POST /api/user/*` - User management
- `POST /api/course/*` - Course operations
- `POST /api/educator/*` - Educator dashboard

### **AI Services**
- `POST /api/ai/generate-quiz` - Generate AI quizzes
- `POST /api/chatbot/chat` - Bobby AI conversations
- `POST /api/video-ai/summarize` - Video content summarization
- `POST /api/video-ai/ask-question` - Video Q&A

---

## 🎯 **Roadmap & Future Enhancements**

- [ ] 🧠 **Advanced AI Analytics** - Learning pattern analysis
- [ ] 🌍 **Multi-language Support** - Global accessibility
- [ ] 📊 **Advanced Reporting** - Detailed performance metrics
- [ ] 🎮 **Gamification** - Points, badges, and leaderboards
- [ ] 📱 **Mobile App** - Native iOS and Android apps
- [ ] 🔌 **Plugin System** - Extensible third-party integrations

---

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---


**Built with ❤️ by the SkillNest Team**

[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=for-the-badge&logo=github)](https://github.com/AkhilRaawat)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/akhil-rawat)

</div>

---

## 📞 **Support**

Need help? We're here for you!

- 📧 **Email**: akhilrawat155@gmail.com
- 🐛 **Bug Reports**: [Create an issue](https://github.com/yourusername/skillnest-lms/issues)

---

<div align="center">

### ⭐ **Star this repo if you found it helpful!**

[![Stars](https://img.shields.io/github/stars/yourusername/skillnest-lms?style=social)](https://github.com/AkhilRaawat/skillnest-lms/stargazers)
[![Forks](https://img.shields.io/github/forks/yourusername/skillnest-lms?style=social)](https://github.com/AkhilRaawat/skillnest-lms/network/members)

**Made with 💻 and ☕ | © 2025 SkillNest LMS**

</div>
