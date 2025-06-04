from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import quiz_routes

app = FastAPI(title="SkillNest AI Service")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(quiz_routes.router, prefix="/api/ai", tags=["AI"])

@app.get("/")
async def root():
    return {"message": "Welcome to SkillNest AI Service"} 