import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from pydantic import BaseModel
from phi.model.groq import Groq
from phi.agent import Agent
from phi.tools.serpapi_tools import SerpApiTools
from phi.tools.wikipedia import WikipediaTools
from phi.tools.googlesearch import GoogleSearch


load_dotenv()
serper_key = os.getenv('SERPAPI_API_KEY')

app = FastAPI()


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
        "Your job is to simplify legal and contractual language in clear, easy-to-understand terms.",
        "Break down complex clauses into plain English, especially for non-legal users.",
        "If asked about a specific section or clause, find and explain it clearly.",
        "Keep your explanations friendly, accurate, and to the point.",
        "Do not change the legal meaning. Just simplify it.",
        "If you don’t find the answer in the PDF, use online tools (like Google or Wikipedia) to help.",
    ]
)


class ContractInput(BaseModel):
    contract: str


@app.post("/api/simplify")
async def simplify_contract(data: ContractInput):
    result = agent.run(data.contract)
    return {"simplified_contract": result}
