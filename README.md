# 🧠 AI Contract Simplifier

An **AI-powered Contract Simplifier** built using **FastAPI** (Python) and **React.js**, designed to transform complex legal contracts into simple, plain English summaries for easy understanding.

---

## ✨ Features

- 🔍 AI understands and simplifies legal jargon
- 📝 Returns clean, structured summaries organized by sections
- 🚀 Built with FastAPI backend and React frontend
- 💡 Designed for professionals and individuals with no legal background

---

## 🧠 How It Works

1. **Input Contract Text**: User uploads or pastes raw legal contract
2. **AI Processing**: FastAPI + [phi](https://github.com/fern-ai/phi) agent analyzes and summarizes the text
3. **Structured Output**: Result is returned section-wise (e.g., Parties, Terms, Clauses) with bullet points
4. **Frontend Display**: React displays the simplified contract cleanly with section labels

---

## 🛠️ Tech Stack

| Layer       | Technology     |
|------------|----------------|
| Backend     | Python, FastAPI, [phi](https://github.com/fern-ai/phi), Groq, SerpAPI |
| Frontend    | React.js (Vite), Tailwind CSS |
| Deployment  | Render / Railway / Fly.io (optional) |
| Tools       | dotenv, CORS, Axios, Markdown-to-JSON |

---
