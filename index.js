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
