# portfolio-generator-using-AI

Building an AI-powered portfolio generator with chatbots requires a full-stack approach, incorporating both frontend and backend technologies. Here’s a basic breakdown:

Tech Stack
	•	Frontend: React (Next.js) + TailwindCSS
	•	Backend: Node.js (Express) + MongoDB
	•	AI: OpenAI API (for chatbot and content generation)
	•	Hosting: Vercel (Frontend) + Render/Fly.io (Backend)


 1. Backend (Node.js + Express)

This backend handles user input, AI interactions, and database storage.

Install Dependencies
npm init -y
npm install express cors dotenv openai mongoose


server.js (Main Server File)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const PortfolioSchema = new mongoose.Schema({
  name: String,
  description: String,
  projects: [String],
  skills: [String]
});
const Portfolio = mongoose.model('Portfolio', PortfolioSchema);

// OpenAI Configuration
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

// Generate Portfolio using AI
app.post('/generate', async (req, res) => {
  try {
    const { name, skills, projects } = req.body;

    const prompt = `Create a portfolio for ${name}, a developer skilled in ${skills.join(', ')}. The portfolio should highlight ${projects.join(', ')}.`;
    const response = await openai.createCompletion({ model: 'gpt-4', prompt, max_tokens: 300 });

    const newPortfolio = new Portfolio({ name, description: response.data.choices[0].text, skills, projects });
    await newPortfolio.save();

    res.json({ success: true, portfolio: newPortfolio });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));



2. Frontend (React + Next.js)

Install Dependencies
npx create-next-app portfolio-gen
cd portfolio-gen
npm install axios tailwindcss
npx tailwindcss init -p

Update tailwind.config.js
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}

pages/index.js (Chatbot Interface)
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [name, setName] = useState('');
  const [skills, setSkills] = useState('');
  const [projects, setProjects] = useState('');
  const [portfolio, setPortfolio] = useState(null);

  const generatePortfolio = async () => {
    const response = await axios.post('http://localhost:5000/generate', {
      name, skills: skills.split(','), projects: projects.split(',')
    });
    setPortfolio(response.data.portfolio);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">AI Portfolio Generator</h1>
      <input className="p-2 border mb-2" placeholder="Your Name" onChange={e => setName(e.target.value)} />
      <input className="p-2 border mb-2" placeholder="Skills (comma-separated)" onChange={e => setSkills(e.target.value)} />
      <input className="p-2 border mb-2" placeholder="Projects (comma-separated)" onChange={e => setProjects(e.target.value)} />
      <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={generatePortfolio}>Generate Portfolio</button>

      {portfolio && (
        <div className="mt-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold">{portfolio.name}</h2>
          <p>{portfolio.description}</p>
          <h3 className="mt-2 font-bold">Skills:</h3>
          <ul>{portfolio.skills.map((s, i) => <li key={i}>{s}</li>)}</ul>
          <h3 className="mt-2 font-bold">Projects:</h3>
          <ul>{portfolio.projects.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </div>
      )}
    </div>
  );
}


3. Running the Project
   •Backend:
   node server.js


   	•	Frontend:
    npm run dev

   Next Steps
	•	Enhance AI responses: Use GPT-4 for better portfolio text.
	•	Add authentication: Use Firebase or NextAuth for user logins.
	•	Deploy: Host frontend on Vercel and backend on Render.
	•	Custom styling: Use Framer Motion for animations.
   
