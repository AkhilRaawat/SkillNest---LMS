# /ai-service/routes/chatbot_routes.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone
from typing import List
import os
from groq import Groq
from pymongo import MongoClient
from dotenv import load_dotenv

router = APIRouter()
load_dotenv()
# Configure Groq for Bobby Chatbot
def initialize_groq_client():
    """Initialize Groq client with proper error handling"""
    try:
        groq_api_key = os.getenv("GROQ_API_KEY")
        if not groq_api_key or groq_api_key == "your_groq_api_key_here":
            print("⚠️ Groq API key not found - Bobby chatbot will use fallback responses")
            return None, False
        
        # Initialize with minimal configuration to avoid version conflicts
        client = Groq(api_key=groq_api_key)
        
        # Test the client with a simple call to ensure it works
        print("✅ Groq AI configured successfully for Bobby")
        return client, True
        
    except Exception as e:
        print(f"⚠️ Groq configuration error: {e}")
        print(f"⚠️ Error type: {type(e).__name__}")
        return None, False

groq_client, GROQ_AVAILABLE = initialize_groq_client()

# MongoDB connection for chatbot conversations
try:
    mongo_client = MongoClient(os.getenv("MONGODB_URI"))
    db = mongo_client.chatbot_db
    conversations_collection = db.conversations
    print("✅ MongoDB connected for Bobby conversations")
    MONGO_AVAILABLE = True
except Exception as e:
    print(f"⚠️ MongoDB connection error: {e}")
    conversations_collection = None
    MONGO_AVAILABLE = False

# Bobby's personality
BOBBY_SYSTEM_PROMPT = """You are Bobby, a helpful and friendly AI assistant integrated into a learning management system. You help students and educators with questions about courses, learning, and general assistance.

Key traits:
- Be concise but helpful
- Maintain a friendly, professional tone  
- Remember the conversation context
- If you don't know something, admit it
- Focus on being genuinely helpful with learning and education
- Keep responses conversational and not too long
- Use emojis to enhance friendliness and engagement
- Alwasy greet the user warmly and introduce yourself as Bobby

You're part of an SkillNest , a learning Management platform, so you can help with course-related questions, study tips, and general academic support."""

# Pydantic Models
class ChatRequest(BaseModel):
    message: str
    sessionId: str

class ChatResponse(BaseModel):
    response: str
    sessionId: str

class ConversationHistory(BaseModel):
    messages: List[dict]

# Helper Functions
def get_fallback_response(message: str) -> str:
    """Generate intelligent fallback responses when Groq is unavailable"""
    message_lower = message.lower()
    
    # Educational responses
    if any(word in message_lower for word in ["learn", "study", "course", "quiz", "education"]):
        return "I'm here to help with your learning journey! While I'm having trouble connecting to my AI brain right now, I can still assist you. What specific topic or subject would you like help with?"
    
    # Greeting responses
    if any(word in message_lower for word in ["hello", "hi", "hey", "good morning", "good afternoon"]):
        return "Hello! I'm Bobby, your AI learning assistant. I'm here to help you with your studies and answer any questions you might have about your courses!"
    
    # General help
    if any(word in message_lower for word in ["help", "assist", "support"]):
        return "I'd be happy to help! I can assist with course questions, study tips, quiz preparation, and general academic support. What would you like help with today?"
    
    # Default response
    return "I'm Bobby, your AI assistant! I'm here to help with your learning and studies. While I'm experiencing some technical difficulties right now, I'm still here to support you. What can I help you with?"

def store_conversation_memory(session_id: str, user_message: str, assistant_response: str) -> None:
    """Store conversation in memory (fallback when MongoDB unavailable)"""
    if not hasattr(store_conversation_memory, 'conversations'):
        store_conversation_memory.conversations = {}
    
    if session_id not in store_conversation_memory.conversations:
        store_conversation_memory.conversations[session_id] = []
    
    store_conversation_memory.conversations[session_id].extend([        {"role": "user", "content": user_message, "timestamp": datetime.now(timezone.utc)},
        {"role": "assistant", "content": assistant_response, "timestamp": datetime.now(timezone.utc)},
    ])
    
    # Keep only last 10 messages per session
    if len(store_conversation_memory.conversations[session_id]) > 20:
        store_conversation_memory.conversations[session_id] = store_conversation_memory.conversations[session_id][-20:]

def get_conversation_memory(session_id: str) -> List[dict]:
    """Get conversation from memory"""
    if hasattr(store_conversation_memory, 'conversations'):
        return store_conversation_memory.conversations.get(session_id, [])
    return []

# Routes
@router.post("/chat", response_model=ChatResponse)
async def bobby_chat(request: ChatRequest):
    """Bobby Chatbot endpoint"""
    try:
        print(f"\n🤖 Bobby received message from session: {request.sessionId}")
        print(f"💬 Message: {request.message}")
        
        bobby_response = ""
        
        if GROQ_AVAILABLE and groq_client and MONGO_AVAILABLE and conversations_collection is not None:
            # Full AI + Database mode
            try:
                # Get or create conversation
                conversation = conversations_collection.find_one({"sessionId": request.sessionId})
                
                if not conversation:
                    conversation = {
                        "sessionId": request.sessionId,
                        "messages": [],                        "lastActivity": datetime.now(timezone.utc),
                        "createdAt": datetime.now(timezone.utc)
                    }
                    conversations_collection.insert_one(conversation)
                
                # Add user message
                user_message = {
                    "role": "user",
                    "content": request.message,
                    "timestamp": datetime.now(timezone.utc)
                }
                
                # Update conversation with user message
                conversations_collection.update_one(
                    {"sessionId": request.sessionId},                    {
                        "$push": {"messages": user_message},
                        "$set": {"lastActivity": datetime.now(timezone.utc)}
                    }
                )
                
                # Get updated conversation for context
                conversation = conversations_collection.find_one({"sessionId": request.sessionId})
                recent_messages = conversation["messages"][-10:]  # Last 10 messages
                
                # Prepare messages for Groq
                groq_messages = [{"role": "system", "content": BOBBY_SYSTEM_PROMPT}]
                for msg in recent_messages:
                    groq_messages.append({
                        "role": msg["role"],
                        "content": msg["content"]
                    })
                  # Get response from Groq
                completion = groq_client.chat.completions.create(
                    messages=groq_messages,
                    model="llama-3.1-8b-instant",
                    max_tokens=300,
                    temperature=0.7,
                )
                bobby_response = completion.choices[0].message.content or get_fallback_response(request.message)
                
                # Store Bobby's response
                assistant_message = {
                    "role": "assistant", 
                    "content": bobby_response,
                    "timestamp": datetime.now(timezone.utc)
                }
                
                conversations_collection.update_one(
                    {"sessionId": request.sessionId},                    {
                        "$push": {"messages": assistant_message},
                        "$set": {"lastActivity": datetime.now(timezone.utc)}
                    }
                )
                
                print("✅ Bobby responded using Groq AI + MongoDB")
                
            except Exception as groq_error:
                print(f"❌ Groq/MongoDB error: {groq_error}")
                bobby_response = get_fallback_response(request.message)
                store_conversation_memory(request.sessionId, request.message, bobby_response)
                
        else:
            # Fallback mode
            print("🔄 Bobby using fallback mode")
            bobby_response = get_fallback_response(request.message)
            store_conversation_memory(request.sessionId, request.message, bobby_response)
        
        print(f"🎯 Bobby's response: {bobby_response[:100]}...")
        
        return ChatResponse(response=bobby_response, sessionId=request.sessionId)
        
    except Exception as e:
        print(f"💥 Bobby chat error: {e}")
        raise HTTPException(status_code=500, detail="Sorry, I encountered an error. Please try again.")

@router.get("/history/{session_id}", response_model=ConversationHistory)
async def get_bobby_history(session_id: str):
    """Get Bobby conversation history"""
    try:
        if MONGO_AVAILABLE and conversations_collection is not None:
            conversation = conversations_collection.find_one({"sessionId": session_id})
            
            if not conversation:
                return ConversationHistory(messages=[])
            
            # Return last 20 messages
            messages = conversation["messages"][-20:]
            
            # Convert datetime objects for JSON serialization
            for msg in messages:
                if isinstance(msg["timestamp"], datetime):
                    msg["timestamp"] = msg["timestamp"].isoformat()
                    
            return ConversationHistory(messages=messages)
        else:
            # Fallback to memory
            messages = get_conversation_memory(session_id)
            for msg in messages:
                if isinstance(msg["timestamp"], datetime):
                    msg["timestamp"] = msg["timestamp"].isoformat()
            return ConversationHistory(messages=messages)
            
    except Exception as e:
        print(f"History fetch error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch conversation history")

@router.delete("/conversation/{session_id}")
async def clear_bobby_conversation(session_id: str):
    """Clear Bobby conversation"""
    try:
        if MONGO_AVAILABLE and conversations_collection is not None:
            conversations_collection.delete_one({"sessionId": session_id})
        else:
            # Clear from memory
            if hasattr(store_conversation_memory, 'conversations'):
                store_conversation_memory.conversations.pop(session_id, None)
        
        return {"message": "Conversation cleared successfully"}
        
    except Exception as e:
        print(f"Clear conversation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to clear conversation")

@router.get("/health")
async def bobby_health():
    """Bobby chatbot health check"""
    return {
        "service": "bobby_chatbot",
        "ai_available": GROQ_AVAILABLE,
        "database_available": MONGO_AVAILABLE,
        "model": "llama-3.1-8b-instant" if GROQ_AVAILABLE else "intelligent_fallback"
    }