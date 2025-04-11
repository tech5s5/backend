import os
from dotenv import load_dotenv
from fastapi import FastAPI
from phi.model.groq import Groq
from phi.agent import Agent
from phi.tools.serpapi_tools import SerpApiTools
from phi.tools.wikipedia import WikipediaTools
from phi.tools.googlesearch import GoogleSearch


load_dotenv()

# Load keys
serper_key = os.getenv('SERPAPI_API_KEY')

app = FastAPI()



# 🧠 Create the agent
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

contract = """
CONTRACT AGREEMENT

This Contract is made on April 11, 2025, between:

Party A: John Doe, residing at 123 Main Street, Cityville  
AND  
Party B: Jane Smith, residing at 456 Oak Avenue, Townsville

1. Purpose:
Party A agrees to provide software development services to Party B for the purpose of creating a web application.

2. Duration:
This agreement is valid for a period of 6 months, starting from April 15, 2025.

3. Payment:
Party B agrees to pay Party A a total of $5000, payable in two equal installments.

4. Confidentiality:
Both parties agree to keep all project-related information confidential.

5. Termination:
Either party may terminate this contract with a written notice of 15 days.

Signed,  
__________________   __________________  
John Doe (Party A)   Jane Smith (Party B)
"""


# 🧪 Test
print(agent.run(contract))


# Optional FastAPI root route
# @app.get("/")
# def read_root():
#     return {"message": "AI Contract Simplifier is running!"}

# To run via: python main.py
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)
