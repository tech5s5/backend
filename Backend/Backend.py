import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from phi.model.groq import Groq
from phi.agent import Agent
from phi.tools.serpapi_tools import SerpApiTools
from phi.tools.wikipedia import WikipediaTools
from phi.tools.googlesearch import GoogleSearch

# Load environment variables
load_dotenv()
serper_key = os.getenv('SERPAPI_API_KEY')

# Initialize FastAPI app
app = FastAPI()

# ✅ Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow requests from React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create the agent
agent = Agent(
    model=Groq(id="llama-3.3-70b-versatile"),
    tools=[
        SerpApiTools(api_key=serper_key),
        WikipediaTools(),
        GoogleSearch()
    ],
    markdown=True,
   instructions=[
    "You are an AI Contract Simplifier.",
    "Your response will be shown in a user interface, so keep it very clean and structured.",
    "Start the output with this plain title: Simplified Contract Summary",
    "Organize content into sections: Parties Involved, Agreement Details, Important Clauses, Key Takeaways",
    "Each section should have a label on its own line — no heading symbols or markdown formatting",
    "Use a dash (-) for each bullet point",
    "Do not use bold text, asterisks, hashtags, or emojis in the text",
    "Use simple words and avoid long paragraphs — each detail must be its own bullet point",
    "Add a short icon (like 📄, 📝, 💰, ⚖️) above each section name for visual guidance — one per line",
    "Make sure the meaning of legal terms is preserved but expressed in a way that a non-legal person can understand easily",
    "Ensure everything looks clean, is easy to scan quickly, and works well on a mobile or web UI"
]

)

# Input schema
class ContractInput(BaseModel):
    contract: str

# API endpoint      
@app.post("/api/simplify")
async def simplify_contract(data: ContractInput):
    result = agent.run(data.contract)
    return {"simplified_contract": result}
