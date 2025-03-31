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
